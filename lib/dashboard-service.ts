import { format, subMonths, isWithinInterval, startOfMonth, endOfMonth, parseISO } from "date-fns"
import { storageService, type Abastecimento } from "./storage-service"

// Interface para estatísticas mensais
export interface MonthlyStats {
  month: string // Formato: "MMM" (Jan, Fev, etc.)
  year: number
  abastecimentos: number
  consumo: number
  valor: number
}

// Interface para estatísticas do dashboard
export interface DashboardStats {
  totalAbastecimentos: number
  totalConsumo: number
  totalValor: number
  percentAbastecimentos: number
  percentConsumo: number
  percentValor: number
  monthlyData: MonthlyStats[]
}

// Interface para estatísticas de veículos
export interface VehicleStats {
  totalVehicles: number
  activeVehicles: number
  pendingMaintenance: number
  percentActiveVehicles: number
  percentChange: number
}

// Interface para estatísticas de funcionários
export interface EmployeeStats {
  totalEmployees: number
  drivers: number
  departments: number
  percentDrivers: number
  percentChange: number
}

/**
 * Serviço para gerenciar dados estatísticos do dashboard
 */
export const dashboardService = {
  /**
   * Obtém estatísticas para o mês selecionado
   * @param selectedDate Data selecionada para filtrar as estatísticas
   * @returns Estatísticas do dashboard para o mês selecionado
   */
  getDashboardStats(selectedDate: Date): DashboardStats {
    // Obter todos os abastecimentos
    const abastecimentos = storageService.getAbastecimentos()

    // Definir intervalo do mês atual
    const startOfCurrentMonth = startOfMonth(selectedDate)
    const endOfCurrentMonth = endOfMonth(selectedDate)

    // Definir intervalo do mês anterior
    const previousMonthDate = subMonths(selectedDate, 1)
    const startOfPreviousMonth = startOfMonth(previousMonthDate)
    const endOfPreviousMonth = endOfMonth(previousMonthDate)

    // Filtrar abastecimentos do mês atual
    const currentMonthAbastecimentos = abastecimentos.filter((a) => {
      const abastecimentoDate = parseISO(this.convertBrazilianDateToISO(a.data))
      return isWithinInterval(abastecimentoDate, {
        start: startOfCurrentMonth,
        end: endOfCurrentMonth,
      })
    })

    // Filtrar abastecimentos do mês anterior
    const previousMonthAbastecimentos = abastecimentos.filter((a) => {
      const abastecimentoDate = parseISO(this.convertBrazilianDateToISO(a.data))
      return isWithinInterval(abastecimentoDate, {
        start: startOfPreviousMonth,
        end: endOfPreviousMonth,
      })
    })

    // Calcular estatísticas do mês atual
    const totalAbastecimentos = currentMonthAbastecimentos.length
    const totalConsumo = this.calculateTotalConsumo(currentMonthAbastecimentos)
    const totalValor = this.calculateTotalValor(currentMonthAbastecimentos)

    // Calcular estatísticas do mês anterior
    const prevTotalAbastecimentos = previousMonthAbastecimentos.length
    const prevTotalConsumo = this.calculateTotalConsumo(previousMonthAbastecimentos)
    const prevTotalValor = this.calculateTotalValor(previousMonthAbastecimentos)

    // Calcular variações percentuais
    const percentAbastecimentos = this.calculatePercentChange(totalAbastecimentos, prevTotalAbastecimentos)
    const percentConsumo = this.calculatePercentChange(totalConsumo, prevTotalConsumo)
    const percentValor = this.calculatePercentChange(totalValor, prevTotalValor)

    // Obter dados históricos para o gráfico (últimos 6 meses)
    const monthlyData = this.getHistoricalData(selectedDate, 6)

    return {
      totalAbastecimentos,
      totalConsumo,
      totalValor,
      percentAbastecimentos,
      percentConsumo,
      percentValor,
      monthlyData,
    }
  },

  /**
   * Obtém estatísticas de veículos
   * @returns Estatísticas de veículos
   */
  getVehicleStats(): VehicleStats {
    const vehicles = storageService.getVeiculos()

    // Veículos ativos são aqueles que têm a propriedade ativo como true
    const activeVehicles = vehicles.filter((v) => v.ativo === true).length

    // Simulando manutenções pendentes (12% dos veículos)
    const pendingMaintenance = Math.floor(vehicles.length * 0.12)

    return {
      totalVehicles: vehicles.length,
      activeVehicles,
      pendingMaintenance,
      percentActiveVehicles: vehicles.length > 0 ? (activeVehicles / vehicles.length) * 100 : 0,
      percentChange: 4.8, // Simulado - em um sistema real, seria calculado com base em dados históricos
    }
  },

  /**
   * Obtém estatísticas de funcionários
   * @returns Estatísticas de funcionários
   */
  getEmployeeStats(): EmployeeStats {
    const employees = storageService.getEmployees()
    const departments = storageService.getDepartments()

    // Simulando motoristas (em um sistema real, seria baseado na posição do funcionário)
    const drivers = employees.filter((e) => e.position.toLowerCase().includes("motorista")).length

    return {
      totalEmployees: employees.length,
      drivers,
      departments: departments.length,
      percentDrivers: (drivers / employees.length) * 100,
      percentChange: 1.9, // Simulado - em um sistema real, seria calculado com base em dados históricos
    }
  },

  /**
   * Obtém dados históricos para um período
   * @param endDate Data final do período
   * @param monthsCount Número de meses a serem incluídos
   * @returns Array de estatísticas mensais
   */
  getHistoricalData(endDate: Date, monthsCount: number): MonthlyStats[] {
    const result: MonthlyStats[] = []
    const abastecimentos = storageService.getAbastecimentos()

    for (let i = monthsCount - 1; i >= 0; i--) {
      const currentDate = subMonths(endDate, i)
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)

      const monthAbastecimentos = abastecimentos.filter((a) => {
        const abastecimentoDate = parseISO(this.convertBrazilianDateToISO(a.data))
        return isWithinInterval(abastecimentoDate, {
          start: monthStart,
          end: monthEnd,
        })
      })

      result.push({
        month: format(currentDate, "MMM"),
        year: currentDate.getFullYear(),
        abastecimentos: monthAbastecimentos.length,
        consumo: this.calculateTotalConsumo(monthAbastecimentos),
        valor: this.calculateTotalValor(monthAbastecimentos),
      })
    }

    return result
  },

  /**
   * Calcula o consumo total de um conjunto de abastecimentos
   * @param abastecimentos Array de abastecimentos
   * @returns Consumo total em litros
   */
  calculateTotalConsumo(abastecimentos: Abastecimento[]): number {
    return abastecimentos.reduce((total, abastecimento) => {
      // Usar a quantidade em litros em vez do valor monetário
      const quantidade = Number.parseFloat(abastecimento.quantidade) || 0
      return total + quantidade
    }, 0)
  },

  /**
   * Calcula o valor total de um conjunto de abastecimentos
   * @param abastecimentos Array de abastecimentos
   * @returns Valor total em reais
   */
  calculateTotalValor(abastecimentos: Abastecimento[]): number {
    return abastecimentos.reduce((total, abastecimento) => {
      // Buscar o preço do combustível
      const combustiveis = storageService.getCombustiveis()
      const combustivel = combustiveis.find((c) => c.combustivel === abastecimento.combustivel)

      if (combustivel) {
        const quantidade = Number.parseFloat(abastecimento.valor) || 0
        const preco = Number.parseFloat(combustivel.valor) || 0
        return total + quantidade * preco
      }

      return total
    }, 0)
  },

  /**
   * Calcula a variação percentual entre dois valores
   * @param current Valor atual
   * @param previous Valor anterior
   * @returns Variação percentual
   */
  calculatePercentChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  },

  /**
   * Converte data no formato brasileiro (DD/MM/YYYY) para ISO (YYYY-MM-DD)
   * @param brazilianDate Data no formato brasileiro
   * @returns Data no formato ISO
   */
  convertBrazilianDateToISO(brazilianDate: string): string {
    const parts = brazilianDate.split("/")
    if (parts.length !== 3) return new Date().toISOString().split("T")[0]

    return `${parts[2]}-${parts[1]}-${parts[0]}`
  },

  /**
   * Formata um valor numérico como moeda brasileira
   * @param value Valor a ser formatado
   * @returns String formatada (ex: "R$ 1.234,56")
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  },

  /**
   * Formata um valor numérico com separador de milhares
   * @param value Valor a ser formatado
   * @returns String formatada (ex: "1.234,56")
   */
  formatNumber(value: number): string {
    return new Intl.NumberFormat("pt-BR").format(value)
  },
}
