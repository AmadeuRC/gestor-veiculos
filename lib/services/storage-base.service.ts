/**
 * Serviço base para operações de armazenamento
 */
import { STORAGE_KEY, Storage } from '../models/storage.model'
import { LocalStorageUtil } from '../utils/local-storage.util'

/**
 * Classe base para todos os serviços de armazenamento
 * Fornece métodos comuns para manipulação de dados
 */
export class StorageBaseService {
  /**
   * Obtém os dados completos do armazenamento
   * @returns Dados do armazenamento ou null se não existir
   */
  protected static getStorage(): Storage | null {
    return LocalStorageUtil.getItem<Storage>(STORAGE_KEY)
  }

  /**
   * Salva dados completos no armazenamento
   * @param data Dados a serem salvos
   */
  protected static setStorage(data: Storage): void {
    LocalStorageUtil.setItem(STORAGE_KEY, data)
  }

  /**
   * Obtém um armazenamento vazio com contadores inicializados
   * @returns Objeto de armazenamento vazio
   */
  protected static getEmptyStorage(): Storage {
    return {
      users: [],
      vehicles: [],
      brands: [],
      veiculosRegistrados: [],
      departments: [],
      employees: [],
      fuelRecords: [],
      fuelTypes: [],
      logs: [],
      abastecimentos: [],
      combustiveis: [],
      rotas: [],
      destinos: [],
      adminUsers: [],
      counters: {
        users: 0,
        vehicles: 0,
        brands: 0,
        veiculosRegistrados: 0,
        departments: 0,
        employees: 0,
        fuelRecords: 0,
        fuelTypes: 0,
        logs: 0,
        abastecimentos: 0,
        combustiveis: 0,
        rotas: 0,
        destinos: 0,
        adminUsers: 0
      }
    }
  }

  /**
   * Obtém o próximo ID para um tipo de entidade
   * @param type Nome do tipo de entidade
   * @returns ID único para a nova entidade
   */
  protected static getNextId(type: string): string {
    const data = this.getStorage() || this.getEmptyStorage()
    
    // Incrementa o contador para o tipo especificado
    const nextId = (data.counters[type] || 0) + 1
    data.counters[type] = nextId
    
    // Salva os dados atualizados
    this.setStorage(data)
    
    return nextId.toString()
  }
} 