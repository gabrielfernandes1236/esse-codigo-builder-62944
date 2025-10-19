
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { TarefaModal } from "@/components/TarefaModal";
import { TarefaCard } from "@/components/TarefaCard";
import { TarefaFiltersModal } from "@/components/TarefaFiltersModal";
import { TarefaEditModal } from "@/components/TarefaEditModal";
import { useTarefas } from "@/hooks/useTarefas";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const TarefasDiarias = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPagePendentes, setCurrentPagePendentes] = useState(1);
  const [currentPageConcluidas, setCurrentPageConcluidas] = useState(1);
  const [filtros, setFiltros] = useState({
    urgente: true,
    moderada: true,
    normal: true
  });
  
  const { 
    tarefasPendentes, 
    tarefasConcluidas, 
    adicionarTarefa, 
    concluirTarefa, 
    reabrirTarefa,
    editarTarefa
  } = useTarefas();

  const handleFiltroChange = (filtro: 'urgente' | 'moderada' | 'normal') => {
    setFiltros(prev => ({
      ...prev,
      [filtro]: !prev[filtro]
    }));
    // Reset pagination when filters change
    setCurrentPagePendentes(1);
    setCurrentPageConcluidas(1);
  };

  const handleEditTarefa = (tarefa: any) => {
    setEditingTarefa(tarefa);
    setIsEditModalOpen(true);
  };

  const filterTarefas = (tarefas: any[]) => {
    return tarefas.filter(tarefa => {
      const matchesFilter = filtros[tarefa.urgencia];
      const matchesSearch = searchTerm === "" || 
        tarefa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarefa.urgencia.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  };

  const tarefasPendentesFiltradas = filterTarefas(tarefasPendentes);
  const tarefasConcluidasFiltradas = filterTarefas(tarefasConcluidas);

  const ITEMS_PER_PAGE = 5;
  
  const paginatedPendentes = tarefasPendentesFiltradas.slice(
    (currentPagePendentes - 1) * ITEMS_PER_PAGE,
    currentPagePendentes * ITEMS_PER_PAGE
  );
  
  const paginatedConcluidas = tarefasConcluidasFiltradas.slice(
    (currentPageConcluidas - 1) * ITEMS_PER_PAGE,
    currentPageConcluidas * ITEMS_PER_PAGE
  );

  const totalPagesPendentes = Math.ceil(tarefasPendentesFiltradas.length / ITEMS_PER_PAGE);
  const totalPagesConcluidas = Math.ceil(tarefasConcluidasFiltradas.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-gray-50 flex h-screen overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
          <div className="flex items-center">
            <h1 className="text-xl font-medium">Tarefas Diárias</h1>
          </div>
          <div className="flex items-center space-x-3">
            <UserProfileDropdown />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Search and Nova Tarefa Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md block w-full pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Buscar tarefas..." 
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setIsFiltersModalOpen(true)}
                variant="outline"
                className="flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa
              </Button>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Pendentes</h2>
              <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-md">
                {tarefasPendentesFiltradas.length} tarefas
              </span>
            </div>
            <div className="space-y-3">
              {paginatedPendentes.map((tarefa) => (
                <TarefaCard
                  key={tarefa.id}
                  tarefa={tarefa}
                  onConcluir={concluirTarefa}
                  onEdit={handleEditTarefa}
                />
              ))}
            </div>
            {totalPagesPendentes > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPagePendentes(Math.max(1, currentPagePendentes - 1))}
                        className={currentPagePendentes === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPagesPendentes }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPagePendentes(page)}
                          isActive={currentPagePendentes === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPagePendentes(Math.min(totalPagesPendentes, currentPagePendentes + 1))}
                        className={currentPagePendentes === totalPagesPendentes ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Completed Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Concluídas</h2>
              <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-md">
                {tarefasConcluidasFiltradas.length} tarefas
              </span>
            </div>
            <div className="space-y-3">
              {paginatedConcluidas.map((tarefa) => (
                <TarefaCard
                  key={tarefa.id}
                  tarefa={tarefa}
                  onReabrir={reabrirTarefa}
                  onEdit={handleEditTarefa}
                />
              ))}
            </div>
            {totalPagesConcluidas > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPageConcluidas(Math.max(1, currentPageConcluidas - 1))}
                        className={currentPageConcluidas === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPagesConcluidas }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPageConcluidas(page)}
                          isActive={currentPageConcluidas === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPageConcluidas(Math.min(totalPagesConcluidas, currentPageConcluidas + 1))}
                        className={currentPageConcluidas === totalPagesConcluidas ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TarefaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={adicionarTarefa}
      />

      <TarefaFiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
      />

      <TarefaEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tarefa={editingTarefa}
        onSave={editarTarefa}
      />
    </div>
  );
};
