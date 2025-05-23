"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Pencil, Trash2 } from "lucide-react"
import { NovoFuncionarioForm } from "@/components/novo-funcionario-form"
import { storageService, StorageService } from "@/lib/storage-service"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

// Importando o tipo Employee da interface no storage-service
type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  hireDate: string;
  ativo?: boolean;
  vinculo?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cep?: string;
    estado?: string;
  }
}

export default function FuncionariosPage() {
  const [isNovoFuncionarioOpen, setIsNovoFuncionarioOpen] = useState(false)
  const [isEditarFuncionarioOpen, setIsEditarFuncionarioOpen] = useState(false)
  const [isVisualizarFuncionarioOpen, setIsVisualizarFuncionarioOpen] = useState(false)
  const [isExcluirFuncionarioOpen, setIsExcluirFuncionarioOpen] = useState(false)
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Employee | null>(null)
  const [funcionariosData, setFuncionariosData] = useState<Employee[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Corrigir IDs duplicados antes de carregar os funcionários
    try {
      StorageService.corrigirContadorFuncionarios()
      console.log("Contador de IDs de funcionários corrigido.")
    } catch (error) {
      console.error("Erro ao corrigir contador de IDs:", error)
    }
    
    carregarFuncionarios()
  }, [])

  const carregarFuncionarios = () => {
    try {
      const funcionarios = storageService.getEmployees()
      console.log("Funcionários carregados:", funcionarios)
      setFuncionariosData(funcionarios)
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error)
    }
  }

  const handleEditar = (funcionario: Employee) => {
    setFuncionarioSelecionado(funcionario)
    setIsEditarFuncionarioOpen(true)
  }

  const handleVisualizar = (funcionario: Employee) => {
    setFuncionarioSelecionado(funcionario)
    setIsVisualizarFuncionarioOpen(true)
  }

  const handleExcluir = (funcionario: Employee) => {
    setFuncionarioSelecionado(funcionario)
    setIsExcluirFuncionarioOpen(true)
  }

  const confirmarExclusao = () => {
    if (funcionarioSelecionado) {
      try {
        storageService.deleteEmployee(funcionarioSelecionado.id)
        toast({
          title: "Funcionário excluído",
          description: `Funcionário ${funcionarioSelecionado.name} foi excluído com sucesso.`,
        })
        setIsExcluirFuncionarioOpen(false)
        setFuncionarioSelecionado(null)
        carregarFuncionarios()
      } catch (error) {
        console.error("Erro ao excluir funcionário:", error)
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: "Não foi possível excluir o funcionário."
        })
      }
    }
  }

  const totalAtivos = funcionariosData.filter((f) => f.ativo).length
  const totalEfetivos = funcionariosData.filter((f) => f.position === "Efetivo").length
  const totalCedidos = funcionariosData.filter((f) => f.position === "Cedido").length
  const totalReadaptados = funcionariosData.filter((f) => f.position === "Readaptado").length
  const totalPermutados = funcionariosData.filter((f) => f.position === "Permutado").length
  const totalComissionados = funcionariosData.filter((f) => f.position === "Comissionado").length
  const totalContratados = funcionariosData.filter((f) => f.position === "Contratado").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cadastro de Funcionários</h1>

        <Dialog open={isNovoFuncionarioOpen} onOpenChange={setIsNovoFuncionarioOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cadastro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Novo Cadastro de Funcionário</DialogTitle>
            </DialogHeader>
            <NovoFuncionarioForm onSuccess={() => {
              setIsNovoFuncionarioOpen(false)
              carregarFuncionarios()
            }} />
          </DialogContent>
        </Dialog>

        {/* Diálogo para edição de funcionário */}
        <Dialog open={isEditarFuncionarioOpen} onOpenChange={setIsEditarFuncionarioOpen}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Editar Funcionário</DialogTitle>
            </DialogHeader>
            {funcionarioSelecionado && (
              <NovoFuncionarioForm 
                funcionario={funcionarioSelecionado} 
                onSuccess={() => {
                  setIsEditarFuncionarioOpen(false)
                  setFuncionarioSelecionado(null)
                  carregarFuncionarios()
                }} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Diálogo para visualização detalhada do funcionário */}
        <Dialog open={isVisualizarFuncionarioOpen} onOpenChange={setIsVisualizarFuncionarioOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Informações do Funcionário</DialogTitle>
            </DialogHeader>
            {funcionarioSelecionado && (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2">Informações Básicas</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Nome</p>
                          <p className="font-medium">{funcionarioSelecionado.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Situação</p>
                          <div className="font-medium">
                            {funcionarioSelecionado.ativo ? 
                              <Badge className="bg-green-500">Ativo</Badge> : 
                              <Badge variant="destructive">Inativo</Badge>
                            }
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">CPF</p>
                          <p className="font-medium">{funcionarioSelecionado.cpf || "Não informado"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">E-mail</p>
                          <p className="font-medium">{funcionarioSelecionado.email || "Não informado"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Telefone</p>
                          <p className="font-medium">{funcionarioSelecionado.telefone || "Não informado"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Celular</p>
                          <p className="font-medium">{funcionarioSelecionado.celular || "Não informado"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2">Informações Profissionais</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Cargo</p>
                          <p className="font-medium">{funcionarioSelecionado.position}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Departamento</p>
                          <p className="font-medium">{funcionarioSelecionado.department}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Vínculo</p>
                          <p className="font-medium">{funcionarioSelecionado.vinculo || "Não informado"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Data de Contratação</p>
                          <p className="font-medium">{funcionarioSelecionado.hireDate}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {funcionarioSelecionado.endereco && (
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-2">Endereço</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Logradouro</p>
                            <p className="font-medium">{funcionarioSelecionado.endereco.logradouro || "Não informado"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Número</p>
                            <p className="font-medium">{funcionarioSelecionado.endereco.numero || "S/N"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Bairro</p>
                            <p className="font-medium">{funcionarioSelecionado.endereco.bairro || "Não informado"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">CEP</p>
                            <p className="font-medium">{funcionarioSelecionado.endereco.cep || "Não informado"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Estado</p>
                            <p className="font-medium">{funcionarioSelecionado.endereco.estado || "Não informado"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            )}
            <DialogFooter>
              <Button 
                onClick={() => setIsVisualizarFuncionarioOpen(false)} 
                className="w-full"
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de Confirmação de Exclusão */}
        <Dialog open={isExcluirFuncionarioOpen} onOpenChange={setIsExcluirFuncionarioOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o funcionário {funcionarioSelecionado?.name}?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsExcluirFuncionarioOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmarExclusao}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-2 p-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Funcionários</p>
              <p className="text-lg font-bold">{funcionariosData.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-2 p-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Efetivos</p>
              <p className="text-lg font-bold">{totalEfetivos}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-2 p-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Cedidos</p>
              <p className="text-lg font-bold">{totalCedidos}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-2 p-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Readaptados</p>
              <p className="text-lg font-bold">{totalReadaptados}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-2 p-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Permutados</p>
              <p className="text-lg font-bold">{totalPermutados}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-2 p-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Comissionados</p>
              <p className="text-lg font-bold">{totalComissionados}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-2 p-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Contratados</p>
              <p className="text-lg font-bold">{totalContratados}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Data de Contratação</TableHead>
                <TableHead className="w-[100px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funcionariosData.map((funcionario) => (
                <TableRow key={funcionario.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{funcionario.name}</TableCell>
                  <TableCell>{funcionario.position}</TableCell>
                  <TableCell>{funcionario.department}</TableCell>
                  <TableCell>{funcionario.hireDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditar(funcionario)
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVisualizar(funcionario)
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleExcluir(funcionario)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
