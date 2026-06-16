import { mockResenas } from "@/lib/guia-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, MapPin, Globe, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GuiaPerfilPage() {
  const avgRating = mockResenas.length > 0 
    ? mockResenas.reduce((acc, curr) => acc + curr.rating, 0) / mockResenas.length 
    : 0

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información pública y revisa las evaluaciones de los viajeros.</p>
      </div>

      <Tabs defaultValue="informacion" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="informacion">Información General</TabsTrigger>
          <TabsTrigger value="evaluaciones">Mis Evaluaciones</TabsTrigger>
        </TabsList>
        
        {/* PESTAÑA: INFORMACIÓN GENERAL */}
        <TabsContent value="informacion" className="mt-6 space-y-6 max-w-4xl">
          {/* Tarjeta de previsualización de perfil público */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-serif">MG</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h2 className="text-2xl font-bold font-serif">Miguel Guía</h2>
                  <div className="flex items-center justify-center md:justify-start bg-background px-3 py-1 rounded-full text-sm font-medium border border-border shadow-sm">
                    <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                    {avgRating.toFixed(1)} ({mockResenas.length} reseñas)
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> Quito, Ecuador</span>
                  <span className="flex items-center"><Globe className="w-4 h-4 mr-1" /> Español, Inglés</span>
                  <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Guía Verificado</span>
                </div>
                <p className="text-sm mt-2 max-w-2xl">
                  Apasionado por la historia colonial y la naturaleza de mi país. Llevo más de 5 años mostrando los rincones más hermosos de los Andes a viajeros de todo el mundo.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>Actualiza tu información para atraer a más viajeros.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre(s)</Label>
                  <Input id="firstName" defaultValue="Miguel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido(s)</Label>
                  <Input id="lastName" defaultValue="Guía" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono de contacto</Label>
                  <Input id="phone" defaultValue="+593 99 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">Idiomas (separados por coma)</Label>
                  <Input id="languages" defaultValue="Español, Inglés" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía / Acerca de mí</Label>
                <Textarea 
                  id="bio" 
                  defaultValue="Apasionado por la historia colonial y la naturaleza de mi país. Llevo más de 5 años mostrando los rincones más hermosos de los Andes a viajeros de todo el mundo."
                  className="h-32" 
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t border-border pt-6">
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* PESTAÑA: EVALUACIONES */}
        <TabsContent value="evaluaciones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluaciones de Viajeros</CardTitle>
              <CardDescription>Lo que dicen tus clientes sobre tus servicios (Rf7).</CardDescription>
            </CardHeader>
            <CardContent>
              {mockResenas.length > 0 ? (
                <div className="space-y-6">
                  {mockResenas.map((resena) => (
                    <div key={resena.id} className="flex flex-col md:flex-row gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
                      <Avatar className="w-10 h-10 shrink-0">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {resena.travelerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <h4 className="font-semibold">{resena.travelerName}</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(resena.date).toLocaleDateString("es-EC", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-4 h-4 ${star <= resena.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium px-2 py-0.5 bg-muted rounded-full">
                            Tour: {resena.tourName}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/90 mt-2">
                          "{resena.comment}"
                        </p>
                        <Button variant="link" className="px-0 h-auto text-primary text-xs">Responder a esta reseña</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Aún no tienes evaluaciones. Completa algunos tours para empezar a recibir feedback de los viajeros.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
