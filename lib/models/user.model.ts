/**
 * Modelos para usuários no sistema
 */

/**
 * Interface para usuários regulares do sistema
 */
export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

/**
 * Interface para usuários administrativos
 */
export interface AdminUser {
  id: string
  nome: string
  email: string
  tipo: string
  ativo: boolean
  senhaHash?: string  // Hash da senha (armazenado)
  senhaSalt?: string  // Salt utilizado para gerar o hash
  senha?: string      // Senha temporária (não armazenada) - usado apenas durante o cadastro/login
} 