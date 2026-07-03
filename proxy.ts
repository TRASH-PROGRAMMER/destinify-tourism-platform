import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ROLE_COOKIE } from "@/lib/auth"

/**
 * Protección mínima de /admin.
 *
 * Antes de este archivo, cualquiera podía entrar directo a /admin
 * (o refrescar la página) sin haber iniciado sesión: app/admin/layout.tsx
 * no verificaba nada. proxy.ts corre en el servidor ANTES de renderizar
 * (Next.js 16 lo ejecuta en runtime Node.js por defecto), así que evita
 * el "flash" de contenido protegido que ocurriría con una verificación
 * solo en el cliente (useEffect + redirect).
 *
 * Nota: hasta Next.js 15 este archivo se llamaba middleware.ts; en
 * Next.js 16 la convención se renombró a proxy.ts (mismo comportamiento,
 * la función ahora se llama `proxy` en vez de `middleware`).
 *
 * Sigue siendo una verificación de conveniencia, no seguridad real: el
 * valor de la cookie no está firmado por un servidor. El día que exista
 * un backend real, este es el lugar donde reemplazar la lectura de la
 * cookie por la verificación de una sesión/JWT firmado.
 */
export function proxy(request: NextRequest) {
  const role = request.cookies.get(ROLE_COOKIE)?.value

  if (role !== "admin") {
    const loginUrl = new URL("/iniciar-sesion", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    loginUrl.searchParams.set("requiere", "admin")
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
