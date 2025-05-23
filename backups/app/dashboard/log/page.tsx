"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { storageService, type LogEntry } from "@/lib/storage-service"

export default function LogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])

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

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">LOG do Sistema</h2>
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
            {logs.map((log) => (
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
    </div>
  )
}
