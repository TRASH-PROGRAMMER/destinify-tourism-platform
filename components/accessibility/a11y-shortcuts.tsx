"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useA11y, DEFAULT_SETTINGS } from "./a11y-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"

export interface ShortcutDef {
  combo: string // human readable, e.g. "Alt + C"
  keys: string // for matching: lowercase key with modifiers prefix
  label: string
  category: string
}

// Definition list (also used to render the help dialog)
export const SHORTCUTS: ShortcutDef[] = [
  // NAVEGACIÓN GLOBAL
  { combo: "Alt + H", keys: "alt+h", label: "Ir al Inicio", category: "Navegación" },
  { combo: "Alt + D", keys: "alt+d", label: "Ir a Destinos", category: "Navegación" },
  { combo: "Alt + I", keys: "alt+i", label: "Ir a Itinerarios", category: "Navegación" },
  { combo: "Alt + A", keys: "alt+a", label: "Abrir IA Asistente", category: "Navegación" },
  { combo: "Alt + P", keys: "alt+p", label: "Ir al Perfil", category: "Navegación" },

  // ACCESIBILIDAD GENERAL
  { combo: "Alt + U", keys: "alt+u", label: "Abrir / cerrar el menú de accesibilidad", category: "Accesibilidad" },
  { combo: "Alt + Y", keys: "alt+y", label: "Mostrar esta ayuda de atajos", category: "Accesibilidad" },
  { combo: "Alt + R", keys: "alt+r", label: "Restablecer toda la accesibilidad", category: "Accesibilidad" },
  { combo: "Alt + S", keys: "alt+s", label: "Saltar al contenido principal", category: "Accesibilidad" },

  { combo: "Alt + +", keys: "alt++", label: "Aumentar el tamaño del texto", category: "Visión" },
  { combo: "Alt + -", keys: "alt+-", label: "Disminuir el tamaño del texto", category: "Visión" },
  { combo: "Alt + 0", keys: "alt+0", label: "Restablecer el tamaño del texto", category: "Visión" },
  { combo: "Alt + C", keys: "alt+c", label: "Activar / desactivar alto contraste", category: "Visión" },
  { combo: "Alt + T", keys: "alt+t", label: "Cambiar entre tema claro y oscuro", category: "Visión" },
  { combo: "Alt + E", keys: "alt+e", label: "Activar / desactivar fuente para dislexia", category: "Visión" },
  { combo: "Alt + K", keys: "alt+k", label: "Resaltar enlaces", category: "Visión" },

  { combo: "Alt + L", keys: "alt+l", label: "Leer la página en voz alta", category: "Audio" },
  { combo: "Alt + O", keys: "alt+o", label: "Pausar / reanudar la lectura", category: "Audio" },
  { combo: "Alt + X", keys: "alt+x", label: "Detener la lectura", category: "Audio" },
  { combo: "Alt + V", keys: "alt+v", label: "Activar / desactivar control por voz", category: "Voz" },

  { combo: "Alt + G", keys: "alt+g", label: "Activar / desactivar guía de lectura", category: "Cognitivo" },
  { combo: "Alt + F", keys: "alt+f", label: "Activar / desactivar modo enfoque", category: "Cognitivo" },
  { combo: "Alt + M", keys: "alt+m", label: "Activar / desactivar resaltado de foco (teclado)", category: "Motriz" },
]

interface A11yShortcutsProps {
  onToggleMenu: () => void
}

