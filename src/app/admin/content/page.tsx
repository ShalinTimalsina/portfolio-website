import React from "react"
import { db } from "@/db"
import { siteContent } from "@/db/schema"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { ContentEditor } from "./content-editor"

export default async function ContentPage() {
  const allContent = await db.select().from(siteContent)

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">
      <div>
        <Link href="/admin" className="hidden md:inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-foreground">Site Content</h1>
            <p className="text-sm text-muted-foreground mt-2">Manage all the text, links, and data that power your portfolio.</p>
          </div>
        </div>
      </div>
      
      <ContentEditor initialContent={allContent} />
    </div>
  )
}
