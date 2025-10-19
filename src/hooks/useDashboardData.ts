
import { useQuery } from '@tanstack/react-query';
import { DashboardStats, ProcessosByStatus, ProcessosByArea, Cliente, Processo, Agenda, Financeiro } from '@/types';

// Mock data - em produção viria do Supabase
const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'Ana Beatriz Mendes',
    email: 'ana@email.com',
    telefone: '(11) 99999-9999',
    cpf_cnpj: '123.456.789-00',
    status: 'ativo',
    data_cadastro: '2024-01-15'
  },
  {
    id: '2',
    nome: 'Carlos Roberto Silva',
    email: 'carlos@email.com',
    telefone: '(11) 88888-8888',
    cpf_cnpj: '987.654.321-00',
    status: 'ativo',
    data_cadastro: '2024-02-20'
  }
];

const mockAgenda: Agenda[] = [
  {
    id: '1',
    titulo: 'Audiência de Conciliação',
    tipo: 'audiencia',
    processo_id: '1',
    cliente_id: '1',
    data_inicio: '2024-06-20T09:30:00',
    data_fim: '2024-06-20T10:30:00',
    local: 'Fórum Central - Sala 305',
    status: 'agendado'
  },
  {
    id: '2',
    titulo: 'Reunião com Cliente',
    tipo: 'reuniao',
    cliente_id: '1',
    data_inicio: '2024-06-20T14:00:00',
    data_fim: '2024-06-20T15:00:00',
    local: 'Escritório - Sala de Reuniões',
    status: 'agendado'
  }
];

const mockFinanceiro: Financeiro[] = [
  {
    id: '1',
    tipo: 'receita',
    descricao: 'Honorários - Processo Trabalhista',
    valor: 15000,
    data_vencimento: '2024-06-15',
    data_pagamento: '2024-06-15',
    status: 'pago',
    cliente_id: '1',
    processo_id: '1',
    categoria: 'Honorários'
  },
  {
    id: '2',
    tipo: 'receita',
    descricao: 'Consultoria Jurídica',
    valor: 5000,
    data_vencimento: '2024-06-10',
    data_pagamento: '2024-06-10',
    status: 'pago',
    cliente_id: '2',
    categoria: 'Consultoria'
  }
];

const CLIENTS_STORAGE_KEY = 'juridico_clientes';
const PROCESSOS_STORAGE_KEY = 'juridico_processos';

const getActiveClientsFromStorage = (): number => {
  try {
    const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (storedClients) {
      const clients = JSON.parse(storedClients);
      // Filtrar apenas clientes ativos e não ocultos
      const activeClients = clients.filter((client: any) => 
        client.status === 'Ativo' && !client.hidden
      );
      console.log('Clientes ativos encontrados no localStorage:', activeClients.length);
      return activeClients.length;
    }
  } catch (error) {
    console.error('Erro ao ler clientes do localStorage:', error);
  }
  return 0;
};

const getProcessosFromStorage = () => {
  try {
    const processosData = localStorage.getItem(PROCESSOS_STORAGE_KEY);
    if (processosData) {
      const processos = JSON.parse(processosData);
      console.log('Processos encontrados no localStorage:', processos.length);
      
      // Filtrar apenas processos visíveis e ativos (não ocultos nem removidos)
      const processosVisiveisAtivos = processos.filter((processo: any) => 
        !processo.hidden && !processo.deleted
      );
      
      console.log('Processos visíveis e ativos:', processosVisiveisAtivos.length);
      return { todos: processos, ativos: processosVisiveisAtivos };
    }
  } catch (error) {
    console.error('Erro ao ler processos do localStorage:', error);
  }
  return { todos: [], ativos: [] };
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ler processos do localStorage (apenas visíveis e ativos para o KPI)
      const { ativos: processosAtivos } = getProcessosFromStorage();
      const processos_ativos = processosAtivos.filter((p: any) => p.status === 'em_andamento').length;
      
      console.log('📊 Dashboard Stats - Processos totais visíveis:', processosAtivos.length);
      console.log('📊 Dashboard Stats - Processos em andamento:', processos_ativos);
      
      const audiencias_pendentes = mockAgenda.filter(a => 
        a.tipo === 'audiencia' && 
        a.status === 'agendado' && 
        new Date(a.data_inicio) > new Date()
      ).length;
      
      // Ler clientes ativos do localStorage
      const clientes_ativos = getActiveClientsFromStorage();
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const receita_mensal = mockFinanceiro
        .filter(f => {
          const date = new Date(f.data_pagamento || f.data_vencimento);
          return f.tipo === 'receita' && 
                 f.status === 'pago' &&
                 date.getMonth() === currentMonth &&
                 date.getFullYear() === currentYear;
        })
        .reduce((sum, f) => sum + f.valor, 0);
      
      return {
        processos_ativos,
        audiencias_pendentes,
        clientes_ativos,
        receita_mensal
      };
    },
    refetchInterval: 1000, // Refetch a cada segundo para manter sincronizado
  });
};

