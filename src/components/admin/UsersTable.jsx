// components/admin/UsersTable.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Eye, UserPlus } from "lucide-react";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { RentixLoader } from "../RentixLoader";

export const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/managers");
        setUsers(response.data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar usuários",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.patch(`/admin/managers/${userId}/status`, { status: newStatus });
      setUsers(users.map(user => 
        user.managerId === userId ? { ...user, status: newStatus } : user
      ));
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/admin/managers/${userId}`);
      setUsers(users.filter(user => user.managerId !== userId));
      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao remover usuário",
        variant: "destructive",
      });
    }
  };

  if (loading) return <RentixLoader />;

  return (
    <div className="space-y-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold dark:text-gray-300">Gerenciar Usuários</h2>
        <Button asChild>
          <Link to="/admin/users/new" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Adicionar Usuário
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Login</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.managerId}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || '-'}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Administrador' : 
                     user.role === 'manager' ? 'Gestor' : 'Supervisor'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Badge 
                          variant={
                            user.status === 'ativo' ? 'success' : 
                            user.status === 'inativo' ? 'destructive' : 'warning'
                          }
                        >
                          {user.status}
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleStatusChange(user.managerId, 'ativo')}>
                        Ativar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(user.managerId, 'inativo')}>
                        Desativar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(user.managerId, 'suspenso')}>
                        Suspender
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  {user.lastLogin ? 
                    format(new Date(user.lastLogin), 'PPpp', { locale: pt }) : 
                    'Nunca logou'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link 
                          to={`/admin/users/${user.managerId}`} 
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Visualizar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          to={`/admin/users/${user.managerId}/edit`} 
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(user.managerId)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};