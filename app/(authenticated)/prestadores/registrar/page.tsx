"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, CheckCircle2, Star } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

const especialidades = [
  { id: "medicina-general", label: "Medicina General" },
  { id: "pediatria", label: "Pediatría" },
  { id: "ginecologia", label: "Ginecología y Obstetricia" },
  { id: "cardiologia", label: "Cardiología" },
  { id: "neurologia", label: "Neurología" },
  { id: "traumatologia", label: "Traumatología" },
  { id: "oftalmologia", label: "Oftalmología" },
  { id: "dermatologia", label: "Dermatología" },
  { id: "psiquiatria", label: "Psiquiatría" },
  { id: "odontologia", label: "Odontología" },
  { id: "laboratorio", label: "Laboratorio Clínico" },
  { id: "imagenes", label: "Imágenes Diagnósticas" },
]

export default function RegistrarPrestadorPage() {
  const { toast } = useToast()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedEspecialidades, setSelectedEspecialidades] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [rating, setRating] = useState<{ [key: string]: number }>({
    calidad: 0,
    tiempoRespuesta: 0,
    instalaciones: 0,
    atencionCliente: 0,
    tecnologia: 0,
  })

  const toggleEspecialidad = (id: string) => {
    setSelectedEspecialidades((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleRatingChange = (category: string, value: number) => {
    setRating((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    // Validar campos obligatorios
    if (!document.getElementById("nombre")?.getAttribute("value")) {
      errors.nombre = "El nombre es obligatorio"
    }

    if (!document.getElementById("rnc")?.getAttribute("value")) {
      errors.rnc = "El RNC es obligatorio"
    }

    if (!document.getElementById("direccion")?.getAttribute("value")) {
      errors.direccion = "La dirección es obligatoria"
    }

    // Validar que se haya seleccionado al menos una especialidad
    if (selectedEspecialidades.length === 0) {
      errors.especialidades = "Debe seleccionar al menos una especialidad"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setShowConfirmation(true)
    } else {
      toast({
        title: "Error de validación",
        description: "Por favor, corrija los errores en el formulario",
        variant: "destructive",
      })
    }
  }

  const confirmSubmit = () => {
    // Aquí iría la lógica para enviar los datos al servidor
    setFormSubmitted(true)
    setShowConfirmation(false)

    toast({
      title: "Prestador registrado",
      description: "El prestador ha sido registrado exitosamente",
    })
  }

  // Componente para mostrar estrellas de calificación
  const RatingStars = ({ category, value }: { category: string; value: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            className={`text-2xl ${star <= value ? "text-yellow-500" : "text-gray-300"}`}
          >
            <Star
              className={`h-6 w-6 ${star <= value ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200"}`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/prestadores">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Registrar Prestador</h1>
        </div>
      </div>

      {formSubmitted ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Prestador registrado</AlertTitle>
          <AlertDescription>
            El prestador ha sido registrado correctamente en el sistema.
            <div className="mt-4">
              <Button asChild>
                <Link href="/prestadores">Ver listado de prestadores</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="informacion" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl">
              <TabsTrigger value="informacion">Información General</TabsTrigger>
              <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
              <TabsTrigger value="evaluacion">Evaluación</TabsTrigger>
            </TabsList>

            <TabsContent value="informacion" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                  <CardDescription>Ingrese la información general del prestador</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">
                        Nombre <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombre"
                        placeholder="Nombre del prestador"
                        className={validationErrors.nombre ? "border-red-500" : ""}
                      />
                      {validationErrors.nombre && <p className="text-red-500 text-sm">{validationErrors.nombre}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo">
                        Tipo de Prestador <span className="text-red-500">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hospital">Hospital</SelectItem>
                          <SelectItem value="clinica">Clínica</SelectItem>
                          <SelectItem value="centro-medico">Centro Médico</SelectItem>
                          <SelectItem value="laboratorio">Laboratorio</SelectItem>
                          <SelectItem value="farmacia">Farmacia</SelectItem>
                          <SelectItem value="centro-diagnostico">Centro de Diagnóstico</SelectItem>
                          <SelectItem value="centro-rehabilitacion">Centro de Rehabilitación</SelectItem>
                          <SelectItem value="consultorio">Consultorio Médico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rnc">
                        RNC <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="rnc"
                        placeholder="Registro Nacional del Contribuyente"
                        className={validationErrors.rnc ? "border-red-500" : ""}
                      />
                      {validationErrors.rnc && <p className="text-red-500 text-sm">{validationErrors.rnc}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licencia">Número de Licencia</Label>
                      <Input id="licencia" placeholder="Número de licencia sanitaria" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="direccion">
                        Dirección <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="direccion"
                        placeholder="Dirección completa"
                        className={validationErrors.direccion ? "border-red-500" : ""}
                      />
                      {validationErrors.direccion && (
                        <p className="text-red-500 text-sm">{validationErrors.direccion}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provincia">
                        Provincia <span className="text-red-500">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la provincia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="santo-domingo">Santo Domingo</SelectItem>
                          <SelectItem value="santiago">Santiago</SelectItem>
                          <SelectItem value="la-vega">La Vega</SelectItem>
                          <SelectItem value="puerto-plata">Puerto Plata</SelectItem>
                          <SelectItem value="san-cristobal">San Cristóbal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="municipio">
                        Municipio <span className="text-red-500">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el municipio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="distrito-nacional">Distrito Nacional</SelectItem>
                          <SelectItem value="santo-domingo-este">Santo Domingo Este</SelectItem>
                          <SelectItem value="santo-domingo-norte">Santo Domingo Norte</SelectItem>
                          <SelectItem value="santo-domingo-oeste">Santo Domingo Oeste</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">
                        Teléfono <span className="text-red-500">*</span>
                      </Label>
                      <Input id="telefono" placeholder="(000) 000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sitio-web">Sitio Web</Label>
                      <Input id="sitio-web" placeholder="www.ejemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="horario">Horario de Atención</Label>
                      <Input id="horario" placeholder="Ej: Lunes a Viernes 8:00 AM - 5:00 PM" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="contacto-principal">Contacto Principal</Label>
                      <Input id="contacto-principal" placeholder="Nombre del contacto principal" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea id="descripcion" placeholder="Descripción del prestador" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="especialidades" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Especialidades y Servicios</CardTitle>
                  <CardDescription>Seleccione las especialidades y servicios que ofrece el prestador</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label>
                      Especialidades <span className="text-red-500">*</span>
                    </Label>
                    {validationErrors.especialidades && (
                      <p className="text-red-500 text-sm">{validationErrors.especialidades}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      {especialidades.map((especialidad) => (
                        <div key={especialidad.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`esp-${especialidad.id}`}
                            checked={selectedEspecialidades.includes(especialidad.id)}
                            onCheckedChange={() => toggleEspecialidad(especialidad.id)}
                          />
                          <Label htmlFor={`esp-${especialidad.id}`}>{especialidad.label}</Label>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <Label>Servicios Adicionales</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="servicio-emergencia" />
                          <Label htmlFor="servicio-emergencia">Emergencias 24 horas</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="servicio-ambulancia" />
                          <Label htmlFor="servicio-ambulancia">Servicio de Ambulancia</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="servicio-uci" />
                          <Label htmlFor="servicio-uci">Unidad de Cuidados Intensivos</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="servicio-farmacia" />
                          <Label htmlFor="servicio-farmacia">Farmacia Interna</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="servicio-laboratorio" />
                          <Label htmlFor="servicio-laboratorio">Laboratorio Clínico</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="servicio-imagenes" />
                          <Label htmlFor="servicio-imagenes">Imágenes Diagnósticas</Label>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-2">
                      <Label htmlFor="servicios-adicionales">Otros Servicios</Label>
                      <Textarea
                        id="servicios-adicionales"
                        placeholder="Describa otros servicios que ofrece el prestador"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evaluacion" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Evaluación del Prestador</CardTitle>
                  <CardDescription>Evalúe la calidad y servicios del prestador</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label>Calificación Inicial</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div className="space-y-2">
                          <Label htmlFor="rating-calidad">Calidad de Servicio</Label>
                          <RatingStars category="calidad" value={rating.calidad} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rating-tiempo">Tiempo de Respuesta</Label>
                          <RatingStars category="tiempoRespuesta" value={rating.tiempoRespuesta} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rating-instalaciones">Instalaciones</Label>
                          <RatingStars category="instalaciones" value={rating.instalaciones} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rating-atencion">Atención al Cliente</Label>
                          <RatingStars category="atencionCliente" value={rating.atencionCliente} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rating-tecnologia">Tecnología y Equipamiento</Label>
                          <RatingStars category="tecnologia" value={rating.tecnologia} />
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <Label>Documentación</Label>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="doc-licencia">Licencia Sanitaria</Label>
                          <Input id="doc-licencia" type="file" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="doc-certificaciones">Certificaciones</Label>
                          <Input id="doc-certificaciones" type="file" multiple className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="doc-acreditaciones">Acreditaciones</Label>
                          <Input id="doc-acreditaciones" type="file" multiple className="mt-1" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comentarios-evaluacion">Comentarios de Evaluación</Label>
                      <Textarea
                        id="comentarios-evaluacion"
                        placeholder="Ingrese comentarios sobre la evaluación del prestador"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" asChild>
                    <Link href="/prestadores">Cancelar</Link>
                  </Button>
                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                    <Save className="mr-2 h-4 w-4" />
                    Registrar Prestador
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      )}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar registro</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea registrar este prestador con la información proporcionada?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSubmit} className="bg-pink-600 hover:bg-pink-700">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
