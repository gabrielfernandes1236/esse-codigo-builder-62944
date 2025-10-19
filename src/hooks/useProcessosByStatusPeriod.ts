
import { useQuery } from '@tanstack/react-query';
import { ProcessosByStatus } from '@/types';
import { getPeriodFilter } from '@/utils/dateUtils';

const PROCESSOS_STORAGE_KEY = 'juridico_processos';

interface ProcessosByStatusPeriodResult extends ProcessosByStatus {
  ocultos: number;
  removidos: number;
  processosDetalhados: {
    em_andamento: any[];
    suspenso: any[];
    arquivado: any[];
    concluido: any[];
    ocultos: any[];
    removidos: any[];
  };
}

export const useProcessosByStatusPeriod = (periodo: 'diario' | 'semanal' | 'mensal' | 'anual') => {
  return useQuery({
    queryKey: ['processos-by-status-period', periodo],
    queryFn: async (): Promise<ProcessosByStatusPeriodResult> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const isInPeriod = getPeriodFilter(periodo);
      
      try {
        const processosData = localStorage.getItem(PROCESSOS_STORAGE_KEY);
        if (!processosData) {
          return {
            em_andamento: 0,
            suspenso: 0,
            arquivado: 0,
            concluido: 0,
            ocultos: 0,
            removidos: 0,
            processosDetalhados: {
              em_andamento: [],
              suspenso: [],
              arquivado: [],
              concluido: [],
              ocultos: [],
              removidos: []
            }
          };
        }

        const todosProcessos = JSON.parse(processosData);
        
        // Processos que tiveram ações no período
        const processosComAcoes = todosProcessos.filter((processo: any) => {
          if (!processo.historico_acoes || !Array.isArray(processo.historico_acoes)) {
            // Se não tem histórico, considerar pela data de criação/atualização
            return isInPeriod(processo.data_abertura) || isInPeriod(processo.data_atualizacao);
          }
          
          // Verificar se teve alguma ação no período
          return processo.historico_acoes.some((acao: any) => isInPeriod(acao.data));
        });

        console.log(`📊 Processos com ações no período ${periodo}:`, processosComAcoes.length);

        // Contar por status atual (apenas processos visíveis e ativos)
        const processosAtivos = processosComAcoes.filter((processo: any) => 
          !processo.hidden && !processo.deleted
        );

        const statusCount = processosAtivos.reduce((acc: any, processo: any) => {
          acc[processo.status] = (acc[processo.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Contar ocultos e removidos do período
        const ocultos = processosComAcoes.filter((processo: any) => 
          processo.hidden && !processo.deleted
        ).length;
        
        const removidos = processosComAcoes.filter((processo: any) => 
          processo.deleted
        ).length;

        // Organizar processos detalhados por status para o modal
        const processosDetalhados = {
          em_andamento: processosAtivos.filter((p: any) => p.status === 'em_andamento'),
          suspenso: processosAtivos.filter((p: any) => p.status === 'suspenso'),
          arquivado: processosAtivos.filter((p: any) => p.status === 'arquivado'),
          concluido: processosAtivos.filter((p: any) => p.status === 'concluido'),
          ocultos: processosComAcoes.filter((p: any) => p.hidden && !p.deleted),
          removidos: processosComAcoes.filter((p: any) => p.deleted)
        };

        return {
          em_andamento: statusCount.em_andamento || 0,
          suspenso: statusCount.suspenso || 0,
          arquivado: statusCount.arquivado || 0,
          concluido: statusCount.concluido || 0,
          ocultos,
          removidos,
          processosDetalhados
        };
        
      } catch (error) {
        console.error('Erro ao processar dados por período:', error);
        return {
          em_andamento: 0,
          suspenso: 0,
          arquivado: 0,
          concluido: 0,
          ocultos: 0,
          removidos: 0,
          processosDetalhados: {
            em_andamento: [],
            suspenso: [],
            arquivado: [],
            concluido: [],
            ocultos: [],
            removidos: []
          }
        };
      }
    }
  });
};