export function A11yShortcuts({ onToggleMenu }: A11yShortcutsProps) {
  const {
    settings,
    setSetting,
    reset,
    speakPage,
    stopSpeech,
    pauseSpeech,
    resumeSpeech,
    speaking,
    paused,
    toggleVoiceControl,
  } = useA11y()

  const [helpOpen, setHelpOpen] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const announceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Announce an action to screen readers + visible toast
  const announce = useCallback((msg: string) => {
    setAnnouncement(msg)
    if (announceTimer.current) clearTimeout(announceTimer.current)
    announceTimer.current = setTimeout(() => setAnnouncement(""), 2200)
  }, [])

  // Keep latest values without re-binding the listener constantly
  const settingsRef = useRef(settings)
  settingsRef.current = settings
  const speakingRef = useRef({ speaking, paused })
  speakingRef.current = { speaking, paused }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey) return

      // Avoid hijacking typing in inputs (except our well-defined combos which use Alt)
      const target = e.target as HTMLElement | null
      const isTyping =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)

      const key = e.key.toLowerCase()
      const s = settingsRef.current

      // Normalize "+" which may arrive as "=" depending on layout
      const isPlus = key === "+" || key === "=" || e.code === "Equal" || e.code === "NumpadAdd"
      const isMinus = key === "-" || e.code === "Minus" || e.code === "NumpadSubtract"

      let handled = true

      switch (true) {
        case key === "u":
          onToggleMenu()
          announce("Menú de accesibilidad")
          break
        case key === "y":
          setHelpOpen((o) => !o)
          break
        case key === "r":
          reset()
          announce("Accesibilidad restablecida")
          break
        case key === "s": {
          const main = document.getElementById("main-content") || document.querySelector("main")
          if (main) {
            ;(main as HTMLElement).setAttribute("tabindex", "-1")
            ;(main as HTMLElement).focus()
            main.scrollIntoView({ behavior: "smooth" })
          }
          announce("Saltando al contenido principal")
          break
        }
        case isPlus: {
          const next = Math.min(2, Math.round((s.fontScale + 0.1) * 10) / 10)
          setSetting("fontScale", next)
          announce(`Tamaño de texto ${Math.round(next * 100)}%`)
          break
        }
        case isMinus: {
          const next = Math.max(0.8, Math.round((s.fontScale - 0.1) * 10) / 10)
          setSetting("fontScale", next)
          announce(`Tamaño de texto ${Math.round(next * 100)}%`)
          break
        }
        case key === "0":
          setSetting("fontScale", DEFAULT_SETTINGS.fontScale)
          announce("Tamaño de texto restablecido")
          break
        case key === "c": {
          const on = s.contrast !== "high"
          setSetting("contrast", on ? "high" : "normal")
          announce(on ? "Alto contraste activado" : "Alto contraste desactivado")
          break
        }
        case key === "t": {
          const dark = s.theme !== "dark"
          setSetting("theme", dark ? "dark" : "light")
          announce(dark ? "Tema oscuro" : "Tema claro")
          break
        }
        case key === "e": {
          const on = s.fontMode !== "dyslexic"
          setSetting("fontMode", on ? "dyslexic" : "default")
          announce(on ? "Fuente para dislexia activada" : "Fuente para dislexia desactivada")
          break
        }
        case key === "k": {
          const on = !s.highlightLinks
          setSetting("highlightLinks", on)
          announce(on ? "Enlaces resaltados" : "Resaltado de enlaces desactivado")
          break
        }
        case key === "l":
          speakPage()
          announce("Leyendo la página")
          break
        case key === "o": {
          const sp = speakingRef.current
          if (sp.speaking && !sp.paused) {
            pauseSpeech()
            announce("Lectura en pausa")
          } else if (sp.paused) {
            resumeSpeech()
            announce("Reanudando lectura")
          } else {
            handled = false
          }
          break
        }
        case key === "x":
          stopSpeech()
          announce("Lectura detenida")
          break
        case key === "v":
          toggleVoiceControl()
          announce("Control por voz")
          break
        case key === "g": {
          const on = !s.readingGuide
          setSetting("readingGuide", on)
          announce(on ? "Guía de lectura activada" : "Guía de lectura desactivada")
          break
        }
        case key === "f": {
          const on = !s.focusMode
          setSetting("focusMode", on)
          announce(on ? "Modo enfoque activado" : "Modo enfoque desactivado")
          break
        }
        case key === "m": {
          const on = !s.focusHighlight
          setSetting("focusHighlight", on)
          announce(on ? "Resaltado de foco activado" : "Resaltado de foco desactivado")
          break
        }
        default:
          handled = false
      }

      if (handled) {
        // Only block default once we know it's our combo, even while typing
        if (!isTyping || ["a", "h", "r", "s"].includes(key)) {
          e.preventDefault()
        }
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [
    onToggleMenu,
    reset,
    setSetting,
    speakPage,
    stopSpeech,
    pauseSpeech,
    resumeSpeech,
    toggleVoiceControl,
    announce,
  ])

  const categories = Array.from(new Set(SHORTCUTS.map((s) => s.category)))

  return (
    <>
      {/* Screen-reader + visible announcement of triggered shortcuts */}
      <div aria-live="assertive" role="status" className="sr-only">
        {announcement}
      </div>
      {announcement && (
        <div
          className="fixed bottom-24 left-5 z-[9500] rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg"
          aria-hidden="true"
        >
          {announcement}
        </div>
      )}

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-primary" aria-hidden="true" />
              Atajos de teclado
            </DialogTitle>
            <DialogDescription>
              Usa estas combinaciones para controlar la accesibilidad sin el ratón.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            {categories.map((cat) => (
              <div key={cat}>
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{cat}</h3>
                <ul className="space-y-1.5">
                  {SHORTCUTS.filter((sh) => sh.category === cat).map((sh) => (
                    <li key={sh.combo} className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-foreground">{sh.label}</span>
                      <kbd className="shrink-0 rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs font-medium text-foreground">
                        {sh.combo}
                      </kbd>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
