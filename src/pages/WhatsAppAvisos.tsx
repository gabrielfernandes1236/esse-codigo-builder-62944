
import { useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { 
  Search, 
  Bell, 
  ChevronDown, 
  MessageCircle, 
  FileText, 
  CalendarCheck, 
  MessageSquare, 
  CheckCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWhatsAppConfiguration } from "@/hooks/useWhatsAppConfiguration";
import { WhatsAppConfigModal } from "@/components/WhatsAppConfigModal";
import { WhatsAppStats } from "@/components/WhatsAppStats";
import { WhatsAppFilters } from "@/components/WhatsAppFilters";
import { useToast } from "@/hooks/use-toast";

export const WhatsAppAvisos = () => {
  const { 
    isAutomationEnabled, 
    setIsAutomationEnabled, 
    messageTemplates, 
    sentMessages, 
    updateTemplate, 
    toggleTemplate, 
    sendTestMessage,
    presetTemplates,
    customTemplates,
    addCustomTemplate,
    getMessageStats,
    simulateClientResponse
  } = useWhatsAppConfiguration();
  
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [clientSearchFilter, setClientSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const { toast } = useToast();

  const handleConfigureTemplate = (template) => {
    setSelectedTemplate(template);
    setConfigModalOpen(true);
  };

  const handleToggleTemplate = (templateId: string) => {
    toggleTemplate(templateId);
    const template = messageTemplates.find(t => t.id === templateId);
    toast({
      title: `${template?.name} ${template?.enabled ? 'desativado' : 'ativado'}`,
      description: `As mensagens automáticas foram ${template?.enabled ? 'desativadas' : 'ativadas'} para este tipo.`,
    });
  };

  const handleTestSend = () => {
    sendTestMessage();
    toast({
      title: "Mensagem de teste enviada!",
      description: "A mensagem de teste foi adicionada ao histórico de envios.",
    });
  };

  const handleSimulateResponse = (messageId: string) => {
    const responses = ['Ok, obrigado!', 'Confirmo', 'Recebido', 'Entendi'];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    simulateClientResponse(messageId, randomResponse);
    toast({
      title: "Resposta do cliente simulada!",
      description: `Cliente respondeu: "${randomResponse}"`,
    });
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'process_update': return FileText;
      case 'appointment': return CalendarCheck;
      case 'relationship': return MessageSquare;
      case 'completion': return CheckCheck;
      default: return MessageCircle;
    }
  };

  const getTemplateIconStyles = (type: string) => {
    switch (type) {
      case 'process_update': return { bg: 'bg-blue-100', color: 'text-blue-600' };
      case 'appointment': return { bg: 'bg-yellow-100', color: 'text-yellow-600' };
      case 'relationship': return { bg: 'bg-green-100', color: 'text-green-600' };
      case 'completion': return { bg: 'bg-purple-100', color: 'text-purple-600' };
      default: return { bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  // Filtrar mensagens baseado nos filtros aplicados
  const filteredMessages = useMemo(() => {
    return sentMessages.filter(message => {
      const matchesClient = clientSearchFilter === '' || 
        message.clientName.toLowerCase().includes(clientSearchFilter.toLowerCase());
      
      const matchesType = typeFilter === 'Todos' || message.type === typeFilter;
      
      const matchesStatus = statusFilter === 'Todos' || message.status === statusFilter;

      return matchesClient && matchesType && matchesStatus;
    });
  }, [sentMessages, clientSearchFilter, typeFilter, statusFilter]);

  const stats = getMessageStats();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
          {/* Search Bar */}
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="bg-gray-100 text-sm rounded-md pl-10 pr-4 py-2 w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Pesquisar..."
            />
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="relative p-2">
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</div>
                <Bell className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center">
              <img 
                src="https://readdy.ai/api/search-image?query=professional%20profile%20picture%20of%20a%20lawyer%2C%20male%2C%20formal%20suit%2C%20minimalist%20background&width=100&height=100&seq=1&orientation=squarish" 
                alt="Dr. Ricardo Oliveira" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="ml-2 flex items-center">
                <span className="text-sm font-medium">Dr. Ricardo Oliveira</span>
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Configuração de Avisos por WhatsApp</h1>
            <Button onClick={handleTestSend} className="bg-blue-600 hover:bg-blue-700 text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              Testar Envio
            </Button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Automatize a comunicação com seus clientes via WhatsApp. Configure mensagens automáticas para diferentes situações.
          </p>

          {/* Main Toggle */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Ativar envio automático de mensagens</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Quando ativado, o sistema enviará mensagens automáticas conforme as configurações abaixo.
                  </p>
                </div>
                <Switch 
                  checked={isAutomationEnabled}
                  onCheckedChange={setIsAutomationEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* Message Types */}
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tipos de Mensagens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {messageTemplates.map((template) => {
              const IconComponent = getTemplateIcon(template.type);
              const iconStyles = getTemplateIconStyles(template.type);
              
              return (
                <Card key={template.id} className={`transition-all hover:shadow-md ${template.enabled ? 'border-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full ${iconStyles.bg} flex items-center justify-center mr-3`}>
                          <IconComponent className={`w-5 h-5 ${iconStyles.color}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          {template.recurrence?.enabled && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Recorrente
                            </span>
                          )}
                        </div>
                      </div>
                      <Switch 
                        checked={template.enabled}
                        onCheckedChange={() => handleToggleTemplate(template.id)}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Última atualização: {template.lastUpdate}</span>
                      <button 
                        onClick={() => handleConfigureTemplate(template)}
                        className="text-blue-600 text-sm font-medium hover:text-blue-700"
                      >
                        Configurar
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Estatísticas de Performance */}
          <WhatsAppStats stats={stats} />

          {/* Recent Messages */}
          <h2 className="text-lg font-medium text-gray-900 mb-4">Mensagens Enviadas Recentemente</h2>
          
          {/* Filtros Avançados */}
          <WhatsAppFilters
            onClientSearch={setClientSearchFilter}
            onTypeFilter={setTypeFilter}
            onStatusFilter={setStatusFilter}
          />

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message, index) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          <img 
                            src={`https://readdy.ai/api/search-image?query=professional%20profile%20picture%20client&width=100&height=100&seq=${index + 2}&orientation=squarish`}
                            alt="Cliente" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{message.clientName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${message.typeColor}`}>
                          {message.type}
                        </span>
                        {message.isAutomatic && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Automática
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900 max-w-xs truncate">{message.message}</div>
                      {message.clientResponse && (
                        <div className="text-xs text-gray-500 mt-1 italic">
                          Resposta: "{message.clientResponse}"
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{message.dateTime}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${message.statusColor}`}>
                          {message.status}
                        </span>
                        {message.status === 'Respondido' && (
                          <span className="text-green-600">✔️✔️</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {message.status === 'Entregue' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSimulateResponse(message.id)}
                        >
                          Simular Resposta
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Mostrando {filteredMessages.length} de {sentMessages.length} mensagens
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Anterior</Button>
                <Button size="sm">Próxima</Button>
              </div>
            </div>
          </Card>
        </main>
      </div>

      {/* Configuration Modal */}
      {selectedTemplate && (
        <WhatsAppConfigModal
          isOpen={configModalOpen}
          onClose={() => {
            setConfigModalOpen(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
          onSave={updateTemplate}
          presetTemplates={presetTemplates[selectedTemplate.type] || []}
          onAddCustomTemplate={addCustomTemplate}
        />
      )}
    </div>
  );
};
