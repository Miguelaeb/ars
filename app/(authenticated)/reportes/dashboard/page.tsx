"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Download, FileDown, FileText, CalendarIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Datos de ejemplo para afiliaciones
const afiliacionesData = [
  { name: "Ene", afiliaciones: 480, renovaciones: 320 },
  { name: "Feb", afiliaciones: 520, renovaciones: 350 },
  { name: "Mar", afiliaciones: 550, renovaciones: 410 },
  { name: "Abr", afiliaciones: 490, renovaciones: 380 },
  { name: "May", afiliaciones: 470, renovaciones: 400 },
  { name: "Jun", afiliaciones: 510, renovaciones: 390 },
  { name: "Jul", afiliaciones: 530, renovaciones: 430 },
  { name: "Ago", afiliaciones: 490, renovaciones: 410 },
  { name: "Sep", afiliaciones: 500, renovaciones: 420 },
  { name: "Oct", afiliaciones: 520, renovaciones: 450 },
  { name: "Nov", afiliaciones: 540, renovaciones: 470 },
  { name: "Dic", afiliaciones: 560, renovaciones: 490 },
]

// Datos de ejemplo para servicios autorizados
const serviciosAutorizadosData = [
  { name: "Consultas", value: 35 },
  { name: "Laboratorios", value: 25 },
  { name: "Imágenes", value: 20 },
  { name: "Hospitalización", value: 10 },
  { name: "Cirugías", value: 5 },
  { name: "Otros", value: 5 },
]

// Colores para gráficos de pie
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

// Datos de ejemplo para uso por plan
const usoPorPlanData = [
  {
    name: "Ene",
    Básico: 4200,
    Estándar: 6800,
    Premium: 9800,
  },
  {
    name: "Feb",
    Básico: 4500,
    Estándar: 7100,
    Premium: 10200,
  },
  {
    name: "Mar",
    Básico: 4800,
    Estándar: 7500,
    Premium: 11000,
  },
  {
    name: "Abr",
    Básico: 4300,
    Estándar: 7200,
    Premium: 10500,
  },
  {
    name: "May",
    Básico: 4100,
    Estándar: 6900,
    Premium: 10100,
  },
  {
    name: "Jun",
    Básico: 4400,
    Estándar: 7300,
    Premium: 10800,
  },
]

// Datos de ejemplo para reclamaciones
const reclamacionesData = [
  {
    name: "Ene",
    Aprobadas: 680,
    Rechazadas: 120,
    Pendientes: 200,
  },
  {
    name: "Feb",
    Aprobadas: 720,
    Rechazadas: 130,
    Pendientes: 180,
  },
  {
    name: "Mar",
    Aprobadas: 750,
    Rechazadas: 140,
    Pendientes: 160,
  },
  {
    name: "Abr",
    Aprobadas: 790,
    Rechazadas: 150,
    Pendientes: 140,
  },
  {
    name: "May",
    Aprobadas: 670,
    Rechazadas: 110,
    Pendientes: 220,
  },
  {
    name: "Jun",
    Aprobadas: 710,
    Rechazadas: 125,
    Pendientes: 190,
  },
]

// Datos de tabla para afiliaciones por plan
const afiliacionesPorPlanData = [
  {
    id: 1,
    plan: "Básico",
    nuevos: 245,
    renovaciones: 178,
    cancelaciones: 32,
    neto: 213,
    porcentaje: "28%",
  },
  {
    id: 2,
    plan: "Estándar",
    nuevos: 312,
    renovaciones: 256,
    cancelaciones: 45,
    neto: 267,
    porcentaje: "35%",
  },
  {
    id: 3,
    plan: "Premium",
    nuevos: 187,
    renovaciones: 143,
    cancelaciones: 21,
    neto: 166,
    porcentaje: "22%",
  },
  {
    id: 4,
    plan: "Familiar",
    nuevos: 98,
    renovaciones: 76,
    cancelaciones: 12,
    neto: 86,
    porcentaje: "11%",
  },
  {
    id: 5,
    plan: "Senior",
    nuevos: 32,
    renovaciones: 28,
    cancelaciones: 5,
    neto: 27,
    porcentaje: "4%",
  },
]

// Datos de tabla para reclamaciones por proveedor
const reclamacionesPorProveedorData = [
  {
    id: 1,
    proveedor: "Hospital Central",
    total: 345,
    aprobadas: 289,
    rechazadas: 56,
    monto: 1250000,
    porcentaje: "85%",
  },
  {
    id: 2,
    proveedor: "Clínica San José",
    total: 278,
    aprobadas: 245,
    rechazadas: 33,
    monto: 980000,
    porcentaje: "88%",
  },
  {
    id: 3,
    proveedor: "Centro Médico Nacional",
    total: 312,
    aprobadas: 267,
    rechazadas: 45,
    monto: 1120000,
    porcentaje: "86%",
  },
  {
    id: 4,
    proveedor: "Laboratorio Clínico Moderno",
    total: 189,
    aprobadas: 172,
    rechazadas: 17,
    monto: 450000,
    porcentaje: "91%",
  },
  {
    id: 5,
    proveedor: "Centro de Diagnóstico Avanzado",
    total: 156,
    aprobadas: 134,
    rechazadas: 22,
    monto: 680000,
    porcentaje: "86%",
  },
]

