import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  CircleDollarSign,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const PaymentHistoryDetails = ({ history, onClose }) => {
  if (!history) return null;

  // Acessa os dados com a nova estrutura da API
  const payment = history.payment || {};
  const property = payment.property || {};
  const tenant = payment.tenant || {};
  const changes = history.changes || {};

  // Formata valores monetários
  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "MZN",
    });
  };

  // Formata datas
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  // Ícones para campos específicos
  const fieldIcons = {
    name: <User className="h-4 w-4" />,
    email: <Mail className="h-4 w-4" />,
    phone: <Phone className="h-4 w-4" />,
    address: <Home className="h-4 w-4" />,
    property_type: <Home className="h-4 w-4" />,
    referenceMonth: <Calendar className="h-4 w-4" />,
    amount: <CircleDollarSign className="h-4 w-4" />,
    fineAmount: <AlertCircle className="h-4 w-4" />,
    totalAmount: <CircleDollarSign className="h-4 w-4" />,
    status: <CheckCircle2 className="h-4 w-4" />,
    method: <FileText className="h-4 w-4" />,
    dueDate: <Calendar className="h-4 w-4" />,
    paymentDate: <Calendar className="h-4 w-4" />
  };

  // Renderiza um campo com label e valor formatado
  const renderField = (label, fieldName, value, formatFn) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-2">
      <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
        {fieldIcons[fieldName] || <FileText className="h-4 w-4" />}
        <span>{label}:</span>
      </div>
      <div className="sm:col-span-2 text-gray-900 dark:text-gray-100 break-words">
        {formatFn ? formatFn(value) : value || "N/A"}
      </div>
    </div>
  );

  // Configurações de status
  const statusConfig = {
    pago: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      variant: 'default',
      text: 'Pago'
    },
    pendente: {
      icon: <Clock className="h-4 w-4" />,
      variant: 'warning',
      text: 'Pendente'
    },
    atrasado: {
      icon: <AlertCircle className="h-4 w-4" />,
      variant: 'destructive',
      text: 'Atrasado'
    },
    cancelado: {
      icon: <XCircle className="h-4 w-4" />,
      variant: 'outline',
      text: 'Cancelado'
    }
  };

  return (
    <Dialog open={!!history} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl mx-2 sm:mx-auto rounded-lg shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <DialogTitle className="text-lg sm:text-xl font-bold">
              Detalhes do Histórico
            </DialogTitle>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(history.changeDate)}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[80vh] overflow-y-auto">
          {/* Seção de Informações Básicas */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
            <h3 className="flex items-center gap-2 font-semibold text-base mb-3 text-gray-800 dark:text-gray-200">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Informações Básicas
            </h3>
            <div className="space-y-3">
              {renderField("Inquilino", "name", tenant.name)}
              {renderField("Email", "email", tenant.email)}
              {renderField("Telefone", "phone", tenant.phone)}
              {renderField("Propriedade", "address", property.address)}
              {renderField("Tipo", "property_type", property.property_type)}
              {renderField("Mês de Referência", "referenceMonth", payment.referenceMonth)}
            </div>
          </div>

          {/* Seção de Pagamento */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
            <h3 className="flex items-center gap-2 font-semibold text-base mb-3 text-gray-800 dark:text-gray-200">
              <CircleDollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Dados do Pagamento
            </h3>
            <div className="space-y-3">
              {renderField("Valor", "amount", payment.amount, formatCurrency)}
              {renderField("Multa", "fineAmount", payment.fineAmount, formatCurrency)}
              {renderField("Total", "totalAmount", payment.totalAmount, formatCurrency)}
              {renderField("Status", "status", payment.status, (value) => (
                <Badge 
                  variant={statusConfig[value]?.variant || 'default'} 
                  className="gap-1 capitalize"
                >
                  {statusConfig[value]?.icon}
                  {statusConfig[value]?.text || value}
                </Badge>
              ))}
              {renderField("Método", "method", payment.method)}
              {renderField("Data de Vencimento", "dueDate", payment.dueDate, formatDate)}
              {renderField("Data de Pagamento", "paymentDate", payment.paymentDate, formatDate)}
            </div>
          </div>

          {/* Seção de Alterações */}
          {Object.keys(changes).length > 0 && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
              <h3 className="flex items-center gap-2 font-semibold text-base mb-3 text-gray-800 dark:text-gray-200">
                <ArrowLeftRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Alterações Registradas
              </h3>
              <div className="space-y-4">
                {Object.entries(changes).map(([field, values]) => (
                  <div key={field} className="space-y-2">
                    <h4 className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 capitalize text-sm">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                          <ChevronDown className="h-4 w-4" />
                          <span className="text-xs font-medium">Valor Anterior</span>
                        </div>
                        <p className="font-medium text-sm break-words">
                          {formatFieldValue(field, values.old)}
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                          <ChevronUp className="h-4 w-4" />
                          <span className="text-xs font-medium">Novo Valor</span>
                        </div>
                        <p className="font-medium text-sm break-words">
                          {formatFieldValue(field, values.new)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botão de Fechar */}
        <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button 
            onClick={onClose}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Função para formatar valores específicos de campos
  function formatFieldValue(field, value) {
    if (value === undefined || value === null) return "N/A";
    
    // Campos monetários
    if (['amount', 'fineAmount', 'totalAmount'].includes(field)) {
      return formatCurrency(value);
    }
    
    // Campos de data
    if (field.toLowerCase().includes('date')) {
      return formatDate(value);
    }
    
    // Status
    if (field === 'status') {
      const config = statusConfig[value] || {
        icon: null,
        variant: 'default',
        text: value
      };
      return (
        <Badge variant={config.variant} className="gap-1 capitalize">
          {config.icon}
          {config.text}
        </Badge>
      );
    }
    
    return String(value);
  }
};

export default PaymentHistoryDetails;