
import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { ImportantDeadlinesDetailed } from "./ImportantDeadlinesDetailed";
import { CompromissoItem } from "./CompromissoItem";
import { useAgendaData } from "@/hooks/useAgendaData";
import { useNavigate } from "react-router-dom";
import { normalizeDate, isDateInRange } from "@/utils/dateUtils";

export const ImportantDeadlines = () => {
  const [showDetailed, setShowDetailed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOverdue, setShowOverdue] = useState(false);
  const { events, isLoaded, toggleEventComplete } = useAgendaData();
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Prazos Importantes</h3>
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // Filtrar apenas compromissos do tipo 'prazos'
  const prazosImportantesEvents = events.filter(event => event.tipoCompromisso === 'prazos');
  console.log('🔍 Prazos Importantes Events:', prazosImportantesEvents);

  // Função para verificar se um evento passou do horário
  const isEventOverdue = (eventDate: string, eventTime: string) => {
    const now = new Date();
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    console.log('⏰ Verificando se está atrasado:', {
      eventDate,
      eventTime,
      eventDateTime: eventDateTime.toISOString(),
      now: now.toISOString(),
      isOverdue: now > eventDateTime
    });
    return now > eventDateTime;
  };

  // Categorizar eventos
  const categories = {
    active: prazosImportantesEvents.filter(event => !event.concluido && !isEventOverdue(event.data, event.hora)),
    completed: prazosImportantesEvents.filter(event => event.concluido),
    overdue: prazosImportantesEvents.filter(event => !event.concluido && isEventOverdue(event.data, event.hora))
  };

  console.log('📊 Categorias de Prazos:', {
    total: prazosImportantesEvents.length,
    active: categories.active.length,
    completed: categories.completed.length,
    overdue: categories.overdue.length,
    overdueEvents: categories.overdue
  });

  // Ordenar por data de criação (mais recentes primeiro)
  const sortByCreationDate = (eventsList: any[]) => {
    return eventsList.sort((a, b) => {
      const dateA = new Date(a.dataCriacao || a.data);
      const dateB = new Date(b.dataCriacao || b.data);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const sortedActiveDeadlines = sortByCreationDate([...categories.active]);
  const sortedOverdueDeadlines = sortByCreationDate([...categories.overdue]);

  console.log('🚨 Prazos atrasados ordenados:', sortedOverdueDeadlines);

  // Função para obter prazos dos próximos 2 dias - CORRIGIDA
  const getDeadlinesNextTwoDays = () => {
    const today = new Date();
    const todayNormalized = normalizeDate(today);
    const twoDaysFromToday = new Date(today);
    twoDaysFromToday.setDate(today.getDate() + 2);
    const twoDaysNormalized = normalizeDate(twoDaysFromToday);
    
    console.log('📅 Filtro próximos 2 dias:', {
      todayNormalized,
      twoDaysNormalized,
      totalActiveDeadlines: sortedActiveDeadlines.length
    });
    
    return sortedActiveDeadlines.filter(event => {
      const eventDateNormalized = normalizeDate(event.data);
      const isInRange = eventDateNormalized >= todayNormalized && eventDateNormalized <= twoDaysNormalized;
      
      console.log('📅 Evento:', {
        titulo: event.titulo,
        eventDate: event.data,
        eventDateNormalized,
        isInRange
      });
      
      return isInRange;
    });
  };

  const nextTwoDaysDeadlines = getDeadlinesNextTwoDays();
  const prazosImportantes = isExpanded ? nextTwoDaysDeadlines : sortedActiveDeadlines.slice(0, 4);

  const handleVerTodos = () => {
    navigate('/agenda');
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (showDetailed) {
    return (
      <div>
        <button 
          onClick={() => setShowDetailed(false)}
          className="mb-4 text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Voltar ao resumo
        </button>
        <ImportantDeadlinesDetailed />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Prazos Importantes</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleExpand}
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Recolher
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Expandir
              </>
            )}
          </button>
          {isExpanded && (
            <button 
              onClick={handleVerTodos}
              className="text-sm text-blue-600 hover:underline"
            >
              Ver todos compromissos
            </button>
          )}
        </div>
      </div>
      
      {/* Seção de Prazos Atrasados */}
      {sortedOverdueDeadlines.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg">
          <button
            onClick={() => setShowOverdue(!showOverdue)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-red-100 rounded-lg"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-sm font-medium text-red-700">
                Prazos Atrasados ({sortedOverdueDeadlines.length})
              </span>
            </div>
            {showOverdue ? (
              <ChevronUp className="w-4 h-4 text-red-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-red-500" />
            )}
          </button>
          
          {showOverdue && (
            <div className="px-4 pb-4 space-y-2">
              {sortedOverdueDeadlines.map((event) => (
                <CompromissoItem
                  key={event.id}
                  event={event}
                  onToggleComplete={toggleEventComplete}
                  showActions={false}
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Seção de Prazos Importantes */}
      <div className="space-y-3">
        {prazosImportantes.length > 0 ? (
          prazosImportantes.map((event) => (
            <CompromissoItem
              key={event.id}
              event={event}
              onToggleComplete={toggleEventComplete}
              showActions={false}
              compact={false}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Nenhum prazo importante próximo</p>
          </div>
        )}
      </div>
      
      {!isExpanded && sortedActiveDeadlines.length > 4 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {sortedActiveDeadlines.length - 4} prazos adicionais disponíveis
          </p>
        </div>
      )}
    </div>
  );
};
