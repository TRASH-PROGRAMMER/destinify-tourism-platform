"use client"

import {
  Type,
  Volume2,
  Contrast,
  Eye,
  Mic,
  Captions,
  BookOpen,
  Moon,
  Navigation,
  MousePointer2,
  MousePointerClick,
  FileText,
} from "lucide-react"
import { useA11y } from "./a11y-provider"
import { cn } from "@/lib/utils"

type Tone = "green" | "blue" | "purple" | "orange"

const toneClasses: Record<Tone, string> = {
  green: "bg-chart-4/15 text-chart-4 hover:bg-chart-4/25 ring-chart-4/40",
  blue: "bg-chart-3/15 text-chart-3 hover:bg-chart-3/25 ring-chart-3/40",
  purple: "bg-primary/15 text-primary hover:bg-primary/25 ring-primary/40",
  orange: "bg-accent/20 text-accent-foreground hover:bg-accent/30 ring-accent/50",
}

export function QuickActions() {
  const {
    settings,
    setSetting,
    speaking,
    speakPage,
    stopSpeech,
    voiceControlActive,
    toggleVoiceControl,
  } = useA11y()

  const actions: {
    icon: React.ReactNode
    label: string
    tone: Tone
    active: boolean
    onClick: () => void
  }[] = [
    {
      icon: <Type className="h-5 w-5" />,
      label: "Texto +",
      tone: "green",
      active: settings.fontScale > 1,
      onClick: () => setSetting("fontScale", Math.min(2, settings.fontScale + 0.1)),
    },
    {
      icon: <Volume2 className="h-5 w-5" />,
      label: "Leer",
      tone: "blue",
      active: speaking,
      onClick: () => (speaking ? stopSpeech() : speakPage()),
    },
    {
      icon: <Contrast className="h-5 w-5" />,
      label: "Contraste",
      tone: "purple",
      active: settings.contrast === "high",
      onClick: () => setSetting("contrast", settings.contrast === "high" ? "normal" : "high"),
    },
    {
      icon: <Eye className="h-5 w-5" />,
      label: "Daltonismo",
      tone: "orange",
      active: settings.colorblind !== "none",
      onClick: () =>
        setSetting("colorblind", settings.colorblind === "none" ? "deuteranopia" : "none"),
    },
    {
      icon: <Mic className="h-5 w-5" />,
      label: "Voz",
      tone: "green",
      active: voiceControlActive,
      onClick: toggleVoiceControl,
    },
    {
      icon: <Captions className="h-5 w-5" />,
      label: "Subtítulos",
      tone: "blue",
      active: false,
      onClick: () => {
        const el = document.querySelector("video")
        if (el) (el as HTMLVideoElement).textTracks[0] && ((el as HTMLVideoElement).textTracks[0].mode = "showing")
      },
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Dislexia",
      tone: "purple",
      active: settings.fontMode === "dyslexic",
      onClick: () =>
        setSetting("fontMode", settings.fontMode === "dyslexic" ? "default" : "dyslexic"),
    },
    {
      icon: <Moon className="h-5 w-5" />,
      label: "Modo oscuro",
      tone: "orange",
      active: settings.theme === "dark",
      onClick: () => setSetting("theme", settings.theme === "dark" ? "light" : "dark"),
    },
    {
      icon: <Navigation className="h-5 w-5" />,
      label: "Nav. voz",
      tone: "green",
      active: voiceControlActive,
      onClick: toggleVoiceControl,
    },
    {
      icon: <MousePointer2 className="h-5 w-5" />,
      label: "Cursor grande",
      tone: "blue",
      active: settings.bigCursor,
      onClick: () => setSetting("bigCursor", !settings.bigCursor),
    },
    {
      icon: <MousePointerClick className="h-5 w-5" />,
      label: "Scroll auto",
      tone: "purple",
      active: settings.autoScroll,
      onClick: () => setSetting("autoScroll", !settings.autoScroll),
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Simplificar",
      tone: "orange",
      active: settings.focusMode,
      onClick: () => setSetting("focusMode", !settings.focusMode),
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          onClick={a.onClick}
          aria-pressed={a.active}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            toneClasses[a.tone],
            a.active && "ring-2",
          )}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-sm">
            {a.icon}
          </span>
          <span className="text-xs font-medium leading-tight text-foreground">{a.label}</span>
        </button>
      ))}
    </div>
  )
}
