"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Menu,
  X,
  User,
  Compass,
  Calendar,
  Sparkles,
  Home,
  ChevronRight,
} from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"

const navigation = [
  { name: "Destinos", href: "/destinos", icon: Compass, shortcut: "d" },
  { name: "Itinerarios", href: "/itinerarios", icon: Calendar, shortcut: "i" },
  { name: "IA Asistente", href: "/asistente", icon: Sparkles, shortcut: "a" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const paths = pathname === '/' ? [] : pathname.split('/').filter(Boolean)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Heurística 7: Flexibilidad y eficiencia de uso (Atajos globales)
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'h': e.preventDefault(); router.push('/'); break;
          case 'd': e.preventDefault(); router.push('/destinos'); break;
          case 'i': e.preventDefault(); router.push('/itinerarios'); break;
          case 'a': e.preventDefault(); router.push('/asistente'); break;
          case 'p': e.preventDefault(); router.push('/perfil'); break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" title="Inicio (Alt + H)" aria-keyshortcuts="Alt+H" className="flex items-center gap-2 -m-1.5 p-1.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
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
              title={`${item.name} (Alt + ${item.shortcut.toUpperCase()})`}
              aria-keyshortcuts={`Alt+${item.shortcut.toUpperCase()}`}
              className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
              <kbd className="hidden xl:inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                Alt+{item.shortcut.toUpperCase()}
              </kbd>
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

      {/* Breadcrumbs - Orientación y Navegación (WCAG 2.4.5, 3.2.3) */}
      {paths.length > 0 && (
        <div className="bg-secondary/40 border-t border-border backdrop-blur-md hidden sm:block">
          <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 py-2 lg:px-8 flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only">Inicio</span>
            </Link>
            {paths.map((path, index) => {
              const href = `/${paths.slice(0, index + 1).join('/')}`
              const isLast = index === paths.length - 1
              const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
              
              return (
                <div key={path} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
                  {isLast ? (
                    <span className="font-medium text-foreground" aria-current="page">{label}</span>
                  ) : (
                    <Link href={href} className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                      {label}
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
