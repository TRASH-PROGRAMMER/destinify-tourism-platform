"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Calendar,
  Camera,
  Car,
  ChevronDown,
  ChevronUp,
  Clock,
  Coffee,
  Edit2,
  Hotel,
  MapPin,
  Mountain,
  Plus,
  Trash2,
  Utensils,
  X,
  Loader2
} from "lucide-react"

import { initialItineraries, type Itinerary, type Activity } from "@/lib/mock-data"

const activityIcons: Record<string, any> = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Utensils,
  activity: Mountain,
  sightseeing: Camera,
  hotel: Hotel,
  transport: Car,
}

export default function ItineraryEditPage() {
  const params = useParams()
  const router = useRouter()
  // Ensure we safely get id from params
  const id = params?.id as string
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [editingActivityLocation, setEditingActivityLocation] = useState<{ dayIndex: number; actIndex: number } | null>(null)
  const [editingActivityData, setEditingActivityData] = useState<Partial<Activity>>({})
  
  useEffect(() => {
    if (!id) return;

    const saved = localStorage.getItem("destinify_itineraries_list")
    const list: Itinerary[] = saved ? JSON.parse(saved) : initialItineraries
    const found = list.find(it => it.id === Number(id))
    
    if (found) {
      // Ensure it has days structure
      if (!found.itineraryDays) {
        found.itineraryDays = [
          {
            day: 1,
            date: found.startDate,
            activities: []
          }
        ]
      }
      setItinerary(found)
    }
    setLoading(false)
  }, [id])

  const saveGlobalState = (updatedItinerary: Itinerary) => {
    setItinerary(updatedItinerary)
    const saved = localStorage.getItem("destinify_itineraries_list")
    const list: Itinerary[] = saved ? JSON.parse(saved) : initialItineraries
    const newList = list.map(it => it.id === updatedItinerary.id ? updatedItinerary : it)
    localStorage.setItem("destinify_itineraries_list", JSON.stringify(newList))
  }

  const handleSaveActivity = () => {
    if (!itinerary || !itinerary.itineraryDays || !editingActivityLocation) return

    const { dayIndex, actIndex } = editingActivityLocation
    const daysCopy = [...itinerary.itineraryDays]
    const activities = [...daysCopy[dayIndex].activities]

    if (actIndex === -1) {
      // New
      activities.push({
        id: `act_${Date.now()}`,
        title: editingActivityData.title || "Nueva actividad",
        description: editingActivityData.description || "",
        type: editingActivityData.type as any || "activity",
        time: editingActivityData.time || "12:00",
        duration: editingActivityData.duration || "1h",
        cost: Number(editingActivityData.cost) || 0,
      })
    } else {
      // Edit
      activities[actIndex] = {
        ...activities[actIndex],
        title: editingActivityData.title || activities[actIndex].title,
        description: editingActivityData.description !== undefined ? editingActivityData.description : activities[actIndex].description,
        type: editingActivityData.type as any || activities[actIndex].type,
        time: editingActivityData.time || activities[actIndex].time,
        duration: editingActivityData.duration || activities[actIndex].duration,
        cost: editingActivityData.cost !== undefined ? Number(editingActivityData.cost) : activities[actIndex].cost,
      }
    }

    daysCopy[dayIndex].activities = activities
    saveGlobalState({ ...itinerary, itineraryDays: daysCopy })
    setIsActivityModalOpen(false)
    toast.success("Actividad guardada")
  }

  const removeActivity = (dayIndex: number, actId: string) => {
    if (!itinerary || !itinerary.itineraryDays) return
    const daysCopy = [...itinerary.itineraryDays]
    daysCopy[dayIndex].activities = daysCopy[dayIndex].activities.filter(a => a.id !== actId)
    saveGlobalState({ ...itinerary, itineraryDays: daysCopy })
    toast.success("Actividad eliminada")
  }

  const moveActivity = (dayIndex: number, fromIndex: number, toIndex: number) => {
    if (!itinerary || !itinerary.itineraryDays) return
    const daysCopy = [...itinerary.itineraryDays]
    const activities = [...daysCopy[dayIndex].activities]
    
    if (toIndex < 0 || toIndex >= activities.length) return
    
    const [moved] = activities.splice(fromIndex, 1)
    activities.splice(toIndex, 0, moved)
    
    daysCopy[dayIndex].activities = activities
    saveGlobalState({ ...itinerary, itineraryDays: daysCopy })
  }

  const openAddActivity = (dayIndex: number) => {
    setEditingActivityLocation({ dayIndex, actIndex: -1 })
    setEditingActivityData({
      title: "",
      description: "",
      time: "10:00",
      duration: "1h",
      cost: 0,
      type: "activity",
    })
    setIsActivityModalOpen(true)
  }

  const openEditActivity = (dayIndex: number, actIndex: number, act: Activity) => {
    setEditingActivityLocation({ dayIndex, actIndex })
    setEditingActivityData({ ...act })
    setIsActivityModalOpen(true)
  }

  const addDay = () => {
    if (!itinerary) return;
    const newDays = [...(itinerary.itineraryDays || [])];
    newDays.push({
      day: newDays.length + 1,
      date: `Día ${newDays.length + 1}`,
      activities: []
    });
    saveGlobalState({ ...itinerary, itineraryDays: newDays });
    toast.success("Nuevo día añadido");
  }

  const removeDay = (dayIndex: number) => {
    if (!itinerary || !itinerary.itineraryDays) return;
    const newDays = itinerary.itineraryDays.filter((_, idx) => idx !== dayIndex);
    // Re-index remaining days
    const reindexedDays = newDays.map((d, idx) => ({
      ...d,
      day: idx + 1,
      date: d.date.startsWith("Día ") ? `Día ${idx + 1}` : d.date // Try to re-label if default format
    }));
    saveGlobalState({ ...itinerary, itineraryDays: reindexedDays });
    toast.success("Día eliminado");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Itinerario no encontrado</h1>
            <Button className="mt-4" onClick={() => router.push("/itinerarios")}>
              Volver a mis itinerarios
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Button variant="ghost" onClick={() => router.push("/itinerarios")} className="mb-6 -ml-4 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a mis itinerarios
          </Button>

          <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <Label htmlFor="itinerary-name" className="sr-only">Nombre del itinerario</Label>
              <input
                id="itinerary-name"
                type="text"
                value={itinerary.name}
                onChange={(e) => saveGlobalState({ ...itinerary, name: e.target.value })}
                className="w-full bg-transparent text-3xl font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md -ml-2 px-2 py-1 transition-colors hover:bg-muted/50"
              />
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground px-2">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {itinerary.destination}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {itinerary.startDate} - {itinerary.endDate}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {itinerary.itineraryDays?.map((day, dayIndex) => (
              <div key={day.day} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="border-b border-border bg-secondary/50 px-5 py-3 flex justify-between items-center group">
                  <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <input 
                      type="text" 
                      value={day.date}
                      onChange={(e) => {
                        const newDays = [...(itinerary.itineraryDays || [])];
                        newDays[dayIndex].date = e.target.value;
                        saveGlobalState({ ...itinerary, itineraryDays: newDays });
                      }}
                      className="bg-transparent border-none p-0 focus:ring-0 font-semibold w-full max-w-[200px]"
                      aria-label={`Fecha para día ${day.day}`}
                    />
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100" 
                    onClick={() => removeDay(dayIndex)}
                    aria-label={`Eliminar día ${day.day}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar día
                  </Button>
                </div>
                <ul className="space-y-3 p-5">
                  {day.activities.map((activity, actIndex) => {
                    const Icon = activityIcons[activity.type] || Camera
                    return (
                      <li key={activity.id} className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm">
                        <div className="mt-1 flex flex-col items-center gap-1">
                          <button
                            type="button"
                            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-30"
                            aria-label={`Mover actividad ${activity.title} hacia arriba`}
                            disabled={actIndex === 0}
                            onClick={() => moveActivity(dayIndex, actIndex, actIndex - 1)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-30"
                            aria-label={`Mover actividad ${activity.title} hacia abajo`}
                            disabled={actIndex === day.activities.length - 1}
                            onClick={() => moveActivity(dayIndex, actIndex, actIndex + 1)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-foreground">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9" 
                                aria-label={`Editar ${activity.title}`} 
                                onClick={() => openEditActivity(dayIndex, actIndex, activity)}
                              >
                                <Edit2 className="h-4 w-4" aria-hidden="true" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                aria-label={`Eliminar ${activity.title}`} 
                                onClick={() => removeActivity(dayIndex, activity.id)}
                              >
                                <X className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {activity.time} · {activity.duration}
                            </span>
                            {activity.cost > 0 && <Badge variant="secondary">${activity.cost}</Badge>}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                  {day.activities.length === 0 && (
                    <li className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                      No hay actividades para este día.
                    </li>
                  )}
                  <li>
                    <Button variant="outline" className="w-full" size="sm" onClick={() => openAddActivity(dayIndex)}>
                      <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Agregar actividad
                    </Button>
                  </li>
                </ul>
              </div>
            ))}
            
            <Button variant="outline" className="w-full border-dashed py-8 text-muted-foreground hover:text-foreground" onClick={addDay}>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Agregar un nuevo día al itinerario
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />

      <Dialog open={isActivityModalOpen} onOpenChange={setIsActivityModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingActivityLocation?.actIndex === -1 ? "Nueva Actividad" : "Editar Actividad"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Título</Label>
              <Input
                id="title"
                value={editingActivityData.title || ""}
                onChange={(e) => setEditingActivityData({ ...editingActivityData, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="desc" className="text-right mt-2">Descripción</Label>
              <Textarea
                id="desc"
                value={editingActivityData.description || ""}
                onChange={(e) => setEditingActivityData({ ...editingActivityData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Hora</Label>
              <Input
                id="time"
                type="time"
                value={editingActivityData.time || ""}
                onChange={(e) => setEditingActivityData({ ...editingActivityData, time: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duración</Label>
              <Input
                id="duration"
                placeholder="ej: 1h"
                value={editingActivityData.duration || ""}
                onChange={(e) => setEditingActivityData({ ...editingActivityData, duration: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">Costo ($)</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                value={editingActivityData.cost || 0}
                onChange={(e) => setEditingActivityData({ ...editingActivityData, cost: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Tipo</Label>
              <div className="col-span-3">
                <Select
                  value={editingActivityData.type || "activity"}
                  onValueChange={(val) => setEditingActivityData({ ...editingActivityData, type: val })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Desayuno</SelectItem>
                    <SelectItem value="lunch">Almuerzo</SelectItem>
                    <SelectItem value="dinner">Cena</SelectItem>
                    <SelectItem value="activity">Actividad</SelectItem>
                    <SelectItem value="sightseeing">Turismo</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="transport">Transporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActivityModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveActivity}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
