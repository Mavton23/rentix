import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  UserIcon,
  MailIcon,
  IdCard,
  CalendarIcon,
  PhoneIcon,
  AlertTriangle,
  HomeIcon,
  BriefcaseIcon,
  FileText,
  ClockIcon
} from "lucide-react";
import { capitalizeFirstLetter } from '../../utils/formatters';

const TenantDetail = () => {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantAndProperty = async () => {
      try {
        setLoading(true);
        
        // Buscar detalhes do inquilino
        const [tenantResponse, propertyResponse] = await Promise.all([
          api.get(`/tenant/tenants/${id}`),
          api.get(`/property/tenant/${id}`)
        ]);

        setTenant(tenantResponse.data);
        setProperty(propertyResponse.data);
      } catch (error) {
        if (error.response) {
          toast.error(`Erro ao carregar dados: ${error.response.data.message}`);
        } else {
          toast.error("Erro ao carregar dados. Verifique sua conexão.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTenantAndProperty();
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return <Badge variant="success">{status}</Badge>;
      case 'inativo':
        return <Badge variant="destructive">{status}</Badge>;
      case 'expulso':
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge variant="outline">{status || 'N/A'}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color="#3b82f6" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500">
          <AlertTriangle />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          Inquilino não encontrado
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          O inquilino solicitado não foi encontrado no sistema
        </p>
        <div className="mt-6">
          <Link to="/tenants">
            <Button variant="outline">
              Voltar para a lista
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedJoinDate = format(new Date(tenant.join_in), "dd/MM/yyyy 'às' HH:mm");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Detalhes do Inquilino
          </h1>
          <Link to="/tenants">
            <Button variant="outline" className="dark:bg-gray-50">
              Voltar para lista
            </Button>
          </Link>
        </div>

        {/* Main Card */}
        <Card className="dark:bg-gray-950/50">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
                <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                  {tenant.name}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tenant.job || "Profissão não informada"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna 1 - Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2 border-gray-200 dark:border-gray-800">
                  Informações Pessoais
                </h3>
                
                <DetailItem 
                  icon={<IdCard className="h-5 w-5" />}
                  label="Número de Identificação"
                  value={tenant.binum}
                />
                
                <DetailItem 
                  icon={<CalendarIcon className="h-5 w-5" />}
                  label="Idade"
                  value={tenant.age}
                />
                
                <DetailItem 
                  icon={<FileText className="h-5 w-5" />}
                  label="Estado Civil"
                  value={capitalizeFirstLetter(tenant.marital_status)}
                />
                
                <DetailItem 
                  icon={<ClockIcon className="h-5 w-5" />}
                  label="Data de Entrada"
                  value={formattedJoinDate}
                />
                
                <DetailItem 
                  icon={null}
                  label="Status"
                  value={getStatusBadge(tenant.status)}
                />
              </div>

              {/* Coluna 2 - Contato e Propriedade */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2 border-gray-200 dark:border-gray-800">
                  Contato e Propriedade
                </h3>
                
                <DetailItem 
                  icon={<MailIcon className="h-5 w-5" />}
                  label="E-mail"
                  value={tenant.email}
                />
                
                <DetailItem 
                  icon={<PhoneIcon className="h-5 w-5" />}
                  label="Telefone"
                  value={tenant.phone}
                />
                
                <DetailItem 
                  icon={<AlertTriangle className="h-5 w-5" />}
                  label="Telefone de Emergência"
                  value={tenant.emergencyNum}
                />
                
                <DetailItem 
                  icon={<BriefcaseIcon className="h-5 w-5" />}
                  label="Profissão"
                  value={tenant.job || "Não informada"}
                />
                
                <DetailItem 
                  icon={<HomeIcon className="h-5 w-5" />}
                  label="Propriedade"
                  value={property ? property.address : "Não associado"}
                />
              </div>
            </div>

            {/* Observações */}
            {tenant.observation && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Observações
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {tenant.observation}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-3">
              <Link to={`/tenants/${id}/edit`}>
                <Button variant="outline">
                  Editar Inquilino
                </Button>
              </Link>
              {/* <Button>
                Ver Contrato
              </Button> */}
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
      <div className="mt-0.5 text-gray-900 dark:text-gray-100">
        {value || "Não informado"}
      </div>
    </div>
  </div>
);

export default TenantDetail;