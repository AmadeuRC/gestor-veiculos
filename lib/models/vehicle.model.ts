/**
 * Modelos para veículos e marcas no sistema
 */

/**
 * Interface para veículos no sistema (em inglês)
 */
export interface Vehicle {
  id: string
  plate: string
  model: string
  brand: string
  year: number
  department: string
}

/**
 * Interface para marcas de veículos
 */
export interface Brand {
  id: string
  name: string
  country: string
}

/**
 * Interface para veículos registrados (em português)
 */
export interface VeiculoRegistrado {
  id: string
  marca: string
  modelo: string
  ano: string
  cor: string
  foto: string
} 