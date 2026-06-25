"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  ArrowRight,
  ArrowLeft,
  User,
  SlidersHorizontal,
  Sparkles,
  Check,
  Mountain,
  Utensils,
  Camera,
  Waves,
  TreePine,
  History,
  Music,
  ShoppingBag,
  Accessibility,
  Eye,
  Ear,
  Brain,
  HelpCircle,
  Sun,
  Snowflake,
  CloudSun,
  Leaf,
  AlertCircle,
  Save,
} from "lucide-react"

const STORAGE_KEY = "destinify-onboarding-draft"

const steps = [
  { id: 1, name: "Datos básicos", icon: User },
  { id: 2, name: "Preferencias", icon: SlidersHorizontal },
  { id: 3, name: "Personalización IA", icon: Sparkles },
]

const countries = [
  "Ecuador",
  "Colombia",
  "Perú",
  "México",
  "Argentina",
  "Chile",
  "España",
  "Estados Unidos",
  "Alemania",
  "Francia",
  "Brasil",
  "Otro",
]

const languages = [
  { id: "es", name: "Español" },
  { id: "en", name: "English" },
  { id: "de", name: "Deutsch" },
  { id: "fr", name: "Français" },
  { id: "pt", name: "Português" },
]

const travelerTypes = [
  { id: "solo", name: "Viajo solo/a" },
  { id: "pareja", name: "En pareja" },
  { id: "familia", name: "En familia" },
  { id: "amigos", name: "Con amigos" },
  { id: "negocios", name: "Viaje de negocios" },
]

const budgetOptions = [
  { id: "economico", name: "Económico", description: "Hostales, transporte público, comida local", range: "$20-50/día" },
  { id: "moderado", name: "Moderado", description: "Hoteles 3 estrellas, tours grupales", range: "$50-100/día" },
  { id: "premium", name: "Premium", description: "Hoteles 4-5 estrellas, experiencias exclusivas", range: "$100-200/día" },
  { id: "lujo", name: "Lujo", description: "Resorts de lujo, tours privados, primera clase", range: "$200+/día" },
]

const interests = [
  { id: "aventura", name: "Aventura", icon: Mountain },
  { id: "gastronomia", name: "Gastronomía", icon: Utensils },
  { id: "fotografia", name: "Fotografía", icon: Camera },
  { id: "playa", name: "Playa", icon: Waves },
  { id: "naturaleza", name: "Naturaleza", icon: TreePine },
  { id: "cultura", name: "Cultura", icon: History },
  { id: "vida-nocturna", name: "Vida nocturna", icon: Music },
  { id: "compras", name: "Compras", icon: ShoppingBag },
]

const accessibilityNeeds = [
  { id: "movilidad", name: "Movilidad reducida", description: "Rampas, ascensores, rutas accesibles", icon: Accessibility },
  { id: "visual", name: "Apoyo visual", description: "Señalización clara, audioguías", icon: Eye },
  { id: "auditivo", name: "Apoyo auditivo", description: "Subtítulos, intérpretes, alertas visuales", icon: Ear },
  { id: "cognitivo", name: "Apoyo cognitivo", description: "Información simple, ritmo tranquilo", icon: Brain },
]

const climates = [
  { id: "calido", name: "Cálido / Playa", icon: Sun },
  { id: "templado", name: "Templado", icon: CloudSun },
  { id: "frio", name: "Frío / Montaña", icon: Snowflake },
  { id: "tropical", name: "Tropical / Selva", icon: Leaf },
]

const adventureLevels = [
  { id: 1, name: "Tranquilo", description: "Relax, cultura y buena comida" },
  { id: 2, name: "Moderado", description: "Caminatas suaves y paseos" },
  { id: 3, name: "Activo", description: "Senderismo, kayak, ciclismo" },
  { id: 4, name: "Extremo", description: "Escalada, rafting, deportes de riesgo" },
]

type FormData = {
  name: string
  country: string
  language: string
  travelerType: string
  budget: string
  interests: string[]
  accessibility: string[]
  climate: string
  experience: string
  adventureLevel: number
  visitedBefore: string
}

