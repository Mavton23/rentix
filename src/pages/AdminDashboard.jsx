import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { 
  MessageSquare, 
  Users, 
  Home, 
  CreditCard, 
  Activity, 
  Star,
  BookOpen
} from 'lucide-react';
import api from '../services/api'
import { useAuth } from "../contexts/AuthContext";
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth(); 
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [showTestimonials, setShowTestimonials] = useState(false);

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, testimonialsRes] = await Promise.all([
          api.get('/admin/stats'),
          user?.role === 'admin' ? 
            api.get('/testimony/pending', {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            }) : Promise.resolve({ data: [] })
        ]);

        setStats(statsRes.data);
        setTestimonials(testimonialsRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleApproveTestimonial = async (id) => {
    try {
      await api.put(`/testimony/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setTestimonials(testimonials.filter(t => t.id !== id));
      toast.success("Depoimento aprovado com sucesso!");
    } catch (error) {
      toast.error("Erro ao aprovar depoimento");
    }
  };

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='bg-gray-50 dark:bg-gray-900'>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="relative p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
        <Button variant="destructive" onClick={handleLogout} className="absolute top-6 right-6">
            Sair
          </Button>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Dashboard</h1>
      
      {user?.role === 'admin' && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-100/15 rounded-lg border border-blue-200">
          <p className="text-blue-800 dark:text-white">Você está logado como administrador do sistema</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card de Gestores */}
        <Card className="bg-gray-50 dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gestores Ativos</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.managers.active}</div>
            <p className="text-xs text-gray-500">
              {stats?.managers.total} no total ({stats?.managers.inactive} inativos)
            </p>
          </CardContent>
        </Card>

        {/* Card de Propriedades */}
        <Card className="bg-gray-50 dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Propriedades</CardTitle>
            <Home className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.properties.total}</div>
            <p className="text-xs text-gray-500">
              {stats?.properties.available} disponíveis, {stats?.properties.rented} alugadas
            </p>
          </CardContent>
        </Card>

        {/* Card de Inquilinos */}
        <Card className="bg-gray-50 dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inquilinos</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tenants.active}</div>
            <p className="text-xs text-gray-500">
              {stats?.tenants.inactive} inativos, {stats?.tenants.expelled} expulsos
            </p>
          </CardContent>
        </Card>

        {/* Card de Pagamentos */}
        <Card className="bg-gray-50 dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.payments.paid}</div>
            <p className="text-xs text-gray-500">
              {stats?.payments.pending} pendentes, {stats?.payments.late} atrasados
            </p>
          </CardContent>
        </Card>

        {/* Card de posts do Blog */}
        <Card className="bg-gray-50 dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Blog
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <p>Total de posts: {stats?.blogPosts.total || 0}</p>
              <Link to="/admin/blog">
                <Button variant="outline" size="sm" className='bg-gray-50 dark:bg-gray-900'>
                  Gerenciar Posts
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <p className="font-medium">{stats?.blogPosts.published || 0}</p>
                <p className="text-gray-500">Publicados</p>
              </div>
              <div className="text-center">
                <p className="font-medium">{stats?.blogPosts.drafts || 0}</p>
                <p className="text-gray-500">Rascunhos</p>
              </div>
              <div className="text-center">
                <p className="font-medium">{stats?.blogPosts.featured || 0}</p>
                <p className="text-gray-500">Destaques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Depoimentos Pendentes (apenas para admin) */}
      {user?.role === 'admin' && testimonials.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <CardTitle>Depoimentos Pendentes</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowTestimonials(!showTestimonials)}
              >
                {showTestimonials ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            <CardDescription>
              {testimonials.length} depoimentos aguardando aprovação
            </CardDescription>
          </CardHeader>
          
          {showTestimonials && (
            <CardContent className="space-y-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.email}</p>
                      <p className="mt-2 italic">"{testimonial.message}"</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => handleApproveTestimonial(testimonial.id)}
                      >
                        Aprovar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      {/* Seção de Atividade Recente (apenas para admin) */}
    {user?.role === 'admin' && stats?.recentActivity && (
    <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">Atividade Recente</h2>
        <Card className="bg-gray-50 dark:bg-gray-900">
        <CardHeader>
            <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <CardTitle>Últimas Ações</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            {stats.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-sm italic">
                Nenhuma atividade registrada até o momento.
            </p>
            ) : (
            <ul className="space-y-3">
                {stats.recentActivity.map((activity, index) => (
                <li key={index} className="flex items-start gap-3">
                    <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                        Por {activity.by} em {new Date(activity.at).toLocaleString()}
                    </p>
                    </div>
                </li>
                ))}
            </ul>
            )}
        </CardContent>
        </Card>
    </div>
    )}
    </div>
  );
}