"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

// Types of states our mascot can be in
type MascotState = 
  | "watching" 
  | "typing" 
  | "thinking" 
  | "success" 
  | "error" 
  | "sleeping" 
  | "wave" 
  | "idle"
  | "heart"
  | "starstruck"
  | "blushing"

// Map of reactions (row, col) in the 3x3 reactions.png grid
// Assumption based on typical 9-expression mapping (we will adjust if needed)
const REACTION_MAP = {
  grinning: { x: 0, y: 0 },
  heart: { x: 50, y: 0 },
  sparkles: { x: 100, y: 0 },
  surprised: { x: 0, y: 50 },
  starstruck: { x: 50, y: 50 },
  blushing: { x: 100, y: 50 },
  sleeping: { x: 0, y: 100 },
  dizzy: { x: 50, y: 100 },
  idle: { x: 100, y: 100 }, // fallback
}

export function MascotCompanion() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // State
  const [currentState, setCurrentState] = useState<MascotState>("idle")
  const [direction, setDirection] = useState({ x: 50, y: 50 }) // 50, 50 is center
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [speech, setSpeech] = useState<string | null>(null)
  
  const idleTimer = useRef<NodeJS.Timeout | null>(null)
  const sleepTimer = useRef<NodeJS.Timeout | null>(null)
  const speechTimer = useRef<NodeJS.Timeout | null>(null)

  const [processedDirections, setProcessedDirections] = useState<string | null>(null)
  const [processedReactions, setProcessedReactions] = useState<string | null>(null)

  // Initialization, Reduced Motion & Chroma Keying
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    setIsReducedMotion(mql.matches)
    
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    mql.addEventListener("change", handler)

    // Process Green Screen via Canvas
    const removeGreenScreen = (src: string, setter: (url: string) => void) => {
      const img = new Image()
      img.onload = () => {
        if (!img.naturalWidth || !img.naturalHeight) return
        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) return
        
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          const maxRb = Math.max(r, b)
          // Chroma Key + Despill algorithm
          if (g > maxRb) {
            const greenness = g - maxRb
            if (greenness > 15) {
              // Alpha mask based on greenness
              data[i + 3] = Math.max(0, 255 - greenness * 4)
              // Despill: cap the green channel to remove the halo
              data[i + 1] = maxRb
            }
          }
        }
        ctx.putImageData(imageData, 0, 0)
        setter(canvas.toDataURL("image/png"))
      }
      img.src = src
    }

    removeGreenScreen("/characters/shalin/directions.png", setProcessedDirections)
    removeGreenScreen("/characters/shalin/reactions.png", setProcessedReactions)

    return () => mql.removeEventListener("change", handler)
  }, [])

  // Cursor Tracking & Global Events
  useEffect(() => {
    if (isReducedMotion) return

    // Listen for custom events from other components (like the Terminal)
    const handleMascotEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ state: MascotState, message?: string }>
      setCurrentState(customEvent.detail.state)
      
      if (customEvent.detail.message) {
        setSpeech(customEvent.detail.message)
      }

      if (speechTimer.current) clearTimeout(speechTimer.current)
      
      // typing should revert quickly, others stay a bit longer
      const duration = customEvent.detail.state === "typing" ? 500 : 3000
      
      speechTimer.current = setTimeout(() => {
        setSpeech(null)
        setCurrentState("watching")
      }, duration)
    }
    window.addEventListener("mascot-action", handleMascotEvent)

    if (currentState !== "watching" && currentState !== "idle") {
      return () => {
        window.removeEventListener("mascot-action", handleMascotEvent)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      if (sleepTimer.current) clearTimeout(sleepTimer.current)
      
      if (currentState === "idle") {
        setCurrentState("watching")
      }

      if (!containerRef.current) return
      
      // Map cursor position relative to screen bounds (0-100%)
      const xPercent = (e.clientX / window.innerWidth) * 100
      const yPercent = (e.clientY / window.innerHeight) * 100
      
      let xPos = 50
      let yPos = 50
      
      // Snap to 0, 50, 100 based on thirds of the screen
      if (xPercent < 35) xPos = 0
      else if (xPercent > 65) xPos = 100
      
      if (yPercent < 35) yPos = 0
      else if (yPercent > 65) yPos = 100

      setDirection({ x: xPos, y: yPos })

      // Reset to idle after 5s of no movement
      idleTimer.current = setTimeout(() => {
        setCurrentState("idle")
        setDirection({ x: 50, y: 50 }) // Look forward
      }, 5000)

      // Sleep after 30s
      sleepTimer.current = setTimeout(() => {
        setCurrentState("sleeping")
      }, 30000)
    }

    // Throttle using requestAnimationFrame
    let ticking = false
    const throttledHandler = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleMouseMove(e)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("mousemove", throttledHandler)
    return () => {
      window.removeEventListener("mousemove", throttledHandler)
      window.removeEventListener("mascot-action", handleMascotEvent)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      if (sleepTimer.current) clearTimeout(sleepTimer.current)
    }
  }, [currentState, isReducedMotion])

  // Click interaction
  const handleClick = () => {
    setCurrentState("wave")
    setSpeech("All systems operational.")
    
    if (speechTimer.current) clearTimeout(speechTimer.current)
    speechTimer.current = setTimeout(() => {
      setSpeech(null)
      setCurrentState("watching")
    }, 3000)
  }

  // Determine what image and position to show
  const getSpriteStyles = () => {
    // Wait until images are processed
    if (!processedDirections || !processedReactions) return { opacity: 0 }

    let bgImage = `url(${processedDirections})`
    let bgPos = `${direction.x}% ${direction.y}%`

    if (currentState === "sleeping") {
      bgImage = `url(${processedReactions})`
      bgPos = `${REACTION_MAP.sleeping.x}% ${REACTION_MAP.sleeping.y}%`
    } else if (currentState === "wave") {
      bgImage = `url(${processedReactions})`
      bgPos = `${REACTION_MAP.grinning.x}% ${REACTION_MAP.grinning.y}%`
    } else if (currentState === "typing") {
      // Look down-center
      bgImage = `url(${processedDirections})`
      bgPos = `50% 100%` 
    } else if (currentState === "thinking") {
      bgImage = `url(${processedReactions})`
      bgPos = `${REACTION_MAP.surprised.x}% ${REACTION_MAP.surprised.y}%`
    } else if (currentState === "success") {
      bgImage = `url(${processedReactions})`
      bgPos = `${REACTION_MAP.sparkles.x}% ${REACTION_MAP.sparkles.y}%`
    } else if (currentState === "error") {
      bgImage = `url(${processedReactions})`
      bgPos = `${REACTION_MAP.dizzy.x}% ${REACTION_MAP.dizzy.y}%`
    } else if (currentState === "heart") {
      bgImage = `url(${processedReactions})`
      bgPos = `${REACTION_MAP.heart.x}% ${REACTION_MAP.heart.y}%`
    } else if (currentState === "starstruck") {
      bgImage = `url(${processedReactions})`
      bgPos = `${REACTION_MAP.starstruck.x}% ${REACTION_MAP.starstruck.y}%`
    } else if (currentState === "blushing") {
      bgImage = `url(${processedReactions})`
      bgPos = `${REACTION_MAP.blushing.x}% ${REACTION_MAP.blushing.y}%`
    }

    return {
      backgroundImage: bgImage,
      backgroundPosition: bgPos,
      backgroundSize: "300% 300%",
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-none">
      <AnimatePresence>
        {speech && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 15, scale: 0.9, rotate: 3 }}
            transition={{ type: "spring", stiffness: 120, damping: 15, mass: 1.2 }}
            className="absolute bottom-full right-4 mb-4 rounded-2xl rounded-br-sm bg-background border shadow-2xl p-3 px-4 max-w-[250px]"
          >
            <p className="text-sm font-medium text-foreground leading-tight text-wrap-pretty">
              {speech}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        ref={containerRef}
        onClick={handleClick}
        animate={{ y: [0, -6, 0] }}
        transition={{ 
          y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          default: { type: "spring", stiffness: 100, damping: 12, mass: 1 }
        }}
        whileHover={{ scale: 1.05, rotate: 3, y: -4 }}
        whileTap={{ scale: 0.9, rotate: -6 }}
        className="relative w-[120px] h-[120px] lg:w-[140px] lg:h-[140px] cursor-pointer pointer-events-auto drop-shadow-2xl"
        style={getSpriteStyles()}
        aria-label="Shalin's Mascot Companion"
        role="button"
        tabIndex={0}
      />
    </div>
  )
}
