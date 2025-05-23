"use client"

import { useState, useEffect } from "react"
import { LogOut, User, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/hooks/useAuth"
import { clearStorage } from "@/lib/clear-storage"

export function TopBar() {
  const { toast } = useToast()
  const { user, logout } = useAuth()
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())

  useEffect(() => {
    // Atualizar a data e hora a cada minuto
    const interval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Formatar a data e hora
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(currentDateTime)

  const formattedTime = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(currentDateTime)

  const handleLogout = () => {
    logout()
    
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado do sistema",
    })
  }

  const handleClearData = () => {
    if (window.confirm("Tem certeza que deseja limpar todos os dados? Isso manterá apenas o usuário admin.")) {
      clearStorage();
      toast({
        title: "Dados limpos com sucesso",
        description: "Todos os dados foram limpos, mantendo apenas o usuário admin",
      })
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
      <SidebarTrigger className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" />

      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="flex items-center text-blue-600 mr-4">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {formattedDate} - {formattedTime}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="mr-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          onClick={handleClearData}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar Dados
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <User className="h-4 w-4" />
              <span>{user?.name || "Usuário"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-blue-200">
            <DropdownMenuLabel className="text-blue-700">Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-blue-100" />
            <DropdownMenuItem className="text-blue-600 focus:bg-blue-50 focus:text-blue-700">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-blue-600 focus:bg-blue-50 focus:text-blue-700">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
