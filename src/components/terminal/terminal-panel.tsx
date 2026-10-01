"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Terminal as TerminalIcon, X, CornersOut, CornersIn } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

import { Executor } from "@/lib/terminal/executor"
import { initialFS, resolveNode, HOME_DIR } from "@/lib/terminal/fs"
import { TerminalOutputNode, INode, CommandContext, MascotEventState } from "@/lib/terminal/types"
import { getAllCommands } from "@/lib/terminal/registry"

interface TerminalOutput {
  id: string
  type: "command" | "text" | "error" | "success"
  content: React.ReactNode
}

// Ensure registry is loaded
import "@/lib/terminal"

function formatCwd(cwd: string): string {
  if (cwd === HOME_DIR) return "~"
  if (cwd.startsWith(HOME_DIR + "/")) return "~" + cwd.substring(HOME_DIR.length)
  return cwd
}

function renderOutputNode(node: string | TerminalOutputNode | TerminalOutputNode[]): React.ReactNode {
  if (typeof node === "string") return node
  
  if (Array.isArray(node)) {
    return (
      <>
        {node.map((n, i) => (
          <span key={i} className="mr-4">{renderOutputNode(n)}</span>
        ))}
      </>
    )
  }

  if (node.type === "text") return node.content as string
  if (node.type === "color") return <span className={node.color}>{node.content as string}</span>
  if (node.type === "bold") return <strong className={node.color}>{node.content as string}</strong>
  if (node.type === "link") return <a href={node.href} className="underline text-primary">{node.content as string}</a>
  
  if (node.type === "table") {
    if (Array.isArray(node.content)) {
      return (
        <div className="flex flex-col gap-1">
          {node.content.map((row, i) => (
            <div key={i} className="flex">
              {renderOutputNode(row)}
            </div>
          ))}
        </div>
      )
    }
  }

  return JSON.stringify(node)
}

interface TerminalPanelProps {
  onClose?: () => void
  isExpanded?: boolean
  onExpand?: () => void
}

