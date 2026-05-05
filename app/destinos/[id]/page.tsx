import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  MapPin,
  Star,
  Clock,
  Calendar,
  Users,
  Heart,
  Share2,
  ChevronRight,
  Check,
  Info,
  Sun,
  Cloud,
  Thermometer,
  ArrowRight,
  Sparkles,
} from "lucide-react"

const destinationsData: Record<string, {
  id: string
  name: string
  region: string
  description: string
  longDescription: string
  rating: number
  reviews: number
  tags: string[]
  image: string
  gallery: string[]
  price: number
  duration: string
  difficulty: string
  highlights: string[]
  included: string[]
  bestTime: string
  weather: { temp: string; condition: string }
  activities: { name: string; duration: string; price: number }[]
}> = {
  galapagos: {
    id: "galapagos",
    name: "Islas Galápagos",
    region: "Región Insular",
    description: "Explora la biodiversidad única del archipiélago que inspiró la teoría de la evolución.",
    longDescription: "Las Islas Galápagos son un archipiélago volcánico ubicado en el Océano Pacífico, a unos 1000 km de la costa ecuatoriana. Este extraordinario destino es conocido mundialmente por su biodiversidad única y su papel fundamental en la teoría de la evolución de Charles Darwin. Aquí podrás observar especies que no existen en ningún otro lugar del planeta, desde las famosas tortugas gigantes hasta iguanas marinas, piqueros de patas azules y leones marinos.",
    rating: 4.9,
    reviews: 2847,
    tags: ["Naturaleza", "Aventura", "Snorkel", "Fauna", "UNESCO"],
    image: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop",
    ],
    price: 899,
    duration: "5-7 días",
    difficulty: "Moderado",
    highlights: [
      "Snorkel con leones marinos y tortugas",
      "Visita al Centro de Crianza de Tortugas",
      "Caminata por flujos de lava",
      "Avistamiento de piqueros de patas azules",
      "Kayak en bahías cristalinas",
      "Observación de iguanas marinas",
    ],
    included: [
      "Vuelo ida y vuelta desde Quito o Guayaquil",
      "Alojamiento 5 noches",
      "Desayunos incluidos",
      "Tours guiados",
      "Equipo de snorkel",
      "Entrada al Parque Nacional",
    ],
    bestTime: "Junio a Diciembre",
    weather: { temp: "22-28°C", condition: "Templado y seco" },
    activities: [
      { name: "Tour Isla Isabela", duration: "Día completo", price: 180 },
      { name: "Snorkel Los Túneles", duration: "4 horas", price: 120 },
      { name: "Kayak Bahía Tortuga", duration: "3 horas", price: 65 },
      { name: "Buceo 2 tanques", duration: "5 horas", price: 220 },
    ],
  },
  quito: {
    id: "quito",
    name: "Quito Centro Histórico",
    region: "Sierra",
    description: "Descubre el centro histórico mejor preservado de América Latina.",
    longDescription: "El Centro Histórico de Quito es uno de los mejor conservados de América Latina y fue declarado Patrimonio Cultural de la Humanidad por la UNESCO en 1978. Sus calles empedradas, iglesias coloniales y plazas históricas te transportan a otra época. Explora la majestuosa Basílica del Voto Nacional, la Iglesia de la Compañía de Jesús (considerada una de las más bellas del mundo), y disfruta de vistas panorámicas desde El Panecillo.",
    rating: 4.8,
    reviews: 3421,
    tags: ["Cultura", "Historia", "Gastronomía", "Arquitectura", "UNESCO"],
    image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=400&fit=crop",
    ],
    price: 149,
    duration: "2-3 días",
    difficulty: "Fácil",
    highlights: [
      "Basílica del Voto Nacional",
      "Iglesia de la Compañía",
      "Plaza de la Independencia",
      "El Panecillo y la Virgen",
      "Calle La Ronda",
      "Mercado Central",
    ],
    included: [
      "Alojamiento 2 noches",
      "Desayunos incluidos",
      "Tour guiado Centro Histórico",
      "Entrada a iglesias",
      "Transporte local",
    ],
    bestTime: "Todo el año",
    weather: { temp: "10-22°C", condition: "Primaveral" },
    activities: [
      { name: "Tour Centro Histórico", duration: "4 horas", price: 45 },
      { name: "Tour Gastronómico", duration: "3 horas", price: 55 },
      { name: "Mitad del Mundo", duration: "Medio día", price: 40 },
      { name: "Teleférico + Pichincha", duration: "5 horas", price: 35 },
    ],
  },
  banos: {
    id: "banos",
    name: "Baños de Agua Santa",
    region: "Sierra",
    description: "Aventura extrema y aguas termales al pie del volcán Tungurahua.",
    longDescription: "Baños de Agua Santa es la capital de la aventura en Ecuador. Ubicada al pie del volcán Tungurahua, esta pequeña ciudad ofrece una combinación perfecta de adrenalina y relajación. Desde puenting en el puente de San Francisco hasta rafting en el río Pastaza, pasando por la famosa Ruta de las Cascadas con sus 60 km de paisajes impresionantes. Después de un día de aventuras, relájate en las aguas termales naturales que dan nombre a la ciudad.",
    rating: 4.7,
    reviews: 1893,
    tags: ["Aventura", "Deportes", "Naturaleza", "Cascadas", "Termas"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=600&h=400&fit=crop",
    ],
    price: 199,
    duration: "3-4 días",
    difficulty: "Aventurero",
    highlights: [
      "Puenting 40m de altura",
      "Ruta de las Cascadas",
      "Columpio del Fin del Mundo",
      "Rafting Río Pastaza",
      "Termas de la Virgen",
      "Canyoning cascadas",
    ],
    included: [
      "Alojamiento 3 noches",
      "Desayunos incluidos",
      "Ruta de las Cascadas",
      "1 actividad extrema",
      "Entrada a termas",
      "Transporte local",
    ],
    bestTime: "Junio a Septiembre",
    weather: { temp: "18-26°C", condition: "Subtropical" },
    activities: [
      { name: "Puenting San Francisco", duration: "1 hora", price: 30 },
      { name: "Rafting Nivel III-IV", duration: "3 horas", price: 50 },
      { name: "Canyoning", duration: "4 horas", price: 45 },
      { name: "Ruta Cascadas en bici", duration: "Día completo", price: 25 },
    ],
  },
}

