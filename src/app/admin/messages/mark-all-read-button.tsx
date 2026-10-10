"use client"
import { Checks, Spinner } from "@phosphor-icons/react"
import { useTransition } from "react"
import { markAllMessagesRead } from "./actions"
import { toast } from "sonner"

export function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition()

  const handleMarkAllRead = () => {
    startTransition(async () => {
      const res = await markAllMessagesRead()
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("All messages marked as read")
      }
    })
  }

  return (
    <button
      onClick={handleMarkAllRead}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {isPending ? <Spinner className="w-5 h-5 animate-spin" /> : <Checks className="w-5 h-5" />}
      Mark All Read
    </button>
  )
}
