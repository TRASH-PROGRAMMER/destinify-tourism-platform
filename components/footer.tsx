import Link from "next/link"
import { MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

const navigation = {
  destinos: [
    { name: "Galápagos", href: "/destinos/galapagos" },
    { name: "Quito", href: "/destinos/quito" },
    { name: "Cuenca", href: "/destinos/cuenca" },
    { name: "Baños", href: "/destinos/banos" },
    { name: "Montañita", href: "/destinos/montanita" },
  ],
  plataforma: [
    { name: "Cómo funciona", href: "/como-funciona" },
    { name: "Asistente IA", href: "/asistente" },
    { name: "Itinerarios", href: "/itinerarios" },
    { name: "Reservas", href: "/reservas" },
    { name: "Precios", href: "/precios" },
  ],
  empresa: [
    { name: "Sobre nosotros", href: "/sobre-nosotros" },
    { name: "Blog de viajes", href: "/blog" },
    { name: "Proveedores", href: "/proveedores" },
    { name: "Guías turísticos", href: "/guias" },
    { name: "Contacto", href: "/contacto" },
  ],
  legal: [
    { name: "Términos de servicio", href: "/terminos" },
    { name: "Política de privacidad", href: "/privacidad" },
    { name: "Cookies", href: "/cookies" },
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
            <Link href="/" className="flex items-center gap-2">
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
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Destinos</h3>
                <ul className="mt-4 space-y-3">
                  {navigation.destinos.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground">Plataforma</h3>
                <ul className="mt-4 space-y-3">
                  {navigation.plataforma.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Empresa</h3>
                <ul className="mt-4 space-y-3">
                  {navigation.empresa.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground">Legal</h3>
                <ul className="mt-4 space-y-3">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Destinify. Todos los derechos reservados. 
            Hecho con amor en Ecuador.
          </p>
        </div>
      </div>
    </footer>
  )
}
