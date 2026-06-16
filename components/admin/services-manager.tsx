"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, MapPin, Star, Upload, Hotel, Compass, UtensilsCrossed, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  services as initialServices,
  serviceTypeLabels,
  formatCurrency,
  type ProviderService,
  type ServiceType,
  type ServiceStatus,
} from "@/lib/admin-data"
import { cn } from "@/lib/utils"

const typeIcons: Record<ServiceType, typeof Hotel> = {
  hotel: Hotel,
  tour: Compass,
  restaurante: UtensilsCrossed,
}

const statusStyles: Record<ServiceStatus, string> = {
  activo: "bg-primary/15 text-primary border-primary/30",
  inactivo: "bg-muted text-muted-foreground border-border",
  agotado: "bg-destructive/10 text-destructive border-destructive/30",
}

const statusLabels: Record<ServiceStatus, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  agotado: "Agotado",
}

type FormState = {
  name: string
  type: ServiceType
  description: string
  price: string
  priceUnit: string
  location: string
  capacity: string
  available: string
  schedule: string
  status: ServiceStatus
  image: string
}

const emptyForm: FormState = {
  name: "",
  type: "hotel",
  description: "",
  price: "",
  priceUnit: "por noche",
  location: "",
  capacity: "",
  available: "",
  schedule: "",
  status: "activo",
  image: "",
}

