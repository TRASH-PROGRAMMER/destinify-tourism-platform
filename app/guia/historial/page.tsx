import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, TrendingUp, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

// Datos simulados para el historial de servicios
const historialData = [
  { id: "h1", tourName: "City Tour Histórico Quito", date: "2026-05-15", travelers: 4, earnings: 180, rating: 5 },
  { id: "h2", tourName: "Aventura Cotopaxi", date: "2026-05-10", travelers: 2, earnings: 160, rating: 4 },
  { id: "h3", tourName: "City Tour Histórico Quito", date: "2026-04-28", travelers: 8, earnings: 360, rating: 5 },
  { id: "h4", tourName: "Ruta del Cacao", date: "2026-04-15", travelers: 5, earnings: 175, rating: 5 },
  { id: "h5", tourName: "Aventura Cotopaxi", date: "2026-04-02", travelers: 3, earnings: 240, rating: 4 },
]

export default function GuiaHistorialPage() {
  const totalEarnings = historialData.reduce((acc, curr) => acc + curr.earnings, 0)
  const totalTravelers = historialData.reduce((acc, curr) => acc + curr.travelers, 0)
  const totalTours = historialData.length

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Historial de Servicios</h1>
          <p className="text-muted-foreground">Revisa los tours que has completado y tus estadísticas (Rf10).</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Reporte
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales Generados</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings}</div>
            <p className="text-xs text-muted-foreground">+12% respecto al mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viajeros Atendidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTravelers}</div>
            <p className="text-xs text-muted-foreground">De 15 nacionalidades distintas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tours Completados</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTours}</div>
            <p className="text-xs text-muted-foreground">100% tasa de finalización</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Registro Detallado</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por tour o fecha..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead className="text-center">Viajeros</TableHead>
                  <TableHead className="text-center">Calificación Obtenida</TableHead>
                  <TableHead className="text-right">Ingresos ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historialData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {new Date(record.date).toLocaleDateString("es-EC", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{record.tourName}</TableCell>
                    <TableCell className="text-center">{record.travelers}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {record.rating} / 5
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                      ${record.earnings}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
