"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para a tabela
const requerimentosData = []

export default function RequerimentoPage() {
  const [isNovoRequerimentoOpen, setIsNovoRequerimentoOpen] = useState(false)
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false)
  const [selectedRequerimento, setSelectedRequerimento] = useState<(typeof requerimentosData)[0] | null>(null)
  const { toast } = useToast()

  const handleAddRequerimento = () => {
    toast({
      title: "Requerimento registrado",
      description: "O requerimento foi registrado com sucesso.",
    })
    setIsNovoRequerimentoOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Requerimentos</h1>

        <Dialog open={isNovoRequerimentoOpen} onOpenChange={setIsNovoRequerimentoOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Requerimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Requerimento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="funcionario" className="text-sm font-medium">
                    Funcionário*
                  </label>
                  <select
                    id="funcionario"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecione um funcionário</option>
                    <option value="joao">João Silva</option>
                    <option value="maria">Maria Oliveira</option>
                    <option value="pedro">Pedro Santos</option>
                    <option value="ana">Ana Pereira</option>
                    <option value="carlos">Carlos Ferreira</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="tipo" className="text-sm font-medium">
                    Tipo de Requerimento*
                  </label>
                  <select
                    id="tipo"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="ferias">Férias</option>
                    <option value="licenca-medica">Licença Médica</option>
                    <option value="abono">Abono</option>
                    <option value="licenca-maternidade">Licença Maternidade</option>
                    <option value="licenca-paternidade">Licença Paternidade</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="observacao" className="text-sm font-medium">
                  Observação*
                </label>
                <textarea
                  id="observacao"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Descreva o requerimento"
                  defaultValue=""
                ></textarea>
              </div>

              <div className="space-y-2">
                <label htmlFor="anexo" className="text-sm font-medium">
                  Anexo
                </label>
                <input
                  id="anexo"
                  type="file"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAddRequerimento}>Salvar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Funcionário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requerimentosData.map((requerimento) => (
                <TableRow key={requerimento.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>{requerimento.id}</TableCell>
                  <TableCell>{requerimento.data}</TableCell>
                  <TableCell>{requerimento.funcionario}</TableCell>
                  <TableCell>{requerimento.tipo}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        requerimento.status === "Aprovado"
                          ? "default"
                          : requerimento.status === "Reprovado"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {requerimento.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{requerimento.observacao}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedRequerimento(requerimento)
                        setIsVisualizarOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Visualizar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal para visualizar requerimento */}
      <Dialog open={isVisualizarOpen} onOpenChange={setIsVisualizarOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Requerimento</DialogTitle>
          </DialogHeader>
          {selectedRequerimento && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">ID:</h3>
                  <p className="text-base">{selectedRequerimento.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data:</h3>
                  <p className="text-base">{selectedRequerimento.data}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Funcionário:</h3>
                  <p className="text-base">{selectedRequerimento.funcionario}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo:</h3>
                  <p className="text-base">{selectedRequerimento.tipo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status:</h3>
                  <Badge
                    variant={
                      selectedRequerimento.status === "Aprovado"
                        ? "default"
                        : selectedRequerimento.status === "Reprovado"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {selectedRequerimento.status}
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Observação:</h3>
                <p className="text-base">{selectedRequerimento.observacao}</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsVisualizarOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
