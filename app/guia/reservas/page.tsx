"use client"

import { useState } from "react"
import { mockReservas, Reserva } from "@/lib/guia-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Check, X, Bell } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function GuiaReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>(mockReservas)
  const [searchTerm, setSearchTerm] = useState("")

  const handleConfirm = (id: string) => {
    setReservas(reservas.map(r => r.id === id ? { ...r, status: "confirmada" } : r))
    toast.success("Reserva confirmada. Se ha notificado al viajero.")
  }

  const handleCancel = (id: string) => {
    setReservas(reservas.map(r => r.id === id ? { ...r, status: "cancelada" } : r))
    toast.error("Reserva rechazada/cancelada.")
  }

  const filteredReservas = reservas.filter(
    (reserva) =>
      reserva.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.tourName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingCount = reservas.filter(r => r.status === "pendiente").length

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Reservas</h1>
          <p className="text-muted-foreground">Gestiona las reservas de tus actividades y notifica a los viajeros.</p>
        </div>
      </div>

      {pendingCount > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/10 shadow-none">
          <CardHeader className="py-4 flex flex-row items-center gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
              <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-lg text-yellow-800 dark:text-yellow-500">Notificaciones Pendientes</CardTitle>
              <CardDescription className="text-yellow-700/80 dark:text-yellow-600">Tienes {pendingCount} reserva(s) nueva(s) esperando confirmación.</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Listado de Reservas</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar viajero o tour..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Viajero</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Personas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell className="font-medium">{reserva.travelerName}</TableCell>
                    <TableCell>{reserva.tourName}</TableCell>
                    <TableCell>
                      {new Date(reserva.date).toLocaleDateString("es-EC", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>{reserva.travelersCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          reserva.status === "confirmada"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                            : reserva.status === "pendiente"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                        }
                      >
                        {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" aria-label={`Acciones para reserva de ${reserva.travelerName}`}>
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          {reserva.status === "pendiente" && (
                            <>
                              <DropdownMenuItem onClick={() => handleConfirm(reserva.id)} className="text-green-600">
                                <Check className="mr-2 h-4 w-4" />
                                Confirmar Reserva
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCancel(reserva.id)} className="text-red-600">
                                <X className="mr-2 h-4 w-4" />
                                Rechazar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {reserva.status === "confirmada" && (
                            <>
                              <DropdownMenuItem onClick={() => handleCancel(reserva.id)} className="text-red-600">
                                <X className="mr-2 h-4 w-4" />
                                Cancelar Reserva
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem>Ver detalles del viajero</DropdownMenuItem>
                          <DropdownMenuItem>Enviar mensaje</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReservas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No se encontraron reservas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
