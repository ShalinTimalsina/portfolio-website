import { db } from "@/db"
import { projects, messages, articles } from "@/db/schema"
import { count } from "drizzle-orm"

export default async function AdminDashboard() {
  const [projectsCount] = await db.select({ value: count() }).from(projects)
  const [messagesCount] = await db.select({ value: count() }).from(messages)
  const [articlesCount] = await db.select({ value: count() }).from(articles)

  return (
    <div className="space-y-6 p-8">
      <h2 className="text-3xl font-heading font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Total Projects</h3>
          <p className="text-3xl font-bold mt-2">{projectsCount.value}</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Messages</h3>
          <p className="text-3xl font-bold mt-2">{messagesCount.value}</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Articles</h3>
          <p className="text-3xl font-bold mt-2">{articlesCount.value}</p>
        </div>
      </div>
    </div>
  )
}
