import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useProcessesData } from '@/hooks/useProcessesData';
import { useClientsData } from '@/hooks/useClientsData';

interface EditProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  processId: string | null;
  onSave: (processData: any) => void;
}

export const EditProcessModal = ({ isOpen, onClose, processId, onSave }: EditProcessModalProps) => {
  const { getProcessById, updateProcess } = useProcessesData();
  const { clients } = useClientsData();
  const [formData, setFormData] = useState({
    title: '',
    area: '',
    status: 'Em andamento' as "Em andamento" | "Suspenso" | "Arquivado" | "Concluído",
    clientId: '',
    valor_causa: 0,
    observacoes: ''
  });

  const process = processId ? getProcessById(processId) : null;

  // Recarregar dados do processo sempre que o modal abrir ou o processId mudar
  useEffect(() => {
    if (process && isOpen && processId) {
      console.log('Carregando dados do processo para edição:', process);
      setFormData({
        title: process.title || '',
        area: process.area || '',
        status: process.status || 'Em andamento',
        clientId: process.clientId || '',
        valor_causa: process.valor_causa || 0,
        observacoes: process.observacoes || ''
      });
    }
  }, [process, isOpen, processId]);

  const handleInputChange = (field: string, value: any) => {
    console.log(`Campo ${field} alterado para:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (processId) {
      console.log('Salvando alterações do processo:', processId, formData);
      
      const updatedData = {
        titulo: formData.title,
        area: formData.area,
        status: formData.status,
        cliente_id: formData.clientId,
        valor_causa: formData.valor_causa,
        observacoes: formData.observacoes
      };
      
      // Atualizar processo - a reatividade é automática
      updateProcess(processId, updatedData);
      
      // Fechar modal
      onClose();
      
      console.log('✅ Processo atualizado - tabela deve atualizar automaticamente');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !process) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Editar Processo</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Processo
                </label>
                <input
                  type="text"
                  value={process.number}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleInputChange('clientId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Selecione uma área</option>
                  <option value="Cível">Cível</option>
                  <option value="Trabalhista">Trabalhista</option>
                  <option value="Tributário">Tributário</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Família">Família</option>
                  <option value="Empresarial">Empresarial</option>
                  <option value="Propriedade Intelectual">Propriedade Intelectual</option>
                  <option value="Ambiental">Ambiental</option>
                  <option value="Previdenciário">Previdenciário</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as "Em andamento" | "Suspenso" | "Arquivado" | "Concluído")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Em andamento">Em andamento</option>
                  <option value="Suspenso">Suspenso</option>
                  <option value="Arquivado">Arquivado</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor da Causa
                </label>
                <input
                  type="number"
                  value={formData.valor_causa}
                  onChange={(e) => handleInputChange('valor_causa', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Observações adicionais sobre o processo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início
                </label>
                <input
                  type="text"
                  value={process.date}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documentos
                </label>
                <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                  {process.documents && process.documents.length > 0 ? (
                    <ul className="space-y-1">
                      {process.documents.map((doc, index) => (
                        <li key={index} className="text-sm text-gray-600">• {doc}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum documento anexado</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
