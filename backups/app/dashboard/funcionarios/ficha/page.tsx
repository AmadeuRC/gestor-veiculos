"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus } from "lucide-react"
import { NovoFuncionarioForm } from "@/components/novo-funcionario-form"

// Dados de exemplo para a tabela
const funcionariosData = []

export default function FuncionariosPage() {
  const [isNovoFuncionarioOpen, setIsNovoFuncionarioOpen] = useState(false)

  const totalAtivos = funcionariosData.filter((f) => f.ativo).length
  const totalEfetivos = funcionariosData.filter((f) => f.vinculo === "Efetivo").length
  const totalCedidos = funcionariosData.filter((f) => f.vinculo === "Cedido").length
  const totalReadaptados = funcionariosData.filter((f) => f.vinculo === "Readaptado").length
  const totalPermutados = funcionariosData.filter((f) => f.vinculo === "Permutado").length
  const totalComissionados = funcionariosData.filter((f) => f.vinculo === "Comissionado").length
  const totalContratados = funcionariosData.filter((f) => f.vinculo === "Contratado").length

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
            <NovoFuncionarioForm onSuccess={() => setIsNovoFuncionarioOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-2 p-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Ativos</p>
              <p className="text-lg font-bold">{totalAtivos}</p>
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
                <TableHead className="w-[60px]">Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Vínculo</TableHead>
                <TableHead>Profissão</TableHead>
                <TableHead>RG e CPF</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="w-[100px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funcionariosData.map((funcionario) => (
                <TableRow key={funcionario.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <img
                      src={funcionario.foto || "/placeholder.svg"}
                      alt={`Foto de ${funcionario.nome}`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{funcionario.nome}</TableCell>
                  <TableCell>{funcionario.vinculo}</TableCell>
                  <TableCell>{funcionario.profissao}</TableCell>
                  <TableCell>{funcionario.documentos}</TableCell>
                  <TableCell>{funcionario.departamento}</TableCell>
                  <TableCell>
                    <Badge variant={funcionario.ativo ? "default" : "outline"}>
                      {funcionario.ativo ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Adicione aqui a lógica para editar
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Adicione aqui a lógica para visualizar o arquivo
                        }}
                      >
                        <FileText className="h-4 w-4" />
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
