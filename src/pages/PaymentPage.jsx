import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { RentixLoader } from "../components/RentixLoader";
import PaymentList from "../components/payments/PaymentList";
import PaymentForm from "../components/payments/PaymentForm";
import { 
  BadgeDollarSign, 
  Clock, 
  Plus, 
  List, 
  RotateCw
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import api from "../services/api";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isCreatingMultiple, setIsCreatingMultiple] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [paymentsResponse, tenantsResponse, propertiesResponse] = await Promise.all([
        api.get("/payment/payments"),
        api.get("/tenant/tenants"),
        api.get("/property/properties")
      ]);
      
      setPayments(paymentsResponse.data);
      setTenants(tenantsResponse.data);
      setProperties(propertiesResponse.data);
    } catch (error) {
      toast.error("Erro ao carregar dados", {
        description: error.response?.data?.message || "Verifique sua conexão"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPayment = async (data) => {
    setIsAdding(true);
    try {
      const response = await api.post("/payment/payments", data);
      setPayments([...payments, response.data.data]);
      toast.success("Pagamento registrado com sucesso!", {
        action: {
          label: "Fechar",
          onClick: () => {}
        }
      });
      setShowForm(false);
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          toast.warning(err.message || err, {
            description: err.field ? `Campo: ${err.field}` : undefined,
          });
        });
      } else {
        toast.error(error.response?.data?.message || "Erro ao registrar pagamento");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleCreateMultiplePayments = async () => {
    setIsCreatingMultiple(true);
    try {
      const response = await api.post("/payment/multipayments", {});
      await fetchData();
      toast.success(response.data.message || "Pagamentos criados com sucesso!");
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          toast.warning(err.message || err);
        });
      } else {
        toast.error(error.response?.data?.message || "Erro ao criar pagamentos automáticos");
      }
    } finally {
      setIsCreatingMultiple(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <BadgeDollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Gerenciamento de Pagamentos
            </h1>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={handleCreateMultiplePayments}
              disabled={isCreatingMultiple}
              className="gap-2 dark:text-gray-300"
            >
              {isCreatingMultiple ? (
                <RotateCw className="h-4 w-4 animate-spin" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              <span className="hidden md:inline">Gerar Mensalidades</span>
            </Button>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="gap-2"
            >
              {showForm ? (
                <List className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {showForm ? "Ver Lista" : "Novo Pagamento"}
            </Button>
          </div>
        </div>

        {/* Conteúdo Principal */}
        {showForm ? (
          <Card className="dark:bg-gray-950/50">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                Registrar Novo Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentForm
                onSubmit={handleAddPayment}
                isEditMode={false}
                loading={isAdding}
                tenants={tenants}
                properties={properties}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="dark:bg-gray-950/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                  Histórico de Pagamentos
                </CardTitle>
                <span className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                  {payments.length} {payments.length === 1 ? 'registro' : 'registros'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>
                  <RentixLoader label="Carregando pagamentos..." />
                </div>
              ) : payments.length > 0 ? (
                <PaymentList 
                  payments={payments}  
                  loading={loading} 
                />
              ) : (
                <div className="text-center py-12">
                  <BadgeDollarSign className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                    Nenhum pagamento registrado
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Registre um novo pagamento ou gere as mensalidades automáticas
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Button 
                      variant="outline"
                      onClick={handleCreateMultiplePayments}
                      disabled={isCreatingMultiple}
                      className="gap-2 dark:text-gray-200"
                    >
                      {isCreatingMultiple ? (
                        <RotateCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                      Gerar Mensalidades
                    </Button>
                    <Button 
                      onClick={() => setShowForm(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Novo Pagamento
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;