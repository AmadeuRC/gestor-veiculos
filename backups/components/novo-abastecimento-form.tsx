"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, ChevronDown, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import { storageService } from "@/lib/storage-service"

// Este arquivo foi omitido por brevidade, mas deve seguir o mesmo padrão dos outros formulários:
// 1. Adicionar uma div principal com flex-col e altura definida: className="flex flex-col h-[calc(100vh-120px)]"
// 2. Adicionar uma div sticky no topo com os botões: className="sticky top-0 z-10 flex justify-end gap-2 bg-background py-2 border-b mb-4"
// 3. Adicionar overflow-y-auto e flex-1 ao formulário: className="space-y-4 overflow-y-auto flex-1 pr-2"
// 4. Remover os botões do final do formulário e movê-los para o topo

// Esquema de validação com validação condicional
const formSchema = z
  .object({
    data: z.date({
      required_error: "A data de abastecimento é obrigatória.",
    }),
    motorista: z.string({
      required_error: "O motorista é obrigatório.",
    }),
    secretaria: z.string({
      required_error: "A secretaria é obrigatória.",
    }),
    combustivel: z.string({
      required_error: "O tipo de combustível é obrigatório.",
    }),
    veiculo: z.string({
      required_error: "O veículo é obrigatório.",
    }),
    quantidade: z.string().min(1, "A quantidade é obrigatória."),
    hodometroDanificado: z.enum(["sim", "nao"]).default("nao"),
    incluirDistancia: z.enum(["sim", "nao"]).default("nao"),
    distancia: z.string().optional(),
    partida: z.string().optional(),
    partidaKm: z.string().optional(),
    destino: z.string().optional(),
    destinoKm: z.string().optional(),
    motivos: z.string().optional(),
    beneficiados: z.string().optional(),
    tipoRota: z.enum(["rota", "tfd"]).default("rota"),
  })
  .refine(
    (data) => {
      // Se incluir distância for "sim", o campo distância é obrigatório
      if (data.incluirDistancia === "sim" && (!data.distancia || data.distancia === "")) {
        return false
      }
      return true
    },
    {
      message: "A distância é obrigatória quando 'Incluir Distância' está marcado como 'Sim'",
      path: ["distancia"],
    },
  )
  .refine(
    (data) => {
      // Se incluir distância for "sim", os campos partida e destino são obrigatórios
      if (data.incluirDistancia === "sim" && (!data.partida || data.partida === "")) {
        return false
      }
      return true
    },
    {
      message: "A cidade de partida é obrigatória quando 'Incluir Distância' está marcado como 'Sim'",
      path: ["partida"],
    },
  )
  .refine(
    (data) => {
      // Se incluir distância for "sim", os campos partida e destino são obrigatórios
      if (data.incluirDistancia === "sim" && (!data.destino || data.destino === "")) {
        return false
      }
      return true
    },
    {
      message: "A cidade de destino é obrigatória quando 'Incluir Distância' está marcado como 'Sim'",
      path: ["destino"],
    },
  )
  .refine(
    (data) => {
      // Se hodômetro não estiver danificado e incluir distância for "sim", os campos de KM são obrigatórios
      if (
        data.hodometroDanificado === "nao" &&
        data.incluirDistancia === "sim" &&
        (!data.partidaKm || data.partidaKm === "")
      ) {
        return false
      }
      return true
    },
    {
      message: "O KM de partida é obrigatório quando o hodômetro não está danificado",
      path: ["partidaKm"],
    },
  )
  .refine(
    (data) => {
      // Se hodômetro não estiver danificado e incluir distância for "sim", os campos de KM são obrigatórios
      if (
        data.hodometroDanificado === "nao" &&
        data.incluirDistancia === "sim" &&
        (!data.destinoKm || data.destinoKm === "")
      ) {
        return false
      }
      return true
    },
    {
      message: "O KM de destino é obrigatório quando o hodômetro não está danificado",
      path: ["destinoKm"],
    },
  )
  .refine(
    (data) => {
      // Verificar se o KM de destino é maior que o KM de partida
      if (
        data.hodometroDanificado === "nao" &&
        data.incluirDistancia === "sim" &&
        data.partidaKm &&
        data.destinoKm &&
        Number(data.partidaKm) >= Number(data.destinoKm)
      ) {
        return false
      }
      return true
    },
    {
      message: "O KM de destino deve ser maior que o KM de partida",
      path: ["destinoKm"],
    },
  )

type FormValues = z.infer<typeof formSchema>

interface NovoAbastecimentoFormProps {
  onSuccess?: (data?: FormValues) => void
  initialData?: any
}

/**
 * Formulário para cadastro e edição de abastecimentos
 * @param onSuccess Callback chamado ao salvar com sucesso
 * @param initialData Dados iniciais para edição (opcional)
 */
