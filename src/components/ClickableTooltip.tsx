
import { useState } from "react";

interface ClickableTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  onColumnClick: (status: string, count: number) => void;
}

export const ClickableTooltip = ({ 
  active, 
  payload, 
  label, 
  onColumnClick 
}: ClickableTooltipProps) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!active || !payload?.length) {
    return null;
  }

  const handleClick = (statusLabel: string, value: number) => {
    // Mapear o label de volta para a chave do status
    const statusLabelToKey: Record<string, string> = {
      'Em Andamento': 'em_andamento',
      'Suspenso': 'suspenso',
      'Arquivado': 'arquivado',
      'Concluído': 'concluido',
      'Ocultos': 'ocultos',
      'Removidos': 'removidos'
    };

    const statusKey = statusLabelToKey[statusLabel];
    console.log(`🎯 Clique no tooltip: ${statusLabel} -> ${statusKey} (${value} processos)`);
    
    if (statusKey) {
      onColumnClick(statusKey, value);
    }
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-2">
        {payload.map((item, index) => {
          const statusLabel = label || item.payload?.status || 'Processo';

          return (
            <div
              key={index}
              className="flex items-center justify-between space-x-2 min-w-[120px] p-1 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => handleClick(statusLabel, item.value)}
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.color || item.payload?.fill }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {statusLabel}:
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
      {isHovered && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Clique para ver detalhes
          </p>
        </div>
      )}
    </div>
  );
};
