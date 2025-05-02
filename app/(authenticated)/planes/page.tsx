import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PlanesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Planes de Salud</h1>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Plan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {planes.map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <CardHeader className={`py-4 ${plan.colorClass}`}>
              <CardTitle className="text-white">{plan.nombre}</CardTitle>
              <CardDescription className="text-white/80">{plan.descripcion}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="text-3xl font-bold">
                  ${plan.precio} <span className="text-sm font-normal text-muted-foreground">/ mes</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h4 className="text-sm font-medium">Coberturas:</h4>
                <ul className="space-y-2">
                  {plan.coberturas.map((cobertura, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{cobertura.nombre}</span>
                      <span className="font-medium">{cobertura.porcentaje}%</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className={`
                    ${plan.estado === "Activo" ? "border-green-500 text-green-600 bg-green-50" : ""}
                    ${plan.estado === "Inactivo" ? "border-red-500 text-red-600 bg-red-50" : ""}
                  `}
                >
                  {plan.estado}
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const planes = [
  {
    id: "PLAN-001",
    nombre: "Plan Básico",
    descripcion: "Cobertura esencial para necesidades básicas de salud",
    precio: "1,500",
    estado: "Activo",
    colorClass: "bg-blue-600",
    coberturas: [
      { nombre: "Consultas médicas", porcentaje: 70 },
      { nombre: "Hospitalización", porcentaje: 60 },
      { nombre: "Medicamentos", porcentaje: 50 },
      { nombre: "Laboratorios", porcentaje: 70 },
      { nombre: "Emergencias", porcentaje: 80 },
    ],
  },
  {
    id: "PLAN-002",
    nombre: "Plan Estándar",
    descripcion: "Equilibrio perfecto entre cobertura y costo",
    precio: "2,800",
    estado: "Activo",
    colorClass: "bg-teal-600",
    coberturas: [
      { nombre: "Consultas médicas", porcentaje: 80 },
      { nombre: "Hospitalización", porcentaje: 75 },
      { nombre: "Medicamentos", porcentaje: 70 },
      { nombre: "Laboratorios", porcentaje: 80 },
      { nombre: "Emergencias", porcentaje: 90 },
    ],
  },
  {
    id: "PLAN-003",
    nombre: "Plan Premium",
    descripcion: "Máxima cobertura para toda la familia",
    precio: "4,500",
    estado: "Activo",
    colorClass: "bg-purple-600",
    coberturas: [
      { nombre: "Consultas médicas", porcentaje: 90 },
      { nombre: "Hospitalización", porcentaje: 85 },
      { nombre: "Medicamentos", porcentaje: 80 },
      { nombre: "Laboratorios", porcentaje: 90 },
      { nombre: "Emergencias", porcentaje: 100 },
    ],
  },
  {
    id: "PLAN-004",
    nombre: "Plan Empresarial",
    descripcion: "Diseñado para empresas y sus empleados",
    precio: "3,200",
    estado: "Activo",
    colorClass: "bg-emerald-600",
    coberturas: [
      { nombre: "Consultas médicas", porcentaje: 85 },
      { nombre: "Hospitalización", porcentaje: 80 },
      { nombre: "Medicamentos", porcentaje: 75 },
      { nombre: "Laboratorios", porcentaje: 85 },
      { nombre: "Emergencias", porcentaje: 95 },
    ],
  },
  {
    id: "PLAN-005",
    nombre: "Plan Senior",
    descripcion: "Especializado para adultos mayores",
    precio: "3,800",
    estado: "Activo",
    colorClass: "bg-amber-600",
    coberturas: [
      { nombre: "Consultas médicas", porcentaje: 90 },
      { nombre: "Hospitalización", porcentaje: 85 },
      { nombre: "Medicamentos", porcentaje: 85 },
      { nombre: "Laboratorios", porcentaje: 90 },
      { nombre: "Emergencias", porcentaje: 100 },
    ],
  },
  {
    id: "PLAN-006",
    nombre: "Plan Familiar",
    descripcion: "Protección integral para toda la familia",
    precio: "5,200",
    estado: "Activo",
    colorClass: "bg-indigo-600",
    coberturas: [
      { nombre: "Consultas médicas", porcentaje: 90 },
      { nombre: "Hospitalización", porcentaje: 85 },
      { nombre: "Medicamentos", porcentaje: 80 },
      { nombre: "Laboratorios", porcentaje: 90 },
      { nombre: "Emergencias", porcentaje: 100 },
    ],
  },
]
