import { CommandDefinition } from "./types"

const registry = new Map<string, CommandDefinition>()
const aliases = new Map<string, string>()

export function registerCommand(def: CommandDefinition) {
  registry.set(def.name, def)
  if (def.aliases) {
    for (const alias of def.aliases) {
      aliases.set(alias, def.name)
    }
  }
}

export function getCommand(name: string): CommandDefinition | undefined {
  const resolved = aliases.get(name) || name
  return registry.get(resolved)
}

export function getAllCommands(): CommandDefinition[] {
  return Array.from(registry.values())
}
