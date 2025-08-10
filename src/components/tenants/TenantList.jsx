import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Badge } from "../ui/badge";
import {
  Eye,
  Pencil,
  Trash2,
  User,
  Mail,
  Phone,
  AlertCircle,
  UserPlus
} from "lucide-react";

const TenantList = ({ tenants, onDelete, loading }) => {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return <Badge variant="success" className="gap-1">
          <div className="w-2 h-2 rounded-full bg-white" />
          {status}
        </Badge>;
      case 'inativo':
        return <Badge variant="destructive" className="gap-1">
          <div className="w-2 h-2 rounded-full bg-white" />
          {status}
        </Badge>;
      case 'pendente':
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

  if (!tenants || !Array.isArray(tenants) || tenants.length === 0) {
    return (
      <div className="text-center py-12">
        <UserPlus className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Nenhum inquilino cadastrado
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Adicione um novo inquilino para começar
        </p>
        <Link to="/tenants/new">
          <Button className="mt-6 gap-2">
            <UserPlus className="h-4 w-4" />
            Adicionar Inquilino
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="min-w-[200px]">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-mail
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.tenantId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <TableCell className="font-medium">
                {tenant.name}
                {tenant.property && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {tenant.property.address}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {tenant.email || <span className="text-gray-400 dark:text-gray-500">N/A</span>}
              </TableCell>
              <TableCell>
                {tenant.phone || <span className="text-gray-400 dark:text-gray-500">N/A</span>}
              </TableCell>
              <TableCell>
                {getStatusBadge(tenant.status)}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Link to={`/tenants/${tenant.tenantId}`}>
                  <Button variant="outline" size="sm" className="px-2">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only">Ver</span>
                  </Button>
                </Link>
                <Link to={`/tenants/${tenant.tenantId}/edit`}>
                  <Button variant="outline" size="sm" className="px-2">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only">Editar</span>
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="px-2"
                  onClick={() => onDelete(tenant.tenantId)}
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader size={16} color="#ffffff" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
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

export default TenantList;