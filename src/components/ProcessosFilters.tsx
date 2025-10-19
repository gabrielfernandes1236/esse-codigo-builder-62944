
import React, { useState } from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';
import { useProcessesData } from '@/hooks/useProcessesData';
import { useClientsData } from '@/hooks/useClientsData';

interface ProcessosFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
  onClientChange: (client: string) => void;
  onNewProcessClick: () => void;
  searchTerm: string;
  selectedStatus: string;
  selectedType: string;
  selectedClient: string;
}

export const ProcessosFilters = ({
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onClientChange,
  onNewProcessClick,
  searchTerm,
  selectedStatus,
  selectedType,
  selectedClient
}: ProcessosFiltersProps) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  const { clients } = useClientsData();

  const statusOptions = ['Todos', 'Em andamento', 'Concluído', 'Arquivado', 'Suspenso'];
  const typeOptions = ['Todos', 'Cível', 'Trabalhista', 'Tributário', 'Criminal', 'Administrativo', 'Família', 'Empresarial', 'Propriedade Intelectual', 'Ambiental', 'Previdenciário'];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const clientOptions = ['Todos', ...filteredClients.map(client => client.name)];

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-white border border-gray-200 text-sm rounded-lg pl-10 p-2.5 w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar processo..."
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowTypeDropdown(false);
              setShowClientDropdown(false);
            }}
            className="flex items-center justify-between bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap hover:bg-gray-50 w-full md:w-auto"
          >
            <span>{selectedStatus}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {showStatusDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
              <ul className="py-1 text-sm">
                {statusOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => {
                        onStatusChange(option);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Type Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowStatusDropdown(false);
              setShowClientDropdown(false);
            }}
            className="flex items-center justify-between bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap hover:bg-gray-50 w-full md:w-auto"
          >
            <span>{selectedType}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {showTypeDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
              <ul className="py-1 text-sm">
                {typeOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => {
                        onTypeChange(option);
                        setShowTypeDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Client Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowClientDropdown(!showClientDropdown);
              setShowStatusDropdown(false);
              setShowTypeDropdown(false);
            }}
            className="flex items-center justify-between bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap hover:bg-gray-50 w-full md:w-auto"
          >
            <span>{selectedClient}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {showClientDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-2">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded"
                  placeholder="Buscar cliente"
                />
              </div>
              <ul className="py-1 text-sm max-h-48 overflow-y-auto">
                {clientOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => {
                        onClientChange(option);
                        setShowClientDropdown(false);
                        setClientSearch('');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <button 
          onClick={onNewProcessClick}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg whitespace-nowrap hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Processo
        </button>
      </div>
    </div>
  );
};
