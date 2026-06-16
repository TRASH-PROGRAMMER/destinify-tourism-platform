"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Form = {
  businessName: string
  category: string
  ruc: string
  contactName: string
  email: string
  phone: string
  city: string
  address: string
  description: string
  acceptTerms: boolean
}

const empty: Form = {
  businessName: "",
  category: "",
  ruc: "",
  contactName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  description: "",
  acceptTerms: false,
}

export function ProviderRegistration() {
  const [form, setForm] = useState<Form>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.businessName.trim()) next.businessName = "Ingrese el nombre del negocio."
    if (!form.category) next.category = "Seleccione una categoría."
    if (!form.ruc.trim()) next.ruc = "Ingrese su RUC."
    else if (!/^\d{13}$/.test(form.ruc.trim())) next.ruc = "El RUC debe tener 13 dígitos."
    if (!form.contactName.trim()) next.contactName = "Ingrese el nombre del responsable."
    if (!form.email.trim()) next.email = "Ingrese su correo electrónico."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Ingrese un correo válido."
    if (!form.phone.trim()) next.phone = "Ingrese un teléfono de contacto."
    if (!form.city.trim()) next.city = "Ingrese la ciudad."
    if (!form.description.trim() || form.description.trim().length < 30)
      next.description = "Describe tu negocio con al menos 30 caracteres."
    if (!form.acceptTerms) next.acceptTerms = "Debes aceptar los términos para registrarte."
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setTimeout(() => errorSummaryRef.current?.focus(), 50)
      return false
    }
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-10">
        <Card className="w-full">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">¡Registro enviado!</h1>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">
                Gracias por unirte a Destinify, <strong>{form.businessName}</strong>. Revisaremos tu solicitud y te
                enviaremos un correo a {form.email} en un plazo de 24 a 48 horas.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href="/admin">Ir al panel</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const errorList = Object.entries(errors)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:py-10">
      <header className="mb-6 text-center">
        <div className="mb-3 inline-flex items-center gap-2 font-serif text-xl font-bold text-foreground">
          <Compass className="h-6 w-6 text-primary" aria-hidden="true" />
          Destinify
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground text-balance">Regístrate como proveedor</h1>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          Publica tus hoteles, tours o restaurantes y llega a miles de viajeros en Ecuador.
        </p>
      </header>

      {errorList.length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
        >
          <p className="flex items-center gap-2 font-medium text-destructive">
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
            Corrige los siguientes {errorList.length} campo(s):
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-destructive">
            {errorList.map(([key, msg]) => (
              <li key={key}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información del negocio</CardTitle>
          <CardDescription>
            Los campos marcados con <span className="text-destructive">*</span> son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Field id="businessName" label="Nombre del negocio" error={errors.businessName} icon={Building2} required>
              <Input
                id="businessName"
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                aria-invalid={!!errors.businessName}
                aria-describedby={errors.businessName ? "businessName-error" : undefined}
                className="pl-9"
                placeholder="Ej. Hotel Boutique La Casona"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Categoría<span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger id="category" aria-invalid={!!errors.category}>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel / Hospedaje</SelectItem>
                    <SelectItem value="tour">Tours / Excursiones</SelectItem>
                    <SelectItem value="restaurante">Restaurante</SelectItem>
                    <SelectItem value="mixto">Varios servicios</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p id="category-error" role="alert" className="text-sm text-destructive">
                    {errors.category}
                  </p>
                )}
              </div>

              <Field id="ruc" label="RUC" error={errors.ruc} icon={FileText} required>
                <Input
                  id="ruc"
                  inputMode="numeric"
                  value={form.ruc}
                  onChange={(e) => set("ruc", e.target.value)}
                  aria-invalid={!!errors.ruc}
                  aria-describedby={errors.ruc ? "ruc-error" : undefined}
                  className="pl-9"
                  placeholder="13 dígitos"
                />
              </Field>
            </div>

            <Field id="contactName" label="Nombre del responsable" error={errors.contactName} required>
              <Input
                id="contactName"
                value={form.contactName}
                onChange={(e) => set("contactName", e.target.value)}
                aria-invalid={!!errors.contactName}
                aria-describedby={errors.contactName ? "contactName-error" : undefined}
                placeholder="Nombre y apellido"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="email" label="Correo electrónico" error={errors.email} icon={Mail} required>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="pl-9"
                  placeholder="contacto@negocio.ec"
                />
              </Field>

              <Field id="phone" label="Teléfono" error={errors.phone} icon={Phone} required>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className="pl-9"
                  placeholder="+593 99 123 4567"
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="city" label="Ciudad" error={errors.city} icon={MapPin} required>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? "city-error" : undefined}
                  className="pl-9"
                  placeholder="Ej. Quito"
                />
              </Field>

              <Field id="address" label="Dirección (opcional)">
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Calle, número, referencia"
                />
              </Field>
            </div>

            <Field id="description" label="Descripción del negocio" error={errors.description} required>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "description-error" : undefined}
                rows={4}
                placeholder="Cuéntanos qué ofreces, tu experiencia y qué te hace especial."
              />
            </Field>

            <div className="space-y-2">
              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <Checkbox
                  id="acceptTerms"
                  checked={form.acceptTerms}
                  onCheckedChange={(c) => set("acceptTerms", c === true)}
                  aria-invalid={!!errors.acceptTerms}
                  aria-describedby={errors.acceptTerms ? "acceptTerms-error" : undefined}
                  className="mt-0.5"
                />
                <Label htmlFor="acceptTerms" className="text-sm font-normal leading-relaxed">
                  Acepto los{" "}
                  <Link href="#" className="text-primary underline">
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="#" className="text-primary underline">
                    política de privacidad
                  </Link>{" "}
                  de Destinify para proveedores.
                </Label>
              </div>
              {errors.acceptTerms && (
                <p id="acceptTerms-error" role="alert" className="text-sm text-destructive">
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                "Enviando solicitud…"
              ) : (
                <>
                  Crear cuenta de proveedor
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/iniciar-sesion" className="font-medium text-primary underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({
  id,
  label,
  error,
  required,
  icon: Icon,
  children,
}: {
  id: string
  label: string
  error?: string
  required?: boolean
  icon?: typeof Building2
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
