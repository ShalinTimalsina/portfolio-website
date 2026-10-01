"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const longDescription = formData.get("longDescription") as string;
  const coverImage = formData.get("coverImage") as string;
  
  // Tech stack comes in as a comma-separated string
  const techStackString = formData.get("techStack") as string;
  const techStack = techStackString 
    ? techStackString.split(",").map(t => t.trim()).filter(Boolean) 
    : [];

  const liveUrl = formData.get("liveUrl") as string;
  const repoUrl = formData.get("repoUrl") as string;
  const featured = formData.get("featured") === "on";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  
  // If "publish" is checked, set publishedAt to now, else null
  const isPublished = formData.get("isPublished") === "on";
  const publishedAt = isPublished ? new Date() : null;

  await db.insert(projects).values({
    title,
    slug,
    description,
    longDescription: longDescription || null,
    coverImage: coverImage || null,
    techStack,
    liveUrl: liveUrl || null,
    repoUrl: repoUrl || null,
    featured,
    sortOrder,
    publishedAt,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/"); // in case featured changes
  
  redirect("/admin/projects");
}
