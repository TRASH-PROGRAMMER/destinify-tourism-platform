"use client"

import { useState, useEffect } from "react"
import { Accessibility } from "lucide-react"
import { A11yProvider } from "./a11y-provider"
import { ColorblindFilters } from "./colorblind-filters"
import { AccessibilityMenu } from "./accessibility-menu"

function AccessibilityButton() {
  const [open, setOpen] = useState(false)

  // Keyboard shortcut: Alt + A
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú de accesibilidad (Alt + A)"
        aria-haspopup="dialog"
        className="fixed bottom-5 right-5 z-[9000] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
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
