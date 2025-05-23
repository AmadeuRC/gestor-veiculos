import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { Funcionario } from "@/lib/models/funcionario.model"

interface EnderecoProps {
  form: UseFormReturn<Funcionario>
}

export function Endereco({ form }: EnderecoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Endereço</h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FormField
          control={form.control}
          name="logradouro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logradouro*</FormLabel>
              <FormControl>
                <Input placeholder="Rua, Avenida, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complemento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input placeholder="Apto, Bloco, etc." {...field} />
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
              <FormLabel>Bairro*</FormLabel>
              <FormControl>
                <Input placeholder="Nome do bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP*</FormLabel>
              <FormControl>
                <Input placeholder="00000-000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ac">Acre</SelectItem>
                  <SelectItem value="al">Alagoas</SelectItem>
                  <SelectItem value="ap">Amapá</SelectItem>
                  <SelectItem value="am">Amazonas</SelectItem>
                  <SelectItem value="ba">Bahia</SelectItem>
                  <SelectItem value="ce">Ceará</SelectItem>
                  <SelectItem value="df">Distrito Federal</SelectItem>
                  <SelectItem value="es">Espírito Santo</SelectItem>
                  <SelectItem value="go">Goiás</SelectItem>
                  <SelectItem value="ma">Maranhão</SelectItem>
                  <SelectItem value="mt">Mato Grosso</SelectItem>
                  <SelectItem value="ms">Mato Grosso do Sul</SelectItem>
                  <SelectItem value="mg">Minas Gerais</SelectItem>
                  <SelectItem value="pa">Pará</SelectItem>
                  <SelectItem value="pb">Paraíba</SelectItem>
                  <SelectItem value="pr">Paraná</SelectItem>
                  <SelectItem value="pe">Pernambuco</SelectItem>
                  <SelectItem value="pi">Piauí</SelectItem>
                  <SelectItem value="rj">Rio de Janeiro</SelectItem>
                  <SelectItem value="rn">Rio Grande do Norte</SelectItem>
                  <SelectItem value="rs">Rio Grande do Sul</SelectItem>
                  <SelectItem value="ro">Rondônia</SelectItem>
                  <SelectItem value="rr">Roraima</SelectItem>
                  <SelectItem value="sc">Santa Catarina</SelectItem>
                  <SelectItem value="sp">São Paulo</SelectItem>
                  <SelectItem value="se">Sergipe</SelectItem>
                  <SelectItem value="to">Tocantins</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estadoNatal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Natal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado natal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ac">Acre</SelectItem>
                  <SelectItem value="al">Alagoas</SelectItem>
                  <SelectItem value="ap">Amapá</SelectItem>
                  <SelectItem value="am">Amazonas</SelectItem>
                  <SelectItem value="ba">Bahia</SelectItem>
                  <SelectItem value="ce">Ceará</SelectItem>
                  <SelectItem value="df">Distrito Federal</SelectItem>
                  <SelectItem value="es">Espírito Santo</SelectItem>
                  <SelectItem value="go">Goiás</SelectItem>
                  <SelectItem value="ma">Maranhão</SelectItem>
                  <SelectItem value="mt">Mato Grosso</SelectItem>
                  <SelectItem value="ms">Mato Grosso do Sul</SelectItem>
                  <SelectItem value="mg">Minas Gerais</SelectItem>
                  <SelectItem value="pa">Pará</SelectItem>
                  <SelectItem value="pb">Paraíba</SelectItem>
                  <SelectItem value="pr">Paraná</SelectItem>
                  <SelectItem value="pe">Pernambuco</SelectItem>
                  <SelectItem value="pi">Piauí</SelectItem>
                  <SelectItem value="rj">Rio de Janeiro</SelectItem>
                  <SelectItem value="rn">Rio Grande do Norte</SelectItem>
                  <SelectItem value="rs">Rio Grande do Sul</SelectItem>
                  <SelectItem value="ro">Rondônia</SelectItem>
                  <SelectItem value="rr">Roraima</SelectItem>
                  <SelectItem value="sc">Santa Catarina</SelectItem>
                  <SelectItem value="sp">São Paulo</SelectItem>
                  <SelectItem value="se">Sergipe</SelectItem>
                  <SelectItem value="to">Tocantins</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
} 