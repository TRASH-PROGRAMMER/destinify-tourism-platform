"use client"

import { useA11y } from "./a11y-provider"
import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Botón de movimiento accesible.
 *
 * Heurística 8 (Etiquetas) y 10 (Movimiento):
 * El estado `animations` controla dinámicamente tanto el texto visible
 * como el `aria-label`, de modo que lectores de pantalla y comandos de voz
 * siempre estén sincronizados con la acción ("Activar" vs "Desactivar").
 *
 * onClick emula el comportamiento de up-event de forma nativa: la acción
 * se dispara al soltar el botón. Si el usuario mantiene presionado y arrastra
 * el cursor fuera del área (min 48x48px) antes de soltar, el clic se cancela.
 */
export function MotionToggle({ className }: { className?: string }) {
  const { settings, setSetting } = useA11y()
  const motionEnabled = settings.animations

  const actionLabel = motionEnabled ? "Desactivar movimiento" : "Activar movimiento"

  return (
    <button
      type="button"
      onClick={() => setSetting("animations", !motionEnabled)}
      aria-pressed={motionEnabled}
      aria-label={actionLabel}
      className={cn(
        // Área táctil mínima de 48x48px (objetivo accesible)
        "inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        motionEnabled
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border bg-background text-foreground hover:bg-secondary",
        className,
      )}
    >
      {motionEnabled ? (
        <Pause className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      {/* Texto visible sincronizado con el aria-label */}
      <span>{actionLabel}</span>
    </button>
  )
}
