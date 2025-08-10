import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { RentixLoader } from "../components/RentixLoader";
import PropertyList from "../components/properties/PropertyList";
import PropertyForm from "../components/properties/PropertyForm";
import api from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PlusIcon, List, Home } from "lucide-react";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Buscar propriedades e inquilinos
  const fetchData = async () => {
    setLoading(true);
    try {
      const [propertiesResponse, tenantsResponse] = await Promise.all([
        api.get("/property/properties"),
        api.get('/tenant/tenants')
      ]);
      
      setProperties(propertiesResponse.data);
      setTenants(tenantsResponse.data);
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

  // Adicionar propriedade
  const handleAddProperty = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/property/properties", data);
      setProperties([...properties, response.data]);
      toast.success("Propriedade criada com sucesso!", {
        action: {
          label: "Fechar",
          onClick: () => {}
        }
      });
      setShowForm(false);
    } catch (error) {
      toast.error("Erro ao adicionar propriedade", {
        description: error.response?.data?.message || "Verifique os dados e tente novamente"
      });
    } finally {
      setLoading(false);
    }
  };

  // Excluir propriedade
  const handleDeleteProperty = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/property/properties/${id}`);
      setProperties(properties.filter(property => property.propertyId !== id));
      toast.success("Propriedade excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir propriedade", {
        description: error.response?.data?.message || "Tente novamente mais tarde"
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
            <Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Gerenciamento de Propriedades
            </h1>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            {showForm ? (
              <>
                <List className="h-5 w-5" />
                Ver Lista
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Nova Propriedade
              </>
            )}
          </Button>
        </div>

        {/* Conteúdo Principal */}
        {showForm ? (
          <Card className="dark:bg-gray-950/50">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                Adicionar Nova Propriedade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyForm 
                onSubmit={handleAddProperty} 
                isEditMode={false}
                loading={loading} 
                tenants={tenants}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="dark:bg-gray-950/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                  Lista de Propriedades
                </CardTitle>
                <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                  {properties.length} {properties.length === 1 ? 'registro' : 'registros'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>
                  <RentixLoader label="Carregando propriedades..." />
                </div>
              ) : properties.length > 0 ? (
                <PropertyList 
                  properties={properties} 
                  onDelete={handleDeleteProperty} 
                  loading={loading} 
                />
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500">
                    <Home className="w-full h-full" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                    Nenhuma propriedade cadastrada
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Adicione uma nova propriedade para começar
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="mt-6 gap-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Adicionar Propriedade
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

export default PropertiesPage;