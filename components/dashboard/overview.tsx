"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

// Tipo para los datos del gráfico
type ChartData = {
  name: string
  pendientes: number
  aprobadas: number
  rechazadas: number
}

export function Overview() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChartData() {
      try {
        // Usamos la API en lugar de acceder directamente a la base de datos
        const response = await fetch("/api/dashboard/chart-data")

        if (!response.ok) {
          throw new Error("Error al obtener datos del gráfico")
        }

        const data = await response.json()
        setChartData(data)
      } catch (error) {
        console.error("Error fetching chart data:", error)
        // En caso de error, mostramos datos de ejemplo
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  // Si no hay datos o está cargando, mostrar datos de ejemplo
  const displayData =
    loading || chartData.length === 0
      ? [
          { name: "Ene", pendientes: 0, aprobadas: 0, rechazadas: 0 },
          { name: "Feb", pendientes: 0, aprobadas: 0, rechazadas: 0 },
          { name: "Mar", pendientes: 0, aprobadas: 0, rechazadas: 0 },
          { name: "Abr", pendientes: 0, aprobadas: 0, rechazadas: 0 },
          { name: "May", pendientes: 0, aprobadas: 0, rechazadas: 0 },
          { name: "Jun", pendientes: 0, aprobadas: 0, rechazadas: 0 },
        ]
      : chartData

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={displayData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="pendientes" name="Pendientes" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        <Bar dataKey="aprobadas" name="Aprobadas" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="rechazadas" name="Rechazadas" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
