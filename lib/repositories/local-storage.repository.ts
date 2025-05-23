/**
 * Implementação de repositório usando localStorage
 */
import { Entity, ExtendedRepository, ImportExportRepository } from './repository.interface';
import { LocalStorageUtil } from '../utils/local-storage.util';

/**
 * Implementação base de repositório usando localStorage
 * @template T Tipo de entidade gerenciada pelo repositório
 */
export abstract class LocalStorageRepository<T extends Entity> 
  implements ExtendedRepository<T>, ImportExportRepository<T> {
  
  /**
   * Construtor do repositório
   * @param storageKey Chave para armazenamento no localStorage
   * @param entityName Nome da entidade para logs e geração de IDs
   */
  constructor(
    protected readonly storageKey: string,
    protected readonly entityName: string
  ) {}

  /**
   * Método abstrato para gerar IDs para novas entidades
   * Permite que cada implementação defina sua própria estratégia
   * @returns ID único para a entidade
   */
  protected abstract generateId(): string;

  /**
   * Obtém todas as entidades do repositório
   */
  async getAll(): Promise<T[]> {
    const items = LocalStorageUtil.getItem<T[]>(this.storageKey) || [];
    return [...items];
  }

  /**
   * Obtém uma entidade pelo ID
   * @param id ID da entidade
   */
  async getById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find(item => item.id === id) || null;
  }

  /**
   * Salva uma entidade (adiciona ou atualiza)
   * @param item Entidade a ser salva
   */
  async save(item: T): Promise<T> {
    const items = await this.getAll();
    const index = items.findIndex(i => i.id === item.id);
    
    // Se a entidade não tem ID, gera um novo
    if (!item.id) {
      item.id = this.generateId();
    }
    
    // Atualiza ou adiciona a entidade
    if (index >= 0) {
      items[index] = { ...items[index], ...item };
    } else {
      items.push(item);
    }
    
    // Salva no localStorage
    LocalStorageUtil.setItem(this.storageKey, items);
    
    return { ...item };
  }

  /**
   * Remove uma entidade pelo ID
   * @param id ID da entidade a remover
   */
  async delete(id: string): Promise<boolean> {
    const items = await this.getAll();
    const initialCount = items.length;
    const newItems = items.filter(item => item.id !== id);
    
    if (newItems.length === initialCount) {
      return false; // Nada foi removido
    }
    
    LocalStorageUtil.setItem(this.storageKey, newItems);
    return true;
  }

  /**
   * Busca entidades que correspondam a critérios específicos
   * @param query Função de filtro
   */
  async query(query: (item: T) => boolean): Promise<T[]> {
    const items = await this.getAll();
    return items.filter(query);
  }

  /**
   * Verifica se uma entidade existe pelo ID
   * @param id ID da entidade
   */
  async exists(id: string): Promise<boolean> {
    const item = await this.getById(id);
    return item !== null;
  }

  /**
   * Atualiza parte de uma entidade existente
   * @param id ID da entidade
   * @param partialItem Dados parciais para atualização
   */
  async update(id: string, partialItem: Partial<T>): Promise<T | null> {
    const item = await this.getById(id);
    
    if (!item) {
      return null;
    }
    
    const updatedItem = { ...item, ...partialItem, id };
    await this.save(updatedItem);
    
    return updatedItem;
  }

  /**
   * Salva múltiplas entidades
   * @param items Lista de entidades a salvar
   */
  async saveMany(items: T[]): Promise<T[]> {
    const currentItems = await this.getAll();
    const result: T[] = [];
    
    // Processa cada entidade
    for (const item of items) {
      // Se a entidade não tem ID, gera um novo
      if (!item.id) {
        item.id = this.generateId();
      }
      
      const index = currentItems.findIndex(i => i.id === item.id);
      
      // Atualiza ou adiciona a entidade
      if (index >= 0) {
        currentItems[index] = { ...currentItems[index], ...item };
      } else {
        currentItems.push(item);
      }
      
      result.push({ ...item });
    }
    
    // Salva no localStorage
    LocalStorageUtil.setItem(this.storageKey, currentItems);
    
    return result;
  }

  /**
   * Remove múltiplas entidades pelos IDs
   * @param ids Lista de IDs a remover
   */
  async deleteMany(ids: string[]): Promise<number> {
    const items = await this.getAll();
    const initialCount = items.length;
    const newItems = items.filter(item => !ids.includes(item.id));
    
    LocalStorageUtil.setItem(this.storageKey, newItems);
    
    return initialCount - newItems.length;
  }

  /**
   * Conta o número de entidades no repositório
   * @param query Função de filtro opcional
   */
  async count(query?: (item: T) => boolean): Promise<number> {
    const items = await this.getAll();
    
    if (query) {
      return items.filter(query).length;
    }
    
    return items.length;
  }

  /**
   * Exporta todos os dados para um formato serializável
   */
  async exportData(): Promise<string> {
    const items = await this.getAll();
    return JSON.stringify(items);
  }

  /**
   * Importa dados de um formato serializado
   * @param data Dados em formato JSON para importar
   * @param clearExisting Se deve limpar dados existentes
   */
  async importData(data: string, clearExisting: boolean = false): Promise<number> {
    try {
      const importedItems = JSON.parse(data) as T[];
      
      if (!Array.isArray(importedItems)) {
        throw new Error('Os dados importados não são um array válido');
      }
      
      if (clearExisting) {
        LocalStorageUtil.setItem(this.storageKey, importedItems);
        return importedItems.length;
      } else {
        const currentItems = await this.getAll();
        const mergedItems = [...currentItems];
        
        for (const item of importedItems) {
          const index = mergedItems.findIndex(i => i.id === item.id);
          
          if (index >= 0) {
            mergedItems[index] = item;
          } else {
            mergedItems.push(item);
          }
        }
        
        LocalStorageUtil.setItem(this.storageKey, mergedItems);
        return importedItems.length;
      }
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw new Error('Formato de dados inválido');
    }
  }
} 