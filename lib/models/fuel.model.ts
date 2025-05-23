/**
 * Modelos para combustíveis e abastecimentos no sistema
 */

/**
 * Interface para registros de abastecimento (em inglês)
 */
export interface FuelRecord {
  id: string
  vehicleId: string
  fuelType: string
  amount: number
  date: string
  cost: number
}

/**
 * Interface para tipos de combustível (em inglês)
 */
export interface FuelType {
  id: string
  name: string
  price: number
}

/**
 * Interface para registros de abastecimento (em português)
 */
export interface Abastecimento {
  id: string
  data: string
  posto: string
  combustivel: string
  valor: string
  secretaria: string
  quantidade?: string
}

/**
 * Interface para controle de combustíveis (em português)
 */
export interface Combustivel {
  id: string
  ativo: boolean
  fimContrato: string
  secretaria: string
  combustivel: string
  quantidadePrevista: string
  acumulado: string
  saldo: string
  valor: string
} 