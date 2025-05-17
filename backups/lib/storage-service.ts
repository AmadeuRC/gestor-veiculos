/**
 * Serviço de armazenamento para gerenciar dados no localStorage
 * Implementa persistência de dados e operações CRUD para todas as entidades do sistema
 */

// Tipos para os diferentes tipos de dados
export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export interface Vehicle {
  id: string
  plate: string
  model: string
  brand: string
  year: number
  department: string
}

export interface Brand {
  id: string
  name: string
  country: string
}

export interface VeiculoRegistrado {
  id: string
  marca: string
  modelo: string
  ano: string
  cor: string
  foto: string
}

export interface Department {
  id: string
  name: string
  manager: string
  budget: number
}

export interface Employee {
  id: string
  name: string
  position: string
  department: string
  hireDate: string
}

export interface FuelRecord {
  id: string
  vehicleId: string
  fuelType: string
  amount: number
  date: string
  cost: number
}

export interface FuelType {
  id: string
  name: string
  price: number
}

export interface LogEntry {
  id: string
  action: string
  user: string
  timestamp: string
  details: string
}

export interface Abastecimento {
  id: string
  data: string
  posto: string
  combustivel: string
  valor: string
  secretaria: string
}

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

export interface Rota {
  id: string
  rota: string
  distancia?: string
}

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

// Adicionando uma nova interface para os usuários administrativos
export interface AdminUser {
  id: string
  nome: string
  email: string
  tipo: string
  ativo: boolean
  senha?: string
}

// Interface para o armazenamento
interface Storage {
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
  adminUsers?: AdminUser[] // Nova propriedade
  counters: {
    [key: string]: number
  }
  veiculosData?: any[]
}

// Constantes para as chaves de armazenamento
const STORAGE_KEY = "sistema-gestao-data"

/**
 * Classe auxiliar para gerenciar o armazenamento no localStorage
 * Fornece métodos para persistência e manipulação de dados
 */
