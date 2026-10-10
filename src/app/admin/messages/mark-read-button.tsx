"use client"
import { Check, Spinner } from "@phosphor-icons/react"
import { useState, useTransition } from "react"
import { markMessageRead } from "./actions"
import { toast } from "sonner"

export function MarkReadButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleMarkRead = () => {
    startTransition(async () => {
      const res = await markMessageRead(id)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Message marked as read")
      }
    })
  }

  return (
    <button 
      onClick={handleMarkRead}
      disabled={isPending}
      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer disabled:opacity-50" 
      title="Mark as read"
    >
      {isPending ? <Spinner className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
    </button>
  )
}
