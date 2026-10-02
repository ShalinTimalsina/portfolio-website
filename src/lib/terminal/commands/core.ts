import { CommandDefinition } from "../types"
import { getAllAliases, registerAlias } from "../registry"

export const helpCmd: CommandDefinition = {
  name: "help",
  description: "Show available commands",
  usage: "help",
  run: (ctx, args, io) => {
    io.write("ShalinOS v3.0 - Available Commands")
    
    // Hardcoded grouped listing for clarity and UI alignment
    io.write({
      type: "table",
      content: [
        [{ type: "bold", color: "text-blue-400", content: "Filesystem" }, { type: "text", content: "" }, { type: "text", content: "" }],
        [{ type: "text", content: "  ls" }, { type: "text", content: "---------" }, { type: "text", content: "List directory contents" }],
        [{ type: "text", content: "  cd" }, { type: "text", content: "---------" }, { type: "text", content: "Change directory" }],
        [{ type: "text", content: "  pwd" }, { type: "text", content: "---------" }, { type: "text", content: "Print working directory" }],
        [{ type: "text", content: "  cat" }, { type: "text", content: "---------" }, { type: "text", content: "Concatenate and print files" }],
        [{ type: "text", content: "  mkdir" }, { type: "text", content: "---------" }, { type: "text", content: "Make directories" }],
        [{ type: "text", content: "  touch" }, { type: "text", content: "---------" }, { type: "text", content: "Change file timestamps / create files" }],
        [{ type: "text", content: "  rm" }, { type: "text", content: "---------" }, { type: "text", content: "Remove files or directories" }],
        [{ type: "text", content: "" }, { type: "text", content: "" }, { type: "text", content: "" }],
        [{ type: "bold", color: "text-green-400", content: "DevOps & Cloud" }, { type: "text", content: "" }, { type: "text", content: "" }],
        [{ type: "text", content: "  docker" }, { type: "text", content: "---------" }, { type: "text", content: "Docker image and container management" }],
        [{ type: "text", content: "  kubectl" }, { type: "text", content: "---------" }, { type: "text", content: "Kubernetes cluster manager" }],
        [{ type: "text", content: "  terraform" }, { type: "text", content: "---------" }, { type: "text", content: "Terraform Infrastructure as Code" }],
        [{ type: "text", content: "  aws" }, { type: "text", content: "---------" }, { type: "text", content: "AWS Command Line Interface" }],
        [{ type: "text", content: "" }, { type: "text", content: "" }, { type: "text", content: "" }],
        [{ type: "bold", color: "text-purple-400", content: "System & Core" }, { type: "text", content: "" }, { type: "text", content: "" }],
        [{ type: "text", content: "  help" }, { type: "text", content: "---------" }, { type: "text", content: "Show this help message" }],
        [{ type: "text", content: "  clear" }, { type: "text", content: "---------" }, { type: "text", content: "Clear the terminal screen" }],
        [{ type: "text", content: "  history" }, { type: "text", content: "---------" }, { type: "text", content: "Display command history" }],
        [{ type: "text", content: "  neofetch" }, { type: "text", content: "---------" }, { type: "text", content: "System information tool" }],
        [{ type: "text", content: "  top" }, { type: "text", content: "---------" }, { type: "text", content: "Task manager and system monitor" }],
        [{ type: "text", content: "  sudo" }, { type: "text", content: "---------" }, { type: "text", content: "Execute a command as another user" }],
        [{ type: "text", content: "  sudo hire-shalin" }, { type: "text", content: "-" }, { type: "text", content: "Easter egg: Grant access to hire me" }],
        [{ type: "text", content: "  whoami" }, { type: "text", content: "---------" }, { type: "text", content: "Print effective user id" }],
        [{ type: "text", content: "  uname" }, { type: "text", content: "---------" }, { type: "text", content: "Print system information" }],
        [{ type: "text", content: "  date" }, { type: "text", content: "---------" }, { type: "text", content: "Print or set the system date and time" }],
        [{ type: "text", content: "  echo" }, { type: "text", content: "---------" }, { type: "text", content: "Write arguments to standard output" }],
        [{ type: "text", content: "  reboot" }, { type: "text", content: "---------" }, { type: "text", content: "Reboot the system" }],
        [{ type: "text", content: "  shutdown" }, { type: "text", content: "---------" }, { type: "text", content: "Halt, power-off or reboot the machine" }],
        [{ type: "text", content: "  exit" }, { type: "text", content: "---------" }, { type: "text", content: "Cause normal process termination" }],
        [{ type: "text", content: "  theme <dark|light>" }, { type: "text", content: "-" }, { type: "text", content: "Switch UI theme" }],
        [{ type: "text", content: "  fullscreen" }, { type: "text", content: "---------" }, { type: "text", content: "Toggle fullscreen terminal" }],
        [{ type: "text", content: "  alias [n=cmd]" }, { type: "text", content: "---" }, { type: "text", content: "List or set command aliases" }],
        [{ type: "text", content: "" }, { type: "text", content: "" }, { type: "text", content: "" }],
        [{ type: "bold", color: "text-yellow-400", content: "Filters & Networking" }, { type: "text", content: "" }, { type: "text", content: "" }],
        [{ type: "text", content: "  ifconfig" }, { type: "text", content: "---------" }, { type: "text", content: "Configure a network interface" }],
        [{ type: "text", content: "  grep" }, { type: "text", content: "---------" }, { type: "text", content: "Search pattern in text" }],
        [{ type: "text", content: "  wc" }, { type: "text", content: "---------" }, { type: "text", content: "Word, line, character, and byte count" }],
        [{ type: "text", content: "  head" }, { type: "text", content: "---------" }, { type: "text", content: "Output the first part of files" }],
        [{ type: "text", content: "  tail" }, { type: "text", content: "---------" }, { type: "text", content: "Output the last part of files" }],
        [{ type: "text", content: "  ping" }, { type: "text", content: "---------" }, { type: "text", content: "Send ICMP ECHO_REQUEST to network hosts" }],
        [{ type: "text", content: "  ssh" }, { type: "text", content: "---------" }, { type: "text", content: "OpenSSH remote login client" }],
        [{ type: "text", content: "" }, { type: "text", content: "" }, { type: "text", content: "" }],
        [{ type: "bold", color: "text-orange-400", content: "Editors" }, { type: "text", content: "" }, { type: "text", content: "" }],
        [{ type: "text", content: "  nano" }, { type: "text", content: "---------" }, { type: "text", content: "Nano's ANOther editor" }],
        [{ type: "text", content: "  vim" }, { type: "text", content: "---------" }, { type: "text", content: "Vi IMproved, a programmer's text editor" }]
      ] as any
    })
    
    io.write("\nNavigation Hint: Use 'cd' and 'cat' to explore the portfolio sections inside ~/portfolio!")

    io.dispatchMascot({ state: "success" })
    return 0
  }
}

