export type Activity = {
  id: string
  time: string
  title: string
  description: string
  type: "breakfast" | "lunch" | "dinner" | "activity" | "sightseeing" | "hotel" | "transport"
  duration: string
  cost: number
  location?: string
}

export type Day = {
  day: number
  date: string
  activities: Activity[]
}

export type Itinerary = {
  id: number
  name: string
  destination: string
  status: "upcoming" | "draft" | "completed"
  startDate: string
  endDate: string
  days: number
  travelers: number
  image: string
  progress: number
  totalCost: number
  itineraryDays?: Day[] // The detailed day-by-day plan
}

export const initialItineraries: Itinerary[] = [
  {
    id: 1,
    name: "Aventura en Galápagos",
    destination: "Islas Galápagos",
    status: "upcoming",
    startDate: "15 Mar 2024",
    endDate: "22 Mar 2024",
    days: 7,
    travelers: 2,
    image: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=600&h=400&fit=crop",
    progress: 100,
    totalCost: 2890,
    itineraryDays: [
      {
        day: 1,
        date: "15 Mar 2024",
        activities: [
          {
            id: "act_1_1",
            time: "09:00",
            title: "Llegada al Aeropuerto de Baltra",
            description: "Recepción y traslado en bus y ferry hacia la Isla Santa Cruz.",
            type: "transport",
            duration: "2h",
            cost: 20
          },
          {
            id: "act_1_2",
            time: "13:00",
            title: "Almuerzo en Puerto Ayora",
            description: "Almuerzo de mariscos frescos en el centro del pueblo.",
            type: "lunch",
            duration: "1h 30m",
            cost: 25
          },
          {
            id: "act_1_3",
            time: "15:00",
            title: "Visita a la Estación Charles Darwin",
            description: "Observación de tortugas gigantes y centro de crianza.",
            type: "sightseeing",
            duration: "2h",
            cost: 10
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Escape Cultural Quito",
    destination: "Quito Centro Histórico",
    status: "draft",
    startDate: "5 Abr 2024",
    endDate: "8 Abr 2024",
    days: 3,
    travelers: 2,
    image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=600&h=400&fit=crop",
    progress: 60,
    totalCost: 450,
  },
  {
    id: 3,
    name: "Adrenalina en Baños",
    destination: "Baños de Agua Santa",
    status: "completed",
    startDate: "10 Feb 2024",
    endDate: "14 Feb 2024",
    days: 4,
    travelers: 4,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
    progress: 100,
    totalCost: 1200,
  },
]
