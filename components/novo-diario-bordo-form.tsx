"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, ChevronDown, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { storageService, type Employee } from "@/lib/storage-service"

// Esquema de validação com validação condicional
const formSchema = z
  .object({
    dataSaida: z.date({
      required_error: "A data de saída é obrigatória.",
    }),
    horaSaida: z.string().min(1, "A hora de saída é obrigatória."),
    horaChegada: z.string().min(1, "A hora de chegada é obrigatória."),
    motorista: z.string().min(1, "O motorista é obrigatório."),
    origemDestino: z.string().min(1, "A origem/destino é obrigatória."),
    hodometroDanificado: z.enum(["sim", "nao"]).default("nao"),
    kmInicial: z.string().min(1, "O KM inicial é obrigatório."),
    kmFinal: z.string().optional(),
    checklist: z.array(z.string()).optional(),
    ocorrencias: z.string().optional(),
  })
  .refine(
    (data) => {
      // Se o hodômetro não estiver danificado, o KM inicial é obrigatório
      if (data.hodometroDanificado === "nao" && (!data.kmInicial || data.kmInicial === "")) {
        return false
      }
      return true
    },
    {
      message: "O KM inicial é obrigatório quando o hodômetro não está danificado",
      path: ["kmInicial"],
    },
  )
  .refine(
    (data) => {
      // Se o hodômetro não estiver danificado, o KM final é obrigatório
      if (data.hodometroDanificado === "nao" && (!data.kmFinal || data.kmFinal === "")) {
        return false
      }
      return true
    },
    {
      message: "O KM final é obrigatório quando o hodômetro não está danificado",
      path: ["kmFinal"],
    },
  )
  .refine(
    (data) => {
      // Verificar se o KM final é maior que o KM inicial
      if (
        data.hodometroDanificado === "nao" &&
        data.kmInicial &&
        data.kmFinal &&
        Number(data.kmInicial) >= Number(data.kmFinal)
      ) {
        return false
      }
      return true
    },
    {
      message: "O KM final deve ser maior que o KM inicial",
      path: ["kmFinal"],
    },
  )
  .refine(
    (data) => {
      // Verificar se a hora de chegada é posterior à hora de saída
      if (data.horaSaida && data.horaChegada && data.horaSaida >= data.horaChegada) {
        return false
      }
      return true
    },
    {
      message: "A hora de chegada deve ser posterior à hora de saída",
      path: ["horaChegada"],
    },
  )

type FormValues = z.infer<typeof formSchema>

interface NovoDiarioBordoFormProps {
  veiculo?: any
  onSuccess?: (data: any) => void
}

