import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../services/api';
import { toast } from "sonner";
import { 
  Button,
} from "../components/ui/button";
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "../components/ui/avatar";
import { 
  Badge 
} from "../components/ui/badge";
import { 
  ScrollArea 
} from "../components/ui/scroll-area";
import { 
  Separator 
} from "../components/ui/separator";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
  CardFooter
} from '../components/ui/card'
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../components/ui/sheet";
import { 
  ClipLoader 
} from "react-spinners";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  FileText,
  Clock,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificationDetailPage = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [tenantDetails, setTenantDetails] = useState(null);

  // Formatação de data
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return {
      full: format(date, "PPPPp", { locale: ptBR }),
      relative: format(date, "dd/MM/yyyy HH:mm", { locale: ptBR }),
      timeAgo: formatDistanceToNow(date, { locale: ptBR, addSuffix: true })
    };
  };

  // Busca os detalhes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [notificationsRes, tenantRes] = await Promise.all([
          api.get(`/notification/notifications/tenant/${tenantId}`),
          api.get(`/tenant/tenants/${tenantId}`)
        ]);
        
        setNotifications(notificationsRes.data.data);
        setTenantDetails(tenantRes.data);
      } catch (error) {
        toast.error("Erro ao carregar dados");
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tenantId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#3b82f6" />
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-50 dark:bg-gray-900">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Nenhuma notificação encontrada</h2>
        <p className="text-muted-foreground">Este inquilino ainda não recebeu notificações</p>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
      {/* Sidebar com lista de notificações */}
      <div className="w-1/3 border-r">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Notificações</h1>
              {tenantDetails && (
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={tenantDetails.avatar || '/images/default-avatar.png'} />
                    <AvatarFallback>
                      {tenantDetails.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {tenantDetails.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="space-y-2">
              {notifications.map((notification) => (
                <Card 
                  key={notification.logId}
                  className={`cursor-pointer transition-all hover:bg-accent bg-gray-50 dark:bg-gray-900 ${
                    selectedNotification?.logId === notification.logId ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedNotification(notification)}
                >
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {notification.title || 'Notificação'}
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-1">
                          {notification.message}
                        </CardDescription>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(notification.sentAt).relative}</span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Painel de detalhes principal */}
      <div className="flex-1 p-6">
        {selectedNotification ? (
          <div className="h-full flex flex-col">
            <Card className="flex-1 bg-gray-50 dark:bg-gray-900">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedNotification.title || 'Detalhes da Notificação'}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="gap-2">
                        <Clock className="h-3 w-3" />
                        {formatDate(selectedNotification.sentAt).timeAgo}
                      </Badge>
                    </div>
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent 
                      side="bottom"
                      className="bg-gray-50 dark:bg-gray-900 dark:text-gray-300"
                    >
                      <SheetHeader>
                        <SheetTitle>Ações</SheetTitle>
                      </SheetHeader>
                      <div className="grid gap-4 py-4 bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
                        <Button variant="outline" className="justify-start gap-2 bg-gray-50 dark:bg-gray-900">
                          <Mail className="h-4 w-4" />
                          Reenviar por e-mail
                        </Button>
                        <Button variant="outline" className="justify-start gap-2 bg-gray-50 dark:bg-gray-900">
                          <Phone className="h-4 w-4" />
                          Reenviar por SMS
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="mt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">
                    {selectedNotification.message}
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Detalhes do Envio</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">ID da Notificação</p>
                      <p>{selectedNotification.logId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data e Hora</p>
                      <p>{formatDate(selectedNotification.sentAt).full}</p>
                    </div>
                  </div>
                </div>

                {tenantDetails && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Informações do Inquilino</h3>
                    <Card className="p-4 bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={tenantDetails.avatar || '/images/default-avatar.png'} />
                          <AvatarFallback>
                            {tenantDetails.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{tenantDetails.name}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            {tenantDetails.email && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{tenantDetails.email}</span>
                              </div>
                            )}
                            {tenantDetails.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{tenantDetails.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Selecione uma notificação</h3>
              <p className="mt-2 text-muted-foreground">
                Escolha uma notificação da lista ao lado para ver os detalhes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function para tempo relativo
function formatDistanceToNow(date, options) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'há poucos segundos';
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} horas`;
  
  const days = Math.floor(diffInSeconds / 86400);
  return days === 1 ? 'há 1 dia' : `há ${days} dias`;
}

export default NotificationDetailPage;