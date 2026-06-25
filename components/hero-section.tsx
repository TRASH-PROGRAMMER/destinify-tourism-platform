"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Impulsado por Inteligencia Artificial</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance">
            Descubre Ecuador con{" "}
            <span className="text-primary">experiencias personalizadas</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty">
            Tu asistente de viaje inteligente que planifica itinerarios perfectos, 
            gestiona reservas y te acompaña en cada momento de tu aventura.
          </p>

          {/* Search box - Simplificado (Ley de Hick) */}
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="bg-card rounded-2xl shadow-xl border border-border p-2">
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex-1 flex items-center gap-3 px-4 py-2">
                  <MapPin className="h-6 w-6 text-primary shrink-0" />
                  <Input
                    type="text"
                    placeholder="¿A dónde quieres ir? (ej: Galápagos)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md text-lg placeholder:text-muted-foreground/70"
                  />
                </div>
                <Button size="lg" className="rounded-xl px-8 h-12 text-base" asChild>
                  <Link href={`/destinos${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}>
                    <Search className="h-5 w-5 mr-2" />
                    Explorar
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick actions - Reducido (Ley de Hick) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span>Sugerencias:</span>
            <Link href="/destinos?q=Galapagos" className="font-medium text-foreground hover:text-primary transition-colors hover:underline underline-offset-4">Galápagos</Link>
            <span>•</span>
            <Link href="/destinos?q=Quito" className="font-medium text-foreground hover:text-primary transition-colors hover:underline underline-offset-4">Quito</Link>
          </div>

          {/* CTA buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/comenzar">
                Crear mi perfil viajero
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/asistente">
                <Sparkles className="mr-2 h-4 w-4" />
                Probar asistente IA
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
