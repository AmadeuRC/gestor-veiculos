/**
 * Configuração do armazenamento de dados
 * Permite alternar entre diferentes métodos de armazenamento (local/remoto)
 */

/**
 * Enumeração para os tipos de armazenamento suportados
 */
export enum StorageType {
  LOCAL_STORAGE = 'localStorage',
  API = 'api',  // Para futura implementação com backend
}

/**
 * Configuração global para o tipo de armazenamento
 */
interface StorageConfig {
  /**
   * Tipo de armazenamento ativo no sistema
   */
  storageType: StorageType;
  
  /**
   * URL base da API para quando o tipo de armazenamento for API
   */
  apiBaseUrl?: string;
  
  /**
   * Se deve manter os dados no localStorage mesmo quando usar API
   * Útil para backup local ou funcionamento offline
   */
  keepLocalBackup?: boolean;
  
  /**
   * Intervalo de sincronização (em ms) para backup local quando usando API
   */
  syncInterval?: number;
}

/**
 * Configuração padrão (desenvolvimento)
 */
const defaultConfig: StorageConfig = {
  storageType: StorageType.LOCAL_STORAGE,
  keepLocalBackup: true,
  syncInterval: 30000, // 30 segundos
};

/**
 * Configuração atual do sistema
 */
let currentConfig: StorageConfig = { ...defaultConfig };

/**
 * Obtém a configuração atual de armazenamento
 * @returns Configuração atual
 */
export function getStorageConfig(): StorageConfig {
  return { ...currentConfig };
}

/**
 * Define a configuração de armazenamento
 * @param config Nova configuração
 */
export function setStorageConfig(config: Partial<StorageConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Verifica se o sistema está usando armazenamento local
 */
export function isUsingLocalStorage(): boolean {
  return currentConfig.storageType === StorageType.LOCAL_STORAGE;
}

/**
 * Verifica se o sistema está usando API
 */
export function isUsingApi(): boolean {
  return currentConfig.storageType === StorageType.API;
}

/**
 * Ativa o modo de armazenamento local
 */
export function enableLocalStorage(): void {
  currentConfig.storageType = StorageType.LOCAL_STORAGE;
}

/**
 * Ativa o modo de API com o backend
 * @param apiBaseUrl URL base para a API
 */
export function enableApiStorage(apiBaseUrl: string): void {
  currentConfig.storageType = StorageType.API;
  currentConfig.apiBaseUrl = apiBaseUrl;
} 