/**
 * Serviço para gerenciar combustíveis e abastecimentos
 */
import { FuelRecord, FuelType, Abastecimento, Combustivel } from '../models/fuel.model'
import { StorageBaseService } from './storage-base.service'

/**
 * Classe para gerenciar combustíveis e abastecimentos
 */
export class FuelService extends StorageBaseService {
  // Métodos para registros de abastecimento (em inglês)
  
  /**
   * Obtém todos os registros de abastecimento
   * @returns Lista de registros de abastecimento
   */
  public static getFuelRecords(): FuelRecord[] {
    const data = this.getStorage()
    return data?.fuelRecords || []
  }

  /**
   * Obtém um registro de abastecimento pelo ID
   * @param id ID do registro
   * @returns Registro encontrado ou undefined
   */
  public static getFuelRecordById(id: string): FuelRecord | undefined {
    const records = this.getFuelRecords()
    return records.find(record => record.id === id)
  }

  /**
   * Salva um registro de abastecimento (novo ou existente)
   * @param record Dados do registro
   * @returns Registro salvo
   */
  public static saveFuelRecord(record: FuelRecord): FuelRecord {
    const data = this.getStorage() || this.getEmptyStorage()
    const fuelRecords = [...data.fuelRecords]
    
    // Verifica se é um registro existente ou novo
    const existingIndex = fuelRecords.findIndex(r => r.id === record.id)
    
    if (existingIndex >= 0) {
      // Atualiza registro existente
      fuelRecords[existingIndex] = { ...record }
    } else {
      // Adiciona novo registro com ID gerado
      const newRecord = {
        ...record,
        id: this.getNextId('fuelRecords')
      }
      fuelRecords.push(newRecord)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, fuelRecords })
    
