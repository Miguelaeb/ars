"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronDown,
  Users,
  Settings,
  Building2,
  ClipboardList,
  ShieldCheck,
  BarChart3,
  Home,
  LogOut,
  CreditCard,
  UserPlus,
  Search,
  UserCheck,
  ArrowRightLeft,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Clock,
  Bell,
  FilePlus,
  FileEdit,
  FileCheck,
  FileX,
  FileSearch,
  Receipt,
  CheckSquare,
  DollarSign,
  FileQuestion,
  FileTextIcon as FileText2,
  FileClock,
  Building,
  ListChecks,
  Star,
  UserX,
  PieChart,
  Map,
  BarChart,
  FileSpreadsheet,
  UserCircle,
  Shield,
  UserCog2,
  UserX2,
  History,
  ChevronLast,
  ChevronFirst,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface MenuItem {
  label: string
  icon: React.ElementType
  href?: string
  color: string
  submenu?: {
    label: string
    icon: React.ElementType
    href: string
  }[]
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Gestión de Afiliados",
    icon: Users,
    color: "text-emerald-500",
    submenu: [
      {
        label: "Registrar Afiliado",
        icon: UserPlus,
        href: "/afiliados/registrar",
      },
      {
        label: "Lista de Afiliados",
        icon: Search,
        href: "/afiliados",
      },
      {
        label: "Agregar Dependientes",
        icon: UserCheck,
        href: "/afiliados/dependientes",
      },
      {
        label: "Transferir desde otra ARS",
        icon: ArrowRightLeft,
        href: "/afiliados/transferir",
      },
    ],
  },
  {
    label: "Autorizaciones Médicas",
    icon: ShieldCheck,
    color: "text-blue-500",
    submenu: [
      {
        label: "Solicitar Autorización",
        icon: ClipboardCheck,
        href: "/autorizaciones/solicitar",
      },
      {
        label: "Validar Cobertura",
        icon: CheckCircle,
        href: "/autorizaciones/validar",
      },
      {
        label: "Autorizar / Rechazar",
        icon: XCircle,
        href: "/autorizaciones",
      },
      {
        label: "Consultar Historial",
        icon: Clock,
        href: "/autorizaciones/historial",
      },
      {
        label: "Notificación a Centros",
        icon: Bell,
        href: "/autorizaciones/notificar",
      },
    ],
  },
  {
    label: "Planes de Salud",
    icon: ClipboardList,
    color: "text-orange-500",
    submenu: [
      {
        label: "Registrar Plan",
        icon: FilePlus,
        href: "/planes/registrar",
      },
      {
        label: "Modificar Beneficios",
        icon: FileEdit,
        href: "/planes/modificar",
      },
      {
        label: "Asignar Plan",
        icon: FileCheck,
        href: "/planes/asignar",
      },
      {
        label: "Eliminar Plan",
        icon: FileX,
        href: "/planes/eliminar",
      },
      {
        label: "Consultar Detalles",
        icon: FileSearch,
        href: "/planes",
      },
    ],
  },
  {
    label: "Facturación y Pagos",
    icon: CreditCard,
    color: "text-purple-500",
    submenu: [
      {
        label: "Registrar Factura",
        icon: Receipt,
        href: "/facturacion/registrar",
      },
      {
        label: "Validar Factura",
        icon: CheckSquare,
        href: "/facturacion/validar",
      },
      {
        label: "Generar Pago",
        icon: DollarSign,
        href: "/facturacion/pagar",
      },
      {
        label: "Consultar Estado",
        icon: FileQuestion,
        href: "/facturacion",
      },
      {
        label: "Emitir Recibo",
        icon: FileText2,
        href: "/facturacion/recibo",
      },
      {
        label: "Registrar Reclamación",
        icon: FileClock,
        href: "/facturacion/reclamacion",
      },
    ],
  },
  {
    label: "Gestión de Prestadores",
    icon: Building2,
    color: "text-pink-500",
    submenu: [
      {
        label: "Registrar Prestador",
        icon: Building,
        href: "/prestadores/registrar",
      },
      {
        label: "Actualizar Información",
        icon: FileEdit,
        href: "/prestadores/actualizar",
      },
      {
        label: "Consultar Lista",
        icon: ListChecks,
        href: "/prestadores",
      },
      {
        label: "Evaluar Prestador",
        icon: Star,
        href: "/prestadores/evaluar",
      },
      {
        label: "Deshabilitar Prestador",
        icon: UserX,
        href: "/prestadores/deshabilitar",
      },
    ],
  },
  {
    label: "Reportes y Estadísticas",
    icon: BarChart3,
    color: "text-yellow-500",
    submenu: [
      {
        label: "Servicios Autorizados",
        icon: PieChart,
        href: "/reportes/autorizaciones",
      },
      {
        label: "Afiliaciones por Zona",
        icon: Map,
        href: "/reportes/afiliaciones",
      },
      {
        label: "Uso por Plan",
        icon: BarChart,
        href: "/reportes/planes",
      },
      {
        label: "Reclamaciones",
        icon: FileSpreadsheet,
        href: "/reportes/reclamaciones",
      },
    ],
  },
  {
    label: "Gestión de Usuarios",
    icon: Settings,
    color: "text-gray-500",
    submenu: [
      {
        label: "Lista de Usuarios",
        icon: Users,
        href: "/usuarios",
      },
      {
        label: "Registrar Usuario",
        icon: UserCircle,
        href: "/usuarios/registrar",
      },
      {
        label: "Asignar Roles",
        icon: Shield,
        href: "/usuarios/roles",
      },
      {
        label: "Actualizar Información",
        icon: UserCog2,
        href: "/usuarios/actualizar",
      },
      {
        label: "Deshabilitar Usuario",
        icon: UserX2,
        href: "/usuarios/deshabilitar",
      },
      {
        label: "Auditoría de Actividades",
        icon: History,
        href: "/usuarios/auditoria",
      },
    ],
  },
]

