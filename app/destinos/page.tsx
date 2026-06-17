"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  Grid,
  List,
  X,
  ChevronDown,
} from "lucide-react"

const allDestinations = [
  {
    id: "galapagos",
    name: "Islas Galápagos",
    region: "Región Insular",
    description: "Explora la biodiversidad única del archipiélago que inspiró la teoría de la evolución. Snorkel con leones marinos y tortugas gigantes.",
    rating: 4.9,
    reviews: 2847,
    tags: ["Naturaleza", "Aventura", "Snorkel", "Fauna"],
    image: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800&h=600&fit=crop",
    price: 899,
    duration: "5-7 días",
    difficulty: "Moderado",
  },
  {
    id: "quito",
    name: "Quito Centro Histórico",
    region: "Sierra",
    description: "Descubre el centro histórico mejor preservado de América Latina, declarado Patrimonio de la Humanidad por la UNESCO.",
    rating: 4.8,
    reviews: 3421,
    tags: ["Cultura", "Historia", "Gastronomía", "Arquitectura"],
    image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=800&h=600&fit=crop",
    price: 149,
    duration: "2-3 días",
    difficulty: "Fácil",
  },
  {
    id: "banos",
    name: "Baños de Agua Santa",
    region: "Sierra",
    description: "Aventura extrema y aguas termales al pie del volcán Tungurahua. Puenting, rafting, canyoning y la famosa Ruta de las Cascadas.",
    rating: 4.7,
    reviews: 1893,
    tags: ["Aventura", "Deportes", "Naturaleza", "Cascadas"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    price: 199,
    duration: "3-4 días",
    difficulty: "Aventurero",
  },
  {
    id: "cuenca",
    name: "Cuenca Colonial",
    region: "Sierra",
    description: "Ciudad colonial con arquitectura impresionante, artesanías tradicionales y la mejor gastronomía serrana del país.",
    rating: 4.8,
    reviews: 2156,
    tags: ["Cultura", "Artesanías", "Gastronomía", "Historia"],
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
    price: 179,
    duration: "3-4 días",
    difficulty: "Fácil",
  },
  {
    id: "montanita",
    name: "Montañita",
    region: "Costa",
    description: "Paraíso surfero con vibrante vida nocturna, playas espectaculares y el ambiente más relajado de la costa ecuatoriana.",
    rating: 4.5,
    reviews: 1567,
    tags: ["Playa", "Surf", "Vida nocturna", "Relax"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    price: 129,
    duration: "3-5 días",
    difficulty: "Fácil",
  },
  {
    id: "cotopaxi",
    name: "Parque Nacional Cotopaxi",
    region: "Sierra",
    description: "Hogar del volcán activo más alto del mundo. Senderismo, ciclismo de montaña y vistas impresionantes de los Andes.",
    rating: 4.8,
    reviews: 2089,
    tags: ["Naturaleza", "Trekking", "Volcanes", "Aventura"],
    image: "https://hazteverecuador.com/11-parques-nacionales-posee-el-ecuador/",
    price: 89,
    duration: "1-2 días",
    difficulty: "Moderado",
  },
  {
    id: "quilotoa",
    name: "Laguna Quilotoa",
    region: "Sierra",
    description: "Impresionante laguna de cráter con aguas turquesas. Caminatas por el borde y kayak en las aguas del volcán.",
    rating: 4.7,
    reviews: 1654,
    tags: ["Naturaleza", "Trekking", "Fotografía", "Lagos"],
    image: "https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=800&h=600&fit=crop",
    price: 79,
    duration: "1-2 días",
    difficulty: "Moderado",
  },
  {
    id: "mindo",
    name: "Mindo Cloud Forest",
    region: "Sierra",
    description: "Bosque nublado con increíble biodiversidad. Avistamiento de aves, mariposas, canopy y chocolate artesanal.",
    rating: 4.6,
    reviews: 1432,
    tags: ["Naturaleza", "Aves", "Ecoturismo", "Aventura"],
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop",
    price: 119,
    duration: "2-3 días",
    difficulty: "Fácil",
  },
]

const regions = ["Todas", "Sierra", "Costa", "Región Insular", "Amazonía"]
const categories = ["Todas", "Naturaleza", "Cultura", "Aventura", "Playa", "Gastronomía"]
const priceRanges = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "Económico (<$100)", min: 0, max: 100 },
  { label: "Moderado ($100-$200)", min: 100, max: 200 },
  { label: "Premium ($200+)", min: 200, max: Infinity },
]

export default function DestinationsPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedRegion, setSelectedRegion] = useState("Todas")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const filteredDestinations = useMemo(() => {
    return allDestinations.filter((dest) => {
      const matchesSearch =
        searchQuery === "" ||
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesRegion = selectedRegion === "Todas" || dest.region === selectedRegion

      const matchesCategory =
        selectedCategory === "Todas" ||
        dest.tags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase())

      const priceRange = priceRanges[selectedPriceRange]
      const matchesPrice = dest.price >= priceRange.min && dest.price < priceRange.max

      return matchesSearch && matchesRegion && matchesCategory && matchesPrice
    })
  }, [searchQuery, selectedRegion, selectedCategory, selectedPriceRange])

  const activeFiltersCount = [
    selectedRegion !== "Todas",
    selectedCategory !== "Todas",
    selectedPriceRange !== 0,
  ].filter(Boolean).length

  const clearFilters = () => {
    setSelectedRegion("Todas")
    setSelectedCategory("Todas")
    setSelectedPriceRange(0)
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Explora destinos en Ecuador
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Descubre lugares increíbles adaptados a tus intereses y estilo de viaje.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar destinos, actividades, experiencias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-12 pr-4 text-base rounded-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Results */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={showFilters ? "secondary" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Quick Filters */}
              <div className="hidden sm:flex items-center gap-2">
                {regions.slice(1, 4).map((region) => (
                  <Button
                    key={region}
                    variant={selectedRegion === region ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedRegion(selectedRegion === region ? "Todas" : region)}
                  >
                    {region}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredDestinations.length} destinos
              </span>
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mb-8 rounded-xl border border-border bg-card p-4 lg:p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Region Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Región
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                          selectedRegion === region
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Categoría
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Precio
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range, index) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange(index)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                          selectedPriceRange === index
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                      <X className="h-4 w-4 mr-2" />
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No se encontraron destinos
              </h3>
              <p className="mt-2 text-muted-foreground">
                Intenta ajustar los filtros o buscar algo diferente.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDestinations.map((dest) => (
                <Link
                  key={dest.id}
                  href={`/destinos/${dest.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-primary/20"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-1 text-white">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{dest.region}</span>
                      </div>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white">
                      {dest.duration}
                    </Badge>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {dest.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                      {dest.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {dest.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-border mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">{dest.rating}</span>
                        <span className="text-xs text-muted-foreground">({dest.reviews})</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">Desde ${dest.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDestinations.map((dest) => (
                <Link
                  key={dest.id}
                  href={`/destinos/${dest.id}`}
                  className="group flex gap-4 lg:gap-6 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-lg hover:border-primary/20"
                >
                  <div className="relative h-32 w-32 lg:h-40 lg:w-48 shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {dest.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{dest.region}</span>
                          <span className="text-border">|</span>
                          <span>{dest.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">Desde ${dest.price}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="text-sm font-medium">{dest.rating}</span>
                          <span className="text-xs text-muted-foreground">({dest.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 lg:line-clamp-none">
                      {dest.description}
                    </p>

                    <div className="mt-auto pt-3 flex flex-wrap items-center gap-2">
                      {dest.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-xs">
                        {dest.difficulty}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
