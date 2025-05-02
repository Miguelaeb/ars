"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, UserPlus, Pencil, Trash2, AlertTriangle } from "lucide-react"
import type { Afiliado } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function AfiliadosPage() {
  const [afiliados, setAfiliados] = useState<Afiliado[]>([])
  const [filteredAfiliados, setFilteredAfiliados] = useState<Afiliado[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [affiliateToDelete, setAffiliateToDelete] = useState<Afiliado | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchAfiliados = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/afiliados")
        if (!response.ok) {
          throw new Error("Error al cargar afiliados")
        }
        const data = await response.json()
        setAfiliados(data)
        setFilteredAfiliados(data)
      } catch (error) {
        console.error("Error al cargar afiliados:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los afiliados",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAfiliados()
  }, [toast])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAfiliados(afiliados)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = afiliados.filter(
        (afiliado) =>
          afiliado.nombres?.toLowerCase().includes(term) ||
          afiliado.apellidos?.toLowerCase().includes(term) ||
          afiliado.cedula?.toLowerCase().includes(term) ||
          afiliado.nss?.toLowerCase().includes(term),
      )
      setFilteredAfiliados(filtered)
    }
  }, [searchTerm, afiliados])

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "inactivo":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const handleEditAffiliate = (id: string) => {
    router.push(`/afiliados/editar/${id}`)
  }

  const handleDeleteClick = (afiliado: Afiliado) => {
    setAffiliateToDelete(afiliado)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!affiliateToDelete) return

    try {
      setIsDeleting(true)

      const response = await fetch(`/api/afiliados/${affiliateToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar afiliado")
      }

      // Actualizar el estado local
      const updatedAfiliados = afiliados.filter((a) => a.id !== affiliateToDelete.id)
      setAfiliados(updatedAfiliados)
      setFilteredAfiliados(updatedAfiliados)

      toast({
        title: "Afiliado eliminado",
        description: "El afiliado ha sido eliminado exitosamente",
      })
    } catch (error) {
      console.error("Error al eliminar afiliado:", error)
      toast({
        title: "Error al eliminar",
        description: "Ha ocurrido un error al eliminar el afiliado",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setAffiliateToDelete(null)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Afiliados</h1>
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href="/afiliados/nuevo">
            <UserPlus className="mr-2 h-4 w-4" />
            Registrar Nuevo Afiliado
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Afiliados</CardTitle>
          <CardDescription>Consulte y gestione los afiliados registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nombre, cédula o NSS..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : filteredAfiliados.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              {afiliados.length === 0 ? (
                <>
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No hay afiliados registrados</h3>
                  <p className="text-gray-500 mb-4">Comience registrando un nuevo afiliado en el sistema.</p>
                  <Button asChild className="bg-teal-600 hover:bg-teal-700">
                    <Link href="/afiliados/nuevo">
                      <Plus className="mr-2 h-4 w-4" />
                      Registrar Nuevo Afiliado
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Search className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron resultados</h3>
                  <p className="text-gray-500">
                    No se encontraron afiliados que coincidan con "{searchTerm}". Intente con otro término.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead>NSS</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAfiliados.map((afiliado) => (
                    <TableRow key={afiliado.id}>
                      <TableCell className="font-medium">
                        {afiliado.nombres} {afiliado.apellidos}
                      </TableCell>
                      <TableCell>{afiliado.cedula}</TableCell>
                      <TableCell>{afiliado.nss}</TableCell>
                      <TableCell>
                        {afiliado.plan === "basico"
                          ? "Básico"
                          : afiliado.plan === "estandar"
                            ? "Estándar"
                            : afiliado.plan === "premium"
                              ? "Premium"
                              : afiliado.plan === "empresarial"
                                ? "Empresarial"
                                : afiliado.plan === "senior"
                                  ? "Senior"
                                  : afiliado.plan === "familiar"
                                    ? "Familiar"
                                    : afiliado.plan}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoBadgeColor(afiliado.estado)} variant="outline">
                          {afiliado.estado === "activo"
                            ? "Activo"
                            : afiliado.estado === "inactivo"
                              ? "Inactivo"
                              : afiliado.estado === "pendiente"
                                ? "Pendiente"
                                : afiliado.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/afiliados/${afiliado.id}`}>Ver</Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => handleEditAffiliate(afiliado.id)}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteClick(afiliado)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar al afiliado{" "}
              <span className="font-semibold">
                {affiliateToDelete?.nombres} {affiliateToDelete?.apellidos}
              </span>
              ? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Eliminando...
                </div>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
