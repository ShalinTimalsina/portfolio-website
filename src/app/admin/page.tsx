import { db } from "@/db"
import { projects, messages, articles, media } from "@/db/schema"
import { count, desc, eq, isNotNull, isNull } from "drizzle-orm"
import Link from "next/link"
import { ArrowRight, EnvelopeSimple, Folder, FileText, CheckCircle, Image as ImageIcon, TerminalWindow } from "@phosphor-icons/react/dist/ssr"
import { MarkReadButton } from "./messages/mark-read-button"
import { cn } from "@/lib/utils"

function formatRelativeTime(date: Date) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const daysDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const hoursDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60))
  const minutesDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60))
  
  if (Math.abs(daysDifference) > 0) return rtf.format(daysDifference, 'day')
  if (Math.abs(hoursDifference) > 0) return rtf.format(hoursDifference, 'hour')
  return rtf.format(minutesDifference, 'minute')
}

export default async function AdminDashboard() {
  // Stats
  const [totalProjects] = await db.select({ value: count() }).from(projects)
  const [publishedProjects] = await db.select({ value: count() }).from(projects).where(isNotNull(projects.publishedAt))
  const [draftProjects] = await db.select({ value: count() }).from(projects).where(isNull(projects.publishedAt))
  
  const [totalArticles] = await db.select({ value: count() }).from(articles)
  const [unreadMessages] = await db.select({ value: count() }).from(messages).where(eq(messages.read, false))
  const [totalMedia] = await db.select({ value: count() }).from(media)

  // Recent Unread Messages (Last 5)
  const recentMessages = await db.select().from(messages).where(eq(messages.read, false)).orderBy(desc(messages.createdAt)).limit(5)

  // Recent Projects (Last 3)
  const recentProjects = await db.select().from(projects).orderBy(desc(projects.createdAt)).limit(3)

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          System Online
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          href="/admin/projects" 
          className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between hover:bg-muted/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Projects</h3>
            <Folder className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-heading font-bold text-foreground">{totalProjects.value}</p>
            <p className="text-xs text-muted-foreground">{publishedProjects.value} published</p>
          </div>
        </Link>
        
        <Link 
          href="/admin/messages"
          className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between hover:bg-muted/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Unread Messages</h3>
            <EnvelopeSimple className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className={cn("text-3xl font-heading font-bold", unreadMessages.value > 0 ? "text-primary" : "text-foreground")}>
            {unreadMessages.value}
          </p>
        </Link>
        
        <Link 
          href="/admin/articles"
          className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between hover:bg-muted/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Articles</h3>
            <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">{totalArticles.value}</p>
        </Link>

        <div className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between opacity-50 cursor-not-allowed">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Media Files (Soon)</h3>
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">{totalMedia.value}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Unread Messages Feed */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-heading font-semibold text-foreground">Recent Unread Messages</h3>
              <Link href="/admin/messages" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                <CheckCircle className="w-8 h-8 mb-2 opacity-50" />
                <p>Inbox zero! No unread messages.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="p-6 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{msg.name}</p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {formatRelativeTime(msg.createdAt)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 truncate">{msg.email}</p>
                      <p className="text-sm text-foreground line-clamp-2">{msg.message}</p>
                    </div>
                    <div className="shrink-0 ml-4">
                      <MarkReadButton id={msg.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Projects */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-heading font-semibold text-foreground">Recent Projects</h3>
              <Link href="/admin/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {recentProjects.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No projects yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{project.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-[300px]">{project.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                        project.publishedAt
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {project.publishedAt ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-heading font-semibold text-foreground">Quick Actions</h3>
            </div>
            <div className="p-2 flex flex-col gap-1">
              <Link href="/admin/projects/new" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors text-sm text-foreground">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <Folder className="w-4 h-4" />
                </div>
                New Project
              </Link>
              <Link href="/admin/articles" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors text-sm text-foreground">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <FileText className="w-4 h-4" />
                </div>
                New Article
              </Link>
              <Link href="/admin/content" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors text-sm text-foreground">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <ImageIcon className="w-4 h-4" />
                </div>
                Edit Site Content
              </Link>
              <Link href="/admin/terminal" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors text-sm text-foreground">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <TerminalWindow className="w-4 h-4" />
                </div>
                Terminal Commands
              </Link>
              <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors text-sm text-foreground border-t border-border mt-2 pt-4">
                <div className="p-2 bg-muted rounded-md text-muted-foreground">
                  <ArrowRight className="w-4 h-4" />
                </div>
                View Live Site
              </a>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Database</span>
                <span className="text-emerald-500 font-medium">Connected</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Auth</span>
                <span className="text-emerald-500 font-medium">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
