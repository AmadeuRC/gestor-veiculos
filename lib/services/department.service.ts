/**
 * Serviço para gerenciar departamentos e funcionários
 */
import { Department, Employee } from '../models/department.model'
import { StorageBaseService } from './storage-base.service'

/**
 * Classe para gerenciar departamentos e funcionários
 */
export class DepartmentService extends StorageBaseService {
  // Métodos para departamentos
  
  /**
   * Obtém todos os departamentos
   * @returns Lista de departamentos
   */
  public static getDepartments(): Department[] {
    const data = this.getStorage()
    return data?.departments || []
  }

  /**
   * Obtém um departamento pelo ID
   * @param id ID do departamento
   * @returns Departamento encontrado ou undefined
   */
  public static getDepartmentById(id: string): Department | undefined {
    const departments = this.getDepartments()
    return departments.find(department => department.id === id)
  }

  /**
   * Salva um departamento (novo ou existente)
   * @param department Dados do departamento
   * @returns Departamento salvo
   */
  public static saveDepartment(department: Department): Department {
    const data = this.getStorage() || this.getEmptyStorage()
    const departments = [...data.departments]
    
    // Verifica se é um departamento existente ou novo
    const existingIndex = departments.findIndex(d => d.id === department.id)
    
    if (existingIndex >= 0) {
      // Atualiza departamento existente
      departments[existingIndex] = { ...department }
    } else {
      // Adiciona novo departamento com ID gerado
      const newDepartment = {
        ...department,
        id: this.getNextId('departments')
      }
      departments.push(newDepartment)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, departments })
    
    return department
  }

  /**
   * Remove um departamento
   * @param id ID do departamento a ser removido
   */
  public static deleteDepartment(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const departments = data.departments.filter(department => department.id !== id)
    this.setStorage({ ...data, departments })
  }

  // Métodos para funcionários
  
  /**
   * Obtém todos os funcionários
   * @returns Lista de funcionários
   */
  public static getEmployees(): Employee[] {
    const data = this.getStorage()
    return data?.employees || []
  }

  /**
   * Obtém um funcionário pelo ID
   * @param id ID do funcionário
   * @returns Funcionário encontrado ou undefined
   */
  public static getEmployeeById(id: string): Employee | undefined {
    const employees = this.getEmployees()
    return employees.find(employee => employee.id === id)
  }

  /**
   * Salva um funcionário (novo ou existente)
   * @param employee Dados do funcionário
   * @returns Funcionário salvo
   */
  public static saveEmployee(employee: Employee): Employee {
    const data = this.getStorage() || this.getEmptyStorage()
    const employees = [...data.employees]
    
    // Verifica se é um funcionário existente ou novo
    const existingIndex = employees.findIndex(e => e.id === employee.id)
    
    if (existingIndex >= 0) {
      // Atualiza funcionário existente
      employees[existingIndex] = { ...employee }
    } else {
      // Adiciona novo funcionário com ID gerado
      const newEmployee = {
        ...employee,
        id: this.getNextId('employees'),
        hireDate: employee.hireDate || new Date().toISOString()
      }
      employees.push(newEmployee)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, employees })
    
    return employee
  }

  /**
   * Remove um funcionário
   * @param id ID do funcionário a ser removido
   */
  public static deleteEmployee(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const employees = data.employees.filter(employee => employee.id !== id)
    this.setStorage({ ...data, employees })
  }

  /**
   * Obtém funcionários por departamento
   * @param departmentId ID do departamento
   * @returns Lista de funcionários do departamento
   */
  public static getEmployeesByDepartment(departmentId: string): Employee[] {
    const employees = this.getEmployees()
    return employees.filter(employee => employee.department === departmentId)
  }

  /**
   * Obtém funcionários por cargo
   * @param position Cargo ou parte do cargo
   * @returns Lista de funcionários com o cargo especificado
   */
  public static getEmployeesByPosition(position: string): Employee[] {
    const employees = this.getEmployees()
    return employees.filter(employee => 
      employee.position.toLowerCase().includes(position.toLowerCase())
    )
  }
} 