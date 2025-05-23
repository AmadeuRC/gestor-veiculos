"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
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

// Interface para o tipo de Destino
interface Destino {
  id: string;
  destino: string;
  distancia: string;
  ambulancia: boolean;
  cadeirante: boolean;
  caminhao: boolean;
  carro: boolean;
  moto: boolean;
  onibus: boolean;
  van: boolean;
  outro: boolean;
  ativo: boolean;
}

// Chave para armazenamento no localStorage
const STORAGE_KEY = 'destinos_viagens';
const NEXT_ID_KEY = 'destinos_proximo_id';

export default function DestinosPage() {
  const [destinos, setDestinos] = useState<Destino[]>([])
  const [isNovoDestinoOpen, setIsNovoDestinoOpen] = useState(false)
  const [isEditarDestinoOpen, setIsEditarDestinoOpen] = useState(false)
  const [isExcluirDestinoOpen, setIsExcluirDestinoOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Estado para novo destino
  const [novoDestino, setNovoDestino] = useState<Destino>({
    id: "",
    destino: "",
    distancia: "",
    ambulancia: false,
    cadeirante: false,
    caminhao: false,
    carro: false,
    moto: false,
    onibus: false,
    van: false,
    outro: false,
    ativo: true,
  })
  
  // Ref para armazenar o próximo ID
  const nextIdRef = useRef(6) // Começando do 6 já que temos 5 itens de exemplo
  
  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    // Verificar se estamos no navegador (client-side)
    if (typeof window !== 'undefined') {
      // Carregar os destinos do localStorage ou usar os dados de exemplo
      const savedDestinos = localStorage.getItem(STORAGE_KEY);
      if (savedDestinos) {
        setDestinos(JSON.parse(savedDestinos));
      } else {
        // Se não houver dados salvos, usar os dados de exemplo
        setDestinos(destinosData);
        // E salvar no localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(destinosData));
      }
      
      // Carregar o próximo ID ou usar o valor padrão
      const savedNextId = localStorage.getItem(NEXT_ID_KEY);
      if (savedNextId) {
        nextIdRef.current = parseInt(savedNextId);
      } else {
        localStorage.setItem(NEXT_ID_KEY, nextIdRef.current.toString());
      }
    }
  }, []);

  // Atualizar o localStorage quando destinos mudarem
  useEffect(() => {
    if (destinos.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(destinos));
    }
  }, [destinos]);
  
  // Carregar destino para edição quando uma linha for selecionada e o modal de edição aberto
  useEffect(() => {
    if (isEditarDestinoOpen && selectedRow) {
      const destinoParaEditar = destinos.find(d => d.id === selectedRow);
      if (destinoParaEditar) {
        // Remover o "km" da distância para exibir apenas o número no input
        const distanciaSemKm = destinoParaEditar.distancia.replace(" km", "");
        
        setNovoDestino({
          ...destinoParaEditar,
          distancia: distanciaSemKm
        });
      }
    }
  }, [isEditarDestinoOpen, selectedRow, destinos]);
  
  // Reiniciar o form ao fechar o diálogo
  useEffect(() => {
    if (!isNovoDestinoOpen && !isEditarDestinoOpen) {
      setNovoDestino({
        id: "",
        destino: "",
        distancia: "",
        ambulancia: false,
        cadeirante: false,
        caminhao: false,
        carro: false,
        moto: false,
        onibus: false,
        van: false,
        outro: false,
        ativo: true,
      })
    }
  }, [isNovoDestinoOpen, isEditarDestinoOpen])

  const handleRowClick = (id: string) => {
    if (selectedRow === id) {
      setSelectedRow(null)
    } else {
      setSelectedRow(id)
    }
  }
  
  // Função para lidar com mudanças nos inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    
    setNovoDestino(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))
  }
  
  // Função para salvar o novo destino
  const salvarNovoDestino = () => {
    // Validação básica
    if (!novoDestino.destino || !novoDestino.distancia) {
      toast({
        title: "Erro ao adicionar",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }
    
    // Gerar ID único
    const id = nextIdRef.current.toString()
    nextIdRef.current += 1
    
    // Atualizar o próximo ID no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(NEXT_ID_KEY, nextIdRef.current.toString());
    }
    
    // Criar o objeto com os dados do form
    const novoDestinoCompleto: Destino = {
      ...novoDestino,
      id,
      distancia: `${novoDestino.distancia} km`
    }
    
    // Adicionar à lista
    setDestinos(prev => [...prev, novoDestinoCompleto])
    
    toast({
      title: "Destino adicionado",
      description: "O novo destino foi adicionado com sucesso.",
    })
    
    setIsNovoDestinoOpen(false)
  }
  
  // Função para atualizar um destino existente
  const atualizarDestino = () => {
    // Validação básica
    if (!novoDestino.destino || !novoDestino.distancia) {
      toast({
        title: "Erro ao atualizar",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }
    
    // Atualizar o destino mantendo o mesmo ID
    const destinoAtualizado: Destino = {
      ...novoDestino,
      distancia: `${novoDestino.distancia} km`
    }
    
    // Atualizar a lista
    setDestinos(prev => 
      prev.map(destino => 
        destino.id === destinoAtualizado.id ? destinoAtualizado : destino
      )
    )
    
    toast({
      title: "Destino atualizado",
      description: "O destino foi atualizado com sucesso.",
    })
    
    setIsEditarDestinoOpen(false)
    setSelectedRow(null)
  }
  
  // Função para excluir um destino
  const excluirDestino = () => {
    if (!selectedRow) return;
    
    // Remover o destino da lista
    setDestinos(prev => prev.filter(destino => destino.id !== selectedRow));
    
    toast({
      title: "Destino excluído",
      description: "O destino foi excluído com sucesso.",
    })
    
    setIsExcluirDestinoOpen(false)
    setSelectedRow(null)
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
                      value={novoDestino.destino}
                      onChange={handleInputChange}
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
                      value={novoDestino.distancia}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Ex: 200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Veículos Permitidos</label>
                  <div className="grid grid-cols-2 gap-2 rounded-md border p-4 md:grid-cols-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="ambulancia" 
                        checked={novoDestino.ambulancia}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="ambulancia" className="text-sm">
                        Ambulância
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="cadeirante" 
                        checked={novoDestino.cadeirante}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="cadeirante" className="text-sm">
                        Cadeirante
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="caminhao" 
                        checked={novoDestino.caminhao}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="caminhao" className="text-sm">
                        Caminhão
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="carro" 
                        checked={novoDestino.carro}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="carro" className="text-sm">
                        Carro
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="moto" 
                        checked={novoDestino.moto}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="moto" className="text-sm">
                        Moto
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="onibus" 
                        checked={novoDestino.onibus}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="onibus" className="text-sm">
                        Ônibus
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="van" 
                        checked={novoDestino.van}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="van" className="text-sm">
                        Van
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="outro" 
                        checked={novoDestino.outro}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="outro" className="text-sm">
                        Outro
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="ativo" 
                    checked={novoDestino.ativo}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300" 
                  />
                  <label htmlFor="ativo" className="text-sm font-medium">
                    Ativo
                  </label>
                </div>

                <div className="flex justify-end">
                  <Button onClick={salvarNovoDestino}>
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Modal de Edição */}
          <Dialog open={isEditarDestinoOpen} onOpenChange={setIsEditarDestinoOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Destino de Viagem</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="destino" className="text-sm font-medium">
                      Destino Final*
                    </label>
                    <input
                      id="destino"
                      value={novoDestino.destino}
                      onChange={handleInputChange}
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
                      value={novoDestino.distancia}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Ex: 200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Veículos Permitidos</label>
                  <div className="grid grid-cols-2 gap-2 rounded-md border p-4 md:grid-cols-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="ambulancia" 
                        checked={novoDestino.ambulancia}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="ambulancia" className="text-sm">
                        Ambulância
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="cadeirante" 
                        checked={novoDestino.cadeirante}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="cadeirante" className="text-sm">
                        Cadeirante
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="caminhao" 
                        checked={novoDestino.caminhao}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="caminhao" className="text-sm">
                        Caminhão
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="carro" 
                        checked={novoDestino.carro}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="carro" className="text-sm">
                        Carro
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="moto" 
                        checked={novoDestino.moto}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="moto" className="text-sm">
                        Moto
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="onibus" 
                        checked={novoDestino.onibus}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="onibus" className="text-sm">
                        Ônibus
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="van" 
                        checked={novoDestino.van}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="van" className="text-sm">
                        Van
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="outro" 
                        checked={novoDestino.outro}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="outro" className="text-sm">
                        Outro
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="ativo" 
                    checked={novoDestino.ativo}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300" 
                  />
                  <label htmlFor="ativo" className="text-sm font-medium">
                    Ativo
                  </label>
                </div>

                <div className="flex justify-end">
                  <Button onClick={atualizarDestino}>
                    Atualizar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Modal de Confirmação de Exclusão */}
          <Dialog open={isExcluirDestinoOpen} onOpenChange={setIsExcluirDestinoOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Excluir Destino</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir este destino? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setIsExcluirDestinoOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={excluirDestino}>
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            disabled={!selectedRow}
            onClick={(e) => {
              e.stopPropagation()
              setIsEditarDestinoOpen(true)
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
              setIsExcluirDestinoOpen(true)
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
