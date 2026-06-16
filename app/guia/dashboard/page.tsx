import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockReservas, mockTours, mockMensajes, mockResenas } from "@/lib/guia-data"
import { CalendarCheck, Map, MessageSquare, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GuiaDashboardPage() {
  const activeTours = mockTours.filter(t => t.status === "activo").length
  const pendingReservas = mockReservas.filter(r => r.status === "pendiente").length
  const unreadMessages = mockMensajes.filter(m => m.unread).length
  
  const avgRating = mockResenas.length > 0 
    ? mockResenas.reduce((acc, curr) => acc + curr.rating, 0) / mockResenas.length 
    : 0

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif font-bold tracking-tight">Panel de Control</h1>
        <p className="text-muted-foreground">Bienvenido de vuelta, Miguel. Aquí tienes el resumen de tu actividad.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tours Activos</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTours}</div>
            <p className="text-xs text-muted-foreground">
              {mockTours.length - activeTours} en borrador
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendientes</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReservas}</div>
            <p className="text-xs text-muted-foreground">
              {mockReservas.filter(r => r.status === "confirmada").length} confirmadas esta semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensajes Sin Leer</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              Revisa tu bandeja de entrada
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación Media</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)} / 5.0</div>
            <p className="text-xs text-muted-foreground">
              Basado en {mockResenas.length} evaluaciones
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Reservations */}
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Reservas Recientes</CardTitle>
            <CardDescription>Tienes {pendingReservas} reservas que requieren tu confirmación.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {mockReservas.slice(0, 4).map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{reserva.travelerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {reserva.tourName} • {new Date(reserva.date).toLocaleDateString("es-EC", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      reserva.status === 'confirmada' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      reserva.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
              {mockReservas.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No hay reservas recientes.
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/guia/reservas">
                Ver todas las reservas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* Quick Actions / Notifications */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Mensajes sin leer</CardTitle>
            <CardDescription>Comunícate con tus viajeros.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {mockMensajes.filter(m => m.unread).map((msg) => (
                <div key={msg.id} className="flex items-start gap-4 rounded-lg border border-border p-3 bg-muted/50 transition-colors hover:bg-muted">
                  <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center shrink-0 font-bold">
                    {msg.travelerName.charAt(0)}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">{msg.travelerName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{msg.lastMessage}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {msg.timestamp}
                  </div>
                </div>
              ))}
              {unreadMessages === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Estás al día con tus mensajes.
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/guia/mensajes">
                Ir a la bandeja de entrada
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
