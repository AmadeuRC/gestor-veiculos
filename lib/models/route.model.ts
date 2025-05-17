/**
 * Modelos para rotas e destinos no sistema
 */

/**
 * Interface para rotas
 */
export interface Rota {
  id: string
  rota: string
  distancia?: string
}

/**
 * Interface para destinos
 */
export interface Destino {
  id: string
  destino: string
  distancia: string
  ambulancia: boolean
  cadeirante: boolean
  caminhao: boolean
  carro: boolean
  moto: boolean
  onibus: boolean
  van: boolean
  outro: boolean
  ativo: boolean
} 