"use client"

import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { PrivateRoute } from "@/components/auth/private-route"
import { SessionExpiryDialog } from "@/components/session-expiry-dialog"
import { useAuth } from "@/lib/hooks/useAuth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { showExpirationWarning, renewSession, logout } = useAuth()

  return (
    <PrivateRoute>
      <SidebarProvider>
        <div className="flex h-screen bg-blue-50">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <TopBar />
            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
          </div>
        </div>

        {/* Diálogo de aviso de expiração de sessão */}
        <SessionExpiryDialog 
          open={showExpirationWarning} 
          onRenew={renewSession} 
          onLogout={logout}
        />
      </SidebarProvider>
    </PrivateRoute>
  )
}
