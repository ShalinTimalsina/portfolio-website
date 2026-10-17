"use client"

import React, { useEffect, useState } from "react"
import { ThemeToggle } from "./theme-toggle"
import { MobileNavTrigger } from "./mobile-nav-trigger"
import { cn } from "@/lib/utils"

export function HeaderActions() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const detail = (e as CustomEvent<{ open: boolean }>).detail
      setIsPaletteOpen(detail.open)
    }
    window.addEventListener("palette-toggle", handleToggle)
    return () => window.removeEventListener("palette-toggle", handleToggle)
  }, [])

  return (
    <header 
      className={cn(
        "fixed top-4 right-4 md:top-6 md:right-6 z-[60] flex items-center gap-2 transition-all duration-200",
        isPaletteOpen ? "opacity-0 pointer-events-none scale-95 -translate-y-2" : "opacity-100 pointer-events-auto scale-100 translate-y-0"
      )}
    >
      <MobileNavTrigger />
      <ThemeToggle />
    </header>
  )
}
