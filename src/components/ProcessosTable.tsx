import React, { useState, useMemo } from 'react';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, EyeOff } from 'lucide-react';
import { useProcessesData } from '@/hooks/useProcessesData';
import { useClientsData } from '@/hooks/useClientsData';

interface ProcessosTableProps {
  searchTerm: string;
  selectedStatus: string;
  selectedType: string;
  selectedClient: string;
  onEditProcess: (processId: string) => void;
}

export const ProcessosTable = ({
  searchTerm,
  selectedStatus,
  selectedType,
  selectedClient,
  onEditProcess
}: ProcessosTableProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHiddenModal, setShowHiddenModal] = useState(false);
  const [showRemovedModal, setShowRemovedModal] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const { processes, updateProcess, getHiddenProcesses, getRemovedProcesses } = useProcessesData();
  const { clients } = useClientsData();

  // Obter processos ocultos e removidos usando os métodos do hook
  const hiddenProcesses = getHiddenProcesses();
  const removedProcesses = getRemovedProcesses();

  // Filtrar processos ordenados do mais recente para o mais antigo
  const filteredProcesses = useMemo(() => {
    let filtered = processes.filter(process => {
      // Filtro de busca
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesNumber = process.number.toLowerCase().includes(searchLower);
        const matchesClient = process.clientName.toLowerCase().includes(searchLower);
        if (!matchesNumber && !matchesClient) return false;
      }

      // Filtro de status
      if (selectedStatus !== 'Todos' && selectedStatus !== 'Status') {
        if (process.status !== selectedStatus) return false;
      }

      // Filtro de tipo
      if (selectedType !== 'Todos' && selectedType !== 'Tipo de Ação') {
        if (process.area !== selectedType) return false;
      }

      // Filtro de cliente
      if (selectedClient !== 'Todos' && selectedClient !== 'Cliente') {
        if (process.clientName !== selectedClient) return false;
      }

      return true;
    });

    // Ordenar do mais recente para o mais antigo (assumindo que IDs maiores = mais recentes)
    return filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }, [processes, searchTerm, selectedStatus, selectedType, selectedClient]);

  // Paginação
  const totalPages = Math.ceil(filteredProcesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProcesses = filteredProcesses.slice(startIndex, startIndex + itemsPerPage);

  const getColorClasses = (color: string, type: 'bg' | 'text') => {
    const colorMap = {
      blue: type === 'bg' ? 'bg-blue-100' : 'text-blue-500',
      purple: type === 'bg' ? 'bg-purple-100' : 'text-purple-500',
      green: type === 'bg' ? 'bg-green-100' : 'text-green-500',
      yellow: type === 'bg' ? 'bg-yellow-100' : 'text-yellow-500',
      red: type === 'bg' ? 'bg-red-100' : 'text-red-500',
      indigo: type === 'bg' ? 'bg-indigo-100' : 'text-indigo-500',
      gray: type === 'bg' ? 'bg-gray-100' : 'text-gray-500',
      pink: type === 'bg' ? 'bg-pink-100' : 'text-pink-500'
    };
    return colorMap[color as keyof typeof colorMap] || (type === 'bg' ? 'bg-gray-100' : 'text-gray-500');
  };

  const getStatusClasses = (status: string) => {
    const statusMap = {
      'Em andamento': 'bg-green-100 text-green-800',
      'Suspenso': 'bg-yellow-100 text-yellow-800',
      'Arquivado': 'bg-blue-100 text-blue-800',
      'Concluído': 'bg-gray-100 text-gray-800'
    };
    return statusMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800';
  };

  const getTypeClasses = (area: string) => {
    const typeMap = {
      'Cível': 'bg-blue-100 text-blue-800',
      'Trabalhista': 'bg-purple-100 text-purple-800',
      'Tributário': 'bg-yellow-100 text-yellow-800',
      'Criminal': 'bg-red-100 text-red-800',
      'Administrativo': 'bg-indigo-100 text-indigo-800',
      'Família': 'bg-pink-100 text-pink-800',
      'Empresarial': 'bg-green-100 text-green-800',
      'Propriedade Intelectual': 'bg-purple-100 text-purple-800',
      'Ambiental': 'bg-green-100 text-green-800',
      'Previdenciário': 'bg-blue-100 text-blue-800'
    };
    return typeMap[area as keyof typeof typeMap] || 'bg-gray-100 text-gray-800';
  };

  const getClientInitials = (clientName: string) => {
    const client = clients.find(c => c.name === clientName);
    return client?.initials || clientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getClientColor = (clientName: string) => {
    const client = clients.find(c => c.name === clientName);
    return client?.color || 'gray';
  };

  const handleHideProcess = (processId: string) => {
    console.log('👁️ Ocultando processo:', processId);
    updateProcess(processId, { hidden: true });
  };

  const handleRemoveProcess = (processId: string) => {
    console.log('🗑️ Removendo processo:', processId);
    updateProcess(processId, { deleted: true });
    setShowDeleteModal(false);
    setSelectedProcessId(null);
  };

  const handleRestoreProcess = (processId: string, type: 'hidden' | 'removed') => {
    console.log('🔄 Restaurando processo:', processId, type);
    if (type === 'hidden') {
      updateProcess(processId, { hidden: false });
    } else {
      updateProcess(processId, { deleted: false });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº do Processo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Ação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comarca
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Início
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próximo Prazo
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProcesses.map((processo) => (
                <tr key={processo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{processo.number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full ${getColorClasses(getClientColor(processo.clientName), 'bg')} flex items-center justify-center ${getColorClasses(getClientColor(processo.clientName), 'text')}`}>
                        <span className="text-xs font-medium">{getClientInitials(processo.clientName)}</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{processo.clientName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeClasses(processo.area)}`}>
                      {processo.area}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    São Paulo - SP
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {processo.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(processo.status)}`}>
                      {processo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{processo.lastUpdate}</div>
                    <div className="text-xs text-gray-500">Próxima ação</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleHideProcess(processo.id)}
                        className="text-gray-400 hover:text-blue-600" 
                        title="Ocultar"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                          <EyeOff className="w-4 h-4" />
                        </div>
                      </button>
                      <button 
                        onClick={() => onEditProcess(processo.id)}
                        className="text-gray-400 hover:text-blue-600" 
                        title="Editar"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                          <Edit className="w-4 h-4" />
                        </div>
                      </button>
                      <button 
                        className="text-gray-400 hover:text-red-500" 
                        title="Excluir"
                        onClick={() => {
                          setSelectedProcessId(processo.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                          <Trash2 className="w-4 h-4" />
                        </div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap disabled:opacity-50"
              >
                Anterior
              </button>
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredProcesses.length)}</span> de <span className="font-medium">{filteredProcesses.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Próximo</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowHiddenModal(true)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Ver Processos Ocultos ({hiddenProcesses.length})
            </button>
            <button 
              onClick={() => setShowRemovedModal(true)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Ver Processos Removidos ({removedProcesses.length})
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <div className="w-6 h-6 flex items-center justify-center text-red-500">
                <Trash2 className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Tem certeza que deseja remover este processo? Ele será movido para processos removidos.
            </p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProcessId(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg whitespace-nowrap hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button 
                onClick={() => selectedProcessId && handleRemoveProcess(selectedProcessId)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg whitespace-nowrap hover:bg-red-600"
              >
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Processes Modal */}
      {showHiddenModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Processos Ocultos</h3>
              <button 
                onClick={() => setShowHiddenModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Fechar</span>
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {hiddenProcesses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum processo oculto.</p>
              ) : (
                <div className="space-y-4">
                  {hiddenProcesses.map(processo => (
                    <div key={processo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium">{processo.numero}</div>
                        <div className="text-sm text-gray-500">{processo.titulo} - {processo.cliente_nome}</div>
                      </div>
                      <button
                        onClick={() => handleRestoreProcess(processo.id, 'hidden')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Restaurar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Removed Processes Modal */}
      {showRemovedModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Processos Removidos</h3>
              <button 
                onClick={() => setShowRemovedModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Fechar</span>
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {removedProcesses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum processo removido.</p>
              ) : (
                <div className="space-y-4">
                  {removedProcesses.map(processo => (
                    <div key={processo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium">{processo.numero}</div>
                        <div className="text-sm text-gray-500">{processo.titulo} - {processo.cliente_nome}</div>
                      </div>
                      <button
                        onClick={() => handleRestoreProcess(processo.id, 'removed')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Restaurar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
