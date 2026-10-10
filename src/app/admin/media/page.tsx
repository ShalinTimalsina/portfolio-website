import React from "react"
import { db } from "@/db"
import { media } from "@/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"

export default async function MediaPage() {
  const allMedia = await db.select().from(media).orderBy(desc(media.uploadedAt))

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">
      <div>
        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-foreground">Media</h1>
            <p className="text-sm text-muted-foreground mt-2">Manage your uploaded assets and files.</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground text-sm">Manage your uploaded assets.</p>
        <p className="text-sm mt-2">{allMedia.length} files.</p>
        {/* TODO: Add Media Grid and Upload */}
      </div>
    </div>
  )
}
