import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  // Verifica se o usuário está autenticado ao carregar a página
  useEffect(() => {
    checkAuth();
  }, []);

  // Função para verificar autenticação
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Função para fazer login
  const login = async (credentialsOrToken, userData) => {
    try {
      let token, user;
      
      // Caso 1: Login tradicional (email + senha)
      if (typeof credentialsOrToken === 'object') {
        const response = await axios.post("http://localhost:5000/api/auth/login", credentialsOrToken);
        token = response.data.token;
        user = response.data.user;
      } 
      // Caso 2: Autenticação pós-registro (token + user)
      else {
        token = credentialsOrToken;
        user = userData;
      }

      // Garante que avatarUrl está presente no objeto user
      const userWithAvatar = {
        ...user,
        avatarUrl: user.avatarUrl || null
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userWithAvatar));
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUser(userWithAvatar)

      return user;
      
    } catch (error) {
      console.error("Erro na autenticação:", error);
      throw error;
    }
  }

  // Nova função para reset de senha
  const resetPassword = async (email) => {
    try {
      const response = await api.post("/auth/reset-password", { email });
      return response.data;
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
      throw error;
    }
  };

  // Função para atualizar senha (quando o usuário recebe o token por email)
  const updatePassword = async (token, newPassword) => {
    try {
      const response = await api.post("/auth/update-password", {
        token,
        newPassword
      });
      
      toast.success("Senha atualizada com sucesso!");
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar senha");
      throw error;
    }
  };

  // Função para atualizar dados do usuário (incluindo avatar)
  const updateUser = async (updatedUserData) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const mergedUser = { 
        ...currentUser, 
        ...updatedUserData,
        // Mantém o avatarUrl existente se não for fornecido um novo
        avatarUrl: updatedUserData.avatarUrl || currentUser.avatarUrl 
      };
      
      localStorage.setItem("user", JSON.stringify(mergedUser));
      setUser(mergedUser);
      
      return mergedUser;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  };

  // Função específica para atualizar o avatar
  const updateAvatar = async (avatarUrl) => {
    return updateUser({ avatarUrl });
  };

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      resetPassword, 
      updatePassword,
      updateUser, 
      updateAvatar,
      logout, 
      checkAuth 
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
