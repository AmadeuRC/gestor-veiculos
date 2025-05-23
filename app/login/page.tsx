"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Building2, Loader2, AlertCircle } from "lucide-react"
import { UserService } from "@/lib/services/user.service"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Duração da sessão em milissegundos (12 horas)
const SESSION_DURATION = 12 * 60 * 60 * 1000;

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const checkIfLoggedIn = () => {
      try {
        // Verificar tanto no localStorage quanto no sessionStorage
        const userStr = localStorage.getItem("user") || sessionStorage.getItem("user")
        if (userStr) {
          try {
            // Verificar se a sessão expirou
            const userData = JSON.parse(userStr);
            if (userData.expiresAt && userData.expiresAt < Date.now()) {
              console.log("Sessão expirada, removendo dados");
              localStorage.removeItem("user");
              sessionStorage.removeItem("user");
              setIsCheckingAuth(false);
              return;
            }
          } catch (error) {
            console.error("Erro ao verificar expiração:", error);
          }
          
          // Usuário já está logado, redirecionar para o dashboard
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkIfLoggedIn()
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Utilizando o serviço de usuário para validar as credenciais
    setTimeout(() => {
      setIsLoading(false)

      // Validação usando o UserService
      if (UserService.validarCredenciais(username, password)) {
        // Buscar dados reais do usuário
        const adminUsers = UserService.getAdminUsers();
        
        // Timestamp atual
        const now = Date.now();
        
        let userData = {
          name: "Administrador",
          role: "admin",
          loginTimestamp: now,
          expiresAt: now + SESSION_DURATION
        };
        
        // Se o usuário for encontrado nos usuários administrativos, usa seus dados
        const foundUser = adminUsers.find(user => 
          user.email === username && user.ativo === true
        );
        
        if (foundUser) {
          // Mapear o tipo de usuário para role (admin ou user)
          const role = foundUser.tipo === "Administrador" ? "admin" : "user";
          
          userData = {
            name: foundUser.nome,
            role: role,
            loginTimestamp: now,
            expiresAt: now + SESSION_DURATION
          };
        }
        
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${userData.name}`,
        })

        // Armazenar informações do usuário no localStorage ou sessionStorage dependendo da opção
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(userData))
          // Limpar qualquer dado no sessionStorage para evitar duplicação
          sessionStorage.removeItem("user")
        } else {
          sessionStorage.setItem("user", JSON.stringify(userData))
          // Limpar qualquer dado no localStorage para evitar duplicação
          localStorage.removeItem("user")
        }

        router.push("/dashboard")
      } else {
        // Abrir o diálogo de erro em vez do toast
        setErrorDialogOpen(true)
      }
    }, 1000)
  }

  // Exibir carregamento enquanto verifica autenticação
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // Melhorar a responsividade para diferentes resoluções
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
            <Building2 size={32} />
          </div>
          <h1 className="text-center text-xl sm:text-2xl font-bold text-blue-800">Sistema de Gestão Municipal</h1>
          <p className="text-center text-sm sm:text-base text-blue-600">Acesso ao painel administrativo</p>
        </div>

        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="space-y-1 border-b border-blue-100 bg-blue-50 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-bold text-blue-800">Login</CardTitle>
            <CardDescription className="text-sm text-blue-600">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-700">
                  E-mail
                </Label>
                <Input
                  id="username"
                  placeholder="Digite seu e-mail"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-blue-200 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-blue-200 focus-visible:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(checked === true)} 
                  className="border-blue-300 data-[state=checked]:bg-blue-600"
                />
                <Label 
                  htmlFor="remember-me" 
                  className="text-sm font-medium text-blue-700 cursor-pointer"
                >
                  Continuar conectado
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2 p-4 sm:p-6">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <p className="text-center text-xs text-blue-500">
                Dica: Cadastre novos usuários na área administrativa
              </p>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-blue-500">
          © {new Date().getFullYear()} Prefeitura Municipal. Todos os direitos reservados.
        </p>
      </div>

      {/* Diálogo de erro de credenciais */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="border-2 border-red-200 sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-lg font-semibold text-gray-900">Erro de Autenticação</DialogTitle>
          </DialogHeader>
          <div className="text-center py-3">
            <p className="text-gray-700">E-mail ou senha incorretos.</p>
            <p className="text-gray-700 mt-1">Por favor, verifique suas credenciais e tente novamente.</p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" 
              onClick={() => setErrorDialogOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
