import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { RentixLoader } from "../components/RentixLoader";

export function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/admin/managers/${id}`);
        setUser(response.data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar usuário",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, toast]);

  if (loading) return <RentixLoader />;
  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <div className="container mx-auto py-8 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold dark:text-gray-300">Detalhes do Usuário</h2>
        <Button asChild>
          <Link to={`/admin/users/${id}/edit`}>Editar Usuário</Link>
        </Button>
      </div>

      <Card className="bg-gray-50 dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl">{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-500">Email</h3>
              <p>{user.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Telefone</h3>
              <p>{user.phone || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Função</h3>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role === 'admin' ? 'Administrador' : 
                 user.role === 'manager' ? 'Gestor' : 'Supervisor'}
              </Badge>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Status</h3>
              <Badge 
                variant={
                  user.status === 'ativo' ? 'success' : 
                  user.status === 'inativo' ? 'destructive' : 'warning'
                }
              >
                {user.status}
              </Badge>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Último Login</h3>
              <p>
                {user.lastLogin ? 
                  format(new Date(user.lastLogin), 'PPpp', { locale: pt }) : 
                  'Nunca logou'}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Data de Criação</h3>
              <p>{format(new Date(user.createdAt), 'PPpp', { locale: pt })}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};