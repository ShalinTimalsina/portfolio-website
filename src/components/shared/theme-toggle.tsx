"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "motion/react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleSetTheme = (e: CustomEvent<{ theme: string }>) => {
      setTheme(e.detail.theme)
    }
    window.addEventListener("set-theme" as any, handleSetTheme)
    return () => window.removeEventListener("set-theme" as any, handleSetTheme)
  }, [setTheme])

  if (!mounted) return null

  return (
    <button
      onClick={() => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        window.dispatchEvent(new CustomEvent("mascot-action", { 
          detail: { state: "success", message: newTheme === "dark" ? "Going dark!" : "Let there be light!" } 
        }))
      }}
      className="fixed top-4 right-4 md:top-6 md:right-6 z-50 p-2.5 md:p-3 rounded-full border border-border bg-background/50 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95 shadow-sm cursor-pointer"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="dark"
            initial={{ opacity: 0, rotate: -180, scale: 0.5, filter: "blur(4px)" }}
            animate={{ opacity: 1, rotate: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, rotate: 180, scale: 0.5, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Moon className="w-5 h-5" weight="duotone" />
          </motion.div>
        ) : (
          <motion.div
            key="light"
            initial={{ opacity: 0, rotate: 180, scale: 0.5, filter: "blur(4px)" }}
            animate={{ opacity: 1, rotate: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, rotate: -180, scale: 0.5, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Sun className="w-5 h-5" weight="duotone" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