export const clearCmd: CommandDefinition = {
  name: "clear",
  description: "Clear the terminal screen",
  usage: "clear",
  run: (ctx, args, io) => {
    io.clear()
    io.dispatchMascot({ state: "watching" })
    return 0
  }
}

export const echoCmd: CommandDefinition = {
  name: "echo",
  description: "Write arguments to the standard output",
  usage: "echo [string ...]",
  run: (ctx, args, io) => {
    const output = args.slice(1).join(" ").replace(/^["']|["']$/g, "")
    io.write(output)
    return 0
  }
}

export const pwdCmd: CommandDefinition = {
  name: "pwd",
  description: "Print name of current/working directory",
  usage: "pwd",
  run: (ctx, args, io) => {
    io.write(ctx.cwd)
    return 0
  }
}

export const whoamiCmd: CommandDefinition = {
  name: "whoami",
  aliases: ["about"],
  description: "Print effective user id / About Shalin",
  usage: "whoami",
  run: (ctx, args, io) => {
    if (args[0] === "whoami") {
      io.write("shalin")
    } else {
      io.write("Shalin Timalsina: Cloud & DevOps Engineer in the making. Building resilient cloud infrastructure.")
    }
    io.dispatchMascot({ state: "success", message: "That's me!" })
    return 0
  }
}

export const unameCmd: CommandDefinition = {
  name: "uname",
  description: "Print system information",
  usage: "uname [-a]",
  run: (ctx, args, io) => {
    if (args.includes("-a")) {
      io.write("Linux shalin-cloud 6.1.0-1014-aws #14~22.04.1-Ubuntu SMP x86_64 x86_64 x86_64 GNU/Linux")
    } else {
      io.write("Linux")
    }
    return 0
  }
}

export const dateCmd: CommandDefinition = {
  name: "date",
  description: "Print or set the system date and time",
  usage: "date",
  run: (ctx, args, io) => {
    io.write(new Date().toString())
    return 0
  }
}

export const historyCmd: CommandDefinition = {
  name: "history",
  description: "Display command history",
  usage: "history",
  run: (ctx, args, io) => {
    const list = ctx.history.map((cmd, idx) => ({
      type: "text" as const,
      content: `  ${idx + 1}  ${cmd}`
    }))
    io.write({ type: "table", content: list })
    return 0
  }
}

export const pingCmd: CommandDefinition = {
  name: "ping",
  description: "Send ICMP ECHO_REQUEST to network hosts",
  usage: "ping [host]",
  run: (ctx, args, io) => {
    const target = args[1] || "8.8.8.8"
    io.write(`PING ${target} 56(84) bytes of data.\n64 bytes from ${target}: icmp_seq=1 ttl=116 time=14.2 ms\n64 bytes from ${target}: icmp_seq=2 ttl=116 time=12.1 ms\n... ping stopped by browser.`)
    return 0
  }
}

export const ifconfigCmd: CommandDefinition = {
  name: "ifconfig",
  aliases: ["ip"],
  description: "Configure a network interface",
  usage: "ifconfig",
  run: (ctx, args, io) => {
    io.write(`eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.1.14  netmask 255.255.255.0  broadcast 10.0.1.255
        inet6 fe80::8c1:7aff:fe4f:6390  prefixlen 64  scopeid 0x20<link>
        ether 0a:c1:7a:4f:63:90  txqueuelen 1000  (Ethernet)
        RX packets 1459203  bytes 1294819034 (1.2 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 854091  bytes 230591024 (230.5 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 45012  bytes 8409212 (8.4 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 45012  bytes 8409212 (8.4 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`)
    return 0
  }
}

export const sudoCmd: CommandDefinition = {
  name: "sudo",
  description: "Execute a command as another user",
  usage: "sudo [command]",
  run: async (ctx, args, io) => {
    if (args.length < 2) {
      io.writeError("usage: sudo -h | -K | -k | -V\nusage: sudo -v [-AknS] [-g group] [-h host] [-p prompt] [-u user]\nusage: sudo -l [-AknS] [-g group] [-h host] [-p prompt] [-U user] [-u user] [command]")
      return 1
    }
    const subCmd = args[1]
    if (subCmd === "su") {
      io.writeError("shalin is not in the sudoers file. This incident will be reported.")
      io.dispatchMascot({ state: "error", message: "I'm telling on you!" })
      return 1
    }
    if (subCmd === "hire-shalin") {
      io.scrollTo("contact")
      io.write("Permission granted! Opening contact form...")
      io.dispatchMascot({ state: "success", message: "Connection established." })
      return 0
    }
    if (subCmd === "rm" && args[2] === "-rf" && (args[3] === "/" || args[3] === "/*")) {
      io.writeError("Nice try. You can't delete the cloud.")
      io.dispatchMascot({ state: "watching", message: "Nice try!" })
      return 1
    }
    if (["love", "amaze", "compliment"].includes(subCmd)) {
      if (subCmd === "love") {
        io.write("Love protocol initiated. <3")
        io.dispatchMascot({ state: "heart", message: "Thank you!" })
      } else if (subCmd === "amaze") {
        io.write("Deploying production without tests... (just kidding)")
        io.dispatchMascot({ state: "starstruck", message: "Whoa..." })
      } else {
        io.write("You're doing great.")
        io.dispatchMascot({ state: "blushing", message: "Oh stop it..." })
      }
      return 0
    }
    
    // Otherwise execute normally
    const { getCommand } = await import("../registry")
    const command = getCommand(subCmd)
    if (command) {
      return command.run(ctx, args.slice(1), io)
    }
    io.writeError(`sudo: ${subCmd}: command not found`)
    return 127
  }
}

export const neofetchCmd: CommandDefinition = {
  name: "neofetch",
  description: "A fast, highly customizable system info script",
  usage: "neofetch",
  run: (ctx, args, io) => {
    io.write({
      type: "table",
      content: [
        [
          { type: "color", color: "text-primary font-bold whitespace-pre", content: `       .
      / \\
     /   \\
    /     \\
   /       \\
  /_________\\` },
          { type: "text", content: "" }, // padding
          { type: "table", content: [
            [{ type: "color", color: "text-primary font-bold", content: "shalin@cloud" }],
            [{ type: "text", content: "-------------------" }],
            [{ type: "color", color: "text-primary font-bold", content: "OS:" }, { type: "text", content: " ShalinOS v3.0 (Ubuntu-based)" }],
            [{ type: "color", color: "text-primary font-bold", content: "Host:" }, { type: "text", content: " AWS EC2 t3.micro" }],
            [{ type: "color", color: "text-primary font-bold", content: "Kernel:" }, { type: "text", content: " 6.1.0-1014-aws" }],
            [{ type: "color", color: "text-primary font-bold", content: "Uptime:" }, { type: "text", content: " Forever" }],
            [{ type: "color", color: "text-primary font-bold", content: "Shell:" }, { type: "text", content: " React-Bash 5.1.16" }],
            [{ type: "color", color: "text-primary font-bold", content: "Memory:" }, { type: "text", content: " 640K / 640K" }],
          ]}
        ]
      ] as any
    })
    return 0
  }
}

export const topCmd: CommandDefinition = {
  name: "top",
  aliases: ["htop"],
  description: "Display Linux processes",
  usage: "top",
  run: (ctx, args, io) => {
    // Fake output
    io.write(`top - 17:28:01 up 1337 days,  4:20,  1 user,  load average: 99.9, 99.9, 99.9
Tasks: 42 total,   1 running,  41 sleeping,   0 stopped,   0 zombie
%Cpu(s): 98.0 us,  1.0 sy,  0.0 ni,  1.0 id,  0.0 wa,  0.0 hi,  0.0 si

PID    USER      PR   VIRT      %CPU   %MEM   COMMAND
1      root      20   1.2G      0.1    0.1    systemd
420    shalin    20   8.4G      98.0   64.0   node (npm run dev)
1337   shalin    20   200M      1.5    2.0    looking_for_jobs.sh`)
    return 0
  }
}

export const sshCmd: CommandDefinition = {
  name: "ssh",
  description: "OpenSSH remote login client",
  usage: "ssh [user@]hostname",
  run: (ctx, args, io) => {
    io.writeError(`ssh: connect to host ${args[1] || '10.0.0.1'} port 22: Connection refused.\n(Firewall is locked down tight. I'm a DevOps engineer, what did you expect?)`)
    return 255
  }
}

export const nanoCmd: CommandDefinition = {
  name: "nano",
  description: "Nano's ANOther editor",
  usage: "nano [file]",
  run: (ctx, args, io) => {
    io.write("GNU nano 6.2\n\n[ Error: Terminal is not fully functional ]\nUse VS Code. It's 2026.")
    return 1
  }
}

export const vimCmd: CommandDefinition = {
  name: "vim",
  aliases: ["vi"],
  description: "Vi IMproved, a programmer's text editor",
  usage: "vim [file]",
  run: (ctx, args, io) => {
    io.write("Warning: Cannot initialize terminal for vim.\n(And let's be honest, you wouldn't know how to exit anyway!)")
    return 1
  }
}

export const rebootCmd: CommandDefinition = {
  name: "reboot",
  description: "Restart the system",
  usage: "reboot",
  run: (ctx, args, io) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("term-reboot"))
    }
    return 0
  }
}

