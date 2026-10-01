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
  Gear
} from "@phosphor-icons/react"

export function AdminSidebar() {
  const pathname = usePathname()
  
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

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-heading font-semibold text-foreground">
          Admin Panel
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== "/admin"
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" weight={isActive ? "fill" : "regular"} />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <SignOutButton />
      </div>
    </aside>
  )
}
