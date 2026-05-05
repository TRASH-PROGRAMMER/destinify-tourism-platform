import { UserCircle, Search, Calendar, Plane } from "lucide-react"

const steps = [
  {
    step: 1,
    name: "Crea tu perfil",
    description:
      "Define tus intereses, presupuesto, estilo de viaje y preferencias. La IA aprende de ti para mejorar cada recomendación.",
    icon: UserCircle,
  },
  {
    step: 2,
    name: "Explora destinos",
    description:
      "Busca por ciudad, experiencia o deja que la IA te sugiera destinos perfectos basados en tu perfil único.",
    icon: Search,
  },
  {
    step: 3,
    name: "Arma tu itinerario",
    description:
      "Genera planes automáticos o personaliza cada detalle. Ajusta tiempos, agrega actividades y optimiza tu ruta.",
    icon: Calendar,
  },
  {
    step: 4,
    name: "Viaja sin preocupaciones",
    description:
      "Reserva todo desde la app, recibe alertas en tiempo real y cuenta con asistencia 24/7 durante tu viaje.",
    icon: Plane,
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-primary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
            Cómo funciona
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Planifica tu viaje en 4 simples pasos
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.name} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border" />
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Step number with icon */}
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-lg font-semibold text-foreground">
                    {step.name}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
