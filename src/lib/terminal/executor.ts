import { CommandAST, tokenize, parse, expandVariables } from "./parser"
import { CommandContext, CommandIO, TerminalOutputNode } from "./types"
import { getCommand } from "./registry"
import { normalizePath, resolveNode, FileSystemError } from "./fs"

export class Executor {
  constructor(private io: CommandIO, private ctx: CommandContext) {}

  public async executeLine(line: string): Promise<number> {
    const historyExp = this.expandHistory(line)
    const tokens = tokenize(historyExp)
    const ast = parse(tokens)
    
    if (!ast) return 0
    return this.executeAST(ast, "")
  }

  private expandHistory(line: string): string {
    if (line.includes("!!")) {
      const last = this.ctx.history[this.ctx.history.length - 1] || ""
      return line.replace(/!!/g, last)
    }
    // simple !n
    return line.replace(/!(\d+)/g, (match, n) => {
      const idx = parseInt(n, 10)
      if (idx > 0 && idx <= this.ctx.history.length) {
        return this.ctx.history[idx - 1]
      }
      return match
    })
  }

  private expandGlobs(args: string[]): string[] {
    const result: string[] = []
    for (const arg of args) {
      if (arg.includes("*") || arg.includes("?")) {
        // very basic glob for current dir
        try {
          const dirNode = resolveNode(this.ctx.fs, this.ctx.cwd, this.ctx.cwd)
          if (dirNode.children) {
            const regexStr = "^" + arg.replace(/\./g, "\\.").replace(/\*/g, ".*").replace(/\?/g, ".") + "$"
            const regex = new RegExp(regexStr)
            const matches = Object.keys(dirNode.children).filter(name => regex.test(name))
            if (matches.length > 0) {
              result.push(...matches)
              continue
            }
          }
        } catch (e) {
          // fallback to arg
        }
      }
      result.push(arg)
    }
    return result
  }

  private async executeAST(ast: CommandAST, stdin: string): Promise<number> {
    let args = ast.args.map(a => expandVariables(a, this.ctx.env))
    args = this.expandGlobs(args)

    const cmdName = args[0]
    if (!cmdName) return 0

    let stdout = ""
    let stderr = ""

    const bufferedIO: CommandIO = {
      ...this.io,
      write: (text) => {
        if (typeof text === "string") stdout += text + "\n"
        else this.io.write(text) // Complex nodes go straight to output (won't pipe well, but fine for UI)
      },
      writeError: (text) => {
        stderr += text + "\n"
      }
    }

    const command = getCommand(cmdName)
    let exitCode = 0

    if (command) {
      if (stdin) args.push(stdin) // naive pipe implementation: pass stdin as last arg for filters, or we could handle it via IO. For bash realism, we should pass it properly. Actually, let's just expose stdin via the IO object if we can, or just pass it as the last argument for filters. Let's pass it via a special arg or property.
      // Better: add stdin to CommandContext
      const runCtx = { ...this.ctx, stdin }
      
      try {
        exitCode = await command.run(runCtx, args, bufferedIO)
      } catch (e: any) {
        bufferedIO.writeError(`bash: ${cmdName}: ${e.message}`)
        exitCode = 1
      }
    } else {
      bufferedIO.writeError(`bash: ${cmdName}: command not found`)
      
      // Fuzzy suggest: find commands with small edit distance or substring match
      const allCmds = await import("./registry").then(m => m.getAllCommands())
      const allNames: string[] = []
      for (const cmd of allCmds) {
        allNames.push(cmd.name)
        if (cmd.aliases) allNames.push(...cmd.aliases)
      }
      
      const suggestions = allNames.filter(name => {
        // Substring match
        if (name.includes(cmdName) || cmdName.includes(name)) return true
        // Levenshtein distance <= 2
        if (levenshtein(cmdName, name) <= 2) return true
        return false
      }).slice(0, 3)
      
      if (suggestions.length > 0) {
        bufferedIO.writeError(`\nDid you mean: ${suggestions.join(", ")}?`)
      }
      bufferedIO.writeError(`\nType 'help' to see all available commands.`)
      this.io.dispatchMascot({ state: "confused", message: "That's not a command..." })
      exitCode = 127
    }

    if (ast.next) {
      if (ast.next.op === "pipe") {
        return this.executeAST(ast.next.cmd, stdout.trimEnd())
      } else if (ast.next.op === "and" && exitCode === 0) {
        if (stdout) this.io.write(stdout.trimEnd())
        if (stderr) this.io.writeError(stderr.trimEnd())
        return this.executeAST(ast.next.cmd, "")
      } else if (ast.next.op === "or" && exitCode !== 0) {
        if (stdout) this.io.write(stdout.trimEnd())
        if (stderr) this.io.writeError(stderr.trimEnd())
        return this.executeAST(ast.next.cmd, "")
      } else if (ast.next.op === "semi") {
        if (stdout) this.io.write(stdout.trimEnd())
        if (stderr) this.io.writeError(stderr.trimEnd())
        return this.executeAST(ast.next.cmd, "")
      }
    }

    if (ast.redirect) {
      try {
        const { resolveParentAndName, createNode } = await import("./fs")
        const { parent, name } = resolveParentAndName(this.ctx.fs, ast.redirect.file, this.ctx.cwd)
        if (!parent.children) throw new Error("Parent is not a directory")
        
        let node = parent.children[name]
        if (!node) {
          node = createNode(name, "file")
          parent.children[name] = node
        } else if (node.readOnly) {
          throw new Error("Permission denied (read-only file system)")
        } else if (node.type === "dir") {
          throw new Error("Is a directory")
        }

        if (ast.redirect.append) {
          node.content = (node.content || "") + stdout
        } else {
          node.content = stdout
        }
      } catch(e: any) {
        this.io.writeError(`bash: ${ast.redirect.file}: ${e.message}`)
      }
      
      if (stderr) this.io.writeError(stderr.trimEnd())
      return exitCode
    }

    // End of chain
    if (stdout) this.io.write(stdout.trimEnd())
    if (stderr) this.io.writeError(stderr.trimEnd())

    return exitCode
  }
}

/** Minimal Levenshtein edit-distance for fuzzy command matching */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}
