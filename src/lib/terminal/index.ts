import { registerCommand } from "./registry"
import { lsCmd, cdCmd, catCmd, rmCmd, touchCmd, mkdirCmd } from "./commands/fs"
import { helpCmd, clearCmd, echoCmd, pwdCmd, whoamiCmd, unameCmd, dateCmd, historyCmd, pingCmd, sudoCmd, neofetchCmd, topCmd, sshCmd, nanoCmd, vimCmd, rebootCmd, shutdownCmd, exitCmd, themeCmd, fullscreenCmd, aliasCmd } from "./commands/core"
import { grepCmd, wcCmd, headCmd, tailCmd } from "./commands/filters"
import { dockerCmd, kubectlCmd, terraformCmd, awsCmd } from "./commands/devops"
import { Executor } from "./executor"

// Register commands
const initRegistry = () => {
  registerCommand(lsCmd)
  registerCommand(cdCmd)
  registerCommand(catCmd)
  registerCommand(rmCmd)
  registerCommand(touchCmd)
  registerCommand(mkdirCmd)
  registerCommand(neofetchCmd)
  registerCommand(topCmd)
  registerCommand(sshCmd)
  registerCommand(nanoCmd)
  registerCommand(vimCmd)
  registerCommand(helpCmd)
  registerCommand(clearCmd)
  registerCommand(rebootCmd)
  registerCommand(shutdownCmd)
  registerCommand(exitCmd)
  registerCommand(themeCmd)
  registerCommand(fullscreenCmd)
  registerCommand(aliasCmd)
  registerCommand(echoCmd)
  registerCommand(pwdCmd)
  registerCommand(whoamiCmd)
  registerCommand(unameCmd)
  registerCommand(dateCmd)
  registerCommand(historyCmd)
  registerCommand(pingCmd)
  registerCommand(sudoCmd)
  registerCommand(grepCmd)
  registerCommand(wcCmd)
  registerCommand(headCmd)
  registerCommand(tailCmd)
  registerCommand(dockerCmd)
  registerCommand(kubectlCmd)
  registerCommand(terraformCmd)
  registerCommand(awsCmd)
}

initRegistry()

export { Executor }
export * from "./types"
export * from "./fs"
export * from "./registry"
