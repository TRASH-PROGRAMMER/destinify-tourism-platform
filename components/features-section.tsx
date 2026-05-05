import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Shield,
  MessageCircle,
} from "lucide-react"

const features = [
  {
    name: "Personalización Inteligente",
    description:
      "La IA analiza tus preferencias, presupuesto e intereses para crear recomendaciones únicas que se adaptan a tu estilo de viaje.",
    icon: Sparkles,
  },
  {
    name: "Itinerarios Automáticos",
    description:
      "Genera planes diarios optimizados con tiempos de traslado, costos y alternativas según el clima y disponibilidad.",
    icon: Calendar,
  },
  {
    name: "Todo en un Solo Lugar",
    description:
      "Centraliza reservas de hoteles, tours, transporte y restaurantes. Accede a toda tu información de viaje fácilmente.",
    icon: MapPin,
  },
  {
    name: "Asistencia en Tiempo Real",
    description:
      "Recibe alertas, recordatorios y recomendaciones contextuales durante tu viaje. Tu guía turístico 24/7.",
    icon: Clock,
  },
  {
    name: "Reservas Seguras",
    description:
      "Gestiona tus reservas con proveedores verificados y mantén todos tus comprobantes organizados en la plataforma.",
    icon: Shield,
  },
  {
    name: "Asistente Conversacional",
    description:
      "Chatea con nuestra IA para planificar, resolver dudas o descubrir experiencias ocultas en cualquier momento.",
    icon: MessageCircle,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
            Funcionalidades
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Todo lo que necesitas para un viaje perfecto
          </p>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Destinify combina inteligencia artificial con servicios turísticos para 
            ofrecerte una experiencia de viaje sin igual.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="group relative rounded-2xl bg-card p-6 shadow-sm border border-border transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.name}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
