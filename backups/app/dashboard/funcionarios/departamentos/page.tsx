"use client"

import { useState } from "react"
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
import { Plus, Pencil, Trash2 } from "lucide-react"
import { NovoDepartamentoForm } from "@/components/novo-departamento-form"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para a tabela
const departamentosData = [
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
  const [departamentos, setDepartamentos] = useState(departamentosData)
  const [isNovoDepartamentoOpen, setIsNovoDepartamentoOpen] = useState(false)
  const [isEditarOpen, setIsEditarOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDepartamento, setSelectedDepartamento] = useState<(typeof departamentosData)[0] | null>(null)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const { toast } = useToast()

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
      setDepartamentos(departamentos.filter((d) => d.id !== selectedDepartamento.id))
      toast({
        title: "Departamento excluído",
        description: `O departamento ${selectedDepartamento.departamento} foi excluído com sucesso.`,
      })
      setSelectedRow(null)
      setSelectedDepartamento(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleAddDepartamento = (departamento: any) => {
    const newDepartamento = {
      id: (departamentos.length + 1).toString(),
      secretaria: departamento.secretaria,
      departamento: departamento.nome,
    }
    setDepartamentos([...departamentos, newDepartamento])
    toast({
      title: "Departamento adicionado",
      description: `O departamento ${departamento.nome} foi adicionado com sucesso.`,
    })
    setIsNovoDepartamentoOpen(false)
  }

  const handleUpdateDepartamento = (departamento: any) => {
    if (selectedDepartamento) {
      setDepartamentos(
        departamentos.map((d) =>
          d.id === selectedDepartamento.id
            ? { ...d, secretaria: departamento.secretaria, departamento: departamento.nome }
            : d,
        ),
      )
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
              {departamentos.map((departamento) => (
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
              ))}
            </TableBody>
          </Table>
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
