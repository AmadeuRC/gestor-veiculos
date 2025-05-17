import { Button } from "@/components/ui/button"

interface FichaVeiculoProps {
  veiculo: {
    id: string
    foto: string
    veiculo: string
    tipo: string
    placa: string
    secretaria: string
    motorista: string
    ativo: boolean
    // Adicionando os campos que estavam faltando na interface
    ano?: string
    cor?: string
    chassi?: string
    capacidade?: string
    numeroVeiculo?: string
    kmPorLitro?: string
    propriedade?: string
    combustivel?: string
    rodaAro?: string
    descricaoPneu?: string
    departamento?: string
    passageiros?: string
    adaptadoCadeirante?: boolean
    observacoes?: string
  }
}

export function FichaVeiculo({ veiculo }: FichaVeiculoProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <img
            src={veiculo.foto || "/placeholder.svg"}
            alt={`Foto do veículo ${veiculo.veiculo}`}
            className="h-40 w-full rounded-md object-cover"
          />
        </div>

        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Veículo:</h3>
            <p className="text-base">{veiculo.veiculo}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Placa:</h3>
            <p className="text-base">{veiculo.placa}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Motorista:</h3>
            <p className="text-base">{veiculo.motorista}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Ano:</h3>
            <p className="text-base">{veiculo.ano || "Não informado"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Cor:</h3>
            <p className="text-base">{veiculo.cor || "Não informada"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Chassi:</h3>
          <p className="text-base">{veiculo.chassi || "Não informado"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Capacidade de Litros:</h3>
          <p className="text-base">{veiculo.capacidade ? `${veiculo.capacidade} L` : "Não informada"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Número do Veículo:</h3>
          <p className="text-base">{veiculo.numeroVeiculo || veiculo.id}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Tipo do Veículo:</h3>
          <p className="text-base">{veiculo.tipo}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Propriedade:</h3>
          <p className="text-base">{veiculo.propriedade || "Não informada"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Combustível:</h3>
          <p className="text-base">{veiculo.combustivel || "Não informado"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Roda / Aro:</h3>
          <p className="text-base">{veiculo.rodaAro || "Não informado"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Descrição do Pneu:</h3>
          <p className="text-base">{veiculo.descricaoPneu || "Não informada"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Secretaria:</h3>
          <p className="text-base">{veiculo.secretaria}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Departamento:</h3>
          <p className="text-base">{veiculo.departamento || "Não informado"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Ativo:</h3>
          <p className="text-base">{veiculo.ativo ? "Sim" : "Não"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Adaptado para Cadeirante:</h3>
          <p className="text-base">{veiculo.adaptadoCadeirante ? "Sim" : "Não"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Quantidade de Passageiros:</h3>
          <p className="text-base">{veiculo.passageiros || "Não informada"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">KM por Litro:</h3>
          <p className="text-base">{veiculo.kmPorLitro || "Não informado"}</p>
        </div>
      </div>

      {veiculo.observacoes && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Observações:</h3>
          <p className="text-base whitespace-pre-wrap">{veiculo.observacoes}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="outline">Fechar</Button>
      </div>
    </div>
  )
}
