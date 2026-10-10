import React from "react"
import { db } from "@/db"
import { terminalContent } from "@/db/schema"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { TerminalEditor } from "./terminal-editor"
import { desc } from "drizzle-orm"

export default async function TerminalAdminPage() {
  const allCommands = await db.select().from(terminalContent).orderBy(desc(terminalContent.updatedAt))

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 pb-24">
      <div>
        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-foreground">Terminal Content</h1>
            <p className="text-sm text-muted-foreground mt-2">Manage custom commands and their outputs for the simulated terminal.</p>
          </div>
        </div>
      </div>
      
      <TerminalEditor initialCommands={allCommands} />
    </div>
  )
}
