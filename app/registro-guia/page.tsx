"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Map, Compass, Globe, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const formSchema = z.object({
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(10, "Número de teléfono inválido"),
  languages: z.string().min(2, "Por favor indica los idiomas que hablas"),
  experience: z.string().min(10, "Cuéntanos un poco más sobre tu experiencia"),
})

export default function RegistroGuiaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      languages: "",
      experience: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Simulamos una llamada a la API
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      toast.success("¡Registro completado! Bienvenido a Destinify.")
      // Redirigir al dashboard después de un corto retraso
      setTimeout(() => {
        router.push("/guia/dashboard")
      }, 2000)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif">¡Solicitud Enviada!</CardTitle>
            <CardDescription>
              Hemos recibido tu registro como guía turístico.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Estamos redirigiéndote a tu nuevo panel de control para que comiences a crear tus tours.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-serif text-2xl font-bold rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Compass className="h-8 w-8 text-primary" aria-hidden="true" />
            Destinify
          </Link>
        </div>

        <Card className="w-full border-border shadow-md bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-serif">Únete como Guía Turístico</CardTitle>
            <CardDescription>
              Comparte tu pasión por Ecuador. Completa tus datos para acceder a tu panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Juan Pérez" aria-required="true" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="correo@ejemplo.com" aria-required="true" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+593 99 123 4567" aria-required="true" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Hick's law: Progressive disclosure for secondary info */}
                <details className="group rounded-xl border border-border bg-muted/30 p-4 transition-all">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm flex items-center justify-between">
                    <span>Información Profesional (Opcional por ahora)</span>
                    <span className="text-xs text-muted-foreground group-open:hidden">Mostrar</span>
                    <span className="text-xs text-muted-foreground hidden group-open:inline">Ocultar</span>
                  </summary>
                  
                  <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <FormField
                      control={form.control}
                      name="languages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idiomas que hablas</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej. Español, Inglés, Kichwa" aria-required="true" {...field} />
                          </FormControl>
                          <FormDescription>Separados por comas.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experiencia como Guía</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Cuéntanos sobre los lugares que conoces y tu experiencia previa..." 
                              className="resize-none h-24"
                              aria-required="true"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </details>

                <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Crear cuenta de Guía"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/iniciar-sesion" className="text-primary hover:underline ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
              Inicia sesión
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
