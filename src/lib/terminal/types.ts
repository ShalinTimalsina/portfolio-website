export type FileType = "dir" | "file" | "exec"

export interface INode {
  name: string
  type: FileType
  content?: string
  readOnly: boolean
  permissions: string
  mtime: number
  linkedSection?: string // e.g. "work", "skills", "project-cloudway-lms"
  children?: Record<string, INode>
}

export type MascotEventState = "keystroke" | "success" | "error" | "thinking" | "celebrate" | "confused" | "wave" | "busy" | "heart" | "starstruck" | "blushing" | "watching" | "typing"

export interface MascotEventPayload {
  state: MascotEventState
  message?: string
}

export interface TerminalOutputNode {
  type: "text" | "link" | "color" | "bold" | "table"
  content: string | TerminalOutputNode[]
  color?: string
  href?: string
}

export interface CommandContext {
  cwd: string
  env: Record<string, string>
  fs: INode
  history: string[]
  stdin: string
}

export interface CommandIO {
  write: (text: string | TerminalOutputNode) => void
  writeError: (text: string) => void
  clear: () => void
  read: () => Promise<string>
  scrollTo: (sectionId: string) => void
  dispatchMascot: (payload: MascotEventPayload) => void
}

export interface CommandDefinition {
  name: string
  aliases?: string[]
  description: string
  usage: string
  flags?: Record<string, string>
  run: (ctx: CommandContext, args: string[], io: CommandIO) => Promise<number> | number
  complete?: (ctx: CommandContext, partial: string) => string[]
}
