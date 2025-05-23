/**
 * Utilitário para gerenciar o armazenamento no localStorage
 */

/**
 * Classe auxiliar para gerenciar o armazenamento no localStorage
 * Fornece métodos para persistência e manipulação de dados
 */
export class LocalStorageUtil {
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
} 