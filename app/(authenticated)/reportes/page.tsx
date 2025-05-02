import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, FileText, PieChart, BarChart, TrendingUp } from "lucide-react"
import { AfiliacionesChart } from "@/components/reportes/afiliaciones-chart"
import { ReclamacionesChart } from "@/components/reportes/reclamaciones-chart"
import { ProveedoresChart } from "@/components/reportes/proveedores-chart"
import { IngresosGastosChart } from "@/components/reportes/ingresos-gastos-chart"

export default function ReportesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Reportes y Estadísticas</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Datos
        </Button>
      </div>

      <Tabs defaultValue="afiliaciones">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="afiliaciones">
            <TrendingUp className="mr-2 h-4 w-4" />
            Afiliaciones
          </TabsTrigger>
          <TabsTrigger value="reclamaciones">
            <FileText className="mr-2 h-4 w-4" />
            Reclamaciones
          </TabsTrigger>
          <TabsTrigger value="proveedores">
            <PieChart className="mr-2 h-4 w-4" />
            Proveedores
          </TabsTrigger>
          <TabsTrigger value="financiero">
            <BarChart className="mr-2 h-4 w-4" />
            Financiero
          </TabsTrigger>
        </TabsList>

        <TabsContent value="afiliaciones" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Afiliados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,685</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+2.5%</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nuevos Afiliados (Mes)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">512</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+12.2%</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Retención</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.3%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+1.2%</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Afiliados Inactivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">+0.8%</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Afiliaciones por Mes</CardTitle>
                <CardDescription>Nuevas afiliaciones en los últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <AfiliacionesChart />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribución por Plan</CardTitle>
                <CardDescription>Porcentaje de afiliados por tipo de plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Plan Básico</p>
                          <p className="text-xs text-muted-foreground">32% (7,899)</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-teal-500 mr-2"></div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Plan Estándar</p>
                          <p className="text-xs text-muted-foreground">45% (11,108)</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Plan Premium</p>
                          <p className="text-xs text-muted-foreground">18% (4,443)</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Otros Planes</p>
                          <p className="text-xs text-muted-foreground">5% (1,235)</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div className="h-full bg-blue-500" style={{ width: "32%" }}></div>
                        <div className="h-full bg-teal-500" style={{ width: "45%" }}></div>
                        <div className="h-full bg-purple-500" style={{ width: "18%" }}></div>
                        <div className="h-full bg-amber-500" style={{ width: "5%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reclamaciones" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reclamaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,542</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">+14.2%</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reclamaciones Aprobadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6,128</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">71.7%</span> del total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reclamaciones Rechazadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">14.6%</span> del total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2 días</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-0.5 días</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Reclamaciones por Mes</CardTitle>
                <CardDescription>Volumen de reclamaciones en los últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ReclamacionesChart />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Reclamaciones por Tipo</CardTitle>
                <CardDescription>Distribución por tipo de servicio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Consultas</p>
                          <p className="text-xs text-muted-foreground">35% (2,990)</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-teal-500 mr-2"></div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Medicamentos</p>
                          <p className="text-xs text-muted-foreground">25% (2,136)</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Laboratorios</p>
                          <p className="text-xs text-muted-foreground">20% (1,708)</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Hospitalización</p>
                          <p className="text-xs text-muted-foreground">15% (1,281)</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Emergencias</p>
                          <p className="text-xs text-muted-foreground">5% (427)</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div className="h-full bg-blue-500" style={{ width: "35%" }}></div>
                        <div className="h-full bg-teal-500" style={{ width: "25%" }}></div>
                        <div className="h-full bg-purple-500" style={{ width: "20%" }}></div>
                        <div className="h-full bg-amber-500" style={{ width: "15%" }}></div>
                        <div className="h-full bg-red-500" style={{ width: "5%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proveedores" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+3</span> nuevos este mes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reclamaciones por Proveedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-muted-foreground">Promedio mensual</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monto Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,245</div>
                <p className="text-xs text-muted-foreground">Por reclamación</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2/5</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+0.3</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Proveedores por Tipo</CardTitle>
                <CardDescription>Distribución de proveedores por categoría</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ProveedoresChart />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Proveedores</CardTitle>
                <CardDescription>Por volumen de reclamaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-blue-600 rounded-sm mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Hospital Central</p>
                        <p className="text-xs text-muted-foreground">1,245 reclamaciones</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">$1.2M</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-teal-600 rounded-sm mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Clínica San José</p>
                        <p className="text-xs text-muted-foreground">985 reclamaciones</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">$950K</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-purple-600 rounded-sm mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Centro Médico Nacional</p>
                        <p className="text-xs text-muted-foreground">875 reclamaciones</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">$820K</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-amber-600 rounded-sm mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Laboratorio Clínico Moderno</p>
                        <p className="text-xs text-muted-foreground">745 reclamaciones</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">$650K</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-red-600 rounded-sm mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Centro de Diagnóstico Avanzado</p>
                        <p className="text-xs text-muted-foreground">685 reclamaciones</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">$580K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financiero" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1.2M</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+8.1%</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$850K</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">+12.3%</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Margen Operativo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">29.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">-2.5%</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Costo por Afiliado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$34.43</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">+$1.20</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-1 mt-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Ingresos vs Gastos</CardTitle>
                <CardDescription>Análisis financiero de los últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <IngresosGastosChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
