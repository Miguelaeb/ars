import ProtectedRoute from "@/components/protected-route"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { Overview } from "@/components/dashboard/overview"
import { RecentClaims } from "@/components/dashboard/recent-claims"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <ProtectedRoute requiredPermission={{ module: "dashboard", permission: "view" }}>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        <DashboardStats />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Resumen de Autorizaciones</CardTitle>
              <CardDescription>Análisis de autorizaciones médicas en los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Autorizaciones Recientes</CardTitle>
              <CardDescription>Últimas autorizaciones procesadas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentClaims />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
