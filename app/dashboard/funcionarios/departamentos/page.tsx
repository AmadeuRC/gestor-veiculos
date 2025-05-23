"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { NovoDepartamentoForm } from "@/components/novo-departamento-form"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para a tabela - serão usados somente se não houver dados no localStorage
const departamentosInitial = [
  {
    id: "1",
    secretaria: "SAÚDE",
    departamento: "TFD",
  },
  {
    id: "2",
    secretaria: "SAÚDE",
    departamento: "SAMU",
  },
  {
    id: "3",
    secretaria: "SAÚDE",
    departamento: "UBS I",
  },
  {
    id: "4",
    secretaria: "SAÚDE",
    departamento: "Vigilância Sanitária",
  },
  {
    id: "5",
    secretaria: "SAÚDE",
    departamento: "Farmácia Básica",
  },
  {
    id: "6",
    secretaria: "EDUCAÇÃO",
    departamento: "Ensino Fundamental",
  },
  {
    id: "7",
    secretaria: "EDUCAÇÃO",
    departamento: "Educação Infantil",
  },
]

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState<typeof departamentosInitial>([])
  const [isNovoDepartamentoOpen, setIsNovoDepartamentoOpen] = useState(false)
  const [isEditarOpen, setIsEditarOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDepartamento, setSelectedDepartamento] = useState<(typeof departamentosInitial)[0] | null>(null)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Estado para paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10

  // Carregar departamentos do localStorage ao iniciar a página
  useEffect(() => {
    try {
      const storedDepartamentos = localStorage.getItem('departamentos')
      if (storedDepartamentos) {
        setDepartamentos(JSON.parse(storedDepartamentos))
      } else {
        // Se não existir dados no localStorage, usar os dados iniciais
        setDepartamentos(departamentosInitial)
        localStorage.setItem('departamentos', JSON.stringify(departamentosInitial))
      }
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error)
      setDepartamentos(departamentosInitial)
    }
  }, [])

  // Salvar departamentos no localStorage sempre que houver alterações
  useEffect(() => {
    if (departamentos.length > 0) {
      localStorage.setItem('departamentos', JSON.stringify(departamentos))
    }
  }, [departamentos])
  
  // Função para encontrar o próximo ID
  const obterProximoId = () => {
    if (departamentos.length === 0) return "1";
    
    // Extrair todos os IDs numéricos
    const ids = departamentos
      .map(d => parseInt(d.id))
      .filter(id => !isNaN(id));
    
    // Encontrar o maior ID e incrementar 1
    const maiorId = ids.length > 0 ? Math.max(...ids) : 0;
    return (maiorId + 1).toString();
  }

  // Calcular o total de páginas
  const totalPaginas = Math.ceil(departamentos.length / itensPorPagina)
  
  // Obter os itens da página atual
  const departamentosPaginados = departamentos.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  )
  
  // Função para mudar de página
  const irParaPagina = (pagina: number) => {
    setPaginaAtual(pagina);
    setSelectedRow(null);
    setSelectedDepartamento(null);
  }

  const handleRowClick = (id: string) => {
    if (selectedRow === id) {
      setSelectedRow(null)
    } else {
      setSelectedRow(id)
      setSelectedDepartamento(departamentos.find((d) => d.id === id) || null)
    }
  }

  const handleDelete = () => {
    if (selectedDepartamento) {
      const newDepartamentos = departamentos.filter((d) => d.id !== selectedDepartamento.id)
      setDepartamentos(newDepartamentos)
      
      // Atualizar localStorage
      localStorage.setItem('departamentos', JSON.stringify(newDepartamentos))
      
      toast({
        title: "Departamento excluído",
        description: `O departamento ${selectedDepartamento.departamento} foi excluído com sucesso.`,
      })
      
      // Verificar se a página atual ficou vazia
      if (departamentosPaginados.length === 1 && paginaAtual > 1) {
        setPaginaAtual(paginaAtual - 1);
      }
      
      setSelectedRow(null)
      setSelectedDepartamento(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleAddDepartamento = (departamento: any) => {
    const proximoId = obterProximoId();
    
    const newDepartamento = {
      id: proximoId,
      secretaria: departamento.secretaria,
      departamento: departamento.nome,
    }
    const newDepartamentos = [...departamentos, newDepartamento]
    setDepartamentos(newDepartamentos)
    
    // Atualizar localStorage
    localStorage.setItem('departamentos', JSON.stringify(newDepartamentos))
    
    // Verificar se precisa ir para uma nova página
    const novaPagina = Math.ceil(newDepartamentos.length / itensPorPagina);
    if (novaPagina > paginaAtual) {
      setPaginaAtual(novaPagina);
    }
    
    toast({
      title: "Departamento adicionado",
      description: `O departamento ${departamento.nome} foi adicionado com sucesso.`,
    })
    setIsNovoDepartamentoOpen(false)
  }

  const handleUpdateDepartamento = (departamento: any) => {
    if (selectedDepartamento) {
      const updatedDepartamentos = departamentos.map((d) =>
        d.id === selectedDepartamento.id
          ? { ...d, secretaria: departamento.secretaria, departamento: departamento.nome }
          : d,
      )
      setDepartamentos(updatedDepartamentos)
      
      // Atualizar localStorage
      localStorage.setItem('departamentos', JSON.stringify(updatedDepartamentos))
      
      toast({
        title: "Departamento atualizado",
        description: `O departamento ${departamento.nome} foi atualizado com sucesso.`,
      })
      setIsEditarOpen(false)
      setSelectedRow(null)
      setSelectedDepartamento(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cadastro de Departamentos</h1>

        <Dialog open={isNovoDepartamentoOpen} onOpenChange={setIsNovoDepartamentoOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Departamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Departamento</DialogTitle>
            </DialogHeader>
            <NovoDepartamentoForm onSuccess={handleAddDepartamento} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Secretaria</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departamentosPaginados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhum departamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                departamentosPaginados.map((departamento) => (
                  <TableRow
                    key={departamento.id}
                    className={`cursor-pointer hover:bg-muted/50 ${selectedRow === departamento.id ? "bg-muted" : ""}`}
                    onClick={() => handleRowClick(departamento.id)}
                  >
                    <TableCell>{departamento.id}</TableCell>
                    <TableCell>{departamento.secretaria}</TableCell>
                    <TableCell className="font-medium">{departamento.departamento}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={selectedRow !== departamento.id}
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
                          disabled={selectedRow !== departamento.id}
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
          
          {/* Controles de paginação */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => irParaPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-sm">
                Página {paginaAtual} de {totalPaginas}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => irParaPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para editar departamento */}
      <Dialog open={isEditarOpen} onOpenChange={setIsEditarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Departamento</DialogTitle>
          </DialogHeader>
          {selectedDepartamento && (
            <NovoDepartamentoForm
              departamento={{
                secretaria: selectedDepartamento.secretaria,
                nome: selectedDepartamento.departamento,
              }}
              onSuccess={handleUpdateDepartamento}
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
              Tem certeza que deseja excluir o departamento {selectedDepartamento?.departamento}? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
