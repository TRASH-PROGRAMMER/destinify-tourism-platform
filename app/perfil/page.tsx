"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  MapPin,
  Calendar,
  Star,
  Heart,
  Clock,
  Settings,
  Edit,
  ChevronRight,
  Sparkles,
  Mountain,
  Utensils,
  Camera,
  TreePine,
  Wallet,
  Users,
  Globe,
} from "lucide-react"

// Mock user data
const userData = {
  name: "María García",
  email: "maria@ejemplo.com",
  memberSince: "Marzo 2024",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  stats: {
    trips: 5,
    destinations: 12,
    reviews: 8,
    savedPlaces: 24,
  },
  interests: ["Aventura", "Gastronomía", "Fotografía", "Naturaleza"],
  preferences: {
    budget: "Moderado",
    travelStyle: "En pareja",
    language: "Español",
  },
}

const recentTrips = [
  {
    id: 1,
    destination: "Islas Galápagos",
    dates: "15-22 Febrero 2024",
    image: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=400&h=300&fit=crop",
    rating: 5,
    status: "completed",
  },
  {
    id: 2,
    destination: "Quito Centro Histórico",
    dates: "5-7 Enero 2024",
    image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=400&h=300&fit=crop",
    rating: 4,
    status: "completed",
  },
]

const savedDestinations = [
  {
    id: 1,
    name: "Cuenca Colonial",
    region: "Sierra",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Baños de Agua Santa",
    region: "Sierra",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Montañita",
    region: "Costa",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
  },
]

const interestIcons: Record<string, typeof Mountain> = {
  "Aventura": Mountain,
  "Gastronomía": Utensils,
  "Fotografía": Camera,
  "Naturaleza": TreePine,
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"trips" | "saved" | "reviews">("trips")
  const router = useRouter()

  // Heurística de Flexibilidad: Atajos de teclado (Aceleradores)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + N = Nuevo viaje
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault()
        router.push("/itinerarios/nuevo")
      }
      // Alt + C = Configuración
      if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault()
        router.push("/perfil/editar")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <main className="pt-20 pb-16">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-card shadow-lg"
                />
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-foreground">{userData.name}</h1>
                <p className="text-muted-foreground">{userData.email}</p>
                <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Miembro desde {userData.memberSince}</span>
                </div>

                {/* Interests */}
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  {userData.interests.map((interest) => {
                    const Icon = interestIcons[interest] || Heart
                    return (
                      <Badge key={interest} variant="secondary" className="gap-1.5">
                        <Icon className="h-3 w-3" />
                        {interest}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/perfil/editar">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Viajes", value: userData.stats.trips, icon: MapPin },
                { label: "Destinos", value: userData.stats.destinations, icon: Globe },
                { label: "Reseñas", value: userData.stats.reviews, icon: Star },
                { label: "Guardados", value: userData.stats.savedPlaces, icon: Heart },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl bg-card p-4 border border-border"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Preferences Card */}
          <div className="mb-8 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Mis preferencias</h2>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Presupuesto</p>
                  <p className="font-medium text-foreground">{userData.preferences.budget}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estilo de viaje</p>
                  <p className="font-medium text-foreground">{userData.preferences.travelStyle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Idioma</p>
                  <p className="font-medium text-foreground">{userData.preferences.language}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Recomendación personalizada</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Basado en tus intereses en aventura y naturaleza, te recomendamos visitar 
                  <strong className="text-foreground"> Baños de Agua Santa</strong>. Es perfecto para tu estilo de viaje 
                  y presupuesto moderado.
                </p>
                <Button size="sm" className="mt-3" asChild>
                  <Link href="/destinos/banos">
                    Ver destino
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <nav className="flex gap-6">
              {[
                { id: "trips", label: "Mis viajes" },
                { id: "saved", label: "Guardados" },
                { id: "reviews", label: "Reseñas" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "trips" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Viajes recientes</h3>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/itinerarios/nuevo">
                    Planificar nuevo viaje
                  </Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {recentTrips.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/itinerarios/${trip.id}`}
                    className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20"
                  >
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {trip.destination}
                      </h4>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {trip.dates}
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        {Array.from({ length: trip.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary" className="self-start">
                      Completado
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Destinos guardados</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {savedDestinations.map((dest) => (
                  <Link
                    key={dest.id}
                    href={`/destinos/${dest.id}`}
                    className="group relative overflow-hidden rounded-xl border border-border"
                  >
                    <div className="aspect-[4/3]">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="font-semibold text-white">{dest.name}</h4>
                      <p className="text-sm text-white/70">{dest.region}</p>
                    </div>
                    <button className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm">
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="text-center py-12">
              <Star className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold text-foreground">No hay reseñas aún</h3>
              <p className="mt-2 text-sm text-muted-foreground mb-4">
                Comparte tu experiencia después de tu próximo viaje
              </p>
              {/* Heurística 8: Diseño Minimalista / "No me hagas pensar". En lugar de un estado vacío muerto, proveemos la siguiente acción obvia */}
              <Button asChild>
                <Link href="/destinos">Explorar destinos</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      </ContextMenuTrigger>

        {/* Heurística de Flexibilidad: Menú Contextual (Clic Derecho) */}
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={() => router.push('/itinerarios/nuevo')} className="cursor-pointer">
            <MapPin className="mr-2 h-4 w-4" />
            Planificar nuevo viaje
            <ContextMenuShortcut>Alt+N</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => router.push('/perfil/editar')} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Configuración del perfil
            <ContextMenuShortcut>Alt+C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setActiveTab('saved')} className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            Ver destinos guardados
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Footer />
    </div>
  )
}
