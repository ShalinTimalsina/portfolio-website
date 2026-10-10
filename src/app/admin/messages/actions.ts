"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function markMessageRead(id: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  await db
    .update(messages)
    .set({ read: true })
    .where(eq(messages.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/messages");

  return { success: true };
}

export async function markAllMessagesRead() {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  await db
    .update(messages)
    .set({ read: true })
    .where(eq(messages.read, false));

  revalidatePath("/admin");
  revalidatePath("/admin/messages");

  return { success: true };
}

export async function deleteMessage(id: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  await db
    .delete(messages)
    .where(eq(messages.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/messages");

  return { success: true };
}
