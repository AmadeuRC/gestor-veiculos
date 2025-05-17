/**
 * Modelo para a estrutura de armazenamento no localStorage
 */
import { User, AdminUser } from './user.model'
import { Vehicle, Brand, VeiculoRegistrado } from './vehicle.model'
import { Department, Employee } from './department.model'
import { FuelRecord, FuelType, Abastecimento, Combustivel } from './fuel.model'
import { Rota, Destino } from './route.model'
import { LogEntry } from './log.model'

/**
 * Interface para o armazenamento completo
 */
export interface Storage {
  users: User[]
  vehicles: Vehicle[]
  brands: Brand[]
  veiculosRegistrados: VeiculoRegistrado[]
  departments: Department[]
  employees: Employee[]
  fuelRecords: FuelRecord[]
  fuelTypes: FuelType[]
  logs: LogEntry[]
  abastecimentos: Abastecimento[]
  combustiveis: Combustivel[]
  rotas: Rota[]
  destinos: Destino[]
  adminUsers: AdminUser[]
  counters: {
    [key: string]: number
  }
  veiculosData?: any[]
}

// Constante para a chave de armazenamento no localStorage
export const STORAGE_KEY = "sistema-gestao-data" 