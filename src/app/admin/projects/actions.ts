"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
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

export async function updateProject(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const longDescription = formData.get("longDescription") as string;
  const coverImage = formData.get("coverImage") as string;
  
  const techStackString = formData.get("techStack") as string;
  const techStack = techStackString 
    ? techStackString.split(",").map(t => t.trim()).filter(Boolean) 
    : [];

  const liveUrl = formData.get("liveUrl") as string;
  const repoUrl = formData.get("repoUrl") as string;
  const featured = formData.get("featured") === "on";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  
  const isPublished = formData.get("isPublished") === "on";
  
  const [existing] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  
  let publishedAt = existing?.publishedAt;
  if (isPublished && !existing?.publishedAt) {
    publishedAt = new Date();
  } else if (!isPublished) {
    publishedAt = null;
  }

  await db
    .update(projects)
    .set({
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
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/");
  
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await db.delete(projects).where(eq(projects.id, id));

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  
  return { success: true };
}

export async function toggleProjectPublish(id: string, currentlyPublished: boolean) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await db
    .update(projects)
    .set({ publishedAt: currentlyPublished ? null : new Date() })
    .where(eq(projects.id, id));

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  
  return { success: true };
}

export async function toggleProjectFeatured(id: string, currentlyFeatured: boolean) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await db
    .update(projects)
    .set({ featured: !currentlyFeatured })
    .where(eq(projects.id, id));

  revalidatePath("/admin/projects");
  revalidatePath("/");
  
  return { success: true };
}
