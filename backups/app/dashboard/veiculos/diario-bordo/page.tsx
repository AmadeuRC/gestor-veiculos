"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { NovoDiarioBordoForm } from "@/components/novo-diario-bordo-form"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para a tabela
const diariosData = []

// Dados de exemplo para os veículos
const veiculosData = []

export default function DiarioBordoPage() {
  const searchParams = useSearchParams()
  const veiculoId = searchParams.get("veiculo")
  const veiculo = veiculoId ? veiculosData.find((v) => v.id === veiculoId) : null

  const [isNovoDiarioOpen, setIsNovoDiarioOpen] = useState(false)
  const { toast } = useToast()

  const handleAddDiario = (diario: any) => {
    toast({
      title: "Diário de bordo registrado",
      description: `O diário de bordo foi registrado com sucesso.`,
    })
    setIsNovoDiarioOpen(false)
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
          <DialogContent className="max-w-4xl">
            <DialogHeader>
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
                <TableHead>Relatório</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diariosData.map((diario) => (
                <TableRow key={diario.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>{diario.id}</TableCell>
                  <TableCell>{diario.data}</TableCell>
                  <TableCell>{diario.relatorio}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
