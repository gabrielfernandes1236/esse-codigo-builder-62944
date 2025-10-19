import { useState, useEffect } from 'react';

export interface AgendaEvent {
  id: string;
  titulo: string;
  tipo: 'audiencia' | 'reuniao' | 'prazo';
  data: string;
  hora: string;
  local?: string;
  cliente: string;
  processo?: string;
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'confirmado' | 'pendente' | 'cancelado';
  descricao?: string;
  tipoCompromisso: 'proximos' | 'prazos';
  enviarLembrete: boolean;
  dataCriacao?: string;
  // Campos para conclusão
  concluido?: boolean;
  dataConclusao?: string;
  // Campos para notificações
  notificacaoEnviada?: boolean;
  dataNotificacao?: string;
  ultimaNotificacao?: string;
  // Campos para integração com clientes
  clienteData?: {
    id: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    name: string;
  };
}

const STORAGE_KEY = 'agenda_events';
const CLIENTS_STORAGE_KEY = 'clients_data';

const defaultEvents: AgendaEvent[] = [
  {
    id: '1',
    titulo: 'Audiência de Conciliação',
    tipo: 'audiencia',
    data: '2025-06-25',
    hora: '09:30',
    local: 'Fórum Central - Sala 305',
    cliente: 'Marcos Ribeiro',
    processo: '0123456-78.2023-9.26.0100',
    prioridade: 'alta',
    status: 'confirmado',
    descricao: 'Audiência de conciliação para tentativa de acordo',
    tipoCompromisso: 'proximos',
    enviarLembrete: false,
    dataCriacao: '2025-06-24T10:00:00',
    concluido: false
  },
  {
    id: '2',
    titulo: 'Reunião com Cliente',
    tipo: 'reuniao',
    data: '2025-06-26',
    hora: '14:00',
    local: 'Escritório - Sala de Reuniões',
    cliente: 'Carolina Santos',
    prioridade: 'media',
    status: 'confirmado',
    descricao: 'Discussão sobre estratégia processual',
    tipoCompromisso: 'proximos',
    enviarLembrete: true,
    dataCriacao: '2025-06-24T11:00:00',
    concluido: false
  },
  {
    id: '3',
    titulo: 'Entrega de Documentos',
    tipo: 'prazo',
    data: '2025-06-27',
    hora: '18:00',
    cliente: 'Tech Innovations Ltda.',
    processo: '0987654-32.2023-8.26.0100',
    prioridade: 'alta',
    status: 'pendente',
    descricao: 'Prazo para entrega de documentos contratuais',
    tipoCompromisso: 'prazos',
    enviarLembrete: true,
    dataCriacao: '2025-06-24T09:00:00',
    concluido: false
  },
  {
    id: '4',
    titulo: 'Audiência de Instrução',
    tipo: 'audiencia',
    data: '2025-06-28',
    hora: '09:00',
    local: 'Fórum Central - Sala 201',
    cliente: 'Ana Beatriz Mendes',
    processo: '0123456-78.2023-8.26.0100',
    prioridade: 'alta',
    status: 'confirmado',
    tipoCompromisso: 'proximos',
    enviarLembrete: false,
    dataCriacao: '2025-06-24T12:00:00',
    concluido: false
  },
  {
    id: '5',
    titulo: 'Contestação - Processo Trabalhista',
    tipo: 'prazo',
    data: '2025-07-02',
    hora: '17:00',
    cliente: 'João Silva',
    processo: '1234567-89.2023-5.02.0001',
    prioridade: 'alta',
    status: 'pendente',
    descricao: 'Prazo final para contestação',
    tipoCompromisso: 'prazos',
    enviarLembrete: true,
    dataCriacao: '2025-06-24T08:00:00',
    concluido: false
  },
  {
    id: '6',
    titulo: 'Recurso Especial - PRAZO VENCIDO',
    tipo: 'prazo',
    data: '2025-06-24',
    hora: '15:00',
    cliente: 'Maria Santos',
    processo: '9876543-21.2023-8.26.0100',
    prioridade: 'alta',
    status: 'pendente',
    descricao: 'Prazo para interposição de recurso especial - ATRASADO',
    tipoCompromisso: 'prazos',
    enviarLembrete: true,
    dataCriacao: '2025-06-20T08:00:00',
    concluido: false
  },
  {
    id: '7',
    titulo: 'Petição Inicial - PRAZO VENCIDO',
    tipo: 'prazo',
    data: '2025-06-25',
    hora: '10:00',
    cliente: 'Carlos Oliveira',
    processo: '5555666-77.2023-8.26.0100',
    prioridade: 'alta',
    status: 'pendente',
    descricao: 'Prazo para protocolar petição inicial - ATRASADO',
    tipoCompromisso: 'prazos',
    enviarLembrete: true,
    dataCriacao: '2025-06-22T09:00:00',
    concluido: false
  },
  {
    id: '8',
    titulo: 'Reunião Perdida - Compromisso Atrasado',
    tipo: 'reuniao',
    data: '2025-06-25',
    hora: '08:00',
    cliente: 'Pedro Silva',
    prioridade: 'media',
    status: 'pendente',
    descricao: 'Reunião que passou do horário',
    tipoCompromisso: 'proximos',
    enviarLembrete: false,
    dataCriacao: '2025-06-23T08:00:00',
    concluido: false
  }
];

