import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { 
  BadgeDollarSign, 
  Search, 
  Filter, 
  Calendar, 
  CircleDollarSign,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { useDebounce } from "../hooks/useDebounce";
import PaymentHistoryDetails from "../components/history/PaymentHistoryDetails";

// Componentes UI
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const PaymentsHistoryPage = () => {
  const [historyData, setHistoryData] = useState({
    data: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1
    }
  });
  const [loading, setLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [searchTerm, setSearchTerm] = useState({
    tenantName: "",
    propertyAddress: ""
  });

  // Filtros principais
  const [filters, setFilters] = useState({
    period: "currentMonth",
    status: "",
    page: 1,
    limit: 10
  });

  // Debounce para os campos de busca (500ms)
  const debouncedTenantName = useDebounce(searchTerm.tenantName, 500);
  const debouncedPropertyAddress = useDebounce(searchTerm.propertyAddress, 500);

  // Busca os pagamentos com base nos filtros
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {
        ...filters,
        tenantName: debouncedTenantName,
        propertyAddress: debouncedPropertyAddress
      };

      const response = await api.get("/history/payment-history", {
        params
      });

      setHistoryData({
        data: response.data.data,
        pagination: response.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });
    } catch (error) {
      toast.error("Erro ao carregar histórico de pagamentos.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedTenantName, debouncedPropertyAddress]);

  // Atualiza os filtros principais
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Atualiza os termos de busca
  const handleSearchChange = (key, value) => {
    setSearchTerm(prev => ({ ...prev, [key]: value }));
  };

  // Muda a página
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Busca os pagamentos ao carregar a página ou ao mudar os filtros
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Função para renderizar o badge de status
  const renderStatusBadge = (status) => {
    const statusConfig = {
      pago: {
        icon: <CheckCircle2 className="h-4 w-4" />,
        variant: "default",
        text: "Pago"
      },
      pendente: {
        icon: <Clock className="h-4 w-4" />,
        variant: "warning",
        text: "Pendente"
      },
      atrasado: {
        icon: <AlertCircle className="h-4 w-4" />,
        variant: "destructive",
        text: "Atrasado"
      },
      cancelado: {
        icon: <XCircle className="h-4 w-4" />,
        variant: "outline",
        text: "Cancelado"
      }
    };

    const config = statusConfig[status] || {
      icon: null,
      variant: "default",
      text: "N/A"
    };

    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <BadgeDollarSign className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Histórico de Pagamentos
            </h1>
          </div>
        </div>

        {/* Filtros */}
        <Card className="border-0 shadow-sm dark:bg-gray-950/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Filter className="h-5 w-5 text-indigo-600" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              {/* Filtro de Período */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Período
                </label>
                <Select 
                  onValueChange={(value) => handleFilterChange("period", value)} 
                  value={filters.period}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="currentMonth">Este Mês</SelectItem>
                    <SelectItem value="lastMonth">Mês Anterior</SelectItem>
                    <SelectItem value="currentYear">Este Ano</SelectItem>
                    <SelectItem value="all">Todos os períodos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Status
                </label>
                <Select 
                  onValueChange={(value) => handleFilterChange("status", value)} 
                  value={filters.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Busca por Inquilino */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Search className="h-4 w-4" />
                  Inquilino
                </label>
                <Input
                  placeholder="Buscar inquilino..."
                  value={searchTerm.tenantName}
                  onChange={(e) => handleSearchChange("tenantName", e.target.value)}
                />
              </div>

              {/* Busca por Propriedade */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Search className="h-4 w-4" />
                  Propriedade
                </label>
                <Input
                  placeholder="Buscar propriedade..."
                  value={searchTerm.propertyAddress}
                  onChange={(e) => handleSearchChange("propertyAddress", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Pagamentos */}
        <Card className="border-0 shadow-sm dark:bg-gray-950/50">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Registros de Pagamentos
              </CardTitle>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {historyData.pagination.total} {historyData.pagination.total === 1 ? 'registro' : 'registros'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <ClipLoader size={40} color="#3b82f6" />
              </div>
            ) : historyData.data.length === 0 ? (
              <div className="text-center p-12 space-y-4">
                <BadgeDollarSign className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Nenhum pagamento encontrado
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tente ajustar seus filtros de busca
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Inquilino</TableHead>
                    <TableHead>Propriedade</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData.data.map((item) => {
                    const payment = item.payment || {};
                    const property = payment.property || {};
                    const tenant = payment.tenant || {};

                    return (
                      <TableRow key={item.historyId} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">{tenant.name || "N/A"}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{property.address || "N/A"}</TableCell>
                        <TableCell className="text-right font-medium">
                          {parseFloat(payment.amount || 0).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "MZN",
                          })}
                        </TableCell>
                        <TableCell>
                          {new Date(item.changeDate).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(payment.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedHistory(item)}>
                                Ver detalhes
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {historyData.data.length > 0 && (
            <CardFooter className="flex justify-between items-center border-t">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando <span className="font-medium">{historyData.data.length}</span> de{' '}
                <span className="font-medium">{historyData.pagination.total}</span> registros
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page <= 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page >= historyData.pagination.totalPages}
                  onClick={() => handlePageChange(filters.page + 1)}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Modal de Detalhes */}
        {selectedHistory && (
          <PaymentHistoryDetails
            history={selectedHistory}
            onClose={() => setSelectedHistory(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentsHistoryPage;