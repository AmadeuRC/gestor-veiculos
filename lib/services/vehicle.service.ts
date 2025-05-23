/**
 * Serviço para gerenciar veículos e marcas
 */
import { Vehicle, Brand, VeiculoRegistrado } from '../models/vehicle.model'
import { StorageBaseService } from './storage-base.service'

/**
 * Classe para gerenciar veículos e marcas
 */
export class VehicleService extends StorageBaseService {
  // Métodos para veículos (em inglês)
  
  /**
   * Obtém todos os veículos
   * @returns Lista de veículos
   */
  public static getVehicles(): Vehicle[] {
    const data = this.getStorage()
    return data?.vehicles || []
  }

  /**
   * Obtém um veículo pelo ID
   * @param id ID do veículo
   * @returns Veículo encontrado ou undefined
   */
  public static getVehicleById(id: string): Vehicle | undefined {
    const vehicles = this.getVehicles()
    return vehicles.find(vehicle => vehicle.id === id)
  }

  /**
   * Salva um veículo (novo ou existente)
   * @param vehicle Dados do veículo
   * @returns Veículo salvo
   */
  public static saveVehicle(vehicle: Vehicle): Vehicle {
    const data = this.getStorage() || this.getEmptyStorage()
    const vehicles = [...data.vehicles]
    
    // Verifica se é um veículo existente ou novo
    const existingIndex = vehicles.findIndex(v => v.id === vehicle.id)
    
    if (existingIndex >= 0) {
      // Atualiza veículo existente
      vehicles[existingIndex] = { ...vehicle }
    } else {
      // Adiciona novo veículo com ID gerado
      const newVehicle = {
        ...vehicle,
        id: this.getNextId('vehicles')
      }
      vehicles.push(newVehicle)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, vehicles })
    
    return vehicle
  }

  /**
   * Remove um veículo
   * @param id ID do veículo a ser removido
   */
  public static deleteVehicle(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const vehicles = data.vehicles.filter(vehicle => vehicle.id !== id)
    this.setStorage({ ...data, vehicles })
  }

  // Métodos para marcas
  
  /**
   * Obtém todas as marcas
   * @returns Lista de marcas
   */
  public static getBrands(): Brand[] {
    const data = this.getStorage()
    return data?.brands || []
  }

  /**
   * Obtém uma marca pelo ID
   * @param id ID da marca
   * @returns Marca encontrada ou undefined
   */
  public static getBrandById(id: string): Brand | undefined {
    const brands = this.getBrands()
    return brands.find(brand => brand.id === id)
  }

  /**
   * Salva uma marca (nova ou existente)
   * @param brand Dados da marca
   * @returns Marca salva
   */
  public static saveBrand(brand: Brand): Brand {
    const data = this.getStorage() || this.getEmptyStorage()
    const brands = [...data.brands]
    
    // Verifica se é uma marca existente ou nova
    const existingIndex = brands.findIndex(b => b.id === brand.id)
    
    if (existingIndex >= 0) {
      // Atualiza marca existente
      brands[existingIndex] = { ...brand }
    } else {
      // Adiciona nova marca com ID gerado
      const newBrand = {
        ...brand,
        id: this.getNextId('brands')
      }
      brands.push(newBrand)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, brands })
    
    return brand
  }

  /**
   * Remove uma marca
   * @param id ID da marca a ser removida
   */
  public static deleteBrand(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const brands = data.brands.filter(brand => brand.id !== id)
    this.setStorage({ ...data, brands })
  }

  // Métodos para veículos registrados (em português)
  
  /**
   * Obtém todos os veículos registrados
   * @returns Lista de veículos registrados
   */
  public static getVeiculosRegistrados(): VeiculoRegistrado[] {
    const data = this.getStorage()
    return data?.veiculosRegistrados || []
  }

  /**
   * Obtém um veículo registrado pelo ID
   * @param id ID do veículo registrado
   * @returns Veículo registrado encontrado ou undefined
   */
  public static getVeiculoRegistradoById(id: string): VeiculoRegistrado | undefined {
    const veiculos = this.getVeiculosRegistrados()
    return veiculos.find(veiculo => veiculo.id === id)
  }

  /**
   * Salva um veículo registrado (novo ou existente)
   * @param veiculo Dados do veículo registrado
   * @returns Veículo registrado salvo
   */
  public static saveVeiculoRegistrado(veiculo: VeiculoRegistrado): VeiculoRegistrado {
    const data = this.getStorage() || this.getEmptyStorage()
    const veiculosRegistrados = [...data.veiculosRegistrados]
    
    // Verifica se é um veículo existente ou novo
    const existingIndex = veiculosRegistrados.findIndex(v => v.id === veiculo.id)
    
    if (existingIndex >= 0) {
      // Atualiza veículo existente
      veiculosRegistrados[existingIndex] = { ...veiculo }
    } else {
      // Adiciona novo veículo com ID gerado
      const newVeiculo = {
        ...veiculo,
        id: this.getNextId('veiculosRegistrados')
      }
      veiculosRegistrados.push(newVeiculo)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, veiculosRegistrados })
    
    return veiculo
  }

  /**
   * Remove um veículo registrado
   * @param id ID do veículo registrado a ser removido
   */
  public static deleteVeiculoRegistrado(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const veiculosRegistrados = data.veiculosRegistrados.filter(veiculo => veiculo.id !== id)
    this.setStorage({ ...data, veiculosRegistrados })
  }
} 