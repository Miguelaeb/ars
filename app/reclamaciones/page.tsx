import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Download, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

export default function ReclamacionesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Reclamaciones</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Reclamación
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Buscar reclamaciones..." className="w-full bg-white pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Afiliado</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reclamaciones.map((reclamacion) => (
                <TableRow key={reclamacion.id}>
                  <TableCell className="font-medium">{reclamacion.id}</TableCell>
                  <TableCell>{reclamacion.afiliado}</TableCell>
                  <TableCell>{reclamacion.proveedor}</TableCell>
                  <TableCell>{reclamacion.servicio}</TableCell>
                  <TableCell>{reclamacion.fecha}</TableCell>
                  <TableCell>{reclamacion.monto}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`
                        ${reclamacion.estado === "Aprobada" ? "border-green-500 text-green-600 bg-green-50" : ""}
                        ${reclamacion.estado === "Pendiente" ? "border-yellow-500 text-yellow-600 bg-yellow-50" : ""}
                        ${reclamacion.estado === "En revisión" ? "border-blue-500 text-blue-600 bg-blue-50" : ""}
                        ${reclamacion.estado === "Rechazada" ? "border-red-500 text-red-600 bg-red-50" : ""}
                      `}
                    >
                      {reclamacion.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link href={`/reclamaciones/${reclamacion.id}`} className="flex w-full">
                            Ver detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Rechazar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando <strong>1</strong> a <strong>10</strong> de <strong>100</strong> resultados
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Página siguiente</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const reclamaciones = [
  {
    id: "REC-2023-0542",
    afiliado: "María Rodríguez",
    proveedor: "Hospital Central",
    servicio: "Consulta médica",
    fecha: "12/04/2023",
    monto: "$1,250.00",
    estado: "Aprobada",
  },
  {
    id: "REC-2023-0541",
    afiliado: "Juan Pérez",
    proveedor: "Clínica San José",
    servicio: "Laboratorios",
    fecha: "12/04/2023",
    monto: "$850.00",
    estado: "Pendiente",
  },
  {
    id: "REC-2023-0540",
    afiliado: "Ana Martínez",
    proveedor: "Centro Médico Nacional",
    servicio: "Hospitalización",
    fecha: "11/04/2023",
    monto: "$3,200.00",
    estado: "En revisión",
  },
  {
    id: "REC-2023-0539",
    afiliado: "Carlos Sánchez",
    proveedor: "Hospital Central",
    servicio: "Emergencia",
    fecha: "11/04/2023",
    monto: "$750.00",
    estado: "Rechazada",
  },
  {
    id: "REC-2023-0538",
    afiliado: "Laura Gómez",
    proveedor: "Clínica San José",
    servicio: "Medicamentos",
    fecha: "10/04/2023",
    monto: "$480.00",
    estado: "Aprobada",
  },
  {
    id: "REC-2023-0537",
    afiliado: "Roberto Díaz",
    proveedor: "Centro Médico Nacional",
    servicio: "Consulta especialista",
    fecha: "10/04/2023",
    monto: "$1,800.00",
    estado: "Pendiente",
  },
  {
    id: "REC-2023-0536",
    afiliado: "Patricia Fernández",
    proveedor: "Hospital Central",
    servicio: "Cirugía",
    fecha: "09/04/2023",
    monto: "$5,500.00",
    estado: "En revisión",
  },
  {
    id: "REC-2023-0535",
    afiliado: "Miguel Torres",
    proveedor: "Clínica San José",
    servicio: "Fisioterapia",
    fecha: "09/04/2023",
    monto: "$950.00",
    estado: "Aprobada",
  },
  {
    id: "REC-2023-0534",
    afiliado: "Sofía Ramírez",
    proveedor: "Centro Médico Nacional",
    servicio: "Radiografía",
    fecha: "08/04/2023",
    monto: "$650.00",
    estado: "Aprobada",
  },
  {
    id: "REC-2023-0533",
    afiliado: "Javier López",
    proveedor: "Hospital Central",
    servicio: "Consulta médica",
    fecha: "08/04/2023",
    monto: "$1,250.00",
    estado: "Rechazada",
  },
]
