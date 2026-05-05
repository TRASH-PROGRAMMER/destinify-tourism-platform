"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  MoreHorizontal,
  Sparkles,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const itineraries = [
  {
    id: 1,
    name: "Aventura en Galápagos",
    destination: "Islas Galápagos",
    status: "upcoming",
    startDate: "15 Mar 2024",
    endDate: "22 Mar 2024",
    days: 7,
    travelers: 2,
    image: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=600&h=400&fit=crop",
    progress: 100,
    totalCost: 2890,
  },
  {
    id: 2,
    name: "Escape Cultural Quito",
    destination: "Quito Centro Histórico",
    status: "draft",
    startDate: "5 Abr 2024",
    endDate: "8 Abr 2024",
    days: 3,
    travelers: 2,
    image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=600&h=400&fit=crop",
    progress: 60,
    totalCost: 450,
  },
  {
    id: 3,
    name: "Adrenalina en Baños",
    destination: "Baños de Agua Santa",
    status: "completed",
    startDate: "10 Feb 2024",
    endDate: "14 Feb 2024",
    days: 4,
    travelers: 4,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
    progress: 100,
    totalCost: 1200,
  },
]

const statusConfig = {
  upcoming: { label: "Próximo", variant: "default" as const, color: "bg-primary" },
  draft: { label: "Borrador", variant: "secondary" as const, color: "bg-muted" },
  completed: { label: "Completado", variant: "outline" as const, color: "bg-accent" },
}

export default function ItinerariesPage() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "draft" | "completed">("all")

  const filteredItineraries = itineraries.filter(
    (itinerary) => filter === "all" || itinerary.status === filter
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mis Itinerarios</h1>
              <p className="mt-1 text-muted-foreground">
                Planifica y gestiona todos tus viajes en un solo lugar.
              </p>
            </div>
            <Button asChild>
              <Link href="/itinerarios/nuevo">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo itinerario
              </Link>
            </Button>
          </div>

          {/* AI Suggestion */}
          <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Sugerencia personalizada</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Basado en tu perfil, te recomiendo agregar una visita a la <strong className="text-foreground">Laguna Quilotoa</strong> 
                  a tu itinerario de Quito. Está a solo 3 horas y es perfecta para los amantes de la naturaleza.
                </p>
                <Button size="sm" variant="link" className="mt-2 h-auto p-0 text-primary">
                  Ver sugerencia completa
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: "all", label: "Todos" },
              { id: "upcoming", label: "Próximos" },
              { id: "draft", label: "Borradores" },
              { id: "completed", label: "Completados" },
            ].map((item) => (
              <Button
                key={item.id}
                variant={filter === item.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter(item.id as typeof filter)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Itineraries List */}
          {filteredItineraries.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No hay itinerarios
              </h3>
              <p className="mt-2 text-muted-foreground">
                Crea tu primer itinerario para comenzar a planificar tu viaje.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/itinerarios/nuevo">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear itinerario
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItineraries.map((itinerary) => {
                const status = statusConfig[itinerary.status as keyof typeof statusConfig]
                return (
                  <div
                    key={itinerary.id}
                    className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-md hover:border-primary/20"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="relative h-48 sm:h-auto sm:w-48 lg:w-64 shrink-0">
                        <img
                          src={itinerary.image}
                          alt={itinerary.name}
                          className="h-full w-full object-cover"
                        />
                        <Badge
                          variant={status.variant}
                          className="absolute top-3 left-3"
                        >
                          {status.label}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              href={`/itinerarios/${itinerary.id}`}
                              className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                            >
                              {itinerary.name}
                            </Link>
                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{itinerary.destination}</span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Details */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{itinerary.startDate} - {itinerary.endDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{itinerary.days} días</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{itinerary.travelers} viajeros</span>
                          </div>
                        </div>

                        {/* Progress & Cost */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Planificación</span>
                              <span className="font-medium text-foreground">{itinerary.progress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${itinerary.progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Costo total</p>
                            <p className="font-bold text-foreground">${itinerary.totalCost}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" asChild>
                            <Link href={`/itinerarios/${itinerary.id}`}>
                              Ver itinerario
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </Button>
                          {itinerary.status === "draft" && (
                            <Button size="sm" variant="outline">
                              Continuar planificando
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
