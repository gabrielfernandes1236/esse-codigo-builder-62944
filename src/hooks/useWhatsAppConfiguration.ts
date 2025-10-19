
import { useState } from 'react';
import { useProcessesData } from './useProcessesData';
import { useGmailIntegration } from './useGmailIntegration';

export interface MessageTemplate {
  id: string;
  type: 'process_update' | 'appointment' | 'relationship' | 'completion';
  name: string;
  description: string;
  template: string;
  preferredTime: string;
  allowManualSend: boolean;
  enabled: boolean;
  lastUpdate: string;
  recurrence?: {
    enabled: boolean;
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;
    customDays?: number[];
  };
}

export interface WhatsAppMessage {
  id: string;
  clientName: string;
  type: string;
  typeColor: string;
  message: string;
  dateTime: string;
  status: 'Entregue' | 'Não entregue' | 'Respondido';
  statusColor: string;
  isAutomatic?: boolean;
  clientResponse?: string;
}

export interface MessageStats {
  totalSent: number;
  delivered: number;
  failed: number;
  responseRate: number;
}

export interface PresetTemplate {
  id: string;
  name: string;
  template: string;
}

export const useWhatsAppConfiguration = () => {
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(true);
  const { processes } = useProcessesData();
  const { connection } = useGmailIntegration();

  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      type: 'process_update',
      name: 'Atualização de processo',
      description: 'Notifica o cliente sobre atualizações importantes no andamento do processo.',
      template: 'Olá {{nome}}, seu processo nº {{numero_processo}} teve uma atualização importante. {{descricao_atualizacao}}. Em caso de dúvidas, entre em contato conosco.',
      preferredTime: '09:00',
      allowManualSend: true,
      enabled: true,
      lastUpdate: '21/06/2025',
      recurrence: { enabled: false, type: 'daily', interval: 1 }
    },
    {
      id: '2',
      type: 'appointment',
      name: 'Confirmação de compromissos',
      description: 'Envia lembretes de audiências e reuniões agendadas com o cliente.',
      template: 'Lembrete: {{nome}}, sua {{tipo_compromisso}} está marcada para {{data_evento}} às {{hora_evento}}. Local: {{local_evento}}. Confirme sua presença.',
      preferredTime: '08:00',
      allowManualSend: true,
      enabled: true,
      lastUpdate: '18/06/2025',
      recurrence: { enabled: false, type: 'weekly', interval: 1 }
    },
    {
      id: '3',
      type: 'relationship',
      name: 'Mensagens de relacionamento',
      description: 'Envia mensagens de boas-vindas, aniversário e datas comemorativas.',
      template: 'Olá {{nome}}! Esperamos que esteja bem. Gostaríamos de parabenizá-lo(a) e reforçar nosso compromisso em atendê-lo(a) sempre da melhor forma.',
      preferredTime: '10:00',
      allowManualSend: false,
      enabled: false,
      lastUpdate: '15/06/2025',
      recurrence: { enabled: false, type: 'monthly', interval: 1 }
    },
    {
      id: '4',
      type: 'completion',
      name: 'Agradecimento/finalização',
      description: 'Envia mensagem de agradecimento após a conclusão de um processo.',
      template: 'Olá {{nome}}! Agradecemos a confiança em nosso escritório. Seu processo {{numero_processo}} foi concluído com sucesso. Estamos sempre à disposição para futuras necessidades.',
      preferredTime: '14:00',
      allowManualSend: true,
      enabled: true,
      lastUpdate: '10/06/2025',
      recurrence: { enabled: false, type: 'daily', interval: 1 }
    }
  ]);

  const [sentMessages, setSentMessages] = useState<WhatsAppMessage[]>([
    {
      id: '1',
      clientName: 'Fernanda Almeida',
      type: 'Atualização',
      typeColor: 'bg-blue-100 text-blue-800',
      message: 'Olá Fernanda, seu processo nº 2023.0145.789 teve uma atualização hoje. O juiz...',
      dateTime: '21/06/2025 14:32',
      status: 'Respondido',
      statusColor: 'bg-green-100 text-green-800',
      clientResponse: 'Ok, obrigada pelo aviso!'
    },
    {
      id: '2',
      clientName: 'Carlos Mendes',
      type: 'Compromisso',
      typeColor: 'bg-yellow-100 text-yellow-800',
      message: 'Lembrete: Sua audiência está marcada para amanhã, 22/06/2025, às 10:00h no...',
      dateTime: '21/06/2025 10:15',
      status: 'Entregue',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '3',
      clientName: 'Mariana Costa',
      type: 'Finalização',
      typeColor: 'bg-purple-100 text-purple-800',
      message: 'Agradecemos a confiança em nosso escritório. Seu processo foi concluído com...',
      dateTime: '20/06/2025 16:45',
      status: 'Entregue',
      statusColor: 'bg-green-100 text-green-800',
      isAutomatic: true
    },
    {
      id: '4',
      clientName: 'Roberto Gomes',
      type: 'Relacionamento',
      typeColor: 'bg-green-100 text-green-800',
      message: 'Bom dia, Roberto! Esperamos que esteja bem. Gostaríamos de informar que...',
      dateTime: '19/06/2025 09:00',
      status: 'Não entregue',
      statusColor: 'bg-red-100 text-red-800'
    }
  ]);

  const [customTemplates, setCustomTemplates] = useState<PresetTemplate[]>([]);

  const presetTemplates: Record<string, PresetTemplate[]> = {
    process_update: [
      {
        id: 'pu1',
        name: 'Atualização Simples',
        template: 'Olá {{nome}}, seu processo {{numero_processo}} foi atualizado. {{descricao_atualizacao}}'
      },
      {
        id: 'pu2',
        name: 'Atualização Detalhada',
        template: 'Prezado(a) {{nome}}, informamos que houve movimentação no processo {{numero_processo}}. Detalhes: {{descricao_atualizacao}}. Qualquer dúvida, estamos à disposição.'
      },
      {
        id: 'pu3',
        name: 'Atualização Urgente',
        template: '🚨 URGENTE - {{nome}}, seu processo {{numero_processo}} teve uma atualização importante que requer atenção. {{descricao_atualizacao}}. Entre em contato conosco.'
      }
    ],
    appointment: [
      {
        id: 'ap1',
        name: 'Lembrete Simples',
        template: 'Olá {{nome}}, lembre-se: {{tipo_mensagem}} em {{data_evento}} às {{hora_evento}}.'
      },
      {
        id: 'ap2',
        name: 'Lembrete Completo',
        template: 'Prezado(a) {{nome}}, confirmamos sua {{tipo_mensagem}} para {{data_evento}} às {{hora_evento}}. Local: {{local_evento}}. Confirme sua presença.'
      },
      {
        id: 'ap3',
        name: 'Lembrete com Documentos',
        template: '📋 {{nome}}, sua {{tipo_mensagem}} está marcada para {{data_evento}} às {{hora_evento}}. Não esqueça dos documentos: {{link_documento}}'
      }
    ],
    relationship: [
      {
        id: 'rel1',
        name: 'Saudação Simples',
        template: 'Olá {{nome}}! Esperamos que esteja bem. Estamos sempre à disposição para ajudá-lo(a).'
      },
      {
        id: 'rel2',
        name: 'Parabenização',
        template: 'Parabéns {{nome}}! 🎉 Desejamos muito sucesso e estamos aqui para apoiá-lo(a) sempre.'
      },
      {
        id: 'rel3',
        name: 'Check-in Mensal',
        template: 'Olá {{nome}}, como vai? Este é nosso contato mensal para saber como você está e se precisar de algo.'
      }
    ],
    completion: [
      {
        id: 'comp1',
        name: 'Agradecimento Simples',
        template: 'Obrigado pela confiança, {{nome}}! Seu processo {{numero_processo}} foi concluído com sucesso.'
      },
      {
        id: 'comp2',
        name: 'Agradecimento Completo',
        template: 'Prezado(a) {{nome}}, é com grande satisfação que informamos a conclusão do seu processo {{numero_processo}}. Agradecemos a confiança em nossos serviços.'
      },
      {
        id: 'comp3',
        name: 'Agradecimento com Convite',
        template: '✅ {{nome}}, processo {{numero_processo}} concluído! Obrigado pela confiança. Para futuras necessidades, conte conosco. Avalie nosso serviço: {{link_documento}}'
      }
    ]
  };

  const updateTemplate = (templateId: string, updates: Partial<MessageTemplate>) => {
    setMessageTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? { ...template, ...updates, lastUpdate: new Date().toLocaleDateString('pt-BR') }
          : template
      )
    );
  };

  const toggleTemplate = (templateId: string) => {
    updateTemplate(templateId, { enabled: !messageTemplates.find(t => t.id === templateId)?.enabled });
  };

  const sendTestMessage = () => {
    const testMessage: WhatsAppMessage = {
      id: Date.now().toString(),
      clientName: 'Cliente Teste',
      type: 'Teste',
      typeColor: 'bg-gray-100 text-gray-800',
      message: 'Esta é uma mensagem de teste para verificar a estrutura do sistema.',
      dateTime: new Date().toLocaleString('pt-BR'),
      status: 'Entregue',
      statusColor: 'bg-green-100 text-green-800'
    };

    setSentMessages(prev => [testMessage, ...prev]);
    console.log('Mensagem de teste enviada:', testMessage);
  };

  const processVariables = (template: string, variables: Record<string, string>) => {
    let processedMessage = template;
    Object.entries(variables).forEach(([key, value]) => {
      processedMessage = processedMessage.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return processedMessage;
  };

  const simulateClientResponse = (messageId: string, response: string) => {
    const keywords = ['ok', 'confirmo', 'recebido', 'entendi', 'certo', 'obrigado'];
    const isPositiveResponse = keywords.some(keyword => 
      response.toLowerCase().includes(keyword)
    );

    if (isPositiveResponse) {
      setSentMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { 
                ...msg, 
                status: 'Respondido' as const,
                statusColor: 'bg-green-100 text-green-800',
                clientResponse: response
              }
            : msg
        )
      );
    }
  };

  const addCustomTemplate = (type: string, template: PresetTemplate) => {
    setCustomTemplates(prev => [...prev, { ...template, id: `custom_${Date.now()}` }]);
  };

  const getMessageStats = (): MessageStats => {
    const totalSent = sentMessages.length;
    const delivered = sentMessages.filter(msg => msg.status === 'Entregue' || msg.status === 'Respondido').length;
    const failed = sentMessages.filter(msg => msg.status === 'Não entregue').length;
    const responded = sentMessages.filter(msg => msg.status === 'Respondido').length;
    const responseRate = totalSent > 0 ? Math.round((responded / totalSent) * 100) : 0;

    return { totalSent, delivered, failed, responseRate };
  };

  return {
    isAutomationEnabled,
    setIsAutomationEnabled,
    messageTemplates,
    sentMessages,
    updateTemplate,
    toggleTemplate,
    sendTestMessage,
    processVariables,
    simulateClientResponse,
    presetTemplates,
    customTemplates,
    addCustomTemplate,
    getMessageStats
  };
};