export const useAgendaData = () => {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Função para verificar se um evento passou do horário
  const isEventOverdue = (eventDate: string, eventTime: string) => {
    const now = new Date();
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    return now > eventDateTime;
  };

  // Função para buscar dados do cliente
  const getClientData = (clienteName: string) => {
    try {
      const clientsData = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (clientsData) {
        const clients = JSON.parse(clientsData);
        const client = clients.find((c: any) => 
          c.name.toLowerCase() === clienteName.toLowerCase() && !c.hidden
        );
        
        if (client) {
          console.log('📞 Cliente encontrado para integração WhatsApp:', {
            name: client.name,
            email: client.email,
            phone: client.phone,
            whatsapp: client.whatsapp || client.phone
          });
          
          return {
            id: client.id,
            email: client.email,
            phone: client.phone,
            whatsapp: client.whatsapp || client.phone,
            name: client.name
          };
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do cliente:', error);
    }
    return null;
  };

  // Função para enriquecer eventos com dados dos clientes
  const enrichEventsWithClientData = (eventsList: AgendaEvent[]) => {
    return eventsList.map(event => {
      const clientData = getClientData(event.cliente);
      return {
        ...event,
        clienteData: clientData
      };
    });
  };

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadEvents = () => {
      try {
        console.log('Carregando eventos do localStorage...');
        const savedEvents = localStorage.getItem(STORAGE_KEY);
        
        if (savedEvents && savedEvents !== 'null' && savedEvents !== 'undefined') {
          const parsedEvents = JSON.parse(savedEvents);
          console.log('Eventos encontrados no localStorage:', parsedEvents);
          
          // Migrar eventos antigos para incluir campos de conclusão se necessário
          const migratedEvents = parsedEvents.map((event: any) => ({
            ...event,
            enviarLembrete: event.enviarLembrete !== undefined ? event.enviarLembrete : false,
            notificacaoEnviada: event.notificacaoEnviada || false,
            concluido: event.concluido !== undefined ? event.concluido : false,
            dataConclusao: event.dataConclusao || null
          }));
          
          // Enriquecer com dados dos clientes
          const enrichedEvents = enrichEventsWithClientData(migratedEvents);
          setEvents(enrichedEvents);
        } else {
          console.log('Nenhum evento encontrado, carregando eventos padrão');
          const enrichedDefaultEvents = enrichEventsWithClientData(defaultEvents);
          setEvents(enrichedDefaultEvents);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEvents));
        }
      } catch (error) {
        console.error('Erro ao carregar eventos do localStorage:', error);
        const enrichedDefaultEvents = enrichEventsWithClientData(defaultEvents);
        setEvents(enrichedDefaultEvents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEvents));
      } finally {
        setIsLoaded(true);
      }
    };

    loadEvents();
  }, []);

  // Salvar no localStorage sempre que os eventos mudarem
  useEffect(() => {
    if (isLoaded && events.length >= 0) {
      console.log('Salvando eventos no localStorage:', events.length, events);
      // Remover clienteData antes de salvar (será recarregado dinamicamente)
      const eventsToSave = events.map(({ clienteData, ...event }) => event);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsToSave));
    }
  }, [events, isLoaded]);

  const addEvent = (event: Omit<AgendaEvent, 'id' | 'dataCriacao'>) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      enviarLembrete: event.enviarLembrete || false,
      concluido: false
    };
    
    // Enriquecer com dados do cliente
    const clientData = getClientData(newEvent.cliente);
    const enrichedEvent = { ...newEvent, clienteData: clientData };
    
    console.log('Adicionando novo evento com integração WhatsApp:', enrichedEvent);
    
    if (enrichedEvent.enviarLembrete && clientData) {
      console.log('🔔 Ativando notificação WhatsApp para tipo:', enrichedEvent.tipoCompromisso);
      notifyWhatsAppSystem(enrichedEvent);
    }
    
    setEvents(prev => {
      const updatedEvents = [...prev, enrichedEvent];
      console.log('Lista de eventos atualizada:', updatedEvents);
      return updatedEvents;
    });
  };

  const updateEvent = (id: string, event: Partial<AgendaEvent>) => {
    console.log('Atualizando evento:', id, event);
    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        const updatedEvent = { ...e, ...event };
        // Re-enriquecer com dados do cliente se necessário
        if (event.cliente) {
          const clientData = getClientData(updatedEvent.cliente);
          updatedEvent.clienteData = clientData;
        }
        
        if (updatedEvent.enviarLembrete && updatedEvent.clienteData && 
            (event.enviarLembrete !== undefined || event.tipoCompromisso)) {
          console.log('🔔 Reativando notificação WhatsApp para evento atualizado:', updatedEvent.tipoCompromisso);
          notifyWhatsAppSystem(updatedEvent);
        }
        
        return updatedEvent;
      }
      return e;
    }));
  };

  const deleteEvent = (id: string) => {
    console.log('Removendo evento:', id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Nova função para alternar conclusão de evento
  const toggleEventComplete = (id: string, completed: boolean) => {
    console.log('Alternando conclusão do evento:', id, completed);
    updateEvent(id, {
      concluido: completed,
      dataConclusao: completed ? new Date().toISOString() : undefined
    });
  };

  // Função para categorizar eventos
  const categorizeEvents = () => {
    const now = new Date();
    const categories = {
      active: [] as AgendaEvent[],
      completed: [] as AgendaEvent[],
      overdue: [] as AgendaEvent[]
    };

    events.forEach(event => {
      if (event.concluido) {
        categories.completed.push(event);
      } else if (isEventOverdue(event.data, event.hora)) {
        categories.overdue.push(event);
      } else {
        categories.active.push(event);
      }
    });

    return categories;
  };

  // Função para notificar o sistema WhatsApp
  const notifyWhatsAppSystem = (event: AgendaEvent) => {
    try {
      const whatsappNotification = {
        eventId: event.id,
        clientData: event.clienteData,
        eventDetails: {
          titulo: event.titulo,
          data: event.data,
          hora: event.hora,
          local: event.local,
          tipo: event.tipo,
          tipoCompromisso: event.tipoCompromisso
        },
        timestamp: new Date().toISOString()
      };

      console.log('🚀 Notificando sistema WhatsApp para', event.tipoCompromisso + ':', whatsappNotification);
      
      const whatsappQueue = JSON.parse(localStorage.getItem('whatsapp_notifications_queue') || '[]');
      whatsappQueue.push(whatsappNotification);
      localStorage.setItem('whatsapp_notifications_queue', JSON.stringify(whatsappQueue));
      
      window.dispatchEvent(new CustomEvent('whatsapp-notification-queued', {
        detail: whatsappNotification
      }));
      
    } catch (error) {
      console.error('Erro ao notificar sistema WhatsApp:', error);
    }
  };

  // Função para obter eventos com notificação ativa
  const getEventsWithNotification = () => {
    return events.filter(event => event.enviarLembrete);
  };

  // Função para marcar notificação como enviada
  const markNotificationSent = (eventId: string) => {
    updateEvent(eventId, {
      notificacaoEnviada: true,
      dataNotificacao: new Date().toISOString(),
      ultimaNotificacao: new Date().toISOString()
    });
  };

  // Função para obter próximos eventos (melhorada)
  const getUpcomingEvents = (limit: number = 4) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
      .filter(event => !event.concluido && !isEventOverdue(event.data, event.hora))
      .filter(event => {
        const eventDate = new Date(event.data);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => {
        const dateComparison = new Date(a.data).getTime() - new Date(b.data).getTime();
        if (dateComparison !== 0) return dateComparison;
        
        const timeA = a.hora.split(':').map(Number);
        const timeB = b.hora.split(':').map(Number);
        const timeComparison = (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
        if (timeComparison !== 0) return timeComparison;
        
        const priorityOrder = { 'alta': 3, 'media': 2, 'baixa': 1 };
        return priorityOrder[b.prioridade] - priorityOrder[a.prioridade];
      })
      .slice(0, limit);
  };

  // Função para obter eventos dos últimos 2 dias
  const getRecentEvents = (tipoCompromisso: 'proximos' | 'prazos') => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const filteredEvents = events
      .filter(event => {
        const eventDate = new Date(event.dataCriacao || event.data);
        return event.tipoCompromisso === tipoCompromisso && eventDate >= twoDaysAgo;
      })
      .sort((a, b) => {
        const priorityOrder = { 'alta': 3, 'media': 2, 'baixa': 1 };
        if (priorityOrder[a.prioridade] !== priorityOrder[b.prioridade]) {
          return priorityOrder[b.prioridade] - priorityOrder[a.prioridade];
        }
        const dateA = new Date(a.dataCriacao || a.data);
        const dateB = new Date(b.dataCriacao || b.data);
        return dateB.getTime() - dateA.getTime();
      });

    console.log(`Eventos filtrados para ${tipoCompromisso}:`, filteredEvents);
    return filteredEvents;
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleEventComplete,
    categorizeEvents,
    getRecentEvents,
    getEventsWithNotification,
    markNotificationSent,
    getUpcomingEvents,
    notifyWhatsAppSystem,
    isLoaded
  };
};
