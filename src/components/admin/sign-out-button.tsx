"use client"
import { SignOut } from "@phosphor-icons/react"
import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button 
      onClick={() => {
        signOut({ callbackUrl: "/" })
      }}
      className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
    >
      <SignOut className="w-4 h-4" />
      Sign Out
    </button>
  )
}
