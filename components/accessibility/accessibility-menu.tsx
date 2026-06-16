"use client"

import { useState } from "react"
import {
  Eye,
  Volume2,
  Clapperboard,
  Captions,
  Brain,
  Mic,
  MousePointer2,
  Zap,
  Type,
  ZoomIn,
  Moon,
  Sun,
  Contrast,
  Palette,
  AlignJustify,
  Link2,
  SquareMousePointer,
  Sparkles,
  Pause,
  Square,
  Play,
  Gauge,
  Languages,
  MousePointerClick,
  BookOpen,
  Target,
  Focus,
  Smile,
  Timer,
  ZapOff,
  Keyboard,
  RotateCcw,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useA11y } from "./a11y-provider"
import { ToggleRow, SliderRow, OptionButtons } from "./a11y-controls"
import { QuickActions } from "./quick-actions"

export function AccessibilityMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const {
    settings,
    setSetting,
    reset,
    speaking,
    paused,
    voices,
    speakPage,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakSelection,
    voiceControlActive,
    toggleVoiceControl,
    voiceTranscript,
  } = useA11y()
  const [tab, setTab] = useState("quick")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md p-0 sm:max-w-md"
        aria-label="Menú de accesibilidad"
      >
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle className="flex items-center gap-2 font-serif text-xl">
            <Zap className="h-5 w-5 text-primary" />
            Accesibilidad
          </SheetTitle>
          <SheetDescription>
            Personaliza la experiencia según tus necesidades. Los cambios se guardan automáticamente.
          </SheetDescription>
        </SheetHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex h-[calc(100dvh-8.5rem)] flex-col">
          <ScrollArea className="border-b border-border">
            <TabsList className="flex h-auto w-max justify-start gap-1 bg-transparent px-3 py-2">
              <TabsTrigger value="quick" className="gap-1.5 data-[state=active]:bg-secondary">
                <Zap className="h-4 w-4" /> Rápido
              </TabsTrigger>
              <TabsTrigger value="vision" className="gap-1.5 data-[state=active]:bg-secondary">
                <Eye className="h-4 w-4" /> Visión
              </TabsTrigger>
              <TabsTrigger value="audio" className="gap-1.5 data-[state=active]:bg-secondary">
                <Volume2 className="h-4 w-4" /> Audio
              </TabsTrigger>
              <TabsTrigger value="media" className="gap-1.5 data-[state=active]:bg-secondary">
                <Clapperboard className="h-4 w-4" /> Multimedia
              </TabsTrigger>
              <TabsTrigger value="cognitive" className="gap-1.5 data-[state=active]:bg-secondary">
                <Brain className="h-4 w-4" /> Cognitivo
              </TabsTrigger>
              <TabsTrigger value="voice" className="gap-1.5 data-[state=active]:bg-secondary">
                <Mic className="h-4 w-4" /> Voz
              </TabsTrigger>
              <TabsTrigger value="motor" className="gap-1.5 data-[state=active]:bg-secondary">
                <MousePointer2 className="h-4 w-4" /> Motriz
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <ScrollArea className="flex-1">
            <div className="space-y-3 p-4">
              {/* QUICK ACTIONS */}
              <TabsContent value="quick" className="mt-0 space-y-3">
                <p className="text-sm text-muted-foreground">Acciones rápidas más usadas</p>
                <QuickActions />
              </TabsContent>

              {/* VISIÓN */}
              <TabsContent value="vision" className="mt-0 space-y-3">
                <SliderRow
                  icon={<Type className="h-4 w-4" />}
                  label="Tamaño de letra"
                  value={settings.fontScale}
                  min={0.8}
                  max={2}
                  step={0.1}
                  onChange={(v) => setSetting("fontScale", v)}
                  format={(v) => `${Math.round(v * 100)}%`}
                />
                <OptionButtons
                  label="Tipo de fuente"
                  icon={<BookOpen className="h-4 w-4" />}
                  value={settings.fontMode}
                  onChange={(v) => setSetting("fontMode", v as typeof settings.fontMode)}
                  options={[
                    { value: "default", label: "Predeterminada" },
                    { value: "dyslexic", label: "OpenDyslexic" },
                    { value: "readable", label: "Legible" },
                  ]}
                />
                <OptionButtons
                  label="Tema"
                  icon={settings.theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  value={settings.theme}
                  onChange={(v) => setSetting("theme", v as typeof settings.theme)}
                  options={[
                    { value: "light", label: "Claro" },
                    { value: "dark", label: "Oscuro" },
                  ]}
                />
                <ToggleRow
                  icon={<Contrast className="h-4 w-4" />}
                  label="Alto contraste"
                  description="Texto claro sobre fondo negro"
                  checked={settings.contrast === "high"}
                  onChange={(c) => setSetting("contrast", c ? "high" : "normal")}
                />
                <OptionButtons
                  label="Filtros para daltonismo"
                  icon={<Palette className="h-4 w-4" />}
                  value={settings.colorblind}
                  onChange={(v) => setSetting("colorblind", v as typeof settings.colorblind)}
                  options={[
                    { value: "none", label: "Ninguno" },
                    { value: "protanopia", label: "Protanopia" },
                    { value: "deuteranopia", label: "Deuteranopia" },
                    { value: "tritanopia", label: "Tritanopia" },
                  ]}
                />
                <SliderRow
                  icon={<AlignJustify className="h-4 w-4" />}
                  label="Espaciado entre letras"
                  value={settings.letterSpacing}
                  min={0}
                  max={0.5}
                  step={0.05}
                  onChange={(v) => setSetting("letterSpacing", v)}
                  format={(v) => `${v.toFixed(2)}em`}
                />
                <SliderRow
                  icon={<AlignJustify className="h-4 w-4" />}
                  label="Espaciado entre líneas"
                  value={settings.lineHeight}
                  min={1.2}
                  max={2.5}
                  step={0.1}
                  onChange={(v) => setSetting("lineHeight", v)}
                  format={(v) => v.toFixed(1)}
                />
                <ToggleRow
                  icon={<Link2 className="h-4 w-4" />}
                  label="Resaltar enlaces"
                  checked={settings.highlightLinks}
                  onChange={(c) => setSetting("highlightLinks", c)}
                />
                <ToggleRow
                  icon={<SquareMousePointer className="h-4 w-4" />}
                  label="Resaltar botones"
                  checked={settings.highlightButtons}
                  onChange={(c) => setSetting("highlightButtons", c)}
                />
                <ToggleRow
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Ocultar animaciones"
                  checked={!settings.animations}
                  onChange={(c) => setSetting("animations", !c)}
                />
              </TabsContent>

              {/* AUDIO / LECTURA */}
              <TabsContent value="audio" className="mt-0 space-y-3">
                <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-3">
                  <Button size="sm" onClick={speakPage} className="gap-1.5">
                    <Volume2 className="h-4 w-4" /> Leer página
                  </Button>
                  {paused ? (
                    <Button size="sm" variant="secondary" onClick={resumeSpeech} className="gap-1.5">
                      <Play className="h-4 w-4" /> Reanudar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={pauseSpeech}
                      disabled={!speaking}
                      className="gap-1.5"
                    >
                      <Pause className="h-4 w-4" /> Pausar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={stopSpeech}
                    disabled={!speaking}
                    className="gap-1.5"
                  >
                    <Square className="h-4 w-4" /> Detener
                  </Button>
                  <Button size="sm" variant="outline" onClick={speakSelection} className="gap-1.5">
                    <BookOpen className="h-4 w-4" /> Leer selección
                  </Button>
                </div>
                {speaking && (
                  <p className="rounded-md bg-secondary px-3 py-2 text-xs text-secondary-foreground" role="status">
                    {paused ? "Lectura en pausa" : "Leyendo en voz alta…"}
                  </p>
                )}
                <SliderRow
                  icon={<Gauge className="h-4 w-4" />}
                  label="Velocidad de lectura"
                  value={settings.speechRate}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onChange={(v) => setSetting("speechRate", v)}
                  format={(v) => `${v.toFixed(1)}x`}
                />
                <SliderRow
                  icon={<Volume2 className="h-4 w-4" />}
                  label="Volumen"
                  value={settings.speechVolume}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={(v) => setSetting("speechVolume", v)}
                  format={(v) => `${Math.round(v * 100)}%`}
                />
                <div className="rounded-lg border border-border bg-card p-3">
                  <label
                    htmlFor="a11y-voice"
                    className="mb-2 flex items-center gap-3 text-sm font-medium text-card-foreground"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
                      <Languages className="h-4 w-4" />
                    </span>
                    Voz / Idioma
                  </label>
                  <select
                    id="a11y-voice"
                    value={settings.speechVoiceURI ?? ""}
                    onChange={(e) => setSetting("speechVoiceURI", e.target.value || null)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Predeterminada del sistema</option>
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
                <ToggleRow
                  icon={<MousePointerClick className="h-4 w-4" />}
                  label="Leer al pasar el mouse"
                  description="Lee el texto del elemento bajo el cursor"
                  checked={settings.readOnHover}
                  onChange={(c) => setSetting("readOnHover", c)}
                />
              </TabsContent>

              {/* MULTIMEDIA */}
              <TabsContent value="media" className="mt-0 space-y-3">
                <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                  <Clapperboard className="mb-2 h-5 w-5 text-primary" />
                  <p className="font-medium text-card-foreground">Controles de multimedia</p>
                  <p className="mt-1">
                    Los subtítulos, transcripciones y ajustes de vídeo se activan automáticamente
                    cuando hay contenido multimedia en la página. Usa los controles del reproductor
                    para tamaño, color y posición de subtítulos.
                  </p>
                </div>
                <ToggleRow
                  icon={<Volume2 className="h-4 w-4" />}
                  label="Reducir sonidos fuertes"
                  description="Normaliza el volumen de los vídeos"
                  checked={false}
                  onChange={() => {
                    document.querySelectorAll("video, audio").forEach((m) => {
                      ;(m as HTMLMediaElement).volume = 0.5
                    })
                  }}
                />
                <ToggleRow
                  icon={<Captions className="h-4 w-4" />}
                  label="Subtítulos automáticos"
                  description="Muestra subtítulos en los vídeos disponibles"
                  checked={false}
                  onChange={() => {
                    document.querySelectorAll("video").forEach((v) => {
                      const t = (v as HTMLVideoElement).textTracks[0]
                      if (t) t.mode = "showing"
                    })
                  }}
                />
              </TabsContent>

              {/* COGNITIVO */}
              <TabsContent value="cognitive" className="mt-0 space-y-3">
                <ToggleRow
                  icon={<BookOpen className="h-4 w-4" />}
                  label="Modo dislexia"
                  description="Fuente OpenDyslexic + mayor espaciado"
                  checked={settings.fontMode === "dyslexic"}
                  onChange={(c) => {
                    setSetting("fontMode", c ? "dyslexic" : "default")
                    if (c) {
                      setSetting("letterSpacing", 0.1)
                      setSetting("lineHeight", 1.9)
                    }
                  }}
                />
                <ToggleRow
                  icon={<Focus className="h-4 w-4" />}
                  label="Modo lectura enfocada"
                  description="Atenúa menús y barras laterales"
                  checked={settings.focusMode}
                  onChange={(c) => setSetting("focusMode", c)}
                />
                <ToggleRow
                  icon={<Target className="h-4 w-4" />}
                  label="Ocultar distracciones"
                  description="Oculta elementos decorativos y vídeos automáticos"
                  checked={settings.hideDistractions}
                  onChange={(c) => setSetting("hideDistractions", c)}
                />
                <ToggleRow
                  icon={<AlignJustify className="h-4 w-4" />}
                  label="Resaltar línea actual"
                  description="Guía de lectura que sigue al cursor"
                  checked={settings.readingGuide}
                  onChange={(c) => setSetting("readingGuide", c)}
                />
                <ToggleRow
                  icon={<Smile className="h-4 w-4" />}
                  label="Modo autismo"
                  description="Colores suaves, sin animaciones ni ruido visual"
                  checked={settings.autism}
                  onChange={(c) => setSetting("autism", c)}
                />
                <ToggleRow
                  icon={<Timer className="h-4 w-4" />}
                  label="Más tiempo en formularios"
                  description="Desactiva tiempos de espera automáticos"
                  checked={settings.extendedTime}
                  onChange={(c) => setSetting("extendedTime", c)}
                />
                <ToggleRow
                  icon={<ZapOff className="h-4 w-4" />}
                  label="Desactivar parpadeos"
                  description="Detiene contenido que parpadea o destella"
                  checked={settings.disableBlink}
                  onChange={(c) => setSetting("disableBlink", c)}
                />
              </TabsContent>

              {/* VOZ */}
              <TabsContent value="voice" className="mt-0 space-y-3">
                <div className="rounded-lg border border-border bg-card p-4">
                  <Button
                    onClick={toggleVoiceControl}
                    variant={voiceControlActive ? "default" : "secondary"}
                    className="w-full gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    {voiceControlActive ? "Detener control por voz" : "Activar control por voz"}
                  </Button>
                  {voiceControlActive && (
                    <p className="mt-3 text-xs text-muted-foreground" role="status" aria-live="polite">
                      Escuchando… {voiceTranscript && <span className="font-medium text-foreground">“{voiceTranscript}”</span>}
                    </p>
                  )}
                </div>
                <div className="rounded-lg border border-border bg-card p-3 text-sm">
                  <p className="mb-2 font-medium text-card-foreground">Comandos disponibles</p>
                  <ul className="space-y-1.5 text-muted-foreground">
                    <li>• <span className="text-foreground">“Bajar / Subir”</span> — desplazar la página</li>
                    <li>• <span className="text-foreground">“Inicio / Final”</span> — ir al inicio o al final</li>
                    <li>• <span className="text-foreground">“Leer”</span> — leer la página en voz alta</li>
                    <li>• <span className="text-foreground">“Detener”</span> — parar la lectura</li>
                    <li>• <span className="text-foreground">“Ir a destinos / reservas / perfil…”</span> — navegar</li>
                  </ul>
                </div>
              </TabsContent>

              {/* MOTRIZ */}
              <TabsContent value="motor" className="mt-0 space-y-3">
                <ToggleRow
                  icon={<MousePointer2 className="h-4 w-4" />}
                  label="Cursor grande"
                  checked={settings.bigCursor}
                  onChange={(c) => setSetting("bigCursor", c)}
                />
                <ToggleRow
                  icon={<Target className="h-4 w-4" />}
                  label="Botones grandes"
                  description="Aumenta el área de los elementos interactivos"
                  checked={settings.bigTargets}
                  onChange={(c) => setSetting("bigTargets", c)}
                />
                <ToggleRow
                  icon={<Keyboard className="h-4 w-4" />}
                  label="Resaltar foco del teclado"
                  description="Borde visible al navegar con TAB"
                  checked={settings.focusHighlight}
                  onChange={(c) => setSetting("focusHighlight", c)}
                />
                <ToggleRow
                  icon={<ZoomIn className="h-4 w-4" />}
                  label="Scroll automático"
                  description="Desplazamiento lento y continuo de la página"
                  checked={settings.autoScroll}
                  onChange={(c) => setSetting("autoScroll", c)}
                />
              </TabsContent>
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5 text-muted-foreground">
              <RotateCcw className="h-4 w-4" /> Restablecer todo
            </Button>
            <Button size="sm" onClick={() => onOpenChange(false)}>
              Listo
            </Button>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
