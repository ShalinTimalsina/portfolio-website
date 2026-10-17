"use client"

import { MagnifyingGlass } from "@phosphor-icons/react"

export function MobileNavTrigger() {
  return (
    <button
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-command-palette"))
        window.dispatchEvent(new CustomEvent("mascot-action", { 
          detail: { state: "thinking", message: "Where to?" } 
        }))
      }}
      className="lg:hidden min-w-12 min-h-12 p-2.5 md:p-3 rounded-full border border-border bg-background/50 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95 shadow-sm cursor-pointer inline-flex items-center justify-center"
      aria-label="Open Search & Navigation"
      title="Search (Tap)"
    >
      <MagnifyingGlass className="w-5 h-5" weight="bold" />
    </button>
  )
}
