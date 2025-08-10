import { useEffect, useState } from "react";
import api from '../services/api'
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";
import { RentixLoader } from "../components/RentixLoader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";

// Cores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Dashboard() {
  const { logout } = useAuth(); 
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("currentMonth");

  const fetchDashboardData = async (period) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/dashboard/manager', {
        params: { period }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Erro ao carregar dados");
      }
      
      setDashboardData(response.data.data);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError(error.response?.data?.message || "Erro ao carregar dados do dashboard");
      toast.error(error.response?.data?.message || "Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedPeriod);
  }, [selectedPeriod]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Transforma os dados para o gráfico de tipos de propriedade
  const transformPropertyTypeData = (data) => {
    if (!data?.propertyTypes) return [];
    return data.propertyTypes.map(type => ({
      name: type.property_type,
      value: type.count
    }));
  };

  // Transforma os dados para o gráfico pagamentos no formato esperado pelo BarChart
  const transformPaymentData = (data) => {
    if (!data?.payments) return [];
    return data.payments.map(payment => ({
      referenceMonth: payment.referenceMonth,
      totalAmount: payment.totalAmount || 0
    }));
  };

  // Transforma os dados para o gráfico de status de pagamentos
  const transformPaymentStatusData = (data) => {
    if (!data?.paymentStatuses) return [];
    return data.paymentStatuses.map(status => ({
      name: status.status,
      value: status.count,
      total: status.totalAmount
    }));
  };

  const SummaryCard = ({ title, value, isCurrency = false, description = "", trend = null }) => {
    const formattedValue = isCurrency
      ? typeof value === "number"
        ? value.toLocaleString("pt-BR", { style: "currency", currency: "MZN" })
        : "N/A"
      : value !== undefined && value !== null 
        ? isCurrency 
          ? value.toLocaleString("pt-BR", { style: "currency", currency: "MZN" })
          : value 
        : "N/A";
  
    return (
      <Card className="h-full bg-gray-50 dark:bg-gray-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-white">{title}</CardTitle>
          {description && <CardDescription className="text-xs dark:text-gray-300">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold">
              {formattedValue}
            </p>
            {trend && (
              <Badge variant={trend > 0 ? "destructive" : "default"}>
                {trend > 0 ? `↑ ${trend}%` : `↓ ${Math.abs(trend)}%`}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const StatusBadge = ({ status }) => {
    const statusMap = {
      'pago': { color: 'bg-green-100 text-green-800', label: 'Pago' },
      'pendente': { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
      'atrasado': { color: 'bg-red-100 text-red-800', label: 'Atrasado' },
      'cancelado': { color: 'bg-gray-100 text-gray-800', label: 'Cancelado' }
    };
    
    const statusInfo = statusMap[status.toLowerCase()] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div>
        <RentixLoader label="Carregando os seus dados..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 w-full">
        <p className="text-red-500">{error}</p>
        <Button className=" bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" onClick={() => handleLogout()}>
          Entrar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="font-custom space-y-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Painel do Gestor</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Visão geral do seu negócio imobiliário
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <Select onValueChange={handlePeriodChange} value={selectedPeriod}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent  className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600/25 rounded-md shadow-lg">
              <SelectItem value="currentMonth" className="hover:bg-gray-100 dark:hover:bg-gray-800">Este Mês</SelectItem>
              <SelectItem value="lastMonth" className="hover:bg-gray-100 dark:hover:bg-gray-800">Mês Anterior</SelectItem>
              <SelectItem value="currentYear" className="hover:bg-gray-100 dark:hover:bg-gray-800">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" onClick={handleLogout} className="sr-only">
            Sair
          </Button>
        </div>
      </div>

      {/* Seção de Métricas Principais */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Métricas Principais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <SummaryCard 
            title="Receita Total" 
            value={dashboardData?.totalRevenue} 
            isCurrency 
            description="Valor total recebido"
          />
          <SummaryCard 
            title="Taxa de Ocupação" 
            value={dashboardData?.occupancyRate + '%'} 
            description={`${dashboardData?.occupiedProperties || 0}/${dashboardData?.totalProperties || 0} propriedades`}
          />
          <SummaryCard 
            title="Multas Arrecadadas" 
            value={dashboardData?.totalFines} 
            isCurrency 
            description="Valor total em multas"
          />
          <SummaryCard 
            title="Pagamentos Pendentes" 
            value={dashboardData?.pendingPayments} 
            description="Aguardando pagamento"
          />
          <SummaryCard 
            title="Total de inquilinos" 
            value={dashboardData?.totalTenants} 
            description="Todos os seus inquilinos"
          />
          <SummaryCard 
            title="Total de inquilinos (ativos)" 
            value={dashboardData?.totalTenantsAtive} 
            description="Inquilinos ativos em suas propriedades"
          />
        </div>
      </section>

      {/* Seção de Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Evolução de Receitas */}
        <Card className="bg-gray-50 dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Evolução das Receitas</CardTitle>
            <CardDescription>Valores recebidos por mês</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.payments?.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transformPaymentData(dashboardData)}>
                    <XAxis dataKey="referenceMonth" />
                    <YAxis 
                      tickFormatter={(value) => 
                        value.toLocaleString("pt-BR", { style: "currency", currency: "MZN" }).replace(/\s/g, '')
                      }
                    />
                    <Tooltip
                      formatter={(value) =>
                        value.toLocaleString("pt-BR", { style: "currency", currency: "MZN" })
                      }
                    />
                    <Legend />
                    <Bar 
                      dataKey="totalAmount" 
                      fill="#3b82f6" 
                      name="Total Recebido" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-gray-500">Nenhum dado disponível para o período selecionado.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Distribuição de Tipos de Propriedade */}
        <Card className="bg-gray-50 dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Distribuição de Tipos de Propriedade</CardTitle>
            <CardDescription>Tipologia das suas propriedades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transformPropertyTypeData(dashboardData)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {transformPropertyTypeData(dashboardData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [
                      value,
                      name
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Seção de Alertas e Atividades */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximos Vencimentos */}
        <Card className="lg:col-span-1 bg-gray-50 dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Próximos Vencimentos</CardTitle>
            <CardDescription>Pagamentos nos próximos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.upcomingPayments?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.upcomingPayments.slice(0, 5).map(payment => (
                  <div key={payment.paymentId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{payment.tenant?.name || "Inquilino não informado"}</p>
                      <p className="text-sm text-gray-500">{payment.Property?.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {payment.amount?.toLocaleString("pt-BR", { style: "currency", currency: "MZN" })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {dashboardData.upcomingPayments.length > 5 && (
                  <Button variant="ghost" className="w-full mt-2">
                    Ver todos ({dashboardData.upcomingPayments.length})
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum vencimento próximo</p>
            )}
          </CardContent>
        </Card>

        {/* Status de Pagamentos */}
        <Card className="lg:col-span-1 bg-gray-50 dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Status de Pagamentos</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transformPaymentStatusData(dashboardData)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {transformPaymentStatusData(dashboardData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      value,
                      name,
                      `Total: ${props.payload.total?.toLocaleString("pt-BR", { style: "currency", currency: "MZN" }) || 'N/A'}`
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Notificações Recentes */}
        <Card className="lg:col-span-1 bg-gray-50 dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Notificações Recentes</CardTitle>
            <CardDescription>Últimas notificações enviadas</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.notifications?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.notifications.map(notification => (
                  <div key={notification.logId} className="border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{notification.tenant?.name || "Inquilino não informado"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                      </div>
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(notification.sentAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma notificação recente</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Seção de Tabelas Detalhadas */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Detalhes dos Pagamentos</h2>
        <Card className="bg-gray-50 dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>Pagamentos no período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.payments?.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês/Ano</TableHead>
                      <TableHead>Inquilino</TableHead>
                      <TableHead>Propriedade</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Multa</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Vencimento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.payments.map(payment => (
                      <TableRow key={payment.paymentId}>
                        <TableCell>{payment.referenceMonth}</TableCell>
                        <TableCell>{payment.tenant || "-"}</TableCell>
                        <TableCell>{payment.property || "-"}</TableCell>
                        <TableCell>
                          {payment.monthly?.toLocaleString("pt-BR", { style: "currency", currency: "MZN" })}
                        </TableCell>
                        <TableCell>
                          {payment.fineAmount?.toLocaleString("pt-BR", { style: "currency", currency: "MZN" })}
                        </TableCell>
                        <TableCell>
                          {payment.totalAmount?.toLocaleString("pt-BR", { style: "currency", currency: "MZN" })}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={payment.status} />
                        </TableCell>
                        <TableCell>
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum pagamento no período selecionado</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}