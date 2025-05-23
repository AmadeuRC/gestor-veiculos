"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Esquema de validação
const formSchema = z
  .object({
    nome: z.string().min(1, "O nome é obrigatório."),
    email: z.string().email("E-mail inválido."),
    senha: z.string().min(4, "A senha deve ter pelo menos 4 caracteres."),
    confirmarSenha: z.string().min(4, "A confirmação de senha deve ter pelo menos 4 caracteres."),
    ativo: z.boolean().default(true),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })

type FormValues = z.infer<typeof formSchema>

interface NovoUsuarioFormProps {
  usuario?: any
  isAdmin?: boolean
  onSuccess?: (data: FormValues) => void
}

export function NovoUsuarioForm({ usuario, isAdmin = false, onSuccess }: NovoUsuarioFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: usuario
      ? {
          nome: usuario.nome,
          email: usuario.email,
          senha: "",
          confirmarSenha: "",
          ativo: usuario.ativo,
        }
      : {
          nome: "",
          email: "",
          senha: "",
          confirmarSenha: "",
          ativo: true,
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
        <Button type="submit" form="usuario-form" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
      <Form {...form}>
        <form
          id="usuario-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 overflow-y-auto flex-1 pr-2"
        >
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome*</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail*</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o e-mail" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{usuario ? "Nova senha" : "Senha*"}</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a senha" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmarSenha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{usuario ? "Confirmar nova senha" : "Confirmar senha*"}</FormLabel>
                <FormControl>
                  <Input placeholder="Confirme a senha" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {usuario && (
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
          )}

          {/* Botões movidos para o topo */}
        </form>
      </Form>
    </div>
  )
}
