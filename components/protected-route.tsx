"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: {
    module: string
    permission?: string
  }
}

export default function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { user, isLoading, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }

    if (
      !isLoading &&
      user &&
      requiredPermission &&
      !hasPermission(requiredPermission.module, requiredPermission.permission)
    ) {
      // Redirigir a una página de acceso denegado o al dashboard
      router.push("/acceso-denegado")
    }
  }, [isLoading, user, router, requiredPermission, hasPermission])

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!user) {
    return null
  }

  if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.permission)) {
    return null
  }

  return <>{children}</>
}
