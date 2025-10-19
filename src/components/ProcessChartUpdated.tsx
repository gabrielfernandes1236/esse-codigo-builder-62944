
import { useState } from "react";
import { useProcessosByStatus } from "@/hooks/useDashboardData";
import { useProcessosByStatusPeriod } from "@/hooks/useProcessosByStatusPeriod";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ProcessStatusModal } from "./ProcessStatusModal";
import { ClickableTooltip } from "./ClickableTooltip";

const chartConfig = {
  processos: {
    label: "Processos",
    color: "#3b82f6",
  },
};

export const ProcessChartUpdated = () => {
  const { data: statusData, isLoading } = useProcessosByStatus();
  const [viewMode, setViewMode] = useState<'diario' | 'semanal' | 'mensal' | 'anual'>('anual');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    titulo: string;
    processos: any[];
    status: string;
  }>({ titulo: '', processos: [], status: '' });

  // Usar hook específico para dados por período quando não for anual
  const { data: periodData, isLoading: isPeriodLoading } = useProcessosByStatusPeriod(viewMode);

  const isLoadingData = viewMode === 'anual' ? isLoading : isPeriodLoading;
  const currentData = viewMode === 'anual' ? statusData : periodData;

  const handleColumnClick = (status: string, count: number) => {
    if (count === 0) return;

    const statusMap: Record<string, string> = {
      'processos': 'Processos Gerais',
      'em_andamento': 'Em Andamento',
      'suspenso': 'Suspenso',
      'arquivado': 'Arquivado', 
      'concluido': 'Concluído',
      'ocultos': 'Ocultos',
      'removidos': 'Removidos'
    };

    let processos: any[] = [];
    
    // Para dados anuais, não temos processosDetalhados, então não podemos mostrar o modal
    if (viewMode === 'anual') {
      console.log('Modal não disponível para dados anuais');
      return;
    }
    
    // Para dados de período (diário, semanal, mensal), usar os processosDetalhados
    if (periodData?.processosDetalhados) {
      processos = periodData.processosDetalhados[status] || [];
    }
    
    console.log(`📋 Abrindo modal para ${status} no período ${viewMode}:`, processos.length, 'processos');
    
    setModalData({
      titulo: statusMap[status] || status,
      processos,
      status
    });
    setModalOpen(true);
  };

  if (isLoadingData) {
    return (
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Processos por Status</h3>
          <div className="flex space-x-2">
            <button className="text-sm text-gray-500 hover:text-gray-700">Diário</button>
            <button className="text-sm text-gray-500 hover:text-gray-700">Semanal</button>
            <button className="text-sm text-gray-500 hover:text-gray-700">Mensal</button>
            <button className="text-sm text-blue-600 font-medium">Anual</button>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  const getChartData = () => {
    // Todos os filtros agora seguem a mesma estrutura: 6 colunas por status
    return [
      {
        status: "Em Andamento",
        processos: currentData?.em_andamento || 0,
        fill: "#3b82f6"
      },
      {
        status: "Suspenso", 
        processos: currentData?.suspenso || 0,
        fill: "#f59e0b"
      },
      {
        status: "Arquivado",
        processos: currentData?.arquivado || 0,
        fill: "#6b7280"
      },
      {
        status: "Concluído",
        processos: currentData?.concluido || 0,
        fill: "#10b981"
      },
      {
        status: "Ocultos",
        processos: currentData?.ocultos || 0,
        fill: "#8b5cf6"
      },
      {
        status: "Removidos", 
        processos: currentData?.removidos || 0,
        fill: "#ef4444"
      }
    ];
  };

  const chartData = getChartData();

  return (
    <>
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Processos por Status</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode('diario')}
              className={`text-sm ${viewMode === 'diario' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Diário
            </button>
            <button 
              onClick={() => setViewMode('semanal')}
              className={`text-sm ${viewMode === 'semanal' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Semanal
            </button>
            <button 
              onClick={() => setViewMode('mensal')}
              className={`text-sm ${viewMode === 'mensal' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Mensal
            </button>
            <button 
              onClick={() => setViewMode('anual')}
              className={`text-sm ${viewMode === 'anual' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Anual
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 5, left: 5, bottom: 20 }}>
                <XAxis 
                  dataKey="status" 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  height={25}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <ChartTooltip 
                  content={<ClickableTooltip onColumnClick={handleColumnClick} />}
                />
                <Bar 
                  dataKey="processos" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      <ProcessStatusModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        titulo={modalData.titulo}
        processos={modalData.processos}
        periodo={viewMode}
      />
    </>
  );
};
