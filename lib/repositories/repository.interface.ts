/**
 * Interfaces para repositórios de dados
 * Define contratos genéricos para operações de armazenamento
 */

/**
 * Interface base para todos os modelos com ID
 */
export interface Entity {
  id: string;
  [key: string]: any;
}

/**
 * Interface para operações básicas de repositório
 * @template T Tipo de entidade gerenciada pelo repositório
 */
export interface Repository<T extends Entity> {
  /**
   * Obtém todos os itens do repositório
   * @returns Lista de itens do tipo T
   */
  getAll(): Promise<T[]>;
  
  /**
   * Obtém um item pelo ID
   * @param id ID do item a ser recuperado
   * @returns O item encontrado ou null se não existir
   */
  getById(id: string): Promise<T | null>;
  
  /**
   * Salva um item (adiciona novo ou atualiza existente)
   * @param item Item a ser salvo
   * @returns O item salvo com ID atualizado
   */
  save(item: T): Promise<T>;
  
  /**
   * Remove um item pelo ID
   * @param id ID do item a ser removido
   * @returns Verdadeiro se removido com sucesso
   */
  delete(id: string): Promise<boolean>;
}

/**
 * Interface estendida com operações adicionais
 * @template T Tipo de entidade gerenciada pelo repositório
 */
export interface ExtendedRepository<T extends Entity> extends Repository<T> {
  /**
   * Busca itens que correspondam a critérios específicos
   * @param query Função de filtro para aplicar à coleção
   * @returns Itens filtrados
   */
  query(query: (item: T) => boolean): Promise<T[]>;
  
  /**
   * Verifica se um item existe pelo ID
   * @param id ID do item a verificar
   * @returns Verdadeiro se o item existir
   */
  exists(id: string): Promise<boolean>;
  
  /**
   * Atualiza parte de um item existente (patch)
   * @param id ID do item a atualizar
   * @param partialItem Dados parciais para atualização
   * @returns O item atualizado ou null se não existir
   */
  update(id: string, partialItem: Partial<T>): Promise<T | null>;
  
  /**
   * Salva múltiplos itens de uma só vez
   * @param items Lista de itens a salvar
   * @returns Lista de itens salvos
   */
  saveMany(items: T[]): Promise<T[]>;
  
  /**
   * Remove múltiplos itens pelos IDs
   * @param ids Lista de IDs a remover
   * @returns Número de itens removidos
   */
  deleteMany(ids: string[]): Promise<number>;
  
  /**
   * Conta o número de itens no repositório
   * @param query Função de filtro opcional
   * @returns Número de itens
   */
  count(query?: (item: T) => boolean): Promise<number>;
}

/**
 * Interface para operações de importação/exportação
 * @template T Tipo de entidade gerenciada pelo repositório
 */
export interface ImportExportRepository<T extends Entity> extends Repository<T> {
  /**
   * Exporta todos os dados para um formato serializável
   * @returns Dados exportados em formato JSON
   */
  exportData(): Promise<string>;
  
  /**
   * Importa dados de um formato serializado
   * @param data Dados em formato JSON para importar
   * @param clearExisting Se deve limpar dados existentes
   * @returns Número de itens importados
   */
  importData(data: string, clearExisting?: boolean): Promise<number>;
} 