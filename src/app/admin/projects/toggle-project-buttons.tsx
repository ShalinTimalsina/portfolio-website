"use client";

import { useTransition } from "react";
import { toggleProjectPublish, toggleProjectFeatured } from "./actions";
import { toast } from "sonner";
import { Spinner } from "@phosphor-icons/react";

export function TogglePublishButton({ id, isPublished }: { id: string, isPublished: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleProjectPublish(id, isPublished);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(isPublished ? "Project unpublished" : "Project published");
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`px-2 py-1 flex items-center justify-center min-w-[72px] text-xs font-medium rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
        isPublished 
          ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" 
          : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
      }`}
    >
      {isPending ? <Spinner className="w-3 h-3 animate-spin" /> : (isPublished ? "Published" : "Draft")}
    </button>
  );
}

export function ToggleFeaturedButton({ id, isFeatured }: { id: string, isFeatured: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleProjectFeatured(id, isFeatured);
      if (res?.error) {
        toast.error(res.error);
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`px-2 py-1 flex items-center justify-center min-w-[48px] text-xs font-medium rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
        isFeatured 
          ? "bg-primary/10 text-primary hover:bg-primary/20" 
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {isPending ? <Spinner className="w-3 h-3 animate-spin" /> : (isFeatured ? "Yes" : "No")}
    </button>
  );
}