export function NovoDiarioBordoForm({ veiculo, onSuccess }: NovoDiarioBordoFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isViagemOpen, setIsViagemOpen] = useState(true)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [funcionarios, setFuncionarios] = useState<Employee[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataSaida: new Date(),
      horaSaida: "",
      horaChegada: "",
      motorista: "",
      origemDestino: "",
      hodometroDanificado: "nao",
      kmInicial: "",
      kmFinal: "",
      checklist: [],
      ocorrencias: "",
    },
    mode: "onChange", // Validar ao alterar os campos
  })

  const hodometroDanificado = form.watch("hodometroDanificado")
  const kmInicial = form.watch("kmInicial")
  const kmFinal = form.watch("kmFinal")

  // Carregar funcionários
  useEffect(() => {
    try {
      const loadedFuncionarios = storageService.getEmployees()
      console.log("Funcionários carregados para diário de bordo:", loadedFuncionarios)
      setFuncionarios(loadedFuncionarios)
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error)
      setFuncionarios([])
    }
  }, [])

  // Monitorar erros de validação
  useEffect(() => {
    if (form.formState.errors) {
      const errorMessages = Object.values(form.formState.errors)
        .map((error) => error?.message)
        .filter(Boolean) as string[]
      setFormErrors(errorMessages)
    } else {
      setFormErrors([])
    }
  }, [form.formState.errors])

  // Calcular a distância percorrida
  const distanciaPercorrida =
    hodometroDanificado === "nao" && kmInicial && kmFinal && Number(kmFinal) > Number(kmInicial)
      ? Number(kmFinal) - Number(kmInicial)
      : null

  function onSubmit(data: any) {
    setIsLoading(true)
    console.log("Dados do formulário:", data);

    // Simulação de envio para API
    setTimeout(() => {
      setIsLoading(false)
      if (onSuccess) {
        onSuccess(data)
      }
    }, 1000)
  }

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-120px)]">
      <div className="sticky top-0 z-10 flex justify-end gap-2 bg-background py-2 border-b mb-4">
        <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess({ ...form.getValues() })}>
          Cancelar
        </Button>
        <Button type="submit" form="diario-bordo-form" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
      {veiculo && (
        <div className="rounded-md bg-muted p-4">
          <h3 className="font-medium">Dados do Veículo</h3>
          <p className="text-sm text-muted-foreground">
            {veiculo.veiculo} - {veiculo.placa} | {veiculo.secretaria} - {veiculo.departamento}
          </p>
        </div>
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

      <Card className="border overflow-y-auto flex-1">
        <CardContent className="pt-6">
          <div
            className="flex cursor-pointer items-center justify-between mb-4"
            onClick={() => setIsViagemOpen(!isViagemOpen)}
          >
            <h3 className="font-medium">Dados da Viagem</h3>
            <ChevronDown className={cn("h-5 w-5 transition-transform", isViagemOpen && "rotate-180")} />
          </div>

          {isViagemOpen && (
            <Form {...form}>
              <form id="diario-bordo-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="dataSaida"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data Saída*</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
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
                    name="horaSaida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora da Saída*</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="horaChegada"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora da Chegada*</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
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
                            {funcionarios.length > 0 ? (
                              funcionarios.map((funcionario) => (
                                <SelectItem key={funcionario.id} value={funcionario.name}>
                                  {funcionario.name}
                                </SelectItem>
                              ))
                            ) : (
                              <>
                                <SelectItem value="joao">João Silva</SelectItem>
                                <SelectItem value="maria">Maria Oliveira</SelectItem>
                                <SelectItem value="pedro">Pedro Santos</SelectItem>
                                <SelectItem value="ana">Ana Pereira</SelectItem>
                                <SelectItem value="carlos">Carlos Ferreira</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="origemDestino"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origem/Destino*</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Sede - Hospital Regional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                    name="kmInicial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Km Inicial{hodometroDanificado === "nao" && "*"}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} disabled={hodometroDanificado === "sim"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kmFinal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Km Final{hodometroDanificado === "nao" && "*"}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} disabled={hodometroDanificado === "sim"} />
                        </FormControl>
                        <FormMessage />
                        {distanciaPercorrida !== null && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Distância percorrida: {distanciaPercorrida} km
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel>Checklist</FormLabel>
                  <div className="grid grid-cols-2 gap-2 rounded-md border p-4 md:grid-cols-4">
                    <FormField
                      control={form.control}
                      name="checklist"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("documento")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), "documento"])
                                  : field.onChange(field.value?.filter((value) => value !== "documento"))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Documento</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checklist"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("extintor")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), "extintor"])
                                  : field.onChange(field.value?.filter((value) => value !== "extintor"))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Extintor</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checklist"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("chave_roda")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), "chave_roda"])
                                  : field.onChange(field.value?.filter((value) => value !== "chave_roda"))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Chave de Roda</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checklist"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("macaco")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), "macaco"])
                                  : field.onChange(field.value?.filter((value) => value !== "macaco"))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Macaco</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checklist"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("agua")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), "agua"])
                                  : field.onChange(field.value?.filter((value) => value !== "agua"))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Água</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checklist"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("oleo")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), "oleo"])
                                  : field.onChange(field.value?.filter((value) => value !== "oleo"))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Óleo</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checklist"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("pneu_estepe")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), "pneu_estepe"])
                                  : field.onChange(field.value?.filter((value) => value !== "pneu_estepe"))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Pneu / Estepe</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checklist"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("lataria_interior")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), "lataria_interior"])
                                  : field.onChange(field.value?.filter((value) => value !== "lataria_interior"))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Lataria / Interior</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="ocorrencias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ocorrências / Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Qualquer irregularidade ou barulhos devem ser notados abaixo"
                          className="min-h-[100px]"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botões movidos para o topo */}
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
