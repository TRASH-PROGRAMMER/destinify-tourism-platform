"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  User,
  Phone,
  ShieldCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Info,
  Lock,
  PartyPopper,
} from "lucide-react"

const STORAGE_KEY = "destinify-booking-draft"

const steps = [
  { id: "viaje", label: "Viaje", icon: MapPin },
  { id: "personal", label: "Datos", icon: User },
  { id: "pago", label: "Pago", icon: CreditCard },
  { id: "revision", label: "Revisión", icon: CheckCircle2 },
]

// Trip base data (in a real app this would come from the selected offer)
const tripBase = {
  destination: "Islas Galápagos",
  package: "Tour Completo 5 días / 4 noches",
  pricePerPerson: 890,
  image: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800&h=600&fit=crop",
  availability: "available", // available | limited | soldout
  availabilitySpots: 6,
}

const TAX_RATE = 0.12 // IVA Ecuador

type FormData = {
  // Trip
  destination: string
  startDate: string
  endDate: string
  travelers: string
  // Personal
  firstName: string
  lastName: string
  email: string
  phone: string
  documentId: string
  emergencyName: string
  emergencyPhone: string
  specialRequirements: string
  // Payment
  paymentMethod: string
  cardName: string
  cardNumber: string
  cardExpiry: string
  cardCvc: string
  billingAddress: string
  billingCity: string
  // Agreements
  acceptPolicies: boolean
  acceptCancellation: boolean
}

const emptyForm: FormData = {
  destination: tripBase.destination,
  startDate: "",
  endDate: "",
  travelers: "2",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  documentId: "",
  emergencyName: "",
  emergencyPhone: "",
  specialRequirements: "",
  paymentMethod: "card",
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  billingAddress: "",
  billingCity: "",
  acceptPolicies: false,
  acceptCancellation: false,
}

