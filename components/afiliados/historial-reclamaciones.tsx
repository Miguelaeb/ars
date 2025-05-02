import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface HistorialReclamacionesProps {
  afiliadoId: string
}

export function HistorialReclamaciones({ afiliadoId }: HistorialReclamacionesProps) {
  // En un caso real, aquí se obtendrían las reclamaciones del afiliado desde una API
  // Por ahora, usamos datos de ejemplo
  const reclamaciones = [
    {
      id: "REC-2023-001",
      fecha: "15/03/2023",
      proveedor: "Hospital General",
      servicio: "Consulta médica",
      monto: "$1,500.00",
      estado: "aprobada",
    },
    {
      id: "REC-2023-002",
      fecha: "22/04/2023",
      proveedor: "Laboratorio Clínico",
      servicio: "Análisis de sangre",
      monto: "$3,200.00",
      estado: "pendiente",
    },
    {
      id: "REC-2023-003",
      fecha: "10/05/2023",
      proveedor: "Centro de Imágenes",
      servicio: "Radiografía",
      monto: "$2,800.00",
      estado: "rechazada",
    },
  ]

  if (reclamaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-gray-100 p-3 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">No hay reclamaciones registradas</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Este afiliado no tiene reclamaciones registradas en el sistema.
        </p>
      </div>
    )
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "aprobada":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "rechazada":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Reclamación</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reclamaciones.map((reclamacion) => (
            <TableRow key={reclamacion.id}>
              <TableCell className="font-medium">{reclamacion.id}</TableCell>
              <TableCell>{reclamacion.fecha}</TableCell>
              <TableCell>{reclamacion.proveedor}</TableCell>
              <TableCell>{reclamacion.servicio}</TableCell>
              <TableCell>{reclamacion.monto}</TableCell>
              <TableCell>
                <Badge className={getEstadoBadgeColor(reclamacion.estado)} variant="outline">
                  {reclamacion.estado === "aprobada"
                    ? "Aprobada"
                    : reclamacion.estado === "rechazada"
                      ? "Rechazada"
                      : reclamacion.estado === "pendiente"
                        ? "Pendiente"
                        : reclamacion.estado}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Ver detalles</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
