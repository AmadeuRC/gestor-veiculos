"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, FileText, Plus } from "lucide-react"
import { NovoVeiculoForm } from "@/components/novo-veiculo-form"
import { FichaVeiculo } from "@/components/ficha-veiculo"
import { storageService } from "@/lib/storage-service" // Corrigido o caminho de importação

// Renomeie a constante veiculosData para veiculosDataInitial
// Substitua a linha:
// const veiculosData = [ ... ]
// Por:
const veiculosDataInitial = []

export default function VeiculosPage() {
  // Adicione este estado para armazenar os veículos
  const [veiculosData, setVeiculosData] = useState(veiculosDataInitial)
  const [isNovoVeiculoOpen, setIsNovoVeiculoOpen] = useState(false)
  const [selectedVeiculo, setSelectedVeiculo] = useState<(typeof veiculosData)[0] | null>(null)
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false)
  const [isEditarOpen, setIsEditarOpen] = useState(false)

  const veiculosAtivos = veiculosData.filter((v) => v.ativo).length
  const veiculosInativos = veiculosData.filter((v) => !v.ativo).length

  // Modifique o componente VeiculosPage para carregar os veículos do storage
  // Adicione este useEffect para carregar os veículos

  useEffect(() => {
    // Carregar os veículos do storage
    try {
      const veiculosSalvos = storageService.getVeiculos()
      // Se houver veículos salvos, use-os; caso contrário, use os dados de exemplo
      if (veiculosSalvos && veiculosSalvos.length > 0) {
        setVeiculosData(veiculosSalvos)
      }
    } catch (error) {
      console.error("Erro ao carregar veículos:", error)
      // Em caso de erro, mantém os dados de exemplo
    }
  }, [isNovoVeiculoOpen, isEditarOpen]) // Recarregar quando os modais forem fechados

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Veículos Cadastrados</h1>

        <div className="flex items-center gap-2">
          <Dialog open={isNovoVeiculoOpen} onOpenChange={setIsNovoVeiculoOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Veículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Novo Veículo</DialogTitle>
              </DialogHeader>
              {/* Passando explicitamente veiculo={null} para garantir consistência */}
              <NovoVeiculoForm veiculo={null} onSuccess={() => setIsNovoVeiculoOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ativos</p>
              <p className="text-2xl font-bold">{veiculosAtivos}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inativos</p>
              <p className="text-2xl font-bold">{veiculosInativos}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full sm:w-auto">
          <CardContent className="flex items-center gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{veiculosData.length}</p>
            </div>
          </CardContent>
        </Card>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar Para Excel
          </Button>

          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Relatório de Veículos
          </Button>

          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Imprimir Diário de Bordo
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">N°</TableHead>
                <TableHead className="w-[60px]">Foto</TableHead>
                <TableHead>Veículo/Tipo</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Secretaria</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="w-[100px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculosData.map((veiculo) => (
                <TableRow key={veiculo.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>{veiculo.id}</TableCell>
                  <TableCell>
                    <img
                      src={veiculo.foto || "/placeholder.svg"}
                      alt={`Foto do veículo ${veiculo.veiculo}`}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{veiculo.veiculo}</p>
                      <p className="text-xs text-muted-foreground">{veiculo.tipo}</p>
                    </div>
                  </TableCell>
                  <TableCell>{veiculo.placa}</TableCell>
                  <TableCell>{veiculo.secretaria}</TableCell>
                  <TableCell>{veiculo.motorista}</TableCell>
                  <TableCell>
                    <Badge variant={veiculo.ativo ? "default" : "outline"}>{veiculo.ativo ? "Sim" : "Não"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation() // Impede que o evento chegue à linha da tabela
                          setSelectedVeiculo(veiculo)
                          setIsVisualizarOpen(true)
                        }}
                      >
                        Visualizar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation() // Impede que o evento chegue à linha da tabela
                          setSelectedVeiculo(veiculo)
                          setIsEditarOpen(true)
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation() // Impede que o evento chegue à linha da tabela
                          window.location.href = `/dashboard/veiculos/diario-bordo?veiculo=${veiculo.id}`
                        }}
                      >
                        Diário de Bordo
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal para visualizar veículo */}
      <Dialog open={isVisualizarOpen} onOpenChange={setIsVisualizarOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ficha do Veículo</DialogTitle>
          </DialogHeader>
          {selectedVeiculo && <FichaVeiculo veiculo={selectedVeiculo} />}
        </DialogContent>
      </Dialog>

      {/* Modal para editar veículo */}
      <Dialog open={isEditarOpen} onOpenChange={setIsEditarOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Veículo</DialogTitle>
          </DialogHeader>
          {selectedVeiculo && <NovoVeiculoForm veiculo={selectedVeiculo} onSuccess={() => setIsEditarOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
