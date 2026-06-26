"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Check,
  Loader2,
  Coffee,
  Utensils,
  Camera,
  Mountain,
  Hotel,
  Car,
  AlertCircle,
  Heart,
  StickyNote,
  Save,
  Sun,
  Sunset,
  Moon,
  Gauge,
  CheckCircle2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit2,
} from "lucide-react"

const STORAGE_KEY = "destinify_itinerary_draft"

const destinations = [
  { id: "galapagos", name: "Islas Galápagos", region: "Región Insular", image: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=200&h=150&fit=crop" },
  { id: "quito", name: "Quito Centro Histórico", region: "Sierra", image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=200&h=150&fit=crop" },
  { id: "banos", name: "Baños de Agua Santa", region: "Sierra", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&h=150&fit=crop" },
  { id: "cuenca", name: "Cuenca Colonial", region: "Sierra", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=200&h=150&fit=crop" },
]

const tripTypes = [
  { id: "aventura", label: "Aventura", icon: Mountain },
  { id: "cultural", label: "Cultural", icon: Camera },
  { id: "gastronomico", label: "Gastronómico", icon: Utensils },
  { id: "naturaleza", label: "Naturaleza", icon: Mountain },
  { id: "familiar", label: "Familiar", icon: Users },
  { id: "negocios", label: "Negocios", icon: Hotel },
]

const paceOptions = [
  { id: "relajado", label: "Relajado", description: "Pocas actividades, tiempo libre" },
  { id: "moderado", label: "Moderado", description: "Equilibrio entre descanso y actividad" },
  { id: "intensivo", label: "Intensivo", description: "Aprovechar al máximo cada día" },
]

const scheduleOptions = [
  { id: "manana", label: "Mañana", icon: Sun },
  { id: "tarde", label: "Tarde", icon: Sunset },
  { id: "noche", label: "Noche", icon: Moon },
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

type Activity = {
  id: string
  time: string
  title: string
  description: string
  type: string
  duration: string
  cost: number
  favorite?: boolean
}

type Day = {
  day: number
  date: string
  activities: Activity[]
}

const steps = [
  { step: 1, label: "Información", srLabel: "Información general del viaje" },
  { step: 2, label: "Preferencias", srLabel: "Preferencias del viaje" },
  { step: 3, label: "Generar IA", srLabel: "Generar sugerencias con inteligencia artificial" },
  { step: 4, label: "Personalizar", srLabel: "Personalizar actividades" },
  { step: 5, label: "Confirmar", srLabel: "Confirmación del itinerario" },
]

function NewItineraryContent() {
  const searchParams = useSearchParams()
  const preselectedDestination = searchParams.get("destino")

  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [restored, setRestored] = useState(false)
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle")
  const [confirmed, setConfirmed] = useState(false)
  const [notes, setNotes] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    destination: preselectedDestination || "",
    startDate: "",
    endDate: "",
    travelers: 2,
    budget: "",
    tripTypes: [] as string[],
    pace: "",
    schedule: [] as string[],
  })

  const [generatedItinerary, setGeneratedItinerary] = useState<{ days: Day[] } | null>(null)

  // State for editing/adding activities
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [editingActivityLocation, setEditingActivityLocation] = useState<{ dayIndex: number; actIndex: number } | null>(null)
  const [editingActivityData, setEditingActivityData] = useState<Partial<Activity>>({})

  const headingRef = useRef<HTMLHeadingElement>(null)
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const dragItem = useRef<{ dayIndex: number; actIndex: number } | null>(null)

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.formData) setFormData((prev) => ({ ...prev, ...parsed.formData }))
        if (parsed.notes) setNotes(parsed.notes)
        if (parsed.generatedItinerary) setGeneratedItinerary(parsed.generatedItinerary)
        setRestored(true)
      }
    } catch {
      // ignore corrupt draft
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Autosave draft
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setSaveState("saving")
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ formData, notes, generatedItinerary }),
        )
        setSaveState("saved")
      } catch {
        setSaveState("idle")
      }
    }, 600)
    return () => clearTimeout(timeout)
  }, [formData, notes, generatedItinerary])

  // Move focus to heading on step change
  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  const selectedDestination = destinations.find((d) => d.id === formData.destination)

  const announce = (msg: string) => {
    if (liveRef.current) liveRef.current.textContent = msg
  }

  const toggleArrayValue = (key: "tripTypes" | "schedule", value: string) => {
    setFormData((prev) => {
      const arr = prev[key]
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  const validateStep1 = () => {
    const next: Record<string, string> = {}
    if (!formData.name.trim()) next.name = "Ingrese un nombre para su viaje."
    if (!formData.destination) next.destination = "Seleccione un destino principal."
    if (!formData.startDate) next.startDate = "La fecha de inicio es obligatoria."
    if (!formData.endDate) next.endDate = "La fecha de fin es obligatoria."
    if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
      next.endDate = "La fecha de fin debe ser posterior a la fecha de inicio."
    }
    if (!formData.budget.trim()) {
      next.budget = "Ingrese un presupuesto válido."
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      next.budget = "Ingrese un presupuesto válido (número positivo)."
    }
    return next
  }

  const validateStep2 = () => {
    const next: Record<string, string> = {}
    if (formData.tripTypes.length === 0) next.tripTypes = "Seleccione al menos un tipo de viaje."
    if (!formData.pace) next.pace = "Seleccione el ritmo de su viaje."
    return next
  }

  const focusErrors = (errs: Record<string, string>) => {
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      announce(`Hay ${Object.keys(errs).length} errores en el formulario. Revíselos para continuar.`)
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return false
    }
    return true
  }

  const goNext = () => {
    let errs: Record<string, string> = {}
    if (step === 1) errs = validateStep1()
    if (step === 2) errs = validateStep2()
    if (!focusErrors(errs)) return
    setErrors({})
    setStep((s) => Math.min(5, s + 1))
  }

  const goBack = () => {
    setErrors({})
    setStep((s) => Math.max(1, s - 1))
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    announce("Generando itinerario con inteligencia artificial. Por favor espere.")
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
      announce("Itinerario generado correctamente. Ahora puedes personalizarlo.")
      setStep(4)
    }, 2500)
  }

  const totalCost =
    generatedItinerary?.days.reduce(
      (total, day) => total + day.activities.reduce((dt, act) => dt + act.cost, 0),
      0,
    ) || 0

  const totalActivities =
    generatedItinerary?.days.reduce((total, day) => total + day.activities.length, 0) || 0

  const totalHours = totalActivities * 1.8 // rough estimate for the summary

  const removeActivity = (dayIndex: number, activityId: string) => {
    if (!generatedItinerary) return
    const title = generatedItinerary.days[dayIndex].activities.find((a) => a.id === activityId)?.title
    setGeneratedItinerary((prev) => {
      if (!prev) return prev
      const days = prev.days.map((d, i) =>
        i === dayIndex ? { ...d, activities: d.activities.filter((a) => a.id !== activityId) } : d,
      )
      return { days }
    })
    announce(`Actividad ${title ?? ""} eliminada.`)
  }

  const toggleFavorite = (dayIndex: number, activityId: string) => {
    setGeneratedItinerary((prev) => {
      if (!prev) return prev
      const days = prev.days.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              activities: d.activities.map((a) =>
                a.id === activityId ? { ...a, favorite: !a.favorite } : a,
              ),
            }
          : d,
      )
      return { days }
    })
  }

  const moveActivity = (dayIndex: number, fromIndex: number, toIndex: number) => {
    setGeneratedItinerary((prev) => {
      if (!prev) return prev
      const days = prev.days.map((d, i) => {
        if (i !== dayIndex) return d
        const activities = [...d.activities]
        if (toIndex < 0 || toIndex >= activities.length) return d
        const [moved] = activities.splice(fromIndex, 1)
        activities.splice(toIndex, 0, moved)
        return { ...d, activities }
      })
      return { days }
    })
    announce("Orden de actividades actualizado.")
  }

  const openAddActivity = (dayIndex: number) => {
    setEditingActivityLocation({ dayIndex, actIndex: -1 })
    setEditingActivityData({
      title: "",
      description: "",
      type: "activity",
      time: "10:00",
      duration: "1h",
      cost: 0,
    })
    setIsActivityModalOpen(true)
  }

  const openEditActivity = (dayIndex: number, actIndex: number, act: Activity) => {
    setEditingActivityLocation({ dayIndex, actIndex })
    setEditingActivityData({ ...act })
    setIsActivityModalOpen(true)
  }

  const handleSaveActivity = () => {
    if (!editingActivityLocation || !generatedItinerary) return
    const { dayIndex, actIndex } = editingActivityLocation
    
    setGeneratedItinerary((prev) => {
      if (!prev) return prev
      const days = prev.days.map((d, i) => {
        if (i !== dayIndex) return d
        const activities = [...d.activities]
        
        if (actIndex === -1) {
          // Adding new
          const newId = `manual-${Date.now()}`
          activities.push({
            id: newId,
            title: editingActivityData.title || "Nueva actividad",
            description: editingActivityData.description || "",
            type: editingActivityData.type || "activity",
            time: editingActivityData.time || "12:00",
            duration: editingActivityData.duration || "1h",
            cost: Number(editingActivityData.cost) || 0,
            favorite: false,
          })
        } else {
          // Editing existing
          activities[actIndex] = {
            ...activities[actIndex],
            title: editingActivityData.title || activities[actIndex].title,
            description: editingActivityData.description !== undefined ? editingActivityData.description : activities[actIndex].description,
            type: editingActivityData.type || activities[actIndex].type,
            time: editingActivityData.time || activities[actIndex].time,
            duration: editingActivityData.duration || activities[actIndex].duration,
            cost: editingActivityData.cost !== undefined ? Number(editingActivityData.cost) : activities[actIndex].cost,
          }
        }
        
        // Sort activities by time (basic sorting)
        activities.sort((a, b) => a.time.localeCompare(b.time))
        
        return { ...d, activities }
      })
      return { days }
    })
    
    announce(actIndex === -1 ? "Actividad agregada." : "Actividad actualizada.")
    setIsActivityModalOpen(false)
  }

  const handleConfirm = () => {
    setConfirmed(true)
    announce("Itinerario confirmado y guardado correctamente.")
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setRestored(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Live region for screen readers */}
      <div ref={liveRef} role="status" aria-live="polite" className="sr-only" />

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
            <div className="flex items-center gap-4">
              <span
                className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground"
                aria-live="polite"
              >
                {saveState === "saving" && (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    Guardando...
                  </>
                )}
                {saveState === "saved" && (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    Guardado automático
                  </>
                )}
              </span>
              <Button variant="ghost" asChild>
                <Link href="/itinerarios">Cancelar</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-8">
        {/* Restored draft notice */}
        {restored && step === 1 && !confirmed && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/10 p-4">
            <Save className="h-5 w-5 shrink-0 text-accent-foreground" aria-hidden="true" />
            <div className="flex-1 text-sm">
              <p className="font-medium text-foreground">Recuperamos tu borrador</p>
              <p className="text-muted-foreground">
                Continuamos donde lo dejaste. Tus datos se guardan automáticamente.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearDraft}>
              Empezar de nuevo
            </Button>
          </div>
        )}

        {/* Progress */}
        <nav aria-label="Progreso de creación del itinerario" className="mb-8">
          <p className="sr-only" aria-live="polite">
            Paso {step} de {steps.length}: {steps[step - 1].srLabel}
          </p>
          {/* Progress bar */}
          <div
            className="mb-5 h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-label={`Paso ${step} de ${steps.length}`}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
          <ol className="flex items-center justify-between">
            {steps.map((s, index) => (
              <li key={s.step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                      step > s.step
                        ? "border-primary bg-primary text-primary-foreground"
                        : step === s.step
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted bg-muted text-muted-foreground"
                    }`}
                    aria-current={step === s.step ? "step" : undefined}
                  >
                    {step > s.step ? <Check className="h-4 w-4" aria-hidden="true" /> : s.step}
                  </span>
                  <span className="mt-2 hidden text-xs font-medium text-muted-foreground sm:block">
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-1 h-0.5 flex-1 transition-colors sm:mx-2 ${
                      step > s.step ? "bg-primary" : "bg-muted"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Error summary */}
        {Object.keys(errors).length > 0 && (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            role="alert"
            className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
          >
            <div className="flex items-center gap-2 font-semibold text-destructive">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
              Corrige los siguientes campos para continuar:
            </div>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-destructive">
              {Object.entries(errors).map(([key, msg]) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* STEP 1: General info */}
        {step === 1 && (
          <section className="rounded-2xl border border-border bg-card p-6 lg:p-8" aria-labelledby="step1-heading">
            <h1 id="step1-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-foreground focus:outline-none">
              Información general del viaje
            </h1>
            <p className="mt-2 text-muted-foreground">
              Cuéntanos lo esencial para empezar a planificar tu itinerario.
            </p>

            <div className="mt-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre del viaje <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="ej: Aventura en Galápagos 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="flex items-center gap-1.5 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {errors.name}
                  </p>
                )}
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-foreground">
                  Destino principal <span className="text-destructive">*</span>
                </legend>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Destino principal" aria-invalid={!!errors.destination}>
                  {destinations.map((dest) => {
                    const selected = formData.destination === dest.id
                    return (
                      <button
                        key={dest.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setFormData({ ...formData, destination: dest.id })}
                        className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <img src={dest.image || "/placeholder.svg"} alt="" className="h-12 w-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-foreground">{dest.name}</p>
                          <p className="text-xs text-muted-foreground">{dest.region}</p>
                        </div>
                        {selected && <Check className="ml-auto h-5 w-5 text-primary" aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
                {errors.destination && (
                  <p id="destination-error" className="flex items-center gap-1.5 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {errors.destination}
                  </p>
                )}
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Fecha de inicio <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    aria-required="true"
                    aria-invalid={!!errors.startDate}
                    aria-describedby={errors.startDate ? "startDate-error" : undefined}
                  />
                  {errors.startDate && (
                    <p id="startDate-error" className="flex items-center gap-1.5 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    Fecha de fin <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    aria-required="true"
                    aria-invalid={!!errors.endDate}
                    aria-describedby={errors.endDate ? "endDate-error" : undefined}
                  />
                  {errors.endDate && (
                    <p id="endDate-error" className="flex items-center gap-1.5 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelers">Número de viajeros</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-11 w-11"
                    aria-label="Disminuir número de viajeros"
                    onClick={() => setFormData({ ...formData, travelers: Math.max(1, formData.travelers - 1) })}
                  >
                    <span aria-hidden="true">−</span>
                  </Button>
                  <span id="travelers" className="w-12 text-center text-lg font-medium" aria-live="polite">
                    {formData.travelers}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-11 w-11"
                    aria-label="Aumentar número de viajeros"
                    onClick={() => setFormData({ ...formData, travelers: Math.min(20, formData.travelers + 1) })}
                  >
                    <span aria-hidden="true">+</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">
                  Presupuesto estimado (USD) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="budget"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    placeholder="1500"
                    className="pl-9"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    aria-required="true"
                    aria-invalid={!!errors.budget}
                    aria-describedby={errors.budget ? "budget-error" : "budget-help"}
                  />
                </div>
                {errors.budget ? (
                  <p id="budget-error" className="flex items-center gap-1.5 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {errors.budget}
                  </p>
                ) : (
                  <p id="budget-help" className="text-sm text-muted-foreground">
                    Monto total aproximado para todo el viaje.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={goNext} size="lg">
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </section>
        )}

        {/* STEP 2: Preferences */}
        {step === 2 && (
          <section className="rounded-2xl border border-border bg-card p-6 lg:p-8" aria-labelledby="step2-heading">
            <h1 id="step2-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-foreground focus:outline-none">
              Preferencias del viaje
            </h1>
            <p className="mt-2 text-muted-foreground">
              Estas preferencias ayudan a la IA a recomendarte mejores actividades.
            </p>

            <div className="mt-8 space-y-8">
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-foreground">
                  Tipo de viaje <span className="text-destructive">*</span>{" "}
                  <span className="font-normal text-muted-foreground">(elige uno o varios)</span>
                </legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {tripTypes.map((type) => {
                    const Icon = type.icon
                    const selected = formData.tripTypes.includes(type.id)
                    return (
                      <button
                        key={type.id}
                        type="button"
                        role="checkbox"
                        aria-checked={selected}
                        onClick={() => toggleArrayValue("tripTypes", type.id)}
                        className={`flex min-h-[44px] flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          selected ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${selected ? "text-primary" : ""}`} aria-hidden="true" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    )
                  })}
                </div>
                {errors.tripTypes && (
                  <p className="flex items-center gap-1.5 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {errors.tripTypes}
                  </p>
                )}
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Gauge className="h-4 w-4 text-primary" aria-hidden="true" />
                  Ritmo del viaje <span className="text-destructive">*</span>
                </legend>
                <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Ritmo del viaje">
                  {paceOptions.map((option) => {
                    const selected = formData.pace === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setFormData({ ...formData, pace: option.id })}
                        className={`rounded-xl border-2 p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium text-foreground">{option.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                      </button>
                    )
                  })}
                </div>
                {errors.pace && (
                  <p className="flex items-center gap-1.5 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    {errors.pace}
                  </p>
                )}
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-foreground">
                  Horario preferido <span className="font-normal text-muted-foreground">(opcional)</span>
                </legend>
                <div className="flex flex-wrap gap-3">
                  {scheduleOptions.map((option) => {
                    const Icon = option.icon
                    const selected = formData.schedule.includes(option.id)
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="checkbox"
                        aria-checked={selected}
                        onClick={() => toggleArrayValue("schedule", option.id)}
                        className={`flex min-h-[44px] items-center gap-2 rounded-full border-2 px-5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          selected ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Button variant="outline" onClick={goBack} size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Volver
              </Button>
              <Button onClick={goNext} size="lg">
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </section>
        )}

        {/* STEP 3: AI Generation */}
        {step === 3 && (
          <section className="rounded-2xl border border-border bg-card p-6 lg:p-8" aria-labelledby="step3-heading">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-8 w-8" aria-hidden="true" />
              </div>
              <h1 id="step3-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-foreground focus:outline-none">
                Genera tu itinerario con IA
              </h1>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Crearemos un itinerario personalizado según tus preferencias. Podrás ajustarlo después.
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-xl bg-secondary/50 p-4 text-left">
                <h2 className="mb-3 font-semibold text-foreground">Resumen de tu viaje</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                    <dt className="text-muted-foreground">Destino:</dt>
                    <dd className="font-medium text-foreground">{selectedDestination?.name}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
                    <dt className="text-muted-foreground">Fechas:</dt>
                    <dd className="font-medium text-foreground">{formData.startDate} a {formData.endDate}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                    <dt className="text-muted-foreground">Viajeros:</dt>
                    <dd className="font-medium text-foreground">{formData.travelers}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" aria-hidden="true" />
                    <dt className="text-muted-foreground">Presupuesto:</dt>
                    <dd className="font-medium text-foreground">${formData.budget}</dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                    <dt className="text-muted-foreground">Intereses:</dt>
                    <dd className="font-medium capitalize text-foreground">
                      {formData.tripTypes.join(", ")} · ritmo {formData.pace}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button variant="outline" onClick={goBack} size="lg" disabled={isGenerating}>
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                  Volver
                </Button>
                <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Generando itinerario...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                      Generar itinerario
                    </>
                  )}
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* STEP 4: Customize */}
        {step === 4 && generatedItinerary && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div>
                <h1 id="step4-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-foreground focus:outline-none">
                  Personaliza tu itinerario
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Reordena, elimina o marca como favoritas las actividades. Los cambios se guardan solos.
                </p>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm text-foreground">
                    <strong>Sugerencia IA:</strong> Optimicé los traslados y agrupé actividades cercanas.
                    Usa las flechas o arrastra <GripVertical className="inline h-4 w-4" aria-hidden="true" /> para reordenar.
                  </p>
                </div>
              </div>

              {generatedItinerary.days.map((day, dayIndex) => (
                <div key={day.day} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="border-b border-border bg-secondary/50 px-5 py-3">
                    <h2 className="font-semibold text-foreground">{day.date}</h2>
                  </div>
                  <ul className="space-y-3 p-5">
                    {day.activities.map((activity, actIndex) => {
                      const Icon = activityIcons[activity.type] || Camera
                      return (
                        <li
                          key={activity.id}
                          draggable
                          onDragStart={() => (dragItem.current = { dayIndex, actIndex })}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (dragItem.current && dragItem.current.dayIndex === dayIndex) {
                              moveActivity(dayIndex, dragItem.current.actIndex, actIndex)
                            }
                            dragItem.current = null
                          }}
                          className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm"
                        >
                          <div className="mt-1 flex flex-col items-center gap-1">
                            <span className="cursor-grab text-muted-foreground" aria-hidden="true">
                              <GripVertical className="h-5 w-5" />
                            </span>
                            <div className="flex flex-col">
                              <button
                                type="button"
                                className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
                                aria-label={`Mover ${activity.title} hacia arriba`}
                                disabled={actIndex === 0}
                                onClick={() => moveActivity(dayIndex, actIndex, actIndex - 1)}
                              >
                                <ChevronUp className="h-4 w-4" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
                                aria-label={`Mover ${activity.title} hacia abajo`}
                                disabled={actIndex === day.activities.length - 1}
                                onClick={() => moveActivity(dayIndex, actIndex, actIndex + 1)}
                              >
                                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-foreground">{activity.title}</p>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                              </div>
                              <div className="flex shrink-0 items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9"
                                  aria-label={activity.favorite ? `Quitar ${activity.title} de favoritos` : `Marcar ${activity.title} como favorito`}
                                  aria-pressed={!!activity.favorite}
                                  onClick={() => toggleFavorite(dayIndex, activity.id)}
                                >
                                  <Heart className={`h-4 w-4 ${activity.favorite ? "fill-destructive text-destructive" : ""}`} aria-hidden="true" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9"
                                  aria-label={`Editar ${activity.title}`}
                                  onClick={() => openEditActivity(dayIndex, actIndex, activity)}
                                >
                                  <Edit2 className="h-4 w-4" aria-hidden="true" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9"
                                  aria-label={`Eliminar ${activity.title}`}
                                  onClick={() => removeActivity(dayIndex, activity.id)}
                                >
                                  <X className="h-4 w-4" aria-hidden="true" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                {activity.time} · {activity.duration}
                              </span>
                              {activity.cost > 0 && <Badge variant="secondary">${activity.cost}</Badge>}
                              {activity.favorite && (
                                <Badge className="bg-destructive/10 text-destructive">Favorito</Badge>
                              )}
                            </div>
                          </div>
                        </li>
                      )
                    })}
                    {day.activities.length === 0 && (
                      <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                        No hay actividades para este día. Agrega una nueva.
                      </li>
                    )}
                    <li>
                      <Button variant="outline" className="w-full" size="sm" onClick={() => openAddActivity(dayIndex)}>
                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                        Agregar actividad manualmente
                      </Button>
                    </li>
                  </ul>
                </div>
              ))}

              {/* Personal notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-primary" aria-hidden="true" />
                  Notas personales
                </Label>
                <Textarea
                  id="notes"
                  placeholder="ej: Llevar protector solar, reservar mesa para aniversario..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(3)} size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                  Regenerar
                </Button>
                <Button onClick={goNext} size="lg">
                  Revisar y confirmar
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* Live summary sidebar */}
            <aside className="lg:col-span-1" aria-label="Resumen del itinerario en tiempo real">
              <div className="sticky top-6 rounded-2xl border border-border bg-card p-5">
                <h2 className="font-semibold text-foreground">Resumen en tiempo real</h2>
                <p className="text-sm text-muted-foreground">{formData.name}</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Días planificados</dt>
                    <dd className="font-medium text-foreground">{generatedItinerary.days.length}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Actividades</dt>
                    <dd className="font-medium text-foreground">{totalActivities}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Tiempo estimado</dt>
                    <dd className="font-medium text-foreground">~{totalHours.toFixed(0)} h</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <dt className="font-medium text-foreground">Costo estimado</dt>
                    <dd className="text-lg font-bold text-foreground">${totalCost}</dd>
                  </div>
                </dl>
                {Number(formData.budget) > 0 && (
                  <p className={`mt-3 text-xs ${totalCost > Number(formData.budget) ? "text-destructive" : "text-muted-foreground"}`}>
                    {totalCost > Number(formData.budget)
                      ? `Estás $${totalCost - Number(formData.budget)} por encima de tu presupuesto.`
                      : `Dentro del presupuesto ($${Number(formData.budget) - totalCost} disponibles).`}
                  </p>
                )}
              </div>
            </aside>
          </div>
        )}

        {/* STEP 5: Confirmation */}
        {step === 5 && generatedItinerary && (
          <section className="rounded-2xl border border-border bg-card p-6 lg:p-8" aria-labelledby="step5-heading">
            {!confirmed ? (
              <>
                <h1 id="step5-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-foreground focus:outline-none">
                  Revisa y confirma tu itinerario
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Revisa el resumen antes de confirmar. Podrás editarlo cuando quieras.
                </p>

                <div className="mt-6 rounded-xl bg-secondary/50 p-5">
                  <h2 className="text-lg font-bold text-foreground">{formData.name}</h2>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                      {selectedDestination?.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
                      {formData.startDate} a {formData.endDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                      {formData.travelers} viajeros
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg bg-card p-3">
                      <p className="text-2xl font-bold text-foreground">{generatedItinerary.days.length}</p>
                      <p className="text-xs text-muted-foreground">Días</p>
                    </div>
                    <div className="rounded-lg bg-card p-3">
                      <p className="text-2xl font-bold text-foreground">{totalActivities}</p>
                      <p className="text-xs text-muted-foreground">Actividades</p>
                    </div>
                    <div className="rounded-lg bg-card p-3">
                      <p className="text-2xl font-bold text-foreground">${totalCost}</p>
                      <p className="text-xs text-muted-foreground">Costo estimado</p>
                    </div>
                  </div>
                </div>

                {/* Day breakdown */}
                <div className="mt-6 space-y-4">
                  {generatedItinerary.days.map((day) => (
                    <div key={day.day} className="rounded-xl border border-border p-4">
                      <h3 className="mb-2 font-semibold text-foreground">{day.date}</h3>
                      <ul className="space-y-1.5">
                        {day.activities.map((activity) => (
                          <li key={activity.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span className="font-medium text-foreground">{activity.time}</span>
                            {activity.title}
                            {activity.favorite && <Heart className="h-3.5 w-3.5 fill-destructive text-destructive" aria-hidden="true" />}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {notes.trim() && (
                  <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4">
                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <StickyNote className="h-4 w-4 text-primary" aria-hidden="true" />
                      Notas personales
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{notes}</p>
                  </div>
                )}

                <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <Button variant="outline" onClick={goBack} size="lg">
                    <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                    Editar itinerario
                  </Button>
                  <Button onClick={handleConfirm} size="lg">
                    <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                    Confirmar y guardar itinerario
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
                </div>
                <h1 id="step5-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-foreground focus:outline-none">
                  ¡Itinerario confirmado!
                </h1>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                  Tu itinerario <strong>{formData.name}</strong> se guardó correctamente. Puedes consultarlo
                  o editarlo desde tu lista de itinerarios.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/itinerarios">Ver mis itinerarios</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/reservar">Reservar este viaje</Link>
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Edit/Add Activity Modal */}
      <Dialog open={isActivityModalOpen} onOpenChange={setIsActivityModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingActivityLocation?.actIndex === -1 ? "Nueva Actividad" : "Editar Actividad"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Título</Label>
              <Input
                id="title"
                value={editingActivityData.title || ""}
                onChange={(e) => setEditingActivityData({ ...editingActivityData, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="desc" className="text-right mt-2">Descripción</Label>
              <Textarea
                id="desc"
                value={editingActivityData.description || ""}
                onChange={(e) => setEditingActivityData({ ...editingActivityData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Hora</Label>
              <Input
                id="time"
                type="time"
                value={editingActivityData.time || ""}
                onChange={(e) => setEditingActivityData({ ...editingActivityData, time: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duración</Label>
              <Input
                id="duration"
                placeholder="ej: 1h 30m"
                value={editingActivityData.duration || ""}
                onChange={(e) => setEditingActivityData({ ...editingActivityData, duration: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">Costo ($)</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                value={editingActivityData.cost || 0}
                onChange={(e) => setEditingActivityData({ ...editingActivityData, cost: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Tipo</Label>
              <div className="col-span-3">
                <Select
                  value={editingActivityData.type || "activity"}
                  onValueChange={(val) => setEditingActivityData({ ...editingActivityData, type: val })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Desayuno</SelectItem>
                    <SelectItem value="lunch">Almuerzo</SelectItem>
                    <SelectItem value="dinner">Cena</SelectItem>
                    <SelectItem value="activity">Actividad</SelectItem>
                    <SelectItem value="sightseeing">Turismo</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="transport">Transporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActivityModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveActivity}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function NewItineraryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <span className="sr-only">Cargando...</span>
        </div>
      }
    >
      <NewItineraryContent />
    </Suspense>
  )
}
