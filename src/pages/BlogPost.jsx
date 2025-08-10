import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Clock, Calendar, User, ArrowLeft, Bookmark, Share2, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blog/post/${slug}`);
        setPost(response.data);
        
        setIsBookmarked(Math.random() > 0.5);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);


  if (loading) return <BlogPostSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!post) return <NotFoundState />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Cabeçalho do Post */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
            {post.category.name}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-gray-500 dark:text-gray-300 mb-8">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min de leitura</span>
            </div>
          </div>
        </div>

        {/* Imagem de Capa */}
        {post.coverImage && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover"
              onError={(e) => {
                e.target.src = '/images/post_placeholder.png';
              }}
            />
          </div>
        )}

        {/* Conteúdo */}
        <article className="prose prose-lg lg:prose-xl mx-auto max-w-none">
          <div 
            className="text-gray-700 dark:text-gray-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </div>
    </div>
  );
}

// Componentes de Estado
const BlogPostSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="mb-8">
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="mb-12 text-center">
      <Skeleton className="h-6 w-32 mx-auto mb-4" />
      <Skeleton className="h-12 w-full mb-6" />
      <div className="flex justify-center gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="w-full h-64 mb-12" />
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-center">
    <div className="bg-red-50 text-red-600 p-6 rounded-lg inline-block">
      <h2 className="text-xl font-medium mb-2">Ocorreu um erro</h2>
      <p>{error}</p>
      <Button 
        variant="ghost" 
        className="mt-4 text-red-600 hover:bg-red-100"
        onClick={() => window.location.reload()}
      >
        Tentar novamente
      </Button>
    </div>
  </div>
);

const NotFoundState = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-center">
    <div className="bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 p-6 rounded-lg inline-block">
      <h2 className="text-xl font-medium mb-2">Post não encontrado</h2>
      <p>O post que você está procurando não existe ou foi removido.</p>
      <Button 
        variant="ghost" 
        className="mt-4"
        onClick={() => window.history.back()}
      >
        Voltar para o blog
      </Button>
    </div>
  </div>
);