import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Comienza gratis hoy</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl text-balance">
            Tu próxima aventura en Ecuador te espera
          </h2>

          <p className="mt-6 text-lg text-primary-foreground/80 leading-relaxed text-pretty">
            Únete a miles de viajeros que ya descubrieron la manera más inteligente 
            de explorar Ecuador. Crea tu perfil y recibe recomendaciones personalizadas al instante.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto text-base"
              asChild
            >
              <Link href="/comenzar">
                Crear mi perfil gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/destinos">Explorar destinos</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "50K+", label: "Viajeros activos" },
              { value: "200+", label: "Destinos" },
              { value: "4.9", label: "Calificación" },
              { value: "24/7", label: "Soporte IA" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
