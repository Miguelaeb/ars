"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"

const data = [
  {
    name: "Hospitales",
    value: 120,
  },
  {
    name: "Clínicas",
    value: 85,
  },
  {
    name: "Laboratorios",
    value: 65,
  },
  {
    name: "Farmacias",
    value: 45,
  },
  {
    name: "Otros",
    value: 27,
  },
]

const COLORS = ["#4f46e5", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"]

export function ProveedoresChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={120} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
