"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Dados de exemplo para a tabela
const rotasData = [
  { id: "1", rota: "Sede - Hospital Regional", distancia: "200 km" },
  { id: "2", rota: "Sede - UPA", distancia: "50 km" },
  { id: "3", rota: "Sede - Hospital Universitário", distancia: "150 km" },
  { id: "4", rota: "Distrito A - Sede", distancia: "75 km" },
  { id: "5", rota: "Distrito B - Sede", distancia: "120 km" },
]

export default function RotasPage() {
  const [rotas, setRotas] = useState(rotasData)
  const [isNovaRotaOpen, setIsNovaRotaOpen] = useState(false)
  const [isEditarOpen, setIsEditarOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRota, setSelectedRota] = useState<(typeof rotasData)[0] | null>(null)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const { toast } = useToast()

  const handleRowClick = (id: string) => {
    if (selectedRow === id) {
      setSelectedRow(null)
    } else {
      setSelectedRow(id)
      setSelectedRota(rotas.find((r) => r.id === id) || null)
    }
  }

  const handleDelete = () => {
    if (selectedRota) {
      setRotas(rotas.filter((r) => r.id !== selectedRota.id))
      toast({
        title: "Rota excluída",
        description: `A rota ${selectedRota.rota} foi excluída com sucesso.`,
      })
      setSelectedRow(null)
      setSelectedRota(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleAddRota = (data: { rota: string; distancia: string }) => {
    const newRota = {
      id: (rotas.length + 1).toString(),
      rota: data.rota,
      distancia: data.distancia,
    }
    setRotas([...rotas, newRota])
    toast({
      title: "Rota adicionada",
      description: `A rota ${data.rota} foi adicionada com sucesso.`,
    })
    setIsNovaRotaOpen(false)
  }

  const handleUpdateRota = (data: { rota: string; distancia: string }) => {
    if (selectedRota) {
      setRotas(rotas.map((r) => (r.id === selectedRota.id ? { ...r, rota: data.rota, distancia: data.distancia } : r)))
      toast({
        title: "Rota atualizada",
        description: `A rota ${data.rota} foi atualizada com sucesso.`,
      })
      setIsEditarOpen(false)
      setSelectedRow(null)
      setSelectedRota(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rotas</h1>

        <Dialog open={isNovaRotaOpen} onOpenChange={setIsNovaRotaOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Rota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Rota</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="nome-rota" className="text-sm font-medium">
                    Rota*
                  </label>
                  <input
                    id="nome-rota"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Ex: Sede - Hospital Regional"
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
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    handleAddRota({
                      rota: (document.getElementById("nome-rota") as HTMLInputElement).value,
                      distancia: (document.getElementById("distancia") as HTMLInputElement).value + " km",
                    })
                  }
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
                <TableHead>ID</TableHead>
                <TableHead>Rota</TableHead>
                <TableHead>Distância</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rotas.map((rota) => (
                <TableRow
                  key={rota.id}
                  className={`cursor-pointer hover:bg-muted/50 ${selectedRow === rota.id ? "bg-muted" : ""}`}
                  onClick={() => handleRowClick(rota.id)}
                >
                  <TableCell>{rota.id}</TableCell>
                  <TableCell className="font-medium">{rota.rota}</TableCell>
                  <TableCell>{rota.distancia}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={selectedRow !== rota.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsEditarOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={selectedRow !== rota.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal para editar rota */}
      <Dialog open={isEditarOpen} onOpenChange={setIsEditarOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Rota</DialogTitle>
          </DialogHeader>
          {selectedRota && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-nome-rota" className="text-sm font-medium">
                    Rota*
                  </label>
                  <input
                    id="edit-nome-rota"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={selectedRota.rota}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-distancia" className="text-sm font-medium">
                    Distância (km)*
                  </label>
                  <input
                    id="edit-distancia"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={selectedRota.distancia.replace(" km", "")}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    handleUpdateRota({
                      rota: (document.getElementById("edit-nome-rota") as HTMLInputElement).value,
                      distancia: (document.getElementById("edit-distancia") as HTMLInputElement).value + " km",
                    })
                  }
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para excluir */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a rota {selectedRota?.rota}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