export class StorageService {
  /**
   * Salva um item no localStorage
   * @param key Chave para armazenamento
   * @param value Valor a ser armazenado
   */
  public static setItem(key: string, value: unknown): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error)
    }
  }

  /**
   * Obtém um item do localStorage
   * @param key Chave do item a ser recuperado
   * @returns O valor armazenado ou null se não existir
   */
  public static getItem<T>(key: string): T | null {
    if (typeof window === "undefined") return null

    const data = localStorage.getItem(key)
    if (!data) return null

    try {
      return JSON.parse(data) as T
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error)
      return null
    }
  }

  /**
   * Remove um item do localStorage
   * @param key Chave do item a ser removido
   */
  public static removeItem(key: string): void {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Erro ao remover ${key} do localStorage:`, error)
    }
  }

  /**
   * Limpa todo o localStorage
   */
  public static clear(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.clear()
    } catch (error) {
      console.error("Erro ao limpar o localStorage:", error)
    }
  }

  /**
   * Retorna um armazenamento vazio com contadores inicializados
   * @returns Objeto de armazenamento vazio
   */
  private static getEmptyStorage(): Storage {
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
      },
    }
  }

  /**
   * Retorna dados de exemplo para inicialização do sistema
   * @returns Objeto de armazenamento com dados de exemplo
   */
  private static getSampleData(): Storage {
    const timestamp = new Date().toISOString()
    const sampleData = {
      users: [
        {
          id: "1",
          name: "Administrador",
          email: "admin@sistema.com",
          role: "admin",
          createdAt: timestamp,
        },
      ],
      vehicles: [
        {
          id: "1",
          plate: "ABC-1234",
          model: "Gol",
          brand: "Volkswagen",
          year: 2020,
          department: "Saúde",
        },
        {
          id: "2",
          plate: "DEF-5678",
          model: "Uno",
          brand: "Fiat",
          year: 2019,
          department: "Educação",
        },
      ],
      brands: [
        { id: "1", name: "Volkswagen", country: "Alemanha" },
        { id: "2", name: "Fiat", country: "Itália" },
        { id: "3", name: "Chevrolet", country: "EUA" },
        { id: "4", name: "Ford", country: "EUA" },
      ],
      veiculosRegistrados: [
        {
          id: "1",
          marca: "Mercedes-Benz",
          modelo: "Sprinter 517 F54A UP4",
          ano: "2021",
          cor: "Branco",
          foto: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "2",
          marca: "Ford",
          modelo: "Ranger XLT 2.2",
          ano: "2020",
          cor: "Prata",
          foto: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "3",
          marca: "Fiat",
          modelo: "Strada Working",
          ano: "2019",
          cor: "Vermelho",
          foto: "/placeholder.svg?height=40&width=40",
        },
      ],
      departments: [
        { id: "1", name: "Saúde", manager: "João Silva", budget: 500000 },
        { id: "2", name: "Educação", manager: "Maria Oliveira", budget: 700000 },
        { id: "3", name: "Infraestrutura", manager: "Carlos Santos", budget: 1000000 },
      ],
      employees: [
        {
          id: "1",
          name: "João Silva",
          position: "Diretor",
          department: "Saúde",
          hireDate: "2018-01-15",
        },
        {
          id: "2",
          name: "Maria Oliveira",
          position: "Diretora",
          department: "Educação",
          hireDate: "2019-03-20",
        },
      ],
      fuelRecords: [
        {
          id: "1",
          vehicleId: "1",
          fuelType: "Gasolina",
          amount: 40,
          date: "2023-05-10",
          cost: 200,
        },
        {
          id: "2",
          vehicleId: "2",
          fuelType: "Etanol",
          amount: 30,
          date: "2023-05-12",
          cost: 120,
        },
      ],
      fuelTypes: [
        { id: "1", name: "Gasolina", price: 5.0 },
        { id: "2", name: "Etanol", price: 4.0 },
        { id: "3", name: "Diesel", price: 6.0 },
      ],
      logs: [
        {
          id: "1",
          action: "Login",
          user: "Administrador",
          timestamp: timestamp,
          details: "Login no sistema",
        },
      ],
      abastecimentos: [],
      combustiveis: [],
      rotas: [
        { id: "1", rota: "Sede - Hospital Regional", distancia: "200 km" },
        { id: "2", rota: "Sede - UPA", distancia: "50 km" },
        { id: "3", rota: "Sede - Hospital Universitário", distancia: "150 km" },
        { id: "4", rota: "Distrito A - Sede", distancia: "75 km" },
        { id: "5", rota: "Distrito B - Sede", distancia: "120 km" },
      ],
      destinos: [],
      counters: {
        users: 1,
        vehicles: 2,
        brands: 4,
        veiculosRegistrados: 3,
        departments: 3,
        employees: 2,
        fuelRecords: 2,
        fuelTypes: 3,
        logs: 1,
        abastecimentos: 0,
        combustiveis: 0,
        rotas: 5,
        destinos: 0,
      },
    }
    return sampleData
  }

  /**
   * Gera um ID numérico sequencial para uma entidade
   * @param type Tipo da entidade
   * @returns ID sequencial como string
   */
  private static getNextId(type: string): string {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    // Inicializar contador se não existir
    if (!storage.counters) {
      storage.counters = {}
    }

    if (!storage.counters[type]) {
      storage.counters[type] = 0
    }

    // Incrementar contador
    storage.counters[type]++

    // Salvar contador atualizado
    StorageService.setItem(STORAGE_KEY, storage)

    // Retornar ID como string
    return storage.counters[type].toString()
  }

  /**
   * Verifica contratos de combustível expirados e os desativa automaticamente
   */
  public static verificarContratosExpirados(): void {
    if (typeof window === "undefined") return

    const storage = StorageService.getItem<Storage>(STORAGE_KEY)
    if (!storage || !storage.combustiveis) return

    const hoje = new Date()
    let atualizou = false

    storage.combustiveis = storage.combustiveis.map((combustivel: Combustivel) => {
      if (!combustivel.ativo) return combustivel

      const dataFim = new Date(combustivel.fimContrato.split("/").reverse().join("-"))

      // Se a data de fim do contrato for anterior à data atual, desativar
      if (dataFim < hoje && combustivel.ativo) {
        atualizou = true
        return { ...combustivel, ativo: false }
      }

      return combustivel
    })

    if (atualizou) {
      StorageService.setItem(STORAGE_KEY, storage)
      StorageService.addLog(
        "Atualização",
        "Sistema",
        "Contratos de combustível expirados foram desativados automaticamente",
      )
    }
  }

  /**
   * Adiciona um registro de log ao sistema
   * @param action Ação realizada
   * @param user Usuário que realizou a ação
   * @param details Detalhes da ação
   */
  public static addLog(action: string, user: string, details: string): void {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const newLog: LogEntry = {
      id: StorageService.getNextId("logs"),
      action,
      user,
      timestamp: new Date().toISOString(),
      details,
    }

    storage.logs.push(newLog)
    StorageService.setItem(STORAGE_KEY, storage)
  }
}

/**
 * Interface de serviço de armazenamento exposta para o aplicativo
 * Fornece métodos para manipulação de dados de todas as entidades
 */
export const storageService = {
  getItem: StorageService.getItem,
  setItem: StorageService.setItem,
  removeItem: StorageService.removeItem,
  clear: StorageService.clear,
  addLog: StorageService.addLog,
  verificarContratosExpirados: StorageService.verificarContratosExpirados,

  /**
   * Inicializa o armazenamento com apenas estruturas essenciais, sem dados de exemplo
   */
  initializeWithSampleData: (): void => {
    const currentData = StorageService.getItem(STORAGE_KEY)
    if (!currentData) {
      // Criar estrutura inicial apenas com dados essenciais
      const essentialData = {
        users: [
          {
            id: "1",
            name: "Administrador",
            email: "admin@sistema.com",
            role: "admin",
            createdAt: new Date().toISOString(),
          },
        ],
        vehicles: [],
        brands: [
          { id: "1", name: "Volkswagen", country: "Alemanha" },
          { id: "2", name: "Fiat", country: "Itália" },
          { id: "3", name: "Toyota", country: "Japão" },
          { id: "4", name: "Ford", country: "Estados Unidos" },
          { id: "5", name: "Chevrolet", country: "Estados Unidos" },
        ],
        veiculosRegistrados: [],
        departments: [
          { id: "1", name: "Educação", manager: "Secretário de Educação", budget: 1000000 },
          { id: "2", name: "Saúde", manager: "Secretário de Saúde", budget: 2000000 },
          { id: "3", name: "Obras", manager: "Secretário de Obras", budget: 1500000 },
          { id: "4", name: "Transporte", manager: "Secretário de Transporte", budget: 800000 },
          { id: "5", name: "Administração", manager: "Secretário de Administração", budget: 500000 },
        ],
        employees: [],
        fuelRecords: [],
        fuelTypes: [
          { id: "1", name: "Gasolina Comum", price: 5.49 },
          { id: "2", name: "Gasolina Aditivada", price: 5.89 },
          { id: "3", name: "Etanol", price: 3.89 },
          { id: "4", name: "Diesel S10", price: 6.29 },
          { id: "5", name: "Diesel Comum", price: 5.99 },
        ],
        logs: [],
        abastecimentos: [],
        combustiveis: [],
        rotas: [],
        destinos: [],
        // Adiciona um usuário administrativo padrão
        adminUsers: [
          {
            id: "1",
            nome: "Administrador",
            email: "admin@sistema.com",
            tipo: "Administrador",
            ativo: true,
            senha: "admin" // Em um sistema real, seria uma senha criptografada
          }
        ],
        counters: {
          users: 1,
          vehicles: 0,
          brands: 5,
          veiculosRegistrados: 0,
          departments: 5,
          employees: 0,
          fuelRecords: 0,
          fuelTypes: 5,
          logs: 0,
          abastecimentos: 0,
          combustiveis: 0,
          rotas: 0,
          destinos: 0,
          adminUsers: 1
        },
      }

      StorageService.setItem(STORAGE_KEY, essentialData)
    }
  },

  /**
   * Obtém a lista de usuários
   * @returns Array de usuários
   */
  getUsers: (): User[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.users]
  },

  /**
   * Adiciona um novo usuário
   * @param user Dados do usuário a ser adicionado
   * @returns Usuário adicionado com ID gerado
   */
  addUser: (user: Omit<User, "id" | "createdAt">): User => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const newUser: User = {
      ...user,
      id: StorageService.getNextId("users"),
      createdAt: new Date().toISOString(),
    }

    storage.users.push(newUser)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Usuário ${newUser.name} adicionado`)

    return newUser
  },

  /**
   * Obtém a lista de veículos
   * @returns Array de veículos
   */
  getVehicles: (): Vehicle[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.vehicles]
  },

  /**
   * Adiciona um novo veículo
   * @param vehicle Dados do veículo a ser adicionado
   * @returns Veículo adicionado com ID gerado
   */
  addVehicle: (vehicle: Omit<Vehicle, "id">): Vehicle => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const newVehicle: Vehicle = {
      ...vehicle,
      id: StorageService.getNextId("vehicles"),
    }

    storage.vehicles.push(newVehicle)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Veículo ${newVehicle.plate} adicionado`)

    return newVehicle
  },

  /**
   * Obtém a lista de marcas
   * @returns Array de marcas
   */
  getBrands: (): Brand[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.brands]
  },

  /**
   * Adiciona uma nova marca
   * @param brand Dados da marca a ser adicionada
   * @returns Marca adicionada com ID gerado
   */
  addBrand: (brand: Omit<Brand, "id">): Brand => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const newBrand: Brand = {
      ...brand,
      id: StorageService.getNextId("brands"),
    }

    storage.brands.push(newBrand)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Marca ${newBrand.name} adicionada`)

    return newBrand
  },

  /**
   * Obtém a lista de departamentos
   * @returns Array de departamentos
   */
  getDepartments: (): Department[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.departments]
  },

  /**
   * Adiciona um novo departamento
   * @param department Dados do departamento a ser adicionado
   * @returns Departamento adicionado com ID gerado
   */
  addDepartment: (department: Omit<Department, "id">): Department => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const newDepartment: Department = {
      ...department,
      id: StorageService.getNextId("departments"),
    }

    storage.departments.push(newDepartment)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Departamento ${newDepartment.name} adicionado`)

    return newDepartment
  },

  /**
   * Obtém a lista de funcionários
   * @returns Array de funcionários
   */
  getEmployees: (): Employee[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.employees]
  },

  /**
   * Adiciona um novo funcionário
   * @param employee Dados do funcionário a ser adicionado
   * @returns Funcionário adicionado com ID gerado
   */
  addEmployee: (employee: Omit<Employee, "id">): Employee => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const newEmployee: Employee = {
      ...employee,
      id: StorageService.getNextId("employees"),
    }

    storage.employees.push(newEmployee)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Funcionário ${newEmployee.name} adicionado`)

    return newEmployee
  },

  /**
   * Obtém a lista de registros de combustível
   * @returns Array de registros de combustível
   */
  getFuelRecords: (): FuelRecord[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.fuelRecords]
  },

  /**
   * Adiciona um novo registro de combustível
   * @param record Dados do registro a ser adicionado
   * @returns Registro adicionado com ID gerado
   */
  addFuelRecord: (record: Omit<FuelRecord, "id">): FuelRecord => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const newRecord: FuelRecord = {
      ...record,
      id: StorageService.getNextId("fuelRecords"),
    }

    storage.fuelRecords.push(newRecord)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Registro de abastecimento adicionado`)

    return newRecord
  },

  /**
   * Obtém a lista de tipos de combustível
   * @returns Array de tipos de combustível
   */
  getFuelTypes: (): FuelType[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.fuelTypes]
  },

  /**
   * Adiciona um novo tipo de combustível
   * @param fuelType Dados do tipo de combustível a ser adicionado
   * @returns Tipo de combustível adicionado com ID gerado
   */
  addFuelType: (fuelType: Omit<FuelType, "id">): FuelType => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const newFuelType: FuelType = {
      ...fuelType,
      id: StorageService.getNextId("fuelTypes"),
    }

    storage.fuelTypes.push(newFuelType)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Tipo de combustível ${newFuelType.name} adicionado`)

    return newFuelType
  },

  /**
   * Obtém a lista de logs ordenados por data (mais recentes primeiro)
   * @returns Array de logs
   */
  getLogs: (): LogEntry[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },

  /**
   * Obtém a lista de abastecimentos
   * @returns Array de abastecimentos
   */
  getAbastecimentos: (): Abastecimento[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.abastecimentos]
  },

  /**
   * Adiciona um novo abastecimento
   * @param abastecimento Dados do abastecimento a ser adicionado
   * @returns Abastecimento adicionado com ID gerado
   */
  saveAbastecimento: (abastecimento: Omit<Abastecimento, "id">): Abastecimento => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const newAbastecimento: Abastecimento = {
      ...abastecimento,
      id: StorageService.getNextId("abastecimentos"),
    }

    storage.abastecimentos.push(newAbastecimento)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Abastecimento ${newAbastecimento.id} adicionado`)

    return newAbastecimento
  },

  /**
   * Obtém a lista de combustíveis, verificando contratos expirados antes
   * @returns Array de combustíveis
   */
  getCombustiveis: (): Combustivel[] => {
    // Verificar contratos expirados antes de retornar
    StorageService.verificarContratosExpirados()

    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.combustiveis]
  },

  // Já implementamos a verificação de duplicidade no método saveCombustivel, mas vamos garantir que está funcionando corretamente

  // Verifique se o método saveCombustivel contém esta verificação:
  /**
   * Adiciona um novo combustível, verificando duplicidade
   * @param combustivel Dados do combustível a ser adicionado
   * @returns Combustível adicionado com ID gerado
   * @throws Error se já existir um combustível ativo com o mesmo nome
   */
  saveCombustivel: (combustivel: Omit<Combustivel, "id" | "acumulado" | "saldo">): Combustivel => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    // Verificar se já existe um combustível ativo com o mesmo nome
    const combustivelExistente = storage.combustiveis.find(
      (c: Combustivel) => c.combustivel === combustivel.combustivel && c.ativo && combustivel.ativo,
    )

    if (combustivelExistente) {
      throw new Error(
        `Já existe um combustível ativo do tipo ${combustivel.combustivel}. Desative-o antes de adicionar um novo.`,
      )
    }

    const newCombustivel: Combustivel = {
      ...combustivel,
      id: StorageService.getNextId("combustiveis"),
      acumulado: "0",
      saldo: combustivel.quantidadePrevista,
    }

    storage.combustiveis.push(newCombustivel)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Combustível ${newCombustivel.combustivel} adicionado`)

    return newCombustivel
  },

  /**
   * Atualiza um combustível existente
   * @param id ID do combustível a ser atualizado
   * @param combustivel Dados parciais do combustível para atualização
   * @returns Combustível atualizado
   * @throws Error se não encontrar o combustível ou se houver duplicidade
   */
  updateCombustivel: (id: string, combustivel: Partial<Combustivel>): Combustivel => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    // Verificar se já existe um combustível ativo com o mesmo nome (exceto o atual)
    if (combustivel.combustivel && combustivel.ativo) {
      const combustivelExistente = storage.combustiveis.find(
        (c: Combustivel) => c.id !== id && c.combustivel === combustivel.combustivel && c.ativo,
      )

      if (combustivelExistente) {
        throw new Error(
          `Já existe um combustível ativo do tipo ${combustivel.combustivel}. Desative-o antes de atualizar este.`,
        )
      }
    }

    let combustivelAtualizado: Combustivel | null = null

    storage.combustiveis = storage.combustiveis.map((c: Combustivel) => {
      if (c.id === id) {
        combustivelAtualizado = { ...c, ...combustivel }
        return combustivelAtualizado
      }
      return c
    })

    if (!combustivelAtualizado) {
      throw new Error(`Combustível com ID ${id} não encontrado.`)
    }

    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Atualização", "Administrador", `Combustível ${combustivelAtualizado.combustivel} atualizado`)

    return combustivelAtualizado
  },

  /**
   * Obtém a lista de rotas
   * @returns Array de rotas
   */
  getRotas: (): Rota[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.rotas]
  },

  /**
   * Adiciona uma nova rota
   * @param rota Dados da rota a ser adicionada
   * @returns Rota adicionada com ID gerado
   */
  saveRota: (rota: Omit<Rota, "id">): Rota => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const newRota: Rota = {
      ...rota,
      id: StorageService.getNextId("rotas"),
    }

    storage.rotas.push(newRota)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Rota ${newRota.rota} adicionada`)

    return newRota
  },

  /**
   * Atualiza uma rota existente
   * @param id ID da rota a ser atualizada
   * @param rota Dados parciais da rota para atualização
   * @returns Rota atualizada
   * @throws Error se não encontrar a rota
   */
  updateRota: (id: string, rota: Partial<Rota>): Rota => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    let rotaAtualizada: Rota | null = null

    storage.rotas = storage.rotas.map((r: Rota) => {
      if (r.id === id) {
        rotaAtualizada = { ...r, ...rota }
        return rotaAtualizada
      }
      return r
    })

    if (!rotaAtualizada) {
      throw new Error(`Rota com ID ${id} não encontrada.`)
    }

    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Atualização", "Administrador", `Rota ${rotaAtualizada.rota} atualizada`)

    return rotaAtualizada
  },

  /**
   * Remove uma rota
   * @param id ID da rota a ser removida
   * @throws Error se não encontrar a rota
   */
  deleteRota: (id: string): void => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const rotaParaExcluir = storage.rotas.find((r: Rota) => r.id === id)

    if (!rotaParaExcluir) {
      throw new Error(`Rota com ID ${id} não encontrada.`)
    }

    storage.rotas = storage.rotas.filter((r: Rota) => r.id !== id)

    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Exclusão", "Administrador", `Rota ${rotaParaExcluir.rota} excluída`)
  },

  /**
   * Obtém a lista de destinos
   * @returns Array de destinos
   */
  getDestinos: (): Destino[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return [...storage.destinos]
  },

  /**
   * Adiciona um novo destino
   * @param destino Dados do destino a ser adicionado
   * @returns Destino adicionado com ID gerado
   */
  saveDestino: (destino: Omit<Destino, "id">): Destino => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const newDestino: Destino = {
      ...destino,
      id: StorageService.getNextId("destinos"),
    }

    storage.destinos.push(newDestino)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Destino ${newDestino.destino} adicionado`)

    return newDestino
  },

  /**
   * Atualiza um destino existente
   * @param id ID do destino a ser atualizado
   * @param destino Dados parciais do destino para atualização
   * @returns Destino atualizado
   * @throws Error se não encontrar o destino
   */
  updateDestino: (id: string, destino: Partial<Destino>): Destino => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    let destinoAtualizado: Destino | null = null

    storage.destinos = storage.destinos.map((d: Destino) => {
      if (d.id === id) {
        destinoAtualizado = { ...d, ...destino }
        return destinoAtualizado
      }
      return d
    })

    if (!destinoAtualizado) {
      throw new Error(`Destino com ID ${id} não encontrado.`)
    }

    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Atualização", "Administrador", `Destino ${destinoAtualizado.destino} atualizado`)

    return destinoAtualizado
  },

  /**
   * Remove um destino
   * @param id ID do destino a ser removido
   * @throws Error se não encontrar o destino
   */
  deleteDestino: (id: string): void => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const destinoParaExcluir = storage.destinos.find((d: Destino) => d.id === id)

    if (!destinoParaExcluir) {
      throw new Error(`Destino com ID ${id} não encontrado.`)
    }

    storage.destinos = storage.destinos.filter((d: Destino) => d.id !== id)

    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Exclusão", "Administrador", `Destino ${destinoParaExcluir.destino} excluído`)
  },

  // Adicionar o método deleteAbastecimento ao storageService

  /**
   * Remove um abastecimento
   * @param id ID do abastecimento a ser removido
   * @throws Error se não encontrar o abastecimento
   */
  deleteAbastecimento: (id: string): void => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const abastecimentoParaExcluir = storage.abastecimentos.find((a: Abastecimento) => a.id === id)

    if (!abastecimentoParaExcluir) {
      throw new Error(`Abastecimento com ID ${id} não encontrado.`)
    }

    // Atualizar o saldo do combustível (subtrair do acumulado e adicionar ao saldo)
    const combustivelUsado = storage.combustiveis.find(
      (c: Combustivel) => c.combustivel === abastecimentoParaExcluir.combustivel,
    )

    if (combustivelUsado) {
      // Converter para números para fazer o cálculo
      const acumuladoAtual = Number.parseFloat(combustivelUsado.acumulado) || 0
      const valorAbastecimento = Number.parseFloat(abastecimentoParaExcluir.valor) || 0
      const novoAcumulado = Math.max(0, acumuladoAtual - valorAbastecimento)
      const novoSaldo = Number.parseFloat(combustivelUsado.quantidadePrevista) - novoAcumulado

      // Atualizar o combustível
      storage.combustiveis = storage.combustiveis.map((c: Combustivel) => {
        if (c.id === combustivelUsado.id) {
          return {
            ...c,
            acumulado: novoAcumulado.toString(),
            saldo: novoSaldo.toString(),
          }
        }
        return c
      })
    }

    storage.abastecimentos = storage.abastecimentos.filter((a: Abastecimento) => a.id !== id)

    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Exclusão", "Administrador", `Abastecimento ${abastecimentoParaExcluir.id} excluído`)
  },

  /**
   * Atualiza um abastecimento existente
   * @param id ID do abastecimento a ser atualizado
   * @param abastecimento Dados parciais do abastecimento para atualização
   * @returns Abastecimento atualizado
   * @throws Error se não encontrar o abastecimento
   */
  updateAbastecimento: (id: string, abastecimento: Partial<Abastecimento>): Abastecimento => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    const abastecimentoExistente = storage.abastecimentos.find((a: Abastecimento) => a.id === id)

    if (!abastecimentoExistente) {
      throw new Error(`Abastecimento com ID ${id} não encontrado.`)
    }

    // Se o combustível ou valor mudou, precisamos atualizar os saldos
    if (
      (abastecimento.combustivel && abastecimento.combustivel !== abastecimentoExistente.combustivel) ||
      (abastecimento.valor && abastecimento.valor !== abastecimentoExistente.valor)
    ) {
      // Primeiro, reverter o abastecimento anterior
      const combustivelAnterior = storage.combustiveis.find(
        (c: Combustivel) => c.combustivel === abastecimentoExistente.combustivel,
      )

      if (combustivelAnterior) {
        // Converter para números para fazer o cálculo
        const acumuladoAtual = Number.parseFloat(combustivelAnterior.acumulado) || 0
        const valorAbastecimento = Number.parseFloat(abastecimentoExistente.valor) || 0
        const novoAcumulado = Math.max(0, acumuladoAtual - valorAbastecimento)
        const novoSaldo = Number.parseFloat(combustivelAnterior.quantidadePrevista) - novoAcumulado

        // Atualizar o combustível anterior
        storage.combustiveis = storage.combustiveis.map((c: Combustivel) => {
          if (c.id === combustivelAnterior.id) {
            return {
              ...c,
              acumulado: novoAcumulado.toString(),
              saldo: novoSaldo.toString(),
            }
          }
          return c
        })
      }

      // Agora, adicionar ao novo combustível
      const novoCombustivel = storage.combustiveis.find(
        (c: Combustivel) => c.combustivel === (abastecimento.combustivel || abastecimentoExistente.combustivel),
      )

      if (novoCombustivel) {
        // Converter para números para fazer o cálculo
        const acumuladoAtual = Number.parseFloat(novoCombustivel.acumulado) || 0
        const valorAbastecimento = Number.parseFloat(abastecimento.valor || abastecimentoExistente.valor) || 0
        const novoAcumulado = acumuladoAtual + valorAbastecimento
        const novoSaldo = Number.parseFloat(novoCombustivel.quantidadePrevista) - novoAcumulado

        // Atualizar o novo combustível
        storage.combustiveis = storage.combustiveis.map((c: Combustivel) => {
          if (c.id === novoCombustivel.id) {
            return {
              ...c,
              acumulado: novoAcumulado.toString(),
              saldo: novoSaldo.toString(),
            }
          }
          return c
        })
      }
    }

    // Atualizar o abastecimento
    let abastecimentoAtualizado: Abastecimento | null = null

    storage.abastecimentos = storage.abastecimentos.map((a: Abastecimento) => {
      if (a.id === id) {
        abastecimentoAtualizado = { ...a, ...abastecimento }
        return abastecimentoAtualizado
      }
      return a
    })

    if (!abastecimentoAtualizado) {
      throw new Error(`Abastecimento com ID ${id} não encontrado.`)
    }

    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Atualização", "Administrador", `Abastecimento ${abastecimentoAtualizado.id} atualizado`)

    return abastecimentoAtualizado
  },

  /**
   * Obtém a lista de veículos registrados
   * @returns Array de veículos registrados
   */
  getVeiculosRegistrados: (): VeiculoRegistrado[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return storage.veiculosRegistrados || []
  },

  /**
   * Adiciona um novo veículo registrado
   * @param veiculo Dados do veículo a ser registrado
   * @returns Veículo registrado com ID gerado
   */
  addVeiculoRegistrado: (veiculo: Omit<VeiculoRegistrado, "id">): VeiculoRegistrado => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    // Inicializar o array de veículos registrados se não existir
    if (!storage.veiculosRegistrados) {
      storage.veiculosRegistrados = []
    }

    const newVeiculo: VeiculoRegistrado = {
      ...veiculo,
      id: StorageService.getNextId("veiculosRegistrados"),
    }

    storage.veiculosRegistrados.push(newVeiculo)
    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog("Adição", "Administrador", `Veículo ${newVeiculo.marca} ${newVeiculo.modelo} registrado`)

    return newVeiculo
  },

  /**
   * Atualiza um veículo registrado existente
   * @param id ID do veículo a ser atualizado
   * @param veiculo Dados parciais do veículo para atualização
   * @returns Veículo atualizado
   * @throws Error se não encontrar o veículo
   */
  updateVeiculoRegistrado: (id: string, veiculo: Partial<VeiculoRegistrado>): VeiculoRegistrado => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    if (!storage.veiculosRegistrados) {
      storage.veiculosRegistrados = []
    }

    let veiculoAtualizado: VeiculoRegistrado | null = null

    storage.veiculosRegistrados = storage.veiculosRegistrados.map((v: VeiculoRegistrado) => {
      if (v.id === id) {
        veiculoAtualizado = { ...v, ...veiculo }
        return veiculoAtualizado
      }
      return v
    })

    if (!veiculoAtualizado) {
      throw new Error(`Veículo com ID ${id} não encontrado.`)
    }

    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog(
      "Atualização",
      "Administrador",
      `Veículo ${veiculoAtualizado.marca} ${veiculoAtualizado.modelo} atualizado`,
    )

    return veiculoAtualizado
  },

  /**
   * Remove um veículo registrado
   * @param id ID do veículo a ser removido
   * @throws Error se não encontrar o veículo
   */
  deleteVeiculoRegistrado: (id: string): void => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    if (!storage.veiculosRegistrados) {
      storage.veiculosRegistrados = []
    }

    const veiculoParaExcluir = storage.veiculosRegistrados.find((v: VeiculoRegistrado) => v.id === id)

    if (!veiculoParaExcluir) {
      throw new Error(`Veículo com ID ${id} não encontrado.`)
    }

    storage.veiculosRegistrados = storage.veiculosRegistrados.filter((v: VeiculoRegistrado) => v.id !== id)

    StorageService.setItem(STORAGE_KEY, storage)
    StorageService.addLog(
      "Exclusão",
      "Administrador",
      `Veículo ${veiculoParaExcluir.marca} ${veiculoParaExcluir.modelo} excluído`,
    )
  },

  /**
   * Obtém um veículo registrado pelo ID
   * @param id ID do veículo a ser obtido
   * @returns Veículo registrado ou null se não encontrado
   */
  getVeiculoRegistradoById: (id: string): VeiculoRegistrado | null => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    if (!storage.veiculosRegistrados) {
      return null
    }

    return storage.veiculosRegistrados.find((v: VeiculoRegistrado) => v.id === id) || null
  },

  /**
   * Adiciona um novo veículo completo
   * @param vehicle Dados do veículo a ser adicionado
   * @returns Veículo adicionado com ID gerado
   */
  addVehicle: (vehicle: any): any => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    // Gerar ID para o novo veículo
    const newId = StorageService.getNextId("vehicles")

    // Criar o novo veículo com ID
    const newVehicle = {
      ...vehicle,
      id: newId,
    }

    // Se não existir a propriedade veiculosData, criar
    if (!storage.veiculosData) {
      storage.veiculosData = []
    }

    // Adicionar o novo veículo
    storage.veiculosData.push(newVehicle)

    // Salvar no storage
    StorageService.setItem(STORAGE_KEY, storage)

    // Adicionar log
    StorageService.addLog("Adição", "Administrador", `Veículo ${newVehicle.placa} adicionado`)

    return newVehicle
  },

  /**
   * Atualiza um veículo existente
   * @param id ID do veículo a ser atualizado
   * @param vehicle Dados parciais do veículo para atualização
   * @returns Veículo atualizado
   * @throws Error se não encontrar o veículo
   */
  updateVehicle: (id: string, vehicle: any): any => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()

    // Se não existir a propriedade veiculosData, criar
    if (!storage.veiculosData) {
      storage.veiculosData = []
    }

    let veiculoAtualizado: any = null

    // Atualizar o veículo
    storage.veiculosData = storage.veiculosData.map((v: any) => {
      if (v.id === id) {
        veiculoAtualizado = { ...v, ...vehicle }
        return veiculoAtualizado
      }
      return v
    })

    // Se não encontrou o veículo, lançar erro
    if (!veiculoAtualizado) {
      throw new Error(`Veículo com ID ${id} não encontrado.`)
    }

    // Salvar no storage
    StorageService.setItem(STORAGE_KEY, storage)

    // Adicionar log
    StorageService.addLog("Atualização", "Administrador", `Veículo ${veiculoAtualizado.placa} atualizado`)

    return veiculoAtualizado
  },

  /**
   * Obtém a lista de veículos
   * @returns Array de veículos
   */
  getVeiculos: (): any[] => {
    const storage = StorageService.getItem<Storage>(STORAGE_KEY) || StorageService.getEmptyStorage()
    return storage.veiculosData || []
  },

  /**
   * Obtém lista de usuários administrativos
   * @returns Array de usuários administrativos
   */
  getAdminUsers(): AdminUser[] {
    if (typeof window === "undefined") return []
    
    const data = StorageService.getItem<Storage>(STORAGE_KEY)
    if (!data || !data.adminUsers) {
      // Se não existir dados de adminUsers, inicializa com array vazio
      const newData = StorageService.getItem<Storage>(STORAGE_KEY) || { adminUsers: [] }
      return (newData?.adminUsers || []) as AdminUser[]
    }
    
    return data.adminUsers as AdminUser[]
  },

  /**
   * Salva lista de usuários administrativos
   * @param users Lista atualizada de usuários administrativos
   */
  saveAdminUsers(users: AdminUser[]): void {
    if (typeof window === "undefined") return
    
    const data = StorageService.getItem<Storage>(STORAGE_KEY)
    if (data) {
      data.adminUsers = users
      StorageService.setItem(STORAGE_KEY, data)
    }
  },

  /**
   * Adiciona ou atualiza um usuário administrativo
   * @param user Usuário a ser adicionado/atualizado
   * @returns Usuário com ID atualizado (se for novo)
   */
  saveAdminUser(user: AdminUser): AdminUser {
    const users = this.getAdminUsers()
    
    if (user.id) {
      // Atualiza usuário existente
      const updatedUsers = users.map(u => u.id === user.id ? user : u)
      this.saveAdminUsers(updatedUsers)
      return user
    } else {
      // Adiciona novo usuário com ID sequencial
      const newId = (users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1).toString()
      const newUser = {
        ...user,
        id: newId
      }
      this.saveAdminUsers([...users, newUser])
      return newUser
    }
  },

  /**
   * Remove um usuário administrativo
   * @param id ID do usuário a ser removido
   */
  deleteAdminUser(id: string): void {
    const users = this.getAdminUsers()
    const updatedUsers = users.filter(u => u.id !== id)
    this.saveAdminUsers(updatedUsers)
  },
}
