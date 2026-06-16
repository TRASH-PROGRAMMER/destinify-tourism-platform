"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const revenueData = [
  { month: "Ene", ingresos: 4200, reservas: 38 },
  { month: "Feb", ingresos: 3800, reservas: 32 },
  { month: "Mar", ingresos: 5100, reservas: 45 },
  { month: "Abr", ingresos: 6300, reservas: 58 },
  { month: "May", ingresos: 7400, reservas: 67 },
  { month: "Jun", ingresos: 8200, reservas: 74 },
]

const serviceMixData = [
  { name: "Hoteles", value: 398, fill: "var(--color-hoteles)" },
  { name: "Tours", value: 322, fill: "var(--color-tours)" },
  { name: "Restaurantes", value: 540, fill: "var(--color-restaurantes)" },
]

const revenueConfig = {
  ingresos: { label: "Ingresos (USD)", color: "var(--chart-1)" },
  reservas: { label: "Reservas", color: "var(--chart-2)" },
}

const mixConfig = {
  hoteles: { label: "Hoteles", color: "var(--chart-1)" },
  tours: { label: "Tours", color: "var(--chart-2)" },
  restaurantes: { label: "Restaurantes", color: "var(--chart-4)" },
}

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ingresos mensuales</CardTitle>
        <CardDescription>Evolución de ingresos en los últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig} className="h-[280px] w-full">
          <LineChart data={revenueData} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="var(--color-ingresos)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function BookingsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Reservas por mes</CardTitle>
        <CardDescription>Cantidad de reservas confirmadas</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig} className="h-[280px] w-full">
          <BarChart data={revenueData} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="reservas" fill="var(--color-reservas)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ServiceMixChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Reservas por tipo de servicio</CardTitle>
        <CardDescription>Distribución histórica total</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={mixConfig} className="h-[280px] w-full max-w-[320px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie data={serviceMixData} dataKey="value" nameKey="name" innerRadius={55} strokeWidth={2}>
              {serviceMixData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
