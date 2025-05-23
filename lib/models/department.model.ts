/**
 * Modelos para departamentos e funcionários no sistema
 */

/**
 * Interface para departamentos
 */
export interface Department {
  id: string
  name: string
  manager: string
  budget: number
}

/**
 * Interface para funcionários
 */
export interface Employee {
  id: string
  name: string
  position: string
  department: string
  hireDate: string
} 