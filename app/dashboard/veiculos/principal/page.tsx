"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, FileText, Plus } from "lucide-react"
import { AtribuirVeiculoForm } from "@/components/atribuir-veiculo-form"
import { FichaVeiculo } from "@/components/ficha-veiculo"
import { StorageService, storageService } from "@/lib/storage-service"
import { PDFExportButton } from "@/components/ui/pdf-export-button"
import { format } from "date-fns"

// Renomeie a constante veiculosData para veiculosDataInitial
// Substitua a linha:
// const veiculosData = [ ... ]
// Por: 
const veiculosDataInitial: any[] = []

export default function VeiculosPage() {
  // Adicione este estado para armazenar os veículos
  const [veiculosData, setVeiculosData] = useState(veiculosDataInitial)
  const [isAtribuirVeiculoOpen, setIsAtribuirVeiculoOpen] = useState(false)
  const [selectedVeiculo, setSelectedVeiculo] = useState<(typeof veiculosData)[0] | null>(null)
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false)
  const [isEditarOpen, setIsEditarOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // Adicione um estado para forçar o recarregamento

  const veiculosAtivos = veiculosData.filter((v) => v.ativo).length
  const veiculosInativos = veiculosData.filter((v) => !v.ativo).length

  // Adicionamos uma função para corrigir o contador de veículos
  const corrigirContadorVeiculos = () => {
    console.log("Corrigindo contador de veículos...")
    try {
      const storage = StorageService.getItem<{
        veiculosData?: any[];
        counters?: {
          veiculosData?: number;
          [key: string]: number | undefined;
        };
        [key: string]: any;
      }>("sistema-gestao-data")
      
      if (storage) {
        // Verificar se a propriedade veiculosData existe
        if (!storage.veiculosData) {
          storage.veiculosData = []
        }
        
        // Verificar se a propriedade counters existe
        if (!storage.counters) {
          storage.counters = {}
        }
        
        // Verificar se o contador de veículos existe
        if (!storage.counters.veiculosData) {
          storage.counters.veiculosData = 0
        }
        
        // Se existirem veículos e o contador for menor que o número máximo de IDs
        if (storage.veiculosData.length > 0) {
          const ids = storage.veiculosData.map((v: any) => parseInt(v.id)).filter((id: number) => !isNaN(id))
          const maxId = ids.length > 0 ? Math.max(...ids) : 0
          
          // Se o contador for menor que o maior ID, atualizar
          if (storage.counters.veiculosData < maxId) {
            console.log(`Atualizando contador de veículos de ${storage.counters.veiculosData} para ${maxId}`)
            storage.counters.veiculosData = maxId
            StorageService.setItem("sistema-gestao-data", storage)
          }
        }
      }
    } catch (error) {
      console.error("Erro ao corrigir contador de veículos:", error)
    }
  }

  // Modificamos este useEffect para garantir que os veículos sejam carregados sempre que necessário
  useEffect(() => {
    console.log("useEffect executando - carregando veículos")
    corrigirContadorVeiculos() // Corrigir contador antes de carregar
    loadVeiculos()
  }, [refreshKey]) // Recarregar quando refreshKey mudar

  // Adicionamos um useEffect separado para fechar os modais
  useEffect(() => {
    if (!isAtribuirVeiculoOpen && !isEditarOpen) {
      console.log("Modal fechado - verificando necessidade de recarregar")
      handleReloadData()
    }
  }, [isAtribuirVeiculoOpen, isEditarOpen])

  // Função para carregar os veículos do localStorage
  const loadVeiculos = () => {
    try {
      console.log("loadVeiculos executando - tentando carregar veículos")
      const veiculosSalvos = storageService.getVeiculos()
      console.log("Veículos carregados:", veiculosSalvos)
      
      // Se houver veículos salvos, use-os; caso contrário, use os dados de exemplo
      if (veiculosSalvos && Array.isArray(veiculosSalvos) && veiculosSalvos.length > 0) {
        setVeiculosData(veiculosSalvos)
        console.log("Veículos definidos no estado:", veiculosSalvos)
      } else {
        console.log("Nenhum veículo encontrado no localStorage.")
        setVeiculosData([])
      }
    } catch (error) {
      console.error("Erro ao carregar veículos:", error)
      // Em caso de erro, mantém os dados vazios
      setVeiculosData([])
    }
  }

  // Função para recarregar os dados após alterações
  const handleReloadData = () => {
    console.log("handleReloadData executando - incrementando refreshKey")
    setRefreshKey(oldKey => oldKey + 1) // Incrementar a refreshKey para forçar o recarregamento
  }

  // Função para lidar com o sucesso do cadastro de veículo
  const handleVeiculoSuccess = () => {
    console.log("handleVeiculoSuccess executando - fechando modais e recarregando dados")
    setIsAtribuirVeiculoOpen(false)
    setIsEditarOpen(false)
    handleReloadData()
  }

  // Preparar dados para exportação de relatório de veículos
  const prepareVeiculosExportData = () => {
    const headers = [
      "ID", "Veículo", "Tipo", "Placa", "Secretaria", 
      "Motorista", "Ativo", "Combustível", "Observações"
    ]
    
    const data = veiculosData.map(veiculo => [
      veiculo.id ?? "",
      veiculo.veiculo ?? "",
      veiculo.tipo ?? "",
      veiculo.placa ?? "",
      veiculo.secretaria ?? "",
      veiculo.motorista ?? "",
      veiculo.ativo ? "Sim" : "Não",
      veiculo.combustivel || "-",
      veiculo.observacoes || "-"
    ])
    
    return { headers, data }
  }

  const veiculosExportData = prepareVeiculosExportData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Veículos Cadastrados</h1>

        <div className="flex items-center gap-2">
          <Dialog open={isAtribuirVeiculoOpen} onOpenChange={setIsAtribuirVeiculoOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Atribuir Veículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Atribuir Veículo</DialogTitle>
              </DialogHeader>
              {/* Passando explicitamente veiculo={null} para garantir consistência */}
              <AtribuirVeiculoForm veiculo={null} onSuccess={handleVeiculoSuccess} />
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

          <PDFExportButton
            headers={veiculosExportData.headers}
            data={veiculosExportData.data}
            options={{
              title: "Relatório de Veículos",
              subtitle: `Total: ${veiculosData.length} veículos (${veiculosAtivos} ativos)`,
              filename: `relatorio-veiculos-${format(new Date(), "dd-MM-yyyy")}`,
              orientation: "landscape"
            }}
            buttonText="Relatório de Veículos"
            buttonVariant="outline"
            buttonSize="sm"
          />

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
          {selectedVeiculo && <AtribuirVeiculoForm veiculo={selectedVeiculo} onSuccess={handleVeiculoSuccess} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
