import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/badge';

export function AdminSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [preview, setPreview] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm();

  // Carrega as configurações
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get(`/admin/settings/${user.id}`);
        setSettings(response.data);
        reset(response.data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar configurações",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user.id, reset, toast]);

  // Atualiza as configurações
  const onSubmit = async (data) => {
    try {
      await api.put(`/admin/settings/${user.id}`, data);
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar configurações",
        variant: "destructive",
      });
    }
  };

  // Visualização da mensagem de boas-vindas
  const welcomeMessage = watch('welcomeMessage') || settings?.welcomeMessage || '';

  if (loading) return <div>Carregando configurações...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Configurações do Sistema</h1>
      
      <Tabs defaultValue="fines" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fines">Multas</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="templates">Modelos</TabsTrigger>
        </TabsList>

        {/* Configurações de Multas */}
        <TabsContent value="fines" className="mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="finePercentage">Percentual da Multa (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="finePercentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register('finePercentage', { valueAsNumber: true })}
                  />
                  <Badge variant="secondary">Padrão: 3%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Percentual aplicado sobre o valor do aluguel em caso de atraso
                </p>
              </div>

              <div>
                <Label htmlFor="maxFinesBeforeWarning">Multas antes de advertência</Label>
                <Input
                  id="maxFinesBeforeWarning"
                  type="number"
                  min="1"
                  {...register('maxFinesBeforeWarning', { valueAsNumber: true })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Número máximo de atrasos antes de enviar advertência formal
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Salvar Configurações</Button>
            </div>
          </form>
        </TabsContent>

        {/* Configurações de Notificações */}
        <TabsContent value="notifications" className="mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="emailNotifications">Notificações por E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembretes e notificações por e-mail
                  </p>
                </div>
                <Switch 
                  id="emailNotifications" 
                  {...register('emailNotifications')}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="smsNotifications">Notificações por SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembretes e notificações por SMS (pode haver custos)
                  </p>
                </div>
                <Switch 
                  id="smsNotifications" 
                  {...register('smsNotifications')}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="whatsappNotifications">Notificações por WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembretes e notificações por WhatsApp
                  </p>
                </div>
                <Switch 
                  id="whatsappNotifications" 
                  {...register('whatsappNotifications')}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Salvar Configurações</Button>
            </div>
          </form>
        </TabsContent>

        {/* Modelos de Mensagens */}
        <TabsContent value="templates" className="mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="welcomeMessage">Mensagem de Boas-Vindas</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreview(!preview)}
                >
                  {preview ? 'Editar' : 'Visualizar'}
                </Button>
              </div>

              {preview ? (
                <div 
                  className="border p-4 rounded-lg bg-white dark:bg-gray-900"
                  dangerouslySetInnerHTML={{ 
                    __html: welcomeMessage
                      .replace(/{nome_do_inquilino}/g, 'João Silva')
                      .replace(/{porcentagem_da_multa}/g, (settings?.finePercentage * 100).toFixed(0))
                      .replace(/{max_fines_before_warning}/g, settings?.maxFinesBeforeWarning)
                  }} 
                />
              ) : (
                <Textarea
                  id="welcomeMessage"
                  className="min-h-[300px] font-mono text-sm"
                  {...register('welcomeMessage')}
                />
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Use as variáveis: {"{nome_do_inquilino}"}, {"{porcentagem_da_multa}"}, {"{max_fines_before_warning}"}
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset(settings)}
              >
                Reverter Alterações
              </Button>
              <Button type="submit">Salvar Modelo</Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};