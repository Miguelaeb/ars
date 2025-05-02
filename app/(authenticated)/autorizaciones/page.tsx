"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Calendar,
  ClipboardList,
  Clock,
  FileCheck,
  FileX,
  Plus,
  Stethoscope,
  CheckCircle,
} from "lucide-react"
import { DbService } from "@/lib/db-service"
import type { Autorizacion, Afiliado } from "@/lib/types"

export default function AutorizacionesPage() {
  const [autorizaciones, setAutorizaciones] = useState<Autorizacion[]>([])
  const [afiliados, setAfiliados] = useState<Afiliado[]>([])
  const [loading, setLoading] = useState(true)

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

  // Obtener estadísticas
  const totalAutorizaciones = autorizaciones.length
  const autorizacionesPendientes = autorizaciones.filter((a) => a.estado === "pendiente").length
  const autorizacionesAprobadas = autorizaciones.filter((a) => a.estado === "aprobada").length
  const autorizacionesRechazadas = autorizaciones.filter((a) => a.estado === "rechazada").length

  // Obtener autorizaciones recientes (últimas 5)
  const autorizacionesRecientes = [...autorizaciones]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Autorizaciones Médicas</h1>
        <Button asChild>
          <Link href="/autorizaciones/solicitar">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Autorización
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Autorizaciones</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAutorizaciones}</div>
            <p className="text-xs text-gray-500">Autorizaciones registradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autorizacionesPendientes}</div>
            <p className="text-xs text-gray-500">Autorizaciones en espera</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <FileCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autorizacionesAprobadas}</div>
            <p className="text-xs text-gray-500">Autorizaciones aprobadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <FileX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autorizacionesRechazadas}</div>
            <p className="text-xs text-gray-500">Autorizaciones rechazadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Autorizaciones Recientes</CardTitle>
            <CardDescription>Últimas autorizaciones registradas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Cargando autorizaciones...</p>
              </div>
            ) : autorizacionesRecientes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Calendar className="h-10 w-10 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium">No hay autorizaciones</h3>
                <p className="text-sm text-gray-500 mt-1">No se han registrado autorizaciones en el sistema</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Autorización</TableHead>
                      <TableHead>Afiliado</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {autorizacionesRecientes.map((autorizacion) => (
                      <TableRow key={autorizacion.id}>
                        <TableCell className="font-medium">{autorizacion.numeroAutorizacion}</TableCell>
                        <TableCell>{getNombreAfiliado(autorizacion.afiliadoId)}</TableCell>
                        <TableCell>{getNombreServicio(autorizacion.tipoServicio)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getBadgeVariant(autorizacion.estado)}>
                            {autorizacion.estado.charAt(0).toUpperCase() + autorizacion.estado.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/autorizaciones/historial">
                Ver todas las autorizaciones
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Acciones comunes para gestionar autorizaciones</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild className="w-full justify-start">
              <Link href="/autorizaciones/solicitar">
                <Plus className="mr-2 h-4 w-4" />
                Solicitar Nueva Autorización
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/autorizaciones/autorizar">
                <CheckCircle className="mr-2 h-4 w-4" />
                Autorizar / Rechazar Solicitudes
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/autorizaciones/historial">
                <ClipboardList className="mr-2 h-4 w-4" />
                Ver Historial de Autorizaciones
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/autorizaciones/historial?filtroEstado=pendiente">
                <Clock className="mr-2 h-4 w-4" />
                Ver Autorizaciones Pendientes
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/prestadores">
                <Stethoscope className="mr-2 h-4 w-4" />
                Gestionar Prestadores de Servicios
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
