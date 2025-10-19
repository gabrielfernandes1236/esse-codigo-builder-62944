
import { useState, useEffect } from 'react';
import { useAgendaData } from './useAgendaData';
import { useNotifications } from './useNotifications';

export interface WhatsAppNotification {
  id: string;
  eventId: string;
  clientData: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  eventDetails: {
    titulo: string;
    data: string;
    hora: string;
    local?: string;
    tipo: string;
  };
  messageTemplate?: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  timestamp: string;
  scheduledFor?: string;
}

export const useWhatsAppIntegration = () => {
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>([]);
  const { config } = useNotifications();
  const { events } = useAgendaData();

  // Carregar notificações da fila
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const queue = JSON.parse(localStorage.getItem('whatsapp_notifications_queue') || '[]');
        setNotifications(queue);
      } catch (error) {
        console.error('Erro ao carregar fila WhatsApp:', error);
      }
    };

    loadNotifications();

    // Escutar eventos de nova notificação
    const handleNewNotification = (event: CustomEvent) => {
      const notification: WhatsAppNotification = {
        id: Date.now().toString(),
        eventId: event.detail.eventId,
        clientData: event.detail.clientData,
        eventDetails: event.detail.eventDetails,
        status: 'pending',
        timestamp: event.detail.timestamp,
        scheduledFor: calculateScheduledTime(event.detail.eventDetails.data)
      };

      setNotifications(prev => [...prev, notification]);
      console.log('🔔 Nova notificação WhatsApp adicionada:', notification);
    };

    window.addEventListener('whatsapp-notification-queued', handleNewNotification as EventListener);

    return () => {
      window.removeEventListener('whatsapp-notification-queued', handleNewNotification as EventListener);
    };
  }, []);

  // Salvar notificações sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('whatsapp_notifications_queue', JSON.stringify(notifications));
  }, [notifications]);

  // Calcular horário para envio baseado na antecedência configurada
  const calculateScheduledTime = (eventDate: string) => {
    const event = new Date(eventDate);
    const now = new Date();
    
    let antecedenciaDias = 1; // padrão
    
    switch (config.antecedencia) {
      case '1dia':
        antecedenciaDias = 1;
        break;
      case '2dias':
        antecedenciaDias = 2;
        break;
      case '1semana':
        antecedenciaDias = 7;
        break;
      case 'personalizado':
        antecedenciaDias = config.antecedenciaPersonalizada || 1;
        break;
    }

    const scheduledDate = new Date(event);
    scheduledDate.setDate(scheduledDate.getDate() - antecedenciaDias);
    scheduledDate.setHours(9, 0, 0, 0); // 9:00 AM por padrão

    return scheduledDate.toISOString();
  };

  // Processar template de mensagem
  const processMessageTemplate = (template: string, eventDetails: any, clientData: any) => {
    let message = template;
    
    // Substituir variáveis do template
    message = message.replace(/{titulo}/g, eventDetails.titulo);
    message = message.replace(/{data}/g, new Date(eventDetails.data).toLocaleDateString('pt-BR'));
    message = message.replace(/{hora}/g, eventDetails.hora);
    message = message.replace(/{local}/g, eventDetails.local || 'A definir');
    message = message.replace(/{cliente}/g, clientData.name);
    message = message.replace(/{processo}/g, eventDetails.processo || '');

    return message;
  };

  // Simular envio de mensagem WhatsApp
  const sendWhatsAppMessage = (notification: WhatsAppNotification) => {
    try {
      console.log('📱 Enviando mensagem WhatsApp:', notification);
      
      // Simular envio para cliente
      if (notification.clientData.whatsapp || notification.clientData.phone) {
        const clientMessage = processMessageTemplate(
          config.templatesWhatsApp.cliente,
          notification.eventDetails,
          notification.clientData
        );
        
        console.log(`📱 Mensagem para cliente ${notification.clientData.name}:`, clientMessage);
      }

      // Simular envio para grupo de advogados
      if (config.whatsapp && config.grupoWhatsApp) {
        const groupMessage = processMessageTemplate(
          config.templatesWhatsApp.grupo,
          notification.eventDetails,
          notification.clientData
        );
        
        console.log('👥 Mensagem para grupo de advogados:', groupMessage);
      }

      // Atualizar status da notificação
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, status: 'sent' as const }
            : n
        )
      );

      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, status: 'failed' as const }
            : n
        )
      );
      
      return false;
    }
  };

  // Processar fila de notificações pendentes
  const processNotificationQueue = () => {
    const now = new Date();
    const pendingNotifications = notifications.filter(n => 
      n.status === 'pending' && 
      n.scheduledFor && 
      new Date(n.scheduledFor) <= now
    );

    pendingNotifications.forEach(notification => {
      if (config.whatsapp) { // Verificar se WhatsApp está ativado
        sendWhatsAppMessage(notification);
      }
    });

    console.log(`🔄 Processadas ${pendingNotifications.length} notificações WhatsApp`);
  };

  // Verificar e processar fila periodicamente
  useEffect(() => {
    const interval = setInterval(processNotificationQueue, 60000); // A cada minuto
    return () => clearInterval(interval);
  }, [notifications, config]);

  // Obter estatísticas das notificações
  const getNotificationStats = () => {
    const total = notifications.length;
    const sent = notifications.filter(n => n.status === 'sent').length;
    const pending = notifications.filter(n => n.status === 'pending').length;
    const failed = notifications.filter(n => n.status === 'failed').length;

    return { total, sent, pending, failed };
  };

  // Obter próximas notificações programadas
  const getUpcomingNotifications = (limit: number = 5) => {
    return notifications
      .filter(n => n.status === 'pending' && n.scheduledFor)
      .sort((a, b) => new Date(a.scheduledFor!).getTime() - new Date(b.scheduledFor!).getTime())
      .slice(0, limit);
  };

  return {
    notifications,
    sendWhatsAppMessage,
    processNotificationQueue,
    getNotificationStats,
    getUpcomingNotifications,
    processMessageTemplate
  };
};
