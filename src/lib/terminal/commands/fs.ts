import { CommandDefinition } from "../types"
import { resolveNode, resolveParentAndName, createNode, FileSystemError, normalizePath } from "../fs"

export const lsCmd: CommandDefinition = {
  name: "ls",
  description: "List directory contents",
  usage: "ls [-a] [-l] [dir]",
  run: (ctx, args, io) => {
    let target = args[1] && !args[1].startsWith("-") ? args[1] : "."
    const isLong = args.some(a => a.startsWith("-") && a.includes("l"))
    const isAll = args.some(a => a.startsWith("-") && a.includes("a"))

    const node = resolveNode(ctx.fs, target, ctx.cwd)
    if (node.type !== "dir" || !node.children) {
      io.write(node.name)
      return 0
    }

    let entries = Object.values(node.children)
    if (!isAll) {
      entries = entries.filter(e => !e.name.startsWith("."))
    }

    if (isLong) {
      const output = entries.map(e => {
        let color = "text-foreground"
        if (e.type === "dir") color = "text-blue-400 font-semibold"
        if (e.type === "exec") color = "text-green-400 font-semibold"
        
        return [
          { type: "text", content: e.permissions },
          { type: "text", content: "1" },
          { type: "text", content: "shalin" },
          { type: "text", content: "staff" },
          { type: "text", content: (e.type === "dir" ? 4096 : Math.floor(e.name.length * 42)).toString().padStart(6, " ") },
          { type: "text", content: "Oct 1 10:24" },
          { type: "color", color, content: e.name + (e.type === "dir" ? "/" : "") }
        ]
      })
      io.write({
        type: "table",
        content: [[{ type: "text", content: `total ${entries.length * 4}` }]] as any
      })
      io.write({
        type: "table",
        content: output as any
      })
    } else {
      const nodes = entries.map(e => {
        let color = "text-foreground"
        if (e.type === "dir") color = "text-blue-400 font-semibold"
        if (e.type === "exec") color = "text-green-400 font-semibold"
        return {
          type: "color",
          color,
          content: e.name + (e.type === "dir" ? "/" : (e.type === "exec" ? "*" : ""))
        }
      })
      
      io.write(nodes as any)
    }
    return 0
  }
}

export const catCmd: CommandDefinition = {
  name: "cat",
  description: "Concatenate files and print on the standard output",
  usage: "cat [file]",
  run: (ctx, args, io) => {
    if (args.length < 2) {
      io.writeError("cat: missing file operand")
      return 1
    }
    for (let i = 1; i < args.length; i++) {
      const node = resolveNode(ctx.fs, args[i], ctx.cwd)
      if (node.type === "dir") {
        io.writeError(`cat: ${args[i]}: Is a directory`)
        return 1
      }
      if (node.name.endsWith(".pdf")) {
        io.writeError(`cat: ${args[i]}: cannot display binary file in stdout`)
        continue
      }
      
      io.write(node.content || "")
      if (node.linkedSection) {
        io.write(`[ Executing payload for ${node.name}... ]`)
        io.scrollTo(node.linkedSection)
      }
    }
    return 0
  }
}

export const cdCmd: CommandDefinition = {
  name: "cd",
  description: "Change the shell working directory",
  usage: "cd [dir]",
  run: (ctx, args, io) => {
    const target = args[1] || "~"
    try {
      const node = resolveNode(ctx.fs, target, ctx.cwd)
      if (node.type !== "dir") {
        io.writeError(`bash: cd: ${target}: Not a directory\nhint: use 'cat ${target}' to read it`)
        return 1
      }
      const normalized = normalizePath(target, ctx.cwd)
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("term-cwd-change", { detail: normalized }))
      }
      
      if (node.linkedSection) {
        io.scrollTo(node.linkedSection)
      }
    } catch (e: any) {
      io.writeError(`bash: cd: ${target}: No such file or directory`)
      return 1
    }
    return 0
  }
}

export const rmCmd: CommandDefinition = {
  name: "rm",
  description: "Remove files or directories",
  usage: "rm [-r] [file]",
  run: (ctx, args, io) => {
    if (args.length < 2) {
      io.writeError("rm: missing operand")
      return 1
    }
    
    let target = args[1]
    const recursive = target === "-r" || target === "-rf"
    if (recursive) target = args[2]

    if (!target) {
      io.writeError("rm: missing operand")
      return 1
    }

    const { parent, name } = resolveParentAndName(ctx.fs, target, ctx.cwd)
    if (!parent.children?.[name]) {
      io.writeError(`rm: cannot remove '${target}': No such file or directory`)
      return 1
    }
    
    if (parent.children[name].readOnly) {
      io.writeError(`rm: cannot remove '${target}': Permission denied (read-only file system)`)
      return 1
    }

    if (parent.children[name].type === "dir" && !recursive) {
      io.writeError(`rm: cannot remove '${target}': Is a directory`)
      return 1
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("term-fs-delete", { detail: { parentPath: parent.name, name } }))
    }
    
    return 0
  }
}

export const touchCmd: CommandDefinition = {
  name: "touch",
  description: "Change file timestamps or create empty files",
  usage: "touch [file...]",
  run: (ctx, args, io) => {
    if (args.length < 2) {
      io.writeError("touch: missing file operand")
      return 1
    }
    for (let i = 1; i < args.length; i++) {
      try {
        const { parent, name } = resolveParentAndName(ctx.fs, args[i], ctx.cwd)
        if (!parent.children) continue
        if (parent.children[name]) {
          parent.children[name].mtime = Date.now()
        } else {
          parent.children[name] = createNode(name, "file")
        }
      } catch (e: any) {
        io.writeError(`touch: cannot touch '${args[i]}': ${e.message}`)
      }
    }
    return 0
  }
}

export const mkdirCmd: CommandDefinition = {
  name: "mkdir",
  description: "Make directories",
  usage: "mkdir [-p] [dir...]",
  run: (ctx, args, io) => {
    const isP = args.includes("-p")
    const dirs = args.filter(a => a !== "mkdir" && !a.startsWith("-"))
    if (dirs.length === 0) {
      io.writeError("mkdir: missing operand")
      return 1
    }
    for (const dir of dirs) {
      try {
        const { parent, name } = resolveParentAndName(ctx.fs, dir, ctx.cwd)
        if (!parent.children) continue
        if (parent.children[name]) {
          io.writeError(`mkdir: cannot create directory '${dir}': File exists`)
        } else {
          parent.children[name] = createNode(name, "dir")
        }
      } catch (e: any) {
        io.writeError(`mkdir: cannot create directory '${dir}': ${e.message}`)
      }
    }
    return 0
  }
}
