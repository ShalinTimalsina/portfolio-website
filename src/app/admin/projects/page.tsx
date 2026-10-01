import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";

export default async function ProjectsAdminPage() {
  const allProjects = await db.select().from(projects).orderBy(desc(projects.sortOrder), desc(projects.createdAt));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your portfolio case studies and side projects.</p>
        </div>
        <Link 
          href="/admin/projects/new" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-5 h-5" weight="bold" />
          New Project
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {allProjects.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 opacity-50" />
            </div>
            <p>No projects found. Create your first one!</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 font-medium text-muted-foreground">Title</th>
                <th className="p-4 font-medium text-muted-foreground">Status</th>
                <th className="p-4 font-medium text-muted-foreground">Featured</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProjects.map((project) => (
                <tr key={project.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-foreground">{project.title}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-md">{project.description}</p>
                  </td>
                  <td className="p-4">
                    {project.publishedAt ? (
                      <span className="px-2 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-500 rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-amber-500/10 text-amber-500 rounded-full">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {project.featured ? "Yes" : "No"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/projects/${project.id}/edit`}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                      >
                        <PencilSimple className="w-5 h-5" />
                      </Link>
                      <button className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer">
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
