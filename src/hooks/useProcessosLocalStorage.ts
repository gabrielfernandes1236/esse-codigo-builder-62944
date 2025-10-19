import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface ProcessoLocal {
  id: string;
  numero: string;
  titulo: string;
  cliente_id: string;
  cliente_nome: string;
  area: string;
  status: 'em_andamento' | 'suspenso' | 'arquivado' | 'concluido';
  valor_causa: number;
  data_abertura: string;
  data_atualizacao: string;
  observacoes?: string;
}

const PROCESSOS_STORAGE_KEY = 'juridico_processos';

export const useProcessosLocalStorage = () => {
  const [processos, setProcessos] = useState<ProcessoLocal[]>([]);
  const queryClient = useQueryClient();

  // Função para recarregar processos do localStorage
  const recarregarProcessos = () => {
    try {
      const processosData = localStorage.getItem(PROCESSOS_STORAGE_KEY);
      if (processosData) {
        const processosArray = JSON.parse(processosData);
        setProcessos(processosArray);
        console.log('Processos recarregados do localStorage:', processosArray.length);
        return processosArray;
      }
    } catch (error) {
      console.error('Erro ao recarregar processos do localStorage:', error);
    }
    return [];
  };

  // Carregar processos do localStorage na inicialização
  useEffect(() => {
    recarregarProcessos();
  }, []);

  // Listener para mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PROCESSOS_STORAGE_KEY) {
        recarregarProcessos();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const salvarProcessos = (novosProcessos: ProcessoLocal[]) => {
    try {
      localStorage.setItem(PROCESSOS_STORAGE_KEY, JSON.stringify(novosProcessos));
      setProcessos(novosProcessos);
      
      // Invalidar queries para atualizar dashboard IMEDIATAMENTE
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['processos-by-status'] });
      queryClient.invalidateQueries({ queryKey: ['processos-by-area'] });
      queryClient.invalidateQueries({ queryKey: ['processos-recentes'] });
      
      console.log('Processos salvos no localStorage:', novosProcessos.length);
      
      // Disparar eventos para notificar mudanças imediatamente
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('processosUpdated'));
        window.dispatchEvent(new CustomEvent('forceProcessUpdate'));
      }, 0);
      
    } catch (error) {
      console.error('Erro ao salvar processos no localStorage:', error);
    }
  };

  const adicionarProcesso = (novoProcesso: Omit<ProcessoLocal, 'id' | 'data_abertura' | 'data_atualizacao' | 'status'>) => {
    const processo: ProcessoLocal = {
      ...novoProcesso,
      id: Date.now().toString(),
      data_abertura: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
      status: 'em_andamento' // Sempre iniciar como em_andamento
    };

    const novosProcessos = [processo, ...processos];
    salvarProcessos(novosProcessos);
    console.log('Novo processo adicionado:', processo);
    
    // Forçar refetch das queries do dashboard
    queryClient.refetchQueries({ queryKey: ['dashboard-stats'] });
    queryClient.refetchQueries({ queryKey: ['processos-by-status'] });
    queryClient.refetchQueries({ queryKey: ['processos-by-area'] });
    queryClient.refetchQueries({ queryKey: ['processos-recentes'] });
    
    return processo;
  };

  const atualizarProcesso = (id: string, dadosAtualizados: Partial<ProcessoLocal>) => {
    const novosProcessos = processos.map(processo => 
      processo.id === id 
        ? { 
            ...processo, 
            ...dadosAtualizados, 
            data_atualizacao: new Date().toISOString() 
          }
        : processo
    );
    salvarProcessos(novosProcessos);
    console.log('Processo atualizado:', id, dadosAtualizados);
    
    // Forçar refetch das queries do dashboard
    queryClient.refetchQueries({ queryKey: ['dashboard-stats'] });
    queryClient.refetchQueries({ queryKey: ['processos-by-status'] });
    queryClient.refetchQueries({ queryKey: ['processos-by-area'] });
    queryClient.refetchQueries({ queryKey: ['processos-recentes'] });
  };

  const obterProcessosPorStatus = () => {
    return {
      em_andamento: processos.filter(p => p.status === 'em_andamento').length,
      suspenso: processos.filter(p => p.status === 'suspenso').length,
      arquivado: processos.filter(p => p.status === 'arquivado').length,
      concluido: processos.filter(p => p.status === 'concluido').length
    };
  };

  const obterProcessosPorArea = () => {
    const areaCount = processos.reduce((acc, processo) => {
      acc[processo.area] = (acc[processo.area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = processos.length;
    
    return Object.entries(areaCount).map(([area, count]) => ({
      area,
      total: count,
      percentual: total > 0 ? Math.round((count / total) * 100) : 0
    }));
  };

  const obterProcessosRecentes = (limite: number = 10) => {
    return [...processos]
      .sort((a, b) => new Date(b.data_abertura).getTime() - new Date(a.data_abertura).getTime())
      .slice(0, limite);
  };

  return {
    processos,
    adicionarProcesso,
    atualizarProcesso,
    obterProcessosPorStatus,
    obterProcessosPorArea,
    obterProcessosRecentes,
    recarregarProcessos
  };
};
