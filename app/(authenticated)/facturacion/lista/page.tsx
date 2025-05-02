"use client"

import { useState, useEffect } from "react"
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
  CreditCard,
  Download,
  Eye,
  FileDown,
  FileText,
  Filter,
  MoreHorizontal,
  Printer,
  Search,
  X,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { DbService } from "@/lib/db-service"
import type { Factura } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

// Tipo extendido para facturas con información adicional
interface FacturaExtendida extends Factura {
  proveedor: {
    id: string
    nombre: string
  }
  usuario?: string
}

export default function ListaFacturasPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null)
  const [selectedProveedor, setSelectedProveedor] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)
  const [exportFormat, setExportFormat] = useState<string | null>(null)
  const [facturas, setFacturas] = useState<FacturaExtendida[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar facturas al montar el componente
  useEffect(() => {
    const cargarFacturas = async () => {
      setLoading(true)
      try {
        const dbService = DbService.getInstance()
        const facturasData = await dbService.getFacturas()

        // Transformar las facturas para incluir información del proveedor
        const facturasExtendidas: FacturaExtendida[] = facturasData.map((factura) => {
          // En un sistema real, obtendríamos el nombre del proveedor de otra tabla
          // Por ahora, usamos el ID como nombre para simplificar
          return {
            ...factura,
            proveedor: {
              id: factura.prestadorId,
              nombre: factura.prestadorId, // En un sistema real, esto sería el nombre real
            },
            // Convertir el estado de snake_case a formato legible
            estado: formatearEstado(factura.estado),
          }
        })

        // Ordenar por fecha de creación (más reciente primero)
        facturasExtendidas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        setFacturas(facturasExtendidas)
      } catch (error) {
        console.error("Error al cargar facturas:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las facturas",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    cargarFacturas()
  }, [toast])

  // Función para formatear el estado de la factura
  const formatearEstado = (estado: string): string => {
    const formatoEstado: Record<string, string> = {
      pendiente: "Pendiente",
      pagada: "Pagada",
      pago_parcial: "Pago Parcial",
      rechazada: "Rechazada",
      en_revision: "En Revisión",
    }
    return formatoEstado[estado] || estado
  }

  // Obtener proveedores únicos para el filtro
  const proveedores = [...new Set(facturas.map((factura) => factura.proveedor.nombre))]

  // Filtrar facturas
  const filteredFacturas = facturas.filter((factura) => {
    const matchesSearch =
      searchTerm === "" ||
      factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEstado = selectedEstado === null || factura.estado === selectedEstado

    const matchesProveedor = selectedProveedor === null || factura.proveedor.nombre === selectedProveedor

    let matchesDateRange = true
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from)
      fromDate.setHours(0, 0, 0, 0)

      // Convertir la fecha de emisión al formato Date
      const emisionDate = new Date(factura.fechaEmision)

      if (dateRange.to) {
        const toDate = new Date(dateRange.to)
        toDate.setHours(23, 59, 59, 999)
        matchesDateRange = emisionDate >= fromDate && emisionDate <= toDate
      } else {
        matchesDateRange = emisionDate >= fromDate
      }
    }

    return matchesSearch && matchesEstado && matchesProveedor && matchesDateRange
  })

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredFacturas.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredFacturas.length / itemsPerPage)

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
    setSelectedEstado(null)
    setSelectedProveedor(null)
    setDateRange(undefined)
  }

  // Función para calcular el porcentaje de pago
  const calcularPorcentajePago = (montoPagado: number, montoTotal: number) => {
    return (montoPagado / montoTotal) * 100
  }

  // Función para formatear la fecha
  const formatearFecha = (fechaStr: string): string => {
    try {
      const fecha = new Date(fechaStr)
      return fecha.toLocaleDateString("es-DO")
    } catch (error) {
      return fechaStr
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Facturas y Estado de Pago</h1>
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
          <CardDescription>Utilice los filtros para encontrar facturas específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar por ID, número de factura o proveedor..."
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
                {(searchTerm || selectedEstado || selectedProveedor || dateRange) && (
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
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
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="Pagada">Pagada</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Pago Parcial">Pago Parcial</SelectItem>
                      <SelectItem value="Rechazada">Rechazada</SelectItem>
                      <SelectItem value="En Revisión">En Revisión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Proveedor</label>
                  <Select
                    value={selectedProveedor || ""}
                    onValueChange={(value) => setSelectedProveedor(value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los proveedores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los proveedores</SelectItem>
                      {proveedores.map((proveedor) => (
                        <SelectItem key={proveedor} value={proveedor}>
                          {proveedor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Rango de fechas de emisión</label>
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Cargando facturas...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Número Factura</TableHead>
                    <TableHead>Fecha Emisión</TableHead>
                    <TableHead>Monto Total</TableHead>
                    <TableHead>Estado de Pago</TableHead>
                    <TableHead>Fecha Pago</TableHead>
                    <TableHead>Método Pago</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((factura) => (
                      <TableRow key={factura.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">{factura.id}</TableCell>
                        <TableCell>
                          <div>
                            <div>{factura.proveedor.nombre}</div>
                            <div className="text-xs text-gray-500">{factura.proveedor.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{factura.numeroFactura}</TableCell>
                        <TableCell>{formatearFecha(factura.fechaEmision)}</TableCell>
                        <TableCell>
                          RD${" "}
                          {factura.montoTotal.toLocaleString("es-DO", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant="outline"
                              className={`
                                ${factura.estado === "Pagada" ? "border-green-500 text-green-600 bg-green-50" : ""}
                                ${factura.estado === "Pendiente" ? "border-yellow-500 text-yellow-600 bg-yellow-50" : ""}
                                ${factura.estado === "Pago Parcial" ? "border-blue-500 text-blue-600 bg-blue-50" : ""}
                                ${factura.estado === "Rechazada" ? "border-red-500 text-red-600 bg-red-50" : ""}
                                ${
                                  factura.estado === "En Revisión"
                                    ? "border-purple-500 text-purple-600 bg-purple-50"
                                    : ""
                                }
                              `}
                            >
                              {factura.estado}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={calcularPorcentajePago(factura.montoPagado, factura.montoTotal)}
                                className="h-2"
                              />
                              <span className="text-xs">
                                {Math.round(calcularPorcentajePago(factura.montoPagado, factura.montoTotal))}%
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{factura.fechaPago ? formatearFecha(factura.fechaPago) : "-"}</TableCell>
                        <TableCell>{factura.metodoPago || "-"}</TableCell>
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
                                <Link href={`/facturacion/${factura.id}`} className="flex w-full">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </Link>
                              </DropdownMenuItem>
                              {factura.estado === "Pendiente" && (
                                <DropdownMenuItem>
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Registrar pago
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimir
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileDown className="mr-2 h-4 w-4" />
                                Descargar PDF
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                        No se encontraron resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && (
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
                  {filteredFacturas.length > 0 ? indexOfFirstItem + 1 : 0}-
                  {Math.min(indexOfLastItem, filteredFacturas.length)}
                </span>{" "}
                de <span className="font-medium">{filteredFacturas.length}</span> resultados
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
                  Página {currentPage} de {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Página siguiente</span>
                </Button>
              </div>
            </div>
          )}
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
