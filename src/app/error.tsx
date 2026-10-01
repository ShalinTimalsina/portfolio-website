"use client"

import React, { useEffect } from "react"
import { motion } from "motion/react"
import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Notify the mascot that something went wrong after mount
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("mascot-action", { 
        detail: { state: "error", message: "A critical runtime error occurred!" } 
      }))
    }, 100)
    
    // Log the error to an error reporting service in production
    console.error("Runtime Error Caught:", error)

    return () => clearTimeout(timer)
  }, [error])

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.1)_0%,transparent_60%)] opacity-50 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 flex flex-col items-center w-full max-w-lg"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
            <WarningCircle className="w-8 h-8 text-destructive" weight="duotone" />
          </div>
          
          <h1 className="text-3xl font-heading font-semibold tracking-tight text-foreground mb-3">
            System Error
          </h1>
          <p className="text-muted-foreground">
            An unexpected process exception occurred while rendering this interface.
          </p>
        </div>

        <div className="w-full bg-muted border border-border rounded-xl p-4 mb-8 font-mono text-sm overflow-x-auto">
          <div className="flex items-center gap-2 mb-2 text-destructive">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="font-semibold uppercase text-xs tracking-wider">Exception Details</span>
          </div>
          <p className="text-foreground/80 break-words">
            {error.message || "Unknown error"}
          </p>
          {error.digest && (
            <p className="text-muted-foreground mt-2 text-xs">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <button 
          onClick={() => reset()}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border text-foreground font-medium rounded-full overflow-hidden transition-all hover:border-foreground/30 active:scale-95"
        >
          <ArrowClockwise className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>Restart Process</span>
        </button>
      </motion.div>
    </div>
  )
}
