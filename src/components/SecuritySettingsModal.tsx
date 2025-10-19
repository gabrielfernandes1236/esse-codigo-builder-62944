
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecuritySettingsModal = ({ isOpen, onClose }: SecuritySettingsModalProps) => {
  const { toast } = useToast();
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState('email');
  const [loginNotifications, setLoginNotifications] = useState(true);

  const [activeDevices] = useState([
    {
      id: 1,
      device: 'Chrome - Windows 11',
      ip: '192.168.1.100',
      lastAccess: '22/06/2025 às 08:30',
      current: true
    },
    {
      id: 2,
      device: 'Firefox - Windows 11',
      ip: '192.168.1.100',
      lastAccess: '21/06/2025 às 16:45',
      current: false
    },
    {
      id: 3,
      device: 'Chrome Mobile - Android',
      ip: '192.168.1.105',
      lastAccess: '20/06/2025 às 12:15',
      current: false
    }
  ]);

  const handleDeviceLogout = (deviceId: number, deviceName: string) => {
    toast({
      title: "Sessão encerrada",
      description: `A sessão do dispositivo "${deviceName}" foi encerrada com sucesso.`,
    });
  };

  const handleLogoutAllDevices = () => {
    if (confirm('Tem certeza que deseja encerrar todas as sessões? Você precisará fazer login novamente em todos os dispositivos.')) {
      toast({
        title: "Todas as sessões encerradas",
        description: "Todas as sessões ativas foram encerradas com sucesso.",
      });
    }
  };

  const handleSave = () => {
    toast({
      title: "Configurações de segurança atualizadas",
      description: "Suas configurações foram salvas com sucesso.",
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 mr-4">
                <i className="ri-lock-password-line text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-900">Configurações de Segurança</h2>
                <p className="text-sm text-gray-600">Configure autenticação e gerencie dispositivos conectados</p>
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
          {/* Autenticação em Dois Fatores */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-shield-keyhole-line text-blue-600 mr-2"></i>
              Autenticação em Dois Fatores (2FA)
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa-toggle" className="text-sm font-medium text-gray-700">
                    Ativar 2FA
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                </div>
                <Switch
                  id="2fa-toggle"
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>

              {twoFactorEnabled && (
                <div className="mt-4">
                  <Label htmlFor="2fa-method" className="text-sm font-medium text-gray-700">
                    Método de verificação
                  </Label>
                  <Select value={twoFactorMethod} onValueChange={setTwoFactorMethod}>
                    <SelectTrigger className="mt-1 max-w-xs">
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Enviar código por e-mail</SelectItem>
                      <SelectItem value="whatsapp">Enviar código por WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Dispositivos Ativos */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <i className="ri-computer-line text-green-600 mr-2"></i>
                Dispositivos Ativos
              </h3>
              <Button
                variant="outline"
                onClick={handleLogoutAllDevices}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <i className="ri-logout-circle-line mr-2"></i>
                Encerrar Todas as Sessões
              </Button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispositivo</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <span>{device.device}</span>
                          {device.current && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Atual
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{device.ip}</TableCell>
                      <TableCell className="text-gray-600">{device.lastAccess}</TableCell>
                      <TableCell>
                        {!device.current && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeviceLogout(device.id, device.device)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Encerrar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Segurança Proativa */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-shield-check-line text-purple-600 mr-2"></i>
              Segurança Proativa
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="loginNotifications"
                  checked={loginNotifications}
                  onCheckedChange={(checked) => setLoginNotifications(checked as boolean)}
                />
                <Label htmlFor="loginNotifications" className="text-sm font-medium text-gray-700">
                  Notificar por e-mail ao detectar novo login em dispositivo desconhecido
                </Label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <i className="ri-information-line mr-1"></i>
                  Mantenha esta opção ativada para ser alertado sobre atividades suspeitas em sua conta.
                </p>
              </div>
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
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
