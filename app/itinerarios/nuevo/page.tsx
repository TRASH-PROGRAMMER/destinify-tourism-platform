"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  DollarSign,
  Plus,
  X,
  GripVertical,
  ChevronDown,
  Check,
  Loader2,
  Coffee,
  Utensils,
  Camera,
  Mountain,
  Hotel,
  Car,
} from "lucide-react"

const destinations = [
  { id: "galapagos", name: "Islas Galápagos", region: "Región Insular", image: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=200&h=150&fit=crop" },
  { id: "quito", name: "Quito Centro Histórico", region: "Sierra", image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=200&h=150&fit=crop" },
  { id: "banos", name: "Baños de Agua Santa", region: "Sierra", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&h=150&fit=crop" },
  { id: "cuenca", name: "Cuenca Colonial", region: "Sierra", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=200&h=150&fit=crop" },
]

const activityIcons: Record<string, typeof Coffee> = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Utensils,
  activity: Mountain,
  sightseeing: Camera,
  hotel: Hotel,
  transport: Car,
}

function NewItineraryContent() {
  const searchParams = useSearchParams()
  const preselectedDestination = searchParams.get("destino")

  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    destination: preselectedDestination || "",
    startDate: "",
    endDate: "",
    travelers: 2,
    budget: "moderado",
  })

  const [generatedItinerary, setGeneratedItinerary] = useState<{
    days: {
      day: number
      date: string
      activities: {
        id: string
        time: string
        title: string
        description: string
        type: string
        duration: string
        cost: number
      }[]
    }[]
  } | null>(null)

  const selectedDestination = destinations.find((d) => d.id === formData.destination)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedItinerary({
        days: [
          {
            day: 1,
            date: "Día 1",
            activities: [
              { id: "1", time: "08:00", title: "Desayuno en el hotel", description: "Buffet completo con opciones locales", type: "breakfast", duration: "1h", cost: 0 },
              { id: "2", time: "09:30", title: "Tour Centro Histórico", description: "Visita guiada por las principales atracciones", type: "sightseeing", duration: "3h", cost: 45 },
              { id: "3", time: "13:00", title: "Almuerzo típico", description: "Restaurante tradicional ecuatoriano", type: "lunch", duration: "1.5h", cost: 25 },
              { id: "4", time: "15:00", title: "Basílica del Voto Nacional", description: "Visita y subida a las torres", type: "activity", duration: "2h", cost: 5 },
              { id: "5", time: "19:00", title: "Cena en La Ronda", description: "Gastronomía local con música en vivo", type: "dinner", duration: "2h", cost: 35 },
            ],
          },
          {
            day: 2,
            date: "Día 2",
            activities: [
              { id: "6", time: "07:00", title: "Desayuno temprano", description: "Preparación para excursión", type: "breakfast", duration: "45min", cost: 0 },
              { id: "7", time: "08:00", title: "Excursión Mitad del Mundo", description: "Visita al monumento ecuatorial", type: "activity", duration: "4h", cost: 40 },
              { id: "8", time: "13:00", title: "Almuerzo en Pululahua", description: "Vista al cráter volcánico", type: "lunch", duration: "1.5h", cost: 20 },
              { id: "9", time: "16:00", title: "Teleférico de Quito", description: "Ascenso al volcán Pichincha", type: "sightseeing", duration: "3h", cost: 15 },
              { id: "10", time: "20:00", title: "Cena de despedida", description: "Restaurante panorámico", type: "dinner", duration: "2h", cost: 45 },
            ],
          },
        ],
      })
      setIsGenerating(false)
      setStep(3)
    }, 2500)
  }

  const totalCost = generatedItinerary?.days.reduce(
    (total, day) => total + day.activities.reduce((dayTotal, act) => dayTotal + act.cost, 0),
    0
  ) || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/itinerarios" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-semibold text-lg text-foreground">Destinify</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/itinerarios">Cancelar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[
              { step: 1, label: "Detalles" },
              { step: 2, label: "Generar con IA" },
              { step: 3, label: "Personalizar" },
            ].map((s, index) => (
              <div key={s.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      step > s.step
                        ? "border-primary bg-primary text-primary-foreground"
                        : step === s.step
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.step ? <Check className="h-5 w-5" /> : s.step}
                  </div>
                  <span className="mt-2 text-xs font-medium text-muted-foreground">
                    {s.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`h-0.5 w-24 sm:w-32 lg:w-48 mx-2 transition-colors ${
                      step > s.step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-foreground">Detalles del viaje</h2>
            <p className="mt-2 text-muted-foreground">
              Cuéntanos sobre tu viaje para generar un itinerario personalizado.
            </p>

            <div className="mt-8 space-y-6">
              {/* Trip Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del viaje</Label>
                <Input
                  id="name"
                  placeholder="ej: Aventura en Galápagos 2024"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label>Destino</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {destinations.map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, destination: dest.id })}
                      className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                        formData.destination === dest.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{dest.name}</p>
                        <p className="text-xs text-muted-foreground">{dest.region}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Travelers */}
              <div className="space-y-2">
                <Label>Número de viajeros</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setFormData({ ...formData, travelers: Math.max(1, formData.travelers - 1) })
                    }
                  >
                    -
                  </Button>
                  <span className="w-12 text-center text-lg font-medium">{formData.travelers}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setFormData({ ...formData, travelers: Math.min(10, formData.travelers + 1) })
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label>Presupuesto</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "economico", label: "Económico" },
                    { id: "moderado", label: "Moderado" },
                    { id: "premium", label: "Premium" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: option.id })}
                      className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                        formData.budget === option.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.destination || !formData.startDate || !formData.endDate}
              >
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: AI Generation */}
        {step === 2 && (
          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Genera tu itinerario con IA
              </h2>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Nuestra IA creará un itinerario personalizado basado en tus preferencias, 
                intereses y el destino seleccionado.
              </p>

              {/* Summary */}
              <div className="mt-8 rounded-xl bg-secondary/50 p-4 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-foreground mb-3">Resumen de tu viaje</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Destino:</span>
                    <span className="font-medium text-foreground">{selectedDestination?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Fechas:</span>
                    <span className="font-medium text-foreground">
                      {formData.startDate} - {formData.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Viajeros:</span>
                    <span className="font-medium text-foreground">{formData.travelers}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Presupuesto:</span>
                    <span className="font-medium text-foreground capitalize">{formData.budget}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
                <Button onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando itinerario...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generar itinerario
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Customize */}
        {step === 3 && generatedItinerary && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{formData.name}</h2>
                <p className="text-muted-foreground">
                  {selectedDestination?.name} | {formData.startDate} - {formData.endDate}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Costo estimado</p>
                  <p className="text-xl font-bold text-foreground">${totalCost}</p>
                </div>
                <Button>
                  Guardar itinerario
                </Button>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">
                    <strong>Sugerencia IA:</strong> He optimizado los tiempos de traslado y 
                    agrupado actividades cercanas. Puedes arrastrar las actividades para reorganizar 
                    o hacer clic en + para agregar más.
                  </p>
                </div>
              </div>
            </div>

            {/* Days */}
            {generatedItinerary.days.map((day) => (
              <div key={day.day} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="bg-secondary/50 px-5 py-3 border-b border-border">
                  <h3 className="font-semibold text-foreground">{day.date}</h3>
                </div>
                <div className="p-5 space-y-3">
                  {day.activities.map((activity) => {
                    const Icon = activityIcons[activity.type] || Camera
                    return (
                      <div
                        key={activity.id}
                        className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm hover:border-primary/20"
                      >
                        <button className="mt-1 cursor-grab text-muted-foreground hover:text-foreground">
                          <GripVertical className="h-5 w-5" />
                        </button>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-foreground">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {activity.time} | {activity.duration}
                            </span>
                            {activity.cost > 0 && (
                              <Badge variant="secondary">${activity.cost}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <Button variant="outline" className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar actividad
                  </Button>
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Regenerar
              </Button>
              <Button asChild>
                <Link href="/itinerarios">
                  Guardar y continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function NewItineraryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <NewItineraryContent />
    </Suspense>
  )
}
