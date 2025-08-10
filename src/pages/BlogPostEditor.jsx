import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Loader2 } from 'lucide-react';

export default function BlogPostEditor() {
  const { postId } = useParams();
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    reset,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      categoryId: '',
      status: 'draft',
      isFeatured: false,
      allowComments: true,
      readTime: 5,
      coverImage: null
    }
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Carrega os dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Carrega categorias
        const categoriesResponse = await api.get('/blog/categories');
        setCategories(categoriesResponse.data);

        // Se tiver postId, carrega o post para edição
        if (postId) {
          setIsEditing(true);
          const postResponse = await api.get(`/admin/posts/${postId}`);
          const postData = postResponse.data;
          
          // Preenche os valores do formulário
          reset({
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            categoryId: postData.categoryId,
            status: postData.status,
            isFeatured: postData.isFeatured,
            allowComments: postData.allowComments,
            readTime: postData.readTime,
            coverImage: postData.coverImage
          });
          
          // Configura a pré-visualização da imagem
          if (postData.coverImage) {
            setImagePreview(postData.coverImage);
          }
        }
      } catch (error) {
        toast.error('Erro ao carregar dados');
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [postId, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setValue('coverImage', file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      
      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', data.content);
      formData.append('categoryId', data.categoryId);
      formData.append('status', data.status);
      formData.append('isFeatured', data.isFeatured);
      formData.append('allowComments', data.allowComments);
      formData.append('readTime', data.readTime);
      
      const slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      formData.append('slug', slug);

      if (isEditing) {
        await api.put(`/admin/posts/${postId}`, formData);
        toast.success('Post atualizado com sucesso!');
      } else {
        await api.post('/admin/posts', formData);
        toast.success('Post criado com sucesso!');
      }
      
      navigate('/admin/blog');
    } catch (error) {
      toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} post: ${error.response?.data?.message || error.message}`);
      console.error('Erro ao submeter formulário:', error);
    } finally {
      setLoading(false);
    }
  };

  // Valores assistidos para os switches
  const isFeaturedValue = watch('isFeatured');
  const allowCommentsValue = watch('allowComments');
  const statusValue = watch('status');
  const categoryIdValue = watch('categoryId');

  if (loading && isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 dark:border-gray-600/25 dark:shadow-lg">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Post' : 'Criar Novo Post'}</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Título é obrigatório' })}
                placeholder="Título do post"
                disabled={loading}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria *</Label>
              <Select
                value={categoryIdValue}
                onValueChange={(value) => setValue('categoryId', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-red-500">Categoria é obrigatória</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumo *</Label>
            <Textarea
              id="excerpt"
              {...register('excerpt', { required: 'Resumo é obrigatório' })}
              placeholder="Breve resumo do post"
              rows={3}
              disabled={loading}
            />
            {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              {...register('content', { required: 'Conteúdo é obrigatório' })}
              placeholder="Conteúdo completo do post"
              rows={10}
              disabled={loading}
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="coverImage">Imagem de Capa</Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={isFeaturedValue}
                  onCheckedChange={(checked) => setValue('isFeatured', checked)}
                  disabled={loading}
                />
                <Label htmlFor="isFeatured">Destacar este post</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allowComments"
                  checked={allowCommentsValue}
                  onCheckedChange={(checked) => setValue('allowComments', checked)}
                  disabled={loading}
                />
                <Label htmlFor="allowComments">Permitir comentários</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="readTime">Tempo de leitura (minutos)</Label>
                <Input
                  id="readTime"
                  type="number"
                  min="1"
                  {...register('readTime', { min: 1 })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(value) => setValue('status', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/blog')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Atualizar Post' : 'Publicar Post'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}