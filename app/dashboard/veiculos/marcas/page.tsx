"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { storageService } from "@/lib/storage-service"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Interface para os veículos registrados
interface VeiculoRegistrado {
  id: string
  marca: string
  modelo: string
  ano: string
  cor: string
  foto: string
}

export default function CadastroVeiculosPage() {
  const { toast } = useToast()
  const [veiculos, setVeiculos] = useState<VeiculoRegistrado[]>([])
  const [novoVeiculo, setNovoVeiculo] = useState<VeiculoRegistrado>({
    id: "",
    marca: "",
    modelo: "",
    ano: "",
    cor: "",
    foto: "/placeholder.svg?height=100&width=100",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Carregar veículos registrados do serviço de armazenamento
    const loadedVeiculos = storageService.getVeiculosRegistrados ? storageService.getVeiculosRegistrados() : []
    setVeiculos(loadedVeiculos)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!novoVeiculo.marca || !novoVeiculo.modelo || !novoVeiculo.ano || !novoVeiculo.cor) {
      toast({
        title: "Erro ao registrar veículo",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    // Simulação de adição/edição de veículo
    if (editingId) {
      // Atualizar veículo existente
      const updatedVeiculos = veiculos.map((v) => (v.id === editingId ? { ...novoVeiculo, id: editingId } : v))
      setVeiculos(updatedVeiculos)

      toast({
        title: "Veículo atualizado com sucesso",
        description: `O veículo ${novoVeiculo.marca} ${novoVeiculo.modelo} foi atualizado.`,
      })
    } else {
      // Adicionar novo veículo
      const newId = (veiculos.length + 1).toString()
      const newVeiculo = { ...novoVeiculo, id: newId }
      setVeiculos([...veiculos, newVeiculo])

      toast({
        title: "Veículo registrado com sucesso",
        description: `O veículo ${newVeiculo.marca} ${newVeiculo.modelo} foi registrado.`,
      })
    }

    // Limpar o formulário e fechar o diálogo
    setNovoVeiculo({
      id: "",
      marca: "",
      modelo: "",
      ano: "",
      cor: "",
      foto: "/placeholder.svg?height=100&width=100",
    })
    setEditingId(null)
    setOpen(false)
  }

  const handleEdit = (veiculo: VeiculoRegistrado) => {
    setEditingId(veiculo.id)
    setNovoVeiculo({
      ...veiculo,
    })
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    setVeiculos(veiculos.filter((v) => v.id !== id))

    toast({
      title: "Veículo removido com sucesso",
      description: "O veículo foi removido do sistema.",
    })
  }

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulação de upload de foto
    // Em um ambiente real, você implementaria o upload para um servidor
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setNovoVeiculo({
            ...novoVeiculo,
            foto: event.target.result as string,
          })
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Cadastro de Veículos</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setEditingId(null)
                setNovoVeiculo({
                  id: "",
                  marca: "",
                  modelo: "",
                  ano: "",
                  cor: "",
                  foto: "/placeholder.svg?height=100&width=100",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Veículo" : "Novo Veículo"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Edite as informações do veículo registrado." : "Registre um novo veículo no sistema."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="marca" className="text-right">
                    Marca
                  </Label>
                  <Input
                    id="marca"
                    value={novoVeiculo.marca}
                    onChange={(e) => setNovoVeiculo({ ...novoVeiculo, marca: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="modelo" className="text-right">
                    Modelo
                  </Label>
                  <Input
                    id="modelo"
                    value={novoVeiculo.modelo}
                    onChange={(e) => setNovoVeiculo({ ...novoVeiculo, modelo: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ano" className="text-right">
                    Ano
                  </Label>
                  <Input
                    id="ano"
                    value={novoVeiculo.ano}
                    onChange={(e) => setNovoVeiculo({ ...novoVeiculo, ano: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cor" className="text-right">
                    Cor
                  </Label>
                  <Input
                    id="cor"
                    value={novoVeiculo.cor}
                    onChange={(e) => setNovoVeiculo({ ...novoVeiculo, cor: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="foto" className="text-right">
                    Foto
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="h-16 w-16 overflow-hidden rounded-md border">
                      <img
                        src={novoVeiculo.foto || "/placeholder.svg"}
                        alt="Foto do veículo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <label htmlFor="foto-upload" className="cursor-pointer">
                      <div className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                        <Upload className="h-4 w-4" />
                        <span>Escolher foto</span>
                      </div>
                      <input
                        id="foto-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFotoChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? "Salvar" : "Registrar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Veículos Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum veículo registrado. Clique em "Novo Veículo" para adicionar.
                  </TableCell>
                </TableRow>
              ) : (
                veiculos.map((veiculo) => (
                  <TableRow key={veiculo.id}>
                    <TableCell>
                      <div className="h-10 w-10 overflow-hidden rounded-md">
                        <img
                          src={veiculo.foto || "/placeholder.svg?height=40&width=40"}
                          alt={`${veiculo.marca} ${veiculo.modelo}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{veiculo.marca}</TableCell>
                    <TableCell>{veiculo.modelo}</TableCell>
                    <TableCell>{veiculo.ano}</TableCell>
                    <TableCell>{veiculo.cor}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(veiculo)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(veiculo.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
