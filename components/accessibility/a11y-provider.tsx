"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"

export type ColorblindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia"
export type FontMode = "default" | "dyslexic" | "readable"
export type ContrastMode = "normal" | "high"

export interface A11ySettings {
  // Visión
  fontScale: number
  fontMode: FontMode
  theme: "light" | "dark"
  contrast: ContrastMode
  colorblind: ColorblindMode
  letterSpacing: number
  lineHeight: number
  highlightLinks: boolean
  highlightButtons: boolean
  animations: boolean
  // Audio / lectura
  readOnHover: boolean
  speechRate: number
  speechVolume: number
  speechVoiceURI: string | null
  // Cognitivo
  focusMode: boolean
  hideDistractions: boolean
  readingGuide: boolean
  autism: boolean
  extendedTime: boolean
  disableBlink: boolean
  // Motriz
  bigCursor: boolean
  bigTargets: boolean
  focusHighlight: boolean
  autoScroll: boolean
}

export const DEFAULT_SETTINGS: A11ySettings = {
  fontScale: 1,
  fontMode: "default",
  theme: "light",
  contrast: "normal",
  colorblind: "none",
  letterSpacing: 0,
  lineHeight: 1.6,
  highlightLinks: false,
  highlightButtons: false,
  animations: true,
  readOnHover: false,
  speechRate: 1,
  speechVolume: 1,
  speechVoiceURI: null,
  focusMode: false,
  hideDistractions: false,
  readingGuide: false,
  autism: false,
  extendedTime: false,
  disableBlink: false,
  bigCursor: false,
  bigTargets: false,
  focusHighlight: false,
  autoScroll: false,
}

const STORAGE_KEY = "destinify-a11y-settings"

interface A11yContextValue {
  settings: A11ySettings
  setSetting: <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => void
  reset: () => void
  // Speech
  speaking: boolean
  paused: boolean
  voices: SpeechSynthesisVoice[]
  speak: (text: string) => void
  speakPage: () => void
  pauseSpeech: () => void
  resumeSpeech: () => void
  stopSpeech: () => void
  speakSelection: () => void
  // Voice control
  voiceControlActive: boolean
  toggleVoiceControl: () => void
  voiceTranscript: string
}

const A11yContext = createContext<A11yContextValue | null>(null)