export function TerminalPanel({ onClose, isExpanded = false, onExpand }: TerminalPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [history, setHistory] = useState<TerminalOutput[]>([
    {
      id: "boot-1",
      type: "text",
      content: "Welcome to ShalinOS v3.0. Type 'help' to see available commands."
    }
  ])
  const [input, setInput] = useState("")
  const [cwd, setCwd] = useState("~/portfolio")
  const [fs, setFs] = useState<INode>(initialFS)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isRebooting, setIsRebooting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [history])

  const appendHistory = (type: TerminalOutput["type"], content: React.ReactNode) => {
    setHistory(prev => [...prev, { id: `res-${Date.now()}-${Math.random()}`, type, content }])
  }

  // Custom events for CWD and FS changes
  useEffect(() => {
    const handleCwdChange = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setCwd(detail)
    }
    const handleFsDelete = (e: Event) => {
      const { parentPath, name } = (e as CustomEvent).detail
      setFs(prev => {
        const newFs = structuredClone(prev)
        try {
          const p = resolveNode(newFs, parentPath, cwd)
          if (p.children) delete p.children[name]
        } catch(err) {}
        return newFs
      })
    }

    const handleTermReboot = () => {
      setIsRebooting(true)
      appendHistory("text", "Broadcast message from root@cloud:")
      appendHistory("error", "The system is going down for reboot NOW!")
      appendHistory("text", "Stopping services... [OK]")
      appendHistory("text", "Unmounting filesystems... [OK]")
      appendHistory("success", "System rebooting...")
      setTimeout(() => window.location.reload(), 1500)
    }

    const handleTermShutdown = () => {
      setIsRebooting(true)
      appendHistory("text", "Broadcast message from root@cloud:")
      appendHistory("error", "The system is going down for system halt NOW!")
      appendHistory("text", "Sending SIGTERM to all processes... [OK]")
      appendHistory("text", "Unmounting filesystems... [OK]")
      appendHistory("success", "System halted.")
      setTimeout(() => {
        if (onClose) onClose()
      }, 2500)
    }

    const handleTermExit = () => {
      appendHistory("text", "logout")

      setIsRebooting(true)
      setTimeout(() => {
        if (onClose) onClose()
      }, 800)
    }

    const handleTermClear = () => {
      setHistory([])
    }

    window.addEventListener("term-cwd-change", handleCwdChange)
    window.addEventListener("term-fs-delete", handleFsDelete)
    window.addEventListener("term-reboot", handleTermReboot)
    window.addEventListener("term-shutdown", handleTermShutdown)
    window.addEventListener("term-exit", handleTermExit)
    window.addEventListener("term-clear", handleTermClear)
    return () => {
      window.removeEventListener("term-cwd-change", handleCwdChange)
      window.removeEventListener("term-fs-delete", handleFsDelete)
      window.removeEventListener("term-reboot", handleTermReboot)
      window.removeEventListener("term-shutdown", handleTermShutdown)
      window.removeEventListener("term-exit", handleTermExit)
      window.removeEventListener("term-clear", handleTermClear)
    }
  }, [cwd, commandHistory])

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    setHistory(prev => [
      ...prev,
      { id: `cmd-${Date.now()}`, type: "command", content: `shalin@cloud:${formatCwd(cwd)}$ ${trimmed}` }
    ])

    setCommandHistory(prev => [...prev, trimmed])
    setHistoryIndex(-1)

    const ctx: CommandContext = {
      cwd,
      env: { USER: "shalin", HOME: HOME_DIR, PWD: cwd },
      fs,
      history: commandHistory,
      stdin: ""
    }

    const io = {
      write: (text: string | TerminalOutputNode) => appendHistory("text", renderOutputNode(text)),
      writeError: (text: string) => appendHistory("error", text),
      clear: () => setHistory([]),
      read: async () => "",
      scrollTo: (id: string) => {
        setTimeout(() => {
          requestAnimationFrame(() => {
            const el = document.getElementById(id)
            if (!el) return
            if (id === "contact") {
              el.scrollIntoView({ behavior: "smooth", block: "center" })
            } else {
              const y = el.getBoundingClientRect().top + window.scrollY
              window.scrollTo({ top: y, behavior: "smooth" })
            }
          })
        }, 150)
      },
      dispatchMascot: (payload: { state: MascotEventState, message?: string }) => {
        window.dispatchEvent(new CustomEvent("mascot-action", { detail: payload }))
      }
    }

    const executor = new Executor(io, ctx)
    window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "thinking" } }))

    await executor.executeLine(trimmed)
    
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isRebooting) return e.preventDefault()

    if (e.ctrlKey && e.key === "c") {
      e.preventDefault()
      setHistory(prev => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: "command", content: `shalin@cloud:${formatCwd(cwd)}$ ${input}^C` }
      ])
      setInput("")
      setHistoryIndex(-1)
      window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))
      return
    }

    if (e.ctrlKey && e.key === "l") {
      e.preventDefault()
      setHistory([])
      setInput("")
      setHistoryIndex(-1)
      return
    }

    if (e.ctrlKey && e.key === "u") {
      e.preventDefault()
      setInput("")
      return
    }

    if (e.key === "Enter") {
      handleCommand(input)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1
        setHistoryIndex(nextIndex)
        setInput(commandHistory[commandHistory.length - 1 - nextIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1
        setHistoryIndex(nextIndex)
        setInput(commandHistory[commandHistory.length - 1 - nextIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      
      const commands = getAllCommands().map(c => c.name)
      const args = input.split(" ")
      const lastArg = args[args.length - 1].toLowerCase()

      if (args.length === 1) {
        const matches = commands.filter(c => c.startsWith(lastArg))
        if (matches.length > 0) setInput(matches[0] + " ")
      } else {
        try {
          const lastSlashIdx = lastArg.lastIndexOf('/')
          let targetDir = cwd
          let searchPrefix = lastArg

          if (lastSlashIdx >= 0) {
            targetDir = lastArg.substring(0, lastSlashIdx + 1)
            searchPrefix = lastArg.substring(lastSlashIdx + 1)
          }

          const dirNode = resolveNode(fs, targetDir, cwd)
          if (dirNode.children) {
            const children = Object.keys(dirNode.children)
            // also allow completing ".." if searchPrefix allows it
            if ("..".startsWith(searchPrefix) && targetDir !== "/") children.unshift("..")
            
            const matches = children.filter(c => c.startsWith(searchPrefix))
            if (matches.length > 0) {
              const match = matches[0]
              const prefix = args.slice(0, args.length - 1).join(" ")
              
              const newArg = (lastSlashIdx >= 0 ? lastArg.substring(0, lastSlashIdx + 1) : "") + match
              const isDir = match === ".." ? true : dirNode.children[match]?.type === "dir"
              
              setInput(prefix + " " + newArg + (isDir ? "/" : " "))
            }
          }
        } catch(e) {}
      }
    } else {
      window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "typing" } }))
    }
  }

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 1 }}
      className={cn(
        "flex flex-col bg-background border border-border rounded-xl overflow-hidden shadow-2xl font-mono text-sm w-full",
        isExpanded ? "h-full" : "max-w-2xl",
        isMinimized ? "h-[48px]" : (!isExpanded && "h-[320px] sm:h-[400px]")
      )}
    >
      <motion.div layout="position" className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-2 mr-2">
            <button 
              onClick={() => {
                // If it's a shutdown, we don't allow closing manually? Actually closing is fine.
                if (onClose) onClose()
              }}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer" 
              title="Close"
            />
            <button 
              onClick={() => {
                if (isExpanded && onExpand) {
                  onExpand()
                  setIsMinimized(true)
                } else {
                  setIsMinimized(!isMinimized)
                }
              }}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer" 
              title="Minimize"
            />
            <button 
              onClick={() => {
                setIsMinimized(false)
                if (onExpand) onExpand()
              }}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer" 
              title="Maximize"
            />
          </div>
          <span className="ml-2 text-xs text-muted-foreground flex items-center gap-2">
            <TerminalIcon weight="duotone" className="w-4 h-4 text-primary" />
            shalin@cloud:{formatCwd(cwd)}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-muted-foreground">
          <button onClick={() => { setIsMinimized(false); if (onExpand) onExpand(); }} className="hover:text-foreground transition-colors cursor-pointer">
            {isExpanded ? <CornersIn /> : <CornersOut />}
          </button>
          <button onClick={() => { if (onClose) onClose(); }} className="hover:text-foreground transition-colors cursor-pointer">
            <X />
          </button>
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {!isMinimized && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30, mass: 1 }}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto scrollbar-thin flex flex-col gap-2 cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
        {history.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "whitespace-pre-wrap leading-relaxed",
              item.type === "error" && "text-red-400",
              item.type === "success" && "text-primary",
              item.type === "command" && "text-foreground font-semibold",
              item.type === "text" && "text-muted-foreground"
            )}
          >
            {item.content}
          </div>
        ))}
        
        {!isRebooting && (
          <div className="flex items-center group">
            <span className="text-primary font-semibold mr-2 shrink-0">shalin@cloud:{formatCwd(cwd)}$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                const val = e.target.value
                  .replace(/—/g, "--")
                  .replace(/–/g, "--")
                  .replace(/[“”]/g, '"')
                  .replace(/[‘’]/g, "'")
                setInput(val)
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-foreground caret-primary w-full"
              autoComplete="off"
              spellCheck="false"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
