
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ReportSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
}

export const ReportScheduler: React.FC<ReportSchedulerProps> = ({ 
  isOpen, 
  onClose, 
  reportType 
}) => {
  const [frequency, setFrequency] = useState('monthly');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [email, setEmail] = useState('');

  const handleSchedule = () => {
    // Simular agendamento - apenas salvar visualmente por enquanto
    console.log(`Relatório ${reportType} agendado para todo dia ${dayOfMonth} do mês`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Relatório</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relatório</label>
            <input 
              type="text" 
              value={reportType} 
              readOnly 
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
            <select 
              value={frequency} 
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="monthly">Mensal</option>
              <option value="weekly">Semanal</option>
              <option value="quarterly">Trimestral</option>
            </select>
          </div>

          {frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dia do Mês</label>
              <select 
                value={dayOfMonth} 
                onChange={(e) => setDayOfMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day.toString()}>{day}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email de Destino</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start">
              <div className="w-5 h-5 text-blue-500 mr-2 mt-0.5">
                <i className="ri-information-line"></i>
              </div>
              <div>
                <p className="text-sm text-blue-900 font-medium">Funcionalidade em Desenvolvimento</p>
                <p className="text-xs text-blue-700 mt-1">
                  O agendamento será salvo, mas o envio automático por email será implementado em breve.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSchedule}>Agendar Relatório</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