interface DestinationPageProps {
  params: Promise<{ id: string }>
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { id } = await params
  const destination = destinationsData[id]

  if (!destination) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Image */}
        <div className="relative h-[50vh] lg:h-[60vh]">
          <img
            src={destination.image}
            alt={destination.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Breadcrumb */}
          <div className="absolute top-4 left-4 right-4">
            <nav className="flex items-center gap-2 text-sm text-white/80">
              <Link href="/" className="hover:text-white">Inicio</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/destinos" className="hover:text-white">Destinos</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{destination.name}</span>
            </nav>
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <MapPin className="h-4 w-4" />
                <span>{destination.region}</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white">{destination.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="text-white font-semibold">{destination.rating}</span>
                  <span className="text-white/70">({destination.reviews} reseñas)</span>
                </div>
                <div className="flex items-center gap-1 text-white/80">
                  <Clock className="h-4 w-4" />
                  <span>{destination.duration}</span>
                </div>
                <Badge className="bg-white/20 text-white hover:bg-white/30">{destination.difficulty}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Acerca de este destino</h2>
                <p className="text-muted-foreground leading-relaxed">{destination.longDescription}</p>
                
                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {destination.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </section>

              {/* Gallery */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Galería</h2>
                <div className="grid grid-cols-2 gap-3">
                  {destination.gallery.map((img, index) => (
                    <div key={index} className="relative aspect-[3/2] overflow-hidden rounded-xl">
                      <img
                        src={img}
                        alt={`${destination.name} - imagen ${index + 1}`}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Highlights */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Lo más destacado</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {destination.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Activities */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Actividades disponibles</h2>
                <div className="space-y-3">
                  {destination.activities.map((activity) => (
                    <div
                      key={activity.name}
                      className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                    >
                      <div>
                        <h3 className="font-semibold text-foreground">{activity.name}</h3>
                        <p className="text-sm text-muted-foreground">{activity.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${activity.price}</p>
                        <p className="text-xs text-muted-foreground">por persona</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Included */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">¿Qué incluye?</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {destination.included.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Booking Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-foreground">${destination.price}</span>
                      <span className="text-muted-foreground"> / persona</span>
                    </div>
                    <Badge variant="secondary">{destination.duration}</Badge>
                  </div>

                  <Button className="w-full mb-3" size="lg" asChild>
                    <Link href={`/itinerarios/nuevo?destino=${destination.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Planificar viaje
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <Link href="/asistente">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Consultar con IA
                    </Link>
                  </Button>

                  <div className="mt-6 pt-6 border-t border-border space-y-4">
                    <div className="flex items-center gap-3">
                      <Sun className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Mejor época</p>
                        <p className="text-sm text-muted-foreground">{destination.bestTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Thermometer className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Clima</p>
                        <p className="text-sm text-muted-foreground">{destination.weather.temp} - {destination.weather.condition}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Recomendación IA</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Este destino es ideal para ti basado en tus intereses en aventura y naturaleza.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Información importante</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Reserva con al menos 2 semanas de anticipación
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Lleva ropa cómoda y protector solar
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Cancela gratis hasta 48h antes
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return Object.keys(destinationsData).map((id) => ({ id }))
}
