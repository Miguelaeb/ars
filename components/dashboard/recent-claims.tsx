"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Reclamacion = {
  id: string
  numeroAutorizacion: string
  afiliadoId: string
  tipoServicio: string
  prestador: string
  fechaServicio: string
  montoEstimado: number
  estado: string
  createdAt: string
  afiliado?: {
    nombres: string
    apellidos: string
  }
}

export function RecentClaims() {
  const [reclamaciones, setReclamaciones] = useState<Reclamacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReclamaciones() {
      try {
        const response = await fetch("/api/autorizaciones/recientes")

        if (!response.ok) {
          throw new Error("Error al obtener reclamaciones recientes")
        }

        const data = await response.json()
        setReclamaciones(data)
      } catch (error) {
        console.error("Error fetching recent claims:", error)
        setReclamaciones([])
      } finally {
        setLoading(false)
      }
    }

    fetchReclamaciones()
  }, [])

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  // Función para obtener el color según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprobada":
        return "bg-green-500"
      case "rechazada":
        return "bg-red-500"
      case "pendiente":
      default:
        return "bg-yellow-500"
    }
  }

  // Función para obtener las iniciales del nombre
  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reclamaciones Recientes</CardTitle>
          <CardDescription>Últimas solicitudes de autorización</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4 space-y-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="ml-auto">
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reclamaciones Recientes</CardTitle>
        <CardDescription>Últimas solicitudes de autorización</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {reclamaciones.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No hay reclamaciones recientes</div>
          ) : (
            reclamaciones.map((reclamacion) => (
              <div key={reclamacion.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {reclamacion.afiliado
                      ? getInitials(reclamacion.afiliado.nombres, reclamacion.afiliado.apellidos)
                      : "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {reclamacion.afiliado
                      ? `${reclamacion.afiliado.nombres} ${reclamacion.afiliado.apellidos}`
                      : "Afiliado Desconocido"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reclamacion.tipoServicio} - {reclamacion.prestador}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <div className="flex items-center">
                    <span className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(reclamacion.estado)}`}></span>
                    {formatDate(reclamacion.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
