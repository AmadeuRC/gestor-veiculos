"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { NovoAbastecimentoForm } from "@/components/novo-abastecimento-form"
import { ExternalLink, FileSpreadsheet, MoreHorizontal, Plus, Trash, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { storageService } from "@/lib/storage-service"
import { PDFExportButton } from "@/components/ui/pdf-export-button"
import { format, isWithinInterval, parseISO } from "date-fns"
import { TableCellData } from "@/lib/utils/pdf-export.util"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PDFExportUtil } from "@/lib/utils/pdf-export.util"

// Definição de tipos para o Ticket
interface TicketResumo {
  hodometroFuncional: boolean;
  inicio: string;
  fim: string;
  rodado: string;
  media: string;
}

interface Ticket {
  id: string;
  data: Date | string;
  secretaria: string;
  departamento: string;
  motorista: string;
  veiculo: string;
  placaMotorista: string;
  resumo: TicketResumo;
  quantidade: string;
  combustivel: string;
  valor: string;
  total: string;
  hodometroDanificado: string;
  incluirDistancia: string;
  distancia: string;
  partida: string;
  partidaKm: string;
  destino: string;
  destinoKm: string;
  motivos: string;
  beneficiados: string;
  tipoRota: string;
}

// Atualizar a estrutura dos dados para incluir status do hodômetro
const ticketsData: Ticket[] = []

