import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { 
  Home, 
  Building, 
  Store, 
  BedDouble, 
  Bath, 
  User, 
  Wallet, 
  AlertCircle,
  ArrowLeft,
  FileText,
  CircleOff
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import api from "../../services/api";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'disponível':
        return <Badge variant="success" className="gap-1">
          <div className="w-2 h-2 rounded-full bg-white" />
          {status}
        </Badge>;
      case 'alugado':
        return <Badge variant="destructive" className="gap-1">
          <div className="w-2 h-2 rounded-full bg-white" />
          {status}
        </Badge>;
      case 'manutenção':
        return <Badge variant="warning" className="gap-1">
          <div className="w-2 h-2 rounded-full bg-white" />
          {status}
        </Badge>;
      default:
        return <Badge variant="outline">{status || 'N/A'}</Badge>;
    }
  };

  const getPropertyTypeIcon = () => {
    switch (property?.property_type?.toLowerCase()) {
      case 'casa':
        return <Home className="h-6 w-6 text-blue-500" />;
      case 'apartamento':
        return <Building className="h-6 w-6 text-blue-500" />;
      case 'comercial':
        return <Store className="h-6 w-6 text-blue-500" />;
      default:
        return <Home className="h-6 w-6 text-blue-500" />;
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/property/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        toast.error("Erro ao carregar detalhes", {
          description: error.response?.data?.message || "Verifique sua conexão"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={40} color="#3b82f6" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Propriedade não encontrada
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          A propriedade solicitada não existe ou foi removida
        </p>
        <div className="mt-6">
          <Link to="/properties">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para lista
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCommercial = property.property_type?.toLowerCase() === 'comercial';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/properties">
            <Button variant="outline" className="gap-2 dark:bg-gray-300">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <Link to={`/properties/${id}/edit`}>
            <Button variant="outline" className="dark:bg-gray-300">
              Editar Propriedade
            </Button>
          </Link>
        </div>

        {/* Main Card */}
        <Card className="dark:bg-gray-950/50">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                {getPropertyTypeIcon()}
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                  {property.address}
                </CardTitle>
                <div className="flex items-center gap-3 mt-2">
                  {getStatusBadge(property.status)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {property.propertyId}
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
                  icon={<Wallet className="h-5 w-5" />}
                  label="Valor do Aluguel"
                  value={`${property.rent_amount} MZN`}
                />
                <DetailItem 
                  icon={<FileText className="h-5 w-5" />}
                  label="Tipo de Propriedade"
                  value={property.property_type}
                />
              </div>

              {/* Detalhes da Propriedade */}
              {!isCommercial && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem 
                    icon={<BedDouble className="h-5 w-5" />}
                    label="Quartos"
                    value={property.bedrooms || "Não informado"}
                  />
                  <DetailItem 
                    icon={<Bath className="h-5 w-5" />}
                    label="Banheiros"
                    value={property.bathrooms || "Não informado"}
                  />
                </div>
              )}

              {/* Mensagem para propriedades comerciais */}
              {isCommercial && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <CircleOff className="h-5 w-5 text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Informações de quartos e banheiros não se aplicam a propriedades comerciais
                  </p>
                </div>
              )}

              {/* Inquilino */}
              <DetailItem 
                icon={<User className="h-5 w-5" />}
                label="Inquilino"
                value={property.tenant?.name || "Não associado"}
              />

              {/* Descrição */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Descrição
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {property.description || "Nenhuma descrição fornecida"}
                  </p>
                </div>
              </div>
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

export default PropertyDetail;