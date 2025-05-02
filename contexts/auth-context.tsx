"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Definir el tipo de rol de usuario
export type UserRole = "admin" | "doctor" | "billing" | "afiliaciones" | "autorizaciones" | "supervisor" | "consulta"

// Definir el tipo de usuario
interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  position?: string
  status: string
}

// Definir el tipo del contexto de autenticación
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
  hasPermission: (module: string, permission?: string) => boolean
}

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor del contexto de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Efecto para cargar el usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulamos una llamada a la API
      // En una implementación real, esto sería una llamada a la API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        document.cookie = "auth=true; path=/; max-age=86400" // Añadir cookie para middleware
        return { success: true, message: "Inicio de sesión exitoso" }
      } else {
        return { success: false, message: data.message || "Credenciales inválidas" }
      }
    } catch (error) {
      console.error("Error during login:", error)
      return { success: false, message: "Error al iniciar sesión" }
    } finally {
      setIsLoading(false)
    }
  }

  // Función para cerrar sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    document.cookie = "auth=; path=/; max-age=0" // Eliminar cookie
    router.push("/login")
  }

  const hasPermission = (module: string, permission?: string): boolean => {
    if (!user) return false

    // Define permissions based on user role
    const rolePermissions: Record<string, Record<string, string[]>> = {
      admin: {
        dashboard: ["view"],
        afiliados: ["view", "create", "edit", "delete"],
        autorizaciones: ["view", "create", "approve", "reject"],
        planes: ["view", "create", "edit", "delete"],
        facturacion: ["view", "create", "validate", "pay"],
        prestadores: ["view", "create", "edit", "delete"],
        reportes: ["view", "export"],
        usuarios: ["view", "create", "edit", "delete", "assign_roles"],
      },
      doctor: {
        dashboard: ["view"],
        afiliados: ["view"],
        autorizaciones: ["view", "create", "approve", "reject"],
        prestadores: ["view"],
      },
      billing: {
        dashboard: ["view"],
        afiliados: ["view"],
        facturacion: ["view", "create", "validate", "pay"],
        reportes: ["view", "export"],
      },
      afiliaciones: {
        dashboard: ["view"],
        afiliados: ["view", "create", "edit"],
        planes: ["view"],
      },
      autorizaciones: {
        dashboard: ["view"],
        afiliados: ["view"],
        autorizaciones: ["view", "create", "approve", "reject"],
        prestadores: ["view"],
      },
      supervisor: {
        dashboard: ["view"],
        afiliados: ["view", "create", "edit"],
        autorizaciones: ["view", "approve", "reject"],
        facturacion: ["view", "validate"],
        reportes: ["view", "export"],
        usuarios: ["view", "create"],
      },
      consulta: {
        dashboard: ["view"],
        afiliados: ["view"],
        autorizaciones: ["view"],
        planes: ["view"],
        prestadores: ["view"],
        reportes: ["view"],
      },
    }

    const userRolePermissions = rolePermissions[user.role] || {}

    // Check if the module exists in the user's role permissions
    if (!userRolePermissions[module]) {
      return false
    }

    // If no specific permission is required, the user has access to the module
    if (!permission) {
      return true
    }

    // Check if the user has the required permission for the module
    return userRolePermissions[module].includes(permission)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>{children}</AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
