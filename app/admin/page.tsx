import Link from "next/link"
import { ArrowRight, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/admin/stat-card"
import { RevenueChart, BookingsChart, ServiceMixChart } from "@/components/admin/dashboard-charts"
import {
  reservations,
  notifications,
  reservationStatusLabels,
  formatCurrency,
  formatDate,
} from "@/lib/admin-data"

const statusStyles: Record<string, string> = {
  pendiente: "bg-accent/20 text-accent-foreground border-accent",
  confirmada: "bg-primary/15 text-primary border-primary/30",
  rechazada: "bg-destructive/10 text-destructive border-destructive/30",
  completada: "bg-muted text-muted-foreground border-border",
}

export default function AdminDashboardPage() {
  const pending = reservations.filter((r) => r.status === "pendiente")
  const recent = reservations.slice(0, 5)
  const unreadNotifs = notifications.filter((n) => !n.read)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground text-balance">Panel de Proveedor</h1>
          <p className="text-sm text-muted-foreground">Resumen de tu actividad y rendimiento</p>
        </div>
        {pending.length > 0 && (
          <Button asChild>
            <Link href="/admin/reservas">
              {pending.length} reserva{pending.length !== 1 ? "s" : ""} por revisar
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </header>

      {/* Metrics (Rf9) */}
      <section aria-label="Métricas de rendimiento" className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ingresos del mes"
          value={formatCurrency(8200)}
          icon="dollar"
          trend={{ value: "+10.8%", positive: true }}
        />
        <StatCard
          label="Reservas del mes"
          value="74"
          icon="calendar"
          trend={{ value: "+10.4%", positive: true }}
        />
        <StatCard
          label="Calificación media"
          value="4.7"
          icon="star"
          trend={{ value: "+0.2", positive: true }}
        />
        <StatCard
          label="Servicios activos"
          value="3"
          icon="package"
          trend={{ value: "-1", positive: false }}
        />
      </section>

      {/* Charts */}
      <section aria-label="Gráficas de rendimiento" className="mb-6 grid gap-4 lg:grid-cols-2">
        <RevenueChart />
        <BookingsChart />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent reservations */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Reservas recientes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/reservas">
                Ver todas
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recent.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{r.customerName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.serviceName} · {formatDate(r.date)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(r.amount)}</span>
                  <Badge variant="outline" className={statusStyles[r.status]}>
                    {reservationStatusLabels[r.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Service mix + notifications */}
        <div className="space-y-6">
          <ServiceMixChart />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
                Notificaciones
              </CardTitle>
              {unreadNotifs.length > 0 && (
                <Badge className="bg-accent text-accent-foreground">{unreadNotifs.length}</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
              ))}
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/admin/notificaciones">Ver todas</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