const initialData: FormData = {
  name: "",
  country: "",
  language: "es",
  travelerType: "",
  budget: "",
  interests: [],
  accessibility: [],
  climate: "",
  experience: "",
  adventureLevel: 0,
  visitedBefore: "",
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialData)
  const [showErrors, setShowErrors] = useState(false)
  const [restored, setRestored] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const isFirstLoad = useRef(true)

  // --- Autoguardado: restaurar borrador ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.formData) setFormData({ ...initialData, ...parsed.formData })
        if (parsed.currentStep) setCurrentStep(parsed.currentStep)
        setRestored(true)
      }
    } catch {
      // ignore
    }
  }, [])

  // --- Autoguardado: guardar en cada cambio ---
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }))
      const now = new Date()
      setSavedAt(now.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }))
    } catch {
      // ignore
    }
  }, [formData, currentStep])

  // --- Mover foco al título al cambiar de paso (operable) ---
  useEffect(() => {
    headingRef.current?.focus()
  }, [currentStep])

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArray = (key: "interests" | "accessibility", id: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((i) => i !== id) : [...prev[key], id],
    }))
  }

  // --- Validación por paso (devuelve mensajes específicos) ---
  const stepErrors = (): string[] => {
    const errs: string[] = []
    if (currentStep === 1) {
      if (formData.name.trim().length < 2) errs.push("Ingresa tu nombre (mínimo 2 caracteres).")
      if (!formData.country) errs.push("Selecciona tu país de residencia.")
      if (!formData.travelerType) errs.push("Indica con quién sueles viajar.")
    } else if (currentStep === 2) {
      if (!formData.budget) errs.push("Selecciona un rango de presupuesto.")
      if (formData.interests.length < 2) errs.push("Elige al menos 2 intereses turísticos.")
      if (!formData.climate) errs.push("Elige tu clima favorito.")
    } else if (currentStep === 3) {
      if (formData.adventureLevel === 0) errs.push("Selecciona tu nivel de aventura.")
      if (!formData.visitedBefore) errs.push("Cuéntanos si ya habías visitado Ecuador.")
    }
    return errs
  }

  const errors = stepErrors()
  const canProceed = errors.length === 0

  const handleNext = () => {
    if (!canProceed) {
      setShowErrors(true)
      // anunciar errores a lectores de pantalla
      requestAnimationFrame(() => statusRef.current?.focus())
      return
    }
    setShowErrors(false)
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setShowErrors(false)
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const progressPct = Math.round(((currentStep - 1) / (steps.length - 1)) * 100)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="font-semibold text-lg text-foreground">Destinify</span>
          </Link>
          {savedAt && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Guardado {savedAt}
            </span>
          )}
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-4 py-8 lg:py-12">
        {/* Aviso de borrador recuperado */}
        {restored && (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground"
          >
            <Save className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p>
              Recuperamos tu progreso anterior para que continúes donde lo dejaste. Puedes seguir o{" "}
              <button
                type="button"
                onClick={() => {
                  clearDraft()
                  setFormData(initialData)
                  setCurrentStep(1)
                  setRestored(false)
                }}
                className="font-semibold text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                empezar de nuevo
              </button>
              .
            </p>
          </div>
        )}

        {/* Barra de progreso visual + accesible */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Paso {currentStep} de {steps.length}: {steps[currentStep - 1].name}
            </p>
            <p className="text-sm text-muted-foreground">{progressPct}% completado</p>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso del registro: ${progressPct}%`}
          >
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>

          {/* Indicadores de paso */}
          <ol className="mt-5 flex items-center justify-between">
            {steps.map((step, index) => {
              const isDone = currentStep > step.id
              const isCurrent = currentStep === step.id
              return (
                <li key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors ${
                        isDone
                          ? "border-primary bg-primary text-primary-foreground"
                          : isCurrent
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted bg-muted text-muted-foreground"
                      }`}
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      {isDone ? <Check className="h-5 w-5" aria-hidden="true" /> : <step.icon className="h-5 w-5" aria-hidden="true" />}
                    </span>
                    <span className="mt-2 hidden text-xs font-medium text-muted-foreground sm:block">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-2 h-0.5 flex-1 transition-colors ${isDone ? "bg-primary" : "bg-muted"}`} aria-hidden="true" />
                  )}
                </li>
              )
            })}
          </ol>
        </div>

        {/* Resumen de errores (visible + auditivo) */}
        <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="focus-visible:outline-none">
          {showErrors && errors.length > 0 && (
            <div role="alert" className="mb-6 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
              <div className="flex items-center gap-2 font-semibold text-destructive">
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
                Revisa estos campos antes de continuar
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-9 text-sm text-foreground">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleNext()
          }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:p-8"
        >
          {/* PASO 1 — Datos básicos */}
          {currentStep === 1 && (
            <fieldset className="space-y-6">
              <legend className="sr-only">Datos básicos del viajero</legend>
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-foreground focus-visible:outline-none">
                  Cuéntanos sobre ti
                </h2>
                <p className="mt-2 text-muted-foreground">Solo lo esencial. Personalizamos tu experiencia sin pedirte de más.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Ej. María"
                  value={formData.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-required="true"
                  aria-describedby="name-help"
                  className="h-12"
                />
                <p id="name-help" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Lo usaremos para saludarte en tus itinerarios.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">
                  País de residencia <span className="text-destructive">*</span>
                </Label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  value={formData.country}
                  onChange={(e) => update("country", e.target.value)}
                  aria-required="true"
                  className="h-12 w-full rounded-md border border-input bg-background px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Selecciona tu país…</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-base" id="lang-label">
                  Idioma preferido
                </Label>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="lang-label">
                  {languages.map((lang) => {
                    const isSelected = formData.language === lang.id
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => update("language", lang.id)}
                        className={`min-h-11 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {lang.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base" id="type-label">
                  Tipo de viajero <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="type-label" aria-required="true">
                  {travelerTypes.map((type) => {
                    const isSelected = formData.travelerType === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => update("travelerType", type.id)}
                        className={`min-h-11 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {type.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </fieldset>
          )}

          {/* PASO 2 — Preferencias */}
          {currentStep === 2 && (
            <fieldset className="space-y-8">
              <legend className="sr-only">Preferencias de viaje</legend>
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-foreground focus-visible:outline-none">
                  Tus preferencias
                </h2>
                <p className="mt-2 text-muted-foreground">Esto afina las recomendaciones a tu medida.</p>
              </div>

              {/* Presupuesto */}
              <div className="space-y-3">
                <Label className="text-base" id="budget-label">
                  Presupuesto diario <span className="text-destructive">*</span>
                </Label>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="budget-label" aria-required="true">
                  {budgetOptions.map((option) => {
                    const isSelected = formData.budget === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => update("budget", option.id)}
                        className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="font-semibold text-foreground">{option.name}</span>
                          <span className="text-sm font-medium text-primary">{option.range}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Intereses */}
              <div className="space-y-3">
                <Label className="text-base" id="interest-label">
                  Intereses turísticos <span className="text-destructive">*</span>
                </Label>
                <p id="interest-help" className="text-xs text-muted-foreground">
                  Selecciona al menos 2. Seleccionados: {formData.interests.length}
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="group" aria-labelledby="interest-label" aria-describedby="interest-help">
                  {interests.map((interest) => {
                    const isSelected = formData.interests.includes(interest.id)
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleArray("interests", interest.id)}
                        className={`flex min-h-11 flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <interest.icon className="h-6 w-6" aria-hidden="true" />
                        <span className="text-sm font-medium">{interest.name}</span>
                        {isSelected && <Check className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Accesibilidad requerida (Hick's Law: Progressive Disclosure) */}
              <details className="group rounded-xl border border-border bg-card p-4 transition-all">
                <summary className="cursor-pointer text-base font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm flex items-center justify-between">
                  <span>Requerimientos de accesibilidad (Opcional)</span>
                  <span className="text-xs text-muted-foreground group-open:hidden">Mostrar opciones</span>
                  <span className="text-xs text-muted-foreground hidden group-open:inline">Ocultar opciones</span>
                </summary>
                
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <p id="a11y-help" className="mb-3 text-xs text-muted-foreground">
                    Nos ayuda a recomendarte lugares y servicios adaptados a tus necesidades.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2" role="group" aria-describedby="a11y-help">
                    {accessibilityNeeds.map((need) => {
                      const isSelected = formData.accessibility.includes(need.id)
                      return (
                        <button
                          key={need.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => toggleArray("accessibility", need.id)}
                          className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            isSelected ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:border-primary/50"
                          }`}
                        >
                          <need.icon className={`mt-0.5 h-5 w-5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
                          <span>
                            <span className="block font-medium text-foreground">{need.name}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">{need.description}</span>
                          </span>
                          {isSelected && <Check className="ml-auto h-4 w-4 text-primary" aria-hidden="true" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </details>

              {/* Clima favorito */}
              <div className="space-y-3">
                <Label className="text-base" id="climate-label">
                  Clima favorito <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup" aria-labelledby="climate-label" aria-required="true">
                  {climates.map((climate) => {
                    const isSelected = formData.climate === climate.id
                    return (
                      <button
                        key={climate.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => update("climate", climate.id)}
                        className={`flex min-h-11 flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <climate.icon className="h-6 w-6" aria-hidden="true" />
                        <span className="text-sm font-medium">{climate.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </fieldset>
          )}

          {/* PASO 3 — Personalización IA */}
          {currentStep === 3 && (
            <fieldset className="space-y-8">
              <legend className="sr-only">Personalización con inteligencia artificial</legend>
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-foreground focus-visible:outline-none">
                  Personalización con IA
                </h2>
                <p className="mt-2 text-muted-foreground">Con esto, nuestra IA diseña experiencias hechas para ti.</p>
              </div>

              {/* Experiencia que busca (Hick's Law: Progressive Disclosure) */}
              <details className="group rounded-xl border border-border bg-card p-4 transition-all">
                <summary className="cursor-pointer text-base font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm flex items-center justify-between">
                  <span>Describe tu viaje ideal (Opcional)</span>
                  <span className="text-xs text-muted-foreground group-open:hidden">Escribir</span>
                  <span className="text-xs text-muted-foreground hidden group-open:inline">Ocultar</span>
                </summary>
                
                <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                  <textarea
                    id="experience"
                    name="experience"
                    rows={4}
                    placeholder="Ej. Quiero conocer la cultura andina, probar comida típica y hacer una caminata con vistas a volcanes…"
                    value={formData.experience}
                    onChange={(e) => update("experience", e.target.value)}
                    aria-describedby="exp-help"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <p id="exp-help" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Cuéntalo con tus palabras. La IA lo interpretará para sugerirte destinos y actividades.
                  </p>
                </div>
              </details>

              {/* Nivel de aventura */}
              <div className="space-y-3">
                <Label className="text-base" id="adv-label">
                  Nivel de aventura <span className="text-destructive">*</span>
                </Label>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="adv-label" aria-required="true">
                  {adventureLevels.map((level) => {
                    const isSelected = formData.adventureLevel === level.id
                    return (
                      <button
                        key={level.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => update("adventureLevel", level.id)}
                        className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <span className="font-semibold text-foreground">{level.name}</span>
                        <span className="mt-1 text-sm text-muted-foreground">{level.description}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Viajes anteriores */}
              <div className="space-y-3">
                <Label className="text-base" id="visited-label">
                  ¿Habías visitado Ecuador antes? <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="visited-label" aria-required="true">
                  {[
                    { id: "primera", name: "Es mi primera vez" },
                    { id: "una-vez", name: "Una vez" },
                    { id: "varias", name: "Varias veces" },
                    { id: "vivo-aqui", name: "Vivo aquí" },
                  ].map((opt) => {
                    const isSelected = formData.visitedBefore === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => update("visitedBefore", opt.id)}
                        className={`min-h-11 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {opt.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Resumen de selección */}
              {formData.interests.length > 0 && (
                <div className="rounded-xl border border-border bg-secondary/50 p-4">
                  <p className="text-sm font-medium text-foreground">Tu perfil de viaje</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.interests.map((id) => {
                      const interest = interests.find((i) => i.id === id)
                      return (
                        <Badge key={id} variant="secondary">
                          {interest?.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </fieldset>
          )}

          {/* Navegación */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <Button type="button" variant="ghost" onClick={handleBack} disabled={currentStep === 1} className="h-11 gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Atrás
            </Button>

            {currentStep < 3 ? (
              <Button type="submit" className="h-11 gap-2">
                Continuar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button type="button" className="h-11 gap-2" disabled={!canProceed} asChild={canProceed} onClick={canProceed ? clearDraft : handleNext}>
                {canProceed ? (
                  <Link href="/perfil">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Crear mi perfil
                  </Link>
                ) : (
                  <span>
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Crear mi perfil
                  </span>
                )}
              </Button>
            )}
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Tu progreso se guarda automáticamente en este dispositivo. Puedes cerrar y volver cuando quieras.
        </p>
      </main>
    </div>
  )
}
