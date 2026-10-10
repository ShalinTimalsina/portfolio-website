"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FloppyDisk, ArrowLeft, CaretDown, CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react"
import Link from "next/link"
import { createArticle, updateArticle } from "./actions"

type ArticleInput = {
  id?: string;
  title: string;
  url: string;
  publisher: string;
  publishedAt: string;
}

const PUBLISHERS = [
  "Medium",
  "Hashnode",
  "Dev.to",
  "FreeCodeCamp",
  "Personal Blog",
  "Other"
]

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

export function ArticleForm({ initialData }: { initialData?: ArticleInput }) {
  const [isPending, setIsPending] = useState(false)
  const [publisher, setPublisher] = useState(initialData?.publisher || "Medium")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Custom Date Picker State
  const [publishedAt, setPublishedAt] = useState(initialData?.publishedAt || new Date().toISOString().split('T')[0])
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    if (initialData?.publishedAt) {
      return new Date(initialData.publishedAt)
    }
    return new Date()
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const isEditing = !!initialData?.id

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    
    // Ensure custom state values are in formData
    formData.set("publisher", publisher)
    formData.set("publishedAt", publishedAt)
    
    try {
      if (isEditing) {
        const res = await updateArticle(initialData!.id!, formData)
        if (res?.error) {
          toast.error(res.error)
          setIsPending(false)
        }
      } else {
        await createArticle(formData)
      }
    } catch (err: any) {
      if (err.message !== "NEXT_REDIRECT") {
        toast.error(err.message || "Something went wrong")
        setIsPending(false)
      }
    }
  }

  // Date Picker Helpers
  const currentYear = viewDate.getFullYear()
  const currentMonthIndex = viewDate.getMonth()
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay()
  
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonthIndex - 1, 1))
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonthIndex + 1, 1))
  
  const handleSelectDate = (day: number) => {
    // Format to YYYY-MM-DD safely taking local timezone into account
    const d = new Date(currentYear, currentMonthIndex, day)
    // Offset timezone to avoid UTC boundary issues
    const offset = d.getTimezoneOffset()
    d.setMinutes(d.getMinutes() - offset)
    setPublishedAt(d.toISOString().split('T')[0])
    setIsDatePickerOpen(false)
  }

  // Format date for display: "MM/DD/YYYY"
  const formattedDisplayDate = (() => {
    if (!publishedAt) return ""
    const [y, m, d] = publishedAt.split('-')
    return `${m}/${d}/${y}`
  })()

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-24">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/articles"
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-semibold text-foreground">
            {isEditing ? "Edit Article" : "New Article"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? "Update your external article details." : "Add a link to a new external blog post."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={initialData?.title}
              disabled={isPending}
              placeholder="e.g. How I built a custom OS in React"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">URL</label>
            <input
              name="url"
              type="url"
              required
              defaultValue={initialData?.url}
              disabled={isPending}
              placeholder="https://medium.com/..."
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom Publisher Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Publisher</label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isPending}
                className={`w-full text-left pl-4 pr-10 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 cursor-pointer ${isDropdownOpen ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
              >
                {publisher}
                <CaretDown className={`w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-background border border-border rounded-lg shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                  {PUBLISHERS.map((pub) => (
                    <button
                      key={pub}
                      type="button"
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted cursor-pointer ${
                        publisher === pub ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                      }`}
                      onClick={() => {
                        setPublisher(pub)
                        setIsDropdownOpen(false)
                      }}
                    >
                      {pub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Custom Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Published Date</label>
            <div className="relative" ref={datePickerRef}>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                disabled={isPending}
                className={`w-full flex items-center gap-3 pl-4 pr-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 cursor-pointer ${isDatePickerOpen ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
              >
                <CalendarBlank className={`w-5 h-5 ${isDatePickerOpen ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{formattedDisplayDate}</span>
              </button>

              {isDatePickerOpen && (
                <div className="absolute z-10 right-0 mt-2 p-4 bg-background border border-border rounded-xl shadow-xl w-[280px] animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer">
                      <CaretLeft className="w-5 h-5" />
                    </button>
                    <div className="font-medium text-sm">
                      {MONTHS[currentMonthIndex]} {currentYear}
                    </div>
                    <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer">
                      <CaretRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {DAYS.map(day => (
                      <div key={day} className="text-xs font-medium text-muted-foreground py-1">{day}</div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {days.map((day, idx) => {
                      if (!day) return <div key={`empty-${idx}`} />
                      
                      const d = new Date(currentYear, currentMonthIndex, day)
                      const offset = d.getTimezoneOffset()
                      d.setMinutes(d.getMinutes() - offset)
                      const dateString = d.toISOString().split('T')[0]
                      const isSelected = dateString === publishedAt
                      
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleSelectDate(day)}
                          className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
                              : 'hover:bg-muted text-foreground'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border mt-6">
          <Link
            href="/admin/articles"
            className="px-6 py-2.5 text-muted-foreground hover:text-foreground font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            <FloppyDisk className="w-5 h-5" />
            {isPending ? "Saving..." : "Save Article"}
          </button>
        </div>
      </form>
    </div>
  )
}
