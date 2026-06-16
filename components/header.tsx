"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Menu,
  X,
  User,
  Compass,
  Calendar,
  Sparkles,
} from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"

const navigation = [
  { name: "Destinos", href: "/destinos", icon: Compass },
  { name: "Itinerarios", href: "/itinerarios", icon: Calendar },
  { name: "IA Asistente", href: "/asistente", icon: Sparkles },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2 -m-1.5 p-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="font-semibold text-xl tracking-tight text-foreground">
              Destinify
            </span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
          >
            <span className="sr-only">Abrir menú</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3 lg:items-center">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/iniciar-sesion">
              <User className="h-4 w-4 mr-2" />
              Iniciar sesión
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/comenzar">Comenzar</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-foreground">Idioma del sistema</span>
                <LanguageSwitcher />
              </div>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/iniciar-sesion">
                  <User className="h-4 w-4 mr-2" />
                  Iniciar sesión
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/comenzar">Comenzar</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
