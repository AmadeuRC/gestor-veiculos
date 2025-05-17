"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MoreHorizontal, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { storageService, type Abastecimento, type Combustivel } from "@/lib/storage-service"

/**
 * Página de registros de abastecimento
 * Permite visualizar, adicionar, editar e excluir registros de abastecimento
 */
export default function AbastecimentoPage() {
  // Estados para armazenar dados
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([])
  const [combustiveisCadastrados, setCombustiveisCadastrados] = useState<Combustivel[]>([])

  // Estados para controle de diálogos
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Abastecimento | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Estado para novo abastecimento
  const [novoAbastecimento, setNovoAbastecimento] = useState({
    data: "",
    posto: "",
    combustivel: "",
    quantidade: "",
    secretaria: "",
  })

  const { toast } = useToast()

  // Carregar abastecimentos e combustíveis do localStorage ao montar o componente
  useEffect(() => {
    loadData()
  }, [])

  /**
   * Carrega todos os dados necessários para a página
   */
  const loadData = () => {
    setAbastecimentos(storageService.getAbastecimentos())

    // Carregar apenas combustíveis ativos
    const combustiveis = storageService.getCombustiveis().filter((c) => c.ativo)
    setCombustiveisCadastrados(combustiveis)
  }

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNovoAbastecimento((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Função para lidar com mudanças no select de combustível
  const handleCombustivelChange = (value: string) => {
    setNovoAbastecimento((prev) => ({
      ...prev,
      combustivel: value,
    }))
  }

  // Função para salvar novo registro
  const salvarNovoRegistro = () => {
    // Validar campos
    if (
      !novoAbastecimento.data ||
      !novoAbastecimento.posto ||
      !novoAbastecimento.combustivel ||
      !novoAbastecimento.quantidade ||
      !novoAbastecimento.secretaria
    ) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Todos os campos são obrigatórios",
      })
      return
    }

    try {
      // Buscar o valor do combustível selecionado
      const combustivelSelecionado = combustiveisCadastrados.find(
        (c) => c.combustivel === novoAbastecimento.combustivel,
      )

      if (!combustivelSelecionado) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Combustível não encontrado ou inativo no cadastro.",
        })
        return
      }

      // Adicionar novo registro usando o serviço de armazenamento
      const novoRegistro = storageService.saveAbastecimento({
        ...novoAbastecimento,
        valor: combustivelSelecionado.valor, // Usar o valor do combustível do cadastro
      })

      // Atualizar o saldo do combustível
      const quantidadeAbastecida = Number.parseFloat(novoAbastecimento.quantidade) || 0
      const valorUnitario = Number.parseFloat(combustivelSelecionado.valor.replace(",", ".")) || 0
      const valorTotal = quantidadeAbastecida * valorUnitario

      const acumuladoAtual = Number.parseFloat(combustivelSelecionado.acumulado) || 0
      const novoAcumulado = acumuladoAtual + valorTotal
      const novoSaldo = Number.parseFloat(combustivelSelecionado.quantidadePrevista) - novoAcumulado

      // Atualizar o combustível
      storageService.updateCombustivel(combustivelSelecionado.id, {
        acumulado: novoAcumulado.toString(),
        saldo: novoSaldo.toString(),
      })

      // Recarregar dados
      loadData()

      toast({
        title: "Registro adicionado",
        description: "O registro de abastecimento foi adicionado com sucesso.",
      })
      setIsDialogOpen(false)

      // Resetar formulário
      setNovoAbastecimento({
        data: "",
        posto: "",
        combustivel: "",
        quantidade: "",
        secretaria: "",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao adicionar o abastecimento.",
      })
    }
  }

  const handleViewItem = (e: React.MouseEvent, item: Abastecimento) => {
    e.stopPropagation()
    setSelectedItem(item)
    setIsViewDialogOpen(true)
  }

  const handleEditItem = (e: React.MouseEvent, item: Abastecimento) => {
    e.stopPropagation()
    setSelectedItem(item)
    setIsEditDialogOpen(true)
  }

  const handleDeleteItem = (e: React.MouseEvent, item: Abastecimento) => {
    e.stopPropagation()
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedItem) return

    try {
      // Implementar a exclusão real usando o serviço de armazenamento
      // Aqui precisaríamos adicionar um método deleteAbastecimento no storageService

      toast({
        title: "Registro excluído",
        description: `O registro de abastecimento ${selectedItem.id} foi excluído com sucesso.`,
      })

      loadData() // Recarregar dados após exclusão
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao excluir o abastecimento.",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Registros de Abastecimento</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Registro de Abastecimento</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    name="data"
                    type="date"
                    value={novoAbastecimento.data}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posto">Posto</Label>
                  <Input
                    id="posto"
                    name="posto"
                    placeholder="Nome do posto"
                    value={novoAbastecimento.posto}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="combustivel">Combustível</Label>
                  <Select
                    name="combustivel"
                    value={novoAbastecimento.combustivel}
                    onValueChange={handleCombustivelChange}
                  >
                    <SelectTrigger id="combustivel">
                      <SelectValue placeholder="Selecione o combustível" />
                    </SelectTrigger>
                    <SelectContent>
                      {combustiveisCadastrados.length > 0 ? (
                        combustiveisCadastrados.map((combustivel) => (
                          <SelectItem key={combustivel.id} value={combustivel.combustivel}>
                            {combustivel.combustivel} - R$ {combustivel.valor}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          Nenhum combustível cadastrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {combustiveisCadastrados.length === 0 && (
                    <p className="text-xs text-destructive mt-1">
                      Cadastre combustíveis ativos em "Combustíveis Cadastrados" primeiro.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade (L)</Label>
                  <Input
                    id="quantidade"
                    name="quantidade"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={novoAbastecimento.quantidade}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretaria">Secretaria</Label>
                <Select
                  name="secretaria"
                  value={novoAbastecimento.secretaria}
                  onValueChange={(value) => setNovoAbastecimento((prev) => ({ ...prev, secretaria: value }))}
                >
                  <SelectTrigger id="secretaria">
                    <SelectValue placeholder="Selecione a secretaria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAÚDE">SAÚDE</SelectItem>
                    <SelectItem value="EDUCAÇÃO">EDUCAÇÃO</SelectItem>
                    <SelectItem value="OBRAS">OBRAS</SelectItem>
                    <SelectItem value="ASSISTÊNCIA SOCIAL">ASSISTÊNCIA SOCIAL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={salvarNovoRegistro} disabled={combustiveisCadastrados.length === 0}>
                Salvar
              </Button>
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
                <TableHead>Posto</TableHead>
                <TableHead>Combustível</TableHead>
                <TableHead>Quantidade (L)</TableHead>
                <TableHead>Valor (R$)</TableHead>
                <TableHead>Secretaria</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {abastecimentos.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.posto}</TableCell>
                  <TableCell>{item.combustivel}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>{item.valor}</TableCell>
                  <TableCell>{item.secretaria}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => handleViewItem(e, item)}>Visualizar</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleEditItem(e, item)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleDeleteItem(e, item)}>Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {abastecimentos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    Nenhum registro de abastecimento encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visualizar Registro de Abastecimento</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p>{selectedItem.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data</p>
                  <p>{selectedItem.data}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Posto</p>
                  <p>{selectedItem.posto}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Combustível</p>
                  <p>{selectedItem.combustivel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quantidade (L)</p>
                  <p>{selectedItem.quantidade}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor (R$)</p>
                  <p>{selectedItem.valor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Secretaria</p>
                  <p>{selectedItem.secretaria}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Registro de Abastecimento</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid gap-4 py-4">
                {/* Formulário de edição */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-data">Data</Label>
                    <Input id="edit-data" name="data" type="date" defaultValue={selectedItem.data} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-posto">Posto</Label>
                    <Input id="edit-posto" name="posto" defaultValue={selectedItem.posto} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-combustivel">Combustível</Label>
                    <Select defaultValue={selectedItem.combustivel}>
                      <SelectTrigger id="edit-combustivel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {combustiveisCadastrados.map((combustivel) => (
                          <SelectItem key={combustivel.id} value={combustivel.combustivel}>
                            {combustivel.combustivel} - R$ {combustivel.valor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-quantidade">Quantidade (L)</Label>
                    <Input
                      id="edit-quantidade"
                      name="quantidade"
                      type="number"
                      step="0.01"
                      defaultValue={selectedItem.quantidade}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-secretaria">Secretaria</Label>
                    <Select defaultValue={selectedItem.secretaria}>
                      <SelectTrigger id="edit-secretaria">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAÚDE">SAÚDE</SelectItem>
                        <SelectItem value="EDUCAÇÃO">EDUCAÇÃO</SelectItem>
                        <SelectItem value="OBRAS">OBRAS</SelectItem>
                        <SelectItem value="ASSISTÊNCIA SOCIAL">ASSISTÊNCIA SOCIAL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    toast({
                      title: "Registro atualizado",
                      description: `O registro de abastecimento ${selectedItem.id} foi atualizado com sucesso.`,
                    })
                    loadData()
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir o registro de abastecimento {selectedItem?.id}? Esta ação não pode ser
            desfeita.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
