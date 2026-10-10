"use client";

import { useState } from "react";
import Link from "next/link";
import { createProject, updateProject } from "./actions";
import { toast } from "sonner";
import { ArrowLeft, FloppyDisk } from "@phosphor-icons/react";

type ProjectInput = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string | null;
  coverImage: string | null;
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  sortOrder: number;
  isPublished: boolean;
}

export function ProjectForm({ initialData }: { initialData?: ProjectInput }) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (isEditing) {
        const res = await updateProject(initialData.id!, formData);
        if (res?.error) {
          toast.error(res.error);
          setIsLoading(false);
        }
      } else {
        await createProject(formData);
      }
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error(error.message || "Failed to save project");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-24">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/projects"
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-semibold text-foreground">
            {isEditing ? "Edit Project" : "New Project"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? "Update your case study details." : "Create a new case study or side project."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Project Title</label>
              <input
                name="title"
                type="text"
                required
                defaultValue={initialData?.title}
                disabled={isLoading}
                placeholder="e.g. Acme Corp Infrastructure"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">URL Slug</label>
              <input
                name="slug"
                type="text"
                required
                defaultValue={initialData?.slug}
                disabled={isLoading}
                placeholder="e.g. acme-corp"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Short Description</label>
            <textarea
              name="description"
              required
              rows={2}
              defaultValue={initialData?.description}
              disabled={isLoading}
              placeholder="A one-sentence summary of the project."
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center justify-between">
              Long Description (MDX)
              <span className="text-xs text-muted-foreground font-normal">Supports Markdown</span>
            </label>
            <textarea
              name="longDescription"
              rows={8}
              defaultValue={initialData?.longDescription || ""}
              disabled={isLoading}
              placeholder="## Overview\n\nDetailed case study goes here..."
              className="w-full px-4 py-2 font-mono text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 resize-y"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-heading font-semibold">Links & Metadata</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tech Stack (comma-separated)</label>
            <input
              name="techStack"
              type="text"
              required
              defaultValue={initialData?.techStack.join(", ")}
              disabled={isLoading}
              placeholder="React, TypeScript, AWS, Docker"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Live URL (optional)</label>
              <input
                name="liveUrl"
                type="url"
                defaultValue={initialData?.liveUrl || ""}
                disabled={isLoading}
                placeholder="https://"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Repo URL (optional)</label>
              <input
                name="repoUrl"
                type="url"
                defaultValue={initialData?.repoUrl || ""}
                disabled={isLoading}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cover Image URL (optional)</label>
            <input
              name="coverImage"
              type="text"
              defaultValue={initialData?.coverImage || ""}
              disabled={isLoading}
              placeholder="/images/projects/acme.png"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-wrap gap-8 items-center">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              disabled={isLoading}
              defaultChecked={initialData ? initialData.isPublished : true}
              className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-foreground select-none cursor-pointer">
              Publish immediately
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              disabled={isLoading}
              defaultChecked={initialData?.featured}
              className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary/50 cursor-pointer"
            />
            <label htmlFor="featured" className="text-sm font-medium text-foreground select-none cursor-pointer">
              Feature on Home Page
            </label>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <label htmlFor="sortOrder" className="text-sm font-medium text-foreground">
              Sort Order
            </label>
            <input
              type="number"
              id="sortOrder"
              name="sortOrder"
              defaultValue={initialData?.sortOrder ?? 0}
              disabled={isLoading}
              className="w-24 px-3 py-1.5 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/projects"
            className="px-6 py-2.5 text-muted-foreground hover:text-foreground font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            <FloppyDisk className="w-5 h-5" />
            {isLoading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
