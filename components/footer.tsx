import Link from "next/link"
import { MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

const navigation = {
  explorar: [
    { name: "Destinos Destacados", href: "/destinos" },
    { name: "Itinerarios", href: "/itinerarios" },
    { name: "Guías turísticos", href: "/guias" },
  ],
  plataforma: [
    { name: "Cómo funciona", href: "/como-funciona" },
    { name: "Asistente IA", href: "/asistente" },
    { name: "Contacto", href: "/contacto" },
  ],
  legal: [
    { name: "Accesibilidad", href: "/accesibilidad" },
    { name: "Términos", href: "/terminos" },
    { name: "Privacidad", href: "/privacidad" },
  ],
}

const social = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "YouTube", href: "#", icon: Youtube },
]

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="font-semibold text-xl tracking-tight text-foreground">
                Destinify
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Plataforma de turismo inteligente que transforma la manera de explorar Ecuador 
              con personalización impulsada por IA.
            </p>
            <div className="flex gap-4">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation - Simplified to 2 columns (Hick's Law) */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Explorar</h3>
              <ul className="mt-4 space-y-3">
                {navigation.explorar.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm inline-block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Plataforma</h3>
              <ul className="mt-4 space-y-3">
                {navigation.plataforma.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm inline-block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Destinify. Hecho con amor en Ecuador.
          </p>
          <div className="flex gap-4">
            {navigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
