"use server"

import { headers } from "next/headers"
import { db } from "@/db"
import { adminUsers } from "@/db/schema"
import bcrypt from "bcryptjs"

interface IpAttemptState {
  failures: number
  lastAttempt: number
  lockedUntil?: number
}

// In-memory rate limiting store (keyed by client IP)
const attemptStore = new Map<string, IpAttemptState>()
// Testing toggle: disable security lockout during testing
const ENABLE_LOCKOUT = false
const MAX_ATTEMPTS = 5
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

// Wipe any existing in-memory locks
attemptStore.clear()

function cleanupStaleAttempts() {
  if (!ENABLE_LOCKOUT) return
  const now = Date.now()
  for (const [ip, state] of attemptStore.entries()) {
    if (state.lockedUntil && state.lockedUntil < now) {
      attemptStore.delete(ip)
    } else if (now - state.lastAttempt > 30 * 60 * 1000) {
      attemptStore.delete(ip)
    }
  }
}

async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers()
    const forwarded = headersList.get("x-forwarded-for")
    if (forwarded) {
      return forwarded.split(",")[0].trim()
    }
    const realIp = headersList.get("x-real-ip")
    if (realIp) return realIp.trim()
  } catch {
    // Fallback if headers cannot be resolved
  }
  return "127.0.0.1"
}

export interface TerminalAuthStatus {
  locked: boolean
  error?: string
  remainingMinutes?: number
}

export async function checkTerminalAuthStatus(): Promise<TerminalAuthStatus> {
  if (!ENABLE_LOCKOUT) {
    return { locked: false }
  }

  cleanupStaleAttempts()
  const ip = await getClientIp()
  const state = attemptStore.get(ip)
  const now = Date.now()

  if (state?.lockedUntil && state.lockedUntil > now) {
    const remainingMinutes = Math.ceil((state.lockedUntil - now) / 60000)
    return {
      locked: true,
      remainingMinutes,
      error: `Security lockout: Terminal authentication is locked for ${remainingMinutes} more minute(s) due to repeated failed attempts.`
    }
  }

  return { locked: false }
}

export interface TerminalVerifyResult {
  success: boolean
  username?: string
  error?: string
  locked?: boolean
  attemptsRemaining?: number
}

export async function verifyTerminalAdminLogin(password: string): Promise<TerminalVerifyResult> {
  // Zero artificial delay for instant testing response
  await new Promise((r) => setTimeout(r, 0))
  
  if (ENABLE_LOCKOUT) {
    cleanupStaleAttempts()
    const ip = await getClientIp()
    const now = Date.now()
    const state = attemptStore.get(ip)

    if (state?.lockedUntil && state.lockedUntil > now) {
      const remainingMinutes = Math.ceil((state.lockedUntil - now) / 60000)
      return {
        success: false,
        locked: true,
        error: `Terminal authentication is locked. Please try again in ${remainingMinutes} minute(s).`
      }
    }
  }

  let matchedUsername: string | null = null

  // 1. Check against registered PostgreSQL admin users
  try {
    const users = await db.select().from(adminUsers)
    for (const user of users) {
      const isMatch = await bcrypt.compare(password, user.passwordHash)
      if (isMatch) {
        matchedUsername = user.username
        break
      }
    }
  } catch (err) {
    console.error("Database query error during terminal admin auth:", err)
  }

  // 2. Check environment variable fallback
  if (!matchedUsername) {
    const envUser = process.env.ADMIN_USERNAME || "admin"
    const envPass = process.env.ADMIN_PASSWORD
    const secretPass = process.env.SECRET_TERMINAL_PASSWORD

    if (envPass && password === envPass) {
      matchedUsername = envUser
    } else if (secretPass && password === secretPass) {
      matchedUsername = envUser
    }
  }

  if (matchedUsername) {
    attemptStore.clear()
    return {
      success: true,
      username: matchedUsername
    }
  }

  // Failed attempt: no lockout during testing
  if (ENABLE_LOCKOUT) {
    const ip = await getClientIp()
    const now = Date.now()
    let state = attemptStore.get(ip)
    if (!state) {
      state = { failures: 1, lastAttempt: now }
      attemptStore.set(ip, state)
    } else {
      state.failures += 1
      state.lastAttempt = now
    }

    if (state.failures >= MAX_ATTEMPTS) {
      state.lockedUntil = now + LOCKOUT_WINDOW_MS
      return {
        success: false,
        locked: true,
        error: "Too many failed authentication attempts. Terminal access locked for 15 minutes."
      }
    }
  }

  return {
    success: false,
    error: "Authentication failure. Incorrect password."
  }
}
