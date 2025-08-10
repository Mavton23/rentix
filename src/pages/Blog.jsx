import { useState, useEffect } from 'react';
import { Calendar, Clock, User as UserIcon, Filter, X, BookOpen, Star, ChevronRight, Mail } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { RentixLoader } from '../components/RentixLoader';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import api from '../services/api';

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  // Atualiza os filtros quando os parâmetros de URL mudam
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      sort: searchParams.get('sort') || 'newest'
    });
  }, [searchParams]);

  // Busca os dados quando os filtros mudam
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const query = new URLSearchParams();
        if (filters.category) query.append('category', filters.category);
        if (filters.sort) query.append('sort', filters.sort);
        
        const [postsRes, categoriesRes, featuredRes] = await Promise.all([
          api.get(`/blog/posts?${query.toString()}`),
          api.get('/blog/categories'),
          api.get('/blog/featured'),
        ]);
        
        setPosts(postsRes.data);
        setCategories(categoriesRes.data);
        setFeaturedPosts(featuredRes.data);
        setPage(1);
        setHasMore(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const loadMorePosts = async () => {
    try {
      const nextPage = page + 1;
      const query = new URLSearchParams();
      if (filters.category) query.append('category', filters.category);
      if (filters.sort) query.append('sort', filters.sort);
      query.append('page', nextPage);
      
      const response = await api.get(`/blog/posts?${query.toString()}`);
      
      if (response.data.length > 0) {
        setPosts([...posts, ...response.data]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    if (newFilters.category) params.append('category', newFilters.category);
    if (newFilters.sort && newFilters.sort !== 'newest') params.append('sort', newFilters.sort);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ category: '', sort: 'newest' });
    setSearchParams({});
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <RentixLoader />
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="text-center p-8 max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6" />
            <span>Erro ao carregar o blog</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3">
            <BookOpen className="h-10 w-10" />
            <span>Blog Rentix</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Artigos, dicas e novidades sobre gestão imobiliária e tecnologia.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Filtros */}
            <Card className='dark:bg-gray-950/50'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-indigo-600" />
                  <span>Filtrar Artigos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Categoria</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas categorias</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.categoryId} value={cat.slug}>
                          {cat.name} ({cat.postCount})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="mb-2 block">Ordenar por</Label>
                  <Select
                    value={filters.sort}
                    onValueChange={(value) => handleFilterChange('sort', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Mais recentes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mais recentes</SelectItem>
                      <SelectItem value="oldest">Mais antigos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(filters.category || filters.sort !== 'newest') && (
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <X className="h-4 w-4" />
                    Limpar filtros
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Posts em Destaque */}
            {featuredPosts.length > 0 && (
              <Card className='dark:bg-gray-950/50'>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-indigo-600" />
                    <span>Destaques</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {featuredPosts.map((post) => (
                    <Link 
                      key={post.postId} 
                      to={`/blog/${post.slug}`}
                      className="group block"
                    >
                      <div className="flex items-start gap-3 p-2 rounded-lg group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                        <div className="flex-shrink-0 w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-md overflow-hidden">
                          <img 
                            src={post.coverImage || '/images/post_placeholder.png'} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString('pt-BR', { 
                                day: 'numeric', 
                                month: 'short' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Newsletter */}
            <Card className='dark:bg-gray-950/50'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  <span>Newsletter</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Receba os melhores conteúdos sobre gestão imobiliária.
                </p>
                <form className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    className="dark:bg-gray-800"
                  />
                  <Button type="submit" className="w-full gap-2">
                    <Mail className="h-4 w-4" />
                    Assinar Newsletter
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Posts */}
          <div className="lg:w-3/4">
            {/* Lista de Posts */}
            {posts.length === 0 ? (
              <Card className="text-center p-12 dark:bg-gray-950/50">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-2">
                  Nenhum post encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {filters.category ? 
                    `Não há posts publicados na categoria selecionada.` : 
                    `Ainda não há artigos publicados no blog.`}
                </p>
                {filters.category && (
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Limpar filtros
                  </Button>
                )}
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {posts.map((post) => (
                    <Card key={post.postId} className="hover:shadow-md transition-shadow overflow-hidden">
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="h-48 bg-indigo-50 dark:bg-indigo-900/30 relative overflow-hidden">
                          <img 
                            src={post.coverImage || '/images/post_placeholder.png'} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <Badge className="absolute top-3 left-3">
                            {post.category.name}
                          </Badge>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-3 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{post.readTime} min de leitura</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center">
                    <Button 
                      onClick={loadMorePosts}
                      variant="outline"
                      className="gap-2"
                    >
                      <ChevronRight className="h-4 w-4" />
                      Carregar mais artigos
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}