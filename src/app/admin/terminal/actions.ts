"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { terminalContent } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function upsertTerminalCommand(command: string, output: string) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const formattedCommand = command.trim().toLowerCase()
    
    await db.insert(terminalContent)
      .values({ command: formattedCommand, output })
      .onConflictDoUpdate({
        target: terminalContent.command,
        set: { output, updatedAt: new Date() }
      })
    
    revalidatePath("/")
    revalidatePath("/admin/terminal")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to save command" }
  }
}

export async function deleteTerminalCommand(id: string) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    await db.delete(terminalContent).where(eq(terminalContent.id, id))
    revalidatePath("/")
    revalidatePath("/admin/terminal")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to delete command" }
  }
}