export function NovoAbastecimentoForm({ onSuccess, initialData }: NovoAbastecimentoFormProps) {
  const [isViagemOpen, setIsViagemOpen] = useState(false)
  const { toast } = useToast()
  const [formErrors, setFormErrors] = useState<string[]>([])
  // Adicionar estado para armazenar os combustíveis cadastrados
  const [combustiveisCadastrados, setCombustiveisCadastrados] = useState([])
  const [valorCombustivel, setValorCombustivel] = useState("")

  // Carregar combustíveis cadastrados
  useEffect(() => {
    const combustiveis = storageService.getCombustiveis()
    // Filtrar apenas combustíveis ativos
    const combustiveisAtivos = combustiveis.filter((c) => c.ativo)
    setCombustiveisCadastrados(combustiveisAtivos)
  }, [])

  // Garantir que todos os campos tenham valores iniciais definidos
  const defaultValues: Partial<FormValues> = {
    hodometroDanificado: "nao",
    incluirDistancia: "nao",
    tipoRota: "rota",
    // Garantir que campos opcionais tenham valores iniciais vazios em vez de undefined
    distancia: "",
    partida: "",
    partidaKm: "",
    destino: "",
    destinoKm: "",
    motivos: "",
    beneficiados: "",
    quantidade: "",
  }

  // Mesclar valores iniciais com os dados fornecidos
  const mergedValues = initialData
    ? {
        ...defaultValues,
        ...initialData,
        // Garantir que campos de texto sempre tenham um valor de string, mesmo que vazio
        motivos: initialData.motivos || "",
        beneficiados: initialData.beneficiados || "",
        distancia: initialData.distancia || "",
        partida: initialData.partida || "",
        partidaKm: initialData.partidaKm || "",
        destino: initialData.destino || "",
        destinoKm: initialData.destinoKm || "",
        quantidade: initialData.quantidade || "",
      }
    : defaultValues

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: mergedValues,
    mode: "onChange", // Validar ao alterar os campos
  })

  const incluirDistancia = form.watch("incluirDistancia")
  const hodometroDanificado = form.watch("hodometroDanificado")
  const combustivelSelecionado = form.watch("combustivel")

  // Atualizar o valor do combustível quando o combustível selecionado mudar
  useEffect(() => {
    if (combustivelSelecionado) {
      const combustivel = combustiveisCadastrados.find((c) => c.combustivel === combustivelSelecionado)
      if (combustivel) {
        setValorCombustivel(combustivel.valor)
      }
    }
  }, [combustivelSelecionado, combustiveisCadastrados])

  // Monitorar erros de validação usando useEffect
  useEffect(() => {
    // Extrair mensagens de erro do formState.errors
    const errorMessages = Object.values(form.formState.errors)
      .map((error) => error?.message)
      .filter(Boolean) as string[]

    setFormErrors(errorMessages)
  }, [form.formState.errors])

  function onSubmit(data: FormValues) {
    console.log(data)

    // Verificar se há combustíveis cadastrados
    if (combustiveisCadastrados.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description:
          "Não há combustíveis ativos cadastrados. Cadastre combustíveis em 'Combustíveis Cadastrados' primeiro.",
      })
      return
    }

    // Verificar se a quantidade é um número válido
    const quantidade = Number(data.quantidade)
    if (isNaN(quantidade) || quantidade <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A quantidade de combustível deve ser um número positivo.",
      })
      return
    }

    toast({
      title: "Abastecimento registrado com sucesso",
      description: `Ticket criado para o veículo ${data.veiculo}`,
    })

    if (onSuccess) {
      // Passar os dados do formulário para a função onSuccess
      onSuccess(data)
    }
  }

  // Calcular o valor total do abastecimento
  const calcularTotal = () => {
    const quantidade = Number(form.watch("quantidade") || 0)
    const valor = Number(valorCombustivel?.replace(",", ".") || 0)

    if (quantidade > 0 && valor > 0) {
      return (quantidade * valor).toFixed(2).replace(".", ",")
    }
    return "0,00"
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="sticky top-0 z-10 flex justify-end gap-2 bg-background py-2 border-b mb-4">
        <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess()}>
          Cancelar
        </Button>
        <Button type="submit" form="abastecimento-form" disabled={combustiveisCadastrados.length === 0}>
          Salvar
        </Button>
      </div>

      {combustiveisCadastrados.length === 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Não há combustíveis ativos cadastrados. Cadastre combustíveis em "Combustíveis Cadastrados" primeiro.
          </AlertDescription>
        </Alert>
      )}

      {formErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-5">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          id="abastecimento-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 overflow-y-auto flex-1 pr-2"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do Abastecimento*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motorista"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motorista*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o motorista" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="joao">João Silva</SelectItem>
                      <SelectItem value="maria">Maria Oliveira</SelectItem>
                      <SelectItem value="pedro">Pedro Santos</SelectItem>
                      <SelectItem value="ana">Ana Pereira</SelectItem>
                      <SelectItem value="carlos">Carlos Ferreira</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secretaria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secretaria*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a secretaria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="saude">SAÚDE</SelectItem>
                      <SelectItem value="educacao">EDUCAÇÃO</SelectItem>
                      <SelectItem value="obras">OBRAS</SelectItem>
                      <SelectItem value="assistencia">ASSISTÊNCIA SOCIAL</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="combustivel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Combustível*</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Atualizar o valor do combustível quando o tipo for alterado
                      const combustivelSelecionado = combustiveisCadastrados.find((c) => c.combustivel === value)
                      if (combustivelSelecionado) {
                        setValorCombustivel(combustivelSelecionado.valor)
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {combustiveisCadastrados.length > 0 ? (
                        combustiveisCadastrados.map((combustivel) => (
                          <SelectItem key={combustivel.id} value={combustivel.combustivel}>
                            {combustivel.combustivel} - {combustivel.secretaria} - R$ {combustivel.valor}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="sem-combustivel" disabled>
                          Nenhum combustível cadastrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="veiculo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carro/Placa*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o veículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="abc1234">Fiat Strada - ABC-1234</SelectItem>
                      <SelectItem value="def5678">Ford Ranger - DEF-5678</SelectItem>
                      <SelectItem value="ghi9012">VW Gol - GHI-9012</SelectItem>
                      <SelectItem value="jkl3456">Chevrolet S10 - JKL-3456</SelectItem>
                      <SelectItem value="mno7890">Toyota Hilux - MNO-7890</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade (L)*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.watch("combustivel") && valorCombustivel && (
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm font-medium">Informações do combustível:</div>
              <div className="text-sm mt-1">Valor unitário: R$ {valorCombustivel}</div>
              <div className="text-sm mt-1">Valor total estimado: R$ {calcularTotal()}</div>
            </div>
          )}

          <Card className="border">
            <CardContent className="pt-6">
              <div
                className="flex cursor-pointer items-center justify-between mb-4"
                onClick={() => setIsViagemOpen(!isViagemOpen)}
              >
                <h3 className="text-lg font-medium">Dados da Viagem com Hodômetro</h3>
                <ChevronDown className={cn("h-5 w-5 transition-transform", isViagemOpen && "rotate-180")} />
              </div>

              {isViagemOpen && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="hodometroDanificado"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Hodômetro Danificado</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="sim" />
                              </FormControl>
                              <FormLabel className="font-normal">Sim</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="nao" />
                              </FormControl>
                              <FormLabel className="font-normal">Não</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="incluirDistancia"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Incluir Distância</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="sim" />
                              </FormControl>
                              <FormLabel className="font-normal">Sim</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="nao" />
                              </FormControl>
                              <FormLabel className="font-normal">Não</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {incluirDistancia === "sim" && (
                    <FormField
                      control={form.control}
                      name="distancia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distância (km){incluirDistancia === "sim" && "*"}</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="partida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partida (cidade){incluirDistancia === "sim" && "*"}</FormLabel>
                          <FormControl>
                            <Input placeholder="Cidade de partida" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="partidaKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Partida KM{incluirDistancia === "sim" && hodometroDanificado === "nao" && "*"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              value={field.value || ""}
                              disabled={hodometroDanificado === "sim"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="destino"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destino{incluirDistancia === "sim" && "*"}</FormLabel>
                          <FormControl>
                            <Input placeholder="Cidade de destino" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="destinoKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Destino KM{incluirDistancia === "sim" && hodometroDanificado === "nao" && "*"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              value={field.value || ""}
                              disabled={hodometroDanificado === "sim"}
                            />
                          </FormControl>
                          <FormMessage />
                          {hodometroDanificado === "nao" &&
                            incluirDistancia === "sim" &&
                            field.value &&
                            form.getValues("partidaKm") &&
                            Number(field.value) > Number(form.getValues("partidaKm")) && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Distância calculada: {Number(field.value) - Number(form.getValues("partidaKm"))} km
                              </p>
                            )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="motivos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motivos</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Motivo da viagem"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="beneficiados"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beneficiado(s)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Beneficiados pela viagem"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-2 font-medium">Rotas</h4>
                    <FormField
                      control={form.control}
                      name="tipoRota"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Tipo de Rota</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                              <FormItem className="flex items-center space-x-1 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="rota" />
                                </FormControl>
                                <FormLabel className="font-normal">Rota</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-1 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="tfd" />
                                </FormControl>
                                <FormLabel className="font-normal">TFD</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
