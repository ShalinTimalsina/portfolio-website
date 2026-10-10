"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { upsertSiteContent, seedSiteContent, deleteSiteContent } from "./actions"
import { Database, FloppyDisk, CheckCircle, CircleNotch, Plus, Trash } from "@phosphor-icons/react/dist/ssr"

interface ContentItem {
  key: string
  value: string
  type: string
}

export function ContentEditor({ initialContent }: { initialContent: ContentItem[] }) {
  const [content, setContent] = useState<Record<string, string>>(
    initialContent.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {})
  )
  const [savingKeys, setSavingKeys] = useState<Record<string, boolean>>({})
  const [deletingKeys, setDeletingKeys] = useState<Record<string, boolean>>({})
  const [isPending, startTransition] = useTransition()
  


  // State for iOS style modal
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null)

  const handleSeed = () => {
    startTransition(async () => {
      const res = await seedSiteContent()
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Defaults seeded successfully!")
        window.location.reload()
      }
    })
  }

  const handleSave = async (key: string, type: string) => {
    const value = content[key]
    setSavingKeys(prev => ({ ...prev, [key]: true }))
    
    const res = await upsertSiteContent(key, value, type)
    
    setSavingKeys(prev => ({ ...prev, [key]: false }))
    
    if (res.error) {
      toast.error(`Failed to save ${key}`)
    } else {
      toast.success(`Saved ${key}`)
    }
  }

  const handleConfirmDelete = async () => {
    if (!keyToDelete) return
    const key = keyToDelete
    setKeyToDelete(null)
    
    setDeletingKeys(prev => ({ ...prev, [key]: true }))
    const res = await deleteSiteContent(key)
    if (res.error) {
      toast.error(res.error)
      setDeletingKeys(prev => ({ ...prev, [key]: false }))
    } else {
      toast.success(`Deleted ${key}`)
      setContent(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }



  const predefinedGroups: Record<string, string[]> = {
    Hero: ["hero.statusChip", "hero.heading", "hero.subheading", "hero.cta", "hero.secondaryCta"],
    Work: ["work.chip", "work.heading"],
    Skills: ["skills.chip", "skills.heading", "skills.list"],
    About: ["about.chip", "about.heading", "about.location", "about.bio", "about.links", "about.stats", "about.timeline"],
    Contact: ["contact.chip", "contact.heading", "contact.description", "contact.email", "contact.phone", "contact.github", "contact.linkedin"],
    Terminal: ["terminal.greeting"]
  }

  const predefinedKeys = Object.values(predefinedGroups).flat()
  const allKeys = Object.keys(content)
  const customKeys = allKeys.filter(k => !predefinedKeys.includes(k))

  const groups = {
    ...predefinedGroups,
    ...(customKeys.length > 0 ? { "Custom Elements": customKeys } : {})
  }

  const getType = (key: string) => {
    const existing = initialContent.find(c => c.key === key)
    if (existing) return existing.type
    if (key === "skills.list" || key.startsWith("about.") && ["links", "stats", "timeline"].some(t => key.includes(t))) return "json"
    if (key === "about.bio") return "richtext"
    if (key.includes("github") || key.includes("linkedin")) return "url"
    return "text"
  }

  return (
    <div className="space-y-8 relative">
      {initialContent.length === 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">No Content Found</h3>
            <p className="text-sm text-muted-foreground mt-1">Seed the database with default values to get started.</p>
          </div>
          <button 
            onClick={handleSeed}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isPending ? <CircleNotch className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
            Seed Defaults
          </button>
        </div>
      )}
      


      {Object.entries(groups).map(([groupName, keys]) => {
        if (keys.length === 0) return null;
        return (
          <div key={groupName} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground text-lg">{groupName}</h3>
            </div>
            <div className="p-6 space-y-6">
              {keys.map((key) => {
                const type = getType(key)
                const value = content[key] || ""
                const isSaving = savingKeys[key]
                const isDeleting = deletingKeys[key]
  
                return (
                  <div key={key} className="space-y-2 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-foreground">{key}</label>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">{type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSave(key, type)}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors cursor-pointer"
                        >
                          {isSaving ? <CircleNotch className="w-3.5 h-3.5 animate-spin" /> : <FloppyDisk className="w-3.5 h-3.5" />}
                          Save
                        </button>
                        <button
                          onClick={() => setKeyToDelete(key)}
                          disabled={isDeleting}
                          className="flex items-center justify-center w-7 h-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                          title="Delete Key"
                        >
                          {isDeleting ? <CircleNotch className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {type === "text" || type === "url" ? (
                      <input
                        type={type === "url" ? "url" : "text"}
                        value={value}
                        onChange={(e) => setContent(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                      />
                    ) : type === "richtext" ? (
                      <textarea
                        value={value}
                        onChange={(e) => setContent(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 min-h-[120px] text-sm font-medium"
                      />
                    ) : (
                      <textarea
                        value={value}
                        onChange={(e) => setContent(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 min-h-[200px] font-mono text-xs"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Delete Confirmation Modal (Consistent iOS Style) */}
      {keyToDelete && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-card text-center border border-border rounded-[24px] p-8 max-w-[320px] w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 text-red-500 mb-5">
              <Trash className="w-7 h-7" weight="regular" />
            </div>
            
            <h3 className="text-xl font-medium text-foreground mb-2">Delete content key?</h3>
            <p className="text-muted-foreground text-sm mb-8 break-all">
              Are you sure you want to delete <strong>{keyToDelete}</strong>? This action cannot be undone.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full px-5 py-3 text-sm font-medium bg-red-500 text-white hover:bg-red-600 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setKeyToDelete(null)}
                className="w-full px-5 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