export const shutdownCmd: CommandDefinition = {
  name: "shutdown",
  description: "Power-off the system",
  usage: "shutdown",
  run: (ctx, args, io) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("term-shutdown"))
    }
    return 0
  }
}

export const exitCmd: CommandDefinition = {
  name: "exit",
  description: "Logout of the shell",
  usage: "exit",
  run: (ctx, args, io) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("term-exit"))
    }
    return 0
  }
}

export const themeCmd: CommandDefinition = {
  name: "theme",
  description: "Switch the system theme",
  usage: "theme <dark|light>",
  run: (ctx, args, io) => {
    if (args.length < 2) {
      io.writeError("Usage: theme <dark|light>")
      return 1
    }
    
    const requestedTheme = args[1].toLowerCase()
    if (requestedTheme !== "dark" && requestedTheme !== "light") {
      io.writeError("Invalid theme. Valid options: dark, light")
      return 1
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("set-theme", { detail: { theme: requestedTheme } }))
    }

    io.write(`Switched to ${requestedTheme} mode.`)
    io.dispatchMascot({ state: "success", message: requestedTheme === "dark" ? "Going dark!" : "Let there be light!" })
    return 0
  }
}

export const fullscreenCmd: CommandDefinition = {
  name: "fullscreen",
  aliases: ["fs", "maximize"],
  description: "Toggle fullscreen terminal",
  usage: "fullscreen",
  run: (ctx, args, io) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("term-fullscreen"))
    }
    io.dispatchMascot({ state: "starstruck", message: "Maximum power!" })
    return 0
  }
}

