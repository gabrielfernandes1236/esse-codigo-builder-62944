
import { AlertTriangle, Calendar, FileText } from "lucide-react";

export const ImportantDeadlinesDetailed = () => {
  const deadlines = [
    {
      id: 1,
      descricao: "Contestação - Processo Trabalhista",
      processo: "0123456-78.2023.8.26.0100",
      cliente: "Ana Beatriz Mendes",
      data_limite: "25/06/2024",
      dias_restantes: 5,
      prioridade: "alta",
      status: "pendente"
    },
    {
      id: 2,
      descricao: "Recurso Ordinário",
      processo: "0654321-87.2023.8.26.0100",
      cliente: "Carlos Roberto Silva",
      data_limite: "28/06/2024",
      dias_restantes: 8,
      prioridade: "media",
      status: "pendente"
    },
    {
      id: 3,
      descricao: "Petição Inicial - Novo Processo",
      processo: "Novo processo",
      cliente: "Maria Silva",
      data_limite: "30/06/2024",
      dias_restantes: 10,
      prioridade: "baixa",
      status: "pendente"
    },
    {
      id: 4,
      descricao: "Manifestação sobre Documentos",
      processo: "0789123-45.2023.8.26.0100",
      cliente: "João Santos",
      data_limite: "02/07/2024",
      dias_restantes: 12,
      prioridade: "media",
      status: "pendente"
    }
  ];

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (dias: number) => {
    if (dias <= 3) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (dias <= 7) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <Calendar className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Todos os Prazos Importantes
        </h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {deadlines
            .sort((a, b) => a.dias_restantes - b.dias_restantes)
            .map((deadline) => (
            <div key={deadline.id} className={`border rounded-lg p-4 hover:bg-gray-50 ${getPriorityColor(deadline.prioridade)}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                    {getUrgencyIcon(deadline.dias_restantes)}
                    {deadline.descricao}
                  </h4>
                  <div className="text-sm text-gray-600">
                    <p className="mb-1">Cliente: {deadline.cliente}</p>
                    <p className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {deadline.processo}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {deadline.data_limite}
                  </div>
                  <div className={`text-xs font-medium ${
                    deadline.dias_restantes <= 3 ? 'text-red-600' :
                    deadline.dias_restantes <= 7 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {deadline.dias_restantes === 1 ? '1 dia restante' : `${deadline.dias_restantes} dias restantes`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
