"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PDFExportUtil, PDFExportOptions, TableCellData } from "@/lib/utils/pdf-export.util"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Download, Eye } from "lucide-react"

interface PDFExportButtonProps {
  headers: string[]
  data: TableCellData[][]
  options?: PDFExportOptions
  buttonText?: string
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  withPreview?: boolean
}

export function PDFExportButton({
  headers,
  data,
  options = {},
  buttonText = "Exportar PDF",
  buttonVariant = "default",
  buttonSize = "default",
  withPreview = true,
}: PDFExportButtonProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleExport = async () => {
    setIsLoading(true)
    try {
      await PDFExportUtil.exportToPDF(headers, data, options)
    } catch (error) {
      console.error("Erro ao exportar PDF:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handlePreview = async () => {
    setIsLoading(true)
    try {
      const url = await PDFExportUtil.previewPDF(headers, data, options)
      setPreviewUrl(url)
      setIsPreviewOpen(true)
    } catch (error) {
      console.error("Erro ao gerar prévia do PDF:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <>
      {withPreview ? (
        <div className="flex items-center space-x-2">
          <Button
            variant={buttonVariant}
            size={buttonSize}
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
          <Button
            variant="outline"
            size={buttonSize}
            onClick={handlePreview}
            disabled={isLoading}
          >
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </Button>
        </div>
      ) : (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={handleExport}
          disabled={isLoading}
        >
          <FileText className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      )}
      
      {/* Dialog para prévia do PDF */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Prévia do documento</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-[70vh]"
                title="Prévia do PDF"
              />
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 