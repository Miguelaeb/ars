"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { XCircle } from "lucide-react"

export default function AccesoDenegado() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <XCircle className="h-16 w-16 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">Acceso Denegado</h1>
          <p className="text-gray-600">
            No tienes permisos suficientes para acceder a esta página. Por favor, contacta con el administrador si crees
            que deberías tener acceso.
          </p>
          <div className="mt-4 flex flex-col space-y-2">
            <Button onClick={() => router.push("/")} className="w-full">
              Volver al Dashboard
            </Button>
            {user?.role !== "admin" && (
              <p className="text-sm text-gray-500">
                Tu rol actual es: <span className="font-semibold">{user?.role}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
