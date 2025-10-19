
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OfficeConfiguration {
  firmName: string;
  workEmail: string;
  monitoredSenders: string[];
  keywordsToMonitor: string[];
  monitoringInterval: number; // em segundos
  autoProcessEmails: boolean;
  notificationLevel: 'all' | 'important' | 'none';
}

const DEFAULT_CONFIGURATION: OfficeConfiguration = {
  firmName: '',
  workEmail: '',
  monitoredSenders: [],
  keywordsToMonitor: [
    'processo',
    'audiência',
    'julgamento',
    'despacho',
    'sentença',
    'decisão',
    'intimação',
    'citação',
    'tribunal'
  ],
  monitoringInterval: 20, // 20 segundos
  autoProcessEmails: true,
  notificationLevel: 'important'
};

export const useOfficeConfiguration = () => {
  const [configuration, setConfiguration] = useState<OfficeConfiguration>(DEFAULT_CONFIGURATION);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Carregar configuração salva
  useEffect(() => {
    const savedConfig = localStorage.getItem('office_configuration');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfiguration({ ...DEFAULT_CONFIGURATION, ...parsedConfig });
        console.log('⚙️ Configuração do escritório carregada:', parsedConfig);
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
      }
    }
  }, []);

  // Salvar configuração
  const saveConfiguration = async (newConfig: Partial<OfficeConfiguration>) => {
    setIsLoading(true);
    try {
      const updatedConfig = { ...configuration, ...newConfig };
      setConfiguration(updatedConfig);
      localStorage.setItem('office_configuration', JSON.stringify(updatedConfig));
      
      console.log('💾 Configuração salva:', updatedConfig);
      
      toast({
        title: "Configuração salva",
        description: "As configurações do escritório foram atualizadas com sucesso.",
      });
      
      return updatedConfig;
    } catch (error) {
      console.error('❌ Erro ao salvar configuração:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar remetente para monitoramento
  const addMonitoredSender = (email: string) => {
    if (!email || configuration.monitoredSenders.includes(email)) return;
    
    const updatedSenders = [...configuration.monitoredSenders, email];
    saveConfiguration({ monitoredSenders: updatedSenders });
  };

  // Remover remetente do monitoramento
  const removeMonitoredSender = (email: string) => {
    const updatedSenders = configuration.monitoredSenders.filter(sender => sender !== email);
    saveConfiguration({ monitoredSenders: updatedSenders });
  };

  // Adicionar palavra-chave
  const addKeyword = (keyword: string) => {
    if (!keyword || configuration.keywordsToMonitor.includes(keyword.toLowerCase())) return;
    
    const updatedKeywords = [...configuration.keywordsToMonitor, keyword.toLowerCase()];
    saveConfiguration({ keywordsToMonitor: updatedKeywords });
  };

  // Remover palavra-chave
  const removeKeyword = (keyword: string) => {
    const updatedKeywords = configuration.keywordsToMonitor.filter(k => k !== keyword);
    saveConfiguration({ keywordsToMonitor: updatedKeywords });
  };

  // Resetar configuração
  const resetConfiguration = () => {
    setConfiguration(DEFAULT_CONFIGURATION);
    localStorage.removeItem('office_configuration');
    
    toast({
      title: "Configuração resetada",
      description: "As configurações foram restauradas para os valores padrão.",
    });
  };

  // Validar configuração
  const validateConfiguration = () => {
    const errors: string[] = [];
    
    if (!configuration.firmName.trim()) {
      errors.push('Nome do escritório é obrigatório');
    }
    
    if (!configuration.workEmail.trim()) {
      errors.push('Email do escritório é obrigatório');
    }
    
    if (configuration.monitoredSenders.length === 0) {
      errors.push('Pelo menos um remetente deve ser monitorado');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return {
    configuration,
    isLoading,
    saveConfiguration,
    addMonitoredSender,
    removeMonitoredSender,
    addKeyword,
    removeKeyword,
    resetConfiguration,
    validateConfiguration,
    isConfigured: !!(configuration.firmName && configuration.workEmail && configuration.monitoredSenders.length > 0)
  };
};
