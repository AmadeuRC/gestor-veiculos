/**
 * Serviço para gerenciar usuários
 */
import { User, AdminUser } from '../models/user.model'
import { StorageBaseService } from './storage-base.service'
import { Storage } from '../models/storage.model'
import { hashPassword, verifyPassword } from '../utils/password.util'

/**
 * Configuração para usuário de teste (remover em produção)
 * Facilita o acesso rápido para demonstração e testes
 */
const TEST_USER = {
  enabled: true, // Definir como false para desativar a autenticação de teste
  username: 'admin',
  password: 'admin'
};

/**
 * Classe para gerenciar usuários regulares e administrativos
 */
export class UserService extends StorageBaseService {
  // Métodos para usuários regulares
  
  /**
   * Obtém todos os usuários
   * @returns Lista de usuários
   */
  public static getUsers(): User[] {
    const data = this.getStorage()
    return data?.users || []
  }

  /**
   * Obtém um usuário pelo ID
   * @param id ID do usuário
   * @returns Usuário encontrado ou undefined
   */
  public static getUserById(id: string): User | undefined {
    const users = this.getUsers()
    return users.find(user => user.id === id)
  }

  /**
   * Salva um usuário (novo ou existente)
   * @param user Dados do usuário
   * @returns Usuário salvo
   */
  public static saveUser(user: User): User {
    const data = this.getStorage() || this.getEmptyStorage()
    const users = [...data.users]
    
    // Verifica se é um usuário existente ou novo
    const existingIndex = users.findIndex(u => u.id === user.id)
    
    if (existingIndex >= 0) {
      // Atualiza usuário existente
      users[existingIndex] = { ...user }
    } else {
      // Adiciona novo usuário com ID gerado
      const newUser = {
        ...user,
        id: this.getNextId('users'),
        createdAt: new Date().toISOString()
      }
      users.push(newUser)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, users })
    
    return user
  }

  /**
   * Remove um usuário
   * @param id ID do usuário a ser removido
   */
  public static deleteUser(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const users = data.users.filter(user => user.id !== id)
    this.setStorage({ ...data, users })
  }

  // Métodos para usuários administrativos
  
  /**
   * Obtém todos os usuários administrativos
   * @returns Lista de usuários administrativos
   */
  public static getAdminUsers(): AdminUser[] {
    const data = this.getStorage()
    return data?.adminUsers || []
  }

  /**
   * Obtém um usuário administrativo pelo ID
   * @param id ID do usuário administrativo
   * @returns Usuário administrativo encontrado ou undefined
   */
  public static getAdminUserById(id: string): AdminUser | undefined {
    const users = this.getAdminUsers()
    return users.find(user => user.id === id)
  }

  /**
   * Salva um usuário administrativo (novo ou existente)
   * @param user Dados do usuário administrativo
   * @returns Usuário administrativo salvo
   */
  public static saveAdminUser(user: AdminUser): AdminUser {
    const data = this.getStorage() || this.getEmptyStorage()
    const adminUsers = [...(data.adminUsers || [])]
    
    // Cria uma cópia do usuário para não modificar o original
    const userToSave = { ...user }
    
    // Se houver senha temporária, criptografa antes de salvar
    if (userToSave.senha) {
      const { hash, salt } = hashPassword(userToSave.senha)
      userToSave.senhaHash = hash
      userToSave.senhaSalt = salt
      delete userToSave.senha // Remove a senha em texto plano
    }
    
    // Verifica se é um usuário existente ou novo
    const existingIndex = adminUsers.findIndex(u => u.id === userToSave.id)
    
    if (existingIndex >= 0) {
      // Para atualizações, preserva hash e salt se não foram fornecidos novos
      if (!userToSave.senhaHash && adminUsers[existingIndex].senhaHash) {
        userToSave.senhaHash = adminUsers[existingIndex].senhaHash
        userToSave.senhaSalt = adminUsers[existingIndex].senhaSalt
      }
      // Atualiza usuário existente
      adminUsers[existingIndex] = userToSave
    } else {
      // Determina o próximo ID com base no maior ID atual
      const maxId = adminUsers.length > 0 
        ? Math.max(...adminUsers.map(u => parseInt(u.id) || 0)) 
        : 0;
      const nextId = (maxId + 1).toString();
      
      // Adiciona novo usuário com ID gerado
      const newUser = {
        ...userToSave,
        id: nextId
      }
      adminUsers.push(newUser)
    }
    
    // Atualiza o armazenamento
    this.setStorage({ ...data, adminUsers })
    
    console.log('Usuário salvo:', {
      id: userToSave.id,
      nome: userToSave.nome,
      email: userToSave.email,
      tipo: userToSave.tipo,
      hasPasswordHash: !!userToSave.senhaHash,
      hasPasswordSalt: !!userToSave.senhaSalt
    });
    
    return userToSave
  }

  /**
   * Remove um usuário administrativo
   * @param id ID do usuário administrativo a ser removido
   */
  public static deleteAdminUser(id: string): void {
    const data = this.getStorage()
    if (!data) return
    
    const adminUsers = (data.adminUsers || []).filter(user => user.id !== id)
    this.setStorage({ ...data, adminUsers })
  }

  /**
   * Verifica se as credenciais de teste são válidas (APENAS PARA DESENVOLVIMENTO)
   * @param email Email a verificar
   * @param senha Senha a verificar
   * @returns Verdadeiro se as credenciais corresponderem ao usuário de teste
   */
  private static isTestUserValid(email: string, senha: string): boolean {
    // Para desativar a autenticação de teste, basta alterar TEST_USER.enabled para false
    if (!TEST_USER.enabled) return false;
    
    return email === TEST_USER.username && senha === TEST_USER.password;
  }

  /**
   * Verifica se um usuário e senha são válidos para login
   * @param email Email do usuário
   * @param senha Senha do usuário
   * @returns Verdadeiro se as credenciais forem válidas
   */
  public static validarCredenciais(email: string, senha: string): boolean {
    console.log('Tentativa de login:', { email });
    
    // Verificação de usuário de teste (remover em produção)
    if (this.isTestUserValid(email, senha)) {
      console.log('Login com usuário de teste realizado com sucesso');
      return true;
    }
    
    // Verificar credenciais nos usuários administrativos
    const adminUsers = this.getAdminUsers()
    console.log('Total de usuários administrativos:', adminUsers.length);
    
    // Encontra o usuário pelo email
    const user = adminUsers.find(user => 
      user.email === email && 
      user.ativo === true
    )
    
    if (!user) {
      console.log('Usuário não encontrado ou inativo');
      return false;
    }
    
    console.log('Usuário encontrado:', { 
      id: user.id, 
      nome: user.nome, 
      email: user.email,
      tipo: user.tipo,
      hasPasswordHash: !!user.senhaHash,
      hasPasswordSalt: !!user.senhaSalt
    });
    
    // Se não encontrou o usuário ou não tem hash e salt, falha na autenticação
    if (!user.senhaHash || !user.senhaSalt) {
      console.log('Usuário sem hash ou salt de senha');
      return false;
    }
    
    // Verifica se a senha fornecida corresponde ao hash armazenado
    const isValid = verifyPassword(senha, user.senhaHash, user.senhaSalt);
    console.log('Resultado da verificação de senha:', isValid);
    
    return isValid;
  }
} 