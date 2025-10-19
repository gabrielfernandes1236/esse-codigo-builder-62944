
import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface WhatsAppFiltersProps {
  onClientSearch: (search: string) => void;
  onTypeFilter: (type: string) => void;
  onStatusFilter: (status: string) => void;
}

export const WhatsAppFilters = ({ onClientSearch, onTypeFilter, onStatusFilter }: WhatsAppFiltersProps) => {
  const [clientSearch, setClientSearch] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const messageTypes = ['Todos', 'Atualização', 'Compromisso', 'Relacionamento', 'Finalização', 'Teste'];
  const statusOptions = ['Todos', 'Entregue', 'Não entregue', 'Respondido'];

  const handleClientSearchChange = (value: string) => {
    setClientSearch(value);
    onClientSearch(value);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    onTypeFilter(type);
    setShowTypeDropdown(false);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusFilter(status);
    setShowStatusDropdown(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Busca por Cliente */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={clientSearch}
          onChange={(e) => handleClientSearchChange(e.target.value)}
          className="bg-white border border-gray-200 text-sm rounded-lg pl-10 p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar cliente..."
        />
      </div>

      {/* Filtro por Tipo */}
      <div className="relative">
        <button
          onClick={() => {
            setShowTypeDropdown(!showTypeDropdown);
            setShowStatusDropdown(false);
          }}
          className="flex items-center justify-between bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg whitespace-nowrap hover:bg-gray-50 min-w-[140px]"
        >
          <span>{selectedType}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>
        {showTypeDropdown && (
          <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
            <ul className="py-1 text-sm">
              {messageTypes.map((type) => (
                <li key={type}>
                  <button
                    onClick={() => handleTypeChange(type)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {type}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Filtro por Status */}
      <div className="relative">
        <button
          onClick={() => {
            setShowStatusDropdown(!showStatusDropdown);
            setShowTypeDropdown(false);
          }}
          className="flex items-center justify-between bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg whitespace-nowrap hover:bg-gray-50 min-w-[140px]"
        >
          <span>{selectedStatus}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>
        {showStatusDropdown && (
          <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
            <ul className="py-1 text-sm">
              {statusOptions.map((status) => (
                <li key={status}>
                  <button
                    onClick={() => handleStatusChange(status)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {status}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
