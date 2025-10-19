
import React from 'react';
import { X, Calendar, User, FileText, Clock } from 'lucide-react';

interface ProcessHistory {
  date: string;
  event: string;
  description: string;
  user: string;
}

interface ProcessHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: {
    id: string;
    number: string;
    title: string;
    area: string;
    status: 'Em andamento' | 'Suspenso' | 'Arquivado' | 'Concluído';
    date: string;
    clientName: string;
    lastUpdate: string;
    history: ProcessHistory[];
    documents: string[];
  } | null;
}

export const ProcessHistoryModal = ({ 
  isOpen, 
  onClose, 
  process 
}: ProcessHistoryModalProps) => {
  if (!isOpen || !process) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return 'bg-green-100 text-green-800';
      case 'Suspenso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Arquivado':
        return 'bg-gray-100 text-gray-800';
      case 'Concluído':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Histórico do Processo
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Informações do Processo */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Processo
                </label>
                <p className="text-sm text-gray-900 font-mono">{process.number}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <p className="text-sm text-gray-900">{process.clientName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <p className="text-sm text-gray-900">{process.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área
                </label>
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {process.area}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Atual
                </label>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(process.status)}`}>
                  {process.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Última Movimentação
                </label>
                <p className="text-sm text-gray-900 flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" />
                  {process.lastUpdate}
                </p>
              </div>
            </div>
          </div>

          {/* Histórico Cronológico */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Histórico Cronológico
            </h4>
            <div className="space-y-4">
              {process.history.map((event, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4 relative">
                  <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-1"></div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900">{event.event}</h5>
                      <span className="text-xs text-gray-500">{event.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <User className="w-3 h-3 mr-1" />
                      {event.user}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentos Relacionados */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Documentos Relacionados
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {process.documents.map((doc, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <FileText className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-700">{doc}</span>
                </div>
              ))}
            </div>
          </div>
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
  );
};
