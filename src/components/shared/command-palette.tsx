"use client"

import React, { useEffect, useState } from "react"
import { Command } from "cmdk"
import { motion, AnimatePresence } from "motion/react"
import { useRouter } from "next/navigation"
import { Code, Terminal, User, EnvelopeSimple, BookOpen, MagnifyingGlass, ArrowElbowDownLeft } from "@phosphor-icons/react"
import { toast } from "sonner"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "thinking", message: "Looking for something?" } }))
    } else {
      window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))
    }
  }, [open])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void, name: string) => {
    window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "success", message: "Found it!" } }))
    
    // HCI Gulf of Evaluation: Give the user 150ms to perceive their selection was successful before disappearing
    setTimeout(() => {
      setOpen(false)
      command()
      toast(`Executed: ${name}`, {
        icon: <Terminal className="w-4 h-4 text-primary" />,
      })
    }, 150)
  }

  const navItems = [
    { label: "Home", value: "home start index", icon: User, action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { label: "Work", value: "work projects portfolio case studies", icon: Code, action: () => document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "center" }) },
    { label: "Skills", value: "skills stack technologies tools aws linux", icon: Terminal, action: () => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth", block: "center" }) },
    { label: "Contact", value: "contact message email hire", icon: EnvelopeSimple, action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "center" }) },
  ]

  const projectItems = [
    { label: "Terraform CI/CD Pipeline", value: "terraform ci cd pipeline aws github actions bash", icon: Code, action: () => window.open("https://github.com/ShalinTimalsina/Terraform_CI-CD", "_blank") },
    { label: "NRB Redesign", value: "nrb redesign nepal rastra bank nextjs react typescript tailwind", icon: Code, action: () => window.open("https://nrb-redesign.vercel.app", "_blank") },
    { label: "Vote App", value: "vote app voting docker kubernetes redis typescript microservices", icon: Code, action: () => window.open("https://github.com/ShalinTimalsina/Vote-app", "_blank") },
    { label: "Cloudway LMS", value: "cloudway lms learning management system nodejs mongodb javascript", icon: Code, action: () => window.open("https://github.com/ShalinTimalsina/Cloudway_LMS", "_blank") },
  ]

  const linkItems = [
    { label: "GitHub", value: "github source code git", icon: Code, action: () => window.open("https://github.com/ShalinTimalsina", "_blank") },
    { label: "LinkedIn", value: "linkedin profile connect", icon: User, action: () => window.open("https://linkedin.com/in/shalin-timalsina", "_blank") },
    { label: "Twitter / X", value: "twitter x social", icon: User, action: () => window.open("https://twitter.com/shalintimalsina", "_blank") },
    { label: "Email Me", value: "email contact mailto", icon: EnvelopeSimple, action: () => window.open("mailto:salintimalsina01@gmail.com", "_blank") },
  ]

  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog 
          open={open} 
          onOpenChange={setOpen}
          label="Global Command Menu"
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[25vh]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm -z-10"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="w-full max-w-xl mx-4 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl relative"
            style={{ boxShadow: "0 0 40px rgba(0,200,150,0.1), inset 0 1px 0 rgba(255,255,255,0.06)" }}
          >
            <Command className="w-full flex flex-col bg-transparent">
              <div className="flex items-center border-b border-border px-4 gap-3">
                <MagnifyingGlass className="w-5 h-5 text-muted-foreground shrink-0" />
                <Command.Input 
                  placeholder="Search projects, skills, links, or navigate..." 
                  className="w-full flex-1 bg-transparent py-4 text-base outline-none placeholder:text-muted-foreground text-foreground"
                />
                <div className="px-2 py-1 text-xs text-muted-foreground bg-muted border border-border rounded-md font-mono shrink-0">
                  Esc
                </div>
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                <Command.Empty className="py-12 text-center text-sm text-muted-foreground">
                  Type to search projects, skills, and more...
                </Command.Empty>
                
                <Command.Group heading="Navigation" className="px-2 py-2 text-xs font-medium text-muted-foreground">
                  {navItems.map((item) => (
                    <Command.Item 
                      key={item.label}
                      value={item.value}
                      onSelect={() => runCommand(item.action, item.label)}
                      onPointerUp={() => runCommand(item.action, item.label)}
                      className="group flex cursor-pointer select-none items-center justify-between rounded-md px-2 py-3 text-sm text-foreground outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary hover:bg-primary/10 hover:text-primary active:scale-[0.98] mt-1 transition-all duration-200 relative z-50 pointer-events-auto"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowElbowDownLeft className="w-4 h-4 opacity-0 group-data-[selected=true]:opacity-100 transition-opacity text-primary" />
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Projects" className="px-2 pt-4 pb-2 text-xs font-medium text-muted-foreground">
                  {projectItems.map((item) => (
                    <Command.Item 
                      key={item.label}
                      value={item.value}
                      onSelect={() => runCommand(item.action, item.label)}
                      onPointerUp={() => runCommand(item.action, item.label)}
                      className="group flex cursor-pointer select-none items-center justify-between rounded-md px-2 py-3 text-sm text-foreground outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary hover:bg-primary/10 hover:text-primary active:scale-[0.98] mt-1 transition-all duration-200 relative z-50 pointer-events-auto"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowElbowDownLeft className="w-4 h-4 opacity-0 group-data-[selected=true]:opacity-100 transition-opacity text-primary" />
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Links & Socials" className="px-2 pt-4 pb-2 text-xs font-medium text-muted-foreground">
                  {linkItems.map((item) => (
                    <Command.Item 
                      key={item.label}
                      value={item.value}
                      onSelect={() => runCommand(item.action, item.label)}
                      onPointerUp={() => runCommand(item.action, item.label)}
                      className="group flex cursor-pointer select-none items-center justify-between rounded-md px-2 py-3 text-sm text-foreground outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary hover:bg-primary/10 hover:text-primary active:scale-[0.98] mt-1 transition-all duration-200 relative z-50 pointer-events-auto"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowElbowDownLeft className="w-4 h-4 opacity-0 group-data-[selected=true]:opacity-100 transition-opacity text-primary" />
                    </Command.Item>
                  ))}
                </Command.Group>

              </Command.List>
              
              <div className="flex items-center gap-4 border-t border-border px-4 py-3 bg-muted/20 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center justify-center w-5 h-5 bg-background border border-border rounded font-mono text-[10px]">↑</span>
                  <span className="flex items-center justify-center w-5 h-5 bg-background border border-border rounded font-mono text-[10px]">↓</span>
                  <span>navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center justify-center w-5 h-5 bg-background border border-border rounded font-mono text-[10px]">↵</span>
                  <span>open</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center justify-center px-1.5 h-5 bg-background border border-border rounded font-mono text-[10px]">Esc</span>
                  <span>close</span>
                </div>
              </div>
            </Command>
          </motion.div>
        </Command.Dialog>
      )}
    </AnimatePresence>
  )
}
