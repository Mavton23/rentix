import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { RentixLoader } from "../components/RentixLoader";
import { Bell, BellOff, Mail, Calendar, User, ArrowRight, RefreshCw, Plus, X, ChevronDown } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingNotification, setCreatingNotification] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Formata a data para exibição amigável
  const formatDate = (dateString) => {
    if (!dateString) return "Data não disponível";
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate)
      ? format(parsedDate, "PPpp", { locale: ptBR })
      : "Data inválida";
  };

  // Busca as notificações e inquilinos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [notificationsRes, tenantsRes] = await Promise.all([
          api.get("/notification/notifications"),
          api.get("/tenant/tenants")
        ]);
        setNotifications(notificationsRes.data);
        setTenants(tenantsRes.data);
      } catch (error) {
        toast.error("Erro ao carregar dados.");
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Envia nova notificação
  const handleSendNotification = async () => {
    if (!selectedTenant) {
      toast.warning("Selecione um inquilino");
      return;
    }
    if (!message.trim()) {
      toast.warning("Digite uma mensagem");
      return;
    }

    try {
      setSending(true);
      const response = await api.post("/notification/notifications", {
        tenantId: selectedTenant,
        message
      });

      // Atualiza a lista de notificações
      setNotifications([response.data, ...notifications]);
      toast.success("Notificação enviada com sucesso!");
      setCreatingNotification(false);
      setSelectedTenant("");
      setMessage("");
    } catch (error) {
      toast.error("Erro ao enviar notificação");
      console.error("Erro:", error);
    } finally {
      setSending(false);
    }
  };

  // Navega para os detalhes do inquilino
  const handleViewTenant = (tenantId) => {
    navigate(`/tenants/${tenantId}`);
  };

  return (
    <div className="p-6 w-full bg-gray-50 dark:bg-gray-900 min-h-[80vh]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* <Bell className="h-8 w-8 text-primary" /> */}
          <h1 className="text-3xl font-bold dark:text-gray-300">Notificações</h1>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="px-4 py-2">
            Gestor: {user?.name}
          </Badge>
          <Button 
            onClick={() => setCreatingNotification(!creatingNotification)}
            className="gap-2"
          >
            {creatingNotification ? (
              <>
                <X className="h-4 w-4" /> Cancelar
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Nova Notificação
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Formulário de criação de notificação */}
      {creatingNotification && (
        <Card className="mb-8 bg-gray-50 dark:bg-gray-950/50 dark:text-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>Enviar Nova Notificação</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Inquilino</label>
              <Select onValueChange={setSelectedTenant} value={selectedTenant}>
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
                  <SelectValue placeholder="Selecione um inquilino" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.length > 0 ? (
                    tenants.map((tenant) => (
                      <SelectItem 
                        key={tenant.tenantId} 
                        value={tenant.tenantId}
                        className="bg-gray-50 dark:bg-gray-900"
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{tenant.name}</span>
                          <span className="text-muted-foreground text-xs dark:text-gray-300">
                            ({tenant.email || tenant.phone || 'Sem contato'})
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Nenhum inquilino cadastrado
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mensagem</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite a mensagem para o inquilino..."
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setCreatingNotification(false);
                setSelectedTenant("");
                setMessage("");
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSendNotification}
              disabled={!selectedTenant || !message.trim() || sending}
            >
              {sending ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Notificação
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Lista de Notificações */}
      {loading ? (
        <div>
          <RentixLoader label="Carregando notificações..." />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.logId} className="bg-gray-50 dark:bg-gray-950/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>{notification.tenant?.name || 'Inquilino'}</span>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(notification.sentAt)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">{notification.message}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {notification.tenant?.email && (
                      <Badge variant="secondary">Email: {notification.tenant.email}</Badge>
                    )}
                    {notification.tenant?.phone && (
                      <Badge variant="secondary">Tel: {notification.tenant.phone}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => handleViewTenant(notification.tenantId)}
                  className="gap-2"
                >
                  Ver Inquilino <ArrowRight className="h-4 w-4" />
                </Button>

                <Button 
                  onClick={() => navigate(`/notifications/${notification.tenantId}`)}
                  className="gap-2"
                >
                  Ver Detalhes <ArrowRight className="h-4 w-4" />
                </Button>

              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
            <BellOff className="h-16 w-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            {tenants.length > 0 
              ? "Nenhuma notificação enviada ainda" 
              : "Nenhum inquilino cadastrado"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            {tenants.length > 0
              ? "Você ainda não enviou nenhuma notificação para seus inquilinos. Clique em 'Nova Notificação' para começar."
              : "Você precisa cadastrar inquilinos antes de enviar notificações."}
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Recarregar
            </Button>
            <Button onClick={() => navigate(tenants.length > 0 ? '/tenants' : '/tenants/new')}>
              <User className="mr-2 h-4 w-4" />
              {tenants.length > 0 ? "Ver Inquilinos" : "Cadastrar Inquilino"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;