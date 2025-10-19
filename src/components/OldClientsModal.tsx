
import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';

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

interface OldClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldClients: Client[];
  onReactivateClient: (clientId: string) => void;
}

export const OldClientsModal = ({ 
  isOpen, 
  onClose, 
  oldClients, 
  onReactivateClient 
}: OldClientsModalProps) => {
  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Clientes Antigos ({oldClients.length})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {oldClients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum cliente antigo encontrado.</p>
            </div>
          ) : (
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
                      Data de Cadastro
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {oldClients.map((client) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.registrationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => onReactivateClient(client.id)}
                          className="text-gray-400 hover:text-green-600" 
                          title="Reativar Cliente"
                        >
                          <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                            <RotateCcw className="w-4 h-4" />
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
  );
};