export const useProcessosByStatus = () => {
  return useQuery({
    queryKey: ['processos-by-status'],
    queryFn: async (): Promise<ProcessosByStatus & { ocultos: number; removidos: number }> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Ler TODOS os processos para contar incluindo ocultos e removidos
      const { todos: todosProcessos } = getProcessosFromStorage();
      
      // Contar processos por status (apenas ativos para os status normais)
      const processosAtivos = todosProcessos.filter((processo: any) => 
        !processo.hidden && !processo.deleted
      );
      
      const statusCount = processosAtivos.reduce((acc: any, processo: any) => {
        acc[processo.status] = (acc[processo.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Contar ocultos e removidos
      const ocultos = todosProcessos.filter((processo: any) => processo.hidden && !processo.deleted).length;
      const removidos = todosProcessos.filter((processo: any) => processo.deleted).length;
      
      console.log('📊 Processos por Status - Contagem:', statusCount);
      console.log('📊 Processos Ocultos:', ocultos);
      console.log('📊 Processos Removidos:', removidos);
      
      return {
        em_andamento: statusCount.em_andamento || 0,
        suspenso: statusCount.suspenso || 0,
        arquivado: statusCount.arquivado || 0,
        concluido: statusCount.concluido || 0,
        ocultos,
        removidos
      };
    }
  });
};

export const useProcessosByArea = () => {
  return useQuery({
    queryKey: ['processos-by-area'],
    queryFn: async (): Promise<ProcessosByArea[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Ler processos do localStorage (apenas visíveis e ativos)
      const { ativos: processosAtivos } = getProcessosFromStorage();
      
      const areaCount = processosAtivos.reduce((acc: any, processo: any) => {
        acc[processo.area] = (acc[processo.area] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const total = processosAtivos.length;
      
      return Object.entries(areaCount).map(([area, count]) => ({
        area,
        total: count as number,
        percentual: total > 0 ? Math.round(((count as number) / total) * 100) : 0
      }));
    }
  });
};

export const useProcessosRecentes = () => {
  return useQuery({
    queryKey: ['processos-recentes'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Ler processos do localStorage (apenas visíveis e ativos)
      const { ativos: processosAtivos } = getProcessosFromStorage();
      
      // Ordenar do mais novo para o mais antigo
      const processosOrdenados = [...processosAtivos].sort((a: any, b: any) => 
        new Date(b.data_abertura).getTime() - new Date(a.data_abertura).getTime()
      );
      
      console.log('📊 Processos Recentes - Total ordenados:', processosOrdenados.length);
      
      return processosOrdenados.slice(0, 10); // Últimos 10 processos
    }
  });
};

export const useClientes = () => {
  return useQuery({
    queryKey: ['clientes-ativos'],
    queryFn: () => {
      try {
        const clientsData = localStorage.getItem('juridico_clientes');
        if (!clientsData) return [];
        
        const allClients = JSON.parse(clientsData);
        // Filtrar apenas clientes ativos e não ocultos
        const activeClients = allClients.filter((client: any) => 
          client.status === 'Ativo' && !client.hidden
        );
        
        // Mapear para o formato esperado pelo modal de processo
        return activeClients.map((client: any) => ({
          id: client.id,
          nome: client.name,
          email: client.email,
          telefone: client.phone,
          cpf_cnpj: client.cpf_cnpj,
          status: 'ativo',
          data_cadastro: client.registrationDate
        }));
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        return [];
      }
    },
    staleTime: 0, // Sempre revalidar para garantir dados atualizados
    refetchOnWindowFocus: true,
  });
};
