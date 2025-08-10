import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { 
  Settings,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Save,
  RotateCcw,
  Eye,
  Edit
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { RentixLoader } from "../components/RentixLoader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import api from '../services/api';

const FineSettingsPage = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isDirty } } = useForm();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(null);

  // Busca as configurações atuais
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/settings/${user?.id}`);

        const settingsForDisplay = {
          ...response.data,
          finePercentage: response.data.finePercentage * 100
        };
        setCurrentSettings(settingsForDisplay);
        reset(settingsForDisplay);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user?.id, reset]);

  // Manipulador de erros da API
  const handleApiError = (error) => {
    if (error.response) {
      if (error.response.data?.errors) {
        error.response.data?.errors.forEach(err => {
          toast.warning(err.message || err, {
            description: err.field ? `Campo: ${err.field}` : undefined,
            icon: <AlertCircle className="h-5 w-5" />
          });
        });
      } else if (error.response.data?.message) {
        toast.error(error.response.data.message, {
          icon: <AlertCircle className="h-5 w-5" />
        });
      }
    } else {
      toast.error("Erro de conexão. Verifique sua internet.", {
        icon: <AlertCircle className="h-5 w-5" />
      });
    }
  };

  // Envia as alterações para o backend
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        finePercentage: data.finePercentage / 100
      };

      const response = await api.put(`/settings/${user.id}`, payload);
      setCurrentSettings(response.data.data);
      toast.success("Configurações atualizadas!", {
        description: "Suas alterações foram salvas com sucesso.",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      console.log("ERRO: ", error instanceof Error ? error.message : error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Visualização da mensagem de boas-vindas
  const welcomeMessage = watch('welcomeMessage') || currentSettings?.welcomeMessage || '';

  if (loading || !user) return <RentixLoader label="Carregando configurações..." />;

  return (
    <div className="p-4 md:p-8 w-full bg-gray-50/50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Settings className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl md:text-3xl font-bold dark:text-gray-300">
            Configurações do Gestor
          </h1>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="fines" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fines" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Multas</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Modelos</span>
            </TabsTrigger>
          </TabsList>

          {/* Configurações de Multas */}
          <TabsContent value="fines" className="mt-6">
            <Card className="border-0 shadow-sm dark:bg-gray-950/50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="finePercentage" className="flex items-center gap-2 mb-2">
                      <span>Percentual da Multa</span>
                      <Badge variant="outline">%</Badge>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="finePercentage"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        {...register('finePercentage', { 
                          required: "Campo obrigatório",
                          valueAsNumber: true 
                        })}
                        className="flex-1"
                      />
                      <Badge variant="secondary">Padrão: 3%</Badge>
                    </div>
                    {errors.finePercentage && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.finePercentage.message}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="maxFinesBeforeWarning" className="mb-2">
                      Multas antes de advertência
                    </Label>
                    <Input
                      id="maxFinesBeforeWarning"
                      type="number"
                      min="1"
                      {...register('maxFinesBeforeWarning', { 
                        required: "Campo obrigatório",
                        valueAsNumber: true 
                      })}
                    />
                    {errors.maxFinesBeforeWarning && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.maxFinesBeforeWarning.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={loading || !isDirty}
                    className="gap-2"
                  >
                    {loading ? (
                      <ClipLoader size={16} color="#ffffff" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Salvar Configurações</span>
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          {/* Configurações de Notificações */}
          <TabsContent value="notifications" className="mt-6">
            <Card className="border-0 shadow-sm dark:bg-gray-950/50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <Label htmlFor="emailNotifications">Notificações por E-mail</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Enviar lembretes e notificações por e-mail
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="emailNotifications" 
                      {...register('emailNotifications')}
                      checked={watch('emailNotifications')}
                      onCheckedChange={(checked) => setValue('emailNotifications', checked, { shouldDirty: true })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <Label htmlFor="smsNotifications">Notificações por SMS</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Enviar lembretes por SMS (pode haver custos)
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="smsNotifications" 
                      {...register('smsNotifications')}
                      checked={watch('smsNotifications')}
                      onCheckedChange={(checked) => setValue('smsNotifications', checked, { shouldDirty: true })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <Label htmlFor="whatsappNotifications">Notificações por WhatsApp</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Enviar lembretes por WhatsApp
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="whatsappNotifications" 
                      {...register('whatsappNotifications')}
                      checked={watch('whatsappNotifications')}
                      onCheckedChange={(checked) => setValue('whatsappNotifications', checked, { shouldDirty: true })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={loading || !isDirty}
                    className="gap-2"
                  >
                    {loading ? (
                      <ClipLoader size={16} color="#ffffff" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Salvar Configurações</span>
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          {/* Modelos de Mensagens */}
          <TabsContent value="templates" className="mt-6">
            <Card className="border-0 shadow-sm dark:bg-gray-950/50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label htmlFor="welcomeMessage" className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <span>Mensagem de Boas-Vindas</span>
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreview(!preview)}
                      className="gap-2"
                    >
                      {preview ? (
                        <>
                          <Edit className="h-4 w-4" />
                          <span>Editar</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          <span>Visualizar</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {preview ? (
                    <Card className="p-4 bg-white dark:bg-gray-800">
                      <div 
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: welcomeMessage
                            .replace(/{nome_do_inquilino}/g, 'João Silva')
                            .replace(/{porcentagem_da_multa}/g, (currentSettings?.finePercentage * 100).toFixed(0))
                            .replace(/{max_fines_before_warning}/g, currentSettings?.maxFinesBeforeWarning)
                        }} 
                      />
                    </Card>
                  ) : (
                    <>
                      <Textarea
                        id="welcomeMessage"
                        className="min-h-[300px] font-mono text-sm"
                        {...register('welcomeMessage', {
                          required: "Campo obrigatório"
                        })}
                      />
                      {errors.welcomeMessage && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.welcomeMessage.message}</span>
                        </p>
                      )}
                    </>
                  )}
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Variáveis disponíveis:</strong> {"{nome_do_inquilino}"}, {"{porcentagem_da_multa}"}, {"{max_fines_before_warning}"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset(currentSettings)}
                    disabled={!isDirty}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reverter</span>
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || !isDirty}
                    className="gap-2"
                  >
                    {loading ? (
                      <ClipLoader size={16} color="#ffffff" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Salvar Modelo</span>
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FineSettingsPage;