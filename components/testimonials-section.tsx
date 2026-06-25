import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    content:
      "Destinify transformó completamente mi forma de viajar. El itinerario que generó para mi viaje a Galápagos fue perfecto, cada detalle pensado y optimizado.",
    author: "María Fernanda López",
    role: "Viajera frecuente",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    content:
      "Como turista internacional, la asistencia en tiempo real fue invaluable. Me ayudó a descubrir lugares que ninguna guía tradicional menciona.",
    author: "James Mitchell",
    role: "Turista de USA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    content:
      "La personalización es increíble. Detectó que me encanta la gastronomía y me recomendó experiencias culinarias únicas en cada destino.",
    author: "Carlos Mendoza",
    role: "Foodie y viajero",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
            Testimonios
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Lo que dicen nuestros viajeros
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              tabIndex={0}
              className="relative flex flex-col rounded-2xl bg-card p-6 shadow-sm border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {/* Quote icon */}
              <Quote className="h-8 w-8 text-primary/20" />

              {/* Rating */}
              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="mt-4 flex-1 text-muted-foreground leading-relaxed">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
