import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Users } from 'lucide-react';
interface ClientsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onNewClientClick: () => void;
  onViewOldClientsClick: () => void;
}
export const ClientsFilters = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  onNewClientClick,
  onViewOldClientsClick
}: ClientsFiltersProps) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const typeOptions = ['Todos', 'Pessoa Física (PF)', 'Pessoa Jurídica (PJ)'];
  const statusOptions = ['Todos', 'Ativo', 'Inativo', 'Ocultos'];
  return <div className="flex flex-col md:flex-row gap-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input type="text" value={searchTerm} onChange={e => onSearchChange(e.target.value)} className="bg-white border border-gray-200 text-sm rounded-lg pl-10 p-2.5 w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Buscar cliente..." />
      </div>
      
      <div className="flex gap-3">
        {/* Type Filter */}
        <div className="relative">
          <button onClick={() => {
          setShowTypeDropdown(!showTypeDropdown);
          setShowStatusDropdown(false);
        }} className="flex items-center justify-between bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap hover:bg-gray-50 w-full md:w-auto">
            <span>{selectedType}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {showTypeDropdown && <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
              <ul className="py-1 text-sm">
                {typeOptions.map(option => <li key={option}>
                    <button onClick={() => {
                onTypeChange(option);
                setShowTypeDropdown(false);
              }} className="w-full px-4 py-2 text-left hover:bg-gray-100">
                      {option}
                    </button>
                  </li>)}
              </ul>
            </div>}
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <button onClick={() => {
          setShowStatusDropdown(!showStatusDropdown);
          setShowTypeDropdown(false);
        }} className="flex items-center justify-between bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg whitespace-nowrap hover:bg-gray-50 w-full md:w-auto">
            <span>{selectedStatus}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {showStatusDropdown && <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
              <ul className="py-1 text-sm">
                {statusOptions.map(option => <li key={option}>
                    <button onClick={() => {
                onStatusChange(option);
                setShowStatusDropdown(false);
              }} className="w-full px-4 py-2 text-left hover:bg-gray-100">
                      {option}
                    </button>
                  </li>)}
              </ul>
            </div>}
        </div>
        
        <button onClick={onViewOldClientsClick} className="flex items-center text-white px-4 py-2 rounded-lg whitespace-nowrap bg-blue-700 hover:bg-blue-600">
          <Users className="w-4 h-4 mr-2" />
          Clientes Antigos
        </button>
        
        <button onClick={onNewClientClick} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg whitespace-nowrap hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </button>
      </div>
    </div>;
};