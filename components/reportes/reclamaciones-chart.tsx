"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  {
    name: "Ene",
    reclamaciones: 680,
  },
  {
    name: "Feb",
    reclamaciones: 720,
  },
  {
    name: "Mar",
    reclamaciones: 750,
  },
  {
    name: "Abr",
    reclamaciones: 790,
  },
  {
    name: "May",
    reclamaciones: 670,
  },
  {
    name: "Jun",
    reclamaciones: 710,
  },
  {
    name: "Jul",
    reclamaciones: 730,
  },
  {
    name: "Ago",
    reclamaciones: 690,
  },
  {
    name: "Sep",
    reclamaciones: 700,
  },
  {
    name: "Oct",
    reclamaciones: 720,
  },
  {
    name: "Nov",
    reclamaciones: 740,
  },
  {
    name: "Dic",
    reclamaciones: 760,
  },
]

export function ReclamacionesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="reclamaciones" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
