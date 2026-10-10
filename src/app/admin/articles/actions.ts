"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createArticle(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const publisher = formData.get("publisher") as string;
  const publishedAt = formData.get("publishedAt") as string;

  if (!title || !url || !publisher || !publishedAt) {
    throw new Error("Missing required fields");
  }

  await db.insert(articles).values({
    title,
    url,
    publisher,
    publishedAt: new Date(publishedAt),
  });

  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const publisher = formData.get("publisher") as string;
  const publishedAt = formData.get("publishedAt") as string;

  if (!title || !url || !publisher || !publishedAt) {
    throw new Error("Missing required fields");
  }

  await db
    .update(articles)
    .set({
      title,
      url,
      publisher,
      publishedAt: new Date(publishedAt),
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id));

  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  await db.delete(articles).where(eq(articles.id, id));

  revalidatePath("/");
  revalidatePath("/admin/articles");
  return { success: true };
}
