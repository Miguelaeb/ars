"use client"

import { useState, useRef, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Save, Search, CheckCircle2, AlertCircle, FileSearch } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DbService } from "@/lib/db-service"
import type { Afiliado, Autorizacion } from "@/lib/types"
import { createAutorizacion } from "../actions"

export default function SolicitarAutorizacionPage() {
  const { toast } = useToast()
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [afiliado, setAfiliado] = useState<Afiliado | null>(null)
  const [servicio, setServicio] = useState<string>("")
  const [prestador, setPrestador] = useState<string>("")
  const [medicoTratante, setMedicoTratante] = useState<string>("")
  const [fechaServicio, setFechaServicio] = useState<string>("")
  const [descripcion, setDescripcion] = useState<string>("")
  const [montoEstimado, setMontoEstimado] = useState<string>("")
  const [urgencia, setUrgencia] = useState<string>("normal")
  const [cobertura, setCobertura] = useState<any>(null)
  const [buscandoAfiliado, setBuscandoAfiliado] = useState(false)
  const [validandoCobertura, setValidandoCobertura] = useState(false)
  const [cedulaAfiliado, setCedulaAfiliado] = useState<string>("")
  const [autorizacionCreada, setAutorizacionCreada] = useState<Autorizacion | null>(null)

  // Función para buscar afiliado
  const buscarAfiliado = async () => {
    if (!cedulaAfiliado.trim()) {
      toast({
        title: "Error de validación",
        description: "Debe ingresar una cédula o número de afiliado",
        variant: "destructive",
      })
      return
    }

    setBuscandoAfiliado(true)

    try {
      const dbService = DbService.getInstance()
      const afiliadoEncontrado = await dbService.getAfiliadoByCedula(cedulaAfiliado)

      if (afiliadoEncontrado) {
        setAfiliado(afiliadoEncontrado)
      } else {
        toast({
          title: "Afiliado no encontrado",
          description: "No se encontró ningún afiliado con la cédula o número proporcionado",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al buscar afiliado:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al buscar el afiliado",
        variant: "destructive",
      })
    } finally {
      setBuscandoAfiliado(false)
    }
  }

  // Función para validar cobertura
  const validarCobertura = () => {
    if (!servicio) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un servicio para validar la cobertura",
        variant: "destructive",
      })
      return
    }

    if (!afiliado) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un afiliado para validar la cobertura",
        variant: "destructive",
      })
      return
    }

    setValidandoCobertura(true)

    // Simulamos una validación con un timeout
    setTimeout(() => {
      // Datos simulados de cobertura basados en el plan del afiliado y el servicio
      const plan = afiliado.plan.toLowerCase()

      if (servicio === "consulta") {
        setCobertura({
          porcentaje: plan.includes("premium") ? 90 : 80,
          copago: plan.includes("premium") ? 10 : 20,
          montoMaximo: 2000,
          requiereAutorizacion: false,
          estado: "aprobado",
        })
      } else if (servicio === "hospitalizacion") {
        setCobertura({
          porcentaje: plan.includes("premium") ? 85 : 75,
          copago: plan.includes("premium") ? 15 : 25,
          montoMaximo: 50000,
          requiereAutorizacion: true,
          estado: "pendiente",
        })
      } else if (servicio === "cirugia") {
        setCobertura({
          porcentaje: plan.includes("premium") ? 80 : 70,
          copago: plan.includes("premium") ? 20 : 30,
          montoMaximo: 100000,
          requiereAutorizacion: true,
          estado: "pendiente",
        })
      } else {
        setCobertura({
          porcentaje: plan.includes("premium") ? 70 : 60,
          copago: plan.includes("premium") ? 30 : 40,
          montoMaximo: 5000,
          requiereAutorizacion: true,
          estado: "pendiente",
        })
      }
      setValidandoCobertura(false)
    }, 1500)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log("Formulario enviado - iniciando validaciones")

    if (!afiliado) {
      toast({
        title: "Error de validación",
        description: "Debe buscar y seleccionar un afiliado",
        variant: "destructive",
      })
      return
    }

    if (!servicio) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un servicio",
        variant: "destructive",
      })
      return
    }

    if (!prestador) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un prestador de servicio",
        variant: "destructive",
      })
      return
    }

    if (!fechaServicio) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar una fecha de servicio",
        variant: "destructive",
      })
      return
    }

    if (!descripcion) {
      toast({
        title: "Error de validación",
        description: "Debe proporcionar una descripción del servicio",
        variant: "destructive",
      })
      return
    }

    if (!cobertura) {
      toast({
        title: "Error de validación",
        description: "Debe validar la cobertura antes de continuar",
        variant: "destructive",
      })
      return
    }

    setShowConfirmation(true)
  }

  const confirmSubmit = async () => {
    if (!formRef.current || !afiliado) return

    const formData = new FormData(formRef.current)

    // Agregar datos que no están en el formulario
    formData.append("afiliadoId", afiliado.id)
    formData.append("porcentajeCobertura", cobertura.porcentaje.toString())
    formData.append("copago", cobertura.copago.toString())
    formData.append("montoMaximo", cobertura.montoMaximo.toString())
    formData.append("requiereAutorizacion", cobertura.requiereAutorizacion.toString())

    try {
      const result = await createAutorizacion(formData)

      if (result.success) {
        setFormSubmitted(true)
        setShowConfirmation(false)
        setAutorizacionCreada(result.autorizacion || null)

        toast({
          title: "Autorización solicitada",
          description: result.message,
        })
      } else {
        setShowConfirmation(false)

        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al crear autorización:", error)
      setShowConfirmation(false)

      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud de autorización",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/autorizaciones">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Solicitar Autorización Médica</h1>
        </div>
      </div>

      {formSubmitted ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Solicitud registrada</AlertTitle>
          <AlertDescription>
            La solicitud de autorización ha sido registrada correctamente en el sistema.
            {autorizacionCreada && (
              <p className="mt-2 font-medium">Número de autorización: {autorizacionCreada.numeroAutorizacion}</p>
            )}
            <div className="mt-4">
              <Button asChild>
                <Link href="/autorizaciones">Ver listado de autorizaciones</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Afiliado</CardTitle>
                <CardDescription>Busque y seleccione el afiliado para la autorización</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="buscar-cedula">Cédula / No. Afiliado</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="buscar-cedula"
                        placeholder="Ingrese cédula o número de afiliado"
                        value={cedulaAfiliado}
                        onChange={(e) => setCedulaAfiliado(e.target.value)}
                      />
                      <Button type="button" onClick={buscarAfiliado} disabled={buscandoAfiliado}>
                        {buscandoAfiliado ? "Buscando..." : "Buscar"}
                        <Search className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {afiliado && (
                  <div className="rounded-md border p-4 mt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {afiliado.nombres} {afiliado.apellidos}
                        </h3>
                        <p className="text-sm text-gray-500">Cédula: {afiliado.cedula}</p>
                      </div>
                      <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                        {afiliado.estado}
                      </Badge>
                    </div>
                    <Separator className="my-3" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Plan</p>
                        <p className="text-sm">{afiliado.plan}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fecha Afiliación</p>
                        <p className="text-sm">{afiliado.fechaAfiliacion}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del Servicio</CardTitle>
                <CardDescription>Seleccione el servicio y valide la cobertura</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoServicio">
                      Tipo de Servicio <span className="text-red-500">*</span>
                    </Label>
                    <Select name="tipoServicio" value={servicio} onValueChange={setServicio}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo de servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consulta">Consulta Médica</SelectItem>
                        <SelectItem value="emergencia">Emergencia</SelectItem>
                        <SelectItem value="hospitalizacion">Hospitalización</SelectItem>
                        <SelectItem value="cirugia">Cirugía</SelectItem>
                        <SelectItem value="laboratorio">Laboratorio</SelectItem>
                        <SelectItem value="imagen">Estudios de Imagen</SelectItem>
                        <SelectItem value="medicamentos">Medicamentos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prestador">
                      Prestador de Servicio <span className="text-red-500">*</span>
                    </Label>
                    <Select name="prestador" value={prestador} onValueChange={setPrestador}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el prestador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospital-central">Hospital Central</SelectItem>
                        <SelectItem value="clinica-san-jose">Clínica San José</SelectItem>
                        <SelectItem value="centro-medico-nacional">Centro Médico Nacional</SelectItem>
                        <SelectItem value="laboratorio-clinico">Laboratorio Clínico Moderno</SelectItem>
                        <SelectItem value="centro-diagnostico">Centro de Diagnóstico Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicoTratante">Médico Tratante</Label>
                    <Input
                      id="medicoTratante"
                      name="medicoTratante"
                      placeholder="Nombre del médico tratante"
                      value={medicoTratante}
                      onChange={(e) => setMedicoTratante(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaServicio">
                      Fecha del Servicio <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fechaServicio"
                      name="fechaServicio"
                      type="date"
                      value={fechaServicio}
                      onChange={(e) => setFechaServicio(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descripcion">
                      Descripción del Servicio <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Describa el servicio solicitado"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="montoEstimado">Monto Estimado (RD$)</Label>
                    <Input
                      id="montoEstimado"
                      name="montoEstimado"
                      type="number"
                      placeholder="0.00"
                      value={montoEstimado}
                      onChange={(e) => setMontoEstimado(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Urgencia</Label>
                    <RadioGroup
                      name="urgencia"
                      value={urgencia}
                      onValueChange={setUrgencia}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="urgencia-normal" />
                        <Label htmlFor="urgencia-normal">Normal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="urgente" id="urgencia-urgente" />
                        <Label htmlFor="urgencia-urgente">Urgente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="emergencia" id="urgencia-emergencia" />
                        <Label htmlFor="urgencia-emergencia">Emergencia</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    type="button"
                    onClick={validarCobertura}
                    disabled={!servicio || validandoCobertura || !afiliado}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {validandoCobertura ? "Validando..." : "Validar Cobertura"}
                    <FileSearch className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {cobertura && (
                  <div className="mt-6 rounded-md border p-4">
                    <h3 className="font-medium mb-2">Resultado de Validación de Cobertura</h3>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant="outline"
                        className={
                          cobertura.estado === "aprobado"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-yellow-500 text-yellow-600 bg-yellow-50"
                        }
                      >
                        {cobertura.estado === "aprobado" ? "Aprobado" : "Requiere Autorización"}
                      </Badge>

                      {cobertura.estado === "aprobado" ? (
                        <Alert className="bg-green-50 border-green-200 p-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-600 text-sm">
                            Este servicio está cubierto y no requiere autorización previa.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="bg-yellow-50 border-yellow-200 p-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-600 text-sm">
                            Este servicio requiere autorización previa para ser cubierto.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Porcentaje de Cobertura</p>
                        <p className="text-sm font-bold">{cobertura.porcentaje}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Copago</p>
                        <p className="text-sm font-bold">{cobertura.copago}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Monto Máximo</p>
                        <p className="text-sm font-bold">RD$ {cobertura.montoMaximo.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Requiere Autorización</p>
                        <p className="text-sm font-bold">{cobertura.requiereAutorizacion ? "Sí" : "No"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentación</CardTitle>
                <CardDescription>Adjunte la documentación requerida para la autorización</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="indicacionMedica">
                      Indicación Médica <span className="text-red-500">*</span>
                    </Label>
                    <Input id="indicacionMedica" name="indicacionMedica" type="file" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="resultadosPrevios">Resultados de Estudios Previos</Label>
                    <Input id="resultadosPrevios" name="resultadosPrevios" type="file" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="otrosDocumentos">Otros Documentos</Label>
                    <Input id="otrosDocumentos" name="otrosDocumentos" type="file" className="mt-1" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href="/autorizaciones">Cancelar</Link>
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  Solicitar Autorización
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      )}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar solicitud</DialogTitle>
            <DialogDescription>¿Está seguro que desea enviar esta solicitud de autorización?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSubmit} className="bg-blue-600 hover:bg-blue-700">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
