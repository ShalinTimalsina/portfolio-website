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

export function getAllAliases(): Map<string, string> {
  return aliases
}

export function registerAlias(alias: string, target: string): boolean {
  // Target must resolve to a real command
  const resolved = aliases.get(target) || target
  if (!registry.has(resolved)) return false
  aliases.set(alias, resolved)
  return true
}
