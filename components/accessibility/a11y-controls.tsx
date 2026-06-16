"use client"

import type React from "react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface ToggleRowProps {
  icon: React.ReactNode
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleRow({ icon, label, description, checked, onChange }: ToggleRowProps) {
  const id = `a11y-toggle-${label.replace(/\s+/g, "-").toLowerCase()}`
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <label htmlFor={id} className="block text-sm font-medium text-card-foreground">
            {label}
          </label>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  )
}

interface SliderRowProps {
  icon: React.ReactNode
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  format?: (value: number) => string
}

export function SliderRow({ icon, label, value, min, max, step, onChange, format }: SliderRowProps) {
  const id = `a11y-slider-${label.replace(/\s+/g, "-").toLowerCase()}`
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
            {icon}
          </span>
          <label htmlFor={id} className="text-sm font-medium text-card-foreground">
            {label}
          </label>
        </div>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground tabular-nums">
          {format ? format(value) : value}
        </span>
      </div>
      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
        aria-label={label}
      />
    </div>
  )
}

interface OptionButtonsProps {
  label: string
  icon: React.ReactNode
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

export function OptionButtons({ label, icon, options, value, onChange }: OptionButtonsProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
          {icon}
        </span>
        <span className="text-sm font-medium text-card-foreground">{label}</span>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value === opt.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-secondary",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
