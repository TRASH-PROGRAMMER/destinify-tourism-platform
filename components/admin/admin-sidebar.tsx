"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Star,
  Bell,
  Menu,
  X,
  LogOut,
  Compass,
  UserPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { notifications } from "@/lib/admin-data"

const navItems = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/servicios", label: "Servicios", icon: Package },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarCheck },
  { href: "/admin/resenas", label: "Reseñas", icon: Star },
  { href: "/admin/notificaciones", label: "Notificaciones", icon: Bell },
  { href: "/admin/registro", label: "Registro de proveedor", icon: UserPlus },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const unread = notifications.filter((n) => !n.read).length

  const NavLinks = () => (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Navegación del panel">
      {navItems.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-11",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
            {item.href === "/admin/notificaciones" && unread > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto bg-accent text-accent-foreground"
                aria-label={`${unread} sin leer`}
              >
                {unread}
              </Badge>
            )}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
          <Compass className="h-6 w-6 text-primary" aria-hidden="true" />
          Destinify
          <span className="text-xs font-normal text-muted-foreground">Proveedor</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-b border-border bg-card px-4 py-4 lg:hidden">
          <NavLinks />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card p-4 lg:flex">
        <Link
          href="/admin"
          className="mb-6 flex items-center gap-2 px-2 font-serif text-xl font-bold text-foreground"
        >
          <Compass className="h-7 w-7 text-primary" aria-hidden="true" />
          <span>
            Destinify
            <span className="block text-xs font-normal text-muted-foreground">Panel de Proveedor</span>
          </span>
        </Link>
        <NavLinks />
        <div className="mt-auto border-t border-border pt-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">LC</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">La Casona Turismo</p>
              <p className="truncate text-xs text-muted-foreground">proveedor@lacasona.ec</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="mt-1 w-full justify-start text-muted-foreground">
            <Link href="/iniciar-sesion">
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Cerrar sesión
            </Link>
          </Button>
        </div>
      </aside>
    </>
  )
}
