import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const PROCESSOS_STORAGE_KEY = 'juridico_processos';

// Função para registrar ação no histórico
const registrarAcao = (processo: any, tipoAcao: string, detalhes?: string) => {
  if (!processo.historico_acoes) {
    processo.historico_acoes = [];
  }
  
  processo.historico_acoes.push({
    id: Date.now().toString(),
    data: new Date().toISOString(),
    tipo: tipoAcao,
    detalhes: detalhes || '',
    status_anterior: processo.status_anterior || processo.status,
    status_atual: processo.status
  });
  
  // Manter apenas os últimos 100 registros para não sobrecarregar
  if (processo.historico_acoes.length > 100) {
    processo.historico_acoes = processo.historico_acoes.slice(-100);
  }
};

export const useProcessesData = () => {
  const [localProcessos, setLocalProcessos] = useState<any[]>([]);
  const queryClient = useQueryClient();

  // Função para carregar processos do localStorage
  const loadProcessos = useCallback(() => {
    try {
      const processosData = localStorage.getItem(PROCESSOS_STORAGE_KEY);
      if (processosData) {
        const processos = JSON.parse(processosData);
        console.log('Processos carregados do localStorage:', processos.length);
        setLocalProcessos(processos);
        return processos;
      }
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    }
    return [];
  }, []);

  // Carregar processos na inicialização
  useEffect(() => {
    loadProcessos();
  }, [loadProcessos]);

  // Escutar mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PROCESSOS_STORAGE_KEY) {
        console.log('Processos alterados via storage event, recarregando...');
        loadProcessos();
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        queryClient.invalidateQueries({ queryKey: ['processos-by-status'] });
        queryClient.invalidateQueries({ queryKey: ['processos-by-status-period'] });
        queryClient.invalidateQueries({ queryKey: ['processos-by-area'] });
        queryClient.invalidateQueries({ queryKey: ['processos-recentes'] });
      }
    };

    const handleCustomUpdate = () => {
      console.log('Processos alterados via evento customizado, recarregando...');
      loadProcessos();
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['processos-by-status'] });
      queryClient.invalidateQueries({ queryKey: ['processos-by-status-period'] });
      queryClient.invalidateQueries({ queryKey: ['processos-by-area'] });
      queryClient.invalidateQueries({ queryKey: ['processos-recentes'] });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('processosUpdated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('processosUpdated', handleCustomUpdate);
    };
  }, [loadProcessos, queryClient]);

  // Mapear dados para o formato da tabela - FILTRAR processos ocultos e removidos
  const processes = useMemo(() => {
    console.log('Recalculando processes. Total antes do filtro:', localProcessos.length);
    
    // Filtrar processos que não foram ocultos nem removidos
    const processosVisiveisAtivos = localProcessos.filter(processo => 
      !processo.hidden && !processo.deleted
    );
    
    console.log('Processos visíveis e ativos após filtro:', processosVisiveisAtivos.length);
    
    return processosVisiveisAtivos.map(processo => ({
      id: processo.id,
      number: processo.numero,
      title: processo.titulo,
      clientName: processo.cliente_nome,
      clientId: processo.cliente_id,
      area: processo.area,
      date: new Date(processo.data_abertura).toLocaleDateString('pt-BR'),
      status: (() => {
        const statusMap = {
          'em_andamento': 'Em andamento',
          'suspenso': 'Suspenso',
          'arquivado': 'Arquivado', 
          'concluido': 'Concluído'
        } as const;
        return statusMap[processo.status as keyof typeof statusMap] || 'Em andamento';
      })() as "Em andamento" | "Suspenso" | "Arquivado" | "Concluído",
      lastUpdate: new Date(processo.data_atualizacao).toLocaleDateString('pt-BR'),
      valor_causa: processo.valor_causa,
      observacoes: processo.observacoes,
      documents: [] as string[],
      history: [] as Array<{
        date: string;
        event: string;
        description: string;
        user: string;
      }>
    }));
  }, [localProcessos]);

  // Função para salvar no localStorage
  const saveProcessos = useCallback((processos: any[]) => {
    try {
      localStorage.setItem(PROCESSOS_STORAGE_KEY, JSON.stringify(processos));
      setLocalProcessos(processos);
      console.log('Processos salvos no localStorage:', processos.length);
      
      window.dispatchEvent(new CustomEvent('processosUpdated'));
      
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['processos-by-status'] });
      queryClient.invalidateQueries({ queryKey: ['processos-by-status-period'] });
      queryClient.invalidateQueries({ queryKey: ['processos-by-area'] });
      queryClient.invalidateQueries({ queryKey: ['processos-recentes'] });
      
    } catch (error) {
      console.error('Erro ao salvar processos:', error);
    }
  }, [queryClient]);

  // Função para obter processos ocultos
  const getHiddenProcesses = useCallback(() => {
    return localProcessos.filter(processo => processo.hidden && !processo.deleted);
  }, [localProcessos]);

  // Função para obter processos removidos
  const getRemovedProcesses = useCallback(() => {
    return localProcessos.filter(processo => processo.deleted);
  }, [localProcessos]);

  // Método para buscar processos por cliente
  const getProcessesByClient = (clientId: string) => {
    return processes.filter(process => process.clientId === clientId);
  };

  // Método para buscar processo por ID
  const getProcessById = (processId: string) => {
    return processes.find(process => process.id === processId) || null;
  };

  // Método para adicionar processo
  const addProcess = useCallback((novoProcesso: any) => {
    const processo = {
      ...novoProcesso,
      id: Date.now().toString(),
      data_abertura: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
      status: 'em_andamento',
      status_original: 'em_andamento',
      historico_acoes: []
    };

    // Registrar criação no histórico
    registrarAcao(processo, 'criacao', 'Processo criado');

    const novosProcessos = [processo, ...localProcessos];
    saveProcessos(novosProcessos);
    console.log('Novo processo adicionado:', processo);
    
    return processo;
  }, [localProcessos, saveProcessos]);

  // Método para atualizar processo
  const updateProcess = useCallback((processId: string, updates: any) => {
    console.log('🔄 Atualizando processo:', processId, updates);
    
    const statusMap = {
      'Em andamento': 'em_andamento',
      'Suspenso': 'suspenso',
      'Arquivado': 'arquivado',
      'Concluído': 'concluido'
    };

    const novosProcessos = localProcessos.map(processo => {
      if (processo.id === processId) {
        const updatedProcess = { ...processo };
        const statusAnterior = processo.status;
        
        // Se está ocultando/removendo, preservar o status original
        if (updates.hidden && !processo.hidden) {
          updatedProcess.status_original = processo.status;
          updatedProcess.hidden = true;
          updatedProcess.data_atualizacao = new Date().toISOString();
          registrarAcao(updatedProcess, 'ocultacao', `Processo ocultado com status: ${statusAnterior}`);
          console.log('🙈 Processo ocultado, status original preservado:', processo.status);
        } 
        else if (updates.deleted && !processo.deleted) {
          updatedProcess.status_original = processo.status;
          updatedProcess.deleted = true;
          updatedProcess.data_atualizacao = new Date().toISOString();
          registrarAcao(updatedProcess, 'remocao', `Processo removido com status: ${statusAnterior}`);
          console.log('🗑️ Processo removido, status original preservado:', processo.status);
        }
        // Se está restaurando, recuperar o status original
        else if ((updates.hidden === false && processo.hidden) || 
                 (updates.deleted === false && processo.deleted)) {
          updatedProcess.status = processo.status_original || processo.status;
          updatedProcess.hidden = false;
          updatedProcess.deleted = false;
          updatedProcess.data_atualizacao = new Date().toISOString();
          registrarAcao(updatedProcess, 'restauracao', `Processo restaurado para status: ${updatedProcess.status}`);
          console.log('🔄 Processo restaurado com status original:', updatedProcess.status);
        }
        // Atualizações normais
        else {
          const mappedUpdates = {
            ...updates,
            status: updates.status ? statusMap[updates.status as keyof typeof statusMap] || updates.status : processo.status,
            data_atualizacao: new Date().toISOString()
          };
          
          // Registrar mudança de status se houve
          if (mappedUpdates.status && mappedUpdates.status !== statusAnterior) {
            registrarAcao(updatedProcess, 'mudanca_status', `Status alterado de ${statusAnterior} para ${mappedUpdates.status}`);
          }
          
          Object.assign(updatedProcess, mappedUpdates);
        }
        
        return updatedProcess;
      }
      return processo;
    });
    
    saveProcessos(novosProcessos);
    console.log('✅ Processo atualizado:', processId);
    
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['processos-by-status'] });
      queryClient.invalidateQueries({ queryKey: ['processos-by-status-period'] });
      queryClient.invalidateQueries({ queryKey: ['processos-by-area'] });
      queryClient.invalidateQueries({ queryKey: ['processos-recentes'] });
    }, 100);
    
  }, [localProcessos, saveProcessos, queryClient]);

  return { 
    processes, 
    getProcessesByClient, 
    getProcessById, 
    updateProcess,
    addProcess,
    getHiddenProcesses,
    getRemovedProcesses
  };
};
