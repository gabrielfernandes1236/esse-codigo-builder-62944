
import React from 'react';

interface FluxoCaixaControlsProps {
  cashFlowFilter: 'hoje' | 'semana' | 'mes';
  setCashFlowFilter: (filter: 'hoje' | 'semana' | 'mes') => void;
  sortBy: 'data' | 'valor';
  setSortBy: (sort: 'data' | 'valor') => void;
  groupBy: 'none' | 'tipo' | 'categoria';
  setGroupBy: (group: 'none' | 'tipo' | 'categoria') => void;
}

export const FluxoCaixaControls: React.FC<FluxoCaixaControlsProps> = ({
  cashFlowFilter,
  setCashFlowFilter,
  sortBy,
  setSortBy,
  groupBy,
  setGroupBy
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-700">Fluxo de Caixa</h3>
      <div className="flex items-center space-x-2">
        <div className="flex bg-gray-100 rounded-full p-1">
          <button 
            onClick={() => setCashFlowFilter('hoje')}
            className={`px-3 py-1 text-xs rounded-full ${cashFlowFilter === 'hoje' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            Hoje
          </button>
          <button 
            onClick={() => setCashFlowFilter('semana')}
            className={`px-3 py-1 text-xs rounded-full ${cashFlowFilter === 'semana' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => setCashFlowFilter('mes')}
            className={`px-3 py-1 text-xs rounded-full ${cashFlowFilter === 'mes' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            Mês
          </button>
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'data' | 'valor')}
            className="px-2 py-1 border border-gray-200 rounded text-xs bg-white"
          >
            <option value="data">Por Data</option>
            <option value="valor">Por Valor</option>
          </select>
          
          <select 
            value={groupBy} 
            onChange={(e) => setGroupBy(e.target.value as 'none' | 'tipo' | 'categoria')}
            className="px-2 py-1 border border-gray-200 rounded text-xs bg-white"
          >
            <option value="none">Sem Agrupamento</option>
            <option value="tipo">Por Tipo</option>
            <option value="categoria">Por Categoria</option>
          </select>
        </div>
      </div>
    </div>
  );
};