export default function TicketPage() {
  const [tickets, setTickets] = useState<Ticket[]>(ticketsData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportDateRange, setExportDateRange] = useState({
    startDate: format(new Date(new Date().setDate(1)), "yyyy-MM-dd"), // Primeiro dia do mês atual
    endDate: format(new Date(), "yyyy-MM-dd") // Hoje
  })
  const [isExporting, setIsExporting] = useState(false)
  
  const itemsPerPage = 10
  const { toast } = useToast()

  // Carregar tickets do armazenamento local ao inicializar
  useEffect(() => {
    const storedTickets = storageService.getItem<Ticket[]>("tickets") || []
    if (storedTickets.length > 0) {
      // Converter strings de data para objetos Date
      const parsedTickets = storedTickets.map((ticket) => ({
        ...ticket,
        data: ticket.data ? new Date(ticket.data) : new Date(),
      }))
      setTickets(parsedTickets)
    } else {
      // Se não houver tickets armazenados, salvar os dados iniciais
      storageService.setItem("tickets", ticketsData)
    }
  }, [])

  // Monitorar mudanças no estado do diálogo de exportação
  useEffect(() => {
    console.log("Estado do diálogo de exportação:", isExportDialogOpen);
  }, [isExportDialogOpen]);

  // Preparar dados para exportação de PDF com filtro de datas
  const prepareExportData = (startDate?: string, endDate?: string) => {
    const headers = [
      "Ticket", "Data", "Secretaria", "Departamento", "Placa/Motorista", 
      "Status Hodômetro", "Início", "Fim", "Distância", "Média",
      "Quantidade (L)", "Valor (R$)", "Total (R$)"
    ]
    
    // Filtrar por intervalo de datas, se fornecido
    let filteredTickets = [...tickets];
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      filteredTickets = tickets.filter(ticket => {
        const ticketDate = ticket.data instanceof Date ? 
          ticket.data : 
          (typeof ticket.data === 'string' ? new Date(ticket.data) : new Date());
        
        return ticketDate >= start && ticketDate <= end;
      });
    }
    
    // Ordenar por data (mais recente primeiro)
    filteredTickets.sort((a, b) => {
      const dateA = a.data instanceof Date ? a.data : new Date(a.data);
      const dateB = b.data instanceof Date ? b.data : new Date(b.data);
      return dateB.getTime() - dateA.getTime();
    });
    
    const data: TableCellData[][] = filteredTickets.map(ticket => [
      ticket.id ?? "",
      ticket.data instanceof Date ? format(ticket.data, "dd/MM/yyyy") : ticket.data ?? "",
      (ticket.secretaria === "saude" ? "SAÚDE" : ticket.secretaria) ?? "",
      ticket.departamento ?? "",
      ticket.placaMotorista ?? "",
      ticket.resumo.hodometroFuncional ? "Funcional" : "Danificado",
      ticket.resumo.inicio ?? "",
      ticket.resumo.fim ?? "",
      ticket.resumo.rodado ?? "",
      ticket.resumo.media ?? "",
      ticket.quantidade ?? "",
      ticket.valor ?? "",
      ticket.total ?? ""
    ])
    
    return { headers, data, count: filteredTickets.length }
  }
  
  // Função para exportar com intervalo de datas selecionado
  const handleExportWithDateRange = async () => {
    try {
      setIsExporting(true);
      const { startDate, endDate } = exportDateRange;
      const { headers, data, count } = prepareExportData(startDate, endDate);
      
      if (count === 0) {
        toast({
          variant: "destructive",
          title: "Nenhum registro encontrado",
          description: "Não há tickets no intervalo de datas selecionado."
        });
        setIsExporting(false);
        return;
      }
      
      const startDateFormatted = format(new Date(startDate), "dd/MM/yyyy");
      const endDateFormatted = format(new Date(endDate), "dd/MM/yyyy");
      
      await PDFExportUtil.exportToPDF(
        headers,
        data,
        {
          title: "Tickets de Abastecimento",
          subtitle: `Período: ${startDateFormatted} a ${endDateFormatted} - Total: ${count} registros`,
          filename: `tickets-abastecimento-${startDateFormatted}-a-${endDateFormatted}`,
          orientation: "landscape"
        }
      );
      
      toast({
        title: "Exportação concluída",
        description: `${count} tickets exportados com sucesso.`
      });
      
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os tickets."
      });
    } finally {
      setIsExporting(false);
    }
  }
  
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExportDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleRowClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
  }

  // Função específica para abrir o diálogo de exportação
  const openExportDialog = () => {
    console.log("Função openExportDialog chamada");
    setIsExportDialogOpen(true);
    console.log("Estado isExportDialogOpen definido como:", true);
  }

  const handleViewTicket = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation() // Impede a propagação do evento para a linha
    setSelectedTicket(ticket)
    setIsViewDialogOpen(true)
  }

  const handleEditTicket = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation() // Impede a propagação do evento para a linha
    setSelectedTicket(ticket)
    setIsEditDialogOpen(true)
  }

  const handleDeleteTicket = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation() // Impede a propagação do evento para a linha
    setSelectedTicket(ticket)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedTicket) {
      const updatedTickets = tickets.filter((ticket) => ticket.id !== selectedTicket.id)
      setTickets(updatedTickets)
      storageService.setItem("tickets", updatedTickets)

      toast({
        title: "Ticket excluído",
        description: `O ticket ${selectedTicket.id} foi excluído com sucesso.`,
      })
      setIsDeleteDialogOpen(false)
    }
  }

  // Modificar a função handleAddTicket para usar a quantidade corretamente
  const handleAddTicket = (data: Record<string, any> | undefined) => {
    // Verificar se data é undefined e fechar o diálogo se for
    if (!data) {
      setIsDialogOpen(false)
      return
    }

    // Buscar o valor do combustível do cadastro
    const combustiveis = storageService.getCombustiveis()
    const combustivelSelecionado = combustiveis.find((c) => c.combustivel === data.combustivel && c.ativo)

    if (!combustivelSelecionado) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar ticket",
        description: "Combustível não encontrado ou inativo no cadastro.",
      })
      return
    }

    // Usar o valor do combustível do cadastro
    const valorCombustivel = combustivelSelecionado.valor.replace(",", ".")
    const quantidade = data.quantidade

    // Calcular o total (quantidade * valor)
    const total = (Number.parseFloat(quantidade) * Number.parseFloat(valorCombustivel)).toFixed(2).replace(".", ",")

    // Buscar o departamento do funcionário
    const funcionarios = storageService.getEmployees();
    const funcionarioSelecionado = funcionarios.find(f => f.name === data.motorista);
    const departamento = funcionarioSelecionado ? funcionarioSelecionado.department : "Sem Departamento";
    
    // Criar um novo ticket com os dados do formulário
    const newTicket = {
      id: `00${tickets.length + 1}`,
      data: data.data,
      secretaria: data.secretaria,
      departamento: departamento,
      motorista: data.motorista,
      veiculo: data.veiculo,
      placaMotorista: `${data.veiculo.toUpperCase()} / ${data.motorista}`,
      resumo: {
        hodometroFuncional: data.hodometroDanificado === "nao",
        inicio: data.hodometroDanificado === "nao" ? `${data.partidaKm} km` : "",
        fim: data.hodometroDanificado === "nao" ? `${data.destinoKm} km` : "",
        rodado: `${data.distancia || "0"} km`,
        media: "0 km/l", // Calcular com base na quantidade e distância
      },
      quantidade: quantidade, // Usar a quantidade informada pelo usuário
      combustivel: data.combustivel,
      valor: combustivelSelecionado.valor, // Usar o valor do cadastro
      total: total, // Usar o total calculado
      hodometroDanificado: data.hodometroDanificado,
      incluirDistancia: data.incluirDistancia,
      distancia: data.distancia || "",
      partida: data.partida || "",
      partidaKm: data.partidaKm || "",
      destino: data.destino || "",
      destinoKm: data.destinoKm || "",
      motivos: data.motivos || "",
      beneficiados: data.beneficiados || "",
      tipoRota: data.tipoRota,
    }

    const updatedTickets = [...tickets, newTicket]
    setTickets(updatedTickets)
    storageService.setItem("tickets", updatedTickets)

    // Ir para a primeira página após adicionar um ticket para ver o item mais recente
    setCurrentPage(1)
    
    setIsDialogOpen(false)
    toast({
      title: "Ticket adicionado",
      description: `O ticket ${newTicket.id} foi adicionado com sucesso.`,
    })
  }

  // Modificar a função handleUpdateTicket para usar a quantidade corretamente
  const handleUpdateTicket = (data: Record<string, any> | undefined) => {
    // Verificar se data é undefined e fechar o diálogo se for
    if (!data) {
      setIsEditDialogOpen(false)
      return
    }

    if (selectedTicket) {
      // Buscar o valor do combustível do cadastro
      const combustiveis = storageService.getCombustiveis()
      const combustivelSelecionado = combustiveis.find((c) => c.combustivel === data.combustivel && c.ativo)

      if (!combustivelSelecionado) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar ticket",
          description: "Combustível não encontrado ou inativo no cadastro.",
        })
        return
      }

      // Usar o valor do combustível do cadastro
      const valorCombustivel = combustivelSelecionado.valor.replace(",", ".")
      const quantidade = data.quantidade

      // Calcular o total (quantidade * valor)
      const total = (Number.parseFloat(quantidade) * Number.parseFloat(valorCombustivel)).toFixed(2).replace(".", ",")

      // Buscar o departamento do funcionário
      const funcionarios = storageService.getEmployees();
      const funcionarioSelecionado = funcionarios.find(f => f.name === data.motorista);
      const departamento = funcionarioSelecionado ? funcionarioSelecionado.department : "Sem Departamento";
      
      // Atualizar o ticket com os dados do formulário
      const updatedTicket = {
        ...selectedTicket,
        data: data.data,
        secretaria: data.secretaria,
        departamento: departamento,
        motorista: data.motorista,
        veiculo: data.veiculo,
        placaMotorista: `${data.veiculo.toUpperCase()} / ${data.motorista}`,
        resumo: {
          hodometroFuncional: data.hodometroDanificado === "nao",
          inicio: data.hodometroDanificado === "nao" ? `${data.partidaKm} km` : "",
          fim: data.hodometroDanificado === "nao" ? `${data.destinoKm} km` : "",
          rodado: `${data.distancia || "0"} km`,
          media: selectedTicket.resumo.media, // Manter a média existente
        },
        quantidade: quantidade, // Usar a quantidade informada pelo usuário
        combustivel: data.combustivel,
        valor: combustivelSelecionado.valor, // Usar o valor do cadastro
        total: total, // Usar o total calculado
        hodometroDanificado: data.hodometroDanificado,
        incluirDistancia: data.incluirDistancia,
        distancia: data.distancia || "",
        partida: data.partida || "",
        partidaKm: data.partidaKm || "",
        destino: data.destino || "",
        destinoKm: data.destinoKm || "",
        motivos: data.motivos || "",
        beneficiados: data.beneficiados || "",
        tipoRota: data.tipoRota,
      }

      const updatedTickets = tickets.map((ticket) => (ticket.id === selectedTicket.id ? updatedTicket : ticket))

      setTickets(updatedTickets)
      storageService.setItem("tickets", updatedTickets)

      setIsEditDialogOpen(false)
      toast({
        title: "Ticket atualizado",
        description: `O ticket ${selectedTicket.id} foi atualizado com sucesso.`,
      })
    }
  }

  // Ordenar tickets por data (mais recente primeiro) e filtrar por página atual
  const sortedTickets = [...tickets].sort((a, b) => {
    const dateA = a.data instanceof Date ? a.data : new Date(a.data);
    const dateB = b.data instanceof Date ? b.data : new Date(b.data);
    return dateB.getTime() - dateA.getTime(); // Ordem decrescente (mais novo para mais velho)
  });

  // Calcular o total de páginas
  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);
  
  // Obter os tickets da página atual
  const paginatedTickets = sortedTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Obter dados para exportação
  const { headers: pdfHeaders, data: pdfData } = prepareExportData();

  // Função para mudar de página
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tickets de Abastecimento</h1>

        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Abastecimento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Novo Abastecimento</DialogTitle>
              </DialogHeader>
              <NovoAbastecimentoForm onSuccess={handleAddTicket} />
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild>
            <Link href="https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              ANP Agência Nacional do Petróleo
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar Tickets
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exportar Tickets</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm">Selecione o período de datas para exportação:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data Inicial</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={exportDateRange.startDate}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data Final</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={exportDateRange.endDate}
                      onChange={handleDateRangeChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleExportWithDateRange} disabled={isExporting}>
                  {isExporting ? "Exportando..." : "Exportar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Botão de teste para verificar o Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="ml-2">
                Teste Dialog
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Diálogo de Teste</DialogTitle>
              </DialogHeader>
              <p>Este é um diálogo de teste para verificar se os componentes Dialog estão funcionando.</p>
              <DialogFooter>
                <Button>Fechar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Importar da Planilha Excel
          </Button>

          <Button variant="outline" size="sm">
            <Trash className="mr-2 h-4 w-4" />
            Excluir Abastecimento
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Combustíveis
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {storageService
                .getCombustiveis()
                .filter((c) => c.ativo)
                .map((combustivel) => (
                  <DropdownMenuItem key={combustivel.id}>
                    <span>
                      {combustivel.secretaria} - {combustivel.combustivel} - R$ {combustivel.valor}
                    </span>
                  </DropdownMenuItem>
                ))}
              {storageService.getCombustiveis().filter((c) => c.ativo).length === 0 && (
                <DropdownMenuItem disabled>
                  <span>Nenhum combustível ativo cadastrado</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Secretaria</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Placa e Motorista</TableHead>
                <TableHead>Resumo</TableHead>
                <TableHead>Quantidade (L)</TableHead>
                <TableHead>Valor (R$)</TableHead>
                <TableHead>Total (R$)</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-muted/50" onClick={() => handleRowClick(ticket)}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>
                    {ticket.data instanceof Date ? ticket.data.toLocaleDateString("pt-BR") : ticket.data}
                  </TableCell>
                  <TableCell>{ticket.secretaria === "saude" ? "SAÚDE" : ticket.secretaria}</TableCell>
                  <TableCell>{ticket.departamento}</TableCell>
                  <TableCell>{ticket.placaMotorista}</TableCell>
                  {/* Atualizar a renderização da célula de resumo */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${
                            ticket.resumo.hodometroFuncional ? "bg-green-200" : "bg-red-200"
                          }`}
                        ></div>
                        <span
                          className={`text-xs font-medium ${
                            ticket.resumo.hodometroFuncional ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          Hodômetro: {ticket.resumo.hodometroFuncional ? "Funcional" : "Danificado"}
                        </span>
                      </div>
                      {ticket.resumo.hodometroFuncional ? (
                        <>
                          <p className="text-xs">Início: {ticket.resumo.inicio}</p>
                          <p className="text-xs">Fim: {ticket.resumo.fim}</p>
                        </>
                      ) : null}
                      <p className="text-xs">Rodado: {ticket.resumo.rodado}</p>
                      <p className="text-xs">Média: {ticket.resumo.media}</p>
                    </div>
                  </TableCell>
                  <TableCell>{ticket.quantidade}</TableCell>
                  <TableCell>{ticket.valor}</TableCell>
                  <TableCell>{ticket.total}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => handleViewTicket(e, ticket)}>Visualizar</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleEditTicket(e, ticket)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleDeleteTicket(e, ticket)}>Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {tickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    Nenhum ticket de abastecimento encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Diálogo de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visualizar Ticket de Abastecimento</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ticket</p>
                  <p>{selectedTicket.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data</p>
                  <p>
                    {selectedTicket.data instanceof Date
                      ? selectedTicket.data.toLocaleDateString("pt-BR")
                      : selectedTicket.data}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Secretaria</p>
                  <p>{selectedTicket.secretaria === "saude" ? "SAÚDE" : selectedTicket.secretaria}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departamento</p>
                  <p>{selectedTicket.departamento}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Placa e Motorista</p>
                  <p>{selectedTicket.placaMotorista}</p>
                </div>
                {/* Atualizar a visualização do diálogo */}
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Resumo</p>
                  <div className="space-y-1 mt-1">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          selectedTicket.resumo.hodometroFuncional ? "bg-green-200" : "bg-red-200"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${
                          selectedTicket.resumo.hodometroFuncional ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        Hodômetro: {selectedTicket.resumo.hodometroFuncional ? "Funcional" : "Danificado"}
                      </span>
                    </div>
                    {selectedTicket.resumo.hodometroFuncional ? (
                      <>
                        <p>Início: {selectedTicket.resumo.inicio}</p>
                        <p>Fim: {selectedTicket.resumo.fim}</p>
                      </>
                    ) : null}
                    <p>Rodado: {selectedTicket.resumo.rodado}</p>
                    <p>Média: {selectedTicket.resumo.media}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quantidade (L)</p>
                  <p>{selectedTicket.quantidade}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor (R$)</p>
                  <p>{selectedTicket.valor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total (R$)</p>
                  <p>{selectedTicket.total}</p>
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Ticket de Abastecimento</DialogTitle>
          </DialogHeader>
          {selectedTicket && <NovoAbastecimentoForm initialData={selectedTicket} onSuccess={handleUpdateTicket} />}
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir o ticket {selectedTicket?.id}? Esta ação não pode ser desfeita.</p>
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
