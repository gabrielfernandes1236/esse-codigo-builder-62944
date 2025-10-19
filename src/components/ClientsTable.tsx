
import React, { useState, useMemo, useEffect } from 'react';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, EyeOff } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  type: 'PF' | 'PJ';
  phone: string;
  location: string;
  processCount: number;
  registrationDate: string;
  status: 'Ativo' | 'Inativo';
  initials: string;
  color: string;
  cpf_cnpj: string;
  address?: string;
  documents?: string[];
  hidden?: boolean;
}

interface ClientsTableProps {
  searchTerm: string;
  selectedType: string;
  selectedStatus: string;
  clients: Client[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onHideClient: (clientId: string) => void;
  onViewProcesses: (clientId: string, clientName: string) => void;
}

const ITEMS_PER_PAGE = 7;

export const ClientsTable = ({
  searchTerm,
  selectedType,
  selectedStatus,
  clients,
  onEditClient,
  onDeleteClient,
  onHideClient,
  onViewProcesses
}: ClientsTableProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Filter by hidden status based on selectedStatus
      if (selectedStatus === 'Ocultos') {
        if (!client.hidden) return false;
      } else {
        if (client.hidden) return false;
      }
      
      const matchesSearch = searchTerm === '' || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'Todos' ||
        (selectedType === 'Pessoa Física (PF)' && client.type === 'PF') ||
        (selectedType === 'Pessoa Jurídica (PJ)' && client.type === 'PJ');
      
      const matchesStatus = selectedStatus === 'Todos' || 
        selectedStatus === 'Ocultos' || 
        client.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [clients, searchTerm, selectedType, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / ITEMS_PER_PAGE));
  
  // Ajustar página atual quando os filtros mudarem
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-500',
      purple: 'bg-purple-100 text-purple-500',
      green: 'bg-green-100 text-green-500',
      yellow: 'bg-yellow-100 text-yellow-500',
      red: 'bg-red-100 text-red-500',
      indigo: 'bg-indigo-100 text-indigo-500',
      pink: 'bg-pink-100 text-pink-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-500';
  };

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      onDeleteClient(clientToDelete);
    }
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleViewProcesses = (client: Client) => {
    onViewProcesses(client.id, client.name);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processos Ativos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getColorClasses(client.color)}`}>
                        <span className="text-sm font-medium">{client.initials}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-xs text-gray-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.type === 'PF' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {client.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.phone}</div>
                    <div className="text-xs text-gray-500">{client.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewProcesses(client)}
                      className="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                      {client.processCount} processo{client.processCount !== 1 ? 's' : ''}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.hidden ? 'Oculto' : client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-gray-400 hover:text-blue-600" 
                        title="Visualizar"
                        onClick={() => onEditClient(client)}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                          <Eye className="w-4 h-4" />
                        </div>
                      </button>
                      <button 
                        onClick={() => onEditClient(client)}
                        className="text-gray-400 hover:text-blue-600" 
                        title="Editar"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                          <Edit className="w-4 h-4" />
                        </div>
                      </button>
                      <button 
                        onClick={() => onHideClient(client.id)}
                        className={`text-gray-400 ${client.hidden ? 'hover:text-green-600' : 'hover:text-yellow-600'}`} 
                        title={client.hidden ? "Reexibir" : "Ocultar"}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                          <EyeOff className="w-4 h-4" />
                        </div>
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(client.id)}
                        className="text-gray-400 hover:text-red-500" 
                        title="Mover para Antigos"
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
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{Math.min(startIndex + 1, filteredClients.length)}</span> a <span className="font-medium">{Math.min(endIndex, filteredClients.length)}</span> de <span className="font-medium">{filteredClients.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button 
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Próximo</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Mover para Antigos</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Tem certeza que deseja mover este cliente para a seção de antigos? Ele poderá ser reativado posteriormente.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Sim, mover
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
