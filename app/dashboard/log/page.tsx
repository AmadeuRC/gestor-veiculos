"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { storageService, type LogEntry } from "@/lib/storage-service"
import { PDFExportButton } from "@/components/ui/pdf-export-button"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function LogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    // Carregar logs do serviço de armazenamento
    const loadedLogs = storageService.getLogs()
    setLogs(loadedLogs)
  }, [])

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "dd/MM/yyyy HH:mm:ss", { locale: ptBR })
  }

  // Preparar dados para exportação
  const prepareExportData = () => {
    const headers = ["Data/Hora", "Ação", "Usuário", "Detalhes"]
    const data = logs.map(log => [
      formatDate(log.timestamp),
      log.action ?? "",
      log.user ?? "",
      log.details ?? ""
    ])
    return { headers, data }
  }

  // Lógica de paginação
  const totalPages = Math.ceil(logs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = logs.slice(startIndex, endIndex)

  // Funções para navegação entre páginas
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const { headers, data } = prepareExportData()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">LOG do Sistema</h2>
        <PDFExportButton 
          headers={headers}
          data={data}
          options={{
            title: "Log do Sistema",
            subtitle: "Registro de atividades",
            filename: `log-sistema-${format(new Date(), "dd-MM-yyyy")}`
          }}
          buttonText="Exportar Logs"
          withPreview={true}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Data/Hora</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{formatDate(log.timestamp)}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {logs.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {startIndex + 1}-{Math.min(endIndex, logs.length)} de {logs.length} registros
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
