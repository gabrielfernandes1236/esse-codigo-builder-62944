
import { useState } from "react";
import { Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import { RecentProcessesDetailed } from "./RecentProcessesDetailed";
import { EditProcessModal } from "./EditProcessModal";
import { useProcessosLocalStorage } from "@/hooks/useProcessosLocalStorage";
import { useProcessesData } from "@/hooks/useProcessesData";
import { useNavigate } from "react-router-dom";

export const RecentProcesses = () => {
  const [showDetailed, setShowDetailed] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProcessId, setEditingProcessId] = useState<string | null>(null);
  const { obterProcessosRecentes } = useProcessosLocalStorage();
  const { processes, updateProcess } = useProcessesData();
  const navigate = useNavigate();
  
  // Obter os 3 processos mais recentes para exibição resumida usando o hook atualizado
  const processesResumed = processes.slice(0, 3).map(processo => {
    const getClientInitials = (nome: string) => {
      return nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    const getStatusStyle = (status: string) => {
      const styleMap = {
        'Em andamento': 'bg-green-100 text-green-800',
        'Suspenso': 'bg-yellow-100 text-yellow-800',
        'Arquivado': 'bg-blue-100 text-blue-800', 
        'Concluído': 'bg-gray-100 text-gray-800'
      };
      return styleMap[status as keyof typeof styleMap] || 'bg-gray-100 text-gray-800';
    };

    return {
      id: processo.id,
      number: processo.number,
      client: { 
        name: processo.clientName, 
        type: "PF", 
        initials: getClientInitials(processo.clientName), 
        bgColor: "bg-blue-100", 
        textColor: "text-blue-500" 
      },
      area: processo.area,
      status: { 
        label: processo.status, 
        style: getStatusStyle(processo.status) 
      },
      lastUpdate: processo.lastUpdate
    };
  });

  // Obter processos dos últimos 5 dias para exibição detalhada usando o hook atualizado
  const processesDetailed = showDetailed ? (() => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    
    return processes.filter(processo => {
      const processoDate = new Date(processo.date.split('/').reverse().join('-'));
      return processoDate >= fiveDaysAgo;
    }).map(processo => {
      const getClientInitials = (nome: string) => {
        return nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      };

      const getStatusStyle = (status: string) => {
        const styleMap = {
          'Em andamento': 'bg-green-100 text-green-800',
          'Suspenso': 'bg-yellow-100 text-yellow-800',
          'Arquivado': 'bg-blue-100 text-blue-800', 
          'Concluído': 'bg-gray-100 text-gray-800'
        };
        return styleMap[status as keyof typeof styleMap] || 'bg-gray-100 text-gray-800';
      };

      return {
        id: processo.id,
        number: processo.number,
        client: { 
          name: processo.clientName, 
          type: "PF", 
          initials: getClientInitials(processo.clientName), 
          bgColor: "bg-blue-100", 
          textColor: "text-blue-500" 
        },
        area: processo.area,
        status: { 
          label: processo.status, 
          style: getStatusStyle(processo.status) 
        },
        lastUpdate: processo.lastUpdate
      };
    });
  })() : [];

  const processesToShow = showDetailed ? processesDetailed : processesResumed;

  // Handlers para as ações dos botões - CORRIGIDOS
  const handleEditProcess = (processId: string) => {
    console.log('🖊️ Editando processo:', processId);
    setEditingProcessId(processId);
    setShowEditModal(true);
  };

  const handleHideProcess = (processId: string) => {
    console.log('👁️ Ocultando processo:', processId);
    // Marcar como oculto - mesma lógica da página Processos
    updateProcess(processId, { hidden: true });
  };

  const handleDeleteProcess = (processId: string) => {
    console.log('🗑️ Removendo processo:', processId);
    // Marcar como removido - mesma lógica da página Processos
    updateProcess(processId, { deleted: true });
  };

  if (showDetailed) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setShowDetailed(false)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Voltar ao resumo
          </button>
          <button 
            onClick={() => navigate('/processos')}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            Ver todos os processos existentes
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Processos dos Últimos 5 Dias</h3>
          </div>
          <div className="overflow-x-auto">
            {processesToShow.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhum processo encontrado nos últimos 5 dias
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Processo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Área
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Atualização
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processesToShow.map((process, index) => (
                    <tr key={process.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{process.number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full ${process.client.bgColor} flex items-center justify-center ${process.client.textColor}`}>
                            <span className="text-xs font-medium">{process.client.initials}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{process.client.name}</div>
                            <div className="text-sm text-gray-500">{process.client.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{process.area}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${process.status.style}`}>
                          {process.status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {process.lastUpdate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleHideProcess(process.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Ocultar processo"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleEditProcess(process.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Editar processo"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProcess(process.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Remover processo"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Edit Process Modal */}
        <EditProcessModal 
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingProcessId(null);
          }}
          processId={editingProcessId}
          onSave={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Últimos Processos</h3>
          <button 
            onClick={() => setShowDetailed(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Ver todos
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {processesToShow.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhum processo encontrado
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atualização
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processesToShow.map((process, index) => (
                <tr key={process.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{process.number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full ${process.client.bgColor} flex items-center justify-center ${process.client.textColor}`}>
                        <span className="text-xs font-medium">{process.client.initials}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{process.client.name}</div>
                        <div className="text-sm text-gray-500">{process.client.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{process.area}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${process.status.style}`}>
                      {process.status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {process.lastUpdate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleHideProcess(process.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Ocultar processo"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEditProcess(process.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Editar processo"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProcess(process.id)}
                        className="text-gray-400 hover:text-red-500"
                        title="Remover processo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Process Modal */}
      <EditProcessModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProcessId(null);
        }}
        processId={editingProcessId}
        onSave={() => {}}
      />
    </div>
  );
};
