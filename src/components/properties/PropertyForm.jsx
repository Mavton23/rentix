import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Loader2, Info, Home, Building, Store, BedDouble, Bath, User } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { toast } from "sonner";
import { Card } from "../ui/card";

const PropertyForm = ({ onSubmit, loading, isEditMode = false, initialData, tenants, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      address: initialData?.address || "",
      property_type: initialData?.property_type || "",
      rent_amount: initialData?.rent_amount ? parseFloat(initialData.rent_amount) : 0,
      status: initialData?.status ? initialData?.status?.toLowerCase() : "disponivel",
      bedrooms: initialData?.bedrooms || "",
      bathrooms: initialData?.bathrooms || "",
      description: initialData?.description || "",
      tenantId: initialData?.tenantId || "none",
    },
  });

  const propertyType = watch("property_type");
  const isCommercial = propertyType === "comercial";

  useEffect(() => {
    if (initialData) {
      reset({
        address: initialData.address,
        property_type: initialData.property_type,
        rent_amount: parseFloat(initialData.rent_amount),
        status: initialData?.status?.toLowerCase() || "disponivel",
        bedrooms: initialData.bedrooms,
        bathrooms: initialData.bathrooms,
        description: initialData.description,
        tenantId: initialData.tenantId || "none",
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      if (!isEditMode) {
        reset();
      }
    } catch (error) {
      toast.error("Erro ao enviar os dados", {
        description: error.response?.data?.message || "Verifique e tente novamente."
      });
    }
  };

  const renderPropertyTypeIcon = () => {
    switch (propertyType) {
      case "casa":
        return <Home className="h-5 w-5 text-gray-500" />;
      case "apartamento":
        return <Building className="h-5 w-5 text-gray-500" />;
      case "comercial":
        return <Store className="h-5 w-5 text-gray-500" />;
      default:
        return <Home className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6 dark:bg-gray-950/50">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Endereço */}
        <div>
          <Label htmlFor="address">Endereço *</Label>
          <Input
            id="address"
            type="text"
            {...register("address", { required: "Endereço é obrigatório" })}
            className={`mt-2 ${errors.address ? "border-red-500" : ""}`}
            placeholder="Ex: Av. 24 de Julho, nº 123"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <Info className="w-4 h-4" />
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Tipo de Propriedade */}
        <div>
          <Label htmlFor="property_type">Tipo de Propriedade *</Label>
          <Select
            onValueChange={(value) => setValue("property_type", value)}
            value={watch("property_type")}
          >
            <SelectTrigger className="mt-2">
              <div className="flex items-center gap-2">
                {renderPropertyTypeIcon()}
                <SelectValue placeholder="Selecione o tipo" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casa">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Casa
                </div>
              </SelectItem>
              <SelectItem value="apartamento">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Apartamento
                </div>
              </SelectItem>
              <SelectItem value="comercial">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Comercial
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Valor do Aluguel */}
        <div>
          <Label htmlFor="rent_amount">Valor do Aluguel (MZN) *</Label>
          <Input
            id="rent_amount"
            type="number"
            step="0.01"
            {...register("rent_amount", { 
              required: "Valor é obrigatório",
              min: { value: 0, message: "O valor não pode ser negativo" }
            })}
            className={`mt-2 ${errors.rent_amount ? "border-red-500" : ""}`}
            placeholder="Ex: 15000"
          />
          {errors.rent_amount && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <Info className="w-4 h-4" />
              {errors.rent_amount.message}
            </p>
          )}
        </div>

        {/* Status (apenas edição) */}
        {isEditMode && (
          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              onValueChange={(value) => setValue("status", value)}
              value={watch("status")}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="alugado">Alugado</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Quartos e Banheiros (condicional) */}
        {!isCommercial && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
              <BedDouble className="h-4 w-4" />
              <span>Detalhes da Propriedade</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  {...register("bedrooms", {
                    min: { value: 0, message: "Número inválido" }
                  })}
                  className={`mt-2 ${errors.bedrooms ? "border-red-500" : ""}`}
                />
                {errors.bedrooms && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    {errors.bedrooms.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  {...register("bathrooms", {
                    min: { value: 0, message: "Número inválido" }
                  })}
                  className={`mt-2 ${errors.bathrooms ? "border-red-500" : ""}`}
                />
                {errors.bathrooms && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    {errors.bathrooms.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Descrição */}
        <div>
          <Label htmlFor="description">Descrição *</Label>
          <Textarea
            id="description"
            {...register("description", { required: "Descrição é obrigatória" })}
            placeholder="Descreva a propriedade (área, características, localização, etc.)"
            className={`mt-2 ${errors.description ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <Info className="w-4 h-4" />
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Associar Inquilino */}
        <div>
          <Label htmlFor="tenantId">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Associar Inquilino</span>
            </div>
          </Label>
          <Select
            onValueChange={(value) => setValue("tenantId", value === "none" ? null : value)}
            value={watch("tenantId") || "none"}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione um inquilino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum inquilino</SelectItem>
              {tenants?.map((tenant) => (
                <SelectItem key={tenant.tenantId} value={tenant.tenantId}>
                  {tenant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Informação Adicional */}
        {!isEditMode && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-start gap-3 border border-blue-200 dark:border-blue-800/50">
            <Info className="w-5 h-5 mt-0.5 text-blue-500 dark:text-blue-300 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              A propriedade será cadastrada como <strong>Disponível</strong> por padrão.
              Você pode alterar o status após o cadastro.
            </p>
          </div>
        )}

        {/* Ações do Formulário */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            className="min-w-[120px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Salvando...
              </>
            ) : isEditMode ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PropertyForm;