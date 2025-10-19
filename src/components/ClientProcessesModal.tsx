
import React, { useState } from 'react';
import { X, Eye, Filter } from 'lucide-react';
import { ProcessHistoryModal } from './ProcessHistoryModal';
import { useProcessesData } from '@/hooks/useProcessesData';

interface Process {
  id: string;
  number: string;
  title: string;
  area: string;
  status: string;
  date: string;
}

interface ClientProcessesModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

export const ClientProcessesModal = ({ 
  isOpen, 
  onClose, 
  clientId,
  clientName
}: ClientProcessesModalProps) => {
  const { getProcessesByClient, getProcessById } = useProcessesData();
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  if (!isOpen) return null;

  const allProcesses = getProcessesByClient(clientId);
  const filteredProcesses = statusFilter === 'Todos' 
    ? allProcesses 
    : allProcesses.filter(process => process.status === statusFilter);

  const handleProcessClick = (processId: string) => {
    setSelectedProcess(processId);
    setShowHistoryModal(true);
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedProcess(null);
  };

  const selectedProcessData = selectedProcess ? getProcessById(selectedProcess) : null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Processos de {clientName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filtro de Status */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtrar por Status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Todos">Todos</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Suspenso">Suspenso</option>
                <option value="Arquivado">Arquivado</option>
                <option value="Concluído">Concluído</option>
              </select>
              <span className="text-sm text-gray-500">
                ({filteredProcesses.length} de {allProcesses.length} processos)
              </span>
            </div>
          </div>

          <div className="p-6 overflow-y-auto">
            {filteredProcesses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {statusFilter === 'Todos' 
                    ? 'Nenhum processo encontrado para este cliente.' 
                    : `Nenhum processo com status "${statusFilter}" encontrado.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Número do Processo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Título
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Área
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data de Criação
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProcesses.map((process) => (
                      <tr 
                        key={process.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleProcessClick(process.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-mono">{process.number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{process.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {process.area}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            process.status === 'Em andamento' 
                              ? 'bg-green-100 text-green-800' 
                              : process.status === 'Suspenso'
                              ? 'bg-yellow-100 text-yellow-800'
                              : process.status === 'Arquivado'
                              ? 'bg-gray-100 text-gray-800'
                              : process.status === 'Concluído'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {process.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {process.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-gray-400 hover:text-blue-600" 
                            title="Ver Histórico do Processo"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProcessClick(process.id);
                            }}
                          >
                            <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                              <Eye className="w-4 h-4" />
                            </div>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Histórico do Processo */}
      <ProcessHistoryModal
        isOpen={showHistoryModal}
        onClose={handleCloseHistoryModal}
        process={selectedProcessData}
      />
    </>
  );
};
