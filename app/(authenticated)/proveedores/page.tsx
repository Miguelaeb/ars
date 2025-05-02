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

export default function ProveedoresPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Proveedores</h1>
        <Button className="bg-violet-600 hover:bg-violet-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proveedor
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Buscar proveedores..." className="w-full bg-white pl-8" />
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
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell className="font-medium">{proveedor.id}</TableCell>
                  <TableCell>{proveedor.nombre}</TableCell>
                  <TableCell>{proveedor.tipo}</TableCell>
                  <TableCell>{proveedor.direccion}</TableCell>
                  <TableCell>{proveedor.telefono}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`
                        ${proveedor.estado === "Activo" ? "border-green-500 text-green-600 bg-green-50" : ""}
                        ${proveedor.estado === "Inactivo" ? "border-red-500 text-red-600 bg-red-50" : ""}
                        ${proveedor.estado === "Pendiente" ? "border-yellow-500 text-yellow-600 bg-yellow-50" : ""}
                      `}
                    >
                      {proveedor.estado}
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
                          <Link href={`/proveedores/${proveedor.id}`} className="flex w-full">
                            Ver detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
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

const proveedores = [
  {
    id: "PROV-001",
    nombre: "Hospital Central",
    tipo: "Hospital",
    direccion: "Av. Principal #123, Santo Domingo",
    telefono: "(809) 555-1234",
    estado: "Activo",
  },
  {
    id: "PROV-002",
    nombre: "Clínica San José",
    tipo: "Clínica",
    direccion: "Calle Secundaria #45, Santiago",
    telefono: "(809) 555-2345",
    estado: "Activo",
  },
  {
    id: "PROV-003",
    nombre: "Centro Médico Nacional",
    tipo: "Centro Médico",
    direccion: "Av. Constitución #67, Santo Domingo",
    telefono: "(809) 555-3456",
    estado: "Activo",
  },
  {
    id: "PROV-004",
    nombre: "Laboratorio Clínico Moderno",
    tipo: "Laboratorio",
    direccion: "Calle Las Flores #89, La Romana",
    telefono: "(809) 555-4567",
    estado: "Activo",
  },
  {
    id: "PROV-005",
    nombre: "Farmacia Popular",
    tipo: "Farmacia",
    direccion: "Av. Duarte #101, Santo Domingo",
    telefono: "(809) 555-5678",
    estado: "Inactivo",
  },
  {
    id: "PROV-006",
    nombre: "Centro de Diagnóstico Avanzado",
    tipo: "Centro Diagnóstico",
    direccion: "Calle Principal #234, Puerto Plata",
    telefono: "(809) 555-6789",
    estado: "Activo",
  },
  {
    id: "PROV-007",
    nombre: "Centro de Rehabilitación Física",
    tipo: "Centro Rehabilitación",
    direccion: "Av. Las Américas #345, Santo Domingo",
    telefono: "(809) 555-7890",
    estado: "Activo",
  },
  {
    id: "PROV-008",
    nombre: "Clínica Dental Sonrisa",
    tipo: "Clínica Dental",
    direccion: "Calle El Sol #456, Santiago",
    telefono: "(809) 555-8901",
    estado: "Pendiente",
  },
  {
    id: "PROV-009",
    nombre: "Centro Oftalmológico Vista Clara",
    tipo: "Centro Especializado",
    direccion: "Av. Independencia #567, Santo Domingo",
    telefono: "(809) 555-9012",
    estado: "Activo",
  },
  {
    id: "PROV-010",
    nombre: "Clínica Pediátrica Niños Felices",
    tipo: "Clínica Pediátrica",
    direccion: "Calle Las Palmas #678, La Vega",
    telefono: "(809) 555-0123",
    estado: "Activo",
  },
]
