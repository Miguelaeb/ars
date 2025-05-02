"use client"

import { useState } from "react"
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
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileDown,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { Checkbox } from "@/components/ui/checkbox"

// Datos de ejemplo
const auditoriaData = [
  {
    id: "LOG-2023-0001",
    usuario: {
      id: "USR-001",
      nombre: "María Rodríguez",
      rol: "Administrador",
    },
    accion: "Inicio de sesión",
    modulo: "Autenticación",
    fecha: "12/04/2023",
    hora: "08:32:15",
    ip: "192.168.1.100",
    detalles: "Inicio de sesión exitoso",
    estado: "Exitoso",
  },
  {
    id: "LOG-2023-0002",
    usuario: {
      id: "USR-002",
      nombre: "Juan Pérez",
      rol: "Supervisor",
    },
    accion: "Creación de registro",
    modulo: "Afiliados",
    fecha: "12/04/2023",
    hora: "09:15:22",
    ip: "192.168.1.101",
    detalles: "Creación de nuevo afiliado: AF-10045",
    estado: "Exitoso",
  },
  {
    id: "LOG-2023-0003",
    usuario: {
      id: "USR-003",
      nombre: "Ana Martínez",
      rol: "Operador",
    },
    accion: "Modificación de registro",
    modulo: "Autorizaciones",
    fecha: "12/04/2023",
    hora: "10:05:47",
    ip: "192.168.1.102",
    detalles: "Actualización de autorización: AUT-2023-0542",
    estado: "Exitoso",
  },
  {
    id: "LOG-2023-0004",
    usuario: {
      id: "USR-004",
      nombre: "Carlos Sánchez",
      rol: "Operador",
    },
    accion: "Eliminación de registro",
    modulo: "Reclamaciones",
    fecha: "12/04/2023",
    hora: "11:23:08",
    ip: "192.168.1.103",
    detalles: "Eliminación de reclamación: REC-2023-0123",
    estado: "Fallido",
  },
  {
    id: "LOG-2023-0005",
    usuario: {
      id: "USR-001",
      nombre: "María Rodríguez",
      rol: "Administrador",
    },
    accion: "Generación de reporte",
    modulo: "Reportes",
    fecha: "12/04/2023",
    hora: "13:45:30",
    ip: "192.168.1.100",
    detalles: "Generación de reporte de afiliaciones",
    estado: "Exitoso",
  },
  {
    id: "LOG-2023-0006",
    usuario: {
      id: "USR-005",
      nombre: "Laura Gómez",
      rol: "Supervisor",
    },
    accion: "Aprobación",
    modulo: "Autorizaciones",
    fecha: "12/04/2023",
    hora: "14:12:55",
    ip: "192.168.1.104",
    detalles: "Aprobación de autorización: AUT-2023-0543",
    estado: "Exitoso",
  },
  {
    id: "LOG-2023-0007",
    usuario: {
      id: "USR-006",
      nombre: "Roberto Díaz",
      rol: "Operador",
    },
    accion: "Rechazo",
    modulo: "Autorizaciones",
    fecha: "12/04/2023",
    hora: "15:30:18",
    ip: "192.168.1.105",
    detalles: "Rechazo de autorización: AUT-2023-0544",
    estado: "Exitoso",
  },
  {
    id: "LOG-2023-0008",
    usuario: {
      id: "USR-002",
      nombre: "Juan Pérez",
      rol: "Supervisor",
    },
    accion: "Cierre de sesión",
    modulo: "Autenticación",
    fecha: "12/04/2023",
    hora: "16:45:02",
    ip: "192.168.1.101",
    detalles: "Cierre de sesión manual",
    estado: "Exitoso",
  },
  {
    id: "LOG-2023-0009",
    usuario: {
      id: "USR-007",
      nombre: "Patricia Fernández",
      rol: "Administrador",
    },
    accion: "Creación de usuario",
    modulo: "Usuarios",
    fecha: "12/04/2023",
    hora: "17:20:45",
    ip: "192.168.1.106",
    detalles: "Creación de nuevo usuario: USR-008",
    estado: "Exitoso",
  },
  {
    id: "LOG-2023-0010",
    usuario: {
      id: "USR-001",
      nombre: "María Rodríguez",
      rol: "Administrador",
    },
    accion: "Modificación de permisos",
    modulo: "Usuarios",
    fecha: "12/04/2023",
    hora: "18:05:33",
    ip: "192.168.1.100",
    detalles: "Actualización de permisos para usuario: USR-003",
    estado: "Exitoso",
  },
  {
    id: "LOG-2023-0011",
    usuario: {
      id: "USR-003",
      nombre: "Ana Martínez",
      rol: "Operador",
    },
    accion: "Inicio de sesión",
    modulo: "Autenticación",
    fecha: "13/04/2023",
    hora: "08:15:10",
    ip: "192.168.1.102",
    detalles: "Inicio de sesión exitoso",
    estado: "Exitoso",
  },
  {
    id: "LOG-2023-0012",
    usuario: {
      id: "USR-004",
      nombre: "Carlos Sánchez",
      rol: "Operador",
    },
    accion: "Intento de acceso no autorizado",
    modulo: "Autorizaciones",
    fecha: "13/04/2023",
    hora: "09:30:22",
    ip: "192.168.1.103",
    detalles: "Intento de acceso a módulo sin permisos",
    estado: "Fallido",
  },
]

