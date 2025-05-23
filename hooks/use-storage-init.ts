"use client"

import { useEffect } from "react"
import { storageService } from "@/lib/storage-service"

export function useStorageInit() {
  useEffect(() => {
    // Inicializar o serviço de armazenamento com dados de exemplo
    storageService.initializeWithSampleData()
  }, [])
}
