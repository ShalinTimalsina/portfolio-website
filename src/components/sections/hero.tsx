"use client"

import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "motion/react"
import { TerminalPanel } from "@/components/terminal/terminal-panel"
import { MascotCompanion } from "@/components/mascot/mascot-companion"
import { ArrowRight, EnvelopeSimple, TerminalWindow, MagnifyingGlass } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export function HeroSection({ content = {}, customCommands = [] }: { content?: Record<string, any>, customCommands?: any[] }) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleExit = () => setIsTerminalOpen(false)
    const handleOpen = () => {
      setIsTerminalOpen(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
      // Always dispatch focus event — handles "already open" case too
      setTimeout(() => window.dispatchEvent(new CustomEvent("term-focus")), 200)
    }
    const handleFullscreen = () => setIsTerminalExpanded(prev => !prev)
    
    window.addEventListener("term-exit", handleExit)
    window.addEventListener("term-open", handleOpen)
    window.addEventListener("term-fullscreen", handleFullscreen)
    
    return () => {
      window.removeEventListener("term-exit", handleExit)
      window.removeEventListener("term-open", handleOpen)
      window.removeEventListener("term-fullscreen", handleFullscreen)
    }
  }, [])

  // Lock body scroll when terminal is fullscreen
  useEffect(() => {
    if (isTerminalExpanded) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isTerminalExpanded])

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-12 overflow-hidden">
      
      {/* Background Ambient Glows */}
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none will-change-transform" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none will-change-transform" 
      />
      
      <div className={cn(
        "container px-6 mx-auto max-w-7xl grid gap-12 lg:gap-8 items-center",
        isTerminalOpen ? "lg:grid-cols-2" : "lg:grid-cols-1 place-items-center text-center"
      )}>
        
        {/* Left: Copy & CTAs */}
        <motion.div 
          layout
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.1 }
            }
          }}
          className={cn(
            "flex flex-col gap-6 items-center lg:items-start text-center lg:text-left",
            isTerminalOpen ? "max-w-xl mx-auto lg:mx-0" : "max-w-3xl items-center text-center mx-auto"
          )}
        >
          <motion.div 
            layout 
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } }
            }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border bg-muted/50 w-fit"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-2 h-2 rounded-full bg-primary animate-ping opacity-75 will-change-transform" />
              <div className="relative w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,200,150,0.5)]" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-foreground">
              {content["hero.statusChip"] || "Open to Opportunities"}
            </span>
          </motion.div>

          <motion.div 
            layout 
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } }
            }}
            className="flex flex-col gap-4 items-center lg:items-start w-full"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-semibold tracking-tight text-foreground text-center lg:text-left">
              {content["hero.heading"] || "Shalin Timalsina."}
            </h1>
            <h2 className={cn("text-xl sm:text-2xl text-muted-foreground leading-relaxed text-balance font-normal text-center lg:text-left", !isTerminalOpen && "mx-auto")}>
              {content["hero.subheading"] || "Cloud & DevOps Engineer in the making building resilient infrastructure and the interfaces to understand it."}
            </h2>
          </motion.div>

          <motion.div 
            layout 
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } }
            }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <button 
              onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "heart", message: "Let's do it!" } }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <EnvelopeSimple weight="bold" className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              {content["hero.cta"] || "Let's build together"}
            </button>
            <button 
              onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "thinking", message: "Check out my work!" } }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
              onClick={() => { const el = document.getElementById("work"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" }) }}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted active:scale-[0.98] transition-all duration-200 font-medium cursor-pointer"
            >
              {content["hero.secondaryCta"] || "View Case Studies"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            {!isTerminalOpen && (
              <button 
                onClick={() => setIsTerminalOpen(true)}
                onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "excited", message: "Boot it up!" } }))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 active:scale-[0.98] transition-all duration-200 font-medium cursor-pointer"
              >
                <TerminalWindow weight="duotone" className="w-5 h-5" />
                Initialize Shell
              </button>
            )}
          </motion.div>
          
          <motion.div 
            layout 
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } }
            }}
            className="pt-2 flex justify-center lg:justify-start w-full"
          >
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-command-palette"))
                window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "thinking", message: "Searching..." } }))
              }}
              className="group/kbd inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[44px] sm:min-h-0 rounded-full border border-border bg-muted/50 hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
              aria-label="Open Command Search"
            >
              <MagnifyingGlass className="w-3.5 h-3.5 text-primary" weight="bold" />
              {/* Desktop / Keyboard view */}
              <span className="hidden sm:inline-flex items-center gap-1.5">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background text-[11px] border font-mono font-medium group-hover/kbd:border-primary/40 transition-colors">
                  {mounted && typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"} K
                </kbd>
                <span>to search</span>
              </span>
              {/* Mobile touch view */}
              <span className="inline-flex sm:hidden">
                Tap to search
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Right: Terminal (Animated between inline and fullscreen) */}
        <AnimatePresence>
          {isTerminalOpen && isTerminalExpanded && (
            <motion.div 
              key="terminal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md"
              onClick={() => setIsTerminalExpanded(false)}
            />
          )}
          {isTerminalOpen && (
            <motion.div
              key="terminal-container"
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.15 }}
              className={cn(
                "flex justify-end",
                isTerminalExpanded 
                  ? "fixed inset-4 md:inset-10 z-[9999]" 
                  : "relative w-full z-10"
              )}
            >
              <TerminalPanel 
                onClose={() => {
                  setIsTerminalExpanded(false)
                  setIsTerminalOpen(false)
                }} 
                isExpanded={isTerminalExpanded}
                onExpand={() => setIsTerminalExpanded(!isTerminalExpanded)}
                greeting={content["terminal.greeting"]}
                customCommands={customCommands}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
