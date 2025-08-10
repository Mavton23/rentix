import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Badge } from "../ui/badge";
import { 
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  HomeIcon,
  BedDoubleIcon,
  BathIcon,
  WalletIcon,
  TypeIcon,
  AlertCircleIcon
} from "lucide-react";

const PropertyList = ({ properties, onDelete, loading }) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={40} color="#3b82f6" />
      </div>
    );
  }

  if (!properties || !Array.isArray(properties)) {
    return (
      <div className="text-center py-12">
        <AlertCircleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Erro ao carregar propriedades
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Não foi possível carregar a lista de propriedades
        </p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <HomeIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Nenhuma propriedade encontrada
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Adicione uma nova propriedade para começar
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4" />
                Endereço
              </div>
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <TypeIcon className="h-4 w-4" />
                Tipo
              </div>
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <WalletIcon className="h-4 w-4" />
                Valor
              </div>
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <BedDoubleIcon className="h-4 w-4" />
                Quartos
              </div>
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <BathIcon className="h-4 w-4" />
                Banheiros
              </div>
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {properties.map((property) => (
            <TableRow key={property.propertyId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {property.address}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {property.property_type || 'N/A'}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {property.rent_amount ? `${property.rent_amount} MZN` : 'N/A'}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {property.property_type === 'comercial' ? 'Não aplicável' : property.bedrooms || 'Não especificado'}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {property.property_type === 'comercial' ? 'Não aplicável' : property.bathrooms || 'Não especificado'}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(property.status)}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Link to={`/properties/${property.propertyId}`}>
                  <Button variant="outline" size="sm" className="px-3 gap-1">
                    <EyeIcon className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only">Ver</span>
                  </Button>
                </Link>
                <Link to={`/properties/${property.propertyId}/edit`}>
                  <Button variant="outline" size="sm" className="px-3 gap-1">
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only">Editar</span>
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="px-3 gap-1"
                  onClick={() => onDelete(property.propertyId)}
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader size={16} color="#ffffff" />
                  ) : (
                    <>
                      <Trash2Icon className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only">Excluir</span>
                    </>
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropertyList;