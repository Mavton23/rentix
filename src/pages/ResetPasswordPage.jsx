import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2, Lock, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Token de redefinição inválido');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await api.post('/auth/update-password', {
        token,
        newPassword: data.newPassword
      });

      if (response.data.success) {
        toast.success('Senha redefinida com sucesso!', {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        });
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao redefinir senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            Link Inválido
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            O link de redefinição de senha está incompleto ou expirou.
          </p>
          <Button 
            onClick={() => navigate('/login')}
            className="w-full mt-6"
          >
            Voltar para o Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Redefinir Senha
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="newPassword" className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4" />
              <span>Nova Senha</span>
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Digite sua nova senha"
              {...register('newPassword', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter pelo menos 6 caracteres'
                }
              })}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4" />
              <span>Confirmar Nova Senha</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua nova senha"
              {...register('confirmPassword', {
                required: 'Confirmação é obrigatória',
                validate: value => 
                  value === watch('newPassword') || 'As senhas não coincidem'
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Redefinindo...</span>
              </>
            ) : (
              <>
                <span>Redefinir Senha</span>
                <CheckCircle className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}