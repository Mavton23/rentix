import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Eye,
  Pencil,
  Trash2,
  User,
  Wallet,
  Calendar,
  Filter,
  CircleOff,
  History,
  RotateCcw,
  AlertCircle,
  Info
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const PaymentList = ({ payments, loading: parentLoading }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showCanceled, setShowCanceled] = useState(false);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    if (payments && Array.isArray(payments)) {
      setIsLoading(false);
      let filtered = payments;
      
      if (!showCanceled) {
        filtered = filtered.filter(p => p.status !== 'cancelado');
      }
      
      setFilteredPayments(filtered);
    }
  }, [payments, showCanceled]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pago':
        return <Badge variant="success" className="gap-1">
          <div className="w-2 h-2 rounded-full bg-white" />
          Pago
        </Badge>;
      case 'pendente':
        return <Badge variant="warning" className="gap-1">
          <div className="w-2 h-2 rounded-full bg-white" />
          Pendente
        </Badge>;
      case 'atrasado':
        return <Badge variant="destructive" className="gap-1">
          <div className="w-2 h-2 rounded-full bg-white" />
          Atrasado
        </Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="gap-1">
          <CircleOff className="h-3 w-3" />
          Cancelado
        </Badge>;
      default:
        return <Badge variant="outline">{status || 'N/A'}</Badge>;
    }
  };

  const openDetailsDialog = (payment) => {
    setSelectedPayment(payment);
  };

  if (isLoading || parentLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={40} color="#3b82f6" />
      </div>
    );
  }

  if (!filteredPayments || filteredPayments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
          <Filter className="h-5 w-5 text-gray-500" />
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showCanceled" 
              checked={showCanceled}
              onCheckedChange={() => setShowCanceled(!showCanceled)}
            />
            <Label htmlFor="showCanceled">Mostrar cancelados</Label>
          </div>
        </div>
        
        <div className="text-center py-12">
          <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Nenhum pagamento encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {showCanceled
              ? "Não há pagamentos com os filtros aplicados" 
              : "Nenhum pagamento ativo encontrado"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
        <Filter className="h-5 w-5 text-gray-500" />
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showCanceled" 
            checked={showCanceled}
            onCheckedChange={() => setShowCanceled(!showCanceled)}
          />
          <Label htmlFor="showCanceled">Mostrar cancelados</Label>
        </div>
        <span className="ml-auto text-sm text-gray-500">
          {filteredPayments.length} {filteredPayments.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableHead className="w-[200px]">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Inquilino
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Valor
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Referência
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow 
                key={payment.paymentId}
                className={`
                  ${payment.status === 'cancelado' ? 'bg-amber-50 dark:bg-amber-950/20' : ''}
                `}
              >
                <TableCell>
                  <div className="font-medium">
                    {payment.tenant?.name || "N/A"}
                  </div>
                  {payment.property && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {payment.property.address}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {payment?.amount?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'MZN'
                  })}
                  {payment.fineAmount > 0 && (
                    <div className="text-xs text-red-500 dark:text-red-400">
                      + {payment?.fineAmount?.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'MZN'
                      })} (multa)
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {payment.referenceMonth}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {getStatusBadge(payment.status)}
                    {payment.status === 'cancelado' && (
                      <div className="flex items-start gap-1">
                        <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.cancellationReason || 'Sem motivo especificado'}
                        </p>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-2"
                        onClick={() => openDetailsDialog(payment)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only">Ver</span>
                      </Button>
                    </DialogTrigger>
                    
                    {payment.status !== 'cancelado' && (
                      <>
                        <Link to={`/payments/${payment.paymentId}/edit`}>
                          <Button variant="outline" size="sm" className="px-2">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only">Editar</span>
                          </Button>
                        </Link>
                      </>
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de detalhes do pagamento */}
      {selectedPayment && (
        <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <DialogContent className="sm:max-w-[625px] dark:bg-gray-950 dark:text-gray-300">
            <DialogHeader>
              <DialogTitle>Detalhes do Pagamento</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Inquilino</h4>
                  <p>{selectedPayment.tenant?.name || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Propriedade</h4>
                  <p>{selectedPayment.property?.address || "N/A"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Valor</h4>
                  <p>
                    {selectedPayment?.amount?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'MZN'
                    })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Multa</h4>
                  <p>
                    {selectedPayment?.fineAmount?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'MZN'
                    })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total</h4>
                  <p>
                    {selectedPayment?.totalAmount?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'MZN'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="mt-1">
                    {getStatusBadge(selectedPayment.status)}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Referência</h4>
                  <p>{selectedPayment.referenceMonth}</p>
                </div>
              </div>
              
              {selectedPayment.status === 'cancelado' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Motivo do Cancelamento</h4>
                  <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    {selectedPayment.cancellationReason || 'Não especificado'}
                  </p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Observações</h4>
                <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {selectedPayment.description || 'Nenhuma observação registrada'}
                </p>
              </div>

              <div className="flex justify-end mt-4">
                <Link to={`/payments/${selectedPayment.paymentId}`}>
                  <Button variant="outline" className="gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only">Mais Detalhes</span>
                  </Button>
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentList;