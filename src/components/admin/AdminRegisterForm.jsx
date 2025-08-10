import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";

export function AdminRegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm();

  const [secretKey, setSecretKey] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setValue('secretKey', secretKey);
  }, [secretKey, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/register', {
        ...data,
        secretKey
      });

      toast.success("Administrador registrado com sucesso!");

      await login(response.data.token, response.data.user);

      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err.msg));
      } else {
        toast.error(error.response?.data?.message || "Erro ao registrar admin");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 w-full">
      <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg border border-gray-600/25 shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-6">Registrar Administrador</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="dark:text-gray-300">
            <label htmlFor="username" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
              Nome
            </label>
            <Input
              id="username"
              {...register("username", { required: "Nome é obrigatório" })}
              className="mt-1"
            />
            {errors.username && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div className="dark:text-gray-300">
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "E-mail é obrigatório" })}
              className="mt-1"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div className="dark:text-gray-300">
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: "Senha é obrigatória" })}
              className="mt-1"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <div className="dark:text-gray-300">
            <label htmlFor="secretKey" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
              Chave Secreta de Administração
            </label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              className="mt-1"
            />
            {errors.secretKey && <p className="text-sm text-red-500 mt-1">{errors.secretKey.message}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Registrar Admin"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-900 dark:text-gray-400">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
