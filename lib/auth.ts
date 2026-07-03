/**
 * Fuente única de verdad para roles y sesión de demostración.
 *
 * IMPORTANTE: esto NO es autenticación real. No hay backend que verifique
 * credenciales ni firme el valor del rol, así que cualquiera podría editar
 * la cookie manualmente desde el navegador. Sirve para dejar de exponer
 * /admin a cualquier visitante sin cuenta, y como punto único donde
 * conectar autenticación real (JWT firmado, sesión de servidor, etc.)
 * el día que exista un backend.
 */

export type Role = "viajero" | "guia" | "admin"

export const ROLE_COOKIE = "destinify_role"

export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin",
  guia: "/guia/dashboard",
  viajero: "/perfil",
}

export function isValidRole(value: string | undefined | null): value is Role {
  return value === "viajero" || value === "guia" || value === "admin"
}

/** Evita open-redirect: solo permite volver a una ruta interna relativa. */
export function isSafeInternalPath(path: string | null | undefined): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//")
}

// --- Helpers de Client Components (usan document.cookie) ---

export function setRoleCookie(role: Role) {
  if (typeof document === "undefined") return
  // 1 día. Es una cookie legible por JS a propósito: no guarda nada sensible,
  // solo el rol elegido en este login simulado.
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=86400; SameSite=Lax`
}

export function clearRoleCookie() {
  if (typeof document === "undefined") return
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

export function getClientRole(): Role | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${ROLE_COOKIE}=([^;]*)`))
  const value = match?.[1]
  return isValidRole(value) ? value : null
}
