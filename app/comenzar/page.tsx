"use client"

import { useState } from "react"
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
  Heart,
  Wallet,
  Globe,
  Check,
  Sparkles,
  Mountain,
  Utensils,
  Camera,
  Waves,
  TreePine,
  Music,
  ShoppingBag,
  History,
} from "lucide-react"

const steps = [
  { id: 1, name: "Datos básicos", icon: User },
  { id: 2, name: "Intereses", icon: Heart },
  { id: 3, name: "Presupuesto", icon: Wallet },
  { id: 4, name: "Preferencias", icon: Globe },
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

const budgetOptions = [
  { id: "economico", name: "Económico", description: "Hostales, transporte público, comida local", range: "$20-50/día" },
  { id: "moderado", name: "Moderado", description: "Hoteles 3 estrellas, tours grupales", range: "$50-100/día" },
  { id: "premium", name: "Premium", description: "Hoteles 4-5 estrellas, experiencias exclusivas", range: "$100-200/día" },
  { id: "lujo", name: "Lujo", description: "Resorts de lujo, tours privados, primera clase", range: "$200+/día" },
]

const travelStyles = [
  { id: "solo", name: "Viajo solo/a" },
  { id: "pareja", name: "En pareja" },
  { id: "familia", name: "En familia" },
  { id: "amigos", name: "Con amigos" },
  { id: "negocios", name: "Viaje de negocios" },
]

const languages = [
  { id: "es", name: "Español" },
  { id: "en", name: "English" },
  { id: "de", name: "Deutsch" },
  { id: "fr", name: "Français" },
  { id: "pt", name: "Português" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interests: [] as string[],
    budget: "",
    travelStyle: "",
    language: "es",
  })

  const toggleInterest = (interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((i) => i !== interestId)
        : [...prev.interests, interestId],
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.length >= 2 && formData.email.includes("@")
      case 2:
        return formData.interests.length >= 2
      case 3:
        return formData.budget !== ""
      case 4:
        return formData.travelStyle !== ""
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="font-semibold text-lg text-foreground">Destinify</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 lg:py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      currentStep > step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="mt-2 text-xs font-medium text-muted-foreground hidden sm:block">
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-12 sm:w-24 lg:w-32 mx-2 transition-colors ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8 shadow-sm">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Cuéntanos sobre ti</h2>
                <p className="mt-2 text-muted-foreground">
                  Esta información nos ayuda a personalizar tu experiencia.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">¿Qué te gusta hacer?</h2>
                <p className="mt-2 text-muted-foreground">
                  Selecciona al menos 2 intereses para personalizar tus recomendaciones.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {interests.map((interest) => {
                  const isSelected = formData.interests.includes(interest.id)
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-secondary"
                      }`}
                    >
                      <interest.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{interest.name}</span>
                    </button>
                  )
                })}
              </div>

              {formData.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((id) => {
                    const interest = interests.find((i) => i.id === id)
                    return (
                      <Badge key={id} variant="secondary" className="gap-1">
                        {interest?.name}
                        <button
                          type="button"
                          onClick={() => toggleInterest(id)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Budget */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">¿Cuál es tu presupuesto?</h2>
                <p className="mt-2 text-muted-foreground">
                  Esto nos ayuda a recomendarte opciones que se ajusten a tu bolsillo.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {budgetOptions.map((option) => {
                  const isSelected = formData.budget === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: option.id })}
                      className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50 hover:bg-secondary"
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
          )}

          {/* Step 4: Preferences */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Últimos detalles</h2>
                <p className="mt-2 text-muted-foreground">
                  Cuéntanos cómo prefieres viajar para afinar las recomendaciones.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base">¿Cómo viajas normalmente?</Label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {travelStyles.map((style) => {
                      const isSelected = formData.travelStyle === style.id
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, travelStyle: style.id })}
                          className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {style.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <Label className="text-base">Idioma preferido</Label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {languages.map((lang) => {
                      const isSelected = formData.language === lang.id
                      return (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, language: lang.id })}
                          className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
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
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </Button>

            {currentStep < 4 ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button disabled={!canProceed()} className="gap-2" asChild>
                <Link href="/perfil">
                  <Sparkles className="h-4 w-4" />
                  Crear mi perfil
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