export default function SidebarMenu() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})

  const toggleMenu = (label: string, event?: React.MouseEvent) => {
    // Detener la propagación para evitar que el clic afecte a otros elementos
    if (event) {
      event.stopPropagation()
    }

    if (collapsed) {
      // En modo colapsado, solo permitimos un menú abierto a la vez
      setOpenMenus((prev) => {
        const isCurrentlyOpen = prev[label]
        // Cerrar todos los menús y abrir solo el actual si no estaba abierto
        return {
          [label]: !isCurrentlyOpen,
        }
      })
    } else {
      // En modo expandido, permitimos múltiples menús abiertos
      setOpenMenus((prev) => ({
        ...prev,
        [label]: !prev[label],
      }))
    }
  }

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
    // Cerrar todos los submenús cuando se colapsa o expande
    setOpenMenus({})
  }

  const handleMouseEnter = (label: string) => {
    if (collapsed) {
      toggleMenu(label)
    }
  }

  const handleMouseLeave = () => {
    if (collapsed) {
      setOpenMenus({})
    }
  }

  return (
    <div
      className={cn(
        "relative border-r bg-white flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className={cn("p-6 flex items-center", collapsed ? "justify-center" : "justify-between")}>
        <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "")}>
          <div className="rounded-full w-8 h-8 bg-teal-600 flex items-center justify-center text-white font-bold">
            VS
          </div>
          {!collapsed && <h1 className="text-xl font-bold text-teal-700">VidaSalud ARS</h1>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={cn("absolute right-2 top-6", collapsed ? "right-1" : "")}
        >
          {collapsed ? <ChevronLast className="h-5 w-5" /> : <ChevronFirst className="h-5 w-5" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {menuItems.map((item) => (
            <div key={item.label} onMouseEnter={() => handleMouseEnter(item.label)} onMouseLeave={handleMouseLeave}>
              {item.submenu ? (
                <Collapsible open={openMenus[item.label]} className="w-full">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        collapsed ? "px-2" : "",
                        pathname.startsWith(item.href || "#") && "bg-gray-100/60",
                      )}
                      onClick={(e) => toggleMenu(item.label, e)}
                    >
                      <item.icon className={cn("h-5 w-5", item.color, collapsed ? "mx-auto" : "mr-3")} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              openMenus[item.label] ? "rotate-180" : "rotate-0",
                            )}
                          />
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent
                    className={cn(
                      collapsed
                        ? "absolute left-full top-0 z-50 ml-1 w-56 rounded-md border bg-white p-1 shadow-md"
                        : "",
                    )}
                  >
                    {item.submenu.map((subItem) => (
                      <Button
                        key={subItem.label}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start",
                          collapsed ? "pl-3" : "pl-9",
                          pathname === subItem.href && "bg-gray-100/60",
                        )}
                        asChild
                      >
                        <Link href={subItem.href}>
                          <subItem.icon className="h-4 w-4 mr-2" />
                          {subItem.label}
                        </Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "px-2" : "",
                    pathname === item.href && "bg-gray-100/60",
                  )}
                  asChild
                >
                  <Link href={item.href || "#"}>
                    <item.icon className={cn("h-5 w-5", item.color, collapsed ? "mx-auto" : "mr-3")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className={cn("p-4 border-t", collapsed ? "flex justify-center" : "")}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
            collapsed ? "px-2" : "",
          )}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
          {!collapsed && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </div>
  )
}
