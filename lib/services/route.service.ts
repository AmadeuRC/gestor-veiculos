/**
 * Serviço para gerenciar rotas e destinos
 */
import { Rota, Destino } from '../models/route.model'
import { StorageBaseService } from './storage-base.service'

/**
 * Classe para gerenciar rotas e destinos
 */
export class RouteService extends StorageBaseService {
  // Métodos para rotas
  
  /**
   * Obtém todas as rotas
   * @returns Lista de rotas
   */
  public static getRotas(): Rota[] {
    const data = this.getStorage()
    return data?.rotas || []
  }

  /**
   * Obtém uma rota pelo ID
   * @param id ID da rota
   * @returns Rota encontrada ou undefined
   */
  public static getRotaById(id: string): Rota | undefined {
    const rotas = this.getRotas()
    return rotas.find(rota => rota.id === id)
  }

  /**
   * Salva uma rota (nova ou existente)
   * @param rota Dados da rota
   * @returns Rota salva
   */
  public static saveRota(rota: Rota): Rota {
    const data = this.getStorage() || this.getEmptyStorage()
    const rotas = [...data.rotas]
    
    // Verifica se é uma rota existente ou nova
    const existingIndex = rotas.findIndex(r => r.id === rota.id)
    
    if (existingIndex >= 0) {
      // Atualiza rota existente
      rotas[existingIndex] = { ...rota }
    } else {
      // Adiciona nova rota com ID gerado
      const newRota = {
        ...rota,
        id: this.getNextId('rotas')
      }
      rotas.push(newRota)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, rotas })
    
    return rota
  }

  /**
   * Remove uma rota
   * @param id ID da rota a ser removida
   */
  public static deleteRota(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const rotas = data.rotas.filter(rota => rota.id !== id)
    this.setStorage({ ...data, rotas })
  }

  // Métodos para destinos
  
  /**
   * Obtém todos os destinos
   * @returns Lista de destinos
   */
  public static getDestinos(): Destino[] {
    const data = this.getStorage()
    return data?.destinos || []
  }

  /**
   * Obtém um destino pelo ID
   * @param id ID do destino
   * @returns Destino encontrado ou undefined
   */
  public static getDestinoById(id: string): Destino | undefined {
    const destinos = this.getDestinos()
    return destinos.find(destino => destino.id === id)
  }

  /**
   * Salva um destino (novo ou existente)
   * @param destino Dados do destino
   * @returns Destino salvo
   */
  public static saveDestino(destino: Destino): Destino {
    const data = this.getStorage() || this.getEmptyStorage()
    const destinos = [...data.destinos]
    
    // Verifica se é um destino existente ou novo
    const existingIndex = destinos.findIndex(d => d.id === destino.id)
    
    if (existingIndex >= 0) {
      // Atualiza destino existente
      destinos[existingIndex] = { ...destino }
    } else {
      // Adiciona novo destino com ID gerado
      const newDestino = {
        ...destino,
        id: this.getNextId('destinos')
      }
      destinos.push(newDestino)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, destinos })
    
    return destino
  }

  /**
   * Remove um destino
   * @param id ID do destino a ser removido
   */
  public static deleteDestino(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const destinos = data.destinos.filter(destino => destino.id !== id)
    this.setStorage({ ...data, destinos })
  }

  /**
   * Obtém destinos ativos
   * @returns Lista de destinos ativos
   */
  public static getDestinosAtivos(): Destino[] {
    const destinos = this.getDestinos()
    return destinos.filter(destino => destino.ativo)
  }

  /**
   * Obtém destinos por tipo de veículo
   * @param vehicleType Tipo de veículo (ambulancia, carro, etc.)
   * @returns Lista de destinos compatíveis com o tipo de veículo
   */
  public static getDestinosByVehicleType(vehicleType: string): Destino[] {
    const destinos = this.getDestinos()
    
    if (!['ambulancia', 'cadeirante', 'caminhao', 'carro', 'moto', 'onibus', 'van', 'outro'].includes(vehicleType)) {
      return []
    }
    
    return destinos.filter(destino => destino.ativo && destino[vehicleType as keyof Destino] === true)
  }
} 