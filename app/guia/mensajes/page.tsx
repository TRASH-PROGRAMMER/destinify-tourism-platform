"use client"

import { useState } from "react"
import { mockMensajes, Mensaje } from "@/lib/guia-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Search } from "lucide-react"

export default function GuiaMensajesPage() {
  const [activeMessageId, setActiveMessageId] = useState<string | null>(mockMensajes[0]?.id || null)
  const [messages, setMessages] = useState<Mensaje[]>(mockMensajes)
  const [replyText, setReplyText] = useState("")

  const activeMessage = messages.find(m => m.id === activeMessageId)

  const handleSelectMessage = (id: string) => {
    setActiveMessageId(id)
    // Marcar como leído
    setMessages(messages.map(m => m.id === id ? { ...m, unread: false } : m))
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !activeMessage) return

    // En un escenario real, esto enviaría el mensaje al backend
    // Aquí solo actualizaremos el estado local para la demostración
    const updatedMessages = messages.map(m => {
      if (m.id === activeMessageId) {
        return {
          ...m,
          lastMessage: `Tú: ${replyText}`,
          timestamp: "Justo ahora"
        }
      }
      return m
    })
    setMessages(updatedMessages)
    setReplyText("")
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-2rem)] space-y-4 p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Mensajes</h1>
        <p className="text-muted-foreground">Comunícate con tus viajeros para afinar detalles (Rf5).</p>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Sidebar de Contactos */}
        <Card className="w-1/3 flex flex-col h-full overflow-hidden">
          <CardHeader className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar chat..." className="pl-8" />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg.id)}
                  className={`flex items-start gap-4 p-4 text-left border-b border-border transition-colors hover:bg-muted/50 ${
                    activeMessageId === msg.id ? "bg-muted" : ""
                  }`}
                >
                  <Avatar className="mt-1">
                    <AvatarFallback className={msg.unread ? "bg-primary text-primary-foreground font-bold" : "bg-secondary text-secondary-foreground"}>
                      {msg.travelerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className={`text-sm truncate ${msg.unread ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                        {msg.travelerName}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className={`text-sm line-clamp-2 ${msg.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {msg.lastMessage}
                    </p>
                  </div>
                  {msg.unread && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" aria-label="Mensaje no leído" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Panel de Chat */}
        <Card className="flex-1 flex flex-col h-full overflow-hidden">
          {activeMessage ? (
            <>
              <CardHeader className="p-4 border-b border-border flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarFallback>{activeMessage.travelerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{activeMessage.travelerName}</CardTitle>
                  <p className="text-sm text-muted-foreground">Viajero interesado / Reserva confirmada</p>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-4 bg-muted/20">
                {/* Simulación del historial de chat */}
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-card border border-border text-card-foreground rounded-2xl rounded-tl-sm p-3 max-w-[80%] text-sm">
                      Hola, quería saber si para el tour podemos llevar a un niño de 5 años.
                      <p className="text-[10px] text-muted-foreground mt-1 text-right">Hace 2 horas</p>
                    </div>
                  </div>
                  {activeMessage.lastMessage.startsWith("Tú:") ? (
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[80%] text-sm">
                        {activeMessage.lastMessage.replace("Tú: ", "")}
                        <p className="text-[10px] text-primary-foreground/70 mt-1 text-right">{activeMessage.timestamp}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <div className="bg-card border border-border text-card-foreground rounded-2xl rounded-tl-sm p-3 max-w-[80%] text-sm">
                        {activeMessage.lastMessage}
                        <p className="text-[10px] text-muted-foreground mt-1 text-right">{activeMessage.timestamp}</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border bg-card">
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <Input 
                    placeholder="Escribe tu mensaje..." 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!replyText.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Enviar mensaje</span>
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Selecciona una conversación para leer y responder.
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
