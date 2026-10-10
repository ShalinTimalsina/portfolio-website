"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { mascotLines } from "@/db/schema"
import { revalidatePath } from "next/cache"

export async function upsertMascotLines(lines: { trigger: string, line: string }[]) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    // Delete existing lines that are not in the new array? No, just upsert all of them.
    for (const item of lines) {
      if (!item.line.trim()) continue; // Skip empty
      await db.insert(mascotLines)
        .values({ trigger: item.trigger, line: item.line })
        .onConflictDoUpdate({
          target: mascotLines.trigger,
          set: { line: item.line, updatedAt: new Date() }
        });
    }
    
    revalidatePath("/")
    revalidatePath("/admin/mascot")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to save mascot lines" }
  }
}
