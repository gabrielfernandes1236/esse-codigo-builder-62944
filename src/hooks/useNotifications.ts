
import { useState, useEffect } from 'react';

export interface NotificationConfig {
  email: boolean;
  whatsapp: boolean;
  antecedencia: '1dia' | '2dias' | '1semana' | 'personalizado';
  antecedenciaPersonalizada?: number;
  grupoWhatsApp?: string;
  emailsAdvogados: string[];
  templatesWhatsApp: {
    grupo: string;
    cliente: string;
  };
  templatesEmail: {
    assunto: string;
    corpo: string;
  };
}

export interface NotificationLog {
  id: string;
  eventoId: string;
  tipo: 'email' | 'whatsapp';
  destinatario: string;
  status: 'enviado' | 'erro';
  dataEnvio: string;
  tentativas: number;
}

const STORAGE_KEY_CONFIG = 'notification_config';
const STORAGE_KEY_LOGS = 'notification_logs';

const defaultConfig: NotificationConfig = {
  email: false,
  whatsapp: false,
  antecedencia: '1dia',
  grupoWhatsApp: '',
  emailsAdvogados: [],
  templatesWhatsApp: {
    grupo: '🔔 *Lembrete de Compromisso*\n\n📅 *{titulo}*\n📍 Data: {data}\n⏰ Horário: {hora}\n📍 Local: {local}\n👤 Cliente: {cliente}\n📋 Processo: {processo}',
    cliente: '📅 *Lembrete de Compromisso*\n\nOlá {cliente}!\n\nEste é um lembrete sobre seu compromisso:\n\n📋 *{titulo}*\n📅 Data: {data}\n⏰ Horário: {hora}\n📍 Local: {local}\n\nEm caso de dúvidas, entre em contato conosco.'
  },
  templatesEmail: {
    assunto: 'Lembrete: {titulo} - {data}',
    corpo: 'Prezado(a),\n\nEste é um lembrete sobre o compromisso:\n\nTítulo: {titulo}\nData: {data}\nHorário: {hora}\nLocal: {local}\nCliente: {cliente}\nProcesso: {processo}\n\nAtenciosamente,\nEquipe Jurídica'
  }
};

export const useNotifications = () => {
  const [config, setConfig] = useState<NotificationConfig>(defaultConfig);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar configurações
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      const savedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      
      if (savedConfig) {
        setConfig({ ...defaultConfig, ...JSON.parse(savedConfig) });
      }
      
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de notificação:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Salvar configurações
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    }
  }, [config, isLoaded]);

  // Salvar logs
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    }
  }, [logs, isLoaded]);

  const updateConfig = (newConfig: Partial<NotificationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const enviarNotificacao = async (evento: any, tipo: 'email' | 'whatsapp', destinatario: string) => {
    const logId = Date.now().toString();
    
    try {
      console.log(`Enviando ${tipo} para ${destinatario}:`, evento);
      
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLog: NotificationLog = {
        id: logId,
        eventoId: evento.id,
        tipo,
        destinatario,
        status: 'enviado',
        dataEnvio: new Date().toISOString(),
        tentativas: 1
      };
      
      setLogs(prev => [...prev, newLog]);
      
      return { success: true, logId };
    } catch (error) {
      console.error(`Erro ao enviar ${tipo}:`, error);
      
      const newLog: NotificationLog = {
        id: logId,
        eventoId: evento.id,
        tipo,
        destinatario,
        status: 'erro',
        dataEnvio: new Date().toISOString(),
        tentativas: 1
      };
      
      setLogs(prev => [...prev, newLog]);
      
      return { success: false, error: error };
    }
  };

  const getLogsForEvent = (eventoId: string) => {
    return logs.filter(log => log.eventoId === eventoId);
  };

  const getTotalNotificationsCount = () => {
    return logs.filter(log => log.status === 'enviado').length;
  };

  return {
    config,
    logs,
    isLoaded,
    updateConfig,
    enviarNotificacao,
    getLogsForEvent,
    getTotalNotificationsCount
  };
};
