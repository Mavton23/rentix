import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../services/api";
import { ClipLoader } from "react-spinners";
import { 
  ArrowLeft,
  User,
  Home,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import TenantForm from "../components/tenants/TenantForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const EditTenantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Status badge configuration
  const statusConfig = {
    ativo: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      variant: "default",
      text: "Ativo"
    },
    pendente: {
      icon: <Clock className="h-4 w-4" />,
      variant: "warning",
      text: "Pendente"
    },
    inativo: {
      icon: <XCircle className="h-4 w-4" />,
      variant: "destructive",
      text: "Inativo"
    },
    expulso: {
      icon: <XCircle className="h-4 w-4" />,
      variant: "destructive",
      text: "Expulso"
    }
  };

  // Fetch tenant details with associated property
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await api.get(`/tenant/tenants/${id}`);
        setTenant(response.data);
      } catch (error) {
        toast.error("Erro ao carregar detalhes do inquilino", {
          description: "Verifique sua conexão e tente novamente",
          action: {
            label: "Recarregar",
            onClick: () => window.location.reload()
          }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [id]);

  // Handle tenant update with status treatment
  const handleUpdateTenant = async (data) => {
    setUpdating(true);
    try {
      const response = await api.put(
        `/tenant/tenants/${id}`,
        data
      );

      if (data.status === 'expulso') {
        toast.success("Inquilino removido com sucesso", {
          description: "O inquilino foi marcado como expulso do sistema",
          action: {
            label: "Ver lista",
            onClick: () => navigate("/tenants")
          }
        });
        navigate("/tenants");
      } else if (response.data.message === 'Para ativar um inquilino, associe-o a uma propriedade primeiro') {
        toast.warning("Ação necessária", {
          description: response.data.message,
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          action: {
            label: 'Associar Propriedade',
            onClick: () => navigate(`/properties/assign/${id}`)
          },
          duration: 10000
        });
      } else {
        toast.success("Inquilino atualizado", {
          description: "As alterações foram salvas com sucesso",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
        });
        setTenant(response.data.data);
      }
    } catch (error) {
      // Enhanced error handling
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
        <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando inquilino...</span>
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
            onClick={() => navigate("/tenants")}
            className="gap-2 dark:bg-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <User className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="dark:text-gray-200">Editar Inquilino</span>
            </h1>
            {tenant?.status && (
              <Badge 
                variant={statusConfig[tenant.status]?.variant || "default"} 
                className="mt-2 gap-1 capitalize"
              >
                {statusConfig[tenant.status]?.icon}
                {statusConfig[tenant.status]?.text || tenant.status}
              </Badge>
            )}
          </div>
        </div>

        {/* Tenant Form Card */}
        <Card className="border-0 shadow-sm dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              <span>Informações do Inquilino</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TenantForm 
              onSubmit={handleUpdateTenant} 
              initialData={tenant} 
              loading={updating} 
              isEditMode={true}
            />
          </CardContent>
        </Card>

        {/* Associated Property Card (if exists) */}
        {tenant?.property && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-indigo-600" />
                <span>Propriedade Associada</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Endereço</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {tenant.property.address || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Tipo</h3>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">
                    {tenant.property.property_type || "N/A"}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="mt-4 gap-2"
                onClick={() => navigate(`/properties/${tenant.property._id}`)}
              >
                <Home className="h-4 w-4" />
                Ver detalhes da propriedade
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EditTenantPage;