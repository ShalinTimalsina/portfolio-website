"use client"

import { useEffect } from "react"

export default function DemoErrorPage() {
  // We throw an error immediately upon mounting this component
  // to deliberately trigger the error.tsx boundary.
  useEffect(() => {
    throw new Error("Simulated core system failure. This was triggered intentionally for demonstration purposes.")
  }, [])

  return null
}
