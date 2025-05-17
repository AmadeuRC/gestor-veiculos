/**
 * Serviço para gerenciar logs do sistema
 */
import { LogEntry } from '../models/log.model'
import { StorageBaseService } from './storage-base.service'

/**
 * Classe para gerenciar logs do sistema
 */
export class LogService extends StorageBaseService {
  /**
   * Obtém todos os logs
   * @returns Lista de logs
   */
  public static getLogs(): LogEntry[] {
    const data = this.getStorage()
    return data?.logs || []
  }

  /**
   * Obtém um log pelo ID
   * @param id ID do log
   * @returns Log encontrado ou undefined
   */
  public static getLogById(id: string): LogEntry | undefined {
    const logs = this.getLogs()
    return logs.find(log => log.id === id)
  }

  /**
   * Adiciona um novo log
   * @param action Ação realizada
   * @param user Usuário que realizou a ação
   * @param details Detalhes da ação
   * @returns Log criado
   */
  public static addLog(action: string, user: string, details: string): LogEntry {
    const data = this.getStorage() || this.getEmptyStorage()
    
    // Cria o novo log
    const newLog: LogEntry = {
      id: this.getNextId('logs'),
      action,
      user,
      timestamp: new Date().toISOString(),
      details
    }
    
    // Adiciona ao armazenamento
    const logs = [...data.logs, newLog]
    this.setStorage({ ...data, logs })
    
    return newLog
  }

  /**
   * Limpa todos os logs do sistema
   */
  public static clearLogs(): void {
    const data = this.getStorage()
    if (!data) return
    
    this.setStorage({ ...data, logs: [] })
  }

  /**
   * Obtém logs filtrados por usuário
   * @param user Nome ou ID do usuário
   * @returns Lista de logs do usuário
   */
  public static getLogsByUser(user: string): LogEntry[] {
    const logs = this.getLogs()
    return logs.filter(log => log.user.includes(user))
  }

  /**
   * Obtém logs filtrados por ação
   * @param action Nome da ação
   * @returns Lista de logs da ação
   */
  public static getLogsByAction(action: string): LogEntry[] {
    const logs = this.getLogs()
    return logs.filter(log => log.action.includes(action))
  }

  /**
   * Obtém logs em um intervalo de datas
   * @param startDate Data inicial (ISO string)
   * @param endDate Data final (ISO string)
   * @returns Lista de logs no intervalo
   */
  public static getLogsByDateRange(startDate: string, endDate: string): LogEntry[] {
    const logs = this.getLogs()
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    
    return logs.filter(log => {
      const timestamp = new Date(log.timestamp).getTime()
      return timestamp >= start && timestamp <= end
    })
  }
} 