
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Fatura {
  id: string;
  numero: string;
  cliente: string;
  valor: number;
  vencimento: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  avatar: string;
}

interface TodasFaturasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TodasFaturasModal: React.FC<TodasFaturasModalProps> = ({ isOpen, onClose }) => {
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [clienteFilter, setClienteFilter] = useState<string>('todos');

  const faturas: Fatura[] = [
    {
      id: '1',
      numero: 'F-2025/042',
      cliente: 'Marcos Ribeiro',
      valor: 3500,
      vencimento: '25/06/2025',
      status: 'Pago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: '2',
      numero: 'F-2025/041',
      cliente: 'Tech Inovações Ltda.',
      valor: 5800,
      vencimento: '30/06/2025',
      status: 'Pendente',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332906d?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: '3',
      numero: 'F-2025/040',
      cliente: 'Carolina Santos',
      valor: 2350,
      vencimento: '15/06/2025',
      status: 'Atrasado',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: '4',
      numero: 'F-2025/039',
      cliente: 'Roberto Almeida',
      valor: 4200,
      vencimento: '10/06/2025',
      status: 'Pago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: '5',
      numero: 'F-2025/038',
      cliente: 'Maria Silva',
      valor: 2800,
      vencimento: '05/06/2025',
      status: 'Pago',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332906d?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: '6',
      numero: 'F-2025/037',
      cliente: 'João Santos',
      valor: 1950,
      vencimento: '28/05/2025',
      status: 'Atrasado',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
    }
  ];

  const clientes = ['todos', ...Array.from(new Set(faturas.map(f => f.cliente)))];

  const filteredFaturas = faturas.filter(fatura => {
    const statusMatch = statusFilter === 'todos' || fatura.status === statusFilter;
    const clienteMatch = clienteFilter === 'todos' || fatura.cliente === clienteFilter;
    return statusMatch && clienteMatch;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Todas as Faturas</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
              <option value="Atrasado">Atrasado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Cliente</label>
            <select 
              value={clienteFilter} 
              onChange={(e) => setClienteFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {clientes.map(cliente => (
                <option key={cliente} value={cliente}>
                  {cliente === 'todos' ? 'Todos os Clientes' : cliente}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFaturas.map((fatura) => (
                <tr key={fatura.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fatura.numero}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
                        <img src={fatura.avatar} alt={fatura.cliente} className="w-full h-full object-cover object-top" />
                      </div>
                      <span className="text-sm text-gray-900">{fatura.cliente}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {fatura.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fatura.vencimento}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      fatura.status === 'Pago' ? 'bg-green-100 text-green-800' :
                      fatura.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {fatura.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
