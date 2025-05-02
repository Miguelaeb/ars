"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, Users, FileText, Settings, Building2, ClipboardList, ShieldCheck, Home, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Afiliados",
    icon: Users,
    href: "/afiliados",
    color: "text-emerald-500",
  },
  {
    label: "Reclamaciones",
    icon: FileText,
    href: "/reclamaciones",
    color: "text-violet-500",
  },
  {
    label: "Proveedores",
    icon: Building2,
    href: "/proveedores",
    color: "text-pink-500",
  },
  {
    label: "Planes",
    icon: ClipboardList,
    href: "/planes",
    color: "text-orange-500",
  },
  {
    label: "Autorizaciones",
    icon: ShieldCheck,
    href: "/autorizaciones",
    color: "text-blue-500",
  },
  {
    label: "Reportes",
    icon: BarChart3,
    href: "/reportes",
    color: "text-yellow-500",
  },
  {
    label: "Configuración",
    icon: Settings,
    href: "/configuracion",
    color: "text-gray-500",
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="relative border-r bg-white w-64 hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="rounded-full w-8 h-8 bg-teal-600 flex items-center justify-center text-white font-bold">
            VS
          </div>
          <h1 className="text-xl font-bold text-teal-700">VidaSalud ARS</h1>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start", pathname === route.href && "bg-gray-100/60")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
