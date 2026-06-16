import type { LucideIcon } from "lucide-react"
import {
  Activity,
  Globe,
  Undo2,
  Layers,
  ShieldCheck,
  Eye,
  Zap,
  Sparkles,
  LifeBuoy,
  BookOpen,
} from "lucide-react"

export interface Heuristic {
  number: number
  title: string
  description: string
  icon: LucideIcon
  examples: string[]
  whereInApp: { label: string; href: string }[]
}

export const heuristics: Heuristic[] = [
  {
    number: 1,
    title: "Visibilidad del estado del sistema",
    description:
      "El sistema mantiene informado al usuario sobre lo que ocurre mediante retroalimentación apropiada en un tiempo razonable.",
    icon: Activity,
    examples: [
      "Barras de progreso con role=progressbar en los formularios por pasos (registro e itinerario).",
      "Indicadores de carga con anuncios aria-live al iniciar sesión o generar un itinerario.",
      "Estados de disponibilidad y confirmación/rechazo visibles en el panel de reservas.",
      "Avisos flotantes al activar atajos de accesibilidad (aria-live).",
    ],
    whereInApp: [
      { label: "Crear itinerario", href: "/itinerarios/nuevo" },
      { label: "Panel de reservas", href: "/admin/reservas" },
    ],
  },
  {
    number: 2,
    title: "Correspondencia entre el sistema y el mundo real",
    description:
      "El sistema habla el idioma del usuario, con palabras y conceptos familiares, siguiendo convenciones del mundo real.",
    icon: Globe,
    examples: [
      "Lenguaje en español natural orientado al viajero ecuatoriano.",
      "Iconos reconocibles: hotel, tour, restaurante, calendario, estrella.",
      "Precios con formato local y desglose de IVA como en una factura real.",
      "Pasos del viaje ordenados como el flujo real: planificar, reservar, disfrutar.",
    ],
    whereInApp: [
      { label: "Reservar", href: "/reservar" },
      { label: "Destinos", href: "/destinos" },
    ],
  },
  {
    number: 3,
    title: "Control y libertad del usuario",
    description:
      "Los usuarios necesitan salidas de emergencia claramente marcadas para abandonar estados no deseados sin pasar por diálogos extensos.",
    icon: Undo2,
    examples: [
      "Botones 'Atrás' y 'Editar' en cada paso de los asistentes.",
      "Sin redirección automática: la confirmación solo ocurre al pulsarla.",
      "Cierre de menús con Escape y botón de cancelar en diálogos.",
      "Botón 'Restablecer todo' (Alt+R) para revertir las preferencias.",
    ],
    whereInApp: [
      { label: "Reservar", href: "/reservar" },
      { label: "Comenzar", href: "/comenzar" },
    ],
  },
  {
    number: 4,
    title: "Coherencia y estándares",
    description:
      "Los usuarios no deberían preguntarse si distintas palabras, situaciones o acciones significan lo mismo. Se siguen las convenciones de la plataforma.",
    icon: Layers,
    examples: [
      "Sistema de diseño compartido: colores, tipografía y componentes shadcn/ui.",
      "Misma estructura de validación y mensajes en todos los formularios.",
      "Botones primarios/secundarios consistentes en toda la app.",
      "Navegación y cabeceras uniformes entre páginas públicas y panel.",
    ],
    whereInApp: [
      { label: "Inicio", href: "/" },
      { label: "Panel de proveedor", href: "/admin" },
    ],
  },
  {
    number: 5,
    title: "Prevención de errores",
    description:
      "Mejor que buenos mensajes de error es un diseño cuidadoso que evite que el problema ocurra.",
    icon: ShieldCheck,
    examples: [
      "Validación por paso antes de permitir avanzar.",
      "Autoguardado de borradores para no perder datos al refrescar.",
      "Confirmación con resumen y aceptación de políticas antes de pagar.",
      "Campos obligatorios marcados y formatos sugeridos en la ayuda contextual.",
    ],
    whereInApp: [
      { label: "Reservar", href: "/reservar" },
      { label: "Crear itinerario", href: "/itinerarios/nuevo" },
    ],
  },
  {
    number: 6,
    title: "Reconocimiento en lugar de recuerdo",
    description:
      "Minimiza la carga de memoria del usuario haciendo visibles los objetos, acciones y opciones.",
    icon: Eye,
    examples: [
      "Resumen del viaje siempre visible en la barra lateral al reservar.",
      "Opciones presentadas como botones y tarjetas en vez de campos libres.",
      "Ayuda contextual junto a cada campo del formulario.",
      "Iconos con etiquetas de texto, nunca iconos solos.",
    ],
    whereInApp: [
      { label: "Reservar", href: "/reservar" },
      { label: "Destinos", href: "/destinos" },
    ],
  },
  {
    number: 7,
    title: "Flexibilidad y eficiencia de uso",
    description:
      "Aceleradores no vistos por el usuario novato pueden agilizar la interacción del experto, sirviendo a ambos.",
    icon: Zap,
    examples: [
      "Atajos de teclado globales (Alt+A, Alt+H, Alt+C, etc.).",
      "Acciones rápidas de accesibilidad en una cuadrícula.",
      "Control por voz para navegar y leer contenido.",
      "Generación de itinerario con IA para acelerar la planificación.",
    ],
    whereInApp: [
      { label: "Asistente IA", href: "/asistente" },
      { label: "Crear itinerario", href: "/itinerarios/nuevo" },
    ],
  },
  {
    number: 8,
    title: "Diseño estético y minimalista",
    description:
      "Los diálogos no deben contener información irrelevante o raramente necesaria, que compite con la información relevante.",
    icon: Sparkles,
    examples: [
      "Paleta limitada (teal, ámbar y neutros) y dos familias tipográficas.",
      "Formularios divididos en pasos para reducir la carga visual.",
      "Modo 'Simplificar' que atenúa elementos que distraen.",
      "Etiquetas dinámicas claras y sincronizadas (p. ej. botón de movimiento).",
    ],
    whereInApp: [
      { label: "Inicio", href: "/" },
      { label: "Comenzar", href: "/comenzar" },
    ],
  },
  {
    number: 9,
    title: "Reconocer, diagnosticar y recuperarse de errores",
    description:
      "Los mensajes de error deben expresarse en lenguaje claro, indicar el problema con precisión y sugerir una solución.",
    icon: LifeBuoy,
    examples: [
      "Resumen de errores con role=alert y foco gestionado.",
      "Mensajes específicos y accionables ('Ingrese un correo válido').",
      "Errores vinculados a cada campo con aria-describedby y borde rojo.",
      "Estados de error de inicio de sesión con sugerencia de recuperación.",
    ],
    whereInApp: [
      { label: "Iniciar sesión", href: "/iniciar-sesion" },
      { label: "Reservar", href: "/reservar" },
    ],
  },
  {
    number: 10,
    title: "Ayuda y documentación",
    description:
      "Aunque es mejor que el sistema se use sin documentación, puede ser necesario proveer ayuda fácil de buscar y centrada en la tarea.",
    icon: BookOpen,
    examples: [
      "Diálogo de ayuda de atajos de teclado (Alt+H) con lista por categorías.",
      "Ayuda contextual junto a los campos de los formularios.",
      "Esta página de auditoría que documenta las decisiones de diseño.",
      "Menú de accesibilidad con descripciones de cada ajuste.",
    ],
    whereInApp: [
      { label: "Accesibilidad", href: "/accesibilidad" },
      { label: "Crear itinerario", href: "/itinerarios/nuevo" },
    ],
  },
]