export default function AuditoriaUsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAccion, setSelectedAccion] = useState<string | null>(null)
  const [selectedModulo, setSelectedModulo] = useState<string | null>(null)
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)
  const [exportFormat, setExportFormat] = useState<string | null>(null)

  // Obtener acciones, módulos y estados únicos para los filtros
  const acciones = [...new Set(auditoriaData.map((log) => log.accion))]
  const modulos = [...new Set(auditoriaData.map((log) => log.modulo))]
  const estados = [...new Set(auditoriaData.map((log) => log.estado))]

  // Filtrar logs de auditoría
  const filteredLogs = auditoriaData.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detalles.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAccion = selectedAccion === null || log.accion === selectedAccion

    const matchesModulo = selectedModulo === null || log.modulo === selectedModulo

    const matchesEstado = selectedEstado === null || log.estado === selectedEstado

    let matchesDateRange = true
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from)
      fromDate.setHours(0, 0, 0, 0)

      const fechaParts = log.fecha.split("/")
      const fechaDate = new Date(
        Number.parseInt(fechaParts[2]),
        Number.parseInt(fechaParts[1]) - 1,
        Number.parseInt(fechaParts[0]),
      )

      if (dateRange.to) {
        const toDate = new Date(dateRange.to)
        toDate.setHours(23, 59, 59, 999)
        matchesDateRange = fechaDate >= fromDate && fechaDate <= toDate
      } else {
        matchesDateRange = fechaDate >= fromDate
      }
    }

    return matchesSearch && matchesAccion && matchesModulo && matchesEstado && matchesDateRange
  })

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)

  // Función para exportar datos
  const exportData = (format: string) => {
    setExportFormat(format)
    // Aquí iría la lógica para exportar los datos en el formato seleccionado
    console.log(`Exportando datos en formato ${format}`)
    // Simular descarga
    setTimeout(() => {
      setExportFormat(null)
    }, 1500)
  }

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedAccion(null)
    setSelectedModulo(null)
    setSelectedEstado(null)
    setDateRange(undefined)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Auditoría de Usuarios</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Formato de exportación</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportData("excel")}>
                <FileText className="mr-2 h-4 w-4 text-green-600" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData("pdf")}>
                <FileDown className="mr-2 h-4 w-4 text-red-600" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData("csv")}>
                <FileText className="mr-2 h-4 w-4 text-blue-600" />
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtros de búsqueda</CardTitle>
          <CardDescription>Utilice los filtros para encontrar registros específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar por ID, usuario o detalles..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-gray-100" : ""}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                {(searchTerm || selectedAccion || selectedModulo || selectedEstado || dateRange) && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Acción</label>
                  <Select
                    value={selectedAccion || ""}
                    onValueChange={(value) => setSelectedAccion(value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las acciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las acciones</SelectItem>
                      {acciones.map((accion) => (
                        <SelectItem key={accion} value={accion}>
                          {accion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Módulo</label>
                  <Select
                    value={selectedModulo || ""}
                    onValueChange={(value) => setSelectedModulo(value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los módulos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los módulos</SelectItem>
                      {modulos.map((modulo) => (
                        <SelectItem key={modulo} value={modulo}>
                          {modulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Estado</label>
                  <Select
                    value={selectedEstado || ""}
                    onValueChange={(value) => setSelectedEstado(value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Rango de fechas</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                            </>
                          ) : (
                            format(dateRange.from, "dd/MM/yyyy")
                          )
                        ) : (
                          <span className="text-muted-foreground">Seleccionar fechas</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{log.usuario.nombre}</div>
                          <div className="text-xs text-gray-500">
                            {log.usuario.rol} ({log.usuario.id})
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{log.accion}</TableCell>
                      <TableCell>{log.modulo}</TableCell>
                      <TableCell>
                        <div>
                          <div>{log.fecha}</div>
                          <div className="text-xs text-gray-500">{log.hora}</div>
                        </div>
                      </TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${log.estado === "Exitoso" ? "border-green-500 text-green-600 bg-green-50" : ""}
                            ${log.estado === "Fallido" ? "border-red-500 text-red-600 bg-red-50" : ""}
                          `}
                        >
                          {log.estado}
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
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileDown className="mr-2 h-4 w-4" />
                              Exportar registro
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Mostrar</p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number.parseInt(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder={itemsPerPage.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">por página</p>
            </div>

            <div className="text-sm text-gray-500">
              Mostrando{" "}
              <span className="font-medium">
                {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLogs.length)}
              </span>{" "}
              de <span className="font-medium">{filteredLogs.length}</span> resultados
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Página anterior</span>
              </Button>
              <div className="text-sm">
                Página {currentPage} de {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Página siguiente</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {exportFormat && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
          <p>Exportando en formato {exportFormat.toUpperCase()}...</p>
        </div>
      )}
    </div>
  )
}
