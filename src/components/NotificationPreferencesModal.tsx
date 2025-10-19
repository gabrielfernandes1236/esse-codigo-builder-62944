
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPreferencesModal = ({ isOpen, onClose }: NotificationPreferencesModalProps) => {
  const { toast } = useToast();
  
  const [channels, setChannels] = useState({
    email: true,
    whatsapp: true,
    sms: false
  });

  const [types, setTypes] = useState({
    novosProcessos: true,
    atualizacoesProcesso: true,
    documentosVinculados: false,
    faturas: true
  });

  const [schedule, setSchedule] = useState({
    inicio: '08:00',
    fim: '18:00'
  });

  const handleChannelChange = (channel: string, checked: boolean) => {
    setChannels(prev => ({ ...prev, [channel]: checked }));
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    setTypes(prev => ({ ...prev, [type]: checked }));
  };

  const handleScheduleChange = (field: string, value: string) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
  };

  const validateTime = (time: string) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleSave = () => {
    if (!validateTime(schedule.inicio) || !validateTime(schedule.fim)) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira horários válidos no formato HH:MM (24h).",
        variant: "destructive",
      });
      return;
    }

    if (schedule.inicio >= schedule.fim) {
      toast({
        title: "Erro de validação",
        description: "O horário de início deve ser anterior ao horário de fim.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram salvas com sucesso.",
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-4">
                <i className="ri-notification-4-line text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-900">Preferências de Notificação</h2>
                <p className="text-sm text-gray-600">Configure como e quando deseja receber notificações</p>
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
          {/* Canais de Recebimento */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-send-plane-line text-blue-600 mr-2"></i>
              Canais de Recebimento
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={channels.email}
                  onCheckedChange={(checked) => handleChannelChange('email', checked as boolean)}
                />
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-mail
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whatsapp"
                  checked={channels.whatsapp}
                  onCheckedChange={(checked) => handleChannelChange('whatsapp', checked as boolean)}
                />
                <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">
                  WhatsApp
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms"
                  checked={channels.sms}
                  onCheckedChange={(checked) => handleChannelChange('sms', checked as boolean)}
                />
                <Label htmlFor="sms" className="text-sm font-medium text-gray-700">
                  SMS
                </Label>
              </div>
            </div>
          </div>

          {/* Tipos de Notificação */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-notification-badge-line text-purple-600 mr-2"></i>
              Tipos de Notificação
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="novosProcessos"
                  checked={types.novosProcessos}
                  onCheckedChange={(checked) => handleTypeChange('novosProcessos', checked as boolean)}
                />
                <Label htmlFor="novosProcessos" className="text-sm font-medium text-gray-700">
                  Novos Processos
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="atualizacoesProcesso"
                  checked={types.atualizacoesProcesso}
                  onCheckedChange={(checked) => handleTypeChange('atualizacoesProcesso', checked as boolean)}
                />
                <Label htmlFor="atualizacoesProcesso" className="text-sm font-medium text-gray-700">
                  Atualizações de Processo
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="documentosVinculados"
                  checked={types.documentosVinculados}
                  onCheckedChange={(checked) => handleTypeChange('documentosVinculados', checked as boolean)}
                />
                <Label htmlFor="documentosVinculados" className="text-sm font-medium text-gray-700">
                  Documentos Vinculados
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="faturas"
                  checked={types.faturas}
                  onCheckedChange={(checked) => handleTypeChange('faturas', checked as boolean)}
                />
                <Label htmlFor="faturas" className="text-sm font-medium text-gray-700">
                  Faturas Pagas/Vencidas
                </Label>
              </div>
            </div>
          </div>

          {/* Horário Permitido */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-time-line text-amber-600 mr-2"></i>
              Horário Permitido para Envio
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inicio" className="text-sm font-medium text-gray-700">
                    De
                  </Label>
                  <Input
                    id="inicio"
                    type="time"
                    value={schedule.inicio}
                    onChange={(e) => handleScheduleChange('inicio', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="fim" className="text-sm font-medium text-gray-700">
                    Até
                  </Label>
                  <Input
                    id="fim"
                    type="time"
                    value={schedule.fim}
                    onChange={(e) => handleScheduleChange('fim', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <i className="ri-information-line mr-1"></i>
                  Mensagens só serão enviadas dentro deste intervalo de horário.
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
