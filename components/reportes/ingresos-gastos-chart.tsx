"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"

const data = [
  {
    name: "Ene",
    ingresos: 980000,
    gastos: 680000,
  },
  {
    name: "Feb",
    ingresos: 1020000,
    gastos: 720000,
  },
  {
    name: "Mar",
    ingresos: 1050000,
    gastos: 750000,
  },
  {
    name: "Abr",
    ingresos: 1090000,
    gastos: 790000,
  },
  {
    name: "May",
    ingresos: 970000,
    gastos: 670000,
  },
  {
    name: "Jun",
    ingresos: 1010000,
    gastos: 710000,
  },
  {
    name: "Jul",
    ingresos: 1030000,
    gastos: 730000,
  },
  {
    name: "Ago",
    ingresos: 990000,
    gastos: 690000,
  },
  {
    name: "Sep",
    ingresos: 1000000,
    gastos: 700000,
  },
  {
    name: "Oct",
    ingresos: 1020000,
    gastos: 720000,
  },
  {
    name: "Nov",
    ingresos: 1040000,
    gastos: 740000,
  },
  {
    name: "Dic",
    ingresos: 1060000,
    gastos: 760000,
  },
]

export function IngresosGastosChart() {
  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(1)}K`
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatCurrency} />
        <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]} />
        <Legend />
        <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
