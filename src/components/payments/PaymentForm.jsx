import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { 
  Loader2,
  Wallet,
  Home,
  User,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  CircleOff,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";

const PaymentForm = ({ 
  onSubmit, 
  isEditMode, 
  defaultValues, 
  loading, 
  tenants, 
  properties,
  onCancel 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      tenantId: defaultValues?.tenantId || "",
      propertyId: defaultValues?.propertyId || "",
      amount: defaultValues?.amount || "",
      paymentDate: defaultValues?.paymentDate?.split('T')[0] || "",
      method: defaultValues?.method || "",
      status: defaultValues?.status || "pendente",
      referenceMonth: defaultValues?.referenceMonth || "",
      description: defaultValues?.description || "",
    },
  });  

  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const selectedTenantId = watch("tenantId");

  // Lista de meses e anos para referência
  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => String(currentYear - 1 + i));

  // Preencher automaticamente propriedade e valor
  useEffect(() => {
    if (selectedTenantId) {
      setIsAutoFilling(true);
      
      const selectedTenant = tenants.find(t => t.tenantId === selectedTenantId);
      if (selectedTenant) {
        const tenantProperty = properties.find(p => p.tenantId === selectedTenant.tenantId);
        
        if (tenantProperty) {
          setValue("propertyId", tenantProperty.propertyId);
          setValue("amount", tenantProperty.rent_amount);
          toast.success("Propriedade e valor preenchidos automaticamente");
        } else {
          setValue("propertyId", "");
          setValue("amount", "");
          toast.info("Nenhuma propriedade associada a este inquilino");
        }
      }
      
      setIsAutoFilling(false);
    }
  }, [selectedTenantId, tenants, properties, setValue]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pago': return <CheckCircle className="h-4 w-4" />;
      case 'pendente': return <Clock className="h-4 w-4" />;
      case 'cancelado': return <CircleOff className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6 dark:bg-gray-950/50">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 dark:text-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inquilino */}
          <div>
            <Label htmlFor="tenantId" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Inquilino *
            </Label>
            <Select
              onValueChange={(value) => setValue("tenantId", value)}
              value={watch("tenantId")}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione um inquilino" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.tenantId} value={tenant.tenantId}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tenantId && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.tenantId.message}
              </p>
            )}
          </div>

          {/* Propriedade */}
          <div>
            <Label htmlFor="propertyId" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Propriedade
            </Label>
            <Select
              value={watch("propertyId")}
              disabled
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione um inquilino primeiro" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.propertyId} value={property.propertyId}>
                    {property.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Valor */}
          <div>
            <Label htmlFor="amount" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Valor *
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount", { 
                required: "Valor é obrigatório",
                min: { value: 0, message: "O valor deve ser positivo" }
              })}
              className="mt-2"
              disabled
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Data de Pagamento */}
          <div>
            <Label htmlFor="paymentDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data de Pagamento
            </Label>
            <Input
              id="paymentDate"
              type="date"
              {...register("paymentDate")}
              className="mt-2 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Mês de Referência */}
        <div>
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Mês de Referência *
          </Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <Select
              onValueChange={(value) => {
                const year = watch("referenceMonth")?.split("-")[0] || years[1];
                setValue("referenceMonth", `${year}-${value}`);
              }}
              value={watch("referenceMonth")?.split("-")[1] || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => {
                const month = watch("referenceMonth")?.split("-")[1] || "01";
                setValue("referenceMonth", `${value}-${month}`);
              }}
              value={watch("referenceMonth")?.split("-")[0] || years[1]}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.referenceMonth && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.referenceMonth.message}
            </p>
          )}
        </div>

        {/* Campos editáveis apenas em modo de edição */}
        {isEditMode && (
          <>
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50">
             <Info className="h-4 w-4" />
              <AlertDescription>
                Para marcar um pagamento como excluído ou inutilizado, basta definir o status como "Cancelado".
              </AlertDescription>
           </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Método de Pagamento */}
              <div>
                <Label htmlFor="method" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Método de Pagamento
                </Label>
                <Select
                  onValueChange={(value) => setValue("method", value)}
                  value={watch("method")}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartão">Cartão</SelectItem>
                    <SelectItem value="transferência">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status" className="flex items-center gap-2">
                  {getStatusIcon(watch("status"))}
                  Status
                </Label>
                <Select
                  onValueChange={(value) => setValue("status", value)}
                  value={watch("status")}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Pendente
                      </div>
                    </SelectItem>
                    <SelectItem value="pago">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Pago
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelado">
                      <div className="flex items-center gap-2">
                        <CircleOff className="h-4 w-4" />
                        Cancelado
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {/* Descrição */}
        <div>
          <Label htmlFor="description" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Observações
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            className="mt-2"
            placeholder="Informações adicionais sobre o pagamento..."
            rows={3}
          />
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading || isAutoFilling}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            className="min-w-[120px]"
            disabled={loading || isAutoFilling}
          >
            {(loading || isAutoFilling) ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                {isEditMode ? "Atualizando..." : "Salvando..."}
              </>
            ) : isEditMode ? "Atualizar" : "Registrar"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PaymentForm;