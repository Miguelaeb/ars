"use client";

import { useEffect, useState } from "react";
import type { Afiliado } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  X,
  FileDown,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";

const [afiliados, setAfiliados] = useState<Afiliado[]>([]);

useEffect(() => {
  const fetchAfiliados = async () => {
    try {
      const res = await fetch("/api/afiliados");
      if (!res.ok) throw new Error("Error al obtener afiliados");
      const data = await res.json();
      setAfiliados(data);
    } catch (error) {
      console.error("Error al cargar afiliados:", error);
    }
  };

  fetchAfiliados();
}, []);

export default function ConsultaAfiliadosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);

  // Filtrar afiliados
  const filteredAfiliados = afiliados.filter((afiliado) => {
    const matchesSearch =
      searchTerm === "" ||
      afiliado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      afiliado.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      afiliado.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado =
      selectedEstado === null || afiliado.estado === selectedEstado;

    const matchesPlan = selectedPlan === null || afiliado.plan === selectedPlan;

    const matchesDate =
      date === undefined ||
      afiliado.fechaAfiliacion === format(date, "dd/MM/yyyy");

    return matchesSearch && matchesEstado && matchesPlan && matchesDate;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAfiliados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAfiliados.length / itemsPerPage);

  // Función para exportar datos
  const exportData = (format: string) => {
    setExportFormat(format);
    // Aquí iría la lógica para exportar los datos en el formato seleccionado
    console.log(`Exportando datos en formato ${format}`);
    // Simular descarga
    setTimeout(() => {
      setExportFormat(null);
    }, 1500);
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEstado(null);
    setSelectedPlan(null);
    setDate(undefined);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Consulta de Afiliados
        </h1>
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
          <CardDescription>
            Utilice los filtros para encontrar afiliados específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre, cédula o ID..."
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
                {(searchTerm || selectedEstado || selectedPlan || date) && (
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
                  <label className="text-sm font-medium mb-1 block">
                    Estado
                  </label>
                  <Select
                    value={selectedEstado || ""}
                    onValueChange={(value) =>
                      setSelectedEstado(value === "" ? null : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Plan</label>
                  <Select
                    value={selectedPlan || ""}
                    onValueChange={(value) =>
                      setSelectedPlan(value === "" ? null : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los planes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los planes</SelectItem>
                      <SelectItem value="Básico">Básico</SelectItem>
                      <SelectItem value="Estándar">Estándar</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Fecha de afiliación
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {date ? (
                          format(date, "dd/MM/yyyy")
                        ) : (
                          <span className="text-muted-foreground">
                            Seleccionar fecha
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Afiliación</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((afiliado) => (
                    <TableRow key={afiliado.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">
                        {afiliado.id}
                      </TableCell>
                      <TableCell>{afiliado.nombre}</TableCell>
                      <TableCell>{afiliado.cedula}</TableCell>
                      <TableCell>{afiliado.plan}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              afiliado.estado === "Activo"
                                ? "border-green-500 text-green-600 bg-green-50"
                                : ""
                            }
                            ${
                              afiliado.estado === "Inactivo"
                                ? "border-red-500 text-red-600 bg-red-50"
                                : ""
                            }
                            ${
                              afiliado.estado === "Pendiente"
                                ? "border-yellow-500 text-yellow-600 bg-yellow-50"
                                : ""
                            }
                          `}
                        >
                          {afiliado.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>{afiliado.fechaAfiliacion}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>{afiliado.telefono}</div>
                          <div className="text-gray-500">{afiliado.email}</div>
                        </div>
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
                              <Link
                                href={`/afiliados/${afiliado.id}`}
                                className="flex w-full"
                              >
                                Ver detalles
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Imprimir carnet</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Desactivar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-24 text-center text-muted-foreground"
                    >
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
                  setItemsPerPage(Number.parseInt(value));
                  setCurrentPage(1);
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
                {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredAfiliados.length)}
              </span>{" "}
              de <span className="font-medium">{filteredAfiliados.length}</span>{" "}
              resultados
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
  );
}
