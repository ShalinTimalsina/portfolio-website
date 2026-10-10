"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { upsertTerminalCommand, deleteTerminalCommand } from "./actions"
import { Plus, Trash, Spinner, FloppyDisk, TerminalWindow } from "@phosphor-icons/react/dist/ssr"

interface TerminalCommand {
  id: string
  command: string
  output: string
}

export function TerminalEditor({ initialCommands }: { initialCommands: TerminalCommand[] }) {
  const [commands, setCommands] = useState<TerminalCommand[]>(initialCommands)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // State for new/editing command
  const [formCommand, setFormCommand] = useState("")
  const [formOutput, setFormOutput] = useState("")
  const [isPending, startTransition] = useTransition()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleEdit = (cmd: TerminalCommand) => {
    setEditingId(cmd.id)
    setFormCommand(cmd.command)
    setFormOutput(cmd.output)
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormCommand("")
    setFormOutput("")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formCommand.trim() || !formOutput.trim()) {
      toast.error("Both command and output are required")
      return
    }

    startTransition(async () => {
      const res = await upsertTerminalCommand(formCommand, formOutput)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Command saved")
        window.location.reload() // Or we could optimize by updating state
      }
    })
  }

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteTerminalCommand(id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Command deleted")
        setDeleteConfirmId(null)
        setCommands(prev => prev.filter(c => c.id !== id))
      }
    })
  }

  const systemCommands = ["help", "clear", "contact", "theme", "sudo", "exit", "reboot", "shutdown", "cd", "ls", "pwd", "cat", "whoami", "skills"]
  const isSystemCommand = (cmd: string) => systemCommands.includes(cmd.toLowerCase())

  return (
    <div className="space-y-8 pb-24">
      {/* Editor Form */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          {editingId ? "Edit Command" : "Add New Command"}
        </h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Command Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input 
                type="text" 
                value={formCommand}
                onChange={(e) => setFormCommand(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                disabled={isPending || (editingId !== null && isSystemCommand(formCommand))}
                placeholder="my-command"
                className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 text-sm font-mono"
              />
            </div>
            {editingId && isSystemCommand(formCommand) && (
              <p className="text-xs text-muted-foreground mt-1">System commands cannot be renamed.</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Terminal Output</label>
            <textarea 
              value={formOutput}
              onChange={(e) => setFormOutput(e.target.value)}
              disabled={isPending}
              placeholder="Output text (supports markdown-like formatting for terminal)"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 min-h-[120px] font-mono text-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {isPending ? <Spinner className="w-4 h-4 animate-spin" /> : (editingId ? <FloppyDisk className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
              {editingId ? "Save Changes" : "Create Command"}
            </button>
          </div>
        </form>
      </div>

      {/* Command List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Defined Commands</h3>
        {commands.length === 0 ? (
          <div className="p-8 text-center bg-muted/30 border border-border rounded-xl">
            <TerminalWindow className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
            <p className="text-muted-foreground">No custom commands defined.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commands.map((cmd) => (
              <div key={cmd.id} className="bg-card border border-border rounded-xl p-5 flex flex-col hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-muted rounded text-xs font-mono text-foreground font-medium border border-border">
                      $ {cmd.command}
                    </span>
                    {isSystemCommand(cmd.command) && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-primary/80">System</span>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(cmd)}
                      className="px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    {!isSystemCommand(cmd.command) && (
                      <button
                        onClick={() => setDeleteConfirmId(cmd.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono line-clamp-3 bg-background p-3 rounded border border-border/50">
                  {cmd.output}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div className="bg-card text-center border border-border rounded-[24px] p-8 max-w-[320px] w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 text-red-500 mb-5">
              <Trash className="w-7 h-7" weight="regular" />
            </div>
            
            <h3 className="text-xl font-medium text-foreground mb-2">Delete command?</h3>
            <p className="text-muted-foreground text-sm mb-8">
              This action cannot be undone.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isPending}
                className="w-full px-5 py-3 text-sm font-medium bg-red-500 text-white hover:bg-red-600 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isPending ? <Spinner className="w-4 h-4 animate-spin" /> : null}
                Delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isPending}
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
