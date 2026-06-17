"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import {
  MapPin,
  Send,
  Sparkles,
  User,
  Loader2,
  Lightbulb,
  MapPinned,
  Calendar,
  Utensils,
  Camera,
  ChevronRight,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  suggestions?: { label: string; action: string }[]
  destinations?: { id: string; name: string; image: string }[]
}

const initialSuggestions = [
  { label: "¿Qué lugares visitar en Galápagos?", icon: MapPinned },
  { label: "Planifica un viaje de aventura", icon: Calendar },
  { label: "Mejores restaurantes en Quito", icon: Utensils },
  { label: "Spots para fotografía en Ecuador", icon: Camera },
]

const sampleResponses: Record<string, Message> = {
  "galapagos": {
    id: "resp-1",
    role: "assistant",
    content: "Las Islas Galápagos son un destino único en el mundo. Te recomiendo estos lugares imperdibles:\n\n**Isla Santa Cruz:** El punto de partida ideal. Visita la Estación Científica Charles Darwin y la Playa de Tortuga Bay.\n\n**Isla Isabela:** La más grande del archipiélago. No te pierdas Los Túneles y el Muro de las Lágrimas.\n\n**Isla San Cristóbal:** Perfecta para snorkel con lobos marinos en La Lobería.\n\n¿Te gustaría que te ayude a planificar un itinerario para tu visita?",
    suggestions: [
      { label: "Crear itinerario Galápagos", action: "/itinerarios/nuevo?destino=galapagos" },
      { label: "Ver más sobre Galápagos", action: "/destinos/galapagos" },
    ],
    destinations: [
      { id: "galapagos", name: "Islas Galápagos", image: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=300&h=200&fit=crop" },
    ],
  },
  "aventura": {
    id: "resp-2",
    role: "assistant",
    content: "¡Excelente elección! Ecuador es un paraíso para los amantes de la aventura. Basándome en tu perfil, te recomiendo:\n\n**Baños de Agua Santa:** Capital de los deportes extremos. Puenting, rafting, canyoning y la famosa Ruta de las Cascadas.\n\n**Cotopaxi:** Trekking en uno de los volcanes activos más altos del mundo. Vistas espectaculares de los Andes.\n\n**Mindo:** Canopy sobre el bosque nublado, tubing en ríos cristalinos y avistamiento de colibríes.\n\nTodos estos destinos son accesibles y tienen opciones para diferentes niveles de experiencia. ¿Cuál te interesa más explorar?",
    suggestions: [
      { label: "Ver Baños de Agua Santa", action: "/destinos/banos" },
      { label: "Explorar destinos de aventura", action: "/destinos?categoria=aventura" },
    ],
  },
  "restaurantes": {
    id: "resp-3",
    role: "assistant",
    content: "Quito tiene una escena gastronómica increíble. Aquí mis recomendaciones basadas en diferentes estilos:\n\n**Cocina tradicional:**\n- Mercado Central: Auténtico y económico\n- Café Mosaico: Vistas panorámicas de la ciudad\n- La Cuchara de San Marcos: En el Centro Histórico\n\n**Cocina contemporánea:**\n- Nuema: Cocina ecuatoriana de autor\n- Zazu: Fusión internacional con ingredientes locales\n\n**Calle La Ronda:** Perfecta para tapear y probar bocaditos tradicionales con música en vivo.\n\n¿Quieres que te reserve en alguno o que incluya opciones gastronómicas en tu itinerario?",
    suggestions: [
      { label: "Ver restaurantes en Quito", action: "/destinos/quito" },
      { label: "Tour gastronómico", action: "/itinerarios/nuevo?destino=quito" },
    ],
  },
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Conexión real con el backend de Gemini
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Enviamos todo el historial para dar contexto a la IA
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Error al conectar con la IA")
      }

      const aiMessage: Message = {
        id: `resp-${Date.now()}`,
        role: "assistant",
        content: data.content || "Lo siento, no pude generar una respuesta clara.",
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error: any) {
      console.error(error)
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `**Error de conexión:** No pudimos contactar a la inteligencia artificial.\n\n_Detalle: ${error.message}_\n\nSi eres el administrador, verifica que hayas configurado tu \`GEMINI_API_KEY\` en el archivo \`.env.local\` y hayas reiniciado el servidor (\`npm run dev\`).`,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col pt-16 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-8">
            {messages.length === 0 ? (
              // Welcome State
              <div className="text-center py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Asistente de Viaje IA
                </h1>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                  Soy tu guía personal para explorar Ecuador. Pregúntame sobre destinos, 
                  actividades, restaurantes o pídeme que planifique tu viaje perfecto.
                </p>

                {/* Suggestions */}
                <div className="mt-8 grid gap-3 sm:grid-cols-2 max-w-lg mx-auto">
                  {initialSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.label}
                      onClick={() => handleSuggestionClick(suggestion.label)}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-secondary"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <suggestion.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {suggestion.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Tips */}
                <div className="mt-12 rounded-xl bg-secondary/50 p-4 max-w-md mx-auto">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">Tip</p>
                      <p className="text-sm text-muted-foreground">
                        Mientras más detalles me des sobre tus preferencias, mejores 
                        serán mis recomendaciones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Messages
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Sparkles className="h-5 w-5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border"
                      }`}
                    >
                      <div
                        className={`whitespace-pre-wrap text-sm ${
                          message.role === "user" ? "text-primary-foreground" : "text-foreground"
                        }`}
                      >
                        {message.content.split('\n').map((line, i) => {
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={i} className="font-semibold mt-2">{line.replace(/\*\*/g, '')}</p>
                          }
                          if (line.startsWith('- ')) {
                            return <p key={i} className="ml-2">{line}</p>
                          }
                          return <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                        })}
                      </div>

                      {/* Destination Cards */}
                      {message.destinations && (
                        <div className="mt-3 space-y-2">
                          {message.destinations.map((dest) => (
                            <Link
                              key={dest.id}
                              href={`/destinos/${dest.id}`}
                              className="flex items-center gap-3 rounded-lg bg-secondary p-2 transition-colors hover:bg-secondary/80"
                            >
                              <img
                                src={dest.image}
                                alt={dest.name}
                                className="h-12 w-16 rounded-md object-cover"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{dest.name}</p>
                                <p className="text-xs text-muted-foreground">Ver detalles</p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion) => (
                            <Button
                              key={suggestion.label}
                              variant="secondary"
                              size="sm"
                              asChild
                            >
                              <Link href={suggestion.action}>
                                {suggestion.label}
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Link>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="rounded-2xl bg-card border border-border px-4 py-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Pensando...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-4">
          <div className="mx-auto max-w-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntame sobre destinos, actividades, itinerarios..."
                className="flex-1"
                disabled={isLoading}
                autoFocus // Heurística 8: El usuario no tiene que hacer clic para empezar a hablar con la IA
              />
              <Button type="submit" disabled={!input.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-2 text-xs text-center text-muted-foreground">
              El asistente puede cometer errores. Verifica la información importante.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
