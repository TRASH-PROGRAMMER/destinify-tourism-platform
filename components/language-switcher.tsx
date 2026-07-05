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
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("destinify-lang")
    if (saved) {
      setCurrentLang(saved)
      document.documentElement.lang = saved
    }

    // Detectar cuando Google Translate se carga de forma más segura
    const checkGoogleTranslate = setInterval(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (select) {
        setIsGoogleLoaded(true)
        clearInterval(checkGoogleTranslate)
      }
    }, 1000)

    // Limpiar después de 10 segundos si no carga para evitar consumo innecesario
    const timeout = setTimeout(() => clearInterval(checkGoogleTranslate), 10000)

    return () => {
      clearInterval(checkGoogleTranslate)
      clearTimeout(timeout)
    }
  }, [])

  const changeLanguage = (code: string, name: string) => {
    setCurrentLang(code)
    localStorage.setItem("destinify-lang", code)
    document.documentElement.lang = code

    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement

    if (select && isGoogleLoaded) {
      try {
        // Método más robusto: forzar el valor y disparar el evento nativo
        select.value = code
        
        // Verificación de disponibilidad del idioma en el widget
        if (select.value !== code) {
          console.warn(`El idioma ${code} no está disponible en el widget de Google`)
          fallbackLanguageChange(code, name)
          return
        }

        const event = new Event('change', { bubbles: true })
        select.dispatchEvent(event)

        toast.success(`Idioma cambiado a ${name}`, {
          description: "La traducción automática se ha activado correctamente."
        })
      } catch (error) {
        console.warn("Error al cambiar idioma con Google Translate:", error)
        fallbackLanguageChange(code, name)
      }
    } else {
      fallbackLanguageChange(code, name)
    }
  }

  const fallbackLanguageChange = (code: string, name: string) => {
    toast.info(`Idioma establecido: ${name}`, {
      description: "La traducción automática no está disponible en este momento. Se guardó tu preferencia.",
    })
    // Nota: Aquí se podría integrar un sistema i18n completo (next-intl/i18next) en el futuro
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Cambiar idioma"
          className="min-h-[48px] min-w-[48px]"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Seleccionar idioma</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code, lang.name)}
            className="flex min-h-[48px] items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span className="text-lg" aria-hidden="true">{lang.flag}</span>
              {lang.name}
            </span>
            {currentLang === lang.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
