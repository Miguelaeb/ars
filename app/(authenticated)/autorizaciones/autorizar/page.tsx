"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, ClipboardList, FileText, Search, User, XCircle } from "lucide-react"
import { DbService } from "@/lib/db-service"
import { updateAutorizacionStatus } from "../actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Autorizacion, Afiliado } from "@/lib/types"

export default function AutorizarRechazarPage() {
  const router = useRouter()
  const [autorizaciones, setAutorizaciones] = useState<Autorizacion[]>([])
  const [afiliados, setAfiliados] = useState<Afiliado[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAutorizacion, setSelectedAutorizacion] = useState<Autorizacion | null>(null)
  const [comentarios, setComentarios] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string>("pendiente")
  const [busqueda, setBusqueda] = useState<string>("")
  const [showDialog, setShowDialog] = useState(false)
  const [dialogAction, setDialogAction] = useState<"aprobar" | "rechazar" | null>(null)
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const dbService = DbService.getInstance()
        const autorizacionesData = await dbService.getAutorizaciones()
        const afiliadosData = await dbService.getAfiliados()

        setAutorizaciones(autorizacionesData)
        setAfiliados(afiliadosData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  // Función para obtener el nombre del afiliado por ID
  const getNombreAfiliado = (afiliadoId: string): string => {
    const afiliado = afiliados.find((a) => a.id === afiliadoId)
    return afiliado ? `${afiliado.nombres} ${afiliado.apellidos}` : "Desconocido"
  }

  // Función para obtener el afiliado completo por ID
  const getAfiliado = (afiliadoId: string): Afiliado | undefined => {
    return afiliados.find((a) => a.id === afiliadoId)
  }

  // Función para formatear la fecha
  const formatearFecha = (fechaStr: string): string => {
    try {
      const fecha = new Date(fechaStr)
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (e) {
      return fechaStr
    }
  }

  // Función para obtener el nombre del servicio
  const getNombreServicio = (tipoServicio: string): string => {
    const servicios: Record<string, string> = {
      consulta: "Consulta Médica",
      emergencia: "Emergencia",
      hospitalizacion: "Hospitalización",
      cirugia: "Cirugía",
      laboratorio: "Laboratorio",
      imagen: "Estudios de Imagen",
      medicamentos: "Medicamentos",
    }

    return servicios[tipoServicio] || tipoServicio
  }

  // Función para obtener el color de la insignia según el estado
  const getBadgeVariant = (estado: string): string => {
    switch (estado) {
      case "aprobada":
        return "border-green-500 text-green-600 bg-green-50"
      case "rechazada":
        return "border-red-500 text-red-600 bg-red-50"
      case "pendiente":
      default:
        return "border-yellow-500 text-yellow-600 bg-yellow-50"
    }
  }

  // Filtrar autorizaciones
  const autorizacionesFiltradas = autorizaciones.filter((autorizacion) => {
    // Filtro por estado
    if (filtroEstado !== "todos" && autorizacion.estado !== filtroEstado) {
      return false
    }

    // Filtro por búsqueda (número de autorización o nombre de afiliado)
    if (busqueda) {
      const nombreAfiliado = getNombreAfiliado(autorizacion.afiliadoId).toLowerCase()
      const numeroAutorizacion = autorizacion.numeroAutorizacion.toLowerCase()

      return nombreAfiliado.includes(busqueda.toLowerCase()) || numeroAutorizacion.includes(busqueda.toLowerCase())
    }

    return true
  })

  // Función para seleccionar una autorización
  const handleSelectAutorizacion = (autorizacion: Autorizacion) => {
    setSelectedAutorizacion(autorizacion)
    setComentarios("")
    setActionResult(null)
  }

  // Función para mostrar el diálogo de confirmación
  const handleShowDialog = (action: "aprobar" | "rechazar") => {
    if (!selectedAutorizacion) return
    setDialogAction(action)
    setShowDialog(true)
  }

  // Función para procesar la acción
  const handleAction = async () => {
    if (!selectedAutorizacion || !dialogAction) return

    const formData = new FormData()
    formData.append("id", selectedAutorizacion.id)
    formData.append("estado", dialogAction === "aprobar" ? "aprobada" : "rechazada")
    formData.append("comentarios", comentarios)

    const result = await updateAutorizacionStatus(formData)
    setActionResult(result)
    setShowDialog(false)

    if (result.success) {
      // Actualizar la lista de autorizaciones
      const dbService = DbService.getInstance()
      const autorizacionesData = await dbService.getAutorizaciones()
      setAutorizaciones(autorizacionesData)

      // Actualizar la autorización seleccionada
      const updatedAutorizacion = autorizacionesData.find((a) => a.id === selectedAutorizacion.id)
      setSelectedAutorizacion(updatedAutorizacion || null)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Autorizar / Rechazar Solicitudes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Solicitudes</CardTitle>
            <CardDescription>Gestione las solicitudes de autorización</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filtro-estado">Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger id="filtro-estado">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="aprobada">Aprobada</SelectItem>
                  <SelectItem value="rechazada">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="busqueda">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="busqueda"
                  placeholder="Número o nombre de afiliado"
                  className="pl-8"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Autorización</TableHead>
                    <TableHead>Afiliado</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        Cargando solicitudes...
                      </TableCell>
                    </TableRow>
                  ) : autorizacionesFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No hay solicitudes que coincidan con los filtros
                      </TableCell>
                    </TableRow>
                  ) : (
                    autorizacionesFiltradas.map((autorizacion) => (
                      <TableRow
                        key={autorizacion.id}
                        className={`cursor-pointer ${selectedAutorizacion?.id === autorizacion.id ? "bg-blue-50" : ""}`}
                        onClick={() => handleSelectAutorizacion(autorizacion)}
                      >
                        <TableCell className="font-medium">{autorizacion.numeroAutorizacion}</TableCell>
                        <TableCell>{getNombreAfiliado(autorizacion.afiliadoId)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getBadgeVariant(autorizacion.estado)}>
                            {autorizacion.estado.charAt(0).toUpperCase() + autorizacion.estado.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalles de la Solicitud</CardTitle>
            <CardDescription>
              {selectedAutorizacion
                ? `Autorización ${selectedAutorizacion.numeroAutorizacion}`
                : "Seleccione una solicitud para ver sus detalles"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedAutorizacion ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No hay solicitud seleccionada</h3>
                <p className="text-sm text-gray-400 mt-1">Seleccione una solicitud de la lista para ver sus detalles</p>
              </div>
            ) : (
              <div className="space-y-6">
                {actionResult && (
                  <Alert variant={actionResult.success ? "default" : "destructive"}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{actionResult.success ? "Acción completada" : "Error"}</AlertTitle>
                    <AlertDescription>{actionResult.message}</AlertDescription>
                  </Alert>
                )}

                <Tabs defaultValue="informacion">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="informacion">Información</TabsTrigger>
                    <TabsTrigger value="afiliado">Afiliado</TabsTrigger>
                  </TabsList>
                  <TabsContent value="informacion" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Número de Autorización</h3>
                        <p className="text-base font-medium">{selectedAutorizacion.numeroAutorizacion}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                        <Badge variant="outline" className={getBadgeVariant(selectedAutorizacion.estado)}>
                          {selectedAutorizacion.estado.charAt(0).toUpperCase() + selectedAutorizacion.estado.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Tipo de Servicio</h3>
                        <p className="text-base">{getNombreServicio(selectedAutorizacion.tipoServicio)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Prestador</h3>
                        <p className="text-base">{selectedAutorizacion.prestador}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Médico Tratante</h3>
                        <p className="text-base">{selectedAutorizacion.medicoTratante || "No especificado"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Fecha de Servicio</h3>
                        <p className="text-base">{formatearFecha(selectedAutorizacion.fechaServicio)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Monto Estimado</h3>
                        <p className="text-base">RD$ {selectedAutorizacion.montoEstimado.toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Urgencia</h3>
                        <Badge
                          variant="outline"
                          className={
                            selectedAutorizacion.urgencia === "emergencia"
                              ? "border-red-500 text-red-600 bg-red-50"
                              : selectedAutorizacion.urgencia === "urgente"
                                ? "border-orange-500 text-orange-600 bg-orange-50"
                                : "border-blue-500 text-blue-600 bg-blue-50"
                          }
                        >
                          {selectedAutorizacion.urgencia.charAt(0).toUpperCase() +
                            selectedAutorizacion.urgencia.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                      <p className="text-base mt-1 p-3 bg-gray-50 rounded-md">{selectedAutorizacion.descripcion}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Porcentaje de Cobertura</h3>
                        <p className="text-base">{selectedAutorizacion.porcentajeCobertura}%</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Copago</h3>
                        <p className="text-base">RD$ {selectedAutorizacion.copago.toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Monto Máximo</h3>
                        <p className="text-base">RD$ {selectedAutorizacion.montoMaximo.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Documentos Adjuntos</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        {selectedAutorizacion.documentos.indicacionMedica && (
                          <Button variant="outline" className="justify-start">
                            <FileText className="mr-2 h-4 w-4" />
                            Indicación Médica
                          </Button>
                        )}
                        {selectedAutorizacion.documentos.resultadosPrevios && (
                          <Button variant="outline" className="justify-start">
                            <FileText className="mr-2 h-4 w-4" />
                            Resultados Previos
                          </Button>
                        )}
                        {selectedAutorizacion.documentos.otrosDocumentos && (
                          <Button variant="outline" className="justify-start">
                            <FileText className="mr-2 h-4 w-4" />
                            Otros Documentos
                          </Button>
                        )}
                        {!selectedAutorizacion.documentos.indicacionMedica &&
                          !selectedAutorizacion.documentos.resultadosPrevios &&
                          !selectedAutorizacion.documentos.otrosDocumentos && (
                            <p className="text-sm text-gray-500">No hay documentos adjuntos</p>
                          )}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="afiliado" className="space-y-4 pt-4">
                    {(() => {
                      const afiliado = getAfiliado(selectedAutorizacion.afiliadoId)
                      if (!afiliado) {
                        return (
                          <div className="flex flex-col items-center justify-center h-[200px] text-center">
                            <User className="h-12 w-12 text-gray-300 mb-2" />
                            <h3 className="text-lg font-medium text-gray-500">Afiliado no encontrado</h3>
                          </div>
                        )
                      }

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-8 w-8 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium">
                                {afiliado.nombres} {afiliado.apellidos}
                              </h3>
                              <p className="text-sm text-gray-500">NSS: {afiliado.nss}</p>
                              <p className="text-sm text-gray-500">Cédula: {afiliado.cedula}</p>
                            </div>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Plan</h3>
                              <p className="text-base">{afiliado.plan}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Tipo de Afiliado</h3>
                              <p className="text-base">{afiliado.tipoAfiliado}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Fecha de Nacimiento</h3>
                              <p className="text-base">{formatearFecha(afiliado.fechaNacimiento)}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Género</h3>
                              <p className="text-base">{afiliado.genero}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                              <p className="text-base">{afiliado.telefono}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Celular</h3>
                              <p className="text-base">{afiliado.celular}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Email</h3>
                              <p className="text-base">{afiliado.email}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Fecha de Afiliación</h3>
                              <p className="text-base">{formatearFecha(afiliado.fechaAfiliacion)}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Coberturas</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {afiliado.coberturaDental && (
                                <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
                                  Dental
                                </Badge>
                              )}
                              {afiliado.coberturaVision && (
                                <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
                                  Visión
                                </Badge>
                              )}
                              {afiliado.coberturaInternacional && (
                                <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
                                  Internacional
                                </Badge>
                              )}
                              {afiliado.coberturaMedicamentos && (
                                <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
                                  Medicamentos
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
          {selectedAutorizacion && (
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="space-y-2 w-full">
                <Label htmlFor="comentarios">Comentarios</Label>
                <Textarea
                  id="comentarios"
                  placeholder="Ingrese comentarios sobre esta autorización..."
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => router.push("/autorizaciones")}>
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleShowDialog("rechazar")}
                    disabled={selectedAutorizacion.estado !== "pendiente"}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rechazar
                  </Button>
                  <Button
                    onClick={() => handleShowDialog("aprobar")}
                    disabled={selectedAutorizacion.estado !== "pendiente"}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Aprobar
                  </Button>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogAction === "aprobar" ? "Aprobar Autorización" : "Rechazar Autorización"}</DialogTitle>
            <DialogDescription>
              {dialogAction === "aprobar"
                ? "¿Está seguro que desea aprobar esta autorización?"
                : "¿Está seguro que desea rechazar esta autorización?"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedAutorizacion && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Número de Autorización</h3>
                  <p className="text-base font-medium">{selectedAutorizacion.numeroAutorizacion}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Afiliado</h3>
                  <p className="text-base">{getNombreAfiliado(selectedAutorizacion.afiliadoId)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Servicio</h3>
                  <p className="text-base">{getNombreServicio(selectedAutorizacion.tipoServicio)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Comentarios</h3>
                  <p className="text-base">{comentarios || "Sin comentarios"}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant={dialogAction === "aprobar" ? "default" : "destructive"}
              onClick={handleAction}
              className={dialogAction === "aprobar" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {dialogAction === "aprobar" ? "Aprobar" : "Rechazar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
