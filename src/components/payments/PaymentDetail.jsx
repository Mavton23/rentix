import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { 
  ArrowLeft,
  BadgeDollarSign,
  User,
  Calendar,
  CircleDollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import api from "../../services/api";

const PaymentDetail = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pago':
        return <Badge variant="success" className="gap-1">
          <CheckCircle className="h-4 w-4" />
          {status}
        </Badge>;
      case 'pendente':
        return <Badge variant="warning" className="gap-1">
          <Clock className="h-4 w-4" />
          {status}
        </Badge>;
      case 'atrasado':
        return <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-4 w-4" />
          {status}
        </Badge>;
      default:
        return <Badge variant="outline">{status || 'N/A'}</Badge>;
    }
  };

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/payment/payment/${id}`);
        setPayment(response.data);
      } catch (error) {
        toast.error("Erro ao carregar detalhes", {
          description: error.response?.data?.message || "Verifique sua conexão"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={40} color="#3b82f6" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Pagamento não encontrado
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          O pagamento solicitado não foi encontrado no sistema
        </p>
        <div className="mt-6">
          <Link to="/payments">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para lista
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Sem data registrada";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/payments">
            <Button variant="outline" className="gap-2 dark:text-gray-200">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          {/* <Button>
            Gerar Recibo
          </Button> */}
        </div>

        {/* Main Card */}
        <Card className="dark:bg-gray-950/50">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <BadgeDollarSign className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                  Pagamento #{payment.referenceMonth}
                </CardTitle>
                <div className="flex items-center gap-3 mt-2">
                  {getStatusBadge(payment.status)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {payment.referenceMonth}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem 
                  icon={<CircleDollarSign className="h-5 w-5" />}
                  label="Valor"
                  value={`${payment.amount} MZN`}
                />
                <DetailItem 
                  icon={<Calendar className="h-5 w-5" />}
                  label="Data do Pagamento"
                  value={formatDate(payment.paymentDate)}
                />
              </div>

              {/* Informações do Inquilino */}
              <DetailItem 
                icon={<User className="h-5 w-5" />}
                label="Inquilino"
                value={payment.tenant?.name || "Não associado"}
              />

              {/* Método de Pagamento */}
              <DetailItem 
                icon={<BadgeDollarSign className="h-5 w-5" />}
                label="Método de Pagamento"
                value={payment.paymentMethod || "Não especificado"}
              />

              {/* Observações */}
              {payment.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Observações
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {payment.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente auxiliar para exibir itens de detalhe
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-gray-400 dark:text-gray-500">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-0.5 text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  </div>
);

export default PaymentDetail;