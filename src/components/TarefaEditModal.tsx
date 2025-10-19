
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TarefaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarefa: any;
  onSave: (id: string, tarefaAtualizada: { nome: string; descricao: string; urgencia: string }) => void;
}

export const TarefaEditModal = ({ isOpen, onClose, tarefa, onSave }: TarefaEditModalProps) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [urgencia, setUrgencia] = useState('normal');

  useEffect(() => {
    if (tarefa) {
      setNome(tarefa.nome || '');
      setDescricao(tarefa.descricao || '');
      setUrgencia(tarefa.urgencia || 'normal');
    }
  }, [tarefa]);

  if (!isOpen || !tarefa) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onSave(tarefa.id, { nome, descricao, urgencia });
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Editar Tarefa</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nomeTarefa" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da tarefa
              </label>
              <input
                type="text"
                id="nomeTarefa"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o nome da tarefa"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="descricaoTarefa" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="descricaoTarefa"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva a tarefa"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="urgenciaTarefa" className="block text-sm font-medium text-gray-700 mb-1">
                Nível de urgência
              </label>
              <select
                id="urgenciaTarefa"
                value={urgencia}
                onChange={(e) => setUrgencia(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="moderada">Moderada</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
