"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize, Ear } from "lucide-react"

// Script del tutorial sincronizado por tiempo (segundos)
const SCRIPT = [
  { time: 0, text: "Bienvenido a Destinify. Esta es una guía rápida de cómo usar la plataforma.", ad: "En pantalla, se observa la interfaz principal de Destinify. El cursor del ratón se desplaza hacia la esquina superior derecha." },
  { time: 3, text: "En la parte superior derecha encontrarás el botón de Accesibilidad.", ad: "El cursor hace clic en el ícono de accesibilidad, representado por una persona." },
  { time: 6, text: "Al abrirlo, puedes activar opciones como la fuente para Dislexia o el alto contraste.", ad: "Se abre un panel desplegable. El cursor selecciona la opción 'Dislexia' y el texto de la pantalla cambia a una fuente más legible." },
  { time: 10, text: "También puedes cambiar el idioma usando el selector integrado en la barra de navegación.", ad: "El cursor cierra el menú de accesibilidad y hace clic en el selector de idiomas que dice 'ES', cambiándolo." },
  { time: 14, text: "Explora los destinos deslizando hacia abajo, o dirígete a Mis Itinerarios para planear tus viajes.", ad: "La pantalla se desplaza lentamente hacia abajo, revelando hermosos destinos. Luego, el cursor hace clic en el botón 'Mis Itinerarios' del menú principal." },
  { time: 18, text: "Todo ha sido diseñado para ser accesible y fácil de usar. ¡Disfruta tu viaje!", ad: "Se carga la pantalla de Mis Itinerarios mostrando una lista de viajes guardados. El video termina." },
]

export function AccessibleVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [adEnabled, setAdEnabled] = useState(false)
  const [ccEnabled, setCcEnabled] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSubtitle, setCurrentSubtitle] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Manejo del tiempo virtual
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 24) {
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
        
        // Si el AD está activado, construimos el texto con la audiodescripción antes
        const textToSpeak = adEnabled ? `Audiodescripción: ${activeLine.ad}. Narración: ${activeLine.text}` : activeLine.text

        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.lang = 'es-ES'
        utterance.rate = adEnabled ? 1.2 : 1.0 // Hablamos un poco más rápido si hay AD
        window.speechSynthesis.speak(utterance)
      }
    }
  }, [currentTime, isPlaying, isMuted, adEnabled, currentSubtitle])

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

  const toggleAd = () => setAdEnabled(!adEnabled)
  const toggleCc = () => setCcEnabled(!ccEnabled)

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

  // Progress bar percentage (24 seconds total to accommodate longer AD voice)
  const progress = (currentTime / 24) * 100

  return (
    <div className="flex flex-col gap-2">
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

        {/* Indicador de AD activo */}
        {adEnabled && (
          <div className="absolute top-4 left-4 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold border border-white/20 z-20 pointer-events-none">
            AD Activado
          </div>
        )}

        {/* Subtítulos */}
        {isPlaying && ccEnabled && currentSubtitle && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center px-4 pointer-events-none transition-opacity duration-300 z-20">
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
            aria-valuemax={24}
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

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleCc}
                className={`text-white hover:text-white rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${ccEnabled ? 'bg-primary/50 hover:bg-primary/60' : 'hover:bg-white/20'}`}
                aria-pressed={ccEnabled}
                aria-label={ccEnabled ? "Ocultar subtítulos" : "Mostrar subtítulos"}
              >
                <span className="font-bold text-xs uppercase">CC</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleAd}
                className={`hidden sm:flex text-white hover:text-white rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${adEnabled ? 'bg-primary/50 hover:bg-primary/60' : 'hover:bg-white/20'}`}
                aria-pressed={adEnabled}
                aria-label={adEnabled ? "Desactivar Audiodescripción" : "Activar Audiodescripción"}
              >
                <Ear className="w-4 h-4 mr-1.5" />
                <span className="font-semibold text-xs">AD</span>
              </Button>
              
              <span className="text-white/90 text-sm font-medium ml-2 hidden md:block" aria-hidden="true">
                00:{currentTime.toString().padStart(2, '0')} / 00:24
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

      <div className="mt-2 bg-secondary/30 border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full px-5 py-3 flex items-center justify-between text-left font-semibold text-foreground hover:bg-secondary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          aria-expanded={showTranscript}
          aria-controls="help-transcript-content"
        >
          <span className="text-sm">Ver Transcripción Completa (En vivo)</span>
          <svg className={`w-4 h-4 transition-transform duration-200 ${showTranscript ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        
        <div 
          id="help-transcript-content"
          className={`px-5 overflow-hidden transition-all duration-300 ${showTranscript ? "pb-5 max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
          aria-hidden={!showTranscript}
        >
          <div className="pt-2 space-y-2 text-xs sm:text-sm text-muted-foreground border-t border-border">
            {SCRIPT.map((line, index) => {
              const nextTime = SCRIPT[index + 1]?.time || 24
              const isActive = currentTime >= line.time && currentTime < nextTime
              
              return (
                <div key={index} className={`pl-3 py-2 transition-all duration-300 border-l-4 ${isActive ? 'bg-primary/20 border-primary rounded-r-md text-foreground' : 'border-transparent'}`}>
                  <p><strong>[00:{line.time.toString().padStart(2, '0')} - 00:{nextTime.toString().padStart(2, '0')}]</strong></p>
                  <p className="italic text-foreground/80">[Audiodescripción: {line.ad}]</p>
                  <p>🗣️ "{line.text}"</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
