"use client"

import { useState, useEffect } from "react"
import { Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const LANGUAGES = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
]

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("es")

  useEffect(() => {
    const saved = localStorage.getItem("destinify-lang")
    if (saved) {
      setCurrentLang(saved)
      document.documentElement.lang = saved
    }
  }, [])

  const handleLanguageChange = (code: string, name: string) => {
    setCurrentLang(code)
    localStorage.setItem("destinify-lang", code)
    document.documentElement.lang = code
    
    // Simular el cambio en el sistema para fines de usabilidad
    toast.success(`Idioma cambiado a ${name}`, {
      description: "Las preferencias del sistema se han actualizado correctamente.",
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Cambiar idioma del sistema" className="min-h-[48px] min-w-[48px]">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Idioma del sistema</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code, lang.name)}
            className="flex min-h-[48px] items-center justify-between cursor-pointer"
            aria-label={`Seleccionar idioma ${lang.name}`}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{lang.flag}</span>
              {lang.name}
            </span>
            {currentLang === lang.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
