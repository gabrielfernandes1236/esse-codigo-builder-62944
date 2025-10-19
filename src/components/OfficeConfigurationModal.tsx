
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOfficeConfiguration } from '@/hooks/useOfficeConfiguration';
import { Building, Mail, Plus, X, Settings, Clock, Bell, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface OfficeConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfficeConfigurationModal = ({ isOpen, onClose }: OfficeConfigurationModalProps) => {
  const {
    configuration,
    isLoading,
    saveConfiguration,
    addMonitoredSender,
    removeMonitoredSender,
    addKeyword,
    removeKeyword,
    resetConfiguration
  } = useOfficeConfiguration();

  const [newSender, setNewSender] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [firmName, setFirmName] = useState('');
  const [workEmail, setWorkEmail] = useState('');

  // Sincronizar os campos locais com a configuração quando ela mudar
  useEffect(() => {
    setFirmName(configuration.firmName);
    setWorkEmail(configuration.workEmail);
  }, [configuration.firmName, configuration.workEmail]);

  const handleSave = async () => {
    // Validar campos locais antes de salvar
    const errors: string[] = [];
    
    if (!firmName.trim()) {
      errors.push('Nome do escritório é obrigatório');
    }
    
    if (!workEmail.trim()) {
      errors.push('Email do escritório é obrigatório');
    }
    
    if (configuration.monitoredSenders.length === 0) {
      errors.push('Pelo menos um remetente deve ser monitorado');
    }

    if (errors.length > 0) {
      alert(`Erros de validação:\n${errors.join('\n')}`);
      return;
    }

    try {
      await saveConfiguration({
        firmName: firmName.trim(),
        workEmail: workEmail.trim()
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  const handleAddSender = () => {
    if (newSender.trim()) {
      addMonitoredSender(newSender.trim());
      setNewSender('');
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addKeyword(newKeyword.trim());
      setNewKeyword('');
    }
  };

  const intervalOptions = [
    { value: 10, label: '10 segundos' },
    { value: 20, label: '20 segundos' },
    { value: 30, label: '30 segundos' },
    { value: 60, label: '1 minuto' },
    { value: 120, label: '2 minutos' },
    { value: 300, label: '5 minutos' }
  ];

  const notificationOptions = [
    { value: 'all', label: 'Todos os emails' },
    { value: 'important', label: 'Apenas importantes' },
    { value: 'none', label: 'Sem notificações' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Configuração do Escritório
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="firm-name">Nome do Escritório *</Label>
                <Input
                  id="firm-name"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="ex: Oliveira & Associados"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="work-email">Email do Escritório *</Label>
                <Input
                  id="work-email"
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="ex: contato@oliveiraeassociados.com.br"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este será o email principal usado para identificação do escritório
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Remetentes Monitorados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Remetentes Monitorados
                <Badge variant="outline" className="ml-2">
                  {configuration.monitoredSenders.length} configurados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newSender}
                  onChange={(e) => setNewSender(e.target.value)}
                  placeholder="ex: noreply@tjsp.jus.br"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSender()}
                />
                <Button onClick={handleAddSender} disabled={!newSender.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              
              {configuration.monitoredSenders.length > 0 && (
                <div className="space-y-2">
                  <Label>Emails configurados:</Label>
                  <div className="flex flex-wrap gap-2">
                    {configuration.monitoredSenders.map((sender, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center">
                        {sender}
                        <button
                          onClick={() => removeMonitoredSender(sender)}
                          className="ml-2 hover:bg-red-100 rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Exemplos de remetentes importantes:</strong><br />
                  • noreply@tjsp.jus.br (Tribunal de Justiça SP)<br />
                  • sistema@tjrj.jus.br (Tribunal de Justiça RJ)<br />
                  • notificacoes@caixa.gov.br (Caixa Econômica)<br />
                  • gb18112001@gmail.com (Email de teste)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Palavras-chave */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Palavras-chave Monitoradas
                <Badge variant="outline" className="ml-2">
                  {configuration.keywordsToMonitor.length} configuradas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="ex: intimação"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Button onClick={handleAddKeyword} disabled={!newKeyword.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              
              {configuration.keywordsToMonitor.length > 0 && (
                <div className="space-y-2">
                  <Label>Palavras-chave configuradas:</Label>
                  <div className="flex flex-wrap gap-2">
                    {configuration.keywordsToMonitor.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="flex items-center">
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="ml-2 hover:bg-red-100 rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configurações Avançadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Configurações Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Intervalo de Verificação
                  </Label>
                  <Select
                    value={configuration.monitoringInterval.toString()}
                    onValueChange={(value) => saveConfiguration({ monitoringInterval: parseInt(value) })}
                    defaultValue="10"
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="10 segundos" />
                    </SelectTrigger>
                    <SelectContent>
                      {intervalOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Nível de Notificações
                  </Label>
                  <Select
                    value={configuration.notificationLevel}
                    onValueChange={(value: 'all' | 'important' | 'none') => 
                      saveConfiguration({ notificationLevel: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Processamento Automático</Label>
                  <p className="text-sm text-gray-600">
                    Atualizar automaticamente status dos processos baseado nos emails
                  </p>
                </div>
                <Switch
                  checked={configuration.autoProcessEmails}
                  onCheckedChange={(checked) => saveConfiguration({ autoProcessEmails: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={resetConfiguration}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Resetar Configuração
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Configuração'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
