"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fuel, Truck, Users, FileText, Home, UserCog } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/lib/hooks/useAuth"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Verificar se o usuário é um administrador
  const isAdmin = user?.role === "admin"

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-blue-200 dark:border-blue-800">
        <div className="flex h-14 items-center px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300">
            <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Sistema de Gestão</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
              <Link href="/dashboard">
                <Home className="text-blue-600 dark:text-blue-400" />
                <span>Início</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Combustível */}
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Fuel className="text-blue-600 dark:text-blue-400" />
              <span>Combustível</span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/combustivel/abastecimento"}>
                  <Link href="/dashboard/combustivel/abastecimento">
                    <span>Abastecimento</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/combustivel/cadastros"}>
                  <Link href="/dashboard/combustivel/cadastros">
                    <span>Cadastros</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/combustivel/destinos"}>
                  <Link href="/dashboard/combustivel/destinos">
                    <span>Destinos</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/combustivel/rotas"}>
                  <Link href="/dashboard/combustivel/rotas">
                    <span>Rotas</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/combustivel/ticket"}>
                  <Link href="/dashboard/combustivel/ticket">
                    <span>Ticket</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>

          {/* Veículos */}
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Truck className="text-blue-600 dark:text-blue-400" />
              <span>Veículos</span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/veiculos/diario-bordo"}>
                  <Link href="/dashboard/veiculos/diario-bordo">
                    <span>Diário de Bordo</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/veiculos/marcas"}>
                  <Link href="/dashboard/veiculos/marcas">
                    <span>Cadastro de Veículos</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/veiculos/principal"}>
                  <Link href="/dashboard/veiculos/principal">
                    <span>Principal</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>

          {/* Funcionários */}
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Users className="text-blue-600 dark:text-blue-400" />
              <span>Funcionários</span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/funcionarios/departamentos"}>
                  <Link href="/dashboard/funcionarios/departamentos">
                    <span>Departamentos</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/funcionarios/ficha"}>
                  <Link href="/dashboard/funcionarios/ficha">
                    <span>Ficha</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/funcionarios/requerimento"}>
                  <Link href="/dashboard/funcionarios/requerimento">
                    <span>Requerimento</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>

          {/* LOG Sistema */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/log"}>
              <Link href="/dashboard/log">
                <FileText className="text-blue-600 dark:text-blue-400" />
                <span>LOG Sistema</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Admin - mostrado apenas para administradores */}
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard/admin"}>
                <Link href="/dashboard/admin">
                  <UserCog className="text-blue-600 dark:text-blue-400" />
                  <span>Administração</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between p-4">
          <div className="text-xs text-blue-500 dark:text-blue-400">
            Sistema de Gestão Municipal v1.0
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
