import { CommandDefinition } from "../types"

export const grepCmd: CommandDefinition = {
  name: "grep",
  description: "Print lines that match patterns",
  usage: "grep [pattern] [file]",
  run: (ctx, args, io) => {
    let pattern = args[1]
    let input = ctx.stdin || ""
    if (!pattern) {
      io.writeError("grep: missing operand")
      return 1
    }
    
    // Very basic grep implementation for strings
    try {
      const regex = new RegExp(pattern)
      const lines = input.split("\n")
      const matches = lines.filter(l => regex.test(l))
      if (matches.length > 0) {
        io.write(matches.join("\n"))
      }
      return matches.length > 0 ? 0 : 1
    } catch (e) {
      io.writeError(`grep: invalid regular expression`)
      return 2
    }
  }
}

export const wcCmd: CommandDefinition = {
  name: "wc",
  description: "Print newline, word, and byte counts",
  usage: "wc [-l|-w|-c] [file]",
  run: (ctx, args, io) => {
    const input = ctx.stdin || ""
    const lines = input === "" ? 0 : input.split("\n").length
    const words = input === "" ? 0 : input.split(/\s+/).filter(Boolean).length
    const chars = input.length

    const isL = args.includes("-l")
    const isW = args.includes("-w")
    const isC = args.includes("-c")

    if (isL && !isW && !isC) io.write(lines.toString())
    else if (isW && !isL && !isC) io.write(words.toString())
    else if (isC && !isL && !isW) io.write(chars.toString())
    else io.write(`${lines} ${words} ${chars}`)
    
    return 0
  }
}

export const headCmd: CommandDefinition = {
  name: "head",
  description: "Output the first part of files",
  usage: "head [-n count] [file]",
  run: (ctx, args, io) => {
    const input = ctx.stdin || ""
    const count = parseInt(args[args.indexOf("-n") + 1]) || 10
    const lines = input.split("\n").slice(0, count)
    io.write(lines.join("\n"))
    return 0
  }
}

export const tailCmd: CommandDefinition = {
  name: "tail",
  description: "Output the last part of files",
  usage: "tail [-n count] [file]",
  run: (ctx, args, io) => {
    const input = ctx.stdin || ""
    const count = parseInt(args[args.indexOf("-n") + 1]) || 10
    const lines = input.split("\n").slice(-count)
    io.write(lines.join("\n"))
    return 0
  }
}
