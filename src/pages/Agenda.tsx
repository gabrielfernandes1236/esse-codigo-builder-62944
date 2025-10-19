import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AgendaModal } from '@/components/AgendaModal';
import { NotificationConfigModal } from '@/components/NotificationConfigModal';
import { CompromissoItem } from '@/components/CompromissoItem';
import { useAgendaData } from '@/hooks/useAgendaData';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import { normalizeDate, isSameDate, isDateInRange } from '@/utils/dateUtils';
import { 
  ChevronRight, 
  Filter, 
  ChevronDown, 
  Plus, 
  ChevronLeft, 
  Edit, 
  Trash2,
  CalendarIcon,
  Bell,
  Settings,
  CheckCircle,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';

export const Agenda = () => {
  const { events, addEvent, updateEvent, deleteEvent, toggleEventComplete, categorizeEvents } = useAgendaData();
  const { config, enviarNotificacao } = useNotifications();
  const { toast } = useToast();
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showCompletedEvents, setShowCompletedEvents] = useState(false);
  const [showOverdueEvents, setShowOverdueEvents] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Filtros
  const [filters, setFilters] = useState({
    audiencias: true,
    reunioes: true,
    prazos: true,
    alta: true,
    media: true,
    baixa: true
  });

  // Categorizar eventos
  const categories = categorizeEvents();
  const { active: activeEvents, completed: completedEvents, overdue: overdueEvents } = categories;

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };
  
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, prevMonth.getDate() - i)
      });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, day)
      });
    }
    
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, day)
      });
    }
    
    return days;
  };

  const hasEvents = (date) => {
    const dateStr = normalizeDate(date);
    return filteredActiveEvents.some(event => {
      const eventDateStr = normalizeDate(event.data);
      return eventDateStr === dateStr;
    });
  };

  // Eventos filtrados (apenas ativos para o calendário)
  const filteredActiveEvents = useMemo(() => {
    return activeEvents.filter(event => {
      const typeMatch = 
        (filters.audiencias && event.tipo === 'audiencia') ||
        (filters.reunioes && event.tipo === 'reuniao') ||
        (filters.prazos && event.tipo === 'prazo');
      
      const priorityMatch = 
        (filters.alta && event.prioridade === 'alta') ||
        (filters.media && event.prioridade === 'media') ||
        (filters.baixa && event.prioridade === 'baixa');
      
      return typeMatch && priorityMatch;
    });
  }, [activeEvents, filters]);

  // Eventos para exibir baseado no modo de visualização e data selecionada - CORREÇÃO FINAL DO BUG
  const eventsToShow = useMemo(() => {
    console.log('📅 AGENDA BUG FIX - Calculando eventos para exibir:', {
      viewMode,
      selectedDate,
      totalActiveEvents: filteredActiveEvents.length
    });
    
    switch (viewMode) {
      case 'day':
        // CORREÇÃO PRINCIPAL: Comparação direta de strings no formato YYYY-MM-DD
        const dayEvents = filteredActiveEvents.filter(event => {
          console.log('📅 AGENDA BUG FIX - Comparando datas:', {
            eventTitle: event.titulo,
            eventDate: event.data,
            selectedDate: selectedDate,
            isMatch: event.data === selectedDate
          });
          
          // Comparação direta sem normalização para evitar problemas de timezone
          return event.data === selectedDate;
        });
        
        console.log('📅 AGENDA BUG FIX - Eventos do dia filtrados:', {
          selectedDate,
          count: dayEvents.length,
          events: dayEvents.map(e => ({ 
            titulo: e.titulo, 
            data: e.data
          }))
        });
        
        return dayEvents;
      
      case 'week':
        const selectedDateObj = new Date(selectedDate + 'T00:00:00');
        const startOfWeek = new Date(selectedDateObj);
        startOfWeek.setDate(selectedDateObj.getDate() - selectedDateObj.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const weekEvents = filteredActiveEvents.filter(event => {
          return isDateInRange(event.data, startOfWeek, endOfWeek);
        });
        console.log('📅 Eventos da semana filtrados:', weekEvents.length);
        return weekEvents;
      
      case 'month':
        const selectedDateForMonth = new Date(selectedDate + 'T00:00:00');
        const selectedMonth = selectedDateForMonth.getMonth();
        const selectedYear = selectedDateForMonth.getFullYear();
        const startOfMonth = new Date(selectedYear, selectedMonth, 1);
        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
        
        const monthEvents = filteredActiveEvents.filter(event => {
          return isDateInRange(event.data, startOfMonth, endOfMonth);
        });
        console.log('📅 Eventos do mês filtrados:', monthEvents.length);
        return monthEvents;
      
      default:
        const defaultEvents = filteredActiveEvents.filter(event => {
          return event.data === selectedDate;
        });
        return defaultEvents;
    }
  }, [filteredActiveEvents, viewMode, selectedDate]);

  const upcomingEvents = useMemo(() => {
    const referenceDateNormalized = normalizeDate(selectedDate);
    
    return activeEvents
      .filter(event => {
        const eventDateNormalized = normalizeDate(event.data);
        return eventDateNormalized >= referenceDateNormalized;
      })
      .sort((a, b) => {
        const dateComparison = new Date(a.data + 'T00:00:00').getTime() - new Date(b.data + 'T00:00:00').getTime();
        if (dateComparison !== 0) return dateComparison;
        
        const timeA = a.hora.split(':').map(Number);
        const timeB = b.hora.split(':').map(Number);
        const timeComparison = (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
        if (timeComparison !== 0) return timeComparison;
        
        const priorityOrder = { 'alta': 3, 'media': 2, 'baixa': 1 };
        return priorityOrder[b.prioridade] - priorityOrder[a.prioridade];
      })
      .slice(0, 4);
  }, [activeEvents, selectedDate]);

  const getDaysUntilEvent = (eventDate) => {
    const referenceDateNormalized = normalizeDate(selectedDate);
    const eventDateNormalized = normalizeDate(eventDate);
    
    const referenceDate = new Date(referenceDateNormalized + 'T00:00:00');
    const event = new Date(eventDateNormalized + 'T00:00:00');
    
    const diffTime = event.getTime() - referenceDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays < 0) return 'Atrasado';
    return `Em ${diffDays} dias`;
  };

  const toggleFilter = () => setShowFilter(!showFilter);
  
  const handleNewEvent = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleDeleteEvent = (eventId) => {
    deleteEvent(eventId);
  };

  const applyFilters = () => {
    setShowFilter(false);
  };

  const getTypeColor = (tipo) => {
    switch (tipo) {
      case 'audiencia': return 'bg-blue-100 text-blue-800';
      case 'reuniao': return 'bg-green-100 text-green-800';
      case 'prazo': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getHeaderText = () => {
    switch (viewMode) {
      case 'day':
        return formatDate(selectedDate);
      case 'week':
        return 'Compromissos da Semana';
      case 'month':
        return 'Compromissos do Mês';
      default:
        return formatDate(selectedDate);
    }
  };

  const getCountText = () => {
    const count = eventsToShow.length;
    const compromisso = count !== 1 ? 'compromissos' : 'compromisso';
    
    switch (viewMode) {
      case 'day':
        return `${count} ${compromisso} hoje`;
      case 'week':
        return `${count} ${compromisso} esta semana`;
      case 'month':
        return `${count} ${compromisso} este mês`;
      default:
        return `${count} ${compromisso}`;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 custom-scrollbar">
          <div className="container mx-auto">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-blue-600">Dashboard</a>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-gray-700 font-medium">Agenda</span>
            </div>
            
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold text-gray-800">Agendas</h1>
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <button 
                    onClick={() => setViewMode('day')}
                    className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${
                      viewMode === 'day' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Dia
                  </button>
                  <button 
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${
                      viewMode === 'week' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Semana
                  </button>
                  <button 
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${
                      viewMode === 'month' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Mês
                  </button>
                </div>
                
                <div className="relative">
                  <button
                    onClick={toggleFilter}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {showFilter && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700">Tipo de Evento</h3>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={filters.audiencias}
                              onChange={(e) => setFilters(prev => ({ ...prev, audiencias: e.target.checked }))}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-sm text-gray-700">Audiências</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={filters.reunioes}
                              onChange={(e) => setFilters(prev => ({ ...prev, reunioes: e.target.checked }))}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-sm text-gray-700">Reuniões</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={filters.prazos}
                              onChange={(e) => setFilters(prev => ({ ...prev, prazos: e.target.checked }))}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-sm text-gray-700">Prazos</span>
                          </label>
                        </div>
                      </div>
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700">Prioridade</h3>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={filters.alta}
                              onChange={(e) => setFilters(prev => ({ ...prev, alta: e.target.checked }))}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-sm text-gray-700">Alta</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={filters.media}
                              onChange={(e) => setFilters(prev => ({ ...prev, media: e.target.checked }))}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-sm text-gray-700">Média</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={filters.baixa}
                              onChange={(e) => setFilters(prev => ({ ...prev, baixa: e.target.checked }))}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-sm text-gray-700">Baixa</span>
                          </label>
                        </div>
                      </div>
                      <div className="p-3">
                        <button 
                          onClick={applyFilters}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
                        >
                          Aplicar Filtros
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleNewEvent}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2 inline-block" />
                  Novo Compromisso
                </button>
              </div>
            </div>
            
            <div className="flex overflow-hidden bg-white rounded-lg shadow-lg h-[600px] border border-gray-200">
              <div className="w-2/3 flex flex-col overflow-hidden border-r border-gray-200 bg-white shadow-inner">
                <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => navigateMonth('prev')}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-lg font-medium text-gray-800">
                      {new Date(currentYear, currentMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button 
                      onClick={() => navigateMonth('next')}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 bg-gradient-to-b from-white to-gray-50 p-4 overflow-hidden shadow-inner">
                  <div className="grid grid-cols-7 mb-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                      <div key={day} className="text-sm font-medium text-gray-500 text-center py-2">{day}</div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 h-80 p-2 bg-white rounded-lg shadow-inner border border-gray-100">
                    {getDaysInMonth().map((dayInfo, index) => {
                      const isToday = dayInfo.date.toDateString() === new Date().toDateString();
                      // CORREÇÃO FINAL: Gerar data no formato YYYY-MM-DD sem timezone
                      const dayDateString = `${dayInfo.date.getFullYear()}-${String(dayInfo.date.getMonth() + 1).padStart(2, '0')}-${String(dayInfo.date.getDate()).padStart(2, '0')}`;
                      const isSelected = dayDateString === selectedDate;
                      const hasEventsDay = hasEvents(dayInfo.date);
                      
                      return (
                        <div 
                          key={index}
                          onClick={() => {
                            console.log('📅 AGENDA BUG FIX - Clicando no dia:', {
                              dayInfo: dayInfo.day,
                              date: dayInfo.date,
                              dayDateString,
                              currentSelected: selectedDate,
                              willUpdate: dayDateString !== selectedDate
                            });
                            setSelectedDate(dayDateString);
                            setViewMode('day');
                          }}
                          className={`relative flex items-center justify-center text-sm cursor-pointer hover:bg-gray-50 hover:shadow-sm rounded transition-all ${
                            !dayInfo.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'
                          } ${
                            isToday ? 'bg-blue-100 text-blue-600 font-semibold shadow-sm' : ''
                          } ${
                            isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''
                          }`}
                        >
                          {dayInfo.day}
                          {hasEventsDay && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full shadow-sm"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Events Section */}
              <div className="w-1/3 flex flex-col overflow-hidden h-full bg-white shadow-inner">
                <div className="p-4 bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
                  <h2 className="text-lg font-medium text-gray-800">
                    {getHeaderText()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {getCountText()}
                  </p>
                </div>
                
                {/* Events List */}
                <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100 space-y-3 shadow-inner">
                  {eventsToShow.map((event) => (
                    <CompromissoItem
                      key={event.id}
                      event={event}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                      onToggleComplete={toggleEventComplete}
                      showActions={true}
                      compact={false}
                    />
                  ))}
                  
                  {eventsToShow.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Nenhum compromisso encontrado</p>
                    </div>
                  )}
                </div>

                {/* Seção de Compromissos Atrasados */}
                {overdueEvents.length > 0 && (
                  <div className="bg-red-50 border-t border-red-200 shadow-sm">
                    <button
                      onClick={() => setShowOverdueEvents(!showOverdueEvents)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-red-100"
                    >
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-sm font-medium text-red-700">
                          Compromissos Atrasados ({overdueEvents.length})
                        </span>
                      </div>
                      {showOverdueEvents ? (
                        <ChevronUp className="w-4 h-4 text-red-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-red-500" />
                      )}
                    </button>
                    
                    {showOverdueEvents && (
                      <div className="px-4 pb-4 space-y-2">
                        {overdueEvents.map((event) => (
                          <CompromissoItem
                            key={event.id}
                            event={event}
                            onEdit={handleEditEvent}
                            onDelete={handleDeleteEvent}
                            onToggleComplete={toggleEventComplete}
                            showActions={true}
                            compact={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Seção de Compromissos Concluídos */}
                {completedEvents.length > 0 && (
                  <div className="bg-white border-t border-gray-200 shadow-sm">
                    <button
                      onClick={() => setShowCompletedEvents(!showCompletedEvents)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                          Compromissos Concluídos ({completedEvents.length})
                        </span>
                      </div>
                      {showCompletedEvents ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    
                    {showCompletedEvents && (
                      <div className="px-4 pb-4 space-y-2">
                        {completedEvents.map((event) => (
                          <CompromissoItem
                            key={event.id}
                            event={event}
                            onEdit={handleEditEvent}
                            onDelete={handleDeleteEvent}
                            onToggleComplete={toggleEventComplete}
                            showActions={true}
                            compact={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Seção de Próximos Compromissos */}
                <div className="bg-white border-t border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Próximos Compromissos</h3>
                    <button 
                      onClick={() => setShowNotificationModal(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Settings className="w-3 h-3" />
                      Configurar lembretes
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center p-2 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0 ${
                            event.tipo === 'audiencia' ? 'bg-blue-100 text-blue-600' : 
                            event.tipo === 'reuniao' ? 'bg-green-100 text-green-500' : 'bg-orange-100 text-orange-500'
                          }`}>
                            <CalendarIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 truncate">{event.titulo}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>
                                {new Date(event.data + 'T00:00:00').toLocaleDateString('pt-BR')}, {event.hora}
                              </span>
                              <span className={`px-1 py-0.5 rounded text-xs ${
                                getDaysUntilEvent(event.data) === 'Hoje' || getDaysUntilEvent(event.data) === 'Amanhã' 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {getDaysUntilEvent(event.data)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {upcomingEvents.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-xs">Nenhum compromisso próximo</p>
                      </div>
                    )}
                  </div>
                  
                  {(config.email || config.whatsapp) && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center text-gray-600">
                          <Bell className="w-3 h-3 mr-1" />
                          <span>Lembretes configurados:</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {config.email && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                              Email
                            </span>
                          )}
                          {config.whatsapp && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                              WhatsApp
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AgendaModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={addEvent}
        onUpdate={updateEvent}
        editingEvent={editingEvent}
      />

      <NotificationConfigModal 
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </div>
  );
};
