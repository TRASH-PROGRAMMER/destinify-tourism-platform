"use client"
import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"

interface AccessibleMapProps {
  lat: number
  lng: number
  zoom?: number
  markers?: Array<{
    id: string
    lat: number
    lng: number
    title: string
    description?: string
    alt?: string
  }>
  onMarkerClick?: (id: string) => void
  ariaLabel?: string
}

export function AccessibleMap({
  lat,
  lng,
  zoom = 12,
  markers = [],
  onMarkerClick,
  ariaLabel = "Mapa interactivo del destino"
}: AccessibleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Importación dinámica de Leaflet para evitar SSR
    const initMap = async () => {
      if (!mapRef.current) return
      
      const L = (await import("leaflet")).default
      
      // Cleanup previous map instance if it exists (e.g., StrictMode)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      // Inicializar mapa
      const map = L.map(mapRef.current, {
        keyboard: true, // Habilitar navegación por teclado
        keyboardPanDelta: 80, // Velocidad de paneo con teclado
        scrollWheelZoom: false, // Prevenir zoom accidental con scroll
      }).setView([lat, lng], zoom)

      // Tiles con atributos de accesibilidad
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      // Crear icono accesible personalizado usando un SVG
      const accessibleIcon = L.divIcon({
        html: `<div class="text-primary flex items-center justify-center w-full h-full" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3" fill="white"></circle>
                </svg>
               </div>`,
        className: 'bg-transparent border-0',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      })

      // Agregar marcadores accesibles
      markers.forEach((marker) => {
        const leafletMarker = L.marker([marker.lat, marker.lng], {
          icon: accessibleIcon,
          alt: marker.alt || marker.title, // ALT para screen readers
          riseOnHover: true,
          keyboard: true,
        })
        .addTo(map)
        .bindPopup(`
          <div class="accessible-popup">
            <h3 class="font-semibold text-base mb-1">${marker.title}</h3>
            ${marker.description ? `<p class="text-sm m-0">${marker.description}</p>` : ''}
          </div>
        `, {
          autoClose: false,
          closeOnEscapeKey: true,
          closeButton: true,
          className: 'custom-accessible-popup',
        })

        if (onMarkerClick) {
          leafletMarker.on('click', () => onMarkerClick(marker.id))
        }
      })
      mapInstanceRef.current = map
    }
    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng, zoom, markers, onMarkerClick])

  return (
    <div 
      ref={mapRef} 
      className="h-96 w-full rounded-xl border border-border z-0 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    />
  )
}
