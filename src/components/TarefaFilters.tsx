
import React from 'react';
import { Filter } from 'lucide-react';

interface TarefaFiltersProps {
  filtros: {
    urgente: boolean;
    moderada: boolean;
    normal: boolean;
  };
  onFiltroChange: (filtro: 'urgente' | 'moderada' | 'normal') => void;
}

export const TarefaFilters = ({ filtros, onFiltroChange }: TarefaFiltersProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
      <div className="flex items-center mb-3">
        <Filter className="w-4 h-4 mr-2 text-gray-600" />
        <h3 className="text-sm font-medium text-gray-700">Filtrar por urgência</h3>
      </div>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filtros.urgente}
            onChange={() => onFiltroChange('urgente')}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Urgente</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filtros.moderada}
            onChange={() => onFiltroChange('moderada')}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Moderada</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filtros.normal}
            onChange={() => onFiltroChange('normal')}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Normal</span>
        </label>
      </div>
    </div>
  );
};
