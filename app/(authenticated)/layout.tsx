import type React from "react"
import SidebarMenuFixed from "@/components/sidebar-menu-fixed"
import Header from "@/components/header"
import ProtectedRoute from "@/components/protected-route"

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <SidebarMenuFixed />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
