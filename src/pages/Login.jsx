import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2, Mail, Lock, Building, User, Key, ArrowRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resetPassword } = useAuth();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const from = location.state?.from || "/";

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success("Bem-vindo de volta ao Rentix!");
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Erro no login:", error);

      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Credenciais inválidas. Por favor, verifique seus dados.");
        } else if (error.response.data?.errors) {
          error.response.data.errors.forEach(err => 
            toast.error(err.msg)
          );
        } else {
          toast.error(error.response.data?.message || "Erro ao fazer login");
        }
      } else if (error.request) {
        toast.error("Servidor indisponível. Tente novamente mais tarde.");
      } else {
        toast.error("Erro ao processar sua solicitação");
      }
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error("Por favor, insira seu e-mail cadastrado");
      return;
    }

    try {
      setIsResetting(true);
      await resetPassword(resetEmail);
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      setIsResetDialogOpen(false);
      setResetEmail("");
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
      toast.error(error.response?.data?.message || "Erro ao enviar e-mail de recuperação");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding Rentix */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-indigo-600 mb-4 shadow-lg">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Rentix</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Sua plataforma completa de gestão imobiliária
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Acesse sua conta</h2>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-5 dark:text-gray-200">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>E-mail</span>
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email", { 
                    required: "E-mail é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Por favor, insira um e-mail válido"
                    }
                  })}
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Senha</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { 
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 6,
                      message: "A senha deve ter pelo menos 6 caracteres"
                    }
                  })}
                  className="pl-10"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-0 h-auto flex items-center gap-1"
                  >
                    <Key className="h-4 w-4" />
                    <span>Esqueceu sua senha?</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 dark:text-gray-200">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                      <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Recuperação de Senha
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Insira seu e-mail cadastrado para receber um link de redefinição de senha.
                    </p>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsResetDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleResetPassword}
                      disabled={isResetting}
                      className="flex items-center gap-2"
                    >
                      {isResetting ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4" />
                          Enviar Link
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Acessando...</span>
                </>
              ) : (
                <>
                  <span>Entrar na plataforma</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Novo no Rentix?{" "}
              <Link 
                to="/register" 
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                Crie sua conta
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          <p>© {new Date().getFullYear()} Rentix - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}