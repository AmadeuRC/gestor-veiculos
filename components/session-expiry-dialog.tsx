"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock, AlertCircle } from "lucide-react"

interface SessionExpiryDialogProps {
  open: boolean
  onRenew: () => void
  onLogout: () => void
}

export function SessionExpiryDialog({ open, onRenew, onLogout }: SessionExpiryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">Sessão Expirando</DialogTitle>
        </DialogHeader>
        <div className="text-center py-3">
          <p className="text-gray-700">Sua sessão está prestes a expirar.</p>
          <p className="text-gray-700 mt-1">Deseja continuar conectado?</p>
        </div>
        <DialogFooter className="flex justify-center gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="w-full sm:w-auto"
          >
            Não
          </Button>
          <Button 
            onClick={onRenew} 
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            Sim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 