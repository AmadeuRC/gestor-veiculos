"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { type VeiculoRegistrado, storageService, type Employee } from "@/lib/storage-service"

// Esquema de validação
const formSchema = z.object({
  foto: z.string().optional(),
  veiculoRegistradoId: z.string().min(1, "É necessário selecionar um veículo registrado."),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  placa: z.string().min(1, "A placa é obrigatória."),
  ano: z.string().optional(),
  cor: z.string().optional(),
  passageiros: z.string().optional(),
  chassi: z.string().optional(),
  capacidade: z.string().optional(),
  numeroVeiculo: z.string().optional(),
  kmPorLitro: z.string().optional(),
  tipoVeiculo: z.string().optional(),
  propriedade: z.string().min(1, "A propriedade é obrigatória."),
  combustivel: z.string().optional(),
  motorista: z.string().min(1, "O motorista é obrigatório."),
  rodaAro: z.string().optional(),
  descricaoPneu: z.string().optional(),
  secretaria: z.string().min(1, "A secretaria é obrigatória."),
  rota: z.string().optional(),
  ativo: z.boolean().default(true),
  adaptadoCadeirante: z.boolean().default(false),
  observacoes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AtribuirVeiculoFormProps {
  veiculo?: any | null
  onSuccess?: () => void
}

export function AtribuirVeiculoForm({ veiculo = null, onSuccess }: AtribuirVeiculoFormProps) {
  const { toast } = useToast()
  const [veiculosRegistrados, setVeiculosRegistrados] = useState<VeiculoRegistrado[]>([])
  const [selectedVeiculoRegistrado, setSelectedVeiculoRegistrado] = useState<VeiculoRegistrado | null>(null)
  const [funcionarios, setFuncionarios] = useState<Employee[]>([])

  // Carregar veículos registrados
  useEffect(() => {
    try {
      const loadedVeiculos = storageService.getVeiculosRegistrados()
      setVeiculosRegistrados(loadedVeiculos)
    } catch (error) {
      console.error("Erro ao carregar veículos registrados:", error)
      // Dados de exemplo caso não consiga carregar do storage
      setVeiculosRegistrados([
        {
          id: "1",
          marca: "Mercedes-Benz",
          modelo: "Sprinter 517 F54A UP4",
          ano: "2021",
          cor: "Branco",
          foto: "/placeholder.svg?height=40&width=40",
          placa: "ABC1234",
        },
        {
          id: "2",
          marca: "Ford",
          modelo: "Ranger XLT 2.2",
          ano: "2020",
          cor: "Prata",
          foto: "/placeholder.svg?height=40&width=40",
          placa: "DEF5678",
        },
        {
          id: "3",
          marca: "Fiat",
          modelo: "Strada Working",
          ano: "2019",
          cor: "Vermelho",
          foto: "/placeholder.svg?height=40&width=40",
          placa: "GHI9012",
        },
      ])
    }
    
    // Carregar funcionários
    try {
      const loadedFuncionarios = storageService.getEmployees()
      console.log("Funcionários carregados:", loadedFuncionarios)
      setFuncionarios(loadedFuncionarios)
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error)
      setFuncionarios([])
    }
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: veiculo
      ? {
          veiculoRegistradoId: veiculo.veiculoRegistradoId || "",
          marca: veiculo.veiculo.split(" ")[0],
          modelo: veiculo.veiculo.split(" ").slice(1).join(" "),
          placa: veiculo.placa,
          tipoVeiculo: veiculo.tipo.split(" - ")[0],
          secretaria: veiculo.secretaria,
          motorista: veiculo.motorista,
          ativo: veiculo.ativo,
          ano: veiculo.ano || "",
          cor: veiculo.cor || "",
          passageiros: veiculo.passageiros || "",
          chassi: veiculo.chassi || "",
          capacidade: veiculo.capacidade || "",
          numeroVeiculo: veiculo.numeroVeiculo || veiculo.id,
          kmPorLitro: veiculo.kmPorLitro || "",
          propriedade: veiculo.propriedade || "",
          combustivel: veiculo.combustivel || "",
          rodaAro: veiculo.rodaAro || "",
          descricaoPneu: veiculo.descricaoPneu || "",
          rota: veiculo.rota || "",
          adaptadoCadeirante: veiculo.adaptadoCadeirante || false,
          observacoes: veiculo.observacoes || "",
          foto: veiculo.foto || "/placeholder.svg?height=40&width=40",
        }
      : {
          veiculoRegistradoId: "",
          marca: "",
          modelo: "",
          placa: "",
          ano: "",
          cor: "",
          passageiros: "",
          chassi: "",
          capacidade: "",
          numeroVeiculo: "",
          kmPorLitro: "",
          tipoVeiculo: "",
          propriedade: "",
          combustivel: "",
          motorista: "",
          rodaAro: "",
          descricaoPneu: "",
          secretaria: "",
          rota: "",
          foto: "/placeholder.svg?height=40&width=40",
          ativo: true,
          adaptadoCadeirante: false,
          observacoes: "",
        },
  })

  // Função para lidar com a seleção de veículo registrado
  const handleVeiculoRegistradoChange = (id: string) => {
    const veiculoSelecionado = veiculosRegistrados.find((v) => v.id === id) || null
    setSelectedVeiculoRegistrado(veiculoSelecionado)

    if (veiculoSelecionado) {
      form.setValue("veiculoRegistradoId", id)
      form.setValue("marca", veiculoSelecionado.marca)
      form.setValue("modelo", veiculoSelecionado.modelo)
      form.setValue("ano", veiculoSelecionado.ano)
      form.setValue("cor", veiculoSelecionado.cor)
      form.setValue("foto", veiculoSelecionado.foto)
      // Preencher automaticamente a placa quando disponível
      if (veiculoSelecionado.placa) {
        form.setValue("placa", veiculoSelecionado.placa)
      }
    }
  }

  // Modifique a função onSubmit para salvar os dados usando o storageService
  function onSubmit(data: FormValues) {
    try {
      // Verificar se o veículo registrado foi selecionado
      if (!data.veiculoRegistradoId) {
        toast({
          title: "Erro ao salvar",
          description: "É necessário selecionar um veículo registrado.",
          variant: "destructive",
        })
        return
      }

      // Preparar os dados do veículo para salvar
      const veiculoData = {
        id: veiculo ? veiculo.id : undefined,
        foto: data.foto || "/placeholder.svg?height=40&width=40",
        veiculo: `${data.marca} ${data.modelo}`,
        tipo: data.tipoVeiculo ? `${data.tipoVeiculo} - ${getTipoVeiculoDescricao(data.tipoVeiculo)}` : "",
        placa: data.placa,
        secretaria: data.secretaria,
        motorista: data.motorista,
        ativo: data.ativo,
        ano: data.ano,
        cor: data.cor,
        passageiros: data.passageiros,
        chassi: data.chassi,
        capacidade: data.capacidade,
        numeroVeiculo: data.numeroVeiculo,
        kmPorLitro: data.kmPorLitro,
        propriedade: data.propriedade,
        combustivel: data.combustivel,
        rodaAro: data.rodaAro || "",
        descricaoPneu: data.descricaoPneu || "",
        rota: data.rota || "",
        adaptadoCadeirante: data.adaptadoCadeirante,
        observacoes: data.observacoes || "",
        veiculoRegistradoId: data.veiculoRegistradoId,
      }

      // Salvar ou atualizar o veículo
      if (veiculo) {
        // Modo de edição - atualizar veículo existente
        console.log("Atualizando veículo:", veiculo.id, veiculoData)
        storageService.updateVehicle(veiculo.id, veiculoData)
        toast({
          title: "Veículo atualizado com sucesso",
          description: `Veículo ${data.marca} ${data.modelo} - ${data.placa}`,
        })
      } else {
        // Modo de criação - adicionar novo veículo
        console.log("Atribuindo novo veículo:", veiculoData)
        const savedVehicle = storageService.addVehicle(veiculoData)
        console.log("Veículo atribuído com sucesso:", savedVehicle)
        
        // Verificar se o veículo foi realmente salvo
        const veiculos = storageService.getVeiculos()
        console.log("Veículos após atribuir:", veiculos)
        
        toast({
          title: "Veículo atribuído com sucesso",
          description: `Veículo ${data.marca} ${data.modelo} - ${data.placa}`,
        })
      }

      // Chamar a função de sucesso para fechar o modal
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Erro ao atribuir veículo:", error)
      toast({
        title: "Erro ao atribuir",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atribuir o veículo.",
        variant: "destructive",
      })
    }
  }

  function getTipoVeiculoDescricao(tipo: string): string {
    const tiposVeiculo: Record<string, string> = {
      AB: "Ambulância",
      CA: "Caminhão Aberto",
      CB: "Caminhão Basculante",
      CO: "Carro",
      MO: "Microônibus",
      MT: "Moto",
      OB: "Ônibus",
      VN: "Van",
      OT: "Outro",
    }

    return tiposVeiculo[tipo] || tipo
  }

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-120px)]">
      <div className="sticky top-0 z-10 flex justify-end gap-2 bg-background py-2 border-b mb-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" form="veiculo-form">
          Salvar
        </Button>
      </div>

      {/* Seletor de Veículo Registrado */}
      <div className="p-4 border rounded-md bg-muted/20">
        <h3 className="text-lg font-medium mb-4">Selecionar Veículo Registrado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select value={form.watch("veiculoRegistradoId")} onValueChange={handleVeiculoRegistradoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um veículo" />
              </SelectTrigger>
              <SelectContent>
                {veiculosRegistrados.map((veiculo) => (
                  <SelectItem key={veiculo.id} value={veiculo.id}>
                    {veiculo.marca} {veiculo.modelo} ({veiculo.ano})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!form.watch("veiculoRegistradoId") && (
              <p className="text-sm text-red-500 mt-1">É necessário selecionar um veículo registrado.</p>
            )}
          </div>
        </div>

        {selectedVeiculoRegistrado && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Marca</p>
                  <p className="font-medium">{selectedVeiculoRegistrado.marca}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Modelo</p>
                  <p className="font-medium">{selectedVeiculoRegistrado.modelo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Placa</p>
                  <p className="font-medium">{selectedVeiculoRegistrado.placa || "Não informada"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ano</p>
                  <p className="font-medium">{selectedVeiculoRegistrado.ano}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cor</p>
                  <p className="font-medium">{selectedVeiculoRegistrado.cor}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-24 w-24 overflow-hidden rounded-md border">
                <img
                  src={selectedVeiculoRegistrado.foto || "/placeholder.svg"}
                  alt="Foto do veículo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Form {...form}>
        <form
          id="veiculo-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 overflow-y-auto flex-1 pr-2"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control as any}
              name="foto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {field.value && field.value !== "" && (
                        <div className="h-24 w-24 overflow-hidden rounded-md border mb-2">
                          <img
                            src={field.value || "/placeholder.svg"}
                            alt="Foto do veículo"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          // Aqui seria implementado o upload real da imagem
                          // Por enquanto, apenas simulamos com um placeholder
                          if (selectedVeiculoRegistrado) {
                            // Se um veículo foi selecionado, não permitir alteração
                            return
                          }
                          field.onChange(
                            e.target.files && e.target.files.length > 0 ? "/placeholder.svg?height=100&width=100" : "",
                          )
                        }}
                        disabled={!!selectedVeiculoRegistrado}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="marca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Marca do veículo"
                      {...field}
                      readOnly={!!selectedVeiculoRegistrado}
                      className={selectedVeiculoRegistrado ? "bg-muted" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Modelo do veículo"
                      {...field}
                      readOnly={!!selectedVeiculoRegistrado}
                      className={selectedVeiculoRegistrado ? "bg-muted" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="placa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa*</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC-1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="ano"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2023"
                      {...field}
                      readOnly={!!selectedVeiculoRegistrado}
                      className={selectedVeiculoRegistrado ? "bg-muted" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="cor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Cor do veículo"
                      {...field}
                      readOnly={!!selectedVeiculoRegistrado}
                      className={selectedVeiculoRegistrado ? "bg-muted" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="passageiros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de Passageiros</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="chassi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chassi</FormLabel>
                  <FormControl>
                    <Input placeholder="Número do chassi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="capacidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidade em Litros</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="numeroVeiculo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Veículo</FormLabel>
                  <FormControl>
                    <Input placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="kmPorLitro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KMs por Litro</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="tipoVeiculo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Veículo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AB">AB – Ambulância</SelectItem>
                      <SelectItem value="CA">CA – Caminhão Aberto</SelectItem>
                      <SelectItem value="CB">CB – Caminhão Basculante</SelectItem>
                      <SelectItem value="CO">CO – Carro</SelectItem>
                      <SelectItem value="MO">MO – Microônibus</SelectItem>
                      <SelectItem value="MT">MT – Moto</SelectItem>
                      <SelectItem value="OB">OB – Ônibus</SelectItem>
                      <SelectItem value="VN">VN – Van</SelectItem>
                      <SelectItem value="OT">OT – Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="propriedade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propriedade*</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a propriedade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Próprio">Próprio</SelectItem>
                      <SelectItem value="Alugado">Alugado</SelectItem>
                      <SelectItem value="Cedido">Cedido</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="combustivel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Combustível</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o combustível" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Gasolina Comum">Gasolina Comum</SelectItem>
                      <SelectItem value="Gasolina Aditivada">Gasolina Aditivada</SelectItem>
                      <SelectItem value="Etanol">Etanol</SelectItem>
                      <SelectItem value="Diesel Comum">Diesel Comum</SelectItem>
                      <SelectItem value="Diesel S-10">Diesel S-10</SelectItem>
                      <SelectItem value="Diesel Aditivado">Diesel Aditivado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="motorista"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motorista*</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o motorista" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {funcionarios.length > 0 ? (
                        funcionarios.map((funcionario) => (
                          <SelectItem key={funcionario.id} value={funcionario.name}>
                            {funcionario.name}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="João Silva">João Silva</SelectItem>
                          <SelectItem value="Maria Oliveira">Maria Oliveira</SelectItem>
                          <SelectItem value="Pedro Santos">Pedro Santos</SelectItem>
                          <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                          <SelectItem value="Carlos Pereira">Carlos Pereira</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="rodaAro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roda / Aro</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição da roda/aro" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="descricaoPneu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Pneu</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição do pneu" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="secretaria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secretaria*</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a secretaria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SAÚDE">SAÚDE</SelectItem>
                      <SelectItem value="EDUCAÇÃO">EDUCAÇÃO</SelectItem>
                      <SelectItem value="OBRAS">OBRAS</SelectItem>
                      <SelectItem value="ASSISTÊNCIA SOCIAL">ASSISTÊNCIA SOCIAL</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="rota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rota</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a rota" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ROTAS">ROTAS</SelectItem>
                      <SelectItem value="Rota 1">Rota 1</SelectItem>
                      <SelectItem value="Rota 2">Rota 2</SelectItem>
                      <SelectItem value="Rota 3">Rota 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control as any}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Ativo</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="adaptadoCadeirante"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Adaptado para Cadeirante</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre o veículo"
                      className="min-h-[100px]"
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}

// Adicionando alias para NovoVeiculoForm que aponta para AtribuirVeiculoForm
export const NovoVeiculoForm = AtribuirVeiculoForm 