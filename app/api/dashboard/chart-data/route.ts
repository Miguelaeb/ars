import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/mysql-service"
import type { RowDataPacket } from "mysql2/promise"

export async function GET() {
  try {
    // Obtenemos todas las autorizaciones
    const autorizaciones = await executeQuery<RowDataPacket[]>({
      query: "SELECT * FROM autorizaciones",
    })

    // Obtenemos la fecha actual
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Creamos datos para los últimos 6 meses
    const monthsData = []
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentMonth - i, 1)
      const monthName = month.toLocaleString("es-ES", { month: "short" })
      const monthYear = `${monthName}`

      // Filtramos autorizaciones para este mes
      const monthAutorizaciones = autorizaciones.filter((a: any) => {
        const authDate = new Date(a.createdAt)
        return authDate.getMonth() === month.getMonth() && authDate.getFullYear() === month.getFullYear()
      })

      // Contamos por estado
      const pendientes = monthAutorizaciones.filter((a: any) => a.estado === "pendiente").length
      const aprobadas = monthAutorizaciones.filter((a: any) => a.estado === "aprobada").length
      const rechazadas = monthAutorizaciones.filter((a: any) => a.estado === "rechazada").length

      monthsData.push({
        name: monthYear,
        pendientes,
        aprobadas,
        rechazadas,
      })
    }

    return NextResponse.json(monthsData)
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return NextResponse.json({ error: "Error al obtener datos del gráfico" }, { status: 500 })
  }
}
