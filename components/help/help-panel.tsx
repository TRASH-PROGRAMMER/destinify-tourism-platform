"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { HelpCircle, ChevronDown } from "lucide-react"
import { AccessibleVideoPlayer } from "./accessible-video-player"
import { useState } from "react"

export function HelpPanel() {
  const [showTranscript, setShowTranscript] = useState(false)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden md:flex items-center gap-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Abrir panel de ayuda"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Ayuda</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            ¿Cómo usar el sistema?
          </SheetTitle>
          <SheetDescription className="text-base text-muted-foreground pt-2">
            Bienvenido a Destinify. Hemos preparado este breve recorrido guiado 
            para que conozcas las herramientas de personalización y accesibilidad 
            que tienes a tu disposición.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-1">
            <AccessibleVideoPlayer />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Controles Rápidos</h3>
            <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5">
              <li>
                <strong className="text-foreground">Audiodescripción (AD):</strong> 
                Al activar el botón <strong>AD</strong>, el sistema narrará en voz alta qué sucede visualmente en la pantalla, ayudando a personas con discapacidad visual a no perder contexto.
              </li>
              <li>
                <strong className="text-foreground">Pausar/Reproducir:</strong> 
                Usa el botón de Play en el video o la tecla <kbd className="font-mono bg-muted px-1 rounded">Espacio</kbd>.
              </li>
              <li>
                <strong className="text-foreground">Narración (Voice-over):</strong> 
                El video narrará los pasos automáticamente usando voz sintetizada. Usa el botón de Volumen para mutear.
              </li>
              <li>
                <strong className="text-foreground">Navegación:</strong> 
                Todo el panel y el reproductor están diseñados para ser navegables con el teclado usando la tecla <kbd className="font-mono bg-muted px-1 rounded">Tab</kbd>.
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
