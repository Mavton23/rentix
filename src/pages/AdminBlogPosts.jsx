import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Loader2, Edit, Trash2, Plus } from 'lucide-react';

export default function AdminBlogPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/admin/posts');
        
        // Verificação defensiva dos dados recebidos
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Dados recebidos são inválidos');
        }

        // Mapeamento seguro dos posts
        const safePosts = response.data.map(post => ({
          postId: post.postId?.toString() || 'unknown-id',
          title: post.title || 'Sem título',
          slug: post.slug || '',
          status: post.status || 'draft',
          publishedAt: post.publishedAt || new Date().toISOString(),
          isFeatured: Boolean(post.isFeatured),
          category: {
            name: post.category?.name || 'Sem categoria'
          }
        }));

        setPosts(safePosts);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
        setError(error.message);
        toast.error('Erro ao carregar posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/admin/posts/${postId}`);
      setPosts(prevPosts => prevPosts.filter(post => post.postId !== postId));
      toast.success('Post excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      toast.error('Erro ao excluir post');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      published: { variant: 'success', label: 'Publicado' },
      draft: { variant: 'secondary', label: 'Rascunho' },
      archived: { variant: 'destructive', label: 'Arquivado' },
    };

    const statusInfo = statusMap[status] || { variant: 'default', label: status };
    
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerenciar Posts do Blog</h1>
            <Button onClick={() => navigate('/admin/blog/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Post
            </Button>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-red-500">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-gray-300">Gerenciar Posts do Blog</h1>
        <Button onClick={() => navigate('/admin/blog/new')} className='dark:text-gray-300'>
          <Plus className="mr-2 h-4 w-4" />
          Novo Post
        </Button>
      </div>

      <Card className='bg-gray-50 dark:bg-gray-900 dark:border-gray-600/25 dark:shadow-lg'>
        <CardHeader>
          <CardTitle>Todos os Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="py-8 text-center dark:text-gray-300">
              Nenhum post encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.postId}>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/blog/${post.slug || '#'}`} 
                        className="hover:underline"
                        onClick={e => !post.slug && e.preventDefault()}
                      >
                        {post.title}
                      </Link>
                      {post.isFeatured && (
                        <Badge variant="outline" className="ml-2">
                          Destaque
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{post.category.name}</TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>
                      {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/blog/edit/${post.postId}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.postId)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}