    return record
  }

  /**
   * Remove um registro de abastecimento
   * @param id ID do registro a ser removido
   */
  public static deleteFuelRecord(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const fuelRecords = data.fuelRecords.filter(record => record.id !== id)
    this.setStorage({ ...data, fuelRecords })
  }

  // Métodos para tipos de combustível (em inglês)
  
  /**
   * Obtém todos os tipos de combustível
   * @returns Lista de tipos de combustível
   */
  public static getFuelTypes(): FuelType[] {
    const data = this.getStorage()
    return data?.fuelTypes || []
  }

  /**
   * Obtém um tipo de combustível pelo ID
   * @param id ID do tipo de combustível
   * @returns Tipo de combustível encontrado ou undefined
   */
  public static getFuelTypeById(id: string): FuelType | undefined {
    const types = this.getFuelTypes()
    return types.find(type => type.id === id)
  }

  /**
   * Salva um tipo de combustível (novo ou existente)
   * @param fuelType Dados do tipo de combustível
   * @returns Tipo de combustível salvo
   */
  public static saveFuelType(fuelType: FuelType): FuelType {
    const data = this.getStorage() || this.getEmptyStorage()
    const fuelTypes = [...data.fuelTypes]
    
    // Verifica se é um tipo existente ou novo
    const existingIndex = fuelTypes.findIndex(t => t.id === fuelType.id)
    
    if (existingIndex >= 0) {
      // Atualiza tipo existente
      fuelTypes[existingIndex] = { ...fuelType }
    } else {
      // Adiciona novo tipo com ID gerado
      const newType = {
        ...fuelType,
        id: this.getNextId('fuelTypes')
      }
      fuelTypes.push(newType)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, fuelTypes })
    
    return fuelType
  }

  /**
   * Remove um tipo de combustível
   * @param id ID do tipo a ser removido
   */
  public static deleteFuelType(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const fuelTypes = data.fuelTypes.filter(type => type.id !== id)
    this.setStorage({ ...data, fuelTypes })
  }

  // Métodos para abastecimentos (em português)
  
  /**
   * Obtém todos os abastecimentos
   * @returns Lista de abastecimentos
   */
  public static getAbastecimentos(): Abastecimento[] {
    const data = this.getStorage()
    return data?.abastecimentos || []
  }

  /**
   * Obtém um abastecimento pelo ID
   * @param id ID do abastecimento
   * @returns Abastecimento encontrado ou undefined
   */
  public static getAbastecimentoById(id: string): Abastecimento | undefined {
    const abastecimentos = this.getAbastecimentos()
    return abastecimentos.find(a => a.id === id)
  }

  /**
   * Salva um abastecimento (novo ou existente)
   * @param abastecimento Dados do abastecimento
   * @returns Abastecimento salvo
   */
  public static saveAbastecimento(abastecimento: Abastecimento): Abastecimento {
    const data = this.getStorage() || this.getEmptyStorage()
    const abastecimentos = [...data.abastecimentos]
    
    // Verifica se é um abastecimento existente ou novo
    const existingIndex = abastecimentos.findIndex(a => a.id === abastecimento.id)
    
    if (existingIndex >= 0) {
      // Atualiza abastecimento existente
      abastecimentos[existingIndex] = { ...abastecimento }
    } else {
      // Adiciona novo abastecimento com ID gerado
      const newAbastecimento = {
        ...abastecimento,
        id: this.getNextId('abastecimentos')
      }
      abastecimentos.push(newAbastecimento)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, abastecimentos })
    
    return abastecimento
  }

  /**
   * Remove um abastecimento
   * @param id ID do abastecimento a ser removido
   */
  public static deleteAbastecimento(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const abastecimentos = data.abastecimentos.filter(a => a.id !== id)
    this.setStorage({ ...data, abastecimentos })
  }

  // Métodos para controle de combustíveis (em português)
  
  /**
   * Obtém todos os controles de combustíveis
   * @returns Lista de controles de combustíveis
   */
  public static getCombustiveis(): Combustivel[] {
    const data = this.getStorage()
    return data?.combustiveis || []
  }

  /**
   * Obtém um controle de combustível pelo ID
   * @param id ID do controle
   * @returns Controle encontrado ou undefined
   */
  public static getCombustivelById(id: string): Combustivel | undefined {
    const combustiveis = this.getCombustiveis()
    return combustiveis.find(c => c.id === id)
  }

  /**
   * Salva um controle de combustível (novo ou existente)
   * @param combustivel Dados do controle
   * @returns Controle salvo
   */
  public static saveCombustivel(combustivel: Combustivel): Combustivel {
    const data = this.getStorage() || this.getEmptyStorage()
    const combustiveis = [...data.combustiveis]
    
    // Verifica se é um controle existente ou novo
    const existingIndex = combustiveis.findIndex(c => c.id === combustivel.id)
    
    if (existingIndex >= 0) {
      // Atualiza controle existente
      combustiveis[existingIndex] = { ...combustivel }
    } else {
      // Adiciona novo controle com ID gerado
      const newCombustivel = {
        ...combustivel,
        id: this.getNextId('combustiveis')
      }
      combustiveis.push(newCombustivel)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, combustiveis })
    
    return combustivel
  }

  /**
   * Remove um controle de combustível
   * @param id ID do controle a ser removido
   */
  public static deleteCombustivel(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const combustiveis = data.combustiveis.filter(c => c.id !== id)
    this.setStorage({ ...data, combustiveis })
  }

  /**
   * Verifica contratos de combustível expirados
   * Atualiza os status dos combustíveis com contratos expirados
   */
  public static verificarContratosExpirados(): void {
    const data = this.getStorage()
    if (!data || !data.combustiveis?.length) return
    
    const hoje = new Date()
    const combustiveis = [...data.combustiveis]
    let atualizado = false
    
    // Percorre todos os combustíveis e verifica datas de contrato
    combustiveis.forEach((combustivel, index) => {
      if (!combustivel.fimContrato) return
      
      // Converte a data do formato brasileiro para Date
      const partes = combustivel.fimContrato.split('/').map(Number)
      if (partes.length !== 3) return
      
      // Data no formato DD/MM/YYYY
      const dataContrato = new Date(partes[2], partes[1] - 1, partes[0])
      
      // Verifica se o contrato expirou
      if (dataContrato < hoje && combustivel.ativo) {
        combustiveis[index] = {
          ...combustivel,
          ativo: false
        }
        atualizado = true
      }
    })
    
    // Se houve alterações, atualiza o armazenamento
    if (atualizado) {
      this.setStorage({ ...data, combustiveis })
    }
  }
} 