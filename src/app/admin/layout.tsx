import React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden min-h-screen md:min-h-0">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
