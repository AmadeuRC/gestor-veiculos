"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, RefreshCw, Eye } from "lucide-react"
import { NovoCombustivelForm } from "@/components/novo-combustivel-form"
import { useToast } from "@/components/ui/use-toast"
import { storageService, type Combustivel, type Rota, type Destino } from "@/lib/storage-service"

/**
 * Página de cadastros de combustíveis, rotas e destinos
 * Permite gerenciar os cadastros básicos do sistema de combustível
 */
export default function CadastrosPage() {
  // Estados para controle da interface
  const [activeTab, setActiveTab] = useState("combustivel")
  const [isNovoCombustivelOpen, setIsNovoCombustivelOpen] = useState(false)
  const [isEditarCombustivelOpen, setIsEditarCombustivelOpen] = useState(false)
  const [isNovaRotaOpen, setIsNovaRotaOpen] = useState(false)
  const [isNovoDestinoOpen, setIsNovoDestinoOpen] = useState(false)
  const [isReequilibrioOpen, setIsReequilibrioOpen] = useState(false)
  const [isVisualizarCombustivelOpen, setIsVisualizarCombustivelOpen] = useState(false)

  // Estados para armazenar dados
  const [combustiveis, setCombustiveis] = useState<Combustivel[]>([])
  const [rotas, setRotas] = useState<Rota[]>([])
  const [destinos, setDestinos] = useState<Destino[]>([])

  // Estados para seleção de itens
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const [selectedCombustivel, setSelectedCombustivel] = useState<Combustivel | null>(null)

  const { toast } = useToast()

  /**
   * Carrega todos os dados necessários para a página
   */
  const loadData = useCallback(() => {
    setCombustiveis(storageService.getCombustiveis())
    setRotas(storageService.getRotas())
    setDestinos(storageService.getDestinos())
  }, [])

  // Carregar dados ao montar o componente e configurar verificação periódica
  useEffect(() => {
    loadData()

    // Verificar contratos expirados a cada minuto
    const interval = setInterval(() => {
      storageService.verificarContratosExpirados()
      loadData()
    }, 60000)

    return () => clearInterval(interval)
  }, [loadData])

  /**
   * Manipula o clique em uma linha da tabela de combustíveis
   * @param id ID do combustível selecionado
   */
  const handleRowClick = (id: string) => {
    if (selectedRow === id) {
      setSelectedRow(null)
      setSelectedCombustivel(null)
    } else {
      setSelectedRow(id)
      setSelectedCombustivel(combustiveis.find((c) => c.id === id) || null)
    }
  }

  /**
   * Abre o modal de visualização do combustível
   * @param combustivel Dados do combustível a visualizar
   * @param e Evento do clique
   */
  const handleVisualizarClick = (combustivel: Combustivel, e: React.MouseEvent) => {
    e.stopPropagation()  // Impede que o evento de clique da linha seja acionado
    setSelectedCombustivel(combustivel)
    setIsVisualizarCombustivelOpen(true)
  }

  /**
   * Adiciona um novo combustível
   * @param combustivel Dados do combustível a adicionar
   */
  const handleAddCombustivel = (combustivel: any) => {
    try {
      // Salvar o novo combustível usando o serviço de armazenamento
      storageService.saveCombustivel({
        secretaria: combustivel.secretaria,
        combustivel: combustivel.tipoCombustivel,
        quantidadePrevista: combustivel.quantidadePrevista,
        valor: combustivel.valor,
        fimContrato: combustivel.dataFim ? new Date(combustivel.dataFim).toLocaleDateString("pt-BR") : "",
        ativo: combustivel.ativo,
        observacoes: combustivel.observacao || "",
      })

      loadData() // Recarregar dados após adição

      toast({
        title: "Combustível adicionado",
        description: `O combustível ${combustivel.tipoCombustivel} foi adicionado com sucesso.`,
      })
      setIsNovoCombustivelOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao adicionar o combustível.",
      })
    }
  }

  /**
   * Edita um combustível existente
   * @param combustivel Dados atualizados do combustível
   */
  const handleEditCombustivel = (combustivel: any) => {
    try {
      if (!selectedCombustivel) return

      // Atualizar o combustível usando o serviço de armazenamento
      storageService.updateCombustivel(selectedCombustivel.id, {
        secretaria: combustivel.secretaria,
        combustivel: combustivel.tipoCombustivel,
        quantidadePrevista: combustivel.quantidadePrevista,
        valor: combustivel.valor,
        fimContrato: combustivel.dataFim ? new Date(combustivel.dataFim).toLocaleDateString("pt-BR") : "",
        ativo: combustivel.ativo,
        observacoes: combustivel.observacao || "",
      })

      loadData() // Recarregar dados após atualização

      toast({
        title: "Combustível atualizado",
        description: `O combustível ${combustivel.tipoCombustivel} foi atualizado com sucesso.`,
      })
      setIsEditarCombustivelOpen(false)
      setSelectedRow(null)
      setSelectedCombustivel(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o combustível.",
      })
    }
  }

  /**
   * Atualiza o preço de um combustível (reequilíbrio)
   * @param novoValor Novo valor do combustível
   */
  const handleReequilibrio = (novoValor: string) => {
    try {
      if (!selectedCombustivel) return

      storageService.updateCombustivel(selectedCombustivel.id, {
        valor: novoValor,
      })

      loadData()

      toast({
        title: "Preço atualizado",
        description: `O preço do combustível foi atualizado com sucesso.`,
      })
      setIsReequilibrioOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o preço.",
      })
    }
  }

  /**
   * Adiciona uma nova rota
   * @param rota Dados da rota a adicionar
   */
  const handleAddRota = (rota: { numero: string; nome: string }) => {
    try {
      storageService.saveRota({
        rota: `${rota.numero} - ${rota.nome}`,
        distancia: "",
      })

      loadData()

      toast({
        title: "Rota adicionada",
        description: `A rota ${rota.nome} foi adicionada com sucesso.`,
      })
      setIsNovaRotaOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao adicionar a rota.",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Cadastros</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="combustivel">Combustível</TabsTrigger>
          <TabsTrigger value="rotas">Rotas</TabsTrigger>
          <TabsTrigger value="destinos">Destinos</TabsTrigger>
        </TabsList>

        {/* Aba Combustível */}
        <TabsContent value="combustivel" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Combustíveis Cadastrados</h2>

            <div className="flex items-center gap-2">
              <Dialog open={isNovoCombustivelOpen} onOpenChange={setIsNovoCombustivelOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Novo Combustível / Lubrificante</DialogTitle>
                  </DialogHeader>
                  <NovoCombustivelForm 
                    onSuccess={handleAddCombustivel} 
                    onCancel={() => setIsNovoCombustivelOpen(false)}
                  />
                </DialogContent>
              </Dialog>

              <Button variant="outline" disabled={!selectedRow} onClick={() => setIsEditarCombustivelOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>

              <Dialog open={isReequilibrioOpen} onOpenChange={setIsReequilibrioOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={!selectedRow}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reequilíbrio de Preços
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reequilíbrio de Preços</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="novo-valor" className="text-sm font-medium">
                        Novo Valor (R$)
                      </label>
                      <input
                        id="novo-valor"
                        type="number"
                        step="0.01"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="0.00"
                        defaultValue={selectedCombustivel?.valor}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="justificativa" className="text-sm font-medium">
                        Justificativa
                      </label>
                      <textarea
                        id="justificativa"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Justificativa para o reequilíbrio de preços"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          const novoValor = (document.getElementById("novo-valor") as HTMLInputElement).value
                          handleReequilibrio(novoValor)
                        }}
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N°</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Fim do Contrato</TableHead>
                    <TableHead>Secretaria</TableHead>
                    <TableHead>Combustível / Lubrificante</TableHead>
                    <TableHead>Qnt Prevista (L)</TableHead>
                    <TableHead>Acumulado</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Valor (R$)</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combustiveis.map((combustivel) => (
                    <TableRow
                      key={combustivel.id}
                      className={`cursor-pointer hover:bg-muted/50 ${selectedRow === combustivel.id ? "bg-muted" : ""}`}
                      onClick={() => handleRowClick(combustivel.id)}
                    >
                      <TableCell>{combustivel.id}</TableCell>
                      <TableCell>
                        <Badge variant={combustivel.ativo ? "default" : "outline"}>
                          {combustivel.ativo ? "Sim" : "Não"}
                        </Badge>
                      </TableCell>
                      <TableCell>{combustivel.fimContrato}</TableCell>
                      <TableCell>{combustivel.secretaria}</TableCell>
                      <TableCell className="font-medium">{combustivel.combustivel}</TableCell>
                      <TableCell>{combustivel.quantidadePrevista}</TableCell>
                      <TableCell>{combustivel.acumulado}</TableCell>
                      <TableCell>{combustivel.saldo}</TableCell>
                      <TableCell>{combustivel.valor}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => handleVisualizarClick(combustivel, e)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Rotas */}
        <TabsContent value="rotas" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Rotas Cadastradas</h2>

            <Dialog open={isNovaRotaOpen} onOpenChange={setIsNovaRotaOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Rota
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Cadastrar Rota</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label htmlFor="numero-rota" className="text-sm font-medium">
                        Número da Rota
                      </label>
                      <input
                        id="numero-rota"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Número da rota"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="nome-rota" className="text-sm font-medium">
                        Rota
                      </label>
                      <input
                        id="nome-rota"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Nome da rota"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        const numero = (document.getElementById("numero-rota") as HTMLInputElement).value
                        const nome = (document.getElementById("nome-rota") as HTMLInputElement).value
                        handleAddRota({ numero, nome })
                      }}
                    >
                      Salvar
                    </Button>
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
                    <TableHead>N°</TableHead>
                    <TableHead>Rota</TableHead>
                    <TableHead>Distância</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rotas.map((rota) => (
                    <TableRow key={rota.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{rota.id}</TableCell>
                      <TableCell className="font-medium">{rota.rota}</TableCell>
                      <TableCell>{rota.distancia}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Destinos */}
        <TabsContent value="destinos" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Destinos de Viagens</h2>

            <div className="flex items-center gap-2">
              <Dialog open={isNovoDestinoOpen} onOpenChange={setIsNovoDestinoOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Novo Destino Viagem</DialogTitle>
                  </DialogHeader>
                  {/* Formulário de novo destino aqui */}
                </DialogContent>
              </Dialog>

              <Button variant="outline" disabled>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>

              <Button variant="outline" disabled>
                Excluir
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Destino Final</TableHead>
                    <TableHead>Distância (km/hs)</TableHead>
                    <TableHead>Ambulância</TableHead>
                    <TableHead>Cadeirante</TableHead>
                    <TableHead>Caminhão</TableHead>
                    <TableHead>Carro</TableHead>
                    <TableHead>Moto</TableHead>
                    <TableHead>Ônibus</TableHead>
                    <TableHead>Van</TableHead>
                    <TableHead>Outro</TableHead>
                    <TableHead>Ativo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinos.map((destino) => (
                    <TableRow key={destino.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{destino.id}</TableCell>
                      <TableCell className="font-medium">{destino.destino}</TableCell>
                      <TableCell>{destino.distancia}</TableCell>
                      <TableCell>{destino.ambulancia ? "Sim" : "Não"}</TableCell>
                      <TableCell>{destino.cadeirante ? "Sim" : "Não"}</TableCell>
                      <TableCell>{destino.caminhao ? "Sim" : "Não"}</TableCell>
                      <TableCell>{destino.carro ? "Sim" : "Não"}</TableCell>
                      <TableCell>{destino.moto ? "Sim" : "Não"}</TableCell>
                      <TableCell>{destino.onibus ? "Sim" : "Não"}</TableCell>
                      <TableCell>{destino.van ? "Sim" : "Não"}</TableCell>
                      <TableCell>{destino.outro ? "Sim" : "Não"}</TableCell>
                      <TableCell>
                        <Badge variant={destino.ativo ? "default" : "outline"}>{destino.ativo ? "Sim" : "Não"}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para editar combustível */}
      <Dialog open={isEditarCombustivelOpen} onOpenChange={setIsEditarCombustivelOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Combustível / Lubrificante</DialogTitle>
          </DialogHeader>
          {selectedCombustivel && (
            <NovoCombustivelForm
              combustivel={{
                secretaria: selectedCombustivel.secretaria,
                tipoCombustivel: selectedCombustivel.combustivel,
                quantidadePrevista: selectedCombustivel.quantidadePrevista,
                valor: selectedCombustivel.valor,
                dataFim: new Date(selectedCombustivel.fimContrato.split("/").reverse().join("-")),
                ativo: selectedCombustivel.ativo,
                observacao: selectedCombustivel.observacoes || "",
              }}
              onSuccess={handleEditCombustivel}
              onCancel={() => setIsEditarCombustivelOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para visualizar detalhes do combustível */}
      <Dialog open={isVisualizarCombustivelOpen} onOpenChange={setIsVisualizarCombustivelOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Combustível / Lubrificante</DialogTitle>
          </DialogHeader>
          {selectedCombustivel && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Número</p>
                  <p className="font-medium">{selectedCombustivel.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={selectedCombustivel.ativo ? "default" : "outline"}>
                    {selectedCombustivel.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Fim do Contrato</p>
                  <p className="font-medium">{selectedCombustivel.fimContrato || "Não definido"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Secretaria</p>
                  <p className="font-medium">{selectedCombustivel.secretaria}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Combustível / Lubrificante</p>
                  <p className="font-medium">{selectedCombustivel.combustivel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Quantidade Prevista (L)</p>
                  <p className="font-medium">{selectedCombustivel.quantidadePrevista}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Quantidade Acumulada</p>
                  <p className="font-medium">{selectedCombustivel.acumulado || "0"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Saldo</p>
                  <p className="font-medium">{selectedCombustivel.saldo || "0"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Valor (R$)</p>
                  <p className="font-medium">{selectedCombustivel.valor}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Observações</p>
                <div className="rounded-md border border-input bg-background p-3">
                  <p>{selectedCombustivel.observacoes || "Nenhuma observação registrada."}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsVisualizarCombustivelOpen(false)}
                >
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
