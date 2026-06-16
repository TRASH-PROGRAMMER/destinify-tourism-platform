"use client"

import { useState } from "react"
import {
  Check,
  X,
  Search,
  Calendar,
  Users,
  Mail,
  Phone,
  Hotel,
  Compass,
  UtensilsCrossed,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  reservations as initialReservations,
  reservationStatusLabels,
  serviceTypeLabels,
  formatCurrency,
  formatDate,
  type Reservation,
  type ReservationStatus,
  type ServiceType,
} from "@/lib/admin-data"
import { cn } from "@/lib/utils"

const typeIcons: Record<ServiceType, typeof Hotel> = {
  hotel: Hotel,
  tour: Compass,
  restaurante: UtensilsCrossed,
}

const statusStyles: Record<ReservationStatus, string> = {
  pendiente: "bg-accent/20 text-accent-foreground border-accent",
  confirmada: "bg-primary/15 text-primary border-primary/30",
  rechazada: "bg-destructive/10 text-destructive border-destructive/30",
  completada: "bg-muted text-muted-foreground border-border",
}

type TabValue = "todas" | ReservationStatus

export function ReservationsManager() {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [tab, setTab] = useState<TabValue>("todas")
  const [query, setQuery] = useState("")
  const [detail, setDetail] = useState<Reservation | null>(null)
  const [announce, setAnnounce] = useState("")

  const counts = {
    todas: reservations.length,
    pendiente: reservations.filter((r) => r.status === "pendiente").length,
    confirmada: reservations.filter((r) => r.status === "confirmada").length,
    rechazada: reservations.filter((r) => r.status === "rechazada").length,
    completada: reservations.filter((r) => r.status === "completada").length,
  }

  const filtered = reservations
    .filter((r) => (tab === "todas" ? true : r.status === tab))
    .filter(
      (r) =>
        r.customerName.toLowerCase().includes(query.toLowerCase()) ||
        r.serviceName.toLowerCase().includes(query.toLowerCase()) ||
        r.id.toLowerCase().includes(query.toLowerCase()),
    )

  function updateStatus(id: string, status: ReservationStatus) {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    const r = reservations.find((x) => x.id === id)
    setAnnounce(
      status === "confirmada"
        ? `Reserva ${id} de ${r?.customerName} confirmada.`
        : `Reserva ${id} de ${r?.customerName} rechazada.`,
    )
    setDetail(null)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div aria-live="polite" className="sr-only" role="status">
        {announce}
      </div>

      <header className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground text-balance">Gestión de Reservas</h1>
        <p className="text-sm text-muted-foreground">
          Revisa, confirma o rechaza las solicitudes y consulta el historial completo
        </p>
      </header>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="todas">Todas ({counts.todas})</TabsTrigger>
            <TabsTrigger value="pendiente">Pendientes ({counts.pendiente})</TabsTrigger>
            <TabsTrigger value="confirmada">Confirmadas ({counts.confirmada})</TabsTrigger>
            <TabsTrigger value="rechazada">Rechazadas ({counts.rechazada})</TabsTrigger>
            <TabsTrigger value="completada">Historial ({counts.completada})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:max-w-xs">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Buscar por cliente, servicio o código"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Buscar reservas"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No se encontraron reservas con los filtros actuales.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const TypeIcon = typeIcons[r.serviceType]
            return (
              <Card key={r.id}>
                <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <TypeIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">{r.customerName}</p>
                        <Badge variant="outline" className={cn("text-xs", statusStyles[r.status])}>
                          {reservationStatusLabels[r.status]}
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">{r.serviceName}</p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatDate(r.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" aria-hidden="true" />
                          {r.guests} {r.guests === 1 ? "persona" : "personas"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 lg:justify-end">
                    <span className="text-lg font-bold text-foreground">{formatCurrency(r.amount)}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetail(r)}
                        aria-label={`Ver detalle de la reserva ${r.id}`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only sm:ml-1.5">Detalle</span>
                      </Button>
                      {r.status === "pendiente" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(r.id, "confirmada")}
                            aria-label={`Confirmar reserva ${r.id}`}
                          >
                            <Check className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                            <span className="hidden sm:inline">Confirmar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(r.id, "rechazada")}
                            aria-label={`Rechazar reserva ${r.id}`}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                            <span className="hidden sm:inline">Rechazar</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="sm:max-w-md">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Reserva {detail.id}
                  <Badge variant="outline" className={statusStyles[detail.status]}>
                    {reservationStatusLabels[detail.status]}
                  </Badge>
                </DialogTitle>
                <DialogDescription>{serviceTypeLabels[detail.serviceType]} · {detail.serviceName}</DialogDescription>
              </DialogHeader>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Cliente</dt>
                  <dd className="font-medium text-foreground">{detail.customerName}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Correo
                  </dt>
                  <dd className="text-foreground">{detail.customerEmail}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Teléfono
                  </dt>
                  <dd className="text-foreground">{detail.customerPhone}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Fecha del servicio</dt>
                  <dd className="text-foreground">{formatDate(detail.date)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Personas</dt>
                  <dd className="text-foreground">{detail.guests}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Solicitada el</dt>
                  <dd className="text-foreground">{formatDate(detail.createdAt)}</dd>
                </div>
                {detail.notes && (
                  <div className="rounded-lg bg-muted p-3">
                    <dt className="mb-1 text-xs font-medium text-muted-foreground">Nota del cliente</dt>
                    <dd className="text-foreground">{detail.notes}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t border-border pt-3">
                  <dt className="font-medium text-foreground">Total</dt>
                  <dd className="text-lg font-bold text-foreground">{formatCurrency(detail.amount)}</dd>
                </div>
              </dl>

              {detail.status === "pendiente" && (
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => updateStatus(detail.id, "confirmada")}>
                    <Check className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    Confirmar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => updateStatus(detail.id, "rechazada")}
                  >
                    <X className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    Rechazar
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
