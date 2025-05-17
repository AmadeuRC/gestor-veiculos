"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  name: string;
  role: string;
  loginTimestamp?: number; // timestamp de quando o login foi realizado
  expiresAt?: number;      // timestamp de quando a sessão expira
}

// Duração da sessão em milissegundos (12 horas)
const SESSION_DURATION = 12 * 60 * 60 * 1000;

// Tempo antes da expiração para mostrar o aviso (30 minutos)
const WARN_BEFORE_EXPIRATION = 30 * 60 * 1000;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExpirationWarning, setShowExpirationWarning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Renovar a sessão por mais 12 horas
  const renewSession = useCallback(() => {
    if (!user) return;
    
    const now = Date.now();
    const updatedUser = {
      ...user,
      loginTimestamp: now,
      expiresAt: now + SESSION_DURATION
    };
    
    // Atualizar no storage apropriado
    if (isPersistentSession()) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    setUser(updatedUser);
    setShowExpirationWarning(false);
    
    console.log("Sessão renovada, nova expiração:", new Date(updatedUser.expiresAt || 0).toLocaleString());
  }, [user]);

  // Verificar a validade da sessão
  const checkSessionValidity = useCallback(() => {
    if (!user || !user.expiresAt) return;
    
    const now = Date.now();
    const timeUntilExpiration = user.expiresAt - now;
    
    // Se já expirou, fazer logout
    if (timeUntilExpiration <= 0) {
      console.log("Sessão expirada, fazendo logout");
      logout();
      return;
    }
    
    // Se está perto de expirar, mostrar aviso
    if (timeUntilExpiration <= WARN_BEFORE_EXPIRATION) {
      setShowExpirationWarning(true);
    } else {
      setShowExpirationWarning(false);
    }
  }, [user]);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = () => {
      setLoading(true);
      try {
        // Verificar tanto no localStorage quanto no sessionStorage
        const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (!userStr) {
          if (pathname !== "/login") {
            router.push("/login");
          }
          setLoading(false);
          return;
        }

        const userData = JSON.parse(userStr) as User;
        
        // Verificar se os dados de timestamp e expiração existem
        // Se não existirem (usuários que fizeram login antes desta implementação), adicioná-los
        if (!userData.loginTimestamp || !userData.expiresAt) {
          const now = Date.now();
          userData.loginTimestamp = now;
          userData.expiresAt = now + SESSION_DURATION;
          
          // Atualizar no storage
          if (localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            sessionStorage.setItem("user", JSON.stringify(userData));
          }
        }
        
        // Verificar se a sessão expirou
        if (userData.expiresAt && userData.expiresAt < Date.now()) {
          console.log("Sessão expirada durante verificação");
          logout();
          return;
        }
        
        setUser(userData);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        // Limpar ambos os storages em caso de erro
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        if (pathname !== "/login") {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Efeito para verificar a validade da sessão periodicamente
  useEffect(() => {
    if (!user) return;
    
    // Verificar imediatamente
    checkSessionValidity();
    
    // Verificar a cada minuto
    const interval = setInterval(checkSessionValidity, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, checkSessionValidity]);

  // Função para realizar logout
  const logout = () => {
    // Limpar ambos os storages para garantir
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
    setShowExpirationWarning(false);
    router.push("/login");
  };

  // Verificar se o usuário está usando armazenamento persistente
  const isPersistentSession = () => {
    return !!localStorage.getItem("user");
  };

  return {
    user,
    loading,
    logout,
    isPersistentSession,
    isAuthenticated: !!user,
    showExpirationWarning,
    renewSession
  };
} 