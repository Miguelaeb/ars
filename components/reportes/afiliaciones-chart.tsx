"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  {
    name: "Ene",
    afiliaciones: 480,
  },
  {
    name: "Feb",
    afiliaciones: 520,
  },
  {
    name: "Mar",
    afiliaciones: 550,
  },
  {
    name: "Abr",
    afiliaciones: 490,
  },
  {
    name: "May",
    afiliaciones: 470,
  },
  {
    name: "Jun",
    afiliaciones: 510,
  },
  {
    name: "Jul",
    afiliaciones: 530,
  },
  {
    name: "Ago",
    afiliaciones: 490,
  },
  {
    name: "Sep",
    afiliaciones: 500,
  },
  {
    name: "Oct",
    afiliaciones: 520,
  },
  {
    name: "Nov",
    afiliaciones: 540,
  },
  {
    name: "Dic",
    afiliaciones: 560,
  },
]

export function AfiliacionesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="afiliaciones" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
