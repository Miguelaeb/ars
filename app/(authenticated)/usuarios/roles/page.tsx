"use client"

import type React from "react"
import type { UserRole } from "@/contexts/auth-context"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Save, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getUsers, updateUser } from "@/lib/db-service"

interface RoleDefinition {
  id: UserRole
  label: string
  description: string
  modules: {
    id: string
    name: string
    permissions: string[]
  }[]
}

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  position: string
  status: "active" | "inactive" | "blocked"
  createdAt: string
}

const roles: RoleDefinition[] = [
  {
    id: "admin",
    label: "Administrador",
    description: "Acceso completo al sistema",
    modules: [
      { id: "dashboard", name: "Dashboard", permissions: ["view"] },
      { id: "afiliados", name: "Afiliados", permissions: ["view", "create", "edit", "delete"] },
      { id: "autorizaciones", name: "Autorizaciones", permissions: ["view", "create", "approve", "reject"] },
      { id: "planes", name: "Planes", permissions: ["view", "create", "edit", "delete"] },
      { id: "facturacion", name: "Facturación", permissions: ["view", "create", "validate", "pay"] },
      { id: "prestadores", name: "Prestadores", permissions: ["view", "create", "edit", "delete"] },
      { id: "reportes", name: "Reportes", permissions: ["view", "export"] },
      { id: "usuarios", name: "Usuarios", permissions: ["view", "create", "edit", "delete", "assign_roles"] },
    ],
  },
  {
    id: "doctor",
    label: "Doctor",
    description: "Gestión de autorizaciones médicas",
    modules: [
      { id: "dashboard", name: "Dashboard", permissions: ["view"] },
      { id: "afiliados", name: "Afiliados", permissions: ["view"] },
      { id: "autorizaciones", name: "Autorizaciones", permissions: ["view", "create", "approve", "reject"] },
      { id: "prestadores", name: "Prestadores", permissions: ["view"] },
    ],
  },
  {
    id: "billing",
    label: "Facturación",
    description: "Gestión de facturas y pagos",
    modules: [
      { id: "dashboard", name: "Dashboard", permissions: ["view"] },
      { id: "afiliados", name: "Afiliados", permissions: ["view"] },
      { id: "facturacion", name: "Facturación", permissions: ["view", "create", "validate", "pay"] },
      { id: "reportes", name: "Reportes", permissions: ["view", "export"] },
    ],
  },
  {
    id: "afiliaciones",
    label: "Afiliaciones",
    description: "Gestión de afiliados y dependientes",
    modules: [
      { id: "dashboard", name: "Dashboard", permissions: ["view"] },
      { id: "afiliados", name: "Afiliados", permissions: ["view", "create", "edit"] },
      { id: "planes", name: "Planes", permissions: ["view"] },
    ],
  },
  {
    id: "autorizaciones",
    label: "Autorizaciones",
    description: "Gestión de autorizaciones médicas",
    modules: [
      { id: "dashboard", name: "Dashboard", permissions: ["view"] },
      { id: "afiliados", name: "Afiliados", permissions: ["view"] },
      { id: "autorizaciones", name: "Autorizaciones", permissions: ["view", "create", "approve", "reject"] },
      { id: "prestadores", name: "Prestadores", permissions: ["view"] },
    ],
  },
  {
    id: "supervisor",
    label: "Supervisor",
    description: "Puede aprobar solicitudes y gestionar usuarios",
    modules: [
      { id: "dashboard", name: "Dashboard", permissions: ["view"] },
      { id: "afiliados", name: "Afiliados", permissions: ["view", "create", "edit"] },
      { id: "autorizaciones", name: "Autorizaciones", permissions: ["view", "approve", "reject"] },
      { id: "facturacion", name: "Facturación", permissions: ["view", "validate"] },
      { id: "reportes", name: "Reportes", permissions: ["view", "export"] },
      { id: "usuarios", name: "Usuarios", permissions: ["view", "create"] },
    ],
  },
  {
    id: "consulta",
    label: "Consulta",
    description: "Solo acceso de lectura",
    modules: [
      { id: "dashboard", name: "Dashboard", permissions: ["view"] },
      { id: "afiliados", name: "Afiliados", permissions: ["view"] },
      { id: "autorizaciones", name: "Autorizaciones", permissions: ["view"] },
      { id: "planes", name: "Planes", permissions: ["view"] },
      { id: "prestadores", name: "Prestadores", permissions: ["view"] },
      { id: "reportes", name: "Reportes", permissions: ["view"] },
    ],
  },
]