export default function ReportesDashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [periodoAfiliaciones, setPeriodoAfiliaciones] = useState("anual")
  const [periodoServicios, setPeriodoServicios] = useState("trimestral")
  const [periodoPlan, setPeriodoPlan] = useState("semestral")
  const [periodoReclamaciones, setPeriodoReclamaciones] = useState("anual")
  const [exportFormat, setExportFormat] = useState<string | null>(null)

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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Reportes y Estadísticas</h1>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
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
                  <span>Filtrar por fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
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

      <Tabs defaultValue="afiliaciones">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="afiliaciones">Afiliaciones</TabsTrigger>
          <TabsTrigger value="servicios">Servicios Autorizados</TabsTrigger>
          <TabsTrigger value="planes">Uso por Plan</TabsTrigger>
          <TabsTrigger value="reclamaciones">Reclamaciones</TabsTrigger>
        </TabsList>

        {/* Contenido de Afiliaciones */}
        <TabsContent value="afiliaciones" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Afiliaciones y Renovaciones</h2>
            <Select value={periodoAfiliaciones} onValueChange={setPeriodoAfiliaciones}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensual">Último mes</SelectItem>
                <SelectItem value="trimestral">Último trimestre</SelectItem>
                <SelectItem value="semestral">Último semestre</SelectItem>
                <SelectItem value="anual">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Afiliaciones por Mes</CardTitle>
                <CardDescription>Nuevas afiliaciones y renovaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={afiliacionesData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="afiliaciones" name="Nuevas Afiliaciones" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="renovaciones" name="Renovaciones" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Afiliaciones por Plan</CardTitle>
                <CardDescription>Distribución de afiliaciones por tipo de plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plan</TableHead>
                        <TableHead>Nuevos</TableHead>
                        <TableHead>Renovaciones</TableHead>
                        <TableHead>Cancelaciones</TableHead>
                        <TableHead>Neto</TableHead>
                        <TableHead>%</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {afiliacionesPorPlanData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.plan}</TableCell>
                          <TableCell>{row.nuevos}</TableCell>
                          <TableCell>{row.renovaciones}</TableCell>
                          <TableCell>{row.cancelaciones}</TableCell>
                          <TableCell>{row.neto}</TableCell>
                          <TableCell>{row.porcentaje}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contenido de Servicios Autorizados */}
        <TabsContent value="servicios" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Servicios Autorizados</h2>
            <Select value={periodoServicios} onValueChange={setPeriodoServicios}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensual">Último mes</SelectItem>
                <SelectItem value="trimestral">Último trimestre</SelectItem>
                <SelectItem value="semestral">Último semestre</SelectItem>
                <SelectItem value="anual">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Tipo de Servicio</CardTitle>
                <CardDescription>Porcentaje de servicios autorizados por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviciosAutorizadosData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {serviciosAutorizadosData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Porcentaje"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Autorizaciones por Proveedor</CardTitle>
                <CardDescription>Principales proveedores por volumen de autorizaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Aprobadas</TableHead>
                        <TableHead>Rechazadas</TableHead>
                        <TableHead>Monto (RD$)</TableHead>
                        <TableHead>% Aprobación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reclamacionesPorProveedorData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.proveedor}</TableCell>
                          <TableCell>{row.total}</TableCell>
                          <TableCell>{row.aprobadas}</TableCell>
                          <TableCell>{row.rechazadas}</TableCell>
                          <TableCell>{row.monto.toLocaleString()}</TableCell>
                          <TableCell>{row.porcentaje}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contenido de Uso por Plan */}
        <TabsContent value="planes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Uso por Plan</h2>
            <Select value={periodoPlan} onValueChange={setPeriodoPlan}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensual">Último mes</SelectItem>
                <SelectItem value="trimestral">Último trimestre</SelectItem>
                <SelectItem value="semestral">Último semestre</SelectItem>
                <SelectItem value="anual">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Consumo Promedio por Plan</CardTitle>
              <CardDescription>Monto promedio de consumo por tipo de plan (RD$)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={usoPorPlanData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`RD$ ${value.toLocaleString()}`, "Monto"]} />
                    <Legend />
                    <Line type="monotone" dataKey="Básico" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Estándar" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Premium" stroke="#ffc658" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Plan Básico</CardTitle>
                <CardDescription>Consumo promedio mensual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">RD$ 4,383</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-500">+2.5%</span> vs. mes anterior
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Plan Estándar</CardTitle>
                <CardDescription>Consumo promedio mensual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">RD$ 7,133</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-500">+3.8%</span> vs. mes anterior
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Plan Premium</CardTitle>
                <CardDescription>Consumo promedio mensual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">RD$ 10,400</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-red-500">-1.2%</span> vs. mes anterior
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contenido de Reclamaciones */}
        <TabsContent value="reclamaciones" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Reclamaciones</h2>
            <Select value={periodoReclamaciones} onValueChange={setPeriodoReclamaciones}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensual">Último mes</SelectItem>
                <SelectItem value="trimestral">Último trimestre</SelectItem>
                <SelectItem value="semestral">Último semestre</SelectItem>
                <SelectItem value="anual">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reclamaciones por Estado</CardTitle>
              <CardDescription>Distribución de reclamaciones por estado y mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reclamacionesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Aprobadas" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Rechazadas" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pendientes" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Reclamaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8,542</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-red-500">+14.2%</span> vs. período anterior
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Aprobadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">6,128</div>
                <p className="text-sm text-muted-foreground mt-1">71.7% del total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rechazadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">1,245</div>
                <p className="text-sm text-muted-foreground mt-1">14.6% del total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tiempo Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.2 días</div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-500">-0.5 días</span> vs. período anterior
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {exportFormat && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
          <p>Exportando en formato {exportFormat.toUpperCase()}...</p>
        </div>
      )}
    </div>
  )
}
