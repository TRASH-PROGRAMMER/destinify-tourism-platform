import { Clapperboard } from "lucide-react"

export function VideoSection() {
  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
            Accesibilidad Multimedia
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Descubre nuestra experiencia en video
          </p>
          <p className="mt-4 text-muted-foreground text-balance">
            Nuestro reproductor es totalmente accesible. Puedes activar y desactivar los subtítulos directamente usando el botón "CC" en los controles del video, o gestionarlo globalmente desde el menú de Accesibilidad en la pestaña "Multimedia".
          </p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border-2 border-border shadow-2xl bg-black relative">
          <video
            controls
            preload="metadata"
            className="w-full aspect-video object-contain"
            aria-label="Video promocional de Destinify demostrando las opciones de viaje"
          >
            {/* Usamos el video local subido por el usuario */}
            <source src="/Video%20Project%201.mp4" type="video/mp4" />
            {/* Pista de subtítulos (VTT) */}
            <track
              kind="subtitles"
              src="/subs-es.vtt"
              srcLang="es"
              label="Español (CC)"
              default
            />
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      </div>
    </section>
  )
}
