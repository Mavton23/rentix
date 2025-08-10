import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ClipLoader } from 'react-spinners';
import { RentixLoader } from "../components/RentixLoader";
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

// Componentes UI
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

// Ícones Lucide
import { 
  LogOut, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  Calendar, 
  Edit, 
  Check, 
  X,
  UserCircle,
  KeyRound,
  AlertCircle
} from "lucide-react";

export function ManagerProfilePage() {
  const { user: contextUser, updateUser, logout, updateAvatar } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: 'ativo',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Carrega os dados atualizados do gestor
  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await api.get(`/managers/${contextUser.id}`);
        const apiData = response.data.data;
        setManagerData(apiData);
        reset({
          name: apiData.name,
          email: apiData.email,
          phone: apiData.phone,
          status: apiData.status
        });
        setLoading(false);
      } catch (error) {
        handleApiError(error);
        setLoading(false);
      }
    };

    if (contextUser?.id) {
      fetchManagerData();
    }
  }, [contextUser?.id, reset]);

  const handleApiError = (error) => {
    if (error.response) {
      if (error.response.data?.errors) {
        error.response.data.errors.forEach(err => {
          toast.warning(err.message || err, {
            description: err.field ? `Campo: ${err.field}` : undefined,
          });
        });
      } else if (error.response.data?.message) {
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Erro de conexão. Verifique sua internet.");
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate('/login');
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validação básica do arquivo
      if (!file.type.match('image.*')) {
        toast.error('Por favor, selecione uma imagem válida');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter menos de 5MB');
        return;
      }

      setAvatarFile(file);
      
      // Cria preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await api.put(`/managers/${contextUser.id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Atualiza o contexto com o novo avatar
      await updateAvatar(response.data.avatarUrl);
      return response.data.avatarUrl;
    } catch (error) {
      toast.error('Erro ao enviar avatar');
      console.error(error);
      return null;
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const avatarUrl = await uploadAvatar();

      const profilePayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        ...(avatarUrl && { avatarUrl })
      };

      const profileResponse = await api.put(`/managers/${contextUser.id}`, profilePayload);
      const updatedData = profileResponse.data.data;

      if (data.currentPassword && data.newPassword && data.confirmPassword) {
        try {
          await api.patch(`/managers/${contextUser.id}/password`, {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword
          });
          toast.success("Senha alterada com sucesso!");
        } catch (error) {
          handleApiError(error);
          throw new Error("Erro na alteração de senha");
        }
      }

      setManagerData(updatedData);
      updateUser({
        ...contextUser,
        name: updatedData.name,
        email: updatedData.email,
        avatarUrl: updatedData.avatarUrl,
        role: updatedData.role,
        status: updatedData.status
      });
      
      toast.success("Perfil atualizado com sucesso!");
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);

    } catch (error) {
      if (error.message !== "Erro na alteração de senha") {
        handleApiError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <RentixLoader label="Carregando os seus dados..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-indigo-600" />
          <span className='text-gray-800 dark:text-gray-200'>Meu Perfil</span>
        </h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 dark:bg-gray-950/50 dark:hover:bg-gray-900">
              <User className="h-4 w-4 text-indigo-600" />
              <span className='text-gray-800 dark:text-gray-200'>Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 dark:bg-gray-950/50">
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Coluna Esquerda - Avatar e Informações */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Card do Avatar */}
          <Card className="border-0 shadow-sm dark:bg-gray-950/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                <span>Foto do Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pt-0">
              <Avatar className="w-32 h-32 border-2 border-indigo-100 dark:border-indigo-900/50 shadow-md">
                <AvatarImage 
                  src={avatarPreview || managerData.avatarUrl || '/images/default-avatar.png'} 
                  alt="Foto do gestor"
                  className="object-cover"
                />
                <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-3xl font-medium">
                  {managerData.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {editing && (
                <div className="w-full mt-4">
                  <Label htmlFor="avatar" className="flex items-center gap-2 mb-2">
                    <Edit className="h-4 w-4" />
                    <span>Alterar foto</span>
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos suportados: JPG, PNG, GIF (máx. 5MB)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card de Informações de Acesso */}
          <Card className="border-0 shadow-sm dark:bg-gray-950/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                <span>Informações de Acesso</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div>
                <Label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>Status</span>
                </Label>
                <Badge 
                  variant={
                    managerData.status === 'ativo' ? 'success' : 
                    managerData.status === 'inativo' ? 'destructive' : 'warning'
                  }
                  className="mt-2 gap-1"
                >
                  {managerData.status === 'ativo' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span className="capitalize">{managerData.status || 'ativo'}</span>
                </Badge>
              </div>

              <div>
                <Label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Shield className="h-4 w-4" />
                  <span>Cargo</span>
                </Label>
                <Badge 
                  variant={managerData.role === 'admin' ? 'default' : 'secondary'}
                  className="mt-2 gap-1"
                >
                  {managerData.role === 'admin' ? (
                    <>
                      <Shield className="h-4 w-4" />
                      <span>Administrador</span>
                    </>
                  ) : managerData.role === 'manager' ? (
                    <>
                      <User className="h-4 w-4" />
                      <span>Gestor</span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
                      <span>Supervisor</span>
                    </>
                  )}
                </Badge>
              </div>

              <div>
                <Label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Último Login</span>
                </Label>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {managerData.lastLogin ? 
                    new Date(managerData.lastLogin).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 
                    'Nunca logou'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita - Formulário */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Card de Informações Pessoais */}
          <Card className="border-0 shadow-sm dark:bg-gray-950/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  <span>Informações Pessoais</span>
                </CardTitle>
                {!editing ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditing(true)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Editar Perfil</span>
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditing(false);
                        reset();
                        setAvatarPreview(null);
                      }}
                      className="gap-2 dark:bg-gray-950/50 dark:hover:bg-gray-900"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancelar</span>
                    </Button>
                    <Button 
                      onClick={handleSubmit(onSubmit)}
                      disabled={!isDirty || loading}
                      className="gap-2"
                    >
                      {loading ? (
                        <ClipLoader size={16} color="#ffffff" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span>Salvar Alterações</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Nome Completo</span>
                  </Label>
                  <Input
                    id="name"
                    {...register('name', { 
                      required: 'Nome é obrigatório',
                      minLength: {
                        value: 3,
                        message: 'Nome deve ter pelo menos 3 caracteres'
                      }
                    })}
                    disabled={!editing}
                    className="mt-2"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.name.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>E-mail</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'E-mail é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'E-mail inválido'
                      }
                    })}
                    disabled={!editing}
                    className="mt-2"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Telefone</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone', {
                      pattern: {
                        value: /^[0-9()+-]+$/,
                        message: 'Telefone inválido'
                      }
                    })}
                    disabled={!editing}
                    className="mt-2"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.phone.message}</span>
                    </p>
                  )}
                </div>

                {editing && (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div>
                      <Label htmlFor="status" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Status da Conta</span>
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 ml-6">
                        Ativar/Desativar conta
                      </p>
                    </div>
                    <Switch
                      id="status"
                      checked={watch('status') === 'ativo'}
                      onCheckedChange={(checked) => 
                        setValue('status', checked ? 'ativo' : 'inativo', { shouldDirty: true })
                      }
                    />
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Card de Alteração de Senha */}
          {editing && (
            <Card className="border-0 shadow-sm dark:bg-gray-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-indigo-600" />
                  <span>Alterar Senha</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Senha Atual</span>
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...register('currentPassword')}
                      className="mt-2"
                      placeholder="Digite sua senha atual"
                    />
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <Label htmlFor="newPassword" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Nova Senha</span>
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...register('newPassword', {
                        minLength: {
                          value: 6,
                          message: 'Senha deve ter pelo menos 6 caracteres'
                        }
                      })}
                      className="mt-2"
                      placeholder="Digite a nova senha"
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.newPassword.message}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Confirmar Nova Senha</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword', {
                        validate: value => 
                          value === watch('newPassword') || 'As senhas não coincidem'
                      })}
                      className="mt-2"
                      placeholder="Confirme a nova senha"
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.confirmPassword.message}</span>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setValue('currentPassword', '');
                    setValue('newPassword', '');
                    setValue('confirmPassword', '');
                  }}
                  className="gap-2 dark:bg-gray-950/50 dark:hover:bg-gray-900"
                >
                  <X className="h-4 w-4" />
                  <span>Limpar Campos</span>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}