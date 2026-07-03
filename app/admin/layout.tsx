import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <AdminSidebar />
      <main id="main-content" className="flex-1 min-w-0 overflow-x-auto">
        {children}
      </main>
    </div>
  )
}
