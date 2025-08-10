import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { RentixLoader } from "../components/RentixLoader";
import TenantList from "../components/tenants/TenantList";
import TenantForm from "../components/tenants/TenantForm";
import { 
  User, 
  Users, 
  Plus, 
  List, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Home
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import api from "../services/api";

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await api.get("/tenant/tenants");
      setTenants(response.data);
    } catch (error) {
      toast.error("Erro ao carregar inquilinos", {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        description: error.response?.data?.message || "Verifique sua conexão"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleAddTenant = async (data) => {
    setIsAdding(true);
    try {
      const response = await api.post("/tenant/tenants", data);
      setTenants([...tenants, response.data]);
      toast.success("Inquilino cadastrado com sucesso!", {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />
      });
      setShowForm(false);
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          toast.error(err.message || err.msg, {
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
            description: err.field ? `Campo: ${err.field}` : undefined,
          });
        });
      } else {
        toast.error(error.response?.data?.message || "Ocorreu um erro ao adicionar inquilino", {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTenant = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/tenant/tenants/${id}`);
      setTenants(tenants.filter(tenant => tenant.tenantId !== id));
      toast.success("Inquilino excluído com sucesso!", {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Ocorreu um erro ao excluir o inquilino.", {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Gerenciamento de Inquilinos
            </h1>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            {showForm ? (
              <List className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {showForm ? "Ver Lista" : "Novo Inquilino"}
          </Button>
        </div>

        {/* Conteúdo Principal */}
        {showForm ? (
          <Card className="dark:bg-gray-950/50">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                Cadastrar Novo Inquilino
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TenantForm 
                onSubmit={handleAddTenant} 
                loading={isAdding} 
                isEditMode={false}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="dark:bg-gray-950/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                  Lista de Inquilinos
                </CardTitle>
                <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                  {tenants.length} {tenants.length === 1 ? 'registro' : 'registros'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>
                  <RentixLoader label="Carregando inquilinos..." />
                </div>
              ) : tenants.length > 0 ? (
                <TenantList 
                  tenants={tenants} 
                  onDelete={handleDeleteTenant} 
                  loading={loading} 
                />
              ) : (
                <div className="text-center py-12">
                  <User className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                    Nenhum inquilino cadastrado
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Cadastre um novo inquilino para começar
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="mt-6 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Inquilino
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TenantsPage;