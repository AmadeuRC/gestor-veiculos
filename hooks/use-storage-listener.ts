"use client"

import { useEffect, useState } from "react"

// Tipo para os callbacks de mudança
type StorageChangeCallback = () => void

// Lista de callbacks registrados
const storageChangeCallbacks: StorageChangeCallback[] = []

// Função para adicionar callback
export function addStorageChangeListener(callback: StorageChangeCallback) {
  storageChangeCallbacks.push(callback)
  
  // Retorna função para remover o callback
  return () => {
    const index = storageChangeCallbacks.indexOf(callback)
    if (index > -1) {
      storageChangeCallbacks.splice(index, 1)
    }
  }
}

// Função para disparar todos os callbacks
export function notifyStorageChange() {
  storageChangeCallbacks.forEach(callback => callback())
}

/**
 * Hook para detectar mudanças no localStorage
 * @param storageKey Chave do localStorage a ser monitorada
 * @param initialValue Valor inicial
 * @returns [value, forceUpdate] - valor atual e função para forçar atualização
 */
export function useStorageListener<T>(storageKey: string, initialValue: T): [T, () => void] {
  const [value, setValue] = useState<T>(initialValue)
  const [updateCounter, setUpdateCounter] = useState(0)

  // Função para forçar atualização
  const forceUpdate = () => {
    setUpdateCounter(prev => prev + 1)
  }

  useEffect(() => {
    // Função para atualizar o valor do localStorage
    const updateValue = () => {
      if (typeof window === "undefined") return
      
      try {
        const item = localStorage.getItem(storageKey)
        if (item !== null) {
          setValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Erro ao ler ${storageKey} do localStorage:`, error)
      }
    }

    // Atualizar valor inicial
    updateValue()

    // Registrar callback para mudanças no storage
    const removeListener = addStorageChangeListener(updateValue)

    // Listener para mudanças do localStorage de outras abas/janelas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        updateValue()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      removeListener()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [storageKey, updateCounter])

  return [value, forceUpdate]
}

/**
 * Hook simplificado para monitorar mudanças gerais no storage
 * @returns função para forçar atualização
 */
export function useStorageUpdater(): () => void {
  const [updateCounter, setUpdateCounter] = useState(0)

  const forceUpdate = () => {
    setUpdateCounter(prev => prev + 1)
    notifyStorageChange()
  }

  useEffect(() => {
    const removeListener = addStorageChangeListener(() => {
      setUpdateCounter(prev => prev + 1)
    })

    return removeListener
  }, [])

  return forceUpdate
} 