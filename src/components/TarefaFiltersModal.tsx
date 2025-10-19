
import React from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TarefaFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filtros: {
    urgente: boolean;
    moderada: boolean;
    normal: boolean;
  };
  onFiltroChange: (filtro: 'urgente' | 'moderada' | 'normal') => void;
}

export const TarefaFiltersModal = ({ isOpen, onClose, filtros, onFiltroChange }: TarefaFiltersModalProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-gray-600" />
            <h3 className="text-lg font-medium">Filtrar Tarefas</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Filtrar por urgência</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filtros.urgente}
                    onChange={() => onFiltroChange('urgente')}
                    className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Urgente
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filtros.moderada}
                    onChange={() => onFiltroChange('moderada')}
                    className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                    Moderada
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filtros.normal}
                    onChange={() => onFiltroChange('normal')}
                    className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Normal
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