export default function AsignarRolesPage() {
  const { toast } = useToast()
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [roleUpdated, setRoleUpdated] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const fetchedUsers = await getUsers()
        // Only show active users
        setUsers(fetchedUsers.filter((user) => user.status === "active"))
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios. Intente de nuevo más tarde.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the filter above
  }

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setSelectedRole(user.role)
    setRoleUpdated(false)
  }

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleSaveRole = () => {
    if (!selectedUser || !selectedRole) return
    setShowConfirmation(true)
  }

  const confirmRoleChange = async () => {
    if (!selectedUser || !selectedRole) return

    setIsUpdating(true)
    setShowConfirmation(false)

    try {
      // Update the user's role in the database
      await updateUser(selectedUser.id, { role: selectedRole })

      // Update the local state
      setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, role: selectedRole } : user)))

      setRoleUpdated(true)

      toast({
        title: "Rol actualizado",
        description: `El rol de ${selectedUser.name} ha sido actualizado a ${roles.find((r) => r.id === selectedRole)?.label}`,
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario. Intente de nuevo más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Check if user has permission to assign roles
  if (!hasPermission("usuarios", "assign_roles")) {
    return (
      <div className="flex flex-col gap-5">
        <Alert variant="destructive">
          <AlertTitle>Acceso denegado</AlertTitle>
          <AlertDescription>
            No tiene permisos para asignar roles a usuarios. Contacte al administrador del sistema.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/usuarios">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Asignar Roles</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Usuario</CardTitle>
              <CardDescription>Busque el usuario al que desea asignar un rol</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Buscar por nombre o correo"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 mt-4">
                  <Label>Resultados</Label>
                  <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                      <div className="p-8 flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {searchTerm
                          ? "No se encontraron usuarios que coincidan con la búsqueda"
                          : "No hay usuarios registrados"}
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`p-3 cursor-pointer hover:bg-gray-50 ${
                            selectedUser?.id === user.id ? "bg-gray-100" : ""
                          }`}
                          onClick={() => handleSelectUser(user)}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <Badge variant="outline" className="mt-1">
                                {roles.find((r) => r.id === user.role)?.label || user.role}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedUser ? (
            <Card>
              <CardHeader>
                <CardTitle>Asignar Rol a {selectedUser.name}</CardTitle>
                <CardDescription>Seleccione el rol que desea asignar al usuario</CardDescription>
              </CardHeader>
              <CardContent>
                {roleUpdated ? (
                  <Alert className="bg-green-50 border-green-200 mb-4">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-600">Rol actualizado</AlertTitle>
                    <AlertDescription>El rol del usuario ha sido actualizado exitosamente.</AlertDescription>
                  </Alert>
                ) : null}

                <div className="grid gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label className="text-sm text-gray-500">Nombre</Label>
                        <div className="font-medium">{selectedUser.name}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Correo Electrónico</Label>
                        <div className="font-medium">{selectedUser.email}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Departamento</Label>
                        <div className="font-medium">{selectedUser.department}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Cargo</Label>
                        <div className="font-medium">{selectedUser.position}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Rol Actual</Label>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-sm py-1">
                          {roles.find((r) => r.id === selectedUser.role)?.label || selectedUser.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-role">Nuevo Rol</Label>
                      <Select value={selectedRole} onValueChange={(value) => handleRoleChange(value as UserRole)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedRole && (
                      <Tabs defaultValue="description" className="mt-6">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="description">Descripción</TabsTrigger>
                          <TabsTrigger value="permissions">Permisos</TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="p-4 border rounded-md mt-2">
                          <h3 className="font-medium mb-2">{roles.find((r) => r.id === selectedRole)?.label}</h3>
                          <p className="text-gray-600">{roles.find((r) => r.id === selectedRole)?.description}</p>
                        </TabsContent>
                        <TabsContent value="permissions" className="border rounded-md mt-2">
                          <div className="space-y-4 p-4">
                            {roles
                              .find((r) => r.id === selectedRole)
                              ?.modules.map((module) => (
                                <div key={module.id} className="border-t pt-3 first:border-t-0 first:pt-0">
                                  <h4 className="font-medium">{module.name}</h4>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {module.permissions.map((permission) => (
                                      <span
                                        key={permission}
                                        className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full"
                                      >
                                        {permission}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}

                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={handleSaveRole}
                        disabled={!selectedRole || selectedRole === selectedUser.role || isUpdating}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <p>Seleccione un usuario para asignar un rol</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de rol</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea cambiar el rol de {selectedUser?.name} de{" "}
              <strong>{roles.find((r) => r.id === selectedUser?.role)?.label}</strong> a{" "}
              <strong>{roles.find((r) => r.id === selectedRole)?.label}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button onClick={confirmRoleChange} className="bg-gray-600 hover:bg-gray-700" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
