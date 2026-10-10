"use client";

import { Trash, Spinner } from "@phosphor-icons/react";
import { useTransition, useState } from "react";
import { deleteProject } from "./actions";
import { toast } from "sonner";

export function DeleteProjectButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
    startTransition(async () => {
      const res = await deleteProject(id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Project deleted");
      }
    });
  };

  return (
    <>
      <button 
        onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
        disabled={isPending}
        className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer disabled:opacity-50"
        title="Delete project"
      >
        {isPending ? <Spinner className="w-5 h-5 animate-spin" /> : <Trash className="w-5 h-5" />}
      </button>

      {showConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-card text-center border border-border rounded-[24px] p-8 max-w-[320px] w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 text-red-500 mb-5">
              <Trash className="w-7 h-7" weight="regular" />
            </div>
            
            <h3 className="text-xl font-medium text-foreground mb-2">Delete project?</h3>
            <p className="text-muted-foreground text-sm mb-8">
              This action cannot be undone.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="w-full px-5 py-3 text-sm font-medium bg-red-500 text-white hover:bg-red-600 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isPending ? <Spinner className="w-4 h-4 animate-spin" /> : null}
                Delete
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                disabled={isPending}
                className="w-full px-5 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
