"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { upsertMascotLines } from "./actions"
import { FloppyDisk, Spinner, Smiley } from "@phosphor-icons/react/dist/ssr"
import { MascotEventState } from "@/lib/terminal/types"

interface MascotLine {
  id: string
  trigger: string
  line: string
}

// Default states to ensure they exist
const availableStates: MascotEventState[] = [
  "keystroke", "success", "error", "thinking", "celebrate", 
  "confused", "wave", "busy", "heart", "starstruck", 
  "blushing", "watching", "typing"
]

export function MascotEditor({ initialLines }: { initialLines: MascotLine[] }) {
  // Initialize state with all available states, prioritizing existing db values
  const [linesMap, setLinesMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    availableStates.forEach(state => map[state] = "")
    initialLines.forEach(l => {
      if (availableStates.includes(l.trigger as MascotEventState)) {
        map[l.trigger] = l.line
      }
    })
    return map
  })
  
  const [isPending, startTransition] = useTransition()

  const handleSave = async () => {
    const dataToSave = Object.entries(linesMap).map(([trigger, line]) => ({ trigger, line }))
    
    startTransition(async () => {
      const res = await upsertMascotLines(dataToSave)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Mascot lines saved successfully!")
      }
    })
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-md text-primary">
          <Smiley className="w-5 h-5" weight="duotone" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-foreground">Character Dialogue</h3>
          <p className="text-sm text-muted-foreground">Define what the mascot says for different interaction states. Leave empty to use defaults.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {availableStates.map(state => (
          <div key={state} className="space-y-2">
            <label className="text-sm font-medium text-foreground block capitalize">
              {state}
            </label>
            <input 
              type="text" 
              value={linesMap[state]}
              onChange={(e) => setLinesMap(prev => ({ ...prev, [state]: e.target.value }))}
              placeholder={`Default ${state} dialogue...`}
              disabled={isPending}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {isPending ? <Spinner className="w-5 h-5 animate-spin" /> : <FloppyDisk className="w-5 h-5" />}
          Save Lines
        </button>
      </div>
    </div>
  )
}
