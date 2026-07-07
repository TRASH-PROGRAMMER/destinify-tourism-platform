"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"

// Script del tutorial sincronizado por tiempo (segundos)
const SCRIPT = [
  { time: 0, text: "Bienvenido a Destinify. Esta es una guía rápida de cómo usar la plataforma." },
  { time: 3, text: "En la parte superior derecha encontrarás el botón de Accesibilidad." },
  { time: 6, text: "Al abrirlo, puedes activar opciones como la fuente para Dislexia o el alto contraste." },
  { time: 10, text: "También puedes cambiar el idioma usando el selector integrado en la barra de navegación." },
  { time: 14, text: "Explora los destinos deslizando hacia abajo, o dirígete a Mis Itinerarios para planear tus viajes." },
  { time: 18, text: "Todo ha sido diseñado para ser accesible y fácil de usar. ¡Disfruta tu viaje!" },
]

export function AccessibleVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSubtitle, setCurrentSubtitle] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Manejo del tiempo virtual
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 22) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  // Manejo de la voz y subtítulos
  useEffect(() => {
    // Buscar el subtítulo actual
    const activeLine = SCRIPT.slice().reverse().find(s => currentTime >= s.time)
    
    if (activeLine && activeLine.text !== currentSubtitle) {
      setCurrentSubtitle(activeLine.text)
      
      // Si está reproduciendo y no está muteado, hablar
      if (isPlaying && !isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel() // Detener habla anterior
        const utterance = new SpeechSynthesisUtterance(activeLine.text)
        utterance.lang = 'es-ES'
        utterance.rate = 1.0 // Velocidad normal y pausada
        window.speechSynthesis.speak(utterance)
      }
    }
  }, [currentTime, isPlaying, isMuted, currentSubtitle])

  // Detener la voz al pausar
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (!isPlaying) {
        window.speechSynthesis.pause()
      } else {
        window.speechSynthesis.resume()
      }
    }
  }, [isPlaying])

  const togglePlay = () => setIsPlaying(!isPlaying)
  
  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  const toggleFullscreen = () => {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen().catch(err => console.log(err))
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Progress bar percentage
  const progress = (currentTime / 22) * 100

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex flex-col shadow-lg border border-border group"
      aria-label="Reproductor de Video de Ayuda"
      role="region"
    >
      {/* El "Video" (WebP Animado) */}
      <div className="relative w-full h-full flex-1 flex items-center justify-center bg-black">
        {/* Usamos el webp, y si isPlaying es falso, mostramos un overlay oscuro para "pausarlo" visualmente */}
        <img 
          src="/videos/tutorial.webp" 
          alt="Video demostrativo de cómo usar la plataforma"
          className={`w-full h-full object-cover transition-opacity duration-300 ${!isPlaying && currentTime > 0 ? 'opacity-50' : 'opacity-100'}`}
        />
        
        {/* Botón grande de Play inicial */}
        {!isPlaying && currentTime === 0 && (
          <button 
            onClick={togglePlay}
            className="absolute z-10 flex items-center justify-center w-16 h-16 bg-primary/90 text-primary-foreground rounded-full hover:bg-primary hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent shadow-xl"
            aria-label="Iniciar video y narración"
          >
            <Play className="w-8 h-8 ml-1" />
          </button>
        )}
      </div>

      {/* Subtítulos */}
      {isPlaying && currentSubtitle && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center px-4 pointer-events-none transition-opacity duration-300 z-20">
          <p 
            className="bg-black/90 text-white text-sm md:text-base lg:text-lg font-medium px-4 py-2 rounded-lg max-w-[90%] text-center shadow-lg border border-white/10"
            aria-live="polite"
          >
            {currentSubtitle}
          </p>
        </div>
      )}

      {/* Controles del reproductor (Accesibles) */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-30 focus-within:opacity-100">
        {/* Barra de progreso */}
        <div 
          className="w-full h-1.5 bg-white/30 rounded-full mb-3 overflow-hidden cursor-default"
          role="progressbar"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={22}
          aria-label="Progreso del video"
        >
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Botones */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={togglePlay}
              className="text-white hover:bg-white/20 hover:text-white rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMute}
              className="text-white hover:bg-white/20 hover:text-white rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label={isMuted ? "Activar audio de narración" : "Silenciar narración"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            
            <span className="text-white/90 text-sm font-medium ml-2 hidden sm:block" aria-hidden="true">
              00:{currentTime.toString().padStart(2, '0')} / 00:22
            </span>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20 hover:text-white rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label={isFullscreen ? "Salir de pantalla completa" : "Ver en pantalla completa"}
          >
            <Maximize className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
