import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import api from '../../services/api';

export default function ContactAdminPanel() {
  const [contactInfo, setContactInfo] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [infoResponse, messagesResponse] = await Promise.all([
          api.get('/contact/info'),
          api.get('/contact/messages')
        ]);
        
        setContactInfo(infoResponse.data);
        setMessages(messagesResponse.data);
      } catch (error) {
        toast.error('Erro ao carregar dados');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveInfo = async () => {
    try {
      await api.put('/contact/info', { 
        updates: contactInfo.map(info => ({
          type: info.type,
          value: info.value,
          additionalValue: info.additionalValue
        }))
      });
      toast.success('Informações atualizadas com sucesso!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erro ao atualizar informações');
      console.error('Error updating contact info:', error);
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      await api.patch(`/contact/messages/${messageId}`, { status });
      setMessages(messages.map(msg => 
        msg.messageId === messageId ? { ...msg, status } : msg
      ));
      toast.success('Status da mensagem atualizado');
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error('Error updating message status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex space-x-4">
          <Button variant="ghost" disabled>Informações</Button>
          <Button variant="ghost" disabled>Mensagens</Button>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="h-6 w-1/4 mb-2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-4 border-b bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
        <Button
          variant={activeTab === 'info' ? 'secondary' : 'ghost'}
          onClick={() => setActiveTab('info')}
        >
          Informações de Contato
        </Button>
        <Button
          variant={activeTab === 'messages' ? 'secondary' : 'ghost'}
          onClick={() => setActiveTab('messages')}
        >
          Mensagens Recebidas ({messages.length})
        </Button>
      </div>

      {activeTab === 'info' ? (
        <div className="space-y-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold dark:text-gray-300">Informações de Contato</h2>
            <Button onClick={() => setIsEditing(true)}>
              Editar Informações
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactInfo.map((info) => (
              <div key={info.infoId} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">{info.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{info.value}</p>
                {info.additionalValue && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{info.additionalValue}</p>
                )}
              </div>
            ))}
          </div>

          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent 
              className="sm:max-w-[600px] dark:text-gray-300"
            >
              <DialogHeader>
                <DialogTitle>Editar Informações de Contato</DialogTitle>
                  <DialogDescription>
                    Atualize os detalhes de contato abaixo
                  </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6 dark:text-gray-300">
                  {contactInfo.length > 0 ? (
                    contactInfo.map((info, index) => (
                      <div key={info.infoId} className="space-y-2">
                        <Label htmlFor={`value-${info.infoId}`}>{info.title}</Label>
                        <Input
                          id={`value-${info.infoId}`}
                          value={info.value}
                          onChange={(e) => {
                            const updated = [...contactInfo];
                            updated[index].value = e.target.value;
                            setContactInfo(updated);
                          }}
                        />
                        <Label htmlFor={`additionalValue-${info.infoId}`}>Valor Adicional</Label>
                        <Input
                          id={`additionalValue-${info.infoId}`}
                          value={info.additionalValue || ''}
                          onChange={(e) => {
                            const updated = [...contactInfo];
                            updated[index].additionalValue = e.target.value;
                            setContactInfo(updated);
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4">Nenhuma informação de contato disponível.</p>
                  )}
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveInfo}>Salvar Alterações</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-6 dark:text-gray-300">
          <h2 className="text-xl font-semibold dark:text-gray-300">Mensagens Recebidas</h2>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <TableRow key={message.messageId}>
                      <TableCell>{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell>
                        {new Date(message.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          message.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          message.status === 'read' ? 'bg-blue-100 text-blue-800' :
                          message.status === 'replied' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {message.status === 'pending' ? 'Pendente' :
                           message.status === 'read' ? 'Lida' :
                           message.status === 'replied' ? 'Respondida' : 'Arquivada'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateMessageStatus(message.messageId, 'read')}
                            disabled={message.status === 'read'}
                          >
                            Marcar como Lida
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateMessageStatus(message.messageId, 'replied')}
                            disabled={message.status === 'replied'}
                          >
                            Marcar como Respondida
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhuma mensagem encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
