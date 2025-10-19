
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useProcessesData } from './useProcessesData';
import { useAgendaData } from './useAgendaData';
import { useOfficeConfiguration } from './useOfficeConfiguration';

interface EmailUpdate {
  processId: string;
  status: string;
  emailContent: string;
  receivedAt: string;
}

interface MonitoredEmail {
  id: string;
  subject: string;
  from: string;
  content: string;
  receivedAt: string;
  status?: string;
  processNumbers?: string[];
  priority: 'high' | 'medium' | 'low';
  matched_keywords?: string[];
  snippet?: string;
  debugInfo?: {
    foundProcessNumbers: string[];
    matchedKeywords: string[];
    statusDetected: string;
    processMatched: boolean;
    statusChanged: boolean;
  };
}

interface GmailConnection {
  isConnected: boolean;
  email: string;
  connectedAt: string;
  accessToken: string | null;
  refreshToken: string | null;
}

interface GoogleCredentials {
  clientId: string;
  clientSecret: string;
}

interface EmailStats {
  totalProcessed: number;
  processUpdates: number;
  lastSync: string;
  errorsCount: number;
}

export const useGmailIntegration = () => {
  const [connection, setConnection] = useState<GmailConnection>({
    isConnected: false,
    email: '',
    connectedAt: '',
    accessToken: null,
    refreshToken: null
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastEmailCheck, setLastEmailCheck] = useState<string>('');
  const [credentials, setCredentials] = useState<GoogleCredentials | null>(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [monitoredEmails, setMonitoredEmails] = useState<MonitoredEmail[]>([]);
  const [emailStats, setEmailStats] = useState<EmailStats>({
    totalProcessed: 0,
    processUpdates: 0,
    lastSync: '',
    errorsCount: 0
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  
  const { toast } = useToast();
  const { updateProcess, processes } = useProcessesData();
  const { addEvent } = useAgendaData();
  const { configuration, isConfigured } = useOfficeConfiguration();

  // Carregar credenciais salvas
  useEffect(() => {
    const savedCredentials = localStorage.getItem('google_credentials');
    if (savedCredentials) {
      try {
        setCredentials(JSON.parse(savedCredentials));
      } catch (error) {
        console.error('Erro ao carregar credenciais:', error);
      }
    }
  }, []);

  // Carregar conexão salva
  useEffect(() => {
    const savedConnection = localStorage.getItem('gmail_connection');
    if (savedConnection) {
      try {
        const parsedConnection = JSON.parse(savedConnection);
        setConnection(parsedConnection);
        console.log('📧 Conexão Gmail restaurada:', parsedConnection.email);
      } catch (error) {
        console.error('Erro ao restaurar conexão:', error);
      }
    }
  }, []);

  // Inicializar monitoramento quando conexão e configuração estiverem prontas
  useEffect(() => {
    console.log('🔄 Verificando condições para monitoramento:', {
      isConnected: connection.isConnected,
      hasToken: !!connection.accessToken,
      isConfigured,
      isCurrentlyMonitoring: isMonitoring
    });

    if (connection.isConnected && connection.accessToken && isConfigured && !isMonitoring) {
      console.log('✅ Condições atendidas - Iniciando monitoramento automaticamente...');
      setTimeout(() => {
        startMonitoring();
      }, 2000);
    }
  }, [connection.isConnected, connection.accessToken, isConfigured, isMonitoring]);

  // Limpar intervalo quando componente for desmontado
  useEffect(() => {
    return () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
      }
    };
  }, [monitoringInterval]);

  // Função melhorada para extrair números de processo
  const extractProcessNumbers = (text: string): string[] => {
    console.log('🔍 [DEBUG] Extraindo números de processo do texto:', text.substring(0, 200) + '...');
    
    // Regex mais abrangente para números de processo brasileiros
    const regexPatterns = [
      // Formato completo: 0000000-00.0000.0.00.0000
      /(\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4})/g,
      // Formato sem pontos: 0000000-00000000000000
      /(\d{7}-\d{14})/g,
      // Formato CNJ: 0000000.00.0000.0.00.0000
      /(\d{7}\.\d{2}\.\d{4}\.\d\.\d{2}\.\d{4})/g,
      // Formato misto: 0000000.00.0000.0.00.0000
      /(\d{7}[\.-]\d{2}[\.-]\d{4}[\.-]\d[\.-]\d{2}[\.-]\d{4})/g,
      // Formato simplificado: 0000000000000000000000
      /(\d{20})/g,
      // Formato antigo: 000.00.000000.0.00.0000
      /(\d{3}\.\d{2}\.\d{6}\.\d\.\d{2}\.\d{4})/g,
      // Outros formatos possíveis
      /(\d{4}\.\d{2}\.\d{7}-\d{2})/g,
      /(\d{13}-\d{2})/g
    ];

    const foundNumbers: string[] = [];
    
    regexPatterns.forEach((regex, index) => {
      const matches = text.match(regex);
      if (matches) {
        console.log(`🎯 [DEBUG] Regex ${index + 1} encontrou:`, matches);
        foundNumbers.push(...matches);
      }
    });

    // Remover duplicatas e retornar
    const uniqueNumbers = [...new Set(foundNumbers)];
    console.log('📋 [DEBUG] Números únicos encontrados:', uniqueNumbers);
    
    return uniqueNumbers;
  };

  // Normalizar número de processo para comparação
  const normalizeProcessNumber = (processNumber: string): string => {
    // Remove todos os caracteres não numéricos
    const normalized = processNumber.replace(/[^0-9]/g, '');
    console.log(`🔧 [DEBUG] Normalizando "${processNumber}" → "${normalized}"`);
    return normalized;
  };

  // Mapear palavras-chave para status com mais opções
  const getStatusKeywords = () => {
    return {
      // Em andamento
      'em_andamento': [
        'em andamento', 'em curso', 'tramitando', 'processamento', 'análise', 'em análise',
        'aguardando', 'pendente', 'prosseguimento', 'instrução', 'em instrução',
        'fase instrutória', 'produção de provas', 'oitiva', 'perícia', 'em perícia',
        'manifestação', 'aguardando manifestação', 'vista', 'em vista'
      ],
      
      // Concluído
      'concluido': [
        'deferido', 'concluído', 'finalizado', 'benefício concedido', 'aprovado',
        'decisão favorável', 'procedente', 'julgado procedente', 'sentença favorável',
        'homologado', 'acordo homologado', 'sucesso', 'ganho', 'vitória',
        'reconhecido', 'direito reconhecido', 'concessão', 'aposentadoria concedida'
      ],
      
      // Arquivado
      'arquivado': [
        'indeferido', 'arquivado', 'improcedente', 'negado', 'recurso negado',
        'processo arquivado', 'decisão desfavorável', 'julgado improcedente',
        'rejeitado', 'extinto', 'extinção', 'sem resolução do mérito',
        'desistência', 'desistiu', 'abandonado', 'perempção'
      ],
      
      // Suspenso
      'suspenso': [
        'suspenso', 'sobrestado', 'interrompido', 'aguardando recurso',
        'recurso pendente', 'suspensão', 'sobrestamento', 'em recurso',
        'apelação', 'em apelação', 'embargo', 'embargos', 'agravo',
        'em grau de recurso', 'segundo grau', 'superior instância'
      ]
    };
  };

  // Detectar status no conteúdo do email
  const detectStatusFromContent = (content: string): { status: string | null; keyword: string | null } => {
    const contentLower = content.toLowerCase();
    const statusKeywords = getStatusKeywords();
    
    console.log('🔍 [DEBUG] Detectando status no conteúdo...');
    
    for (const [status, keywords] of Object.entries(statusKeywords)) {
      for (const keyword of keywords) {
        if (contentLower.includes(keyword.toLowerCase())) {
          console.log(`✅ [DEBUG] Status detectado: "${status}" (palavra-chave: "${keyword}")`);
          return { status, keyword };
        }
      }
    }
    
    console.log('❌ [DEBUG] Nenhum status detectado no conteúdo');
    return { status: null, keyword: null };
  };

  // Salvar credenciais
  const saveCredentials = (newCredentials: GoogleCredentials) => {
    setCredentials(newCredentials);
    localStorage.setItem('google_credentials', JSON.stringify(newCredentials));
    setShowCredentialsModal(false);
    
    console.log('✅ Credenciais Google salvas com sucesso');
    
    toast({
      title: "Credenciais configuradas",
      description: "As credenciais do Google foram salvas. Agora você pode conectar ao Gmail.",
    });
  };

  // Alterar credenciais
  const changeCredentials = () => {
    if (connection.isConnected) {
      disconnectGmail();
    }
    
    setCredentials(null);
    localStorage.removeItem('google_credentials');
    setShowCredentialsModal(true);
    
    toast({
      title: "Alterando credenciais",
      description: "Configure as novas credenciais do Google OAuth2.",
    });
  };

  // Verificar se credenciais estão configuradas
  const hasCredentials = () => {
    return credentials && credentials.clientId && credentials.clientSecret;
  };

  // Testar conexão
  const testConnection = async () => {
    if (!connection.accessToken) {
      toast({
        title: "Erro no teste",
        description: "Não há conexão ativa para testar.",
        variant: "destructive",
      });
      return false;
    }

    setIsTestingConnection(true);
    try {
      console.log('🧪 Testando conexão Gmail...');
      
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/profile',
        {
          headers: {
            'Authorization': `Bearer ${connection.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const profile = await response.json();
        console.log('✅ Teste de conexão bem-sucedido:', profile.emailAddress);
        
        toast({
          title: "Conexão ativa",
          description: `Conectado como ${profile.emailAddress}`,
        });
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erro no teste de conexão:', error);
      
      toast({
        title: "Erro na conexão",
        description: "A conexão com o Gmail falhou. Tente reconectar.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Processar todos os emails recentes (modo debug)
  const processAllRecentEmails = async () => {
    if (!connection.accessToken) {
      toast({
        title: "Erro",
        description: "Não há conexão ativa com o Gmail.",
        variant: "destructive",
      });
      return;
    }

    console.log('🐛 [DEBUG MODE] Processando todos os emails recentes...');
    setDebugMode(true);
    
    try {
      // Buscar emails dos últimos 7 dias sem filtros específicos
      const sevenDaysAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
      const query = `after:${sevenDaysAgo}`;
      
      console.log('🔍 [DEBUG] Query de busca ampla:', query);
      
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=50`,
        {
          headers: {
            'Authorization': `Bearer ${connection.accessToken}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.messages && data.messages.length > 0) {
        console.log(`📬 [DEBUG] ${data.messages.length} emails encontrados para análise`);
        
        for (const message of data.messages.slice(0, 20)) { // Limitar a 20 para não sobrecarregar
          const emailData = await processEmailMessage(message.id, true); // true = modo debug
          if (emailData) {
            console.log('📧 [DEBUG] Email processado:', {
              subject: emailData.subject,
              from: emailData.from,
              foundProcesses: emailData.processNumbers,
              debugInfo: emailData.debugInfo
            });
          }
        }
        
        toast({
          title: "Debug concluído",
          description: `Foram analisados ${Math.min(data.messages.length, 20)} emails recentes.`,
        });
      } else {
        console.log('📭 [DEBUG] Nenhum email encontrado');
        toast({
          title: "Debug concluído",
          description: "Nenhum email foi encontrado no período analisado.",
        });
      }
    } catch (error) {
      console.error('❌ [DEBUG] Erro durante análise:', error);
      toast({
        title: "Erro no debug",
        description: "Ocorreu um erro durante a análise dos emails.",
        variant: "destructive",
      });
    } finally {
      setDebugMode(false);
    }
  };

  // Iniciar processo de autenticação OAuth
  const connectGmail = async () => {
    try {
      if (!hasCredentials()) {
        setShowCredentialsModal(true);
        toast({
          title: "Credenciais necessárias",
          description: "Configure primeiro as credenciais do Google OAuth2.",
          variant: "destructive",
        });
        return;
      }

      if (!isConfigured) {
        toast({
          title: "Configuração necessária",
          description: "Configure primeiro as informações do escritório na aba Configurações.",
          variant: "destructive",
        });
        return;
      }

      console.log('🔐 Iniciando autenticação OAuth com Gmail...');
      
      const redirectUri = `${window.location.origin}/auth/gmail/callback`;
      console.log('🔗 Redirect URI:', redirectUri);
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.append('client_id', credentials!.clientId);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/gmail.readonly');
      authUrl.searchParams.append('access_type', 'offline');
      authUrl.searchParams.append('prompt', 'consent');

      console.log('🌐 URL de autorização:', authUrl.toString());

      const popup = window.open(
        authUrl.toString(),
        'gmail-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup bloqueado pelo navegador');
      }

      const authPromise = new Promise<{ code: string }>((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            reject(new Error('Autenticação cancelada pelo usuário'));
          }
        }, 1000);

        const messageHandler = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'GMAIL_AUTH_SUCCESS') {
            clearInterval(checkClosed);
            popup?.close();
            window.removeEventListener('message', messageHandler);
            resolve({ code: event.data.code });
          } else if (event.data.type === 'GMAIL_AUTH_ERROR') {
            clearInterval(checkClosed);
            popup?.close();
            window.removeEventListener('message', messageHandler);
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', messageHandler);
      });

      const authResult = await authPromise;
      await exchangeCodeForTokens(authResult.code);
      
    } catch (error) {
      console.error('❌ Erro na autenticação Gmail:', error);
      
      let errorMessage = "Falha ao conectar com o Gmail.";
      if (error.message?.includes('redirect_uri_mismatch')) {
        errorMessage = `Erro de configuração OAuth: A URL de redirecionamento não confere. Configure no Google Cloud Console: ${window.location.origin}/auth/gmail/callback`;
      } else if (error.message?.includes('invalid_client')) {
        errorMessage = "Client ID ou Client Secret inválido. Verifique suas credenciais.";
      } else if (error.message?.includes('Popup bloqueado')) {
        errorMessage = "Popup foi bloqueado pelo navegador. Permita popups para este site.";
      }
      
      toast({
        title: "Erro na conexão",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Trocar código de autorização por tokens de acesso
  const exchangeCodeForTokens = async (authCode: string) => {
    try {
      console.log('🔄 Trocando código por tokens...');
      
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: credentials!.clientId,
          client_secret: credentials!.clientSecret,
          code: authCode,
          grant_type: 'authorization_code',
          redirect_uri: `${window.location.origin}/auth/gmail/callback`,
        }),
      });

      const tokens = await response.json();
      
      if (tokens.error) {
        throw new Error(tokens.error_description || tokens.error);
      }

      const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      const user = await userInfo.json();

      const newConnection = {
        isConnected: true,
        email: user.email,
        connectedAt: new Date().toLocaleString('pt-BR'),
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      };

      setConnection(newConnection);
      localStorage.setItem('gmail_connection', JSON.stringify(newConnection));
      
      console.log('✅ Gmail conectado com sucesso:', user.email);
      
      toast({
        title: "Gmail conectado com sucesso!",
        description: `Monitoramento será iniciado automaticamente para a conta ${user.email}`,
      });

      // O monitoramento será iniciado automaticamente pelo useEffect
      
    } catch (error) {
      console.error('❌ Erro ao trocar tokens:', error);
      throw error;
    }
  };

  // Desconectar Gmail
  const disconnectGmail = async () => {
    try {
      // Parar monitoramento
      stopMonitoring();

      if (connection.accessToken) {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${connection.accessToken}`, {
          method: 'POST',
        });
      }

      setConnection({
        isConnected: false,
        email: '',
        connectedAt: '',
        accessToken: null,
        refreshToken: null
      });
      setMonitoredEmails([]);
      localStorage.removeItem('gmail_connection');
      
      console.log('🔌 Gmail desconectado');
      
      toast({
        title: "Gmail desconectado",
        description: "A conexão com o Gmail foi removida com sucesso.",
      });
    } catch (error) {
      console.error('❌ Erro ao desconectar Gmail:', error);
      
      // Mesmo com erro, limpar dados locais
      setConnection({
        isConnected: false,
        email: '',
        connectedAt: '',
        accessToken: null,
        refreshToken: null
      });
      setMonitoredEmails([]);
      localStorage.removeItem('gmail_connection');
      
      toast({
        title: "Gmail desconectado",
        description: "Conexão removida (alguns dados podem ter permanecido no Google).",
        variant: "destructive",
      });
    }
  };

  // Iniciar monitoramento de emails
  const startMonitoring = useCallback(() => {
    if (!connection.accessToken || !isConfigured) {
      console.warn('⚠️ Não é possível monitorar sem token de acesso ou configuração');
      return;
    }
    
    // Parar monitoramento anterior se existir
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }
    
    console.log(`📧 Iniciando monitoramento de emails a cada ${configuration.monitoringInterval} segundos...`);
    setIsMonitoring(true);
    
    // Primeira verificação imediata
    setTimeout(() => {
      console.log('🔍 Primeira verificação de emails...');
      checkNewEmails();
    }, 1000);
    
    // Configurar intervalo de verificação
    const interval = setInterval(() => {
      console.log(`🔄 Verificação periódica de emails (${configuration.monitoringInterval}s)...`);
      checkNewEmails();
    }, configuration.monitoringInterval * 1000);

    setMonitoringInterval(interval);
  }, [connection.accessToken, isConfigured, configuration.monitoringInterval, monitoringInterval]);

  // Parar monitoramento
  const stopMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }
    setIsMonitoring(false);
    console.log('🛑 Monitoramento de emails parado');
  };

  // Verificar novos emails com busca mais flexível
  const checkNewEmails = async () => {
    if (!connection.accessToken || !isConfigured) return;
    
    try {
      console.log('🔍 Verificando novos emails...');
      
      // Construir múltiplas queries para busca mais abrangente
      const queries = [];
      
      // Query 1: Remetentes específicos
      if (configuration.monitoredSenders.length > 0) {
        const senderQueries = configuration.monitoredSenders.map(sender => `from:${sender}`).join(' OR ');
        queries.push(`(${senderQueries})`);
      }
      
      // Query 2: Palavras-chave no assunto
      if (configuration.keywordsToMonitor.length > 0) {
        const subjectQueries = configuration.keywordsToMonitor.map(keyword => `subject:"${keyword}"`).join(' OR ');
        queries.push(`(${subjectQueries})`);
      }
      
      // Query 3: Números de processo no conteúdo (busca por padrões comuns)
      const processPatterns = [
        'subject:processo',
        'subject:número',
        'subject:decisão',
        'subject:sentença',
        'subject:julgamento',
        'body:processo',
        'body:número'
      ];
      queries.push(`(${processPatterns.join(' OR ')})`);
      
      // Se não há configuração específica, buscar emails recentes
      if (queries.length === 0) {
        queries.push('is:unread OR label:important');
      }
      
      // Combinar queries
      let finalQuery = queries.join(' OR ');
      
      // Limitar por data - buscar últimos 3 dias se primeira vez, senão usar timestamp
      if (lastEmailCheck) {
        const lastCheckTime = parseInt(lastEmailCheck);
        const oneDayAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
        
        // Usar o menor entre lastCheck e 1 dia atrás para evitar perder emails
        const searchAfter = Math.min(lastCheckTime, oneDayAgo);
        finalQuery += ` after:${searchAfter}`;
      } else {
        // Na primeira vez, buscar emails dos últimos 3 dias
        const threeDaysAgo = Math.floor((Date.now() - 3 * 24 * 60 * 60 * 1000) / 1000);
        finalQuery += ` after:${threeDaysAgo}`;
      }
      
      console.log('🔍 [DEBUG] Query final de busca:', finalQuery);
      
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(finalQuery)}&maxResults=30`,
        {
          headers: {
            'Authorization': `Bearer ${connection.accessToken}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.error) {
        console.error('❌ Erro ao buscar emails:', data.error);
        
        if (data.error.code === 401) {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            setTimeout(() => checkNewEmails(), 1000);
          }
        } else {
          updateEmailStats({ errorsCount: emailStats.errorsCount + 1 });
        }
        return;
      }

      if (data.messages && data.messages.length > 0) {
        console.log(`📬 ${data.messages.length} emails encontrados`);
        
        const newEmails: MonitoredEmail[] = [];
        
        for (const message of data.messages) {
          const emailData = await processEmailMessage(message.id, false);
          if (emailData) {
            newEmails.push(emailData);
          }
        }
        
        if (newEmails.length > 0) {
          console.log(`📧 ${newEmails.length} novos emails processados`);
          
          // Adicionar novos emails, mantendo os 50 mais recentes
          setMonitoredEmails(prev => [...newEmails, ...prev].slice(0, 50));
          
          // Atualizar estatísticas
          updateEmailStats({
            totalProcessed: emailStats.totalProcessed + newEmails.length,
            lastSync: new Date().toLocaleString('pt-BR')
          });
          
          if (configuration.notificationLevel !== 'none') {
            const importantEmails = newEmails.filter(email => email.priority === 'high');
            const shouldNotify = configuration.notificationLevel === 'all' || importantEmails.length > 0;
            
            if (shouldNotify) {
              toast({
                title: "Novos emails detectados!",
                description: `${newEmails.length} emails foram processados${importantEmails.length > 0 ? ` (${importantEmails.length} importantes)` : ''}.`,
              });
            }
          }
        }
        
        // Atualizar timestamp da última verificação
        setLastEmailCheck(Math.floor(Date.now() / 1000).toString());
      } else {
        console.log('📭 Nenhum novo email encontrado');
        updateEmailStats({ lastSync: new Date().toLocaleString('pt-BR') });
      }
      
    } catch (error) {
      console.error('❌ Erro ao verificar emails:', error);
      updateEmailStats({ errorsCount: emailStats.errorsCount + 1 });
    }
  };

  // Processar email individual com melhorias
  const processEmailMessage = async (messageId: string, isDebugMode: boolean = false): Promise<MonitoredEmail | null> => {
    try {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
        {
          headers: {
            'Authorization': `Bearer ${connection.accessToken}`,
          },
        }
      );

      const message = await response.json();
      
      if (message.error) {
        console.error('❌ Erro ao obter detalhes do email:', message.error);
        return null;
      }

      const headers = message.payload.headers;
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
      const from = headers.find((h: any) => h.name === 'From')?.value || '';
      const date = headers.find((h: any) => h.name === 'Date')?.value || '';
      
      // Extrair conteúdo do email de forma mais robusta
      let emailContent = '';
      const extractTextFromPart = (part: any): string => {
        let text = '';
        
        if (part.body?.data) {
          try {
            text += atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          } catch (e) {
            console.warn('Erro ao decodificar parte do email:', e);
          }
        }
        
        if (part.parts) {
          part.parts.forEach((subPart: any) => {
            if (subPart.mimeType === 'text/plain' || subPart.mimeType === 'text/html') {
              text += extractTextFromPart(subPart);
            }
          });
        }
        
        return text;
      };

      if (message.payload.parts) {
        emailContent = extractTextFromPart(message.payload);
      } else {
        emailContent = extractTextFromPart(message.payload);
      }

      // Usar snippet do Gmail se conteúdo não estiver disponível
      if (!emailContent && message.snippet) {
        emailContent = message.snippet;
      }

      console.log(`📧 [${isDebugMode ? 'DEBUG' : 'NORMAL'}] Processando email:`, { subject, from, date });
      
      // Usar função melhorada para extrair números de processo
      const foundProcesses = extractProcessNumbers(`${subject} ${emailContent}`);

      // Verificar palavras-chave correspondentes
      const matchedKeywords = configuration.keywordsToMonitor.filter(keyword =>
        `${subject} ${emailContent}`.toLowerCase().includes(keyword.toLowerCase())
      );

      // Detectar status no conteúdo
      const statusDetection = detectStatusFromContent(`${subject} ${emailContent}`);

      // Determinar prioridade
      const priority = determinePriority(subject, emailContent, from, matchedKeywords);

      // Criar objeto de email monitorado
      const monitoredEmail: MonitoredEmail = {
        id: messageId,
        subject,
        from,
        content: emailContent,
        snippet: message.snippet || emailContent.substring(0, 150) + '...',
        receivedAt: new Date(date).toLocaleString('pt-BR'),
        processNumbers: foundProcesses || [],
        status: 'Novo',
        priority,
        matched_keywords: matchedKeywords,
        debugInfo: isDebugMode ? {
          foundProcessNumbers: foundProcesses || [],
          matchedKeywords,
          statusDetected: statusDetection.status || 'Nenhum',
          processMatched: false,
          statusChanged: false
        } : undefined
      };

      // Processar email para atualizações de processo
      const processResult = await processEmailForUpdates({
        subject,
        content: emailContent,
        from,
        receivedAt: date,
        processNumbers: foundProcesses || [],
        statusDetection
      });

      if (processResult.updated) {
        monitoredEmail.status = `Processado - ${processResult.action}`;
        if (monitoredEmail.debugInfo) {
          monitoredEmail.debugInfo.processMatched = true;
          monitoredEmail.debugInfo.statusChanged = processResult.updated;
        }
      } else if (monitoredEmail.debugInfo) {
        monitoredEmail.debugInfo.processMatched = false;
        monitoredEmail.debugInfo.statusChanged = false;
      }

      return monitoredEmail;

    } catch (error) {
      console.error('❌ Erro ao processar email:', error);
      return null;
    }
  };

  // Determinar prioridade do email
  const determinePriority = (subject: string, content: string, from: string, keywords: string[]): 'high' | 'medium' | 'low' => {
    const text = `${subject} ${content}`.toLowerCase();
    
    // Palavras que indicam alta prioridade
    const highPriorityWords = ['urgente', 'prazo', 'audiência', 'julgamento', 'sentença', 'citação', 'intimação'];
    const hasHighPriorityWords = highPriorityWords.some(word => text.includes(word));
    
    // Remetentes importantes (tribunais, etc.)
    const isImportantSender = from.toLowerCase().includes('tribunal') || 
                             from.toLowerCase().includes('justiça') ||
                             from.toLowerCase().includes('tjsp') ||
                             from.toLowerCase().includes('tjrj');
    
    if (hasHighPriorityWords || isImportantSender) {
      return 'high';
    }
    
    if (keywords.length > 0) {
      return 'medium';
    }
    
    return 'low';
  };

  // Processar email para atualizações de casos - VERSÃO COMPLETAMENTE REESCRITA
  const processEmailForUpdates = async (email: any): Promise<{ updated: boolean; action: string }> => {
    console.log('🔍 [PROCESS] Iniciando processamento de atualização:', {
      subject: email.subject,
      from: email.from,
      processNumbers: email.processNumbers,
      statusDetection: email.statusDetection
    });

    let processUpdated = false;
    let updateAction = '';
    
    // Se temos números de processo específicos, processar cada um
    if (email.processNumbers && email.processNumbers.length > 0) {
      console.log('🔗 [PROCESS] Números de processo encontrados:', email.processNumbers);
      
      for (const processNumber of email.processNumbers) {
        console.log(`🔍 [PROCESS] Analisando processo: ${processNumber}`);
        
        // Normalizar número do processo para comparação
        const normalizedSearchNumber = normalizeProcessNumber(processNumber);
        
        // Buscar processo correspondente com comparação mais flexível
        const relatedProcess = processes.find(p => {
          const normalizedProcessNumber = normalizeProcessNumber(p.number);
          
          // Comparação exata
          if (normalizedProcessNumber === normalizedSearchNumber) {
            return true;
          }
          
          // Comparação por substring (para casos onde o formato pode variar)
          if (normalizedProcessNumber.includes(normalizedSearchNumber) || 
              normalizedSearchNumber.includes(normalizedProcessNumber)) {
            return true;
          }
          
          // Comparação sem zeros à esquerda
          const trimmedProcess = normalizedProcessNumber.replace(/^0+/, '');
          const trimmedSearch = normalizedSearchNumber.replace(/^0+/, '');
          
          return trimmedProcess === trimmedSearch;
        });
        
        if (relatedProcess) {
          console.log(`🎯 [PROCESS] Processo relacionado encontrado:`, {
            numeroEmail: processNumber,
            numeroSistema: relatedProcess.number,
            titulo: relatedProcess.title,
            statusAtual: relatedProcess.status
          });
          
          // Verificar se há mudança de status
          if (email.statusDetection && email.statusDetection.status) {
            const newStatusKey = email.statusDetection.status;
            const newStatusDisplay = getStatusDisplay(newStatusKey);
            const currentStatusKey = getStatusKey(relatedProcess.status);
            
            console.log(`📊 [PROCESS] Comparação de status:`, {
              statusAtual: relatedProcess.status,
              statusAtualKey: currentStatusKey,
              novoStatusKey: newStatusKey,
              novoStatusDisplay: newStatusDisplay,
              palavraChave: email.statusDetection.keyword
            });
            
            if (newStatusKey !== currentStatusKey) {
              console.log(`🔄 [PROCESS] Atualizando status do processo ${processNumber}:`, {
                de: relatedProcess.status,
                para: newStatusDisplay,
                palavraChave: email.statusDetection.keyword
              });
              
              // Atualizar o processo
              const updateData = {
                status: newStatusDisplay as any,
                observacoes: `${relatedProcess.observacoes || ''}\n\n[${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}] Status atualizado automaticamente via email de ${email.from}.\nPalavra-chave detectada: "${email.statusDetection.keyword}"\nConteúdo relevante: "${email.subject}"`
              };
              
              try {
                updateProcess(relatedProcess.id, updateData);
                processUpdated = true;
                updateAction = `Status alterado para "${newStatusDisplay}"`;
                
                console.log(`✅ [PROCESS] Processo ${processNumber} atualizado com sucesso`);
                
                // Mostrar notificação de sucesso
                toast({
                  title: "🎯 Processo atualizado automaticamente!",
                  description: `Processo ${processNumber} alterado para "${newStatusDisplay}" baseado em email de ${email.from.split('<')[0].trim()}`,
                });
                
                // Criar eventos na agenda para audiências se detectadas
                if (email.subject.toLowerCase().includes('audiência') || 
                    email.subject.toLowerCase().includes('audiencia') ||
                    email.content.toLowerCase().includes('audiência') ||
                    email.content.toLowerCase().includes('audiencia')) {
                  
                  console.log('📅 [PROCESS] Audiência detectada, tentando extrair data...');
                  
                  // Regex mais abrangente para datas
                  const dateRegexes = [
                    /(\d{1,2}\/\d{1,2}\/\d{4})/g,
                    /(\d{1,2}\.\d{1,2}\.\d{4})/g,
                    /(\d{1,2}-\d{1,2}-\d{4})/g,
                    /(\d{4}-\d{1,2}-\d{1,2})/g
                  ];
                  
                  let foundDate = null;
                  const searchText = `${email.subject} ${email.content}`;
                  
                  for (const regex of dateRegexes) {
                    const matches = searchText.match(regex);
                    if (matches && matches.length > 0) {
                      foundDate = matches[0];
                      break;
                    }
                  }
                  
                  if (foundDate) {
                    console.log('📅 [PROCESS] Data de audiência encontrada:', foundDate);
                    
                    try {
                      const eventDate = convertToISODate(foundDate);
                      
                      addEvent({
                        titulo: `Audiência - ${relatedProcess.title}`,
                        tipo: 'audiencia',
                        data: eventDate,
                        hora: '09:00',
                        local: 'Conforme notificação judicial',
                        cliente: relatedProcess.clientName || 'Cliente não informado',
                        processo: processNumber,
                        prioridade: 'alta',
                        status: 'confirmado',
                        descricao: `Audiência detectada automaticamente via email de ${email.from}`,
                        tipoCompromisso: 'proximos',
                        enviarLembrete: true
                      });
                      
                      console.log('📅 [PROCESS] Evento de audiência criado automaticamente');
                      
                      toast({
                        title: "📅 Audiência agendada!",
                        description: `Audiência para ${foundDate} foi adicionada à agenda automaticamente.`,
                      });
                    } catch (dateError) {
                      console.error('❌ [PROCESS] Erro ao converter data:', dateError);
                    }
                  } else {
                    console.log('ℹ️ [PROCESS] Audiência detectada mas data não encontrada');
                  }
                }
                
              } catch (updateError) {
                console.error('❌ [PROCESS] Erro ao atualizar processo:', updateError);
              }
            } else {
              console.log(`ℹ️ [PROCESS] Status do processo ${processNumber} já está como "${newStatusDisplay}" - nenhuma alteração necessária`);
            }
          } else {
            console.log(`ℹ️ [PROCESS] Nenhuma mudança de status detectada no email para o processo ${processNumber}`);
          }
        } else {
          console.log(`❌ [PROCESS] Processo não encontrado para o número: ${processNumber}`);
          console.log(`🔍 [PROCESS] Processos disponíveis:`, processes.map(p => ({ id: p.id, number: p.number, normalized: normalizeProcessNumber(p.number) })));
        }
      }
    } else {
      console.log('ℹ️ [PROCESS] Nenhum número de processo encontrado no email');
    }
    
    // Atualizar estatísticas se houve atualizações
    if (processUpdated) {
      updateEmailStats({ processUpdates: emailStats.processUpdates + 1 });
      console.log('✅ [PROCESS] Estatísticas de email atualizadas - processo(s) modificado(s)');
    }
    
    return { updated: processUpdated, action: updateAction };
  };

  // Funções auxiliares para conversão de status
  const getStatusDisplay = (statusKey: string): string => {
    const statusMap = {
      'em_andamento': 'Em andamento',
      'concluido': 'Concluído',
      'arquivado': 'Arquivado',
      'suspenso': 'Suspenso'
    };
    return statusMap[statusKey as keyof typeof statusMap] || statusKey;
  };

  const getStatusKey = (statusDisplay: string): string => {
    const displayToKey = {
      'Em andamento': 'em_andamento',
      'em_andamento': 'em_andamento',
      'Concluído': 'concluido',
      'concluido': 'concluido',
      'Arquivado': 'arquivado',
      'arquivado': 'arquivado',
      'Suspenso': 'suspenso',
      'suspenso': 'suspenso'
    };
    return displayToKey[statusDisplay as keyof typeof displayToKey] || statusDisplay.toLowerCase().replace(' ', '_');
  };

  // Atualizar estatísticas
  const updateEmailStats = (updates: Partial<EmailStats>) => {
    setEmailStats(prev => ({ ...prev, ...updates }));
  };

  // Renovar token de acesso
  const refreshAccessToken = async () => {
    if (!connection.refreshToken || !credentials) return false;
    
    try {
      console.log('🔄 Renovando token de acesso...');
      
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          refresh_token: connection.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      const tokens = await response.json();
      
      if (tokens.error) {
        throw new Error(tokens.error_description);
      }

      const updatedConnection = {
        ...connection,
        accessToken: tokens.access_token,
      };

      setConnection(updatedConnection);
      localStorage.setItem('gmail_connection', JSON.stringify(updatedConnection));
      
      console.log('✅ Token renovado com sucesso');
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao renovar token:', error);
      return false;
    }
  };

  // Função auxiliar para converter data melhorada
  const convertToISODate = (dateStr: string) => {
    // Tentar diferentes formatos de data
    const formats = [
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // DD/MM/YYYY
      /(\d{1,2})\.(\d{1,2})\.(\d{4})/, // DD.MM.YYYY
      /(\d{1,2})-(\d{1,2})-(\d{4})/, // DD-MM-YYYY
      /(\d{4})-(\d{1,2})-(\d{1,2})/ // YYYY-MM-DD
    ];
    
    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        if (format === formats[3]) { // YYYY-MM-DD
          return dateStr;
        } else { // DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY
          const [, day, month, year] = match;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
    }
    
    // Fallback: tentar Date.parse
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  return {
    connection,
    isMonitoring,
    connectGmail,
    disconnectGmail,
    changeCredentials,
    checkNewEmails,
    testConnection,
    isTestingConnection,
    hasCredentials,
    showCredentialsModal,
    setShowCredentialsModal,
    saveCredentials,
    monitoredEmails,
    emailStats,
    startMonitoring,
    stopMonitoring,
    processAllRecentEmails,
    debugMode,
  };
};
