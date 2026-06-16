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
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/30">
      {/* Panel Izquierdo - Información */}
      <div className="w-full md:w-1/2 bg-primary text-primary-foreground p-8 md:p-12 lg:p-24 flex flex-col justify-center">
        <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold mb-12 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
          <Compass className="h-8 w-8" aria-hidden="true" />
          Destinify
        </Link>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Únete como Guía Turístico</h1>
        <p className="text-lg text-primary-foreground/80 mb-12 max-w-md">
          Comparte tu pasión por Ecuador. Crea experiencias inolvidables, gestiona tus reservas y conecta con viajeros de todo el mundo.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Map className="w-6 h-6 mt-1 opacity-80" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-lg">Crea tus propios tours</h3>
              <p className="text-primary-foreground/70">Diseña itinerarios únicos y establece tus propios horarios.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Globe className="w-6 h-6 mt-1 opacity-80" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-lg">Alcance global</h3>
              <p className="text-primary-foreground/70">Llega a miles de turistas que buscan experiencias auténticas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-24 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="text-3xl font-serif">Regístrate</CardTitle>
            <CardDescription>
              Completa el formulario para acceder a tu panel de guía.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Crear cuenta de Guía"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="px-0 justify-center text-sm text-muted-foreground">
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
