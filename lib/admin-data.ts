export type ServiceType = "hotel" | "tour" | "restaurante"
export type ServiceStatus = "activo" | "inactivo" | "agotado"
export type ReservationStatus = "pendiente" | "confirmada" | "rechazada" | "completada"

export interface ProviderService {
  id: string
  name: string
  type: ServiceType
  description: string
  price: number
  priceUnit: string
  location: string
  capacity: number
  available: number
  status: ServiceStatus
  schedule: string
  rating: number
  reviewsCount: number
  image: string
  bookings: number
}

export interface Reservation {
  id: string
  serviceId: string
  serviceName: string
  serviceType: ServiceType
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  guests: number
  amount: number
  status: ReservationStatus
  createdAt: string
  notes?: string
}

export interface Review {
  id: string
  serviceId: string
  serviceName: string
  customerName: string
  rating: number
  comment: string
  date: string
  response?: string
  responseDate?: string
}

export interface AdminNotification {
  id: string
  type: "reserva" | "resena" | "sistema"
  title: string
  message: string
  date: string
  read: boolean
}

export const serviceTypeLabels: Record<ServiceType, string> = {
  hotel: "Hotel",
  tour: "Tour",
  restaurante: "Restaurante",
}

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  rechazada: "Rechazada",
  completada: "Completada",
}

export const services: ProviderService[] = [
  {
    id: "srv-1",
    name: "Hotel Boutique La Casona",
    type: "hotel",
    description:
      "Hotel boutique en el centro histórico de Quito con habitaciones de estilo colonial, desayuno incluido y terraza con vista a la ciudad.",
    price: 89,
    priceUnit: "por noche",
    location: "Quito, Centro Histórico",
    capacity: 24,
    available: 8,
    status: "activo",
    schedule: "Check-in 14:00 / Check-out 12:00",
    rating: 4.8,
    reviewsCount: 142,
    image: "/colonial-boutique-hotel-room-quito.png",
    bookings: 312,
  },
  {
    id: "srv-2",
    name: "Tour Mitad del Mundo",
    type: "tour",
    description:
      "Excursión guiada de medio día a la Mitad del Mundo con transporte, guía bilingüe y entrada al museo etnográfico incluida.",
    price: 45,
    priceUnit: "por persona",
    location: "San Antonio de Pichincha",
    capacity: 15,
    available: 6,
    status: "activo",
    schedule: "Lunes a Domingo, 09:00 y 14:00",
    rating: 4.6,
    reviewsCount: 89,
    image: "/mitad-del-mundo-monument-ecuador-tour.png",
    bookings: 198,
  },
  {
    id: "srv-3",
    name: "Restaurante Sabores del Páramo",
    type: "restaurante",
    description:
      "Cocina ecuatoriana de autor con ingredientes andinos. Menú degustación y opciones vegetarianas en un ambiente acogedor.",
    price: 28,
    priceUnit: "por persona",
    location: "Quito, La Floresta",
    capacity: 40,
    available: 0,
    status: "agotado",
    schedule: "Martes a Domingo, 12:00 - 22:00",
    rating: 4.9,
    reviewsCount: 215,
    image: "/ecuadorian-gourmet-restaurant-andean-cuisine.png",
    bookings: 540,
  },
  {
    id: "srv-4",
    name: "Tour Quilotoa Aventura",
    type: "tour",
    description:
      "Full day a la laguna del Quilotoa con caminata al cráter, almuerzo típico y transporte desde Quito.",
    price: 65,
    priceUnit: "por persona",
    location: "Laguna Quilotoa, Cotopaxi",
    capacity: 12,
    available: 4,
    status: "activo",
    schedule: "Lunes, Miércoles, Viernes, 06:00",
    rating: 4.7,
    reviewsCount: 67,
    image: "/quilotoa-crater-lake-ecuador-hiking.png",
    bookings: 124,
  },
  {
    id: "srv-5",
    name: "Hostería Valle Encantado",
    type: "hotel",
    description:
      "Hostería campestre en Mindo con cabañas privadas, piscina natural y actividades de observación de aves.",
    price: 72,
    priceUnit: "por noche",
    location: "Mindo, Pichincha",
    capacity: 30,
    available: 12,
    status: "inactivo",
    schedule: "Check-in 15:00 / Check-out 11:00",
    rating: 4.5,
    reviewsCount: 53,
    image: "/cloud-forest-eco-lodge-mindo-ecuador.png",
    bookings: 86,
  },
]

