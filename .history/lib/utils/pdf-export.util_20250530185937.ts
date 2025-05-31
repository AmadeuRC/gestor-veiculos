/**
 * Utilitário para exportação de dados para PDF utilizando jsPDF e autotable
 */
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { storageService } from '@/lib/storage-service'

/**
 * Interface para configurações padrão da exportação PDF
 */
export interface PDFExportOptions {
  filename?: string
  title?: string
  subtitle?: string
  orientation?: 'portrait' | 'landscape'
  pageSize?: string
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  showHeader?: boolean
  showFooter?: boolean
}

/**
 * Tipo para dados de células em tabelas
 */
export type TableCellData = string | number | boolean | null

/**
 * Interface para dados de ticket para exportação agrupada por mês
 */
export interface TicketData {
  id: string;
  data: Date | string;
  placaMotorista: string; // Placa Marca/Modelo
  statusHodometro: string;
  partida: string; // Partida (Cidade)
  destino: string; // Destino (Cidade)
  partidaKm: string; // Partida km
  destinoKm: string; // Destino km
  quantidade: string; // Quantidade (L)
  valor: string; // Valor do combustível (R$)
  total: string; // Valor Total (R$)
}

/**
 * Interface para dados de ticket individual para exportação
 */
export interface IndividualTicketData {
  id: string;
  data: Date | string;
  secretaria: string;
  departamento: string;
  motorista: string;
  veiculo: string; // placa
  placaMotorista: string;
  resumo: {
    hodometroFuncional: boolean;
    inicio: string;
    fim: string;
    rodado: string;
    media: string;
  };
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

/**
 * Interface para configurações do cabeçalho do ticket
 */
export interface TicketHeaderConfig {
  organizacao: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
}

/**
 * Configurações padrão do cabeçalho - fácil modificação para outras prefeituras
 */
const DEFAULT_HEADER_CONFIG: TicketHeaderConfig = {
  organizacao: "FUNDO MUNICIPAL DE SAÚDE",
  cnpj: "CNPJ: 08.680.752/0001-52",
  endereco: "R FLORIANO PEIXOTO, S/N - CENTRO - CEP: 55405-000 - Marajal-PE",
  telefone: "(81)36831025",
  email: "saudemarajal@best.com.br"
}

/**
 * Classe utilitária para exportação de PDFs
 */
export class PDFExportUtil {
  /**
   * Exporta tickets de abastecimento agrupados por mês com subtotais
   * @param tickets Array de dados dos tickets
   * @param options Opções de configuração do PDF
   * @returns Promise<void>
   */
  public static exportTicketsByMonth(
    tickets: TicketData[],
    options: PDFExportOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Configurações padrão
        const defaultOptions: PDFExportOptions = {
          filename: `tickets-abastecimento-${format(new Date(), 'dd-MM-yyyy-HHmmss')}`,
          orientation: 'landscape',
          pageSize: 'a4',
          margins: { top: 30, right: 10, bottom: 20, left: 10 },
          showHeader: true,
          showFooter: true
        }

        // Mesclar opções
        const mergedOptions = { ...defaultOptions, ...options }

        // Criar documento PDF
        const pdf = new jsPDF({
          orientation: mergedOptions.orientation,
          unit: 'mm',
          format: mergedOptions.pageSize
        })

        // Adicionar cabeçalho
        if (mergedOptions.showHeader) {
          this.addHeader(pdf, mergedOptions)
        }

        // Agrupar tickets por mês
        const ticketsByMonth = this.groupTicketsByMonth(tickets)
        
        let currentY = mergedOptions.showHeader ? 40 : 10
        let totalGeralPeriodo = 0 // Variável para somar todos os subtotais

        // Headers da tabela com nova estrutura
        const headers = [
          "Ticket", 
          "Data", 
          "Placa Marca/Modelo", 
          "Hodôm. Danif.", 
          "Partida / Destino", 
          "Partida km", 
          "Destino km", 
          "Quantidade (L)", 
          "Valor do combustível (R$)", 
          "Valor Total (R$)"
        ]

        // Processar cada mês
        Object.keys(ticketsByMonth).forEach((monthKey, index) => {
          const monthData = ticketsByMonth[monthKey]
          const monthName = this.getMonthName(monthKey)
          
          // Adicionar o subtotal valor do mês ao total geral do período
          totalGeralPeriodo += monthData.subtotals.valorTotalGasto
          
          // Se não é o primeiro mês, adicionar nova página
          if (index > 0) {
            pdf.addPage()
            currentY = 20
          }

          // Adicionar título do mês
          pdf.setFontSize(14)
          pdf.setFont('helvetica', 'bold')
          pdf.text(monthName, pdf.internal.pageSize.getWidth() / 2, currentY, { align: 'center' })
          currentY += 10

          // Adicionar tabela do mês
          autoTable(pdf, {
            head: [headers],
            body: monthData.rows,
            startY: currentY,
            margin: mergedOptions.margins,
            styles: {
              fontSize: 8,
              cellPadding: 2
            },
            headStyles: {
              fillColor: [44, 62, 80],
              textColor: 255,
              fontStyle: 'bold'
            },
            alternateRowStyles: {
              fillColor: [240, 240, 240]
            },
            didDrawPage: (data) => {
              currentY = data.cursor?.y || currentY
            }
          })

          // Adicionar subtotais do mês (sem Total Geral)
          currentY = (pdf as any).lastAutoTable.finalY + 10
          this.addMonthSubtotals(pdf, currentY, monthData.subtotals)
          currentY += 20 // Espaço extra após subtotais
        })

        // Adicionar Total Geral do Período no final de todas as tabelas
        if (Object.keys(ticketsByMonth).length > 0) {
          currentY += 10
          this.addTotalGeralPeriodo(pdf, currentY, totalGeralPeriodo)
        }

        // Adicionar rodapé
        if (mergedOptions.showFooter) {
          this.addFooter(pdf)
        }

        // Salvar log de exportação
        this.addExportLog(mergedOptions.title || 'Tickets de Abastecimento por Mês')

        // Salvar PDF
        pdf.save(`${mergedOptions.filename}.pdf`)
        resolve()
      } catch (error) {
        console.error('Erro ao exportar PDF por mês:', error)
        reject(error)
      }
    })
  }

  /**
   * Agrupa tickets por mês
   */
  private static groupTicketsByMonth(tickets: TicketData[]) {
    const grouped: { [key: string]: { rows: TableCellData[][], subtotals: any } } = {}
    
    tickets.forEach(ticket => {
      const ticketDate = ticket.data instanceof Date ? ticket.data : new Date(ticket.data)
      const monthKey = format(ticketDate, 'yyyy-MM')
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          rows: [],
          subtotals: {
            quantidade: 0,
            valorTotalGasto: 0, // Mudança: será a soma dos valores totais gastos
            kmRodado: 0
          }
        }
      }
      
      // Adicionar linha à tabela com nova estrutura
      const row: TableCellData[] = [
        ticket.id,
        format(ticketDate, "dd/MM/yyyy"),
        ticket.placaMotorista, // Placa Marca/Modelo
        ticket.statusHodometro === "Funcional" ? "Não" : "Sim", // Hodôm. Danif. (inverter lógica)
        ticket.partida && ticket.destino ? 
          `${ticket.partida} / ${ticket.destino}` : 
          "N/A", // Partida / Destino (cidades)
        ticket.partidaKm || "N/A", // Partida km
        ticket.destinoKm || "N/A", // Destino km
        ticket.quantidade, // Quantidade (L)
        ticket.valor, // Valor do combustível (R$)
        ticket.total // Valor Total (R$)
      ]
      
      grouped[monthKey].rows.push(row)
      
      // Calcular subtotais
      const quantidade = parseFloat(ticket.quantidade.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
      const total = parseFloat(ticket.total.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
      
      // Calcular km rodado como diferença entre destino e partida
      const partidaKm = parseFloat(ticket.partidaKm.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
      const destinoKm = parseFloat(ticket.destinoKm.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
      const kmRodado = destinoKm > partidaKm ? destinoKm - partidaKm : 0
      
      grouped[monthKey].subtotals.quantidade += quantidade
      grouped[monthKey].subtotals.valorTotalGasto += total // Somar os valores totais gastos
      grouped[monthKey].subtotals.kmRodado += kmRodado
    })
    
    return grouped
  }

  /**
   * Obtém o nome do mês em português
   */
  private static getMonthName(monthKey: string): string {
    const [year, month] = monthKey.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
    return format(date, 'MMMM yyyy', { locale: ptBR }).toUpperCase()
  }

  /**
   * Adiciona subtotais ao final de cada mês (sem Total Geral)
   */
  private static addMonthSubtotals(pdf: jsPDF, startY: number, subtotals: any): void {
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    
    const margin = 15
    let currentY = startY
    
    // Linha separadora
    pdf.setDrawColor(200, 200, 200)
    pdf.line(margin, currentY - 5, pdf.internal.pageSize.getWidth() - margin, currentY - 5)
    
    // Subtotal Quantidade
    pdf.text(`Subtotal Quantidade (L): ${subtotals.quantidade.toFixed(2)}`, margin, currentY)
    currentY += 5
    
    // Subtotal Valor (agora é a soma dos valores totais gastos)
    pdf.text(`Subtotal Valor: R$ ${subtotals.valorTotalGasto.toFixed(2)}`, margin, currentY)
    currentY += 5
    
    // Km Rodado no Período
    pdf.text(`Km Rodado no Período: ${subtotals.kmRodado.toFixed(2)} km`, margin, currentY)
  }

  /**
   * Adiciona o Total Geral do Período no final de todas as tabelas
   */
  private static addTotalGeralPeriodo(pdf: jsPDF, startY: number, totalGeral: number): void {
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    
    const margin = 15
    let currentY = startY
    
    // Linha separadora mais espessa para destacar
    pdf.setDrawColor(100, 100, 100)
    pdf.setLineWidth(1)
    pdf.line(margin, currentY - 5, pdf.internal.pageSize.getWidth() - margin, currentY - 5)
    
    // Total Geral do Período
    pdf.setTextColor(0, 0, 0)
    pdf.text(`TOTAL GERAL DO PERÍODO: R$ ${totalGeral.toFixed(2)}`, margin, currentY + 5)
    
    // Resetar configurações
    pdf.setLineWidth(0.1)
  }

  /**
   * Exporta dados para um documento PDF com tabela
   * @param headers Cabeçalhos da tabela
   * @param data Dados para a tabela
   * @param options Opções de configuração do PDF
   * @returns Promise<void>
   */
  public static exportToPDF(
    headers: string[],
    data: TableCellData[][],
    options: PDFExportOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Configurações padrão
        const defaultOptions: PDFExportOptions = {
          filename: `exportacao-${format(new Date(), 'dd-MM-yyyy-HHmmss')}`,
          orientation: 'portrait',
          pageSize: 'a4',
          margins: { top: 30, right: 10, bottom: 20, left: 10 },
          showHeader: true,
          showFooter: true
        }

        // Mesclar opções
        const mergedOptions = { ...defaultOptions, ...options }

        // Criar documento PDF
        const pdf = new jsPDF({
          orientation: mergedOptions.orientation,
          unit: 'mm',
          format: mergedOptions.pageSize
        })

        // Adicionar cabeçalho
        if (mergedOptions.showHeader) {
          this.addHeader(pdf, mergedOptions)
        }

        // Adicionar tabela
        autoTable(pdf, {
          head: [headers],
          body: data,
          startY: mergedOptions.showHeader ? 40 : 10,
          margin: mergedOptions.margins,
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          headStyles: {
            fillColor: [44, 62, 80],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240]
          }
        })

        // Adicionar rodapé
        if (mergedOptions.showFooter) {
          this.addFooter(pdf)
        }

        // Salvar log de exportação
        this.addExportLog(mergedOptions.title || 'Documento')

        // Salvar ou mostrar PDF
        pdf.save(`${mergedOptions.filename}.pdf`)
        resolve()
      } catch (error) {
        console.error('Erro ao exportar PDF:', error)
        reject(error)
      }
    })
  }

  /**
   * Adiciona um cabeçalho ao documento PDF
   * @param pdf Documento PDF
   * @param options Opções de configuração
   */
  private static addHeader(pdf: jsPDF, options: PDFExportOptions): void {
    const currentDate = format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })
    
    // Título
    if (options.title) {
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text(options.title, pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' })
    }
    
    // Subtítulo
    if (options.subtitle) {
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(options.subtitle, pdf.internal.pageSize.getWidth() / 2, 22, { align: 'center' })
    }
    
    // Data de geração
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'italic')
    pdf.text(`Gerado em: ${currentDate}`, pdf.internal.pageSize.getWidth() - 15, 10, { align: 'right' })
  }

  /**
   * Adiciona um rodapé ao documento PDF
   * @param pdf Documento PDF
   */
  private static addFooter(pdf: jsPDF): void {
    const totalPages = pdf.internal.pages.length - 1
    
    // Adicionar numeração de páginas em todas as páginas
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text(
        `Página ${i} de ${totalPages}`,
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }
  }

  /**
   * Adiciona um registro de log de exportação
   * @param documentType Tipo de documento exportado
   */
  private static addExportLog(documentType: string): void {
    storageService.addLog(
      'Exportação de Documento',
      'Sistema',
      `Exportação de ${documentType} em PDF realizada com sucesso`
    )
  }

  /**
   * Abre uma prévia do PDF em uma nova janela
   * @param headers Cabeçalhos da tabela
   * @param data Dados para a tabela
   * @param options Opções de configuração do PDF
   * @returns Promise<string> URL do PDF
   */
  public static previewPDF(
    headers: string[],
    data: TableCellData[][],
    options: PDFExportOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Configurações padrão
        const defaultOptions: PDFExportOptions = {
          filename: `exportacao-${format(new Date(), 'dd-MM-yyyy-HHmmss')}`,
          orientation: 'portrait',
          pageSize: 'a4',
          margins: { top: 30, right: 10, bottom: 20, left: 10 },
          showHeader: true,
          showFooter: true
        }

        // Mesclar opções
        const mergedOptions = { ...defaultOptions, ...options }

        // Criar documento PDF
        const pdf = new jsPDF({
          orientation: mergedOptions.orientation,
          unit: 'mm',
          format: mergedOptions.pageSize
        })

        // Adicionar cabeçalho
        if (mergedOptions.showHeader) {
          this.addHeader(pdf, mergedOptions)
        }

        // Adicionar tabela
        autoTable(pdf, {
          head: [headers],
          body: data,
          startY: mergedOptions.showHeader ? 40 : 10,
          margin: mergedOptions.margins,
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          headStyles: {
            fillColor: [44, 62, 80],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240]
          }
        })

        // Adicionar rodapé
        if (mergedOptions.showFooter) {
          this.addFooter(pdf)
        }

        // Gerar URL para o PDF
        const pdfOutput = pdf.output('datauristring')
        resolve(pdfOutput)
      } catch (error) {
        console.error('Erro ao gerar prévia do PDF:', error)
        reject(error)
      }
    })
  }

  /**
   * Exporta um ticket individual com 3 vias seguindo o molde fornecido
   */
  public static exportIndividualTicket(
    ticketData: IndividualTicketData,
    currentUser: string,
    headerConfig: TicketHeaderConfig = DEFAULT_HEADER_CONFIG
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Criar documento PDF em formato A4 retrato
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        })

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        
        // Definir as 3 vias
        const vias = [
          { title: "PRIMEIRA VIA - POSTO", showHodometro: false, showDestinos: false },
          { title: "SEGUNDA VIA - CONTROLE INTERNO", showHodometro: true, showDestinos: false },
          { title: "TERCEIRA VIA - SETOR DE TRANSPORTES", showHodometro: true, showDestinos: true }
        ]

        let currentY = 10

        // Gerar cada via
        vias.forEach((via, index) => {
          if (index > 0) {
            // Adicionar linha pontilhada de separação
            this.addDottedLine(pdf, currentY - 5, pageWidth)
            currentY += 5
          }

          // Adicionar cabeçalho da via
          currentY = this.addTicketHeader(pdf, currentY, headerConfig, pageWidth)
          
          // Adicionar título da via
          currentY = this.addViaTitle(pdf, currentY, via.title, ticketData.id, pageWidth)
          
          // Adicionar dados principais do ticket
          currentY = this.addMainTicketData(pdf, currentY, ticketData, pageWidth)
          
          // Adicionar seção de hodômetro se necessário
          if (via.showHodometro) {
            currentY = this.addHodometroSection(pdf, currentY, ticketData, pageWidth)
          }
          
          // Adicionar tabela de destinos se necessário
          if (via.showDestinos) {
            currentY = this.addDestinosTable(pdf, currentY, ticketData, pageWidth)
          }
          
          // Adicionar rodapé da via
          currentY = this.addTicketFooter(pdf, currentY, currentUser, pageWidth)
          
          currentY += 15 // Espaço entre vias
        })

        // Salvar log de exportação
        this.addExportLog(`Ticket Individual - ${ticketData.id}`)

        // Salvar PDF
        const filename = `ticket-${ticketData.id}-${format(new Date(), 'dd-MM-yyyy-HHmmss')}`
        pdf.save(`${filename}.pdf`)
        resolve()
      } catch (error) {
        console.error('Erro ao exportar ticket individual:', error)
        reject(error)
      }
    })
  }

  /**
   * Adiciona o cabeçalho do ticket
   */
  private static addTicketHeader(pdf: jsPDF, startY: number, config: TicketHeaderConfig, pageWidth: number): number {
    let currentY = startY
    
    // Espaço reservado para logo (30x30mm)
    pdf.setDrawColor(200, 200, 200)
    pdf.rect(10, currentY, 30, 30)
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text("LOGO", 25, currentY + 17, { align: 'center' })
    
    // Dados da organização
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text(config.organizacao, 45, currentY + 8)
    
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${config.cnpj} - ${config.email} - ${config.telefone}`, 45, currentY + 15)
    pdf.text(config.endereco, 45, currentY + 20)
    
    // Linha separadora
    pdf.setDrawColor(0, 0, 0)
    pdf.line(10, currentY + 35, pageWidth - 10, currentY + 35)
    
    return currentY + 40
  }

  /**
   * Adiciona o título da via e número do ticket
   */
  private static addViaTitle(pdf: jsPDF, startY: number, viaTitle: string, ticketId: string, pageWidth: number): number {
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    const titleText = `${viaTitle} | TICKET DE ABASTECIMENTO Nº ${ticketId}`
    pdf.text(titleText, pageWidth / 2, startY + 5, { align: 'center' })
    
    return startY + 15
  }

  /**
   * Adiciona os dados principais do ticket
   */
  private static addMainTicketData(pdf: jsPDF, startY: number, ticket: IndividualTicketData, pageWidth: number): number {
    const boxX = 15
    const boxY = startY
    const boxWidth = pageWidth - 30
    const boxHeight = 45
    const cornerRadius = 3
    
    // Desenhar caixa com bordas arredondadas
    pdf.setDrawColor(0, 0, 0)
    pdf.setLineWidth(0.5)
    this.drawRoundedRect(pdf, boxX, boxY, boxWidth, boxHeight, cornerRadius)
    
    // Buscar dados do veículo para marca e modelo
    const vehicleData = this.getVehicleData(ticket.veiculo)
    
    // Dados do ticket
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    const dataFormatada = ticket.data instanceof Date 
      ? format(ticket.data, 'dd/MM/yyyy', { locale: ptBR })
      : format(new Date(ticket.data), 'dd/MM/yyyy', { locale: ptBR })
    
    // Primeira linha: Secretaria, Dpto, Data
    let textY = boxY + 10
    pdf.setFont('helvetica', 'bold')
    pdf.text("Secretaria:", boxX + 5, textY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(ticket.secretaria, boxX + 28, textY)
    
    pdf.setFont('helvetica', 'bold')
    pdf.text("Dpto:", boxX + 65, textY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(ticket.departamento, boxX + 80, textY)
    
    pdf.setFont('helvetica', 'bold')
    pdf.text("Data:", boxX + 120, textY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(dataFormatada, boxX + 135, textY)
    
    // Segunda linha: Motorista
    textY += 8
    pdf.setFont('helvetica', 'bold')
    pdf.text("Motorista:", boxX + 5, textY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(ticket.motorista, boxX + 28, textY)
    
    // Terceira linha: CNH, Categoria, Placa, Nº, Marca, Modelo
    textY += 8
    pdf.setFont('helvetica', 'bold')
    pdf.text("CNH:", boxX + 5, textY)
    
    pdf.text("Categoria:", boxX + 40, textY)
    
    pdf.text("Placa:", boxX + 80, textY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(ticket.veiculo, boxX + 95, textY)
    
    pdf.setFont('helvetica', 'bold')
    pdf.text("Nº", boxX + 125, textY)
    
    pdf.text("Marca:", boxX + 140, textY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(vehicleData.marca, boxX + 155, textY)
    
    pdf.setFont('helvetica', 'bold')
    pdf.text("Modelo:", boxX + 5, textY + 8)
    pdf.setFont('helvetica', 'normal')
    pdf.text(vehicleData.modelo, boxX + 25, textY + 8)
    
    // Quarta linha: Combustível, Quantidade, Valor, Total
    textY += 16
    pdf.setFont('helvetica', 'bold')
    pdf.text("Combustível:", boxX + 5, textY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(ticket.combustivel, boxX + 32, textY)
    
    pdf.setFont('helvetica', 'bold')
    pdf.text("Quantidade:", boxX + 70, textY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${ticket.quantidade} L`, boxX + 98, textY)
    
    pdf.setFont('helvetica', 'bold')
    pdf.text("Valor:", boxX + 130, textY)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`R$ ${ticket.valor}`, boxX + 145, textY)
    
    pdf.setFont('helvetica', 'bold')
    pdf.text("Total:", boxX + 5, textY + 8)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`R$ ${ticket.total}`, boxX + 20, textY + 8)
    
    // Linha horizontal separadora dentro da caixa
    pdf.setDrawColor(0, 0, 0)
    pdf.line(boxX + 5, boxY + boxHeight - 8, boxX + boxWidth - 5, boxY + boxHeight - 8)
    
    return startY + boxHeight + 15
  }

  /**
   * Busca dados do veículo (marca e modelo) baseado na placa
   */
  private static getVehicleData(placa: string): { marca: string; modelo: string } {
    try {
      // Importar o storageService se necessário
      const { storageService } = require('@/lib/storage-service')
      
      // Buscar nos veículos registrados
      const veiculos = storageService.getVeiculos() || []
      const veiculo = veiculos.find((v: any) => 
        v && v.placa && v.placa.trim().toLowerCase() === placa.trim().toLowerCase()
      )
      
      if (veiculo) {
        return {
          marca: veiculo.marca || '',
          modelo: veiculo.modelo || ''
        }
      }
      
      // Fallback para veículos registrados alternativos
      const veiculosRegistrados = storageService.getVeiculosRegistrados() || []
      const veiculoRegistrado = veiculosRegistrados.find((v: any) =>
        v && v.placa && v.placa.trim().toLowerCase() === placa.trim().toLowerCase()
      )
      
      if (veiculoRegistrado) {
        return {
          marca: veiculoRegistrado.marca || '',
          modelo: veiculoRegistrado.modelo || ''
        }
      }
    } catch (error) {
      console.warn('Erro ao buscar dados do veículo:', error)
    }
    
    return { marca: '', modelo: '' }
  }

  /**
   * Desenha um retângulo com bordas arredondadas
   */
  private static drawRoundedRect(pdf: jsPDF, x: number, y: number, width: number, height: number, radius: number): void {
    pdf.lines([
      [radius, 0],
      [width - 2 * radius, 0],
      [radius, 0, radius, -radius, 0, -radius], // top-right corner
      [0, -(height - 2 * radius)],
      [0, -radius, -radius, -radius, -radius, 0], // bottom-right corner
      [-(width - 2 * radius), 0],
      [-radius, 0, -radius, radius, 0, radius], // bottom-left corner
      [0, height - 2 * radius],
      [0, radius, radius, radius, radius, 0] // top-left corner
    ], x + radius, y, [1, 1], null, true)
  }

  /**
   * Adiciona a seção de hodômetro danificado
   */
  private static addHodometroSection(pdf: jsPDF, startY: number, ticket: IndividualTicketData, pageWidth: number): number {
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    
    const hodometroStatus = ticket.resumo.hodometroFuncional ? "Não" : "Sim"
    pdf.text(`Hodômetro Danificado: ${hodometroStatus}`, 15, startY)
    
    return startY + 10
  }

  /**
   * Adiciona a tabela de partida e destino
   */
  private static addDestinosTable(pdf: jsPDF, startY: number, ticket: IndividualTicketData, pageWidth: number): number {
    const tableX = 15
    const tableY = startY
    const tableWidth = pageWidth - 30
    const headerHeight = 8
    const rowHeight = 15
    
    // Cabeçalho da tabela
    pdf.setDrawColor(0, 0, 0)
    pdf.rect(tableX, tableY, tableWidth * 0.3, headerHeight)
    pdf.rect(tableX + tableWidth * 0.3, tableY, tableWidth * 0.7, headerHeight)
    
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.text("Partida", tableX + (tableWidth * 0.15), tableY + 5, { align: 'center' })
    pdf.text("Destino", tableX + tableWidth * 0.3 + (tableWidth * 0.35), tableY + 5, { align: 'center' })
    
    // Dados da tabela
    pdf.rect(tableX, tableY + headerHeight, tableWidth * 0.3, rowHeight)
    pdf.rect(tableX + tableWidth * 0.3, tableY + headerHeight, tableWidth * 0.7, rowHeight)
    
    pdf.setFont('helvetica', 'normal')
    pdf.text(ticket.partida || "Marajal", tableX + 2, tableY + headerHeight + 8)
    pdf.text(ticket.destino || "", tableX + tableWidth * 0.3 + 2, tableY + headerHeight + 8)
    
    return startY + headerHeight + rowHeight + 10
  }

  /**
   * Adiciona o rodapé do ticket com assinaturas e linhas
   */
  private static addTicketFooter(pdf: jsPDF, startY: number, currentUser: string, pageWidth: number): number {
    const footerY = startY + 20
    const sectionWidth = (pageWidth - 30) / 3
    const startX = 15
    const lineLength = sectionWidth - 10
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setDrawColor(0, 0, 0)
    pdf.setLineWidth(0.5)
    
    // Primeira seção - Usuário
    const userX = startX + sectionWidth * 0.5
    pdf.line(userX - lineLength/2, footerY, userX + lineLength/2, footerY)
    pdf.text(currentUser, userX, footerY + 8, { align: 'center' })
    
    // Segunda seção - Posto  
    const postoX = startX + sectionWidth * 1.5
    pdf.line(postoX - lineLength/2, footerY, postoX + lineLength/2, footerY)
    pdf.text("Posto", postoX, footerY + 8, { align: 'center' })
    
    // Terceira seção - Fiscal
    const fiscalX = startX + sectionWidth * 2.5
    pdf.line(fiscalX - lineLength/2, footerY, fiscalX + lineLength/2, footerY)
    pdf.text("Fiscal", fiscalX, footerY + 8, { align: 'center' })
    
    return footerY + 15
  }

  /**
   * Adiciona linha pontilhada de separação
   */
  private static addDottedLine(pdf: jsPDF, y: number, pageWidth: number): void {
    pdf.setDrawColor(0, 0, 0)
    const dashLength = 2
    const gapLength = 2
    
    for (let x = 15; x < pageWidth - 15; x += dashLength + gapLength) {
      pdf.line(x, y, Math.min(x + dashLength, pageWidth - 15), y)
    }
  }
} 