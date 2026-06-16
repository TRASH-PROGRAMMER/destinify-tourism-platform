"use client"

import { useState } from "react"
import { mockTours } from "@/lib/guia-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Plus, MapPin, Clock, Users, DollarSign, Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"

export default function GuiaToursPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleCancelTour = (tourName: string) => {
    toast.success(`El tour "${tourName}" ha sido cancelado exitosamente.`)
  }

  const handleCreateTour = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Tour publicado exitosamente.")
  }

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Gestión de Tours</h1>
          <p className="text-muted-foreground">Crea, edita y organiza tus actividades turísticas.</p>
        </div>
      </div>

      <Tabs defaultValue="listado" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="listado">Mis Tours</TabsTrigger>
          <TabsTrigger value="nuevo">Nuevo Tour</TabsTrigger>
          <TabsTrigger value="disponibilidad">Disponibilidad</TabsTrigger>
        </TabsList>
        
        {/* PESTAÑA: MIS TOURS */}
        <TabsContent value="listado" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTours.map((tour) => (
              <Card key={tour.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      tour.status === 'activo' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      tour.status === 'borrador' ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Abrir menú">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>Editar detalles</DropdownMenuItem>
                        <DropdownMenuItem>Reprogramar fechas</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                              Cancelar Tour
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción cancelará el tour de forma permanente. Si hay viajeros con reservas, se les notificará automáticamente y se procederá al reembolso.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Volver</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCancelTour(tour.title)} className="bg-red-600 hover:bg-red-700 text-white">
                                Sí, cancelar tour
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="mt-2">{tour.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 shrink-0" />
                    <span>Máx. {tour.capacity} personas (Reservados: {tour.booked})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 shrink-0" />
                    <span>${tour.price} por persona</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full">Gestionar Disponibilidad</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* PESTAÑA: NUEVO TOUR */}
        <TabsContent value="nuevo" className="mt-6">
          <Card className="max-w-3xl">
            <form onSubmit={handleCreateTour}>
              <CardHeader>
                <CardTitle>Publicar Nuevo Tour</CardTitle>
                <CardDescription>Completa los detalles de tu actividad para que los viajeros puedan reservarla.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Tour</Label>
                  <Input id="title" placeholder="Ej: Recorrido Nocturno por el Centro Histórico" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" placeholder="Describe la experiencia detalladamente..." className="h-32" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio por persona ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="price" type="number" min="0" className="pl-9" placeholder="45.00" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidad Máxima</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="capacity" type="number" min="1" className="pl-9" placeholder="10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="duration" placeholder="Ej: 3 horas" className="pl-9" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Punto de Encuentro</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="location" placeholder="Plaza Grande, Quito" className="pl-9" required />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border pt-6">
                <Button variant="ghost" type="button">Guardar como Borrador</Button>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Publicar Tour
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* PESTAÑA: DISPONIBILIDAD */}
        <TabsContent value="disponibilidad" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendario de Disponibilidad</CardTitle>
              <CardDescription>Selecciona los días en los que ofreces tus servicios.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-8">
              <div className="border border-border rounded-lg p-2 flex-shrink-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                />
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-medium">Configuración para {date?.toLocaleDateString("es-EC", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                
                {/* Simulación de configuración de horarios */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">City Tour Histórico Quito</p>
                      <p className="text-sm text-muted-foreground">09:00 AM - 01:00 PM</p>
                    </div>
                    <Button variant="outline" size="sm">Editar horario</Button>
                  </div>
                  
                  <Button variant="dashed" className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir tour este día
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
