"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para a tabela
const destinosData = [
  {
    id: "1",
    destino: "Hospital Regional",
    distancia: "200 km",
    ambulancia: true,
    cadeirante: true,
    caminhao: false,
    carro: true,
    moto: false,
    onibus: false,
    van: true,
    outro: false,
    ativo: true,
  },
  {
    id: "2",
    destino: "UPA Central",
    distancia: "50 km",
    ambulancia: true,
    cadeirante: true,
    caminhao: false,
    carro: true,
    moto: true,
    onibus: false,
    van: true,
    outro: false,
    ativo: true,
  },
  {
    id: "3",
    destino: "Hospital Universitário",
    distancia: "150 km",
    ambulancia: true,
    cadeirante: true,
    caminhao: false,
    carro: true,
    moto: false,
    onibus: true,
    van: true,
    outro: false,
    ativo: true,
  },
  {
    id: "4",
    destino: "Clínica Especializada",
    distancia: "75 km",
    ambulancia: false,
    cadeirante: true,
    caminhao: false,
    carro: true,
    moto: false,
    onibus: false,
    van: true,
    outro: false,
    ativo: true,
  },
  {
    id: "5",
    destino: "Centro de Reabilitação",
    distancia: "120 km",
    ambulancia: true,
    cadeirante: true,
    caminhao: false,
    carro: true,
    moto: false,
    onibus: true,
    van: true,
    outro: false,
    ativo: false,
  },
]

export default function DestinosPage() {
  const [destinos, setDestinos] = useState(destinosData)
  const [isNovoDestinoOpen, setIsNovoDestinoOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const { toast } = useToast()

  const handleRowClick = (id: string) => {
    if (selectedRow === id) {
      setSelectedRow(null)
    } else {
      setSelectedRow(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Destinos de Viagens</h1>

        <div className="flex items-center gap-2">
          <Dialog open={isNovoDestinoOpen} onOpenChange={setIsNovoDestinoOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Destino
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Destino de Viagem</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="destino" className="text-sm font-medium">
                      Destino Final*
                    </label>
                    <input
                      id="destino"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Nome do destino"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="distancia" className="text-sm font-medium">
                      Distância (km)*
                    </label>
                    <input
                      id="distancia"
                      type="number"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Ex: 200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Veículos Permitidos</label>
                  <div className="grid grid-cols-2 gap-2 rounded-md border p-4 md:grid-cols-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="ambulancia" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="ambulancia" className="text-sm">
                        Ambulância
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="cadeirante" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="cadeirante" className="text-sm">
                        Cadeirante
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="caminhao" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="caminhao" className="text-sm">
                        Caminhão
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="carro" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="carro" className="text-sm">
                        Carro
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="moto" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="moto" className="text-sm">
                        Moto
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="onibus" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="onibus" className="text-sm">
                        Ônibus
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="van" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="van" className="text-sm">
                        Van
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="outro" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="outro" className="text-sm">
                        Outro
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="ativo" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                  <label htmlFor="ativo" className="text-sm font-medium">
                    Ativo
                  </label>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Destino adicionado",
                        description: "O novo destino foi adicionado com sucesso.",
                      })
                      setIsNovoDestinoOpen(false)
                    }}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            disabled={!selectedRow}
            onClick={(e) => {
              e.stopPropagation()
              // Adicione aqui a lógica para editar o destino selecionado
              // Por exemplo: setIsEditarOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>

          <Button
            variant="outline"
            disabled={!selectedRow}
            onClick={(e) => {
              e.stopPropagation()
              // Adicione aqui a lógica para excluir o destino selecionado
              // Por exemplo: setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
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
                <TableHead>Distância</TableHead>
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
                <TableRow
                  key={destino.id}
                  className={`cursor-pointer hover:bg-muted/50 ${selectedRow === destino.id ? "bg-muted" : ""}`}
                  onClick={() => handleRowClick(destino.id)}
                >
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
    </div>
  )
}
