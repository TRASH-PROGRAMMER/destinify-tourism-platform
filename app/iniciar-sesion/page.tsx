"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MapPin,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  User,
  Compass,
  ShieldCheck
} from "lucide-react"

type Errors = {
  email?: string
  password?: string
  form?: string
}

type Role = "viajero" | "guia" | "admin"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [role, setRole] = useState<Role>("viajero")
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const formErrorRef = useRef<HTMLDivElement>(null)

  // Recuperar correo recordado
  useEffect(() => {
    try {
      const saved = localStorage.getItem("destinify_remember_email")
      if (saved) {
        setEmail(saved)
      }
      const savedRole = localStorage.getItem("destinify_last_role") as Role
      if (savedRole && ["viajero", "guia", "admin"].includes(savedRole)) {
        setRole(savedRole)
      }
    } catch {
      // ignore
    }
  }, [])

  function validateEmail(value: string): string | undefined {
    if (!value.trim()) return "Ingrese su correo electrónico para continuar."
    if (!EMAIL_REGEX.test(value.trim())) return "Ingrese un correo electrónico válido."
    return undefined
  }

  function validatePassword(value: string): string | undefined {
    if (!value) return "Ingrese su contraseña para continuar."
    return undefined
  }

  function handleBlur(field: "email" | "password") {
    setTouched((t) => ({ ...t, [field]: true }))
    if (field === "email") {
      setErrors((e) => ({ ...e, email: validateEmail(email) }))
    } else {
      setErrors((e) => ({ ...e, password: validatePassword(password) }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError })
      setTouched({ email: true, password: true })
      // Mover el foco al primer campo con error
      if (emailError) {
        emailRef.current?.focus()
      } else {
        passwordRef.current?.focus()
      }
      return
    }

    setErrors({})
    setLoading(true)

    // Persistir correo si "recordar sesión" está activo
    try {
      if (remember) {
        localStorage.setItem("destinify_remember_email", email.trim())
        localStorage.setItem("destinify_last_role", role)
      } else {
        localStorage.removeItem("destinify_remember_email")
        localStorage.removeItem("destinify_last_role")
      }
    } catch {
      // ignore
    }

    // Simulación de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Demo: credencial de prueba bloqueada / incorrecta
    if (email.trim().toLowerCase() === "bloqueado@destinify.com") {
      setLoading(false)
      setErrors({
        form: "Su cuenta ha sido bloqueada temporalmente por motivos de seguridad. Intente nuevamente en unos minutos o recupere su contraseña.",
      })
      setTimeout(() => formErrorRef.current?.focus(), 50)
      return
    }

    if (password === "incorrecta") {
      setLoading(false)
      setErrors({
        form: "Correo o contraseña incorrectos. Verifique los datos e intente nuevamente.",
      })
      setTimeout(() => formErrorRef.current?.focus(), 50)
      return
    }

    // Éxito
    setSuccess(true)
    setTimeout(() => {
      if (role === "admin") {
        window.location.href = "/admin"
      } else if (role === "guia") {
        window.location.href = "/guia/dashboard"
      } else {
        window.location.href = "/perfil"
      }
    }, 900)
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Barra superior simple */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="font-semibold text-xl tracking-tight text-foreground">Destinify</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-pretty text-3xl font-bold tracking-tight text-foreground">
              Inicia sesión
            </h1>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              Accede a tu cuenta para continuar planificando tus viajes personalizados.
            </p>
          </div>

          {/* Selector de Rol */}
          <div className="mb-8">
            <Label className="text-sm font-medium mb-3 block">¿Cómo deseas ingresar?</Label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Selecciona tu rol">
              <button
                type="button"
                role="radio"
                aria-checked={role === "viajero"}
                onClick={() => setRole("viajero")}
                className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  role === "viajero" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <User className="h-5 w-5 mb-1" />
                <span className="text-xs font-semibold">Viajero</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={role === "guia"}
                onClick={() => setRole("guia")}
                className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  role === "guia" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Compass className="h-5 w-5 mb-1" />
                <span className="text-xs font-semibold">Guía</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={role === "admin"}
                onClick={() => setRole("admin")}
                className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  role === "admin" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <ShieldCheck className="h-5 w-5 mb-1" />
                <span className="text-xs font-semibold">Admin</span>
              </button>
            </div>
          </div>

          {/* Mensaje de error general (credenciales / bloqueo) */}
          {errors.form && (
            <div
              ref={formErrorRef}
              role="alert"
              tabIndex={-1}
              className="mb-5 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
              <p className="text-sm font-medium leading-relaxed text-destructive">{errors.form}</p>
            </div>
          )}

          {/* Mensaje de éxito */}
          {success && (
            <div
              role="status"
              className="mb-5 flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/10 p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm font-medium leading-relaxed text-foreground">
                Inicio de sesión correcto. Redirigiéndote a tu panel...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Correo electrónico */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo electrónico <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  ref={emailRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (touched.email) setErrors((er) => ({ ...er, email: validateEmail(e.target.value) }))
                  }}
                  onBlur={() => handleBlur("email")}
                  placeholder={
                    role === "guia" ? "guia@ejemplo.com" : 
                    role === "admin" ? "admin@destinify.com" : 
                    "tucorreo@ejemplo.com"
                  }
                  className="h-12 pl-11"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña <span className="text-destructive">*</span>
                </Label>
                <Link
                  href="/recuperar-contrasena"
                  className="text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (touched.password) setErrors((er) => ({ ...er, password: validatePassword(e.target.value) }))
                  }}
                  onBlur={() => handleBlur("password")}
                  placeholder="Ingresa tu contraseña"
                  className="h-12 pl-11 pr-12"
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Recordar sesión */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(v === true)}
                className="h-5 w-5"
              />
              <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-muted-foreground">
                Recordar mi sesión en este dispositivo
              </Label>
            </div>

            {/* Botón principal */}
            <Button type="submit" className="h-12 w-full text-base" disabled={loading || success}>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  <span>Verificando...</span>
                </>
              ) : (
                `Iniciar sesión como ${role === 'viajero' ? 'Viajero' : role === 'guia' ? 'Guía' : 'Admin'}`
              )}
            </Button>

            {/* Estado de carga para lectores de pantalla */}
            <div aria-live="polite" className="sr-only">
              {loading ? "Verificando tus credenciales, por favor espera." : ""}
            </div>
          </form>

          {role === "viajero" && (
            <>
              {/* Separador */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  o continúa con
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Login social */}
              <div className="space-y-3">
                <SocialButton provider="Google" />
                <SocialButton provider="Facebook" />
                <SocialButton provider="Apple" />
              </div>
            </>
          )}

          {/* Registro */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">¿No tienes cuenta?</p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="/comenzar">
                    <User className="mr-2 h-4 w-4 text-primary" />
                    Crear cuenta de Viajero
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="/registro-guia">
                    <Compass className="mr-2 h-4 w-4 text-primary" />
                    Unirme como Guía Turístico
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="/admin/registro">
                    <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                    Registro de Proveedor / Admin
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function SocialButton({ provider }: { provider: "Google" | "Facebook" | "Apple" }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-12 w-full justify-center gap-3 text-base font-medium"
      aria-label={`Iniciar sesión con ${provider}`}
    >
      <SocialIcon provider={provider} />
      Continuar con {provider}
    </Button>
  )
}

function SocialIcon({ provider }: { provider: "Google" | "Facebook" | "Apple" }) {
  if (provider === "Google") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    )
  }
  if (provider === "Facebook") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
      </svg>
    )
  }
  return (
    <svg className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.04c-.03-2.55 2.08-3.77 2.18-3.83-1.19-1.74-3.04-1.98-3.7-2.01-1.58-.16-3.08.93-3.88.93-.8 0-2.03-.91-3.34-.88-1.72.03-3.3 1-4.18 2.54-1.78 3.09-.46 7.67 1.28 10.18.85 1.23 1.86 2.6 3.19 2.55 1.28-.05 1.76-.83 3.31-.83 1.54 0 1.98.83 3.34.8 1.38-.02 2.25-1.25 3.09-2.49.97-1.42 1.37-2.8 1.39-2.87-.03-.01-2.66-1.02-2.69-4.05M14.53 4.5c.7-.85 1.18-2.03 1.05-3.21-1.01.04-2.24.68-2.97 1.53-.65.75-1.22 1.95-1.07 3.1 1.13.09 2.28-.57 2.99-1.42" />
    </svg>
  )
}
