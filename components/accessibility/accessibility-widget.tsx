"use client"

import { useState } from "react"
import { Accessibility, Contrast } from "lucide-react"
import { A11yProvider, useA11y } from "./a11y-provider"
import { ColorblindFilters } from "./colorblind-filters"
import { AccessibilityMenu } from "./accessibility-menu"
import { A11yShortcuts } from "./a11y-shortcuts"

function AccessibilityButton() {
  const [open, setOpen] = useState(false)

  const { settings, setSetting } = useA11y()
  const isHighContrast = settings.contrast === "high"

  return (
    <>
      <A11yShortcuts onToggleMenu={() => setOpen((o) => !o)} />
      
      {/* Botón principal del menú de accesibilidad */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú de accesibilidad (Alt + U)"
        aria-haspopup="dialog"
        className="fixed bottom-5 left-5 z-[9000] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
      >
        <Accessibility className="h-7 w-7" />
      </button>
      <AccessibilityMenu open={open} onOpenChange={setOpen} />
    </>
  )
}

export function AccessibilityWidget({ children }: { children: React.ReactNode }) {
  return (
    <A11yProvider>
      <a href="#main-content" className="a11y-skip-link">
        Saltar al contenido principal
      </a>
      <ColorblindFilters />
      {children}
      <AccessibilityButton />
    </A11yProvider>
  )
}
