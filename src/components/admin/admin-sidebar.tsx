"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignOutButton } from "@/components/admin/sign-out-button"
import { 
  SquaresFour, 
  Article, 
  Briefcase, 
  TextT, 
  Image as ImageIcon, 
  ChatTeardropText, 
  TerminalWindow, 
  Robot,
  Gear,
  List,
  X
} from "@phosphor-icons/react"

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  
  if (pathname === "/admin/login") {
    return null
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: SquaresFour },
    { name: "Articles", href: "/admin/articles", icon: Article },
    { name: "Projects", href: "/admin/projects", icon: Briefcase },
    { name: "Site Content", href: "/admin/content", icon: TextT },
    { name: "Media", href: "/admin/media", icon: ImageIcon },
    { name: "Messages", href: "/admin/messages", icon: ChatTeardropText },
    { name: "Terminal", href: "/admin/terminal", icon: TerminalWindow },
    { name: "Mascot", href: "/admin/mascot", icon: Robot },
    { name: "Settings", href: "/admin/settings", icon: Gear },
  ]

  // Close sidebar on mobile when navigating
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-50 w-full">
        <Link href="/admin" className="text-xl font-heading font-semibold text-foreground hover:opacity-80 transition-opacity">
          Admin Panel
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 -mr-2 text-foreground hover:bg-muted rounded-md transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col h-[100dvh]
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:sticky md:top-0
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-border hidden md:block">
          <Link href="/admin" className="text-xl font-heading font-semibold text-foreground hover:opacity-80 transition-opacity block">
            Admin Panel
          </Link>
        </div>
        
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
          <Link href="/admin" className="text-xl font-heading font-semibold text-foreground hover:opacity-80 transition-opacity">
            Admin
          </Link>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 -mr-2 text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== "/admin"
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-md text-base md:text-sm font-medium transition-colors cursor-pointer ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-5 h-5 md:w-4 md:h-4 shrink-0" weight={isActive ? "fill" : "regular"} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border mt-auto">
          <SignOutButton />
        </div>
      </aside>
    </>
  )
}
