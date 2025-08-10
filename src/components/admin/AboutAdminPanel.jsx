import { useState, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { toast } from "sonner";
import api from '../../services/api';

// Objeto inicial padrão para o conteúdo
const DEFAULT_ABOUT_CONTENT = {
  title: '',
  subtitle: '',
  historyTitle: '',
  historyText1: '',
  historyText2: '',
  valuesTitle: '',
  values: [],
  ctaTitle: '',
  ctaText: '',
  ctaButtonText: ''
};

export default function AboutAdminPanel() {
  const [aboutContent, setAboutContent] = useState(DEFAULT_ABOUT_CONTENT);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tempValues, setTempValues] = useState('[]');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/about/content');
        
        // Merge dos dados recebidos com os valores padrão
        const mergedContent = {
          ...DEFAULT_ABOUT_CONTENT,
          ...(response.data || {})
        };
        
        setAboutContent(mergedContent);
        
        // Prepara os valores para edição no textarea
        setTempValues(
          mergedContent.values 
            ? JSON.stringify(mergedContent.values, null, 2) 
            : '[]'
        );
      } catch (error) {
        console.error('Error fetching about content:', error);
        setError('Erro ao carregar conteúdo');
        toast.error('Erro ao carregar conteúdo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  const handleSave = async () => {
    try {
      // Parse os valores antes de enviar
      let parsedValues = [];
      try {
        parsedValues = tempValues ? JSON.parse(tempValues) : [];
        if (!Array.isArray(parsedValues)) {
          throw new Error('Os valores devem ser um array');
        }
      } catch (e) {
        toast.error('Formato inválido para Valores: ' + e.message);
        return;
      }

      const payload = {
        ...DEFAULT_ABOUT_CONTENT,
        ...aboutContent,
        values: parsedValues
      };

      await api.put('/about/content', payload);
      toast.success('Conteúdo atualizado com sucesso!');
      setIsEditing(false);
      
      // Atualiza o estado local com as mudanças
      setAboutContent(payload);
    } catch (error) {
      console.error('Error updating about content:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar conteúdo');
    }
  };

  const handleChange = (field, value) => {
    setAboutContent(prev => ({
      ...prev,
      [field]: value || '' // Garante que nunca seja null/undefined
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editar Conteúdo - Sobre Nós</h1>
        <Button onClick={() => setIsEditing(true)}>
          Editar Conteúdo
        </Button>
      </div>

      {/* Visualização do conteúdo atual */}
      <div className="space-y-6">
        {[
          { label: 'Título', value: aboutContent.title, key: 'title' },
          { label: 'Subtítulo', value: aboutContent.subtitle, key: 'subtitle' },
          { label: 'Título da História', value: aboutContent.historyTitle, key: 'historyTitle' },
          { label: 'Texto 1 da História', value: aboutContent.historyText1, key: 'historyText1', preformatted: true },
          { label: 'Texto 2 da História', value: aboutContent.historyText2, key: 'historyText2', preformatted: true },
          { label: 'Título dos Valores', value: aboutContent.valuesTitle, key: 'valuesTitle', optional: true },
          { label: 'Título do CTA', value: aboutContent.ctaTitle, key: 'ctaTitle', optional: true },
          { label: 'Texto do CTA', value: aboutContent.ctaText, key: 'ctaText', optional: true },
          { label: 'Texto do Botão CTA', value: aboutContent.ctaButtonText, key: 'ctaButtonText', optional: true }
        ].map(({ label, value, key, preformatted, optional }) => (
          (value || !optional) && (
            <div key={key}>
              <h2 className="text-xl font-semibold mb-2">{label}</h2>
              {preformatted ? (
                <p className="whitespace-pre-line">{value || 'Não definido'}</p>
              ) : (
                <p>{value || 'Não definido'}</p>
              )}
            </div>
          )
        ))}
        
        {aboutContent.values?.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aboutContent.values.map((value, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <h3 className="font-medium">{value.title || 'Sem título'}</h3>
                  <p className="text-sm text-gray-600">
                    {value.description || 'Sem descrição'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-2">Valores</h2>
            <p className="text-gray-500">Nenhum valor definido</p>
          </div>
        )}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] m-auto overflow-y-auto bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
          <DialogHeader>
            <DialogTitle>Editar Conteúdo - Sobre Nós</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {[
              { id: 'title', label: 'Título', value: aboutContent.title, onChange: (e) => handleChange('title', e.target.value) },
              { id: 'subtitle', label: 'Subtítulo', value: aboutContent.subtitle, onChange: (e) => handleChange('subtitle', e.target.value) },
              { id: 'historyTitle', label: 'Título da História', value: aboutContent.historyTitle, onChange: (e) => handleChange('historyTitle', e.target.value) },
              { id: 'historyText1', label: 'Texto 1 da História', value: aboutContent.historyText1, onChange: (e) => handleChange('historyText1', e.target.value), textarea: true, rows: 4 },
              { id: 'historyText2', label: 'Texto 2 da História', value: aboutContent.historyText2, onChange: (e) => handleChange('historyText2', e.target.value), textarea: true, rows: 4 },
              { id: 'valuesTitle', label: 'Título dos Valores (opcional)', value: aboutContent.valuesTitle || '', onChange: (e) => handleChange('valuesTitle', e.target.value) },
              { id: 'ctaTitle', label: 'Título do CTA (opcional)', value: aboutContent.ctaTitle || '', onChange: (e) => handleChange('ctaTitle', e.target.value) },
              { id: 'ctaText', label: 'Texto do CTA (opcional)', value: aboutContent.ctaText || '', onChange: (e) => handleChange('ctaText', e.target.value), textarea: true, rows: 3 },
              { id: 'ctaButtonText', label: 'Texto do Botão CTA (opcional)', value: aboutContent.ctaButtonText || '', onChange: (e) => handleChange('ctaButtonText', e.target.value) }
            ].map(({ id, label, value, onChange, textarea, rows }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                {textarea ? (
                  <Textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                  />
                ) : (
                  <Input
                    id={id}
                    value={value}
                    onChange={onChange}
                  />
                )}
              </div>
            ))}
            
            <div className="space-y-2">
              <Label htmlFor="values">
                Valores (formato JSON)
                <span className="text-sm text-gray-500 ml-2">
                  Exemplo: [{"{"}"icon": "users", "title": "Foco no Cliente", "description": "Texto descritivo"{"}"}]
                </span>
              </Label>
              <Textarea
                id="values"
                value={tempValues}
                onChange={(e) => setTempValues(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}