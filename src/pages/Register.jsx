import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2, User, Mail, Phone, Lock, Check, Building, ArrowRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PhoneInput } from "../components/ui/PhoneInput";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function Register() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    watch,
    setValue,
    setError
  } = useForm({
    mode: "onBlur"
  });
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      // Verifica se as senhas coincidem
      if (data.password !== data.confpass) {
        setError("confpass", {
          type: "manual",
          message: "As senhas não coincidem"
        });
        return;
      }

      const response = await api.post('/auth/register', {
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confpass: data.confpass
      });
      
      toast.success("Conta criada com sucesso! Redirecionando...", {
        position: "top-center"
      });
      
      await login(response.data.token, response.data.user);
      navigate("/dashboard"); 
      
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          toast.error(err.msg || "Erro de validação", {
            description: err.field ? `Campo: ${err.field}` : undefined,
          });
        });
      } else {
        toast.error(error.response?.data?.message || "Erro ao registrar", {
          description: "Por favor, tente novamente mais tarde"
        });
      }
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
            Crie sua conta e comece a gerenciar seus imóveis
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Criar Conta</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 dark:text-gray-200">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
                <User className="h-4 w-4" />
                <span>Nome de Usuário</span>
              </label>
              <div className="relative">
                <Input
                  id="username"
                  placeholder="seunome"
                  {...register("username", { 
                    required: "Nome de usuário é obrigatório",
                    minLength: {
                      value: 3,
                      message: "Mínimo 3 caracteres"
                    }
                  })}
                  className="pl-10"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.username.message}</span>
                </p>
              )}
            </div>

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

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Telefone</span>
              </label>
              <PhoneInput
                value={watch("phone")}
                onChange={(value) => setValue("phone", value)}
                id="phone"
                placeholder="(00) 00000-0000"
                required
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.phone.message}</span>
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
                      message: "Mínimo 6 caracteres"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confpass" className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Confirmar Senha</span>
              </label>
              <div className="relative">
                <Input
                  id="confpass"
                  type="password"
                  placeholder="••••••••"
                  {...register("confpass", {
                    required: "Confirme sua senha",
                    validate: (value) =>
                      value === watch("password") || "As senhas não coincidem"
                  })}
                  className="pl-10"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.confpass && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.confpass.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white mt-6"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Criando conta...</span>
                </>
              ) : (
                <>
                  <span>Registrar-se</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Já tem uma conta?{" "}
              <Link 
                to="/login" 
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          <p>Ao se registrar, você concorda com nossos Termos de Serviço e Política de Privacidade</p>
          <p className="mt-1">© {new Date().getFullYear()} Rentix - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}