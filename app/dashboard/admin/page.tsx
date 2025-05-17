"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { NovoUsuarioForm } from "@/components/novo-usuario-form"
import { useToast } from "@/components/ui/use-toast"
import { AdminUser } from "@/lib/storage-service"
import { useAuth } from "@/lib/hooks/useAuth"
import { UserService } from "@/lib/services/user.service"

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState<AdminUser[]>([])
  const [isNovoUsuarioOpen, setIsNovoUsuarioOpen] = useState(false)
  const [isNovoAdminOpen, setIsNovoAdminOpen] = useState(false)
  const [isEditarOpen, setIsEditarOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<AdminUser | null>(null)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  // Verificar se o usuário é admin
  useEffect(() => {
    // Se o usuário não for admin, redireciona para o dashboard
    if (user && user.role !== "admin") {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      })
      router.push("/dashboard")
    } else if (user) {
      setIsLoading(false)
    }
  }, [user, router, toast])

  // Carregar usuários do localStorage
  useEffect(() => {
    if (!isLoading) {
      const loadedUsers = UserService.getAdminUsers()
      setUsuarios(loadedUsers)
    }
  }, [isLoading])

  const handleRowClick = (id: string) => {
    if (selectedRow === id) {
      setSelectedRow(null)
      setSelectedUsuario(null)
    } else {
      setSelectedRow(id)
      setSelectedUsuario(usuarios.find((u) => u.id === id) || null)
    }
  }

  const handleDelete = () => {
    if (selectedUsuario) {
      UserService.deleteAdminUser(selectedUsuario.id)
      setUsuarios(usuarios.filter((u) => u.id !== selectedUsuario.id))
      
      toast({
        title: "Usuário excluído",
        description: `O usuário ${selectedUsuario.nome} foi excluído com sucesso.`,
      })
      setSelectedRow(null)
      setSelectedUsuario(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleAddUser = (user: any) => {
    const newUser: AdminUser = {
      id: "",
      nome: user.nome,
      email: user.email,
      tipo: "Usuário",
      ativo: true,
      senha: user.senha
    }
    
    const savedUser = UserService.saveAdminUser(newUser)
    setUsuarios([...usuarios, savedUser])
    
    toast({
      title: "Usuário adicionado",
      description: `O usuário ${user.nome} foi adicionado com sucesso.`,
    })
    setIsNovoUsuarioOpen(false)
  }

  const handleAddAdmin = (user: any) => {
    const newUser: AdminUser = {
      id: "",
      nome: user.nome,
      email: user.email,
      tipo: "Administrador",
      ativo: true,
      senha: user.senha
    }
    
    const savedUser = UserService.saveAdminUser(newUser)
    setUsuarios([...usuarios, savedUser])
    
    toast({
      title: "Administrador adicionado",
      description: `O administrador ${user.nome} foi adicionado com sucesso.`,
    })
    setIsNovoAdminOpen(false)
  }

  const handleUpdateUser = (user: any) => {
    if (selectedUsuario) {
      const updatedUser: AdminUser = {
        ...selectedUsuario,
        nome: user.nome,
        email: user.email,
        ativo: user.ativo
      }
      
      // Se uma nova senha foi fornecida, adiciona ao objeto
      if (user.senha && user.senha.trim() !== '') {
        updatedUser.senha = user.senha;
      }
      
      UserService.saveAdminUser(updatedUser)
      setUsuarios(usuarios.map((u) => u.id === selectedUsuario.id ? updatedUser : u))
      
      toast({
        title: "Usuário atualizado",
        description: `O usuário ${user.nome} foi atualizado com sucesso.`,
      })
      setIsEditarOpen(false)
      setSelectedRow(null)
      setSelectedUsuario(null)
    }
  }

  // Mostrar carregamento enquanto verifica a permissão
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Administração de Usuários</h1>

        <div className="flex items-center gap-2">
          <Dialog open={isNovoUsuarioOpen} onOpenChange={setIsNovoUsuarioOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Usuário</DialogTitle>
              </DialogHeader>
              <NovoUsuarioForm onSuccess={handleAddUser} />
            </DialogContent>
          </Dialog>

          <Dialog open={isNovoAdminOpen} onOpenChange={setIsNovoAdminOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo ADM
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Administrador</DialogTitle>
              </DialogHeader>
              <NovoUsuarioForm onSuccess={handleAddAdmin} isAdmin />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhum usuário cadastrado. Clique em "Criar Novo Usuário" para adicionar.
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((usuario, index) => (
                  <TableRow
                    key={`usuario-${usuario.id}-${index}`}
                    className={`cursor-pointer hover:bg-muted/50 ${selectedRow === usuario.id ? "bg-muted" : ""}`}
                    onClick={() => handleRowClick(usuario.id)}
                  >
                    <TableCell className="font-medium">{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.tipo}</TableCell>
                    <TableCell>
                      <Badge variant={usuario.ativo ? "default" : "outline"}>{usuario.ativo ? "Sim" : "Não"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={selectedRow !== usuario.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsEditarOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={selectedRow !== usuario.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal para editar usuário */}
      <Dialog open={isEditarOpen} onOpenChange={setIsEditarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {selectedUsuario && (
            <NovoUsuarioForm
              usuario={selectedUsuario}
              onSuccess={handleUpdateUser}
              isAdmin={selectedUsuario.tipo === "Administrador"}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para excluir */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
