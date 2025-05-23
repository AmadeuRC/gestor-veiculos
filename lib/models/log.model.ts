/**
 * Modelo para logs no sistema
 */

/**
 * Interface para entradas de log
 */
export interface LogEntry {
  id: string
  action: string
  user: string
  timestamp: string
  details: string
} 