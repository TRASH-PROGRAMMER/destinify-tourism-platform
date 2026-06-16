"use client"

import { useState } from "react"
import { Bell, CalendarCheck, Star, Info, Check, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notifications as initialNotifications, type AdminNotification } from "@/lib/admin-data"
import { cn } from "@/lib/utils"

const typeConfig: Record<AdminNotification["type"], { icon: typeof Bell; className: string; label: string }> = {
  reserva: { icon: CalendarCheck, className: "bg-primary/10 text-primary", label: "Reserva" },
  resena: { icon: Star, className: "bg-accent/15 text-accent-foreground", label: "Reseña" },
  sistema: { icon: Info, className: "bg-muted text-muted-foreground", label: "Sistema" },
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  return `hace ${days} d`
}

export function NotificationsManager() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications)
  const [tab, setTab] = useState<"todas" | "sin-leer">("todas")
  const [announce, setAnnounce] = useState("")

  const unread = notifications.filter((n) => !n.read).length
  const filtered = tab === "sin-leer" ? notifications.filter((n) => !n.read) : notifications

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setAnnounce("Todas las notificaciones marcadas como leídas.")
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div aria-live="polite" className="sr-only" role="status">
        {announce}
      </div>

      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground text-balance">Notificaciones</h1>
          <p className="text-sm text-muted-foreground">
            {unread > 0 ? `Tienes ${unread} sin leer` : "Estás al día"}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" aria-hidden="true" />
            Marcar todas como leídas
          </Button>
        )}
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-6">
        <TabsList>
          <TabsTrigger value="todas">Todas ({notifications.length})</TabsTrigger>
          <TabsTrigger value="sin-leer">Sin leer ({unread})</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Bell className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No hay notificaciones para mostrar.</p>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-2">
          {filtered.map((n) => {
            const config = typeConfig[n.type]
            const Icon = config.icon
            return (
              <li key={n.id}>
                <Card className={cn(!n.read && "border-primary/40 bg-primary/[0.03]")}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", config.className)}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{n.title}</p>
                        {!n.read && (
                          <span
                            className="h-2 w-2 rounded-full bg-primary"
                            aria-label="Sin leer"
                          />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{n.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{relativeTime(n.date)}</p>
                    </div>
                    {!n.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markRead(n.id)}
                        aria-label={`Marcar "${n.title}" como leída`}
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
