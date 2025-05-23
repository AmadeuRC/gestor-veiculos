import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"
import { Funcionario } from "@/lib/models/funcionario.model"

interface ObservacoesProps {
  form: UseFormReturn<Funcionario>
}

export function Observacoes({ form }: ObservacoesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Observações</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="cedidoInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detalhes (Cedido/Permutado)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informações adicionais sobre cedência ou permuta" 
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações Gerais</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Observações gerais sobre o funcionário" 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="documento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documentação Complementar</FormLabel>
              <FormControl>
                <Input type="file" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Ativo</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Indica se o funcionário está ativo no sistema
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
} 