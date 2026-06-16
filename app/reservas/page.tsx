"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Filter,
  Hotel,
  Car,
  Utensils,
  Mountain,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const reservations = [
  {
    id: "RES-001",
    type: "hotel",
    name: "Hotel Finch Bay Eco",
    description: "Habitación doble con vista al mar",
    destination: "Islas Galápagos",
    date: "15-22 Marzo 2024",
    status: "confirmed",
    price: 1250,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    confirmationCode: "FB-2024-8472",
    contact: {
      email: "reservas@finchbay.com",
      phone: "+593 5 252 6297",
    },
  },
  {
    id: "RES-002",
    type: "activity",
    name: "Tour Snorkel Los Túneles",
    description: "Snorkel con tiburones, tortugas y caballitos de mar",
    destination: "Isla Isabela",
    date: "17 Marzo 2024",
    status: "confirmed",
    price: 180,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    confirmationCode: "SNK-789",
    contact: {
      email: "tours@isabelaexplorer.com",
      phone: "+593 99 123 4567",
    },
  },
  {
    id: "RES-003",
    type: "transport",
    name: "Vuelo Quito - Baltra",
    description: "LATAM LA123 - Ida y vuelta",
    destination: "Aeropuerto Baltra",
    date: "15 Marzo 2024 - 08:30",
    status: "confirmed",
    price: 420,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
    confirmationCode: "LATAM-ABC123",
    contact: {
      email: "servicio@latam.com",
      phone: "1-800-LATAM",
    },
  },
  {
    id: "RES-004",
    type: "restaurant",
    name: "Restaurante Alma del Mar",
    description: "Cena para 2 personas - Menú degustación",
    destination: "Puerto Ayora",
    date: "16 Marzo 2024 - 19:30",
    status: "pending",
    price: 85,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    confirmationCode: "Pendiente",
    contact: {
      email: "reservas@almadelmar.ec",
      phone: "+593 5 252 4321",
    },
  },
  {
    id: "RES-005",
    type: "activity",
    name: "Kayak Bahía Tortuga",
    description: "Tour guiado en kayak - 3 horas",
    destination: "Santa Cruz",
    date: "18 Marzo 2024 - 09:00",
    status: "cancelled",
    price: 65,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    confirmationCode: "KYK-456",
    contact: {
      email: "info@kayaktortuga.com",
      phone: "+593 99 876 5432",
    },
  },
]

const typeIcons: Record<string, typeof Hotel> = {
  hotel: Hotel,
  activity: Mountain,
  transport: Car,
  restaurant: Utensils,
}

const typeLabels: Record<string, string> = {
  hotel: "Alojamiento",
  activity: "Actividad",
  transport: "Transporte",
  restaurant: "Restaurante",
}

const statusConfig = {
  confirmed: {
    label: "Confirmada",
    icon: CheckCircle,
    variant: "default" as const,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  pending: {
    label: "Pendiente",
    icon: AlertCircle,
    variant: "secondary" as const,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  cancelled: {
    label: "Cancelada",
    icon: XCircle,
    variant: "outline" as const,
    color: "text-red-600",
    bg: "bg-red-100",
  },
}

export default function ReservationsPage() {
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReservations = reservations.filter((res) => {
    const matchesStatus = filter === "all" || res.status === filter
    const matchesType = typeFilter === "all" || res.type === typeFilter
    const matchesSearch =
      searchQuery === "" ||
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.confirmationCode.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  const totalConfirmed = reservations
    .filter((r) => r.status === "confirmed")
    .reduce((sum, r) => sum + r.price, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mis Reservas</h1>
              <p className="mt-1 text-muted-foreground">
                Gestiona todas tus reservas en un solo lugar.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total confirmado</p>
                <p className="text-2xl font-bold text-foreground">${totalConfirmed}</p>
              </div>
              <Button asChild>
                <Link href="/reservar">Nueva reserva</Link>
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, destino o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Tipo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTypeFilter("all")}>
                  Todos los tipos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("hotel")}>
                  <Hotel className="h-4 w-4 mr-2" />
                  Alojamiento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("activity")}>
                  <Mountain className="h-4 w-4 mr-2" />
                  Actividades
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("transport")}>
                  <Car className="h-4 w-4 mr-2" />
                  Transporte
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("restaurant")}>
                  <Utensils className="h-4 w-4 mr-2" />
                  Restaurantes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: "all", label: "Todas", count: reservations.length },
              { id: "confirmed", label: "Confirmadas", count: reservations.filter((r) => r.status === "confirmed").length },
              { id: "pending", label: "Pendientes", count: reservations.filter((r) => r.status === "pending").length },
              { id: "cancelled", label: "Canceladas", count: reservations.filter((r) => r.status === "cancelled").length },
            ].map((item) => (
              <Button
                key={item.id}
                variant={filter === item.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter(item.id as typeof filter)}
                className="gap-2"
              >
                {item.label}
                <Badge variant="outline" className="h-5 px-1.5">
                  {item.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Reservations List */}
          {filteredReservations.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No hay reservas
              </h3>
              <p className="mt-2 text-muted-foreground">
                No se encontraron reservas con los filtros seleccionados.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setFilter("all")
                  setTypeFilter("all")
                  setSearchQuery("")
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReservations.map((reservation) => {
                const TypeIcon = typeIcons[reservation.type]
                const status = statusConfig[reservation.status as keyof typeof statusConfig]
                const StatusIcon = status.icon

                return (
                  <div
                    key={reservation.id}
                    className={`rounded-2xl border bg-card overflow-hidden transition-all hover:shadow-md ${
                      reservation.status === "cancelled" ? "opacity-75" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="relative h-48 sm:h-auto sm:w-48 lg:w-56 shrink-0">
                        <img
                          src={reservation.image}
                          alt={reservation.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge
                            className={`${status.bg} ${status.color} border-0 gap-1`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
                                <TypeIcon className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground">
                                {typeLabels[reservation.type]}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {reservation.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {reservation.description}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold text-foreground">
                              ${reservation.price}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {reservation.type === "hotel" ? "total" : "por persona"}
                            </p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{reservation.destination}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{reservation.date}</span>
                          </div>
                        </div>

                        {/* Confirmation & Contact */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground">Código de confirmación</p>
                            <p className="font-mono font-medium text-foreground">
                              {reservation.confirmationCode}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {reservation.status === "confirmed" && (
                              <>
                                <Button variant="outline" size="sm" className="gap-1.5">
                                  <Download className="h-3.5 w-3.5" />
                                  Voucher
                                </Button>
                                <Button variant="outline" size="sm" className="gap-1.5">
                                  <Mail className="h-3.5 w-3.5" />
                                  Contactar
                                </Button>
                              </>
                            )}
                            {reservation.status === "pending" && (
                              <Button size="sm">
                                Completar reserva
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Modificar reserva
                                </DropdownMenuItem>
                                {reservation.status !== "cancelled" && (
                                  <DropdownMenuItem className="text-destructive">
                                    Cancelar reserva
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Summary Card */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Resumen de reservas</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(typeLabels).map(([type, label]) => {
                const Icon = typeIcons[type]
                const count = reservations.filter((r) => r.type === type && r.status === "confirmed").length
                const total = reservations
                  .filter((r) => r.type === type && r.status === "confirmed")
                  .reduce((sum, r) => sum + r.price, 0)

                return (
                  <div key={type} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="font-semibold text-foreground">
                        {count} {count === 1 ? "reserva" : "reservas"} - ${total}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
