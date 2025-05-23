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
import { StorageService } from "@/lib/storage-service"

// Usando a interface VeiculoRegistrado do serviço de armazenamento
import { VeiculoRegistrado } from "@/lib/storage-service"

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
    placa: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Função para corrigir o contador de veículos registrados
  const corrigirContadorVeiculosRegistrados = () => {
    console.log("Corrigindo contador de veículos registrados...")
    try {
      const storage = StorageService.getItem<{
        veiculosRegistrados?: VeiculoRegistrado[];
        counters?: {
          veiculosRegistrados?: number;
          [key: string]: number | undefined;
        };
        [key: string]: any;
      }>("sistema-gestao-data")
      
      if (storage) {
        // Verificar se a propriedade veiculosRegistrados existe
        if (!storage.veiculosRegistrados) {
          storage.veiculosRegistrados = []
        }
        
        // Verificar se a propriedade counters existe
        if (!storage.counters) {
          storage.counters = {}
        }
        
        // Verificar se o contador de veículos registrados existe
        if (!storage.counters.veiculosRegistrados) {
          storage.counters.veiculosRegistrados = 0
        }
        
        // Se existirem veículos e o contador for menor que o número máximo de IDs
        if (storage.veiculosRegistrados.length > 0) {
          const ids = storage.veiculosRegistrados.map((v: VeiculoRegistrado) => parseInt(v.id)).filter((id: number) => !isNaN(id))
          const maxId = ids.length > 0 ? Math.max(...ids) : 0
          
          // Se o contador for menor que o maior ID, atualizar
          if (storage.counters.veiculosRegistrados < maxId) {
            console.log(`Atualizando contador de veículos registrados de ${storage.counters.veiculosRegistrados} para ${maxId}`)
            storage.counters.veiculosRegistrados = maxId
            StorageService.setItem("sistema-gestao-data", storage)
          }
        }
      }
    } catch (error) {
      console.error("Erro ao corrigir contador de veículos registrados:", error)
    }
  }

  // Carrega veículos registrados do localStorage
  useEffect(() => {
    corrigirContadorVeiculosRegistrados() // Corrigir contador antes de carregar
    loadVeiculosRegistrados()
  }, [refreshKey])

  const loadVeiculosRegistrados = () => {
    try {
      console.log("Carregando veículos registrados...")
      const loadedVeiculos = storageService.getVeiculosRegistrados()
      console.log("Veículos registrados carregados:", loadedVeiculos)
      setVeiculos(loadedVeiculos)
    } catch (error) {
      console.error("Erro ao carregar veículos registrados:", error)
      toast({
        title: "Erro ao carregar veículos",
        description: "Não foi possível carregar a lista de veículos registrados.",
        variant: "destructive",
      })
      setVeiculos([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!novoVeiculo.marca || !novoVeiculo.modelo || !novoVeiculo.ano || !novoVeiculo.cor || !novoVeiculo.placa) {
      toast({
        title: "Erro ao registrar veículo",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingId) {
        // Atualizar veículo existente
        storageService.updateVeiculoRegistrado(editingId, {
          marca: novoVeiculo.marca,
          modelo: novoVeiculo.modelo,
          ano: novoVeiculo.ano,
          cor: novoVeiculo.cor,
          foto: novoVeiculo.foto,
          placa: novoVeiculo.placa,
        })

        toast({
          title: "Veículo atualizado com sucesso",
          description: `O veículo ${novoVeiculo.marca} ${novoVeiculo.modelo} foi atualizado.`,
        })
      } else {
        // Adicionar novo veículo
        storageService.addVeiculoRegistrado({
          marca: novoVeiculo.marca,
          modelo: novoVeiculo.modelo,
          ano: novoVeiculo.ano,
          cor: novoVeiculo.cor,
          foto: novoVeiculo.foto,
          placa: novoVeiculo.placa,
        })

        toast({
          title: "Veículo registrado com sucesso",
          description: `O veículo ${novoVeiculo.marca} ${novoVeiculo.modelo} foi registrado.`,
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
        placa: "",
      })
      setEditingId(null)
      setOpen(false)
      
      // Atualizar a lista de veículos
      setRefreshKey(oldKey => oldKey + 1)
    } catch (error) {
      console.error("Erro ao salvar veículo:", error)
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o veículo. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (veiculo: VeiculoRegistrado) => {
    setEditingId(veiculo.id)
    setNovoVeiculo({
      ...veiculo,
    })
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    try {
      storageService.deleteVeiculoRegistrado(id)
      toast({
        title: "Veículo removido com sucesso",
        description: "O veículo foi removido do sistema.",
      })
      // Atualizar a lista de veículos
      setRefreshKey(oldKey => oldKey + 1)
    } catch (error) {
      console.error("Erro ao excluir veículo:", error)
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o veículo. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                  placa: "",
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
                  <Label htmlFor="placa" className="text-right">
                    Placa
                  </Label>
                  <Input
                    id="placa"
                    value={novoVeiculo.placa}
                    onChange={(e) => setNovoVeiculo({ ...novoVeiculo, placa: e.target.value })}
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
                <TableHead>Placa</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
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
                    <TableCell>{veiculo.placa}</TableCell>
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