export function useA11y() {
  const ctx = useContext(A11yContext)
  if (!ctx) throw new Error("useA11y must be used within A11yProvider")
  return ctx
}

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)

  // Speech state
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  // Voice control state
  const [voiceControlActive, setVoiceControlActive] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const recognitionRef = useRef<any>(null)

  // ---- Load persisted settings ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) })
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setSettings((s) => ({ ...s, theme: "dark" }))
      }
    } catch {
      /* ignore */
    }
    setLoaded(true)
  }, [])

  // ---- Persist settings ----
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* ignore */
    }
  }, [settings, loaded])

  // ---- Apply settings to DOM ----
  useEffect(() => {
    if (!loaded) return
    const html = document.documentElement

    html.classList.toggle("dark", settings.theme === "dark")

    html.style.setProperty("--a11y-font-scale", String(settings.fontScale))
    html.style.setProperty("--a11y-letter-spacing", `${settings.letterSpacing}em`)
    html.style.setProperty("--a11y-line-height", String(settings.lineHeight))
    html.setAttribute("data-a11y-font-scale", String(settings.fontScale))

    const setAttr = (name: string, on: boolean, value = "true") => {
      if (on) html.setAttribute(name, value)
      else html.removeAttribute(name)
    }

    setAttr("data-a11y-spacing", settings.letterSpacing !== 0 || settings.lineHeight !== 1.6)
    setAttr("data-a11y-font", settings.fontMode !== "default", settings.fontMode)
    setAttr("data-a11y-contrast", settings.contrast === "high", "high")
    setAttr("data-a11y-colorblind", settings.colorblind !== "none", settings.colorblind)
    setAttr("data-a11y-highlight-links", settings.highlightLinks)
    setAttr("data-a11y-highlight-buttons", settings.highlightButtons)
    setAttr("data-a11y-animations", !settings.animations, "off")
    setAttr("data-a11y-blink", settings.disableBlink, "off")
    setAttr("data-a11y-focus-mode", settings.focusMode)
    setAttr("data-a11y-hide-distractions", settings.hideDistractions)
    setAttr("data-a11y-autism", settings.autism)
    setAttr("data-a11y-big-cursor", settings.bigCursor)
    setAttr("data-a11y-big-targets", settings.bigTargets)
    setAttr("data-a11y-focus-highlight", settings.focusHighlight)
  }, [settings, loaded])

  // ---- Load speech voices ----
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices())
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const setSetting = useCallback(<K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [])

  // ---- Speech helpers ----
  const buildUtterance = useCallback(
    (text: string) => {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = "es-ES"
      u.rate = settings.speechRate
      u.volume = settings.speechVolume
      const voice = voices.find((v) => v.voiceURI === settings.speechVoiceURI)
      if (voice) u.lang = voice.lang
      if (voice) u.voice = voice
      u.onstart = () => {
        setSpeaking(true)
        setPaused(false)
      }
      u.onend = () => {
        setSpeaking(false)
        setPaused(false)
      }
      u.onerror = () => {
        setSpeaking(false)
        setPaused(false)
      }
      return u
    },
    [settings.speechRate, settings.speechVolume, settings.speechVoiceURI, voices],
  )

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || !text.trim()) return
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(buildUtterance(text))
    },
    [buildUtterance],
  )

  const speakPage = useCallback(() => {
    if (typeof window === "undefined") return
    const main = document.querySelector("main") || document.body
    const text = (main as HTMLElement).innerText.replace(/\s+/g, " ").slice(0, 8000)
    speak(text)
  }, [speak])

  const speakSelection = useCallback(() => {
    const sel = window.getSelection()?.toString()
    if (sel) speak(sel)
  }, [speak])

  const pauseSpeech = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.pause()
      setPaused(true)
    }
  }, [])

  const resumeSpeech = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.resume()
      setPaused(false)
    }
  }, [])

  const stopSpeech = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      setPaused(false)
    }
  }, [])

  // ---- Read on hover ----
  useEffect(() => {
    if (!settings.readOnHover) return
    let timer: ReturnType<typeof setTimeout>
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return
      const text = target.innerText?.trim()
      if (text && text.length < 400) {
        clearTimeout(timer)
        timer = setTimeout(() => speak(text), 250)
      }
    }
    document.addEventListener("mouseover", handler)
    return () => {
      document.removeEventListener("mouseover", handler)
      clearTimeout(timer)
    }
  }, [settings.readOnHover, speak])

  // ---- Reading guide ----
  useEffect(() => {
    if (!settings.readingGuide) return
    const guide = document.createElement("div")
    guide.className = "a11y-reading-guide"
    document.body.appendChild(guide)
    const move = (e: MouseEvent) => {
      guide.style.top = `${e.clientY - 18}px`
    }
    document.addEventListener("mousemove", move)
    return () => {
      document.removeEventListener("mousemove", move)
      guide.remove()
    }
  }, [settings.readingGuide])

  // ---- Auto scroll ----
  useEffect(() => {
    if (!settings.autoScroll) return
    const id = setInterval(() => window.scrollBy({ top: 1, behavior: "auto" }), 50)
    return () => clearInterval(id)
  }, [settings.autoScroll])

  // ---- Voice control (Web Speech Recognition) ----
  const toggleVoiceControl = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("El reconocimiento de voz no está disponible en este navegador.")
      return
    }
    if (voiceControlActive) {
      recognitionRef.current?.stop()
      setVoiceControlActive(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = "es-ES"
    recognition.continuous = true
    recognition.interimResults = false
    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase()
      setVoiceTranscript(transcript)
      handleVoiceCommand(transcript)
    }
    recognition.onend = () => {
      if (recognitionRef.current) recognition.start()
    }
    recognitionRef.current = recognition
    recognition.start()
    setVoiceControlActive(true)
  }, [voiceControlActive])

  const handleVoiceCommand = useCallback(
    (cmd: string) => {
      if (cmd.includes("abajo") || cmd.includes("baja")) {
        window.scrollBy({ top: 400, behavior: "smooth" })
      } else if (cmd.includes("arriba") || cmd.includes("sube")) {
        window.scrollBy({ top: -400, behavior: "smooth" })
      } else if (cmd.includes("inicio") || cmd.includes("principio")) {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else if (cmd.includes("final") || cmd.includes("abajo del todo")) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
      } else if (cmd.includes("leer")) {
        speakPage()
      } else if (cmd.includes("parar") || cmd.includes("detener") || cmd.includes("silencio")) {
        stopSpeech()
      } else if (cmd.startsWith("ir a") || cmd.startsWith("abrir")) {
        const routes: Record<string, string> = {
          inicio: "/",
          destinos: "/destinos",
          itinerarios: "/itinerarios",
          reservas: "/reservas",
          asistente: "/asistente",
          perfil: "/perfil",
        }
        for (const [name, path] of Object.entries(routes)) {
          if (cmd.includes(name)) {
            window.location.href = path
            break
          }
        }
      }
    },
    [speakPage, stopSpeech],
  )

  // Stop recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null
        recognitionRef.current.stop()
      }
    }
  }, [])

  const value: A11yContextValue = {
    settings,
    setSetting,
    reset,
    speaking,
    paused,
    voices,
    speak,
    speakPage,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakSelection,
    voiceControlActive,
    toggleVoiceControl,
    voiceTranscript,
  }

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>
}
