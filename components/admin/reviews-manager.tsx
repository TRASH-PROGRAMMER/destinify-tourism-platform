"use client"

import { useState } from "react"
import { Star, MessageSquareReply, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { reviews as initialReviews, formatDate, type Review } from "@/lib/admin-data"
import { cn } from "@/lib/utils"

function Stars({ rating, label }: { rating: number; label?: string }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={label ?? `${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn("h-4 w-4", n <= rating ? "fill-accent text-accent" : "fill-muted text-muted")}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [tab, setTab] = useState<"todas" | "pendientes" | "respondidas">("todas")
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [announce, setAnnounce] = useState("")

  const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  const pendingCount = reviews.filter((r) => !r.response).length

  const filtered = reviews.filter((r) => {
    if (tab === "pendientes") return !r.response
    if (tab === "respondidas") return !!r.response
    return true
  })

  function submitReply(id: string) {
    const text = drafts[id]?.trim()
    if (!text) return
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, response: text, responseDate: new Date().toISOString().slice(0, 10) }
          : r,
      ),
    )
    setReplyingTo(null)
    setDrafts((d) => ({ ...d, [id]: "" }))
    setAnnounce("Respuesta publicada correctamente.")
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div aria-live="polite" className="sr-only" role="status">
        {announce}
      </div>

      <header className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground text-balance">Gestión de Reseñas</h1>
        <p className="text-sm text-muted-foreground">Responde a las opiniones de tus clientes</p>
      </header>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15">
              <Star className="h-6 w-6 fill-accent text-accent" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avg}</p>
              <p className="text-xs text-muted-foreground">Calificación media</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquareReply className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
              <p className="text-xs text-muted-foreground">Reseñas totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <MessageSquareReply className="h-6 w-6 text-destructive" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Por responder</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-6">
        <TabsList>
          <TabsTrigger value="todas">Todas ({reviews.length})</TabsTrigger>
          <TabsTrigger value="pendientes">Por responder ({pendingCount})</TabsTrigger>
          <TabsTrigger value="respondidas">Respondidas ({reviews.length - pendingCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No hay reseñas en esta categoría.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <Card key={review.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {review.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{review.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.serviceName} · {formatDate(review.date)}
                      </p>
                      <div className="mt-1">
                        <Stars rating={review.rating} />
                      </div>
                    </div>
                  </div>
                  {review.response ? (
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                      <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
                      Respondida
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-accent bg-accent/20 text-accent-foreground">
                      Pendiente
                    </Badge>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-foreground">{review.comment}</p>

                {review.response && (
                  <div className="rounded-lg border-l-2 border-primary bg-muted/50 p-3">
                    <p className="mb-1 text-xs font-medium text-primary">
                      Tu respuesta {review.responseDate && `· ${formatDate(review.responseDate)}`}
                    </p>
                    <p className="text-sm text-foreground">{review.response}</p>
                  </div>
                )}

                {!review.response && replyingTo !== review.id && (
                  <Button variant="outline" size="sm" onClick={() => setReplyingTo(review.id)}>
                    <MessageSquareReply className="mr-2 h-4 w-4" aria-hidden="true" />
                    Responder
                  </Button>
                )}

                {!review.response && replyingTo === review.id && (
                  <div className="space-y-2">
                    <label htmlFor={`reply-${review.id}`} className="text-sm font-medium text-foreground">
                      Tu respuesta pública
                    </label>
                    <Textarea
                      id={`reply-${review.id}`}
                      value={drafts[review.id] ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [review.id]: e.target.value }))}
                      placeholder="Agradece la opinión y responde de forma profesional…"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => submitReply(review.id)}
                        disabled={!drafts[review.id]?.trim()}
                      >
                        <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                        Publicar respuesta
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
