import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { Dependiente } from "@/lib/types"

interface DependientesTableProps {
  dependientes: Dependiente[]
}

export function DependientesTable({ dependientes = [] }: DependientesTableProps) {
  if (dependientes.length === 0) {
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">No hay dependientes registrados</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Este afiliado no tiene dependientes registrados en el sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cédula/ID</TableHead>
            <TableHead>Fecha Nacimiento</TableHead>
            <TableHead>Parentesco</TableHead>
            <TableHead>Género</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dependientes.map((dependiente) => (
            <TableRow key={dependiente.id}>
              <TableCell className="font-medium">
                {dependiente.nombre} {dependiente.apellido}
              </TableCell>
              <TableCell>{dependiente.cedula}</TableCell>
              <TableCell>{dependiente.fechaNacimiento}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {dependiente.parentesco}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{dependiente.genero}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
