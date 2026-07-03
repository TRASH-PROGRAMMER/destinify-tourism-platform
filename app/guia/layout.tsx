import type React from "react"
import { GuiaSidebar } from "@/components/guia/guia-sidebar"

export default function GuiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <GuiaSidebar />
      <main id="main-content" className="flex-1 min-w-0 overflow-x-auto">
        {children}
      </main>
    </div>
  )
}
