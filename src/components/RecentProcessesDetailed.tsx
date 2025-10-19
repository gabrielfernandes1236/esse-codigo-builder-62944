
import { useState } from "react";
import { Eye, Edit, Trash2, Search, Filter } from "lucide-react";

export const RecentProcessesDetailed = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const allProcesses = [
    {
      id: 1,
      number: "0123456-78.2023.8.26.0100",
      title: "Ação Trabalhista - Horas Extras",
      client: { name: "Ana Beatriz Mendes", type: "PF", initials: "AM", bgColor: "bg-blue-100", textColor: "text-blue-500" },
      area: "Trabalhista",
      status: { label: "Em andamento", style: "bg-green-100 text-green-800" },
      lastUpdate: "18/06/2025",
      value: "R$ 50.000,00"
    },
    {
      id: 2,
      number: "0654321-87.2023.8.26.0100",
      title: "Divórcio Consensual",
      client: { name: "Carlos Roberto Silva", type: "PF", initials: "CS", bgColor: "bg-purple-100", textColor: "text-purple-500" },
      area: "Família",
      status: { label: "Em andamento", style: "bg-green-100 text-green-800" },
      lastUpdate: "15/06/2025",
      value: "R$ 0,00"
    },
    {
      id: 3,
      number: "0987654-32.2023.8.26.0100",
      title: "Ação de Cobrança",
      client: { name: "Tech Innovations Ltda.", type: "PJ", initials: "TI", bgColor: "bg-green-100", textColor: "text-green-500" },
      area: "Cível",
      status: { label: "Suspenso", style: "bg-yellow-100 text-yellow-800" },
      lastUpdate: "12/06/2025",
      value: "R$ 25.000,00"
    },
    {
      id: 4,
      number: "0456789-12.2023.8.26.0100",
      title: "Constituição de Empresa",
      client: { name: "Maria Fernanda", type: "PF", initials: "MF", bgColor: "bg-orange-100", textColor: "text-orange-500" },
      area: "Empresarial",
      status: { label: "Concluído", style: "bg-blue-100 text-blue-800" },
      lastUpdate: "08/06/2025",
      value: "R$ 5.000,00"
    }
  ];

  const areas = ["Todas", "Trabalhista", "Cível", "Família", "Empresarial", "Criminal", "Tributário", "Previdenciário"];
  const statuses = ["Todos", "Em andamento", "Suspenso", "Arquivado", "Concluído"];

  const filteredProcesses = allProcesses.filter(process => {
    const matchesSearch = process.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArea = !filterArea || filterArea === "Todas" || process.area === filterArea;
    const matchesStatus = !filterStatus || filterStatus === "Todos" || process.status.label === filterStatus;
    
    return matchesSearch && matchesArea && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Todos os Processos</h3>
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número, título ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {areas.map(area => (
              <option key={area} value={area === "Todas" ? "" : area}>{area}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status === "Todos" ? "" : status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
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
                Valor
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
            {filteredProcesses.map((process) => (
              <tr key={process.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{process.number}</div>
                    <div className="text-sm text-gray-500">{process.title}</div>
                  </div>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {process.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.lastUpdate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="text-gray-400 hover:text-gray-600" title="Visualizar">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600" title="Editar">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-red-500" title="Excluir">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProcesses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum processo encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};
