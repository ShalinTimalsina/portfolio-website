export interface Token {
  type: "word" | "pipe" | "redirect" | "and" | "or" | "semi"
  value: string
}

export interface Redirect {
  file: string
  append: boolean
}

export interface CommandAST {
  args: string[]
  redirect?: Redirect
  next?: { op: "pipe" | "and" | "or" | "semi", cmd: CommandAST }
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let current = ""
  let inQuote: string | null = null
  let escapeNext = false

  const pushCurrent = () => {
    if (current.length > 0) {
      tokens.push({ type: "word", value: current })
      current = ""
    }
  }

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (escapeNext) {
      current += char
      escapeNext = false
      continue
    }

    if (char === '\\') {
      escapeNext = true
      continue
    }

    if (inQuote) {
      if (char === inQuote) {
        inQuote = null
      } else {
        current += char
      }
      continue
    }

    if (char === '"' || char === "'") {
      inQuote = char
      continue
    }

    if (char === ' ' || char === '\t') {
      pushCurrent()
      continue
    }

    if (char === '|') {
      pushCurrent()
      if (input[i + 1] === '|') {
        tokens.push({ type: "or", value: "||" })
        i++
      } else {
        tokens.push({ type: "pipe", value: "|" })
      }
      continue
    }

    if (char === '&' && input[i + 1] === '&') {
      pushCurrent()
      tokens.push({ type: "and", value: "&&" })
      i++
      continue
    }

    if (char === ';') {
      pushCurrent()
      tokens.push({ type: "semi", value: ";" })
      continue
    }

    if (char === '>') {
      pushCurrent()
      if (input[i + 1] === '>') {
        tokens.push({ type: "redirect", value: ">>" })
        i++
      } else {
        tokens.push({ type: "redirect", value: ">" })
      }
      continue
    }

    current += char
  }
  pushCurrent()
  return tokens
}

export function parse(tokens: Token[]): CommandAST | null {
  if (tokens.length === 0) return null

  const ast: CommandAST = { args: [] }
  let currentAst = ast

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (token.type === "word") {
      currentAst.args.push(token.value)
    } else if (token.type === "redirect") {
      const next = tokens[i + 1]
      if (!next || next.type !== "word") throw new Error("syntax error near unexpected token")
      currentAst.redirect = { file: next.value, append: token.value === ">>" }
      i++ // skip file
    } else {
      const nextCmd: CommandAST = { args: [] }
      currentAst.next = { op: token.type as "pipe" | "and" | "or" | "semi", cmd: nextCmd }
      currentAst = nextCmd
    }
  }

  return ast
}

export function expandVariables(word: string, env: Record<string, string>): string {
  return word.replace(/\$\{?([a-zA-Z0-9_]+)\}?/g, (match, p1) => {
    return env[p1] !== undefined ? env[p1] : ""
  })
}
