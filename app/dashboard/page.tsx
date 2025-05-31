"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Fuel, Truck, Users, FileText, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { format, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { dashboardService } from "@/lib/dashboard-service"
import { storageService } from "@/lib/storage-service"
import { useStorageListener } from "@/hooks/use-storage-listener"

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function DashboardPage() {
  const [dataAtual, setDataAtual] = useState(new Date())
  const [diaCiclo, setDiaCiclo] = useState("1")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showAbastecimentos, setShowAbastecimentos] = useState(true)
  const [showConsumo, setShowConsumo] = useState(true)
  const [showValor, setShowValor] = useState(true)
  const { toast } = useToast()

  // Hook para detectar mudanças no localStorage
  const [storageData, forceStorageUpdate] = useStorageListener("sistema-gestao-data", null)

  // Estados para armazenar as estatísticas
  const [stats, setStats] = useState({
    combustivel: dashboardService.getDashboardStats(dataAtual),
    veiculos: dashboardService.getVehicleStats(),
    funcionarios: dashboardService.getEmployeeStats(),
  })

  // Atualizar estatísticas quando a data mudar ou o storage for atualizado
  useEffect(() => {
    setStats({
      combustivel: dashboardService.getDashboardStats(dataAtual),
      veiculos: dashboardService.getVehicleStats(),
      funcionarios: dashboardService.getEmployeeStats(),
    })
  }, [dataAtual, storageData])

  // Formatar a data atual para exibição
  const mesAnoFormatado = format(dataAtual, "MMMM 'de' yyyy", { locale: ptBR })

  // Funções para navegação entre meses
  const mesAnterior = () => setDataAtual(subMonths(dataAtual, 1))
  const mesProximo = () => {
    const nextMonth = addMonths(dataAtual, 1)
    // Não permitir navegar para meses futuros
    if (nextMonth <= new Date()) {
      setDataAtual(nextMonth)
    }
  }

  // Salvar alteração do dia de ciclo
  const salvarDiaCiclo = () => {
    // Em um sistema real, isso seria salvo no banco de dados
    localStorage.setItem("sistema-gestao-dia-ciclo", diaCiclo)

    toast({
      title: "Dia de fim de ciclo alterado",
      description: `O ciclo agora será fechado todo dia ${diaCiclo} do mês.`,
    })
    setIsDialogOpen(false)
  }

  // Configuração do gráfico
  const dadosGrafico = {
    labels: stats.combustivel.monthlyData.map((d) => d.month),
    datasets: [
      showAbastecimentos && {
        label: "Total de Abastecimentos",
        data: stats.combustivel.monthlyData.map((d) => d.abastecimentos),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
      showConsumo && {
        label: "Consumo Total (L)",
        data: stats.combustivel.monthlyData.map((d) => d.consumo),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.3,
      },
      showValor && {
        label: "Valor Total (R$)",
        data: stats.combustivel.monthlyData.map((d) => d.valor),
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        tension: 0.3,
        yAxisID: "y1",
      },
    ].filter(Boolean),
  }

  const opcoesGrafico = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Quantidade",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Valor (R$)",
        },
      },
    },
  }

  // Função para renderizar o indicador de tendência
  const renderTrendIndicator = (percent: number) => {
    if (percent > 0) {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>+{percent.toFixed(1)}%</span>
        </div>
      )
    } else if (percent < 0) {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDown className="h-4 w-4 mr-1" />
          <span>{percent.toFixed(1)}%</span>
        </div>
      )
    }
    return <span>0%</span>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Painel de Controle</h1>

      <Tabs defaultValue="combustivel" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="combustivel">
            <Fuel className="mr-2 h-4 w-4" />
            Combustível
          </TabsTrigger>
          <TabsTrigger value="veiculos">
            <Truck className="mr-2 h-4 w-4" />
            Veículos
          </TabsTrigger>
          <TabsTrigger value="funcionarios">
            <Users className="mr-2 h-4 w-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="log">
            <FileText className="mr-2 h-4 w-4" />
            LOG Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="combustivel" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={mesAnterior}>
                &lt;
              </Button>
              <span className="text-lg font-medium capitalize">{mesAnoFormatado}</span>
              <Button variant="outline" size="sm" onClick={mesProximo}>
                &gt;
              </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Alterar Data de Fim de Ciclo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Alterar Data de Fim de Ciclo</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="dia-ciclo">Dia do mês para fechamento do ciclo</Label>
                    <Select value={diaCiclo} onValueChange={setDiaCiclo}>
                      <SelectTrigger id="dia-ciclo">
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 28 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-2">
                      O sistema irá considerar o período entre os dias {diaCiclo} de cada mês para cálculos e
                      relatórios. Os dados históricos serão mantidos.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={salvarDiaCiclo}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Abastecimentos</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardService.formatNumber(stats.combustivel.totalAbastecimentos)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {renderTrendIndicator(stats.combustivel.percentAbastecimentos)}
                  <span className="ml-1">em relação ao mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consumo Total (L)</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardService.formatNumber(stats.combustivel.totalConsumo)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {renderTrendIndicator(stats.combustivel.percentConsumo)}
                  <span className="ml-1">em relação ao mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total (R$)</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardService.formatCurrency(stats.combustivel.totalValor)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {renderTrendIndicator(stats.combustivel.percentValor)}
                  <span className="ml-1">em relação ao mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal</CardTitle>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-abastecimentos"
                    checked={showAbastecimentos}
                    onCheckedChange={(checked) => setShowAbastecimentos(!!checked)}
                  />
                  <Label htmlFor="show-abastecimentos" className="text-sm font-medium cursor-pointer">
                    Total de Abastecimentos
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-consumo"
                    checked={showConsumo}
                    onCheckedChange={(checked) => setShowConsumo(!!checked)}
                  />
                  <Label htmlFor="show-consumo" className="text-sm font-medium cursor-pointer">
                    Consumo Total (L)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-valor"
                    checked={showValor}
                    onCheckedChange={(checked) => setShowValor(!!checked)}
                  />
                  <Label htmlFor="show-valor" className="text-sm font-medium cursor-pointer">
                    Valor Total (R$)
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Line data={dadosGrafico} options={opcoesGrafico} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="veiculos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.veiculos.totalVehicles}</div>
                <p className="text-xs text-muted-foreground">
                  {renderTrendIndicator(stats.veiculos.percentChange)} em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Veículos Ativos</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.veiculos.activeVehicles}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.veiculos.percentActiveVehicles.toFixed(0)}% da frota está ativa
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Manutenções Pendentes</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.veiculos.pendingMaintenance}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.veiculos.pendingMaintenance / stats.veiculos.totalVehicles) * 100).toFixed(0)}% da frota
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funcionarios" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.funcionarios.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  {renderTrendIndicator(stats.funcionarios.percentChange)} em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Motoristas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.funcionarios.drivers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.funcionarios.percentDrivers.toFixed(0)}% do total de funcionários
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.funcionarios.departments}</div>
                <p className="text-xs text-muted-foreground">
                  Média de {(stats.funcionarios.totalEmployees / stats.funcionarios.departments).toFixed(1)}{" "}
                  funcionários por departamento
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>LOG do Sistema</CardTitle>
              <CardDescription>Histórico de atividades recentes no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storageService
                  .getLogs()
                  .slice(0, 10)
                  .map((log) => {
                    // Determinar o tipo de log com base na ação
                    const tipo =
                      log.action === "Adição"
                        ? "success"
                        : log.action === "Atualização"
                          ? "info"
                          : log.action === "Exclusão"
                            ? "danger"
                            : "warning"

                    // Formatar a data do log
                    const data = new Date(log.timestamp).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })

                    return (
                      <div key={log.id} className="flex items-center">
                        <div
                          className={`mr-2 h-2 w-2 rounded-full ${
                            tipo === "success"
                              ? "bg-green-500"
                              : tipo === "info"
                                ? "bg-blue-500"
                                : tipo === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.details}</p>
                          <p className="text-xs text-muted-foreground">
                            {data} - Usuário: {log.user}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
