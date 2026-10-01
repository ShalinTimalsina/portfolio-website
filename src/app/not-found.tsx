"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft, Terminal } from "@phosphor-icons/react"

export default function NotFound() {
  useEffect(() => {
    // Notify the mascot that something went wrong after mount
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("mascot-action", { 
        detail: { state: "error", message: "404: I can't find this page!" } 
      }))
    }, 100)
    
    return () => {
      clearTimeout(timer)
      window.dispatchEvent(new CustomEvent("mascot-action", { detail: { state: "watching" } }))
    }
  }, [])

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent-muted)_0%,transparent_60%)] opacity-30 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 flex flex-col items-center max-w-lg text-center"
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted border border-border mb-8 shadow-ambient">
          <Terminal className="w-8 h-8 text-muted-foreground" weight="duotone" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-heading font-semibold tracking-tight text-foreground mb-4">
          404
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          The requested route <span className="font-mono text-foreground bg-surface border border-border px-2 py-0.5 rounded text-sm">/</span> could not be resolved.
        </p>

        <Link 
          href="/"
          className="group relative inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-full overflow-hidden transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" weight="bold" />
          <span>Return to System Root</span>
        </Link>
      </motion.div>
    </div>
  )
}
