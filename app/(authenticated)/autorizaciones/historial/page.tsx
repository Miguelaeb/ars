"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, Plus, Search } from "lucide-react"
import { DbService } from "@/lib/db-service"
import type { Autorizacion, Afiliado } from "@/lib/types"

export default function HistorialAutorizacionesPage() {
  const [autorizaciones, setAutorizaciones] = useState<Autorizacion[]>([])
  const [afiliados, setAfiliados] = useState<Afiliado[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [filtroServicio, setFiltroServicio] = useState<string>("todos")
  const [busqueda, setBusqueda] = useState<string>("")

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

    // Filtro por tipo de servicio
    if (filtroServicio !== "todos" && autorizacion.tipoServicio !== filtroServicio) {
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Historial de Autorizaciones</h1>
        <Button asChild>
          <Link href="/autorizaciones/solicitar">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Autorización
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre las autorizaciones por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="filtro-estado">Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger id="filtro-estado">
                  <SelectValue placeholder="Todos los estados" />
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
              <Label htmlFor="filtro-servicio">Tipo de Servicio</Label>
              <Select value={filtroServicio} onValueChange={setFiltroServicio}>
                <SelectTrigger id="filtro-servicio">
                  <SelectValue placeholder="Todos los servicios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los servicios</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Autorizaciones</CardTitle>
          <CardDescription>{autorizacionesFiltradas.length} autorizaciones encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Cargando autorizaciones...</p>
            </div>
          ) : autorizacionesFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <FileText className="h-10 w-10 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">No hay autorizaciones</h3>
              <p className="text-sm text-gray-500 mt-1">
                No se encontraron autorizaciones con los filtros seleccionados
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Autorización</TableHead>
                    <TableHead>Afiliado</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {autorizacionesFiltradas.map((autorizacion) => (
                    <TableRow key={autorizacion.id}>
                      <TableCell className="font-medium">{autorizacion.numeroAutorizacion}</TableCell>
                      <TableCell>{getNombreAfiliado(autorizacion.afiliadoId)}</TableCell>
                      <TableCell>{getNombreServicio(autorizacion.tipoServicio)}</TableCell>
                      <TableCell>{formatearFecha(autorizacion.fechaServicio)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getBadgeVariant(autorizacion.estado)}>
                          {autorizacion.estado.charAt(0).toUpperCase() + autorizacion.estado.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/autorizaciones/${autorizacion.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver detalles</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
