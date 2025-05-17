"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Building2 } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulação de login - em um sistema real, isso seria uma chamada de API
    setTimeout(() => {
      setIsLoading(false)

      // Simulação de autenticação bem-sucedida
      if (username === "admin" && password === "admin") {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao Sistema de Gestão Municipal",
        })

        // Armazenar informações do usuário no localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: "Administrador",
            role: "admin",
          }),
        )

        router.push("/dashboard")
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Usuário ou senha incorretos",
          variant: "destructive",
        })
      }
    }, 1000)
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
                  Usuário
                </Label>
                <Input
                  id="username"
                  placeholder="Digite seu usuário"
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
            </CardContent>
            <CardFooter className="flex-col space-y-2 p-4 sm:p-6">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <p className="text-center text-xs text-blue-500">
                Dica: Use "admin" como usuário e senha para demonstração
              </p>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-blue-500">
          © {new Date().getFullYear()} Prefeitura Municipal. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