export const reservations: Reservation[] = [
  {
    id: "RES-2048",
    serviceId: "srv-1",
    serviceName: "Hotel Boutique La Casona",
    serviceType: "hotel",
    customerName: "María Fernanda López",
    customerEmail: "mafer.lopez@email.com",
    customerPhone: "+593 99 123 4567",
    date: "2026-06-22",
    guests: 2,
    amount: 178,
    status: "pendiente",
    createdAt: "2026-06-16T08:30:00",
    notes: "Solicita habitación en planta baja por movilidad reducida.",
  },
  {
    id: "RES-2047",
    serviceId: "srv-2",
    serviceName: "Tour Mitad del Mundo",
    serviceType: "tour",
    customerName: "Carlos Andrade",
    customerEmail: "candrade@email.com",
    customerPhone: "+593 98 765 4321",
    date: "2026-06-20",
    guests: 4,
    amount: 180,
    status: "pendiente",
    createdAt: "2026-06-16T07:15:00",
  },
  {
    id: "RES-2045",
    serviceId: "srv-3",
    serviceName: "Restaurante Sabores del Páramo",
    serviceType: "restaurante",
    customerName: "Ana Belén Torres",
    customerEmail: "ab.torres@email.com",
    customerPhone: "+593 99 888 7766",
    date: "2026-06-18",
    guests: 6,
    amount: 168,
    status: "confirmada",
    createdAt: "2026-06-15T19:40:00",
  },
  {
    id: "RES-2042",
    serviceId: "srv-4",
    serviceName: "Tour Quilotoa Aventura",
    serviceType: "tour",
    customerName: "Diego Ramírez",
    customerEmail: "dramirez@email.com",
    customerPhone: "+593 97 222 3344",
    date: "2026-06-25",
    guests: 2,
    amount: 130,
    status: "confirmada",
    createdAt: "2026-06-14T11:05:00",
  },
  {
    id: "RES-2038",
    serviceId: "srv-1",
    serviceName: "Hotel Boutique La Casona",
    serviceType: "hotel",
    customerName: "Lucía Mendoza",
    customerEmail: "lmendoza@email.com",
    customerPhone: "+593 96 555 1122",
    date: "2026-06-10",
    guests: 1,
    amount: 89,
    status: "completada",
    createdAt: "2026-06-05T14:20:00",
  },
  {
    id: "RES-2035",
    serviceId: "srv-2",
    serviceName: "Tour Mitad del Mundo",
    serviceType: "tour",
    customerName: "Jorge Vásconez",
    customerEmail: "jvasconez@email.com",
    customerPhone: "+593 99 444 9988",
    date: "2026-06-08",
    guests: 3,
    amount: 135,
    status: "rechazada",
    createdAt: "2026-06-03T09:50:00",
    notes: "No había disponibilidad en la fecha solicitada.",
  },
  {
    id: "RES-2030",
    serviceId: "srv-3",
    serviceName: "Restaurante Sabores del Páramo",
    serviceType: "restaurante",
    customerName: "Paola Espinoza",
    customerEmail: "pespinoza@email.com",
    customerPhone: "+593 98 111 2233",
    date: "2026-06-01",
    guests: 2,
    amount: 56,
    status: "completada",
    createdAt: "2026-05-28T16:10:00",
  },
]

export const reviews: Review[] = [
  {
    id: "rev-1",
    serviceId: "srv-1",
    serviceName: "Hotel Boutique La Casona",
    customerName: "Lucía Mendoza",
    rating: 5,
    comment:
      "Una experiencia maravillosa. La habitación impecable, el desayuno delicioso y la ubicación perfecta para recorrer el centro histórico a pie.",
    date: "2026-06-12",
    response:
      "¡Muchas gracias, Lucía! Nos encanta que hayas disfrutado tu estadía. Te esperamos pronto de nuevo.",
    responseDate: "2026-06-13",
  },
  {
    id: "rev-2",
    serviceId: "srv-2",
    serviceName: "Tour Mitad del Mundo",
    customerName: "Jorge Vásconez",
    rating: 4,
    comment:
      "Muy buen tour y el guía sabía muchísimo. El transporte llegó un poco tarde, pero en general lo recomiendo.",
    date: "2026-06-10",
  },
  {
    id: "rev-3",
    serviceId: "srv-3",
    serviceName: "Restaurante Sabores del Páramo",
    customerName: "Paola Espinoza",
    rating: 5,
    comment:
      "El mejor menú degustación que he probado en Quito. Cada plato es una obra de arte y el servicio excepcional.",
    date: "2026-06-04",
  },
  {
    id: "rev-4",
    serviceId: "srv-4",
    serviceName: "Tour Quilotoa Aventura",
    customerName: "Diego Ramírez",
    rating: 3,
    comment:
      "El paisaje es espectacular pero la caminata de regreso fue muy exigente y no nos avisaron bien. Faltó organización.",
    date: "2026-06-02",
  },
]

export const notifications: AdminNotification[] = [
  {
    id: "ntf-1",
    type: "reserva",
    title: "Nueva solicitud de reserva",
    message: "María Fernanda López solicitó Hotel Boutique La Casona para el 22 jun.",
    date: "2026-06-16T08:30:00",
    read: false,
  },
  {
    id: "ntf-2",
    type: "reserva",
    title: "Nueva solicitud de reserva",
    message: "Carlos Andrade solicitó Tour Mitad del Mundo para 4 personas.",
    date: "2026-06-16T07:15:00",
    read: false,
  },
  {
    id: "ntf-3",
    type: "resena",
    title: "Nueva reseña recibida",
    message: "Jorge Vásconez dejó una reseña de 4 estrellas en Tour Mitad del Mundo.",
    date: "2026-06-10T18:00:00",
    read: false,
  },
  {
    id: "ntf-4",
    type: "sistema",
    title: "Servicio agotado",
    message: "Restaurante Sabores del Páramo no tiene disponibilidad esta semana.",
    date: "2026-06-09T10:00:00",
    read: true,
  },
]

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}
