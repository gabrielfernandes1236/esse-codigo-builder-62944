
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Transaction {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  cliente?: string;
  valor: number;
  data: string;
  horario: string;
  metodo_pagamento: string;
  categoria: string;
  processo_relacionado?: string;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  transaction 
}) => {
  if (!transaction) return null;

  const historico = [
    {
      data: transaction.data,
      horario: transaction.horario,
      acao: transaction.tipo === 'receita' ? 'Recebimento registrado' : 'Pagamento efetuado',
      valor: transaction.valor,
      status: 'Concluído'
    },
    {
      data: transaction.data,
      horario: '08:30',
      acao: 'Transação criada no sistema',
      valor: 0,
      status: 'Criado'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Transação</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Principais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Tipo</label>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  transaction.tipo === 'receita' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.tipo === 'receita' ? 'Receita' : 'Despesa'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Valor</label>
              <p className={`text-lg font-semibold mt-1 ${
                transaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.tipo === 'receita' ? '+' : '-'} R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Descrição</label>
              <p className="text-sm text-gray-900 mt-1">{transaction.descricao}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Cliente</label>
              <p className="text-sm text-gray-900 mt-1">{transaction.cliente || 'Não informado'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Data/Hora</label>
              <p className="text-sm text-gray-900 mt-1">
                {new Date(transaction.data).toLocaleDateString('pt-BR')} às {transaction.horario}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Método de Pagamento</label>
              <p className="text-sm text-gray-900 mt-1">{transaction.metodo_pagamento}</p>
            </div>
          </div>

          {/* Processo Relacionado */}
          {transaction.processo_relacionado && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <div className="w-5 h-5 text-blue-500 mr-2">
                  <i className="ri-folder-line"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Relacionado ao Processo</p>
                  <p className="text-xs text-blue-700">#{transaction.processo_relacionado}</p>
                </div>
              </div>
            </div>
          )}

          {/* Histórico */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Histórico de Movimentações</h4>
            <div className="space-y-3">
              {historico.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{item.acao}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(item.data).toLocaleDateString('pt-BR')} às {item.horario}
                      </span>
                    </div>
                    {item.valor > 0 && (
                      <p className="text-xs text-gray-600 mt-1">
                        Valor: R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comprovante */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Comprovantes</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-2 text-gray-400">
                <i className="ri-file-upload-line text-2xl"></i>
              </div>
              <p className="text-sm text-gray-500">Anexar comprovante</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG ou PNG até 5MB</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
