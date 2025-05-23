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
 * Classe utilitária para exportação de PDFs
 */
export class PDFExportUtil {
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
} 