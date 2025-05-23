"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Esquema de validação
const formSchema = z.object({
  secretaria: z.string().min(1, "A secretaria é obrigatória."),
  tipo: z.string().min(1, "O tipo de departamento é obrigatório."),
  nome: z.string().min(1, "O nome do departamento é obrigatório."),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface NovoDepartamentoFormProps {
  departamento?: {
    secretaria: string
    nome: string
  }
  onSuccess?: (data: FormValues) => void
}

export function NovoDepartamentoForm({ departamento, onSuccess }: NovoDepartamentoFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: departamento
      ? {
          secretaria: departamento.secretaria,
          tipo: "Departamento", // Valor padrão para edição
          nome: departamento.nome,
          logradouro: "",
          numero: "",
          bairro: "",
        }
      : {
          secretaria: "",
          tipo: "",
          nome: "",
          logradouro: "",
          numero: "",
          bairro: "",
        },
  })

  function onSubmit(data: FormValues) {
    setIsLoading(true)

    // Simulação de envio para API
    setTimeout(() => {
      setIsLoading(false)
      if (onSuccess) {
        onSuccess(data)
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="sticky top-0 z-10 flex justify-end gap-2 bg-background py-2 border-b mb-4">
        <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess(form.getValues())}>
          Cancelar
        </Button>
        <Button type="submit" form="departamento-form" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
      <Form {...form}>
        <form
          id="departamento-form"
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
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Departamento*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Departamento">Departamento</SelectItem>
                    <SelectItem value="Diretoria">Diretoria</SelectItem>
                    <SelectItem value="Ala">Ala</SelectItem>
                    <SelectItem value="Presidência">Presidência</SelectItem>
                    <SelectItem value="Subprefeitura">Subprefeitura</SelectItem>
                    <SelectItem value="Superintendência">Superintendência</SelectItem>
                    <SelectItem value="Seção">Seção</SelectItem>
                    <SelectItem value="Organização">Organização</SelectItem>
                    <SelectItem value="Divisão">Divisão</SelectItem>
                    <SelectItem value="Setor">Setor</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                    <SelectItem value="Escola">Escola</SelectItem>
                    <SelectItem value="UBS">UBS</SelectItem>
                    <SelectItem value="Coordenadoria">Coordenadoria</SelectItem>
                    <SelectItem value="Secretaria Executiva">Secretaria Executiva</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome*</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do departamento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logradouro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logradouro</FormLabel>
                <FormControl>
                  <Input placeholder="Endereço do departamento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="Número" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
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
