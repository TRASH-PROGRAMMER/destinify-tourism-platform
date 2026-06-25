import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, MapPin } from "lucide-react"
import Link from "next/link"

const destinations = [
  {
    id: 1,
    name: "Islas Galápagos",
    region: "Región Insular",
    description: "Explora la biodiversidad única del archipiélago que inspiró la teoría de la evolución.",
    rating: 4.9,
    reviews: 2847,
    tags: ["Naturaleza", "Aventura", "Snorkel"],
    image: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800&h=600&fit=crop",
    price: "Desde $899",
  },
  {
    id: 2,
    name: "Quito Centro Histórico",
    region: "Sierra",
    description: "Descubre el centro histórico mejor preservado de América Latina, Patrimonio de la Humanidad.",
    rating: 4.8,
    reviews: 3421,
    tags: ["Cultura", "Historia", "Gastronomía"],
    image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=800&h=600&fit=crop",
    price: "Desde $149",
  },
  {
    id: 3,
    name: "Baños de Agua Santa",
    region: "Sierra",
    description: "Aventura extrema y aguas termales al pie del volcán Tungurahua.",
    rating: 4.7,
    reviews: 1893,
    tags: ["Aventura", "Deportes", "Naturaleza"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    price: "Desde $199",
  },
  {
    id: 4,
    name: "Cuenca Colonial",
    region: "Sierra",
    description: "Ciudad colonial con arquitectura impresionante, artesanías y la mejor gastronomía serrana.",
    rating: 4.8,
    reviews: 2156,
    tags: ["Cultura", "Artesanías", "Gastronomía"],
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
    price: "Desde $179",
  },
]

export function DestinationsSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
              Destinos Destacados
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explora lo mejor de Ecuador
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/destinos">
              Ver todos los destinos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/destinos/${destination.id}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all hover:shadow-lg hover:border-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-1 text-white">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{destination.region}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {destination.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                  {destination.description}
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {destination.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium text-foreground">{destination.rating}</span>
                    <span className="text-xs text-muted-foreground">({destination.reviews})</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{destination.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
