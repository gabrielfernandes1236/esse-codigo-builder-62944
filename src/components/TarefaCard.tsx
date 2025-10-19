
import React, { useState } from 'react';
import { Check, RefreshCw, MoreVertical, Clock, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface Tarefa {
  id: string;
  nome: string;
  descricao: string;
  urgencia: 'normal' | 'moderada' | 'urgente';
  status: 'pendente' | 'concluida';
  dataCriacao: string;
  dataConclusao?: string;
}

interface TarefaCardProps {
  tarefa: Tarefa;
  onConcluir?: (id: string) => void;
  onReabrir?: (id: string) => void;
  onEdit?: (tarefa: Tarefa) => void;
}

export const TarefaCard = ({ tarefa, onConcluir, onReabrir, onEdit }: TarefaCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const getUrgenciaStyle = (urgencia: string) => {
    switch (urgencia) {
      case 'urgente':
        return 'bg-red-100 text-red-800';
      case 'moderada':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getUrgenciaLabel = (urgencia: string) => {
    switch (urgencia) {
      case 'urgente':
        return 'Urgente';
      case 'moderada':
        return 'Moderada';
      default:
        return 'Normal';
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-md shadow-sm p-4 ${tarefa.status === 'concluida' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h3 className={`font-medium ${tarefa.status === 'concluida' ? 'text-gray-700' : 'text-gray-900'}`}>
              {tarefa.nome}
            </h3>
            <Badge className={`ml-3 text-xs px-2 py-0.5 rounded-full ${getUrgenciaStyle(tarefa.urgencia)}`}>
              {getUrgenciaLabel(tarefa.urgencia)}
            </Badge>
          </div>
          <p className={`text-sm ${tarefa.status === 'concluida' ? 'text-gray-500' : 'text-gray-600'}`}>
            {tarefa.descricao}
          </p>
        </div>
        <div className="relative">
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <button
                onClick={() => {
                  onEdit?.(tarefa);
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>
            {tarefa.status === 'concluida' 
              ? `Concluída em ${tarefa.dataConclusao}`
              : `Criado em ${tarefa.dataCriacao}`
            }
          </span>
        </div>
        {tarefa.status === 'pendente' ? (
          <Button
            onClick={() => onConcluir?.(tarefa.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md"
            size="sm"
          >
            <Check className="w-4 h-4 mr-1" />
            Concluir
          </Button>
        ) : (
          <Button
            onClick={() => onReabrir?.(tarefa.id)}
            variant="outline"
            className="px-3 py-1 text-sm"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Reabrir
          </Button>
        )}
      </div>
    </div>
  );
};
