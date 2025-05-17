"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Esquema de validação
const formSchema = z.object({
  secretaria: z.string().min(1, "A secretaria é obrigatória."),
  tipoCombustivel: z.string().min(1, "O tipo de combustível é obrigatório."),
  quantidadePrevista: z.string().min(1, "A quantidade prevista é obrigatória."),
  valor: z.string().min(1, "O valor é obrigatório."),
  dataFim: z.date({
    required_error: "A data de fim do contrato é obrigatória.",
  }),
  observacao: z.string().max(255, "A observação deve ter no máximo 255 caracteres.").optional(),
  comDesconto: z.boolean().default(false),
  ativo: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

interface NovoCombustivelFormProps {
  combustivel?: {
    secretaria?: string
    tipoCombustivel?: string
    quantidadePrevista?: string
    valor?: string
    dataFim?: Date
    observacao?: string
    comDesconto?: boolean
    ativo?: boolean
  }
  onSuccess?: (data: FormValues) => void
}

/**
 * Formulário para cadastro e edição de combustíveis
 * @param combustivel Dados do combustível para edição (opcional)
 * @param onSuccess Callback chamado ao salvar com sucesso
 */
export function NovoCombustivelForm({ combustivel, onSuccess }: NovoCombustivelFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Inicializar formulário com valores padrão ou valores para edição
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: combustivel
      ? {
          // Valores para edição
          secretaria: combustivel.secretaria || "",
          tipoCombustivel: combustivel.tipoCombustivel || "",
          quantidadePrevista: combustivel.quantidadePrevista || "",
          valor: combustivel.valor ? combustivel.valor.replace(",", ".") : "",
          dataFim: combustivel.dataFim instanceof Date ? combustivel.dataFim : new Date(),
          observacao: combustivel.observacao || "",
          comDesconto: combustivel.comDesconto || false,
          ativo: typeof combustivel.ativo === "boolean" ? combustivel.ativo : true,
        }
      : {
          secretaria: "",
          tipoCombustivel: "",
          quantidadePrevista: "",
          valor: "",
          observacao: "",
          comDesconto: false,
          ativo: true,
        },
  })

  /**
   * Processa o envio do formulário
   * @param data Dados do formulário validados
   */
  function onSubmit(data: FormValues) {
    setIsLoading(true)

    // Simulação de envio para API
    setTimeout(() => {
      setIsLoading(false)
      if (onSuccess) {
        // Passar os dados para o componente pai
        onSuccess(data)
      }
    }, 500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="sticky top-0 z-10 flex justify-end gap-2 bg-background py-2 border-b mb-4">
        <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess(form.getValues())}>
          Cancelar
        </Button>
        <Button type="submit" form="combustivel-form" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
      <Form {...form}>
        <form
          id="combustivel-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 overflow-y-auto flex-1 pr-2"
        >
          <FormField
            control={form.control}
            name="secretaria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secretaria*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
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
            control={form.control}
            name="tipoCombustivel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Combustível*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Diesel Comum">Diesel Comum</SelectItem>
                    <SelectItem value="Diesel Aditivado">Diesel Aditivado</SelectItem>
                    <SelectItem value="Diesel Premium">Diesel Premium</SelectItem>
                    <SelectItem value="Diesel S-10">Diesel S-10</SelectItem>
                    <SelectItem value="Etanol">Etanol</SelectItem>
                    <SelectItem value="Etanol Aditivado">Etanol Aditivado</SelectItem>
                    <SelectItem value="Gás Natural Veicular">Gás Natural Veicular</SelectItem>
                    <SelectItem value="Gasolina Comum">Gasolina Comum</SelectItem>
                    <SelectItem value="Gasolina Aditivada">Gasolina Aditivada</SelectItem>
                    <SelectItem value="Gasolina Formulada">Gasolina Formulada</SelectItem>
                    <SelectItem value="Gasolina Premium">Gasolina Premium</SelectItem>
                    <SelectItem value="Óleo Lubrificante">Óleo Lubrificante</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantidadePrevista"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qnt Prevista (L)*</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      // Garantir que o valor seja tratado como string para preservar decimais
                      field.onChange(e.target.value)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataFim"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data Fim Contrato*</FormLabel>
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
            name="observacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observação</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Processo, Contrato, aditivo, etc (máximo 255 caracteres)"
                    className="resize-none"
                    maxLength={255}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="comDesconto"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Com Desconto?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
          </div>

          {/* Botões movidos para o topo */}
        </form>
      </Form>
    </div>
  )
}
