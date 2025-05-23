"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Plus, Eye, Trash2 } from "lucide-react"
import { NovoDiarioBordoForm } from "@/components/novo-diario-bordo-form"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Separator } from "@/components/ui/separator"
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

// Interfaces para tipagem
interface DiarioBordo {
  id: string
  data: Date
  motorista: string
  origemDestino: string
  kmPercorrido?: number
  relatorio?: string
  horaSaida?: string
  horaChegada?: string
  checklist?: string[]
  kmInicial?: string
  kmFinal?: string
  hodometroDanificado?: string
}

interface Veiculo {
  id: string
  veiculo: string
  placa: string
  secretaria: string
  departamento: string
}

// Dados de exemplo para os veículos
const veiculosData: Veiculo[] = []

export default function DiarioBordoPage() {
  const searchParams = useSearchParams()
  const veiculoId = searchParams.get("veiculo")
  const veiculo = veiculoId ? veiculosData.find((v) => v.id === veiculoId) : null

  // Estado para armazenar os diários
  const [diariosData, setDiariosData] = useState<DiarioBordo[]>([])
  const [isNovoDiarioOpen, setIsNovoDiarioOpen] = useState(false)
  const [diarioSelecionado, setDiarioSelecionado] = useState<DiarioBordo | null>(null)
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false)
  const [isExcluirOpen, setIsExcluirOpen] = useState(false)
  const { toast } = useToast()

  // Carregar dados do localStorage quando o componente for montado
  useEffect(() => {
    try {
      const savedDiarios = localStorage.getItem("diariosData");
      if (savedDiarios) {
        // Converter as datas de string para objetos Date
        const parsedDiarios = JSON.parse(savedDiarios).map((diario: any) => ({
          ...diario,
          data: new Date(diario.data)
        }));
        setDiariosData(parsedDiarios);
      }
    } catch (error) {
      console.error("Erro ao carregar diários:", error);
    }
  }, []);

  // Salvar dados no localStorage quando houver mudanças
  useEffect(() => {
    if (diariosData.length > 0) {
      localStorage.setItem("diariosData", JSON.stringify(diariosData));
    }
  }, [diariosData]);

  const handleAddDiario = (diario: any) => {
    console.log("Diário recebido para salvar:", diario);
    
    // Criar um novo objeto diário com os dados formatados
    const novoDiario: DiarioBordo = {
      id: `DB${diariosData.length + 1}`,
      data: diario.dataSaida,
      motorista: diario.motorista,
      origemDestino: diario.origemDestino,
      kmPercorrido: diario.hodometroDanificado === "nao" && diario.kmInicial && diario.kmFinal 
        ? Number(diario.kmFinal) - Number(diario.kmInicial)
        : undefined,
      relatorio: diario.ocorrencias || "Sem ocorrências",
      horaSaida: diario.horaSaida,
      horaChegada: diario.horaChegada,
      checklist: diario.checklist,
      kmInicial: diario.kmInicial,
      kmFinal: diario.kmFinal,
      hodometroDanificado: diario.hodometroDanificado
    };
    
    // Adicionar o novo diário ao estado
    setDiariosData(prevDiarios => [...prevDiarios, novoDiario]);
    
    toast({
      title: "Diário de bordo registrado",
      description: `O diário de bordo foi registrado com sucesso.`,
    })
    setIsNovoDiarioOpen(false)
  }

  const handleExcluirDiario = (id: string) => {
    const diario = diariosData.find(d => d.id === id);
    if (diario) {
      setDiarioSelecionado(diario);
      setIsExcluirOpen(true);
    }
  }

  const confirmarExclusao = () => {
    if (diarioSelecionado) {
      const novosDiarios = diariosData.filter(d => d.id !== diarioSelecionado.id);
      setDiariosData(novosDiarios);
      
      // Atualizar localStorage
      localStorage.setItem("diariosData", JSON.stringify(novosDiarios));
      
      toast({
        title: "Diário de bordo excluído",
        description: "O diário de bordo foi excluído com sucesso.",
      });
      
      setIsExcluirOpen(false);
      setDiarioSelecionado(null);
    }
  }

  const handleVisualizarDiario = (id: string) => {
    const diario = diariosData.find(d => d.id === id);
    if (diario) {
      setDiarioSelecionado(diario);
      setIsDetalhesOpen(true);
    }
  }

  // Função para formatar o checklist em texto legível
  const formatarChecklist = (checklist?: string[]) => {
    if (!checklist || checklist.length === 0) return "Nenhum item verificado";
    
    const itensChecklist: Record<string, string> = {
      documento: "Documento",
      extintor: "Extintor",
      chave_roda: "Chave de Roda",
      macaco: "Macaco",
      agua: "Água",
      oleo: "Óleo",
      pneu_estepe: "Pneu / Estepe",
      lataria_interior: "Lataria / Interior"
    };
    
    return checklist.map(item => itensChecklist[item] || item).join(", ");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Diário de Bordo</h1>
          {veiculo && (
            <p className="text-muted-foreground">
              {veiculo.veiculo} - {veiculo.placa} | {veiculo.secretaria} - {veiculo.departamento}
            </p>
          )}
        </div>

        <Dialog open={isNovoDiarioOpen} onOpenChange={setIsNovoDiarioOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Diário de Bordo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-[90vh] overflow-hidden p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Novo Diário de Bordo</DialogTitle>
            </DialogHeader>
            <NovoDiarioBordoForm veiculo={veiculo} onSuccess={handleAddDiario} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Origem/Destino</TableHead>
                <TableHead>KM</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diariosData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    Nenhum registro encontrado. Clique em "Novo Diário de Bordo" para adicionar.
                  </TableCell>
                </TableRow>
              ) : (
                diariosData.map((diario) => (
                  <TableRow key={diario.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>{diario.id}</TableCell>
                    <TableCell>{format(diario.data, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell>{diario.motorista}</TableCell>
                    <TableCell>{diario.origemDestino}</TableCell>
                    <TableCell>{diario.kmPercorrido ? `${diario.kmPercorrido} km` : "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleVisualizarDiario(diario.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleExcluirDiario(diario.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      {/* Modal de Detalhes */}
      <Dialog open={isDetalhesOpen} onOpenChange={setIsDetalhesOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Diário de Bordo</DialogTitle>
          </DialogHeader>
          
          {diarioSelecionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold">Registro</h3>
                  <p className="text-sm">{diarioSelecionado.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Data</h3>
                  <p className="text-sm">{format(diarioSelecionado.data, "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Hora Saída</h3>
                  <p className="text-sm">{diarioSelecionado.horaSaida || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Hora Chegada</h3>
                  <p className="text-sm">{diarioSelecionado.horaChegada || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Motorista</h3>
                  <p className="text-sm">{diarioSelecionado.motorista}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Origem/Destino</h3>
                  <p className="text-sm">{diarioSelecionado.origemDestino}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold">Hodômetro Danificado</h3>
                  <p className="text-sm">{diarioSelecionado.hodometroDanificado === "sim" ? "Sim" : "Não"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Distância Percorrida</h3>
                  <p className="text-sm">{diarioSelecionado.kmPercorrido ? `${diarioSelecionado.kmPercorrido} km` : "Não aplicável"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Km Inicial</h3>
                  <p className="text-sm">{diarioSelecionado.kmInicial || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Km Final</h3>
                  <p className="text-sm">{diarioSelecionado.kmFinal || "Não informado"}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold">Itens verificados</h3>
                <p className="text-sm">{formatarChecklist(diarioSelecionado.checklist)}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold">Ocorrências / Observações</h3>
                <p className="text-sm whitespace-pre-wrap">{diarioSelecionado.relatorio || "Sem ocorrências."}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetalhesOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={isExcluirOpen} onOpenChange={setIsExcluirOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir o diário de bordo {diarioSelecionado?.id}? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
