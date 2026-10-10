import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProjectForm } from "../../project-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

  if (!project) {
    notFound();
  }

  return (
    <ProjectForm 
      initialData={{
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        longDescription: project.longDescription,
        coverImage: project.coverImage,
        techStack: project.techStack,
        liveUrl: project.liveUrl,
        repoUrl: project.repoUrl,
        featured: project.featured,
        sortOrder: project.sortOrder,
        isPublished: !!project.publishedAt,
      }} 
    />
  );
}
