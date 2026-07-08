"use client"

import { Clapperboard, Ear, Eye, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

const AD_SCRIPT = [
  { time: 0, text: "El logotipo de Destinify aparece animado sobre un fondo claro." },
  { time: 3, text: "Montaje rápido de paisajes andinos con picos nevados y valles." },
  { time: 6, text: "Tortuga gigante en las Islas Galápagos, seguido de una vista aérea de la selva amazónica." },
]

export function VideoSection() {
  const [adEnabled, setAdEnabled] = useState(false)
  const [ccEnabled, setCcEnabled] = useState(true)
  const [showTranscript, setShowTranscript] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Sincronizar el track de subtítulos nativo con el estado ccEnabled
  useEffect(() => {
    const video = videoRef.current
    if (video && video.textTracks && video.textTracks.length > 0) {
      // Asumimos que el primer track es el de subtítulos (CC)
      for (let i = 0; i < video.textTracks.length; i++) {
        if (video.textTracks[i].kind === 'subtitles') {
          video.textTracks[i].mode = ccEnabled ? 'showing' : 'hidden'
        }
      }
    }
  }, [ccEnabled])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const current = video.currentTime
      setCurrentTime(current)
      
      if (!adEnabled || !('speechSynthesis' in window)) return
      
      const activeAD = AD_SCRIPT.find(
        (ad) => current >= ad.time && current < ad.time + 1
      )

      if (activeAD) {
        // Avoid repeating the same phrase continuously in that 1 second window
        const utteranceStr = `DestinifyAD_${activeAD.time}`
        if (!(window as any)[utteranceStr]) {
          ;(window as any)[utteranceStr] = true
          window.speechSynthesis.cancel()
          const utterance = new SpeechSynthesisUtterance(activeAD.text)
          utterance.lang = "es-ES"
          utterance.rate = 1.1
          window.speechSynthesis.speak(utterance)
        }
      }
    }

    const handlePause = () => {
      if ('speechSynthesis' in window) window.speechSynthesis.pause()
    }
    
    const handlePlay = () => {
      if ('speechSynthesis' in window) window.speechSynthesis.resume()
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("pause", handlePause)
    video.addEventListener("play", handlePlay)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("play", handlePlay)
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [adEnabled])

  const getHighlightClass = (start: number, end: number) => {
    return currentTime >= start && currentTime < end 
      ? "bg-primary/20 border-l-4 border-primary pl-3 py-2 rounded-r-md transition-all duration-300" 
      : "pl-3 py-2 border-l-4 border-transparent transition-all duration-300"
  }

  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" /> Accesibilidad Multimedia
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Descubre nuestra experiencia en video
          </p>
          <p className="mt-4 text-muted-foreground text-balance">
            Nuestro reproductor es totalmente accesible. Activa los subtítulos (CC) para texto, 
            o enciende la **Audiodescripción (AD)** para escuchar detalles visuales generados por voz.
          </p>
        </div>

        <div className="mx-auto max-w-4xl flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-end gap-3 px-2">
            <Button 
              variant={ccEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setCcEnabled(!ccEnabled)}
              className="rounded-full shadow-sm font-bold uppercase"
              aria-pressed={ccEnabled}
              aria-label={ccEnabled ? "Ocultar Subtítulos" : "Mostrar Subtítulos"}
            >
              CC {ccEnabled ? "ON" : "OFF"}
            </Button>
            <Button 
              variant={adEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setAdEnabled(!adEnabled)}
              className="rounded-full shadow-sm"
              aria-pressed={adEnabled}
              aria-label={adEnabled ? "Desactivar Audiodescripción" : "Activar Audiodescripción"}
            >
              <Ear className="w-4 h-4 mr-2" aria-hidden="true" />
              Audiodescripción (AD) {adEnabled ? "ON" : "OFF"}
            </Button>
          </div>

          <div className="overflow-hidden rounded-2xl border-2 border-border shadow-2xl bg-black relative">
            <video
              ref={videoRef}
              controls
              preload="metadata"
              className="w-full aspect-video object-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
              aria-label="Video promocional de Destinify demostrando las opciones de viaje"
            >
              <source src="/Video%20Project%201.mp4" type="video/mp4" />
              <track
                kind="subtitles"
                src="/subs-es.vtt"
                srcLang="es"
                label="Español (CC)"
                default
              />
              <track
                kind="descriptions"
                src="/ad-es.vtt"
                srcLang="es"
                label="Audiodescripción (Lectores de Pantalla)"
              />
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>

          <div className="mt-2 bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-foreground hover:bg-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              aria-expanded={showTranscript}
              aria-controls="transcript-content"
            >
              <span>Transcripción y Detalles del Video (En vivo)</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showTranscript ? "rotate-180" : ""}`} />
            </button>
            
            <div 
              id="transcript-content"
              className={`px-6 overflow-hidden transition-all duration-300 ${showTranscript ? "pb-6 max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
              aria-hidden={!showTranscript}
            >
              <div className="pt-2 space-y-2 text-sm text-muted-foreground border-t border-border">
                <div className={getHighlightClass(0, 3)}>
                  <p><strong>[00:00 - 00:03]</strong></p>
                  <p className="italic text-foreground/80">[Audiodescripción: El logotipo de Destinify aparece animado sobre un fondo claro.]</p>
                  <p>🗣️ "¡Bienvenido a Destinify! Tu compañero inteligente de viajes."</p>
                </div>
                
                <div className={getHighlightClass(3, 6)}>
                  <p><strong>[00:03 - 00:06]</strong></p>
                  <p className="italic text-foreground/80">[Audiodescripción: Montaje rápido de paisajes andinos con picos nevados y valles.]</p>
                  <p>🗣️ "Explora los rincones más hermosos de Ecuador con nosotros."</p>
                </div>

                <div className={getHighlightClass(6, 11)}>
                  <p><strong>[00:06 - 00:10]</strong></p>
                  <p className="italic text-foreground/80">[Audiodescripción: Tortuga gigante en las Islas Galápagos, seguido de una vista aérea de la selva amazónica.]</p>
                  <p>🗣️ "Desde las Islas Galápagos hasta la selva amazónica."</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
