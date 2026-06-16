import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { heuristics } from "@/lib/heuristics"
import { MotionToggle } from "@/components/accessibility/motion-toggle"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Accessibility, Keyboard } from "lucide-react"

export const metadata = {
  title: "Accesibilidad y heurísticas de Nielsen | Destinify",
  description:
    "Cómo Destinify cumple las 10 heurísticas de usabilidad de Jakob Nielsen y las pautas de accesibilidad WCAG.",
}

export default function AccesibilidadPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Accessibility className="h-5 w-5" aria-hidden="true" />
              Usabilidad y accesibilidad
            </div>
            <h1 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Las 10 heurísticas de Nielsen en Destinify
            </h1>
            <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              Esta página documenta cómo cada pantalla de Destinify aplica los principios de usabilidad de
              Jakob Nielsen, junto con prácticas de accesibilidad WCAG como navegación por teclado, foco
              gestionado y compatibilidad con lectores de pantalla.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/comenzar">
                  Probar la experiencia
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/itinerarios/nuevo">Ver formularios por pasos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Demostración del botón de movimiento accesible */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <Card className="border-primary/30 bg-card">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Keyboard className="h-4 w-4" aria-hidden="true" />
                Demostración en vivo · Heurísticas 8 y 10
              </div>
              <h2 className="font-serif text-xl font-bold text-foreground">Botón de movimiento accesible</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                El estado del botón controla dinámicamente tanto su <strong>texto visible</strong> como su{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">aria-label</code>, de modo que lectores
                de pantalla y comandos de voz siempre están sincronizados con la acción. La acción se dispara
                al soltar (up-event) y se cancela si arrastras el cursor fuera del área táctil de 48px antes de
                soltar. Controla las animaciones de toda la app.
              </p>
              <MotionToggle />
              <p className="text-xs text-muted-foreground">
                Consejo: pulsa{" "}
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem] font-medium text-foreground">
                  Tab
                </kbd>{" "}
                para enfocarlo y{" "}
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem] font-medium text-foreground">
                  Espacio
                </kbd>{" "}
                para activarlo con el teclado.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Lista de heurísticas */}
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <ol className="grid gap-6 md:grid-cols-2">
            {heuristics.map((h) => {
              const Icon = h.icon
              return (
                <li key={h.number}>
                  <Card className="h-full">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                          aria-hidden="true"
                        >
                          <Icon className="h-6 w-6" />
                        </span>
                        <div>
                          <Badge variant="secondary" className="mb-1">
                            Heurística {h.number}
                          </Badge>
                          <h3 className="font-serif text-lg font-bold leading-tight text-foreground">
                            {h.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{h.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {h.examples.map((ex, i) => (
                          <li key={i} className="flex gap-2 text-sm text-foreground">
                            <CheckCircle2
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                              aria-hidden="true"
                            />
                            <span className="leading-snug">{ex}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                        <span className="text-xs font-medium text-muted-foreground">Vélo en:</span>
                        {h.whereInApp.map((w) => (
                          <Link
                            key={w.href}
                            href={w.href}
                            className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {w.label}
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </li>
              )
            })}
          </ol>
        </section>
      </main>
      <Footer />
    </>
  )
}
