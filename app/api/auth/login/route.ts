import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/mysql-service"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validar que se proporcionaron email y password
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Consultar el usuario en la base de datos
    const users = await executeQuery({
      query: "SELECT * FROM usuarios WHERE email = ? AND password = ? AND status = 'active'",
      values: [email, password], // En producción, usar hash para contraseñas
    })

    if (Array.isArray(users) && users.length > 0) {
      const user = users[0]

      // Mapear el rol de la base de datos al tipo UserRole
      // Asumiendo que el campo 'role' en la base de datos coincide con los tipos definidos
      const mappedRole = mapDatabaseRoleToUserRole(user.role)

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name || `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: mappedRole,
          department: user.department,
          position: user.position,
          status: user.status,
        },
      })
    } else {
      return NextResponse.json({ success: false, message: "Credenciales inválidas" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}

// Función para mapear roles de la base de datos a los tipos definidos
function mapDatabaseRoleToUserRole(
  dbRole: string,
): "admin" | "doctor" | "billing" | "afiliaciones" | "autorizaciones" | "supervisor" | "consulta" {
  const roleMap: Record<
    string,
    "admin" | "doctor" | "billing" | "afiliaciones" | "autorizaciones" | "supervisor" | "consulta"
  > = {
    admin: "admin",
    administrador: "admin",
    doctor: "doctor",
    medico: "doctor",
    billing: "billing",
    facturacion: "billing",
    afiliaciones: "afiliaciones",
    autorizaciones: "autorizaciones",
    supervisor: "supervisor",
    consulta: "consulta",
  }

  return roleMap[dbRole.toLowerCase()] || "consulta" // Default a consulta si no se encuentra
}
