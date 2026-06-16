"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  trend?: { value: string; positive: boolean }
  iconClassName?: string
}

export function StatCard({ label, value, icon: Icon, trend, iconClassName }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.positive ? "text-primary" : "text-destructive",
              )}
            >
              {trend.positive ? (
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {trend.value}
              <span className="sr-only">{trend.positive ? "incremento" : "disminución"} respecto al mes anterior</span>
            </p>
          )}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10", iconClassName)}>
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  )
}
