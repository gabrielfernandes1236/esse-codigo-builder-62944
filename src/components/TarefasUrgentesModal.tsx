
import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TarefasUrgentesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarefasUrgentes: any[];
  tarefasPendentes: any[];
  onConcluir: (id: string) => void;
}

export const TarefasUrgentesModal = ({ 
  isOpen, 
  onClose, 
  tarefasUrgentes, 
  tarefasPendentes, 
  onConcluir 
}: TarefasUrgentesModalProps) => {
  const [showAllTasks, setShowAllTasks] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConcluir = (id: string) => {
    onConcluir(id);
    // Check if this was the last urgent task and we're showing only urgent tasks
    if (!showAllTasks && tarefasUrgentes.length === 1) {
      onClose();
    }
  };

  const tarefasToShow = showAllTasks ? tarefasPendentes : tarefasUrgentes;
  const modalTitle = showAllTasks ? "Todas as Tarefas Pendentes" : "Tarefas Urgentes Pendentes";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            <h3 className="text-lg font-medium">{modalTitle}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {tarefasToShow.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">
                {showAllTasks ? "Nenhuma tarefa pendente!" : "Nenhuma tarefa urgente pendente!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tarefasToShow.map((tarefa) => (
                <div key={tarefa.id} className={`border rounded-md p-4 ${
                  tarefa.urgencia === 'urgente' ? 'bg-red-50 border-red-200' :
                  tarefa.urgencia === 'moderada' ? 'bg-orange-50 border-orange-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="font-medium text-gray-900">{tarefa.nome}</h4>
                        <Badge className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          tarefa.urgencia === 'urgente' ? 'bg-red-100 text-red-800' :
                          tarefa.urgencia === 'moderada' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {tarefa.urgencia === 'urgente' ? 'Urgente' :
                           tarefa.urgencia === 'moderada' ? 'Moderada' : 'Normal'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{tarefa.descricao}</p>
                      <p className="text-xs text-gray-500">Criado em {tarefa.dataCriacao}</p>
                    </div>
                    <Button
                      onClick={() => handleConcluir(tarefa.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 ml-4"
                      size="sm"
                    >
                      Concluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center p-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            {showAllTasks ? "Ver apenas urgentes" : "Ver todas as tarefas"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};
