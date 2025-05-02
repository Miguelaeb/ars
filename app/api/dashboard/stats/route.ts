import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/mysql-service"
import type { RowDataPacket } from "mysql2/promise"

export async function GET() {
  try {
    // Consulta para obtener el total de afiliados
    const afiliadosResult = await executeQuery<RowDataPacket[]>({
      query: "SELECT COUNT(*) as total FROM afiliados",
    })
    const totalAfiliados = afiliadosResult[0]?.total || 0

    // Consulta para obtener las autorizaciones por estado
    const autorizacionesResult = await executeQuery<RowDataPacket[]>({
      query: `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
          SUM(CASE WHEN estado = 'aprobada' THEN 1 ELSE 0 END) as aprobadas,
          SUM(CASE WHEN estado = 'rechazada' THEN 1 ELSE 0 END) as rechazadas
        FROM autorizaciones
      `,
    })

    // Preparar los datos para la respuesta
    const stats = {
      totalAfiliados,
      totalAutorizaciones: autorizacionesResult[0]?.total || 0,
      autorizacionesPendientes: autorizacionesResult[0]?.pendientes || 0,
      autorizacionesAprobadas: autorizacionesResult[0]?.aprobadas || 0,
      autorizacionesRechazadas: autorizacionesResult[0]?.rechazadas || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas del dashboard" }, { status: 500 })
  }
}
