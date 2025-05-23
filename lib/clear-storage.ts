import { STORAGE_KEY } from "./models/storage.model";

/**
 * Limpa todos os dados do localStorage, mantendo apenas o usuário admin.
 * Reinicializa contadores e estruturas de dados.
 */
export function clearStorage(): void {
  // Verifica se estamos no navegador
  if (typeof window === "undefined") return;

  try {
    // Obter dados atuais do localStorage
    const storageData = localStorage.getItem(STORAGE_KEY);
    
    if (!storageData) {
      console.log("Nenhum dado para limpar");
      return;
    }
    
    const data = JSON.parse(storageData);
    console.log("Dados atuais antes da limpeza:", data);
    
    // Criar um novo objeto com apenas o usuário admin
    const cleanedData = {
      users: [
        {
          id: "1",
          name: "Administrador",
          email: "admin@sistema.com",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
      ],
      vehicles: [],
      brands: [
        { id: "1", name: "Volkswagen", country: "Alemanha" },
        { id: "2", name: "Fiat", country: "Itália" },
        { id: "3", name: "Toyota", country: "Japão" },
        { id: "4", name: "Ford", country: "Estados Unidos" },
        { id: "5", name: "Chevrolet", country: "Estados Unidos" },
      ],
      veiculosRegistrados: [],
      departments: [
        { id: "1", name: "Educação", manager: "Secretário de Educação", budget: 1000000 },
        { id: "2", name: "Saúde", manager: "Secretário de Saúde", budget: 2000000 },
        { id: "3", name: "Obras", manager: "Secretário de Obras", budget: 1500000 },
        { id: "4", name: "Transporte", manager: "Secretário de Transporte", budget: 800000 },
        { id: "5", name: "Administração", manager: "Secretário de Administração", budget: 500000 },
      ],
      employees: [],
      fuelRecords: [],
      fuelTypes: [
        { id: "1", name: "Gasolina Comum", price: 5.49 },
        { id: "2", name: "Gasolina Aditivada", price: 5.89 },
        { id: "3", name: "Etanol", price: 3.89 },
        { id: "4", name: "Diesel S10", price: 6.29 },
        { id: "5", name: "Diesel Comum", price: 5.99 },
      ],
      logs: [],
      abastecimentos: [],
      combustiveis: [],
      rotas: [],
      destinos: [],
      tickets: [],
      veiculosData: [], // Garantir que este array esteja inicializado
      adminUsers: [
        {
          id: "1",
          nome: "Administrador",
          email: "admin@sistema.com",
          tipo: "Administrador",
          ativo: true,
          senha: "admin"
        }
      ],
      counters: {
        users: 1,
        vehicles: 0,
        brands: 5,
        veiculosRegistrados: 0,
        departments: 5,
        employees: 0,
        fuelRecords: 0,
        fuelTypes: 5,
        logs: 0,
        abastecimentos: 0,
        combustiveis: 0,
        rotas: 0,
        destinos: 0,
        tickets: 0,
        adminUsers: 1,
        veiculosData: 0 // Garantir que o contador esteja inicializado
      },
    };
    
    console.log("Dados limpos:", cleanedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedData));
    console.log("Dados após limpeza:", JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    
    // Força recarregar a página para aplicar as alterações
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  } catch (e) {
    console.error("Erro ao limpar dados:", e);
  }
} 