type Errors = Partial<Record<keyof FormData, string>>

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<Errors>({})
  const [confirmed, setConfirmed] = useState(false)
  const [restored, setRestored] = useState(false)
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)

  // Restore saved draft on mount (prevents data loss on refresh)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setForm({ ...emptyForm, ...parsed.form })
        if (typeof parsed.step === "number") setCurrentStep(parsed.step)
        setRestored(true)
      }
    } catch {
      // ignore corrupt draft
    }
  }, [])

  // Persist draft on every change (read-your-writes, survives refresh)
  useEffect(() => {
    if (confirmed) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step: currentStep }))
    } catch {
      // storage may be unavailable
    }
  }, [form, currentStep, confirmed])

  // Move focus to the step heading when changing steps (a11y)
  useEffect(() => {
    stepHeadingRef.current?.focus()
  }, [currentStep])

  const travelersNum = Math.max(1, Number.parseInt(form.travelers || "1", 10))
  const subtotal = tripBase.pricePerPerson * travelersNum
  const taxes = Math.round(subtotal * TAX_RATE)
  const total = subtotal + taxes

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value)

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    // Clear the field error as the user corrects it
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function validateStep(step: number): Errors {
    const e: Errors = {}
    if (step === 0) {
      if (!form.startDate) e.startDate = "Selecciona la fecha de llegada."
      if (!form.endDate) e.endDate = "Selecciona la fecha de salida."
      if (form.startDate && form.endDate && form.endDate < form.startDate) {
        e.endDate = "La fecha de salida debe ser posterior a la de llegada."
      }
      if (!form.travelers || travelersNum < 1) {
        e.travelers = "Indica al menos 1 viajero."
      }
    }
    if (step === 1) {
      if (!form.firstName.trim()) e.firstName = "Ingresa tu nombre."
      if (!form.lastName.trim()) e.lastName = "Ingresa tu apellido."
      if (!form.email.trim()) {
        e.email = "Ingresa tu correo electrónico."
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        e.email = "El correo no tiene un formato válido (ej. nombre@correo.com)."
      }
      if (!form.phone.trim()) {
        e.phone = "Ingresa un teléfono de contacto."
      } else if (form.phone.replace(/\D/g, "").length < 7) {
        e.phone = "El teléfono debe tener al menos 7 dígitos."
      }
      if (!form.documentId.trim()) e.documentId = "Ingresa tu cédula o pasaporte."
      // Hick's Law: Removed required validation for emergency contact to reduce friction
    if (step === 2) {
      if (form.paymentMethod === "card") {
        if (!form.cardName.trim()) e.cardName = "Ingresa el nombre en la tarjeta."
        const digits = form.cardNumber.replace(/\s/g, "")
        if (!digits) {
          e.cardNumber = "Ingresa el número de tarjeta."
        } else if (digits.length < 13 || !/^\d+$/.test(digits)) {
          e.cardNumber = "El número de tarjeta no es válido."
        }
        if (!form.cardExpiry.trim()) {
          e.cardExpiry = "Ingresa la fecha de expiración (MM/AA)."
        } else if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) {
          e.cardExpiry = "Usa el formato MM/AA."
        }
        if (!form.cardCvc.trim()) {
          e.cardCvc = "Ingresa el CVC."
        } else if (!/^\d{3,4}$/.test(form.cardCvc)) {
          e.cardCvc = "El CVC debe tener 3 o 4 dígitos."
        }
        if (!form.billingAddress.trim())
          e.billingAddress = "Ingresa la dirección de facturación."
        if (!form.billingCity.trim()) e.billingCity = "Ingresa la ciudad."
      }
    }
    if (step === 3) {
      if (!form.acceptPolicies)
        e.acceptPolicies = "Debes aceptar las políticas del servicio."
      if (!form.acceptCancellation)
        e.acceptCancellation = "Debes aceptar la política de cancelación."
    }
    return e
  }

  function goNext() {
    const e = validateStep(currentStep)
    setErrors(e)
    if (Object.keys(e).length > 0) {
      // Focus the error summary so screen readers announce it
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
  }

  function goBack() {
    setErrors({})
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  function handleConfirm() {
    const e = validateStep(3)
    setErrors(e)
    if (Object.keys(e).length > 0) {
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }
    // Explicit, non-automatic confirmation. Clear the draft on success.
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setConfirmed(true)
  }

  function discardDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setForm(emptyForm)
    setCurrentStep(0)
    setErrors({})
    setRestored(false)
  }

  const errorList = Object.entries(errors)

  if (confirmed) {
    return <ConfirmationScreen form={form} total={total} formatCurrency={formatCurrency} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 lg:px-8">
        <nav aria-label="Ruta de navegación" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/destinos" className="hover:text-primary">
                Destinos
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground" aria-current="page">
              Reservar
            </li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Reserva tu viaje
          </h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Completa los pasos para confirmar tu reserva. Tus datos se guardan
            automáticamente, no los perderás si actualizas la página.
          </p>
        </div>

        {restored && (
          <div
            role="status"
            className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm"
          >
            <Info className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-foreground">
              Recuperamos una reserva que dejaste sin terminar.
            </span>
            <button
              type="button"
              onClick={discardDraft}
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Empezar de nuevo
            </button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Form column */}
          <div>
            {/* Step indicator */}
            <ol className="mb-8 flex items-center" aria-label="Progreso de la reserva">
              {steps.map((step, index) => {
                const isComplete = index < currentStep
                const isCurrent = index === currentStep
                return (
                  <li key={step.id} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                          isComplete
                            ? "border-primary bg-primary text-primary-foreground"
                            : isCurrent
                              ? "border-primary bg-background text-primary"
                              : "border-border bg-background text-muted-foreground"
                        }`}
                        aria-current={isCurrent ? "step" : undefined}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <step.icon className="h-5 w-5" aria-hidden="true" />
                        )}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          isCurrent ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="sr-only">
                        {isComplete
                          ? "completado"
                          : isCurrent
                            ? "paso actual"
                            : "pendiente"}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`mx-2 h-0.5 flex-1 ${
                          isComplete ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </li>
                )
              })}
            </ol>

            {/* Error summary (focusable for screen readers) */}
            {errorList.length > 0 && (
              <div
                ref={errorSummaryRef}
                tabIndex={-1}
                role="alert"
                className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4"
              >
                <div className="flex items-center gap-2 font-medium text-destructive">
                  <AlertCircle className="h-5 w-5" aria-hidden="true" />
                  Revisa los siguientes campos
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-9 text-sm text-destructive">
                  {errorList.map(([key, msg]) => (
                    <li key={key}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              {/* Step 0: Trip */}
              {currentStep === 0 && (
                <section aria-labelledby="step-heading">
                  <h2
                    id="step-heading"
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="mb-1 text-xl font-semibold text-foreground outline-none"
                  >
                    Información del viaje
                  </h2>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Confirma el destino, las fechas y el número de personas.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="destination">Destino</Label>
                      <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
                        <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span className="text-sm font-medium text-foreground">
                          {form.destination}
                        </span>
                        <Badge variant="secondary" className="ml-auto">
                          {tripBase.package}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="startDate">
                          Fecha de llegada <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={form.startDate}
                          onChange={(e) => update("startDate", e.target.value)}
                          aria-invalid={!!errors.startDate}
                          aria-describedby={errors.startDate ? "startDate-error" : undefined}
                          className="mt-1.5"
                        />
                        {errors.startDate && (
                          <p id="startDate-error" className="mt-1.5 flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            {errors.startDate}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="endDate">
                          Fecha de salida <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={form.endDate}
                          onChange={(e) => update("endDate", e.target.value)}
                          aria-invalid={!!errors.endDate}
                          aria-describedby={errors.endDate ? "endDate-error" : undefined}
                          className="mt-1.5"
                        />
                        {errors.endDate && (
                          <p id="endDate-error" className="mt-1.5 flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            {errors.endDate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:max-w-[200px]">
                      <Label htmlFor="travelers">
                        Número de personas <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={form.travelers}
                        onValueChange={(v) => update("travelers", v)}
                      >
                        <SelectTrigger
                          id="travelers"
                          className="mt-1.5"
                          aria-invalid={!!errors.travelers}
                        >
                          <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} {n === 1 ? "persona" : "personas"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.travelers && (
                        <p className="mt-1.5 flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          {errors.travelers}
                        </p>
                      )}
                    </div>

                    {/* Availability status */}
                    <div
                      role="status"
                      className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span className="text-foreground">
                        Disponibilidad confirmada
                        {tripBase.availability === "limited" &&
                          ` · Solo quedan ${tripBase.availabilitySpots} cupos`}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* Step 1: Personal */}
              {currentStep === 1 && (
                <section aria-labelledby="step-heading">
                  <h2
                    id="step-heading"
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="mb-1 text-xl font-semibold text-foreground outline-none"
                  >
                    Información personal
                  </h2>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Necesitamos tus datos de contacto y de emergencia.
                  </p>

                  <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="firstName">
                          Nombre <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={form.firstName}
                          autoComplete="given-name"
                          onChange={(e) => update("firstName", e.target.value)}
                          aria-invalid={!!errors.firstName}
                          aria-describedby={errors.firstName ? "firstName-error" : undefined}
                          className="mt-1.5"
                        />
                        {errors.firstName && (
                          <FieldError id="firstName-error" message={errors.firstName} />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">
                          Apellido <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          value={form.lastName}
                          autoComplete="family-name"
                          onChange={(e) => update("lastName", e.target.value)}
                          aria-invalid={!!errors.lastName}
                          aria-describedby={errors.lastName ? "lastName-error" : undefined}
                          className="mt-1.5"
                        />
                        {errors.lastName && (
                          <FieldError id="lastName-error" message={errors.lastName} />
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="email">
                          Correo electrónico <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : "email-hint"}
                          className="mt-1.5"
                        />
                        {errors.email ? (
                          <FieldError id="email-error" message={errors.email} />
                        ) : (
                          <p id="email-hint" className="mt-1.5 text-xs text-muted-foreground">
                            Enviaremos la confirmación a este correo.
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">
                          Teléfono <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "phone-error" : undefined}
                          className="mt-1.5"
                        />
                        {errors.phone && (
                          <FieldError id="phone-error" message={errors.phone} />
                        )}
                      </div>
                    </div>

                    <div className="sm:max-w-[280px]">
                      <Label htmlFor="documentId">
                        Cédula o pasaporte <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="documentId"
                        value={form.documentId}
                        onChange={(e) => update("documentId", e.target.value)}
                        aria-invalid={!!errors.documentId}
                        aria-describedby={errors.documentId ? "documentId-error" : undefined}
                        className="mt-1.5"
                      />
                      {errors.documentId && (
                        <FieldError id="documentId-error" message={errors.documentId} />
                      )}
                    </div>

                    <Separator />

                    {/* Hick's Law: Progressive Disclosure para información secundaria */}
                    <details className="group rounded-lg border border-border bg-card p-4 transition-all">
                      <summary className="cursor-pointer text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" aria-hidden="true" />
                          Información Adicional (Opcional)
                        </span>
                        <span className="text-xs text-muted-foreground group-open:hidden">Mostrar</span>
                        <span className="text-xs text-muted-foreground hidden group-open:inline">Ocultar</span>
                      </summary>
                      
                      <div className="mt-4 space-y-5 animate-in fade-in slide-in-from-top-2">
                        <div>
                          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                            Contacto de emergencia
                          </h3>
                          <div className="mt-3 grid gap-4 sm:grid-cols-2">
                            <div>
                              <Label htmlFor="emergencyName">Nombre completo</Label>
                              <Input
                                id="emergencyName"
                                value={form.emergencyName}
                                onChange={(e) => update("emergencyName", e.target.value)}
                                className="mt-1.5"
                                placeholder="Ej: Maria Perez"
                              />
                            </div>
                            <div>
                              <Label htmlFor="emergencyPhone">Teléfono</Label>
                              <Input
                                id="emergencyPhone"
                                type="tel"
                                inputMode="tel"
                                value={form.emergencyPhone}
                                onChange={(e) => update("emergencyPhone", e.target.value)}
                                className="mt-1.5"
                                placeholder="Ej: +593..."
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="specialRequirements">
                            Requerimientos especiales
                          </Label>
                          <Textarea
                            id="specialRequirements"
                            value={form.specialRequirements}
                            onChange={(e) => update("specialRequirements", e.target.value)}
                            placeholder="Alergias alimentarias, movilidad reducida, dietas, etc."
                            className="mt-1.5 min-h-24"
                            aria-describedby="specialRequirements-hint"
                          />
                          <p
                            id="specialRequirements-hint"
                            className="mt-1.5 text-xs text-muted-foreground"
                          >
                            Cuéntanos cómo podemos hacer tu viaje más accesible y cómodo.
                          </p>
                        </div>
                      </div>
                    </details>
                  </div>
                </section>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <section aria-labelledby="step-heading">
                  <h2
                    id="step-heading"
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="mb-1 text-xl font-semibold text-foreground outline-none"
                  >
                    Método de pago
                  </h2>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Elige cómo deseas pagar. Tu información está protegida.
                  </p>

                  <fieldset className="space-y-3">
                    <legend className="sr-only">Selecciona un método de pago</legend>
                    <RadioGroup
                      value={form.paymentMethod}
                      onValueChange={(v) => update("paymentMethod", v)}
                      className="gap-3"
                    >
                      <label
                        htmlFor="pay-card"
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                          form.paymentMethod === "card"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem value="card" id="pay-card" />
                        <CreditCard className="h-5 w-5 text-primary" aria-hidden="true" />
                        <span className="text-sm font-medium text-foreground">
                          Tarjeta de crédito o débito
                        </span>
                      </label>
                      <label
                        htmlFor="pay-transfer"
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                          form.paymentMethod === "transfer"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem value="transfer" id="pay-transfer" />
                        <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                        <span className="text-sm font-medium text-foreground">
                          Transferencia bancaria
                        </span>
                      </label>
                    </RadioGroup>
                  </fieldset>

                  {form.paymentMethod === "card" && (
                    <div className="mt-6 space-y-5">
                      <div>
                        <Label htmlFor="cardName">
                          Nombre en la tarjeta <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="cardName"
                          value={form.cardName}
                          autoComplete="cc-name"
                          onChange={(e) => update("cardName", e.target.value)}
                          aria-invalid={!!errors.cardName}
                          aria-describedby={errors.cardName ? "cardName-error" : undefined}
                          className="mt-1.5"
                        />
                        {errors.cardName && (
                          <FieldError id="cardName-error" message={errors.cardName} />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">
                          Número de tarjeta <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="cardNumber"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          placeholder="1234 5678 9012 3456"
                          value={form.cardNumber}
                          onChange={(e) => update("cardNumber", e.target.value)}
                          aria-invalid={!!errors.cardNumber}
                          aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
                          className="mt-1.5"
                        />
                        {errors.cardNumber && (
                          <FieldError id="cardNumber-error" message={errors.cardNumber} />
                        )}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="cardExpiry">
                            Expiración (MM/AA) <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="cardExpiry"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            placeholder="MM/AA"
                            value={form.cardExpiry}
                            onChange={(e) => update("cardExpiry", e.target.value)}
                            aria-invalid={!!errors.cardExpiry}
                            aria-describedby={errors.cardExpiry ? "cardExpiry-error" : undefined}
                            className="mt-1.5"
                          />
                          {errors.cardExpiry && (
                            <FieldError id="cardExpiry-error" message={errors.cardExpiry} />
                          )}
                        </div>
                        <div>
                          <Label htmlFor="cardCvc">
                            CVC <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="cardCvc"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            placeholder="123"
                            value={form.cardCvc}
                            onChange={(e) => update("cardCvc", e.target.value)}
                            aria-invalid={!!errors.cardCvc}
                            aria-describedby={errors.cardCvc ? "cardCvc-error" : undefined}
                            className="mt-1.5"
                          />
                          {errors.cardCvc && (
                            <FieldError id="cardCvc-error" message={errors.cardCvc} />
                          )}
                        </div>
                      </div>

                      <Separator />

                      <h3 className="text-sm font-semibold text-foreground">
                        Dirección de facturación
                      </h3>
                      <div>
                        <Label htmlFor="billingAddress">
                          Dirección <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="billingAddress"
                          autoComplete="street-address"
                          value={form.billingAddress}
                          onChange={(e) => update("billingAddress", e.target.value)}
                          aria-invalid={!!errors.billingAddress}
                          aria-describedby={
                            errors.billingAddress ? "billingAddress-error" : undefined
                          }
                          className="mt-1.5"
                        />
                        {errors.billingAddress && (
                          <FieldError id="billingAddress-error" message={errors.billingAddress} />
                        )}
                      </div>
                      <div className="sm:max-w-[280px]">
                        <Label htmlFor="billingCity">
                          Ciudad <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="billingCity"
                          autoComplete="address-level2"
                          value={form.billingCity}
                          onChange={(e) => update("billingCity", e.target.value)}
                          aria-invalid={!!errors.billingCity}
                          aria-describedby={errors.billingCity ? "billingCity-error" : undefined}
                          className="mt-1.5"
                        />
                        {errors.billingCity && (
                          <FieldError id="billingCity-error" message={errors.billingCity} />
                        )}
                      </div>
                    </div>
                  )}

                  {form.paymentMethod === "transfer" && (
                    <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                      <p>
                        Te enviaremos los datos bancarios por correo. Tu reserva quedará
                        pendiente hasta confirmar el pago, sin cargos automáticos.
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
                    <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Tus datos de pago se transmiten de forma cifrada y segura.
                  </div>
                </section>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <section aria-labelledby="step-heading">
                  <h2
                    id="step-heading"
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="mb-1 text-xl font-semibold text-foreground outline-none"
                  >
                    Revisa y confirma
                  </h2>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Verifica que todo esté correcto. Puedes editar cualquier sección antes
                    de confirmar.
                  </p>

                  <div className="space-y-4">
                    <ReviewBlock
                      title="Información del viaje"
                      onEdit={() => setCurrentStep(0)}
                      rows={[
                        ["Destino", form.destination],
                        ["Paquete", tripBase.package],
                        ["Llegada", form.startDate || "—"],
                        ["Salida", form.endDate || "—"],
                        [
                          "Personas",
                          `${travelersNum} ${travelersNum === 1 ? "persona" : "personas"}`,
                        ],
                      ]}
                    />
                    <ReviewBlock
                      title="Información personal"
                      onEdit={() => setCurrentStep(1)}
                      rows={[
                        ["Nombre", `${form.firstName} ${form.lastName}`.trim() || "—"],
                        ["Correo", form.email || "—"],
                        ["Teléfono", form.phone || "—"],
                        ["Documento", form.documentId || "—"],
                        [
                          "Emergencia",
                          form.emergencyName
                            ? `${form.emergencyName} · ${form.emergencyPhone}`
                            : "—",
                        ],
                        ...(form.specialRequirements
                          ? ([["Requerimientos", form.specialRequirements]] as [string, string][])
                          : []),
                      ]}
                    />
                    <ReviewBlock
                      title="Pago"
                      onEdit={() => setCurrentStep(2)}
                      rows={[
                        [
                          "Método",
                          form.paymentMethod === "card"
                            ? "Tarjeta de crédito/débito"
                            : "Transferencia bancaria",
                        ],
                        ...(form.paymentMethod === "card"
                          ? ([
                              [
                                "Tarjeta",
                                form.cardNumber
                                  ? `•••• ${form.cardNumber.replace(/\s/g, "").slice(-4)}`
                                  : "—",
                              ],
                            ] as [string, string][])
                          : []),
                      ]}
                    />

                    {/* Policies & cancellation */}
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Info className="h-4 w-4 text-primary" aria-hidden="true" />
                        Políticas y cancelación
                      </h3>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        <li>Cancelación gratuita hasta 7 días antes de la fecha de llegada.</li>
                        <li>Entre 7 y 3 días antes: se retiene el 50% del total.</li>
                        <li>Menos de 3 días antes: no reembolsable.</li>
                        <li>Reprogramación sujeta a disponibilidad sin costo adicional.</li>
                      </ul>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="acceptPolicies"
                            checked={form.acceptPolicies}
                            onCheckedChange={(v) => update("acceptPolicies", v === true)}
                            aria-invalid={!!errors.acceptPolicies}
                            aria-describedby={
                              errors.acceptPolicies ? "acceptPolicies-error" : undefined
                            }
                            className="mt-0.5"
                          />
                          <Label
                            htmlFor="acceptPolicies"
                            className="text-sm font-normal leading-relaxed text-foreground"
                          >
                            He leído y acepto las políticas del servicio y el tratamiento de
                            mis datos personales.
                          </Label>
                        </div>
                        {errors.acceptPolicies && (
                          <FieldError id="acceptPolicies-error" message={errors.acceptPolicies} />
                        )}
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="acceptCancellation"
                            checked={form.acceptCancellation}
                            onCheckedChange={(v) => update("acceptCancellation", v === true)}
                            aria-invalid={!!errors.acceptCancellation}
                            aria-describedby={
                              errors.acceptCancellation ? "acceptCancellation-error" : undefined
                            }
                            className="mt-0.5"
                          />
                          <Label
                            htmlFor="acceptCancellation"
                            className="text-sm font-normal leading-relaxed text-foreground"
                          >
                            Entiendo y acepto la política de cancelación descrita arriba.
                          </Label>
                        </div>
                        {errors.acceptCancellation && (
                          <FieldError
                            id="acceptCancellation-error"
                            message={errors.acceptCancellation}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex items-center justify-between gap-3">
                {currentStep > 0 ? (
                  <Button variant="outline" onClick={goBack}>
                    <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
                    Atrás
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href="/destinos">
                      <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
                      Cancelar
                    </Link>
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button onClick={goNext}>
                    Continuar
                    <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button onClick={handleConfirm} size="lg">
                    <Lock className="h-4 w-4 mr-2" aria-hidden="true" />
                    Confirmar y pagar {formatCurrency(total)}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Resumen del viaje">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <img
                src={tripBase.image || "/placeholder.svg"}
                alt={`Vista de ${tripBase.destination}`}
                className="h-40 w-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="p-5">
                <h2 className="font-semibold text-foreground">{tripBase.destination}</h2>
                <p className="text-sm text-muted-foreground">{tripBase.package}</p>

                <div className="mt-4 space-y-2 text-sm">
                  {form.startDate && form.endDate && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {form.startDate} — {form.endDate}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {travelersNum} {travelersNum === 1 ? "persona" : "personas"}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Transparent price breakdown — never hide costs */}
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">
                      {formatCurrency(tripBase.pricePerPerson)} × {travelersNum}
                    </dt>
                    <dd className="font-medium text-foreground">{formatCurrency(subtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Impuestos (IVA 12%)</dt>
                    <dd className="font-medium text-foreground">{formatCurrency(taxes)}</dd>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between text-base">
                    <dt className="font-semibold text-foreground">Total</dt>
                    <dd className="font-bold text-primary">{formatCurrency(total)}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    No se realizan cargos hasta que confirmes. Cancelación gratuita hasta 7
                    días antes.
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1 text-sm text-destructive">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  )
}

function ReviewBlock({
  title,
  rows,
  onEdit,
}: {
  title: string
  rows: [string, string][]
  onEdit: () => void
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 text-primary">
          <Pencil className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
          Editar
        </Button>
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function ConfirmationScreen({
  form,
  total,
  formatCurrency,
}: {
  form: FormData
  total: number
  formatCurrency: (v: number) => string
}) {
  const confirmationCode = `DST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-20 pt-32 text-center lg:px-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <PartyPopper className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight text-foreground">
          ¡Reserva confirmada!
        </h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          Hemos enviado los detalles a{" "}
          <span className="font-medium text-foreground">{form.email}</span>. Guarda tu código
          de confirmación.
        </p>

        <div className="mt-8 w-full rounded-xl border border-border bg-card p-6 text-left shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Código de confirmación</span>
            <Badge className="font-mono text-sm">{confirmationCode}</Badge>
          </div>
          <Separator className="my-4" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Destino</dt>
              <dd className="font-medium text-foreground">{form.destination}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Fechas</dt>
              <dd className="font-medium text-foreground">
                {form.startDate} — {form.endDate}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Titular</dt>
              <dd className="font-medium text-foreground">
                {form.firstName} {form.lastName}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Total pagado</dt>
              <dd className="font-bold text-primary">{formatCurrency(total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/reservas">Ver mis reservas</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/destinos">Explorar más destinos</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
