
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { DashboardStatsUpdated } from "@/components/DashboardStatsUpdated";
import { ProcessChartUpdated } from "@/components/ProcessChartUpdated";
import { DistribuicaoAreaUpdated } from "@/components/DistribuicaoAreaUpdated";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { ImportantDeadlines } from "@/components/ImportantDeadlines";
import { RecentProcesses } from "@/components/RecentProcesses";
import { ExportModal } from "@/components/ExportModal";
import { NovoProcessoModal } from "@/components/NovoProcessoModal";
import { TarefasUrgentesModal } from "@/components/TarefasUrgentesModal";
import { AlertBadge } from "@/components/AlertBadge";
import { useTarefas } from "@/hooks/useTarefas";
import { useDashboardRefresh } from "@/hooks/useDashboardRefresh";

const Index = () => {
  // Inicializar o hook de refresh do dashboard
  useDashboardRefresh();
  
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [novoProcessoModalOpen, setNovoProcessoModalOpen] = useState(false);
  const [tarefasUrgentesModalOpen, setTarefasUrgentesModalOpen] = useState(false);
  
  const { tarefasPendentes, concluirTarefa } = useTarefas();
  const tarefasUrgentes = tarefasPendentes.filter(t => t.urgencia === 'urgente');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              <div className="flex items-center space-x-3">
                {tarefasUrgentes.length > 0 && (
                  <AlertBadge 
                    count={tarefasUrgentes.length}
                    onClick={() => setTarefasUrgentesModalOpen(true)}
                  />
                )}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setExportModalOpen(true)}
                    className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap hover:bg-gray-50"
                  >
                    <i className="ri-download-line mr-2"></i>
                    Exportar
                  </button>
                  <button 
                    onClick={() => setNovoProcessoModalOpen(true)}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg whitespace-nowrap hover:bg-blue-700"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Novo Processo
                  </button>
                </div>
              </div>
            </div>

            <DashboardStatsUpdated />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <ProcessChartUpdated />
              </div>
              <div>
                <DistribuicaoAreaUpdated />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <UpcomingEvents />
              <ImportantDeadlines />
            </div>

            <RecentProcesses />
          </div>
        </main>
      </div>

      <ExportModal 
        isOpen={exportModalOpen} 
        onClose={() => setExportModalOpen(false)} 
      />
      
      <NovoProcessoModal 
        isOpen={novoProcessoModalOpen} 
        onClose={() => setNovoProcessoModalOpen(false)} 
      />

      <TarefasUrgentesModal
        isOpen={tarefasUrgentesModalOpen}
        onClose={() => setTarefasUrgentesModalOpen(false)}
        tarefasUrgentes={tarefasUrgentes}
        tarefasPendentes={tarefasPendentes}
        onConcluir={concluirTarefa}
      />
    </div>
  );
};

export default Index;