export function ServicesManager() {
  const [services, setServices] = useState<ProviderService[]>(initialServices)
  const [filter, setFilter] = useState<"todos" | ServiceType>("todos")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ProviderService | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deleteTarget, setDeleteTarget] = useState<ProviderService | null>(null)
  const [announce, setAnnounce] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = filter === "todos" ? services : services.filter((s) => s.type === filter)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setDialogOpen(true)
  }

  function openEdit(service: ProviderService) {
    setEditing(service)
    setForm({
      name: service.name,
      type: service.type,
      description: service.description,
      price: String(service.price),
      priceUnit: service.priceUnit,
      location: service.location,
      capacity: String(service.capacity),
      available: String(service.available),
      schedule: service.schedule,
      status: service.status,
      image: service.image,
    })
    setErrors({})
    setDialogOpen(true)
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setForm((f) => ({ ...f, image: url }))
    }
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = "Ingrese el nombre del servicio."
    if (!form.description.trim() || form.description.trim().length < 20)
      next.description = "La descripción debe tener al menos 20 caracteres."
    const price = Number(form.price)
    if (!form.price || Number.isNaN(price) || price <= 0) next.price = "Ingrese un precio válido mayor a 0."
    if (!form.location.trim()) next.location = "Ingrese la ubicación."
    const capacity = Number(form.capacity)
    if (!form.capacity || Number.isNaN(capacity) || capacity <= 0)
      next.capacity = "Ingrese una capacidad válida."
    const available = Number(form.available)
    if (form.available === "" || Number.isNaN(available) || available < 0)
      next.available = "Ingrese la disponibilidad (0 o más)."
    else if (available > capacity) next.available = "La disponibilidad no puede superar la capacidad."
    if (!form.schedule.trim()) next.schedule = "Ingrese el horario."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload: ProviderService = {
      id: editing?.id ?? `srv-${Date.now()}`,
      name: form.name.trim(),
      type: form.type,
      description: form.description.trim(),
      price: Number(form.price),
      priceUnit: form.priceUnit,
      location: form.location.trim(),
      capacity: Number(form.capacity),
      available: Number(form.available),
      status: form.status,
      schedule: form.schedule.trim(),
      rating: editing?.rating ?? 0,
      reviewsCount: editing?.reviewsCount ?? 0,
      image: form.image || "/placeholder.svg?height=200&width=320",
      bookings: editing?.bookings ?? 0,
    }

    if (editing) {
      setServices((prev) => prev.map((s) => (s.id === editing.id ? payload : s)))
      setAnnounce(`Servicio "${payload.name}" actualizado correctamente.`)
    } else {
      setServices((prev) => [payload, ...prev])
      setAnnounce(`Servicio "${payload.name}" creado correctamente.`)
    }
    setDialogOpen(false)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id))
    setAnnounce(`Servicio "${deleteTarget.name}" eliminado.`)
    setDeleteTarget(null)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div aria-live="polite" className="sr-only" role="status">
        {announce}
      </div>

      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground text-balance">Gestión de Servicios</h1>
          <p className="text-sm text-muted-foreground">Crea y administra tus hoteles, tours y restaurantes</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Nuevo servicio
        </Button>
      </header>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
        <TabsList>
          <TabsTrigger value="todos">Todos ({services.length})</TabsTrigger>
          <TabsTrigger value="hotel">Hoteles</TabsTrigger>
          <TabsTrigger value="tour">Tours</TabsTrigger>
          <TabsTrigger value="restaurante">Restaurantes</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No hay servicios en esta categoría.</p>
            <Button variant="outline" onClick={openCreate}>
              Crear servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((service) => {
            const TypeIcon = typeIcons[service.type]
            return (
              <Card key={service.id} className="overflow-hidden">
                <div className="relative h-40 w-full bg-muted">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <Badge
                    variant="outline"
                    className={cn("absolute left-3 top-3 bg-card", statusStyles[service.status])}
                  >
                    {statusLabels[service.status]}
                  </Badge>
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        {serviceTypeLabels[service.type]}
                      </div>
                      <h2 className="truncate font-semibold text-foreground">{service.name}</h2>
                    </div>
                    {service.reviewsCount > 0 && (
                      <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-foreground">
                        <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                        {service.rating}
                      </span>
                    )}
                  </div>

                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{service.location}</span>
                  </p>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <p className="font-bold text-foreground">{formatCurrency(service.price)}</p>
                      <p className="text-xs text-muted-foreground">{service.priceUnit}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">{service.available}</span> disponibles
                      </p>
                      <p>de {service.capacity}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEdit(service)}
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(service)}
                      aria-label={`Eliminar ${service.name}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar servicio" : "Nuevo servicio"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Actualiza la información, precios, horarios y disponibilidad."
                : "Completa los datos del servicio que quieres ofrecer."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Image upload */}
            <div className="space-y-2">
              <Label htmlFor="svc-image">Imagen del servicio</Label>
              <div className="flex items-center gap-3">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                  {form.image ? (
                    <Image src={form.image || "/placeholder.svg"} alt="Vista previa" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <Upload className="h-5 w-5" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    id="svc-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="sr-only"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
                    Subir imagen
                  </Button>
                  <p className="mt-1 text-xs text-muted-foreground">JPG o PNG, máx 5MB.</p>
                </div>
              </div>
            </div>

            <Field id="svc-name" label="Nombre del servicio" error={errors.name} required>
              <Input
                id="svc-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                aria-invalid={!!errors.name}
                placeholder="Ej. Hotel Boutique La Casona"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="svc-type">Tipo de servicio</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm((f) => ({ ...f, type: v as ServiceType }))}
                >
                  <SelectTrigger id="svc-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="tour">Tour</SelectItem>
                    <SelectItem value="restaurante">Restaurante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="svc-status">Estado</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as ServiceStatus }))}
                >
                  <SelectTrigger id="svc-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="agotado">Agotado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Field id="svc-description" label="Descripción" error={errors.description} required>
              <Textarea
                id="svc-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                aria-invalid={!!errors.description}
                rows={3}
                placeholder="Describe tu servicio, lo que incluye y qué lo hace especial."
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="svc-price" label="Precio (USD)" error={errors.price} required>
                <Input
                  id="svc-price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  aria-invalid={!!errors.price}
                  placeholder="89"
                />
              </Field>
              <div className="space-y-2">
                <Label htmlFor="svc-unit">Unidad de precio</Label>
                <Select
                  value={form.priceUnit}
                  onValueChange={(v) => setForm((f) => ({ ...f, priceUnit: v }))}
                >
                  <SelectTrigger id="svc-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="por noche">por noche</SelectItem>
                    <SelectItem value="por persona">por persona</SelectItem>
                    <SelectItem value="por grupo">por grupo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Field id="svc-location" label="Ubicación" error={errors.location} required>
              <Input
                id="svc-location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                aria-invalid={!!errors.location}
                placeholder="Ej. Quito, Centro Histórico"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="svc-capacity" label="Capacidad total" error={errors.capacity} required>
                <Input
                  id="svc-capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                  aria-invalid={!!errors.capacity}
                  placeholder="24"
                />
              </Field>
              <Field id="svc-available" label="Disponibilidad actual" error={errors.available} required>
                <Input
                  id="svc-available"
                  type="number"
                  min="0"
                  value={form.available}
                  onChange={(e) => setForm((f) => ({ ...f, available: e.target.value }))}
                  aria-invalid={!!errors.available}
                  placeholder="8"
                />
              </Field>
            </div>

            <Field id="svc-schedule" label="Horario / disponibilidad" error={errors.schedule} required>
              <Input
                id="svc-schedule"
                value={form.schedule}
                onChange={(e) => setForm((f) => ({ ...f, schedule: e.target.value }))}
                aria-invalid={!!errors.schedule}
                placeholder="Ej. Lunes a Domingo, 09:00 y 14:00"
              />
            </Field>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editing ? "Guardar cambios" : "Crear servicio"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este servicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar <strong>{deleteTarget?.name}</strong>. Esta acción no se puede deshacer y
              cancelará la visibilidad del servicio para los viajeros.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="ml-0.5 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