export const aliasCmd: CommandDefinition = {
  name: "alias",
  description: "List or set command aliases",
  usage: "alias [name=command]",
  run: (ctx, args, io) => {
    // No args: list all aliases
    if (args.length < 2) {
      const allAliases = getAllAliases()
      if (allAliases.size === 0) {
        io.write("No aliases defined.")
        return 0
      }

      io.write("Registered aliases:")
      io.write({
        type: "table",
        content: Array.from(allAliases.entries()).map(([alias, target]) => [
          { type: "color", color: "text-primary font-bold", content: `  ${alias}` },
          { type: "text", content: "→" },
          { type: "text", content: target },
        ])
      } as any)
      return 0
    }

    // Set alias: alias ll=ls
    const assignment = args.slice(1).join(" ")
    const eqIndex = assignment.indexOf("=")
    if (eqIndex === -1) {
      io.writeError("Usage: alias name=command")
      io.writeError("Example: alias ll=ls")
      return 1
    }

    const aliasName = assignment.substring(0, eqIndex).trim()
    const targetCmd = assignment.substring(eqIndex + 1).trim().replace(/^["']|["']$/g, "")

    if (!aliasName || !targetCmd) {
      io.writeError("Usage: alias name=command")
      return 1
    }

    const success = registerAlias(aliasName, targetCmd)
    if (!success) {
      io.writeError(`Unknown command: ${targetCmd}`)
      return 1
    }

    io.write(`alias ${aliasName}='${targetCmd}'`)
    io.dispatchMascot({ state: "success", message: "Shortcut saved!" })
    return 0
  }
}
