import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../services/api';
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { 
  ArrowLeft,
  Home,
  MapPin,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HardHat,
  Building,
  Landmark
} from "lucide-react";
import { Button } from "../components/ui/button";
import PropertyForm from "../components/properties/PropertyForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Buscar detalhes da propriedade e inquilinos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [propertyRes, tenantsRes] = await Promise.all([
          api.get(`/property/properties/${id}`),
          api.get('/tenant/tenants')
        ]);

        setProperty(propertyRes.data);
        setTenants(tenantsRes.data);
      } catch (error) {
        toast.error("Erro ao carregar dados", {
          description: "Não foi possível carregar os detalhes da propriedade",
          icon: <AlertCircle className="h-5 w-5" />,
          action: {
            label: "Tentar novamente",
            onClick: () => window.location.reload()
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Função para atualizar a propriedade
  const handleUpdateProperty = async (data) => {
    setUpdating(true);
    try {
      const response = await api.put(
        `/property/properties/${id}`,
        data
      );

      toast.success("Propriedade atualizada", {
        description: "As alterações foram salvas com sucesso",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        action: {
          label: "Ver Propriedades",
          onClick: () => navigate("/properties")
        }
      });

      setProperty(response.data.property);
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

  if (loading || !property) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color="#3b82f6" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          {!property ? "Carregando propriedade..." : "Carregando inquilinos..."}
        </span>
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
            onClick={() => navigate("/properties")}
            className="gap-2 dark:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Building className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="dark:text-gray-200">Editar Propriedade</span>
            </h1>
            {property?.status && (
              <Badge 
                variant={property.status === 'disponivel' ? 'default' : 'outline'} 
                className="mt-2 gap-1 capitalize"
              >
                {property.status === 'disponivel' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <HardHat className="h-4 w-4" />
                )}
                {property.status === 'disponivel' ? 'Disponível' : 'Em Reforma'}
              </Badge>
            )}
          </div>
        </div>

        {/* Property Summary Card */}
        <Card className="border-0 shadow-sm dark:bg-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-indigo-600" />
              <span>Resumo da Propriedade</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Endereço</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {property.address || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Tipo</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 capitalize">
                  {property.property_type || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Form Card */}
        <Card className="border-0 shadow-sm dark:bg-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-indigo-600" />
              <span>Editar Dados da Propriedade</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyForm
              onSubmit={handleUpdateProperty}
              isEditMode={true}
              initialData={property}
              loading={updating}
              tenants={tenants}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPropertyPage;