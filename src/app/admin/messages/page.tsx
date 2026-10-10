import { db } from "@/db"
import { messages } from "@/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"
import { Envelope, EnvelopeOpen, ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { MarkReadButton } from "./mark-read-button"
import { MarkAllReadButton } from "./mark-all-read-button"
import { DeleteMessageButton } from "./delete-message-button"

export default async function MessagesPage() {
  const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt))
  const unreadCount = allMessages.filter((m) => !m.read).length

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">
      <div>
        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground mt-2">Manage contact form submissions.</p>
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>
    </div>

    <div className="bg-card border border-border rounded-xl overflow-x-auto overflow-y-hidden">
        {allMessages.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Envelope className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm">No messages yet.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 text-sm font-medium text-muted-foreground w-12">Status</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Sender</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Message</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Received</th>
                <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allMessages.map((msg) => (
                <tr key={msg.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${!msg.read ? 'bg-primary/5' : ''}`}>
                  <td className="p-4">
                    {msg.read ? (
                      <EnvelopeOpen className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <div className="relative">
                        <Envelope className="w-5 h-5 text-primary" weight="fill" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card"></span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className={`text-sm font-medium ${!msg.read ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.name}</p>
                    <a href={`mailto:${msg.email}`} className="text-xs text-primary hover:underline mt-0.5 inline-block">
                      {msg.email}
                    </a>
                  </td>
                  <td className="p-4">
                    <p className={`text-sm max-w-md ${!msg.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {msg.message}
                    </p>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!msg.read && <MarkReadButton id={msg.id} />}
                      <DeleteMessageButton id={msg.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
