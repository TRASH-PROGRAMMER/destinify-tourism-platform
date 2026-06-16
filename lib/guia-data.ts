export type Tour = {
  id: string
  title: string
  status: "activo" | "borrador" | "inactivo"
  price: number
  duration: string
  capacity: number
  booked: number
}

export type Reserva = {
  id: string
  tourName: string
  tourId: string
  travelerName: string
  date: string
  status: "confirmada" | "pendiente" | "cancelada"
  travelersCount: number
  amount: number
}

export type Mensaje = {
  id: string
  travelerName: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

export type Resena = {
  id: string
  travelerName: string
  tourName: string
  rating: number
  comment: string
  date: string
}

export const mockTours: Tour[] = [
  {
    id: "t1",
    title: "City Tour Histórico Quito",
    status: "activo",
    price: 45,
    duration: "4 horas",
    capacity: 10,
    booked: 8,
  },
  {
    id: "t2",
    title: "Aventura Cotopaxi",
    status: "activo",
    price: 80,
    duration: "Día completo",
    capacity: 6,
    booked: 2,
  },
  {
    id: "t3",
    title: "Ruta del Cacao",
    status: "borrador",
    price: 35,
    duration: "3 horas",
    capacity: 15,
    booked: 0,
  },
]

export const mockReservas: Reserva[] = [
  {
    id: "r1",
    tourName: "City Tour Histórico Quito",
    tourId: "t1",
    travelerName: "Ana Silva",
    date: "2026-06-20T09:00:00",
    status: "confirmada",
    travelersCount: 2,
    amount: 90,
  },
  {
    id: "r2",
    tourName: "Aventura Cotopaxi",
    tourId: "t2",
    travelerName: "Carlos Gómez",
    date: "2026-06-22T07:00:00",
    status: "pendiente",
    travelersCount: 1,
    amount: 80,
  },
  {
    id: "r3",
    tourName: "City Tour Histórico Quito",
    tourId: "t1",
    travelerName: "María López",
    date: "2026-06-19T09:00:00",
    status: "cancelada",
    travelersCount: 3,
    amount: 135,
  },
]

export const mockMensajes: Mensaje[] = [
  {
    id: "m1",
    travelerName: "Ana Silva",
    lastMessage: "¿Nos encontramos en la Plaza Grande?",
    timestamp: "Hace 10 min",
    unread: true,
  },
  {
    id: "m2",
    travelerName: "Carlos Gómez",
    lastMessage: "Gracias por la información.",
    timestamp: "Ayer",
    unread: false,
  },
]

export const mockResenas: Resena[] = [
  {
    id: "rev1",
    travelerName: "Juan Pérez",
    tourName: "City Tour Histórico Quito",
    rating: 5,
    comment: "Excelente guía, muy conocedor de la historia.",
    date: "2026-06-10",
  },
  {
    id: "rev2",
    travelerName: "Luisa Méndez",
    tourName: "Aventura Cotopaxi",
    rating: 4,
    comment: "Muy buena experiencia, aunque el clima no ayudó mucho.",
    date: "2026-06-05",
  },
]
