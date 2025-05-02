"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, AlertCircle, FileText, Building, Calendar, DollarSign } from "lucide-react"
import { DbService } from "@/lib/db-service"
import type { Factura } from "@/lib/types"

export default function InvoiceStatusPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("id")
  const [searchResults, setSearchResults] = useState<Factura[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [allFacturas, setAllFacturas] = useState<Factura[]>([])
  const [providers, setProviders] = useState<string[]>([])

  // Load all invoices on component mount
  useEffect(() => {
    const loadFacturas = async () => {
      const dbService = DbService.getInstance()
      const facturas = await dbService.getFacturas()
      setAllFacturas(facturas)

      // Extract unique provider IDs
      const uniqueProviders = Array.from(new Set(facturas.map((f) => f.prestadorId)))
      setProviders(uniqueProviders)
    }

    loadFacturas()
  }, [])

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    try {
      const dbService = DbService.getInstance()
      let results: Factura[] = []

      if (searchType === "id") {
        // Search by invoice ID
        const factura = await dbService.getFacturaById(searchTerm)
        if (factura) {
          results = [factura]
        }
      } else if (searchType === "numero") {
        // Search by invoice number
        const facturas = await dbService.getFacturas()
        results = facturas.filter((f) => f.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()))
      } else if (searchType === "provider") {
        // Search by provider ID
        const facturas = await dbService.getFacturas()
        results = facturas.filter((f) => f.prestadorId === searchTerm)
      }

      setSearchResults(results)
    } catch (error) {
      console.error("Error searching invoices:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const filterByStatus = (facturas: Factura[]) => {
    if (!selectedStatus) return facturas
    return facturas.filter((f) => f.estado === selectedStatus)
  }

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "pagada":
        return "border-green-500 text-green-600 bg-green-50"
      case "pendiente":
        return "border-yellow-500 text-yellow-600 bg-yellow-50"
      case "pago_parcial":
        return "border-blue-500 text-blue-600 bg-blue-50"
      case "rechazada":
        return "border-red-500 text-red-600 bg-red-50"
      case "en_revision":
        return "border-purple-500 text-purple-600 bg-purple-50"
      default:
        return "border-gray-500 text-gray-600 bg-gray-50"
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case "pagada":
        return "Pagada"
      case "pendiente":
        return "Pendiente"
      case "pago_parcial":
        return "Pago Parcial"
      case "rechazada":
        return "Rechazada"
      case "en_revision":
        return "En Revisión"
      default:
        return status
    }
  }

  const calculatePaymentPercentage = (paid: number, total: number) => {
    return (paid / total) * 100
  }

  const displayedResults = filterByStatus(searchResults)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Consulta de Estado de Facturas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Facturas</CardTitle>
          <CardDescription>Consulte el estado de facturas por ID, número de factura o proveedor</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="search">Búsqueda</TabsTrigger>
              <TabsTrigger value="results">
                Resultados {searchResults.length > 0 && `(${displayedResults.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de búsqueda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">ID de Factura</SelectItem>
                        <SelectItem value="numero">Número de Factura</SelectItem>
                        <SelectItem value="provider">Proveedor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-[3]">
                    {searchType === "provider" ? (
                      <Select value={searchTerm} onValueChange={setSearchTerm}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.map((providerId) => (
                            <SelectItem key={providerId} value={providerId}>
                              {providerId}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="text"
                          placeholder={
                            searchType === "id" ? "Ingrese el ID de la factura..." : "Ingrese el número de factura..."
                          }
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchTerm.trim()}
                    className="md:w-auto w-full"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {isSearching ? "Buscando..." : "Buscar"}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">Filtrar por estado:</p>
                  <Select value={selectedStatus || "all"} onValueChange={(value) => setSelectedStatus(value || null)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pagada">Pagada</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="pago_parcial">Pago Parcial</SelectItem>
                      <SelectItem value="rechazada">Rechazada</SelectItem>
                      <SelectItem value="en_revision">En Revisión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasSearched && searchResults.length === 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No se encontraron facturas con los criterios de búsqueda especificados.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="results">
              {displayedResults.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID / Número</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Fecha Emisión</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Progreso de Pago</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedResults.map((factura) => (
                        <TableRow key={factura.id}>
                          <TableCell>
                            <div className="font-medium">{factura.id}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              {factura.numeroFactura}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2 text-gray-500" />
                              {factura.prestadorId}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              {factura.fechaEmision}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium flex items-center">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              {factura.montoTotal.toLocaleString("es-DO", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              Pagado:{" "}
                              {factura.montoPagado.toLocaleString("es-DO", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeStyles(factura.estado)}>
                              {formatStatus(factura.estado)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={calculatePaymentPercentage(factura.montoPagado, factura.montoTotal)}
                                className="h-2 w-[100px]"
                              />
                              <span className="text-xs">
                                {Math.round(calculatePaymentPercentage(factura.montoPagado, factura.montoTotal))}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {hasSearched ? (
                    <p>No se encontraron facturas con los criterios especificados.</p>
                  ) : (
                    <p>Realice una búsqueda para ver resultados.</p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
