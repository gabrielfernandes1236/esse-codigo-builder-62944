
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal = ({ isOpen, onClose }: BackupModalProps) => {
  const { toast } = useToast();
  
  const [frequency, setFrequency] = useState('weekly');
  const [location, setLocation] = useState('internal');
  const [scheduleTime, setScheduleTime] = useState('02:00');
  const [scheduleDay, setScheduleDay] = useState('sunday');
  const [emailConfirmation, setEmailConfirmation] = useState(true);
  const [driveConnected, setDriveConnected] = useState(false);

  const backupHistory = [
    {
      id: 1,
      date: '21/06/2025 02:00',
      size: '2.4 GB',
      source: 'Automático',
      status: 'Concluído'
    },
    {
      id: 2,
      date: '14/06/2025 02:00',
      size: '2.3 GB',
      source: 'Automático',
      status: 'Concluído'
    },
    {
      id: 3,
      date: '12/06/2025 15:30',
      size: '2.3 GB',
      source: 'Manual',
      status: 'Concluído'
    },
    {
      id: 4,
      date: '07/06/2025 02:00',
      size: '2.2 GB',
      source: 'Automático',
      status: 'Concluído'
    },
    {
      id: 5,
      date: '31/05/2025 02:00',
      size: '2.1 GB',
      source: 'Automático',
      status: 'Concluído'
    }
  ];

  const weekDays = [
    { value: 'sunday', label: 'Domingo' },
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday', label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' },
    { value: 'saturday', label: 'Sábado' }
  ];

  const handleSave = () => {
    toast({
      title: "Configurações de backup atualizadas",
      description: "As configurações foram salvas com sucesso.",
    });
    
    onClose();
  };

  const handleDownloadBackup = (backupId: number, date: string) => {
    toast({
      title: "Download iniciado",
      description: `Iniciando download do backup de ${date}`,
    });
  };

  const handleCreateBackup = () => {
    toast({
      title: "Backup iniciado",
      description: "Um novo backup está sendo criado. Você será notificado quando concluído.",
    });
  };

  const handleConnectDrive = () => {
    // Simular conexão com Google Drive
    setTimeout(() => {
      setDriveConnected(true);
      toast({
        title: "Google Drive conectado",
        description: "Sua conta do Google Drive foi conectada com sucesso.",
      });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500 mr-4">
                <i className="ri-database-2-line text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-900">Configurações de Backup</h2>
                <p className="text-sm text-gray-600">Configure a frequência e o local de armazenamento dos backups</p>
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
          {/* Backup Configuration */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-settings-3-line text-blue-600 mr-2"></i>
              Configuração de Backup
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">
                  Frequência
                </Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {frequency !== 'manual' && (
                <>
                  <div>
                    <Label htmlFor="schedule-time" className="text-sm font-medium text-gray-700">
                      Horário
                    </Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {frequency === 'weekly' && (
                    <div className="md:col-span-2">
                      <Label htmlFor="schedule-day" className="text-sm font-medium text-gray-700">
                        Dia da Semana
                      </Label>
                      <Select value={scheduleDay} onValueChange={setScheduleDay}>
                        <SelectTrigger className="mt-1 max-w-xs">
                          <SelectValue placeholder="Selecione o dia" />
                        </SelectTrigger>
                        <SelectContent>
                          {weekDays.map((day) => (
                            <SelectItem key={day.value} value={day.value}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Storage Location */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-cloud-line text-green-600 mr-2"></i>
              Local de Armazenamento
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="location-internal"
                  name="location"
                  value="internal"
                  checked={location === 'internal'}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-blue-600"
                />
                <Label htmlFor="location-internal" className="text-sm font-medium text-gray-700">
                  Interno (armazenado no sistema)
                </Label>
              </div>
              
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="location-export"
                  name="location"
                  value="export"
                  checked={location === 'export'}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-blue-600"
                />
                <Label htmlFor="location-export" className="text-sm font-medium text-gray-700">
                  Exportar (gera arquivo .zip)
                </Label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id="location-drive"
                    name="location"
                    value="drive"
                    checked={location === 'drive'}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-blue-600"
                  />
                  <Label htmlFor="location-drive" className="text-sm font-medium text-gray-700">
                    Google Drive
                  </Label>
                </div>
                
                {location === 'drive' && (
                  <Button
                    onClick={handleConnectDrive}
                    variant={driveConnected ? "outline" : "default"}
                    size="sm"
                    disabled={driveConnected}
                  >
                    {driveConnected ? (
                      <>
                        <i className="ri-check-line mr-2"></i>
                        Conectado
                      </>
                    ) : (
                      <>
                        <i className="ri-google-line mr-2"></i>
                        Conectar Drive
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-notification-2-line text-purple-600 mr-2"></i>
              Opções Adicionais
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-confirmation"
                  checked={emailConfirmation}
                  onCheckedChange={(checked) => setEmailConfirmation(checked as boolean)}
                />
                <Label htmlFor="email-confirmation" className="text-sm font-medium text-gray-700">
                  Enviar confirmação por e-mail após cada backup
                </Label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <i className="ri-information-line mr-1"></i>
                  Backups incluem todos os dados do sistema: clientes, processos, documentos e configurações.
                </p>
              </div>
            </div>
          </div>

          {/* Manual Backup */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <i className="ri-download-cloud-line text-indigo-600 mr-2"></i>
                Backup Manual
              </h3>
              <Button
                onClick={handleCreateBackup}
                className="px-4 py-2"
              >
                <i className="ri-download-line mr-2"></i>
                Criar Backup Agora
              </Button>
            </div>
            
            <p className="text-sm text-gray-600">
              Crie um backup imediato de todos os dados do sistema.
            </p>
          </div>

          {/* Backup History */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-history-line text-gray-600 mr-2"></i>
              Histórico de Backups
            </h3>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data / Hora</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupHistory.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-medium">{backup.date}</TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>{backup.source}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {backup.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadBackup(backup.id, backup.date)}
                        >
                          <i className="ri-download-line mr-1"></i>
                          Baixar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
