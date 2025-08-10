import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { 
  ArrowLeft,
  BadgeDollarSign,
  CircleDollarSign,
  User,
  Home,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import PaymentForm from "../components/payments/PaymentForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const EditPaymentPage = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);

  // Status badge configuration
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

  // Fetch payment details
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await api.get(`/payment/payment/${paymentId}`);
        setPayment(response.data);
      } catch (error) {
        toast.error("Erro ao carregar pagamento", {
          description: "Verifique sua conexão e tente novamente",
          icon: <AlertCircle className="h-5 w-5" />,
          action: {
            label: "Recarregar",
            onClick: () => window.location.reload()
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId]);

  // Fetch tenants and properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tenantsRes, propertiesRes] = await Promise.all([
          api.get("/tenant/tenants"),
          api.get("/property/properties")
        ]);
        
        setTenants(tenantsRes.data);
        setProperties(propertiesRes.data);
      } catch (error) {
        toast.error("Erro ao carregar dados", {
          description: "Não foi possível carregar inquilinos ou propriedades",
          icon: <AlertCircle className="h-5 w-5" />
        });
      }
    };

    fetchData();
  }, []);

  // Handle payment update
  const handleUpdatePayment = async (data) => {
    setUpdating(true);
    try {
      const response = await api.put(
        `/payment/payments/${paymentId}`,
        data
      );

      toast.success("Pagamento atualizado", {
        description: "Os dados do pagamento foram salvos com sucesso",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        action: {
          label: "Ver Pagamentos",
          onClick: () => navigate("/payments")
        }
      });
      
      setPayment(response.data.data);
    } catch (error) {
      if (error.response) {
        if (error.response.data?.errors) {
          error.response.data.errors.forEach(err => {
            toast.error("Erro de validação", {
              description: err.message || err,
              icon: <AlertCircle className="h-5 w-5" />,
              action: err.field ? {
                label: "Corrigir",
                onClick: () => document.getElementById(err.field)?.focus()
              } : undefined
            });
          });
        } else if (error.response.data?.message) {
          toast.error("Erro ao atualizar", {
            description: error.response.data.message,
            icon: <AlertCircle className="h-5 w-5" />
          });
        }
      } else {
        toast.error("Erro de conexão", {
          description: "Verifique sua conexão com a internet",
          icon: <AlertCircle className="h-5 w-5" />
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color="#3b82f6" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando pagamento...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/payments")}
            className="gap-2 dark:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <BadgeDollarSign className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="dark:text-gray-200">Editar Pagamento</span>
            </h1>
            {payment?.status && (
              <Badge 
                variant={statusConfig[payment.status]?.variant || "default"} 
                className="mt-2 gap-1 capitalize dark:text-gray-200"
              >
                {statusConfig[payment.status]?.icon}
                {statusConfig[payment.status]?.text || payment.status}
              </Badge>
            )}
          </div>
        </div>

        {/* Payment Summary Card */}
        {payment && (
          <Card className="border-0 shadow-sm dark:bg-gray-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-indigo-600" />
                <span>Resumo do Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Inquilino</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {payment.tenant?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Propriedade</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {payment.property?.address || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Mês Referência</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {payment.referenceMonth || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Form Card */}
        <Card className="border-0 shadow-sm dark:bg-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeDollarSign className="h-5 w-5 text-indigo-600" />
              <span>Editar Dados do Pagamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentForm
              onSubmit={handleUpdatePayment}
              isEditMode={true}
              defaultValues={payment}
              loading={updating}
              tenants={tenants}
              properties={properties}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPaymentPage;