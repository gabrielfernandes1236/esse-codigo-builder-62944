
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useGmailIntegration } from '@/hooks/useGmailIntegration';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationsModal = ({ isOpen, onClose }: IntegrationsModalProps) => {
  const { toast } = useToast();
  const { connection, connectGmail, disconnectGmail } = useGmailIntegration();
  
  const [whatsappToken, setWhatsappToken] = useState('wa_1234567890abcdef');
  const [showToken, setShowToken] = useState(false);
  const [newToken, setNewToken] = useState('');

  const handleGmailToggle = () => {
    if (connection.isConnected) {
      if (confirm('Tem certeza que deseja revogar o acesso ao Gmail?')) {
        disconnectGmail();
      }
    } else {
      connectGmail();
    }
  };

  const handleUpdateWhatsAppToken = () => {
    if (!newToken.trim()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um token válido.",
        variant: "destructive",
      });
      return;
    }

    setWhatsappToken(newToken);
    setNewToken('');
    
    toast({
      title: "Token atualizado",
      description: "Token do WhatsApp foi atualizado com sucesso.",
    });

    // Adicionar ao histórico (simulado)
    const now = new Date().toLocaleString('pt-BR');
    console.log(`Token WhatsApp atualizado - ${now}`);
  };

  const integrationHistory = [
    {
      action: 'Gmail conectado com sucesso',
      date: '21/06/2025 14:30'
    },
    {
      action: 'Token WhatsApp atualizado',
      date: '20/06/2025 09:15'
    },
    {
      action: 'Configurações de backup alteradas',
      date: '19/06/2025 16:45'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 mr-4">
                <i className="ri-plug-line text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-900">Integrações</h2>
                <p className="text-sm text-gray-600">Conecte o CRM com outros sistemas e plataformas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Gmail Integration */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-mail-line text-blue-600 mr-2"></i>
              Gmail
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Status: {connection.isConnected ? (
                      <span className="text-green-600">Conectado</span>
                    ) : (
                      <span className="text-red-600">Desconectado</span>
                    )}
                  </p>
                  {connection.isConnected && (
                    <p className="text-xs text-gray-500 mt-1">
                      {connection.email} • Conectado em {connection.connectedAt}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleGmailToggle}
                  variant={connection.isConnected ? "destructive" : "default"}
                  className="px-4 py-2"
                >
                  {connection.isConnected ? (
                    <>
                      <i className="ri-logout-circle-line mr-2"></i>
                      Revogar Acesso
                    </>
                  ) : (
                    <>
                      <i className="ri-mail-line mr-2"></i>
                      Conectar com Gmail
                    </>
                  )}
                </Button>
              </div>

              {connection.isConnected && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <i className="ri-information-line mr-1"></i>
                    Monitoramento automático de e-mails ativo. Atualizações de processos serão detectadas automaticamente.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Integration */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-whatsapp-line text-green-600 mr-2"></i>
              WhatsApp
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-token" className="text-sm font-medium text-gray-700">
                  Token Atual
                </Label>
                <div className="flex items-center mt-1">
                  <Input
                    id="current-token"
                    type={showToken ? "text" : "password"}
                    value={whatsappToken}
                    readOnly
                    className="mr-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowToken(!showToken)}
                  >
                    <i className={`${showToken ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="new-token" className="text-sm font-medium text-gray-700">
                  Novo Token
                </Label>
                <div className="flex items-center mt-1 space-x-2">
                  <Input
                    id="new-token"
                    type="text"
                    value={newToken}
                    onChange={(e) => setNewToken(e.target.value)}
                    placeholder="Insira o novo token do WhatsApp"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleUpdateWhatsAppToken}
                    className="px-4 py-2"
                  >
                    <i className="ri-refresh-line mr-2"></i>
                    Atualizar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Future Integrations */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-rocket-line text-purple-600 mr-2"></i>
              Futuras Integrações
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center">
                  <i className="ri-calendar-line text-blue-600 mr-3"></i>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Google Agenda</p>
                    <p className="text-xs text-gray-500">Sincronização automática de compromissos</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Em breve
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center">
                  <i className="ri-government-line text-green-600 mr-3"></i>
                  <div>
                    <p className="text-sm font-medium text-gray-700">OAB Digital</p>
                    <p className="text-xs text-gray-500">Consulta automática de processos</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Em breve
                </span>
              </div>
            </div>
          </div>

          {/* Integration History */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-history-line text-gray-600 mr-2"></i>
              Histórico de Integrações
            </h3>
            
            <div className="space-y-3">
              {integrationHistory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm text-gray-700">{item.action}</span>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
