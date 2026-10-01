"use client"

import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "motion/react"
import { TerminalPanel } from "@/components/terminal/terminal-panel"
import { MascotCompanion } from "@/components/mascot/mascot-companion"
import { ArrowRight, EnvelopeSimple, TerminalWindow } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleExit = () => setIsTerminalOpen(false)
    window.addEventListener("term-exit", handleExit)
    return () => window.removeEventListener("term-exit", handleExit)
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
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className={cn(
        "container px-6 mx-auto max-w-7xl grid gap-12 lg:gap-8 items-center",
        isTerminalOpen ? "lg:grid-cols-2" : "lg:grid-cols-1 place-items-center text-center"
      )}>
        
        {/* Left: Copy & CTAs */}
        <motion.div 
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className={cn(
            "flex flex-col gap-6",
            isTerminalOpen ? "max-w-xl" : "max-w-3xl items-center"
          )}
        >
          {/* Status Chip */}
          <motion.div layout className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 w-fit">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary font-medium tracking-tight">
              Open to opportunities • All systems operational
            </span>
          </motion.div>

          <motion.div layout className="flex flex-col gap-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-semibold tracking-tight text-foreground">
              Shalin Timalsina.
            </h1>
            <p className={cn("text-xl sm:text-2xl text-muted-foreground leading-relaxed text-balance", !isTerminalOpen && "mx-auto")}>
              Cloud & DevOps Engineer in the making building resilient infrastructure and the interfaces to understand it.
            </p>
          </motion.div>

          <motion.div layout className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <button 
              onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "heart", message: "Let's do it!" } }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <EnvelopeSimple weight="bold" className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              Let's build together
            </button>
            <button 
              onMouseEnter={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "thinking", message: "Check out my work!" } }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))}
              onClick={() => { const el = document.getElementById("work"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" }) }}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted active:scale-[0.98] transition-all duration-200 font-medium cursor-pointer"
            >
              View Case Studies
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
          
          <motion.div layout className="pt-2">
            <span className="text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-2">
              Press <kbd className="px-2 py-0.5 rounded-md bg-muted text-xs border font-mono">{mounted && typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"} K</kbd> anywhere to search
            </span>
          </motion.div>
        </motion.div>

        {/* Right: Terminal (Animated between inline and fullscreen) */}
        <AnimatePresence>
          {isTerminalOpen && (
            <>
              {/* Fullscreen Backdrop */}
              {isTerminalExpanded && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md"
                  onClick={() => setIsTerminalExpanded(false)}
                />
              )}

              {/* The Terminal Container */}
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
                transition={{ duration: 0.5, type: "spring", bounce: 0 }}
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
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
