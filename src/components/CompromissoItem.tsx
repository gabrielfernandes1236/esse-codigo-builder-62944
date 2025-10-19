
import React from 'react';
import { Clock, MapPin, User, Edit, Trash2, CheckCircle, AlertTriangle, Bell, MessageSquare } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { AgendaEvent } from '@/hooks/useAgendaData';

interface CompromissoItemProps {
  event: AgendaEvent;
  onEdit?: (event: AgendaEvent) => void;
  onDelete?: (eventId: string) => void;
  onToggleComplete?: (eventId: string, completed: boolean) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const CompromissoItem = ({ 
  event, 
  onEdit, 
  onDelete, 
  onToggleComplete, 
  showActions = true,
  compact = false 
}: CompromissoItemProps) => {
  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'audiencia': return 'bg-blue-100 text-blue-800';
      case 'reuniao': return 'bg-green-100 text-green-800';
      case 'prazo': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBorderColor = (tipo: string) => {
    switch (tipo) {
      case 'audiencia': return 'border-blue-600';
      case 'reuniao': return 'border-green-500';
      case 'prazo': return 'border-orange-500';
      default: return 'border-gray-400';
    }
  };

  // CORREÇÃO: Função para formatar data sem conversão de timezone
  const formatDate = (dateStr: string) => {
    console.log('🔧 COMPROMISSO ITEM - Formatando data:', dateStr);
    
    // Se a data já está no formato YYYY-MM-DD, processar diretamente
    if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      console.log('🔧 COMPROMISSO ITEM - Data processada:', { year, month, day });
      
      // Criar data sem timezone usando os componentes diretamente
      const date = new Date(year, month - 1, day);
      const formatted = date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      
      console.log('🔧 COMPROMISSO ITEM - Data formatada:', formatted);
      return formatted;
    }
    
    // Fallback para outros formatos (não deveria acontecer)
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  // CORREÇÃO: Função para formatar data completa sem conversão de timezone
  const formatFullDate = (dateStr: string) => {
    console.log('🔧 COMPROMISSO ITEM - Formatando data completa:', dateStr);
    
    // Se a data já está no formato YYYY-MM-DD, processar diretamente
    if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      
      // Criar data sem timezone usando os componentes diretamente
      const date = new Date(year, month - 1, day);
      const formatted = date.toLocaleDateString('pt-BR');
      
      console.log('🔧 COMPROMISSO ITEM - Data completa formatada:', formatted);
      return formatted;
    }
    
    // Fallback para outros formatos (não deveria acontecer)
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const handleCompleteChange = (checked: boolean) => {
    if (onToggleComplete) {
      onToggleComplete(event.id, checked);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 hover:shadow-lg transition-shadow ${getBorderColor(event.tipo)} ${
      event.concluido ? 'opacity-75' : ''
    }`}>
      <div className={compact ? 'p-3' : 'p-4'}>
        {/* Header com checkbox e título */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            {onToggleComplete && (
              <div className="flex-shrink-0 mt-1">
                <Checkbox
                  checked={event.concluido || false}
                  onCheckedChange={handleCompleteChange}
                  className="w-5 h-5"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(event.tipo)}`}>
                  {event.tipo === 'audiencia' ? 'Audiência' : 
                   event.tipo === 'reuniao' ? 'Reunião' : 'Prazo'}
                </span>
                {event.prioridade === 'alta' && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    Alta Prioridade
                  </span>
                )}
                {event.enviarLembrete && (
                  <div className="relative group">
                    <Bell className="w-4 h-4 text-green-500" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Lembrete ativado - Integrado com WhatsApp Avisos
                    </div>
                  </div>
                )}
                {event.concluido && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              
              <h3 className={`${compact ? 'text-sm' : 'text-base'} font-medium text-gray-800 mb-1 ${
                event.concluido ? 'line-through text-gray-500' : ''
              }`}>
                {event.titulo}
              </h3>
              
              {event.processo && (
                <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 mb-3`}>
                  Processo nº {event.processo}
                </p>
              )}
              
              <div className={`space-y-1 ${compact ? 'text-xs' : 'text-sm'} text-gray-500`}>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    {compact ? formatDate(event.data) : formatFullDate(event.data)} - {event.hora}
                  </span>
                </div>
                
                {event.local && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.local}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>Cliente: {event.cliente}</span>
                </div>
              </div>
            </div>
          </div>
          
          {showActions && (
            <div className="flex space-x-1 flex-shrink-0">
              {onEdit && (
                <button 
                  onClick={() => onEdit(event)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={() => onDelete(event.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Indicador de integração WhatsApp */}
        {event.enviarLembrete && event.clienteData && !compact && (
          <div className="mt-2 px-2 py-1 bg-green-50 border border-green-200 rounded text-xs">
            <div className="flex items-center text-green-700">
              <MessageSquare className="w-3 h-3 mr-1" />
              <span className="font-medium">Integrado com WhatsApp Avisos</span>
            </div>
            <div className="text-green-600 mt-0.5">
              Cliente será notificado automaticamente
            </div>
          </div>
        )}
        
        {/* Barra de progresso para prazos */}
        {event.tipo === 'prazo' && !event.concluido && !compact && (
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};
