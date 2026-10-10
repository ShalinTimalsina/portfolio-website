"use server"

import { db } from "@/db"
import { messages } from "@/db/schema"

export async function sendMessage(data: { name: string, email: string, message: string }) {
  try {
    await db.insert(messages).values({
      name: data.name,
      email: data.email,
      message: data.message,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to save message:", error)
    return { error: "Failed to send message. Please try again later." }
  }
}
