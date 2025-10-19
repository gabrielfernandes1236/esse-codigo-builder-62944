
import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, User, FileText, CalendarIcon } from 'lucide-react';
import { AgendaEvent } from '@/hooks/useAgendaData';
import { ClientSearch } from '@/components/ClientSearch';

interface AgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<AgendaEvent, 'id'>) => void;
  onUpdate?: (id: string, event: Partial<AgendaEvent>) => void;
  editingEvent?: AgendaEvent | null;
}

export const AgendaModal = ({ isOpen, onClose, onSave, onUpdate, editingEvent }: AgendaModalProps) => {
  const [formData, setFormData] = useState({
    titulo: '',
    data: '',
    hora: '',
    tipo: 'audiencia' as 'audiencia' | 'reuniao' | 'prazo',
    local: '',
    descricao: '',
    cliente: '',
    processo: '',
    prioridade: 'media' as 'alta' | 'media' | 'baixa',
    tipoCompromisso: 'proximos' as 'proximos' | 'prazos',
    enviarLembrete: true,
    status: 'confirmado' as 'confirmado' | 'pendente' | 'cancelado'
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        titulo: editingEvent.titulo,
        data: editingEvent.data,
        hora: editingEvent.hora,
        tipo: editingEvent.tipo,
        local: editingEvent.local || '',
        descricao: editingEvent.descricao || '',
        cliente: editingEvent.cliente,
        processo: editingEvent.processo || '',
        prioridade: editingEvent.prioridade,
        tipoCompromisso: editingEvent.tipoCompromisso,
        enviarLembrete: editingEvent.enviarLembrete,
        status: editingEvent.status
      });
    } else {
      setFormData({
        titulo: '',
        data: '',
        hora: '',
        tipo: 'audiencia',
        local: '',
        descricao: '',
        cliente: '',
        processo: '',
        prioridade: 'media',
        tipoCompromisso: 'proximos',
        enviarLembrete: true,
        status: 'confirmado'
      });
    }
  }, [editingEvent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent && onUpdate) {
      onUpdate(editingEvent.id, formData);
    } else {
      onSave(formData);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-800">
            {editingEvent ? 'Editar Compromisso' : 'Novo Compromisso'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    id="event-title"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Título do compromisso"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      id="event-date"
                      required
                      value={formData.data}
                      onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="event-time" className="block text-sm font-medium text-gray-700 mb-1">
                      Horário *
                    </label>
                    <input
                      type="time"
                      id="event-time"
                      required
                      value={formData.hora}
                      onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo *
                  </label>
                  <select
                    id="event-type"
                    value={formData.tipo}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                  >
                    <option value="audiencia">Audiência</option>
                    <option value="reuniao">Reunião</option>
                    <option value="prazo">Prazo</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-1">
                    Local
                  </label>
                  <input
                    type="text"
                    id="event-location"
                    value={formData.local}
                    onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Local do compromisso"
                  />
                </div>

                <div>
                  <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="event-description"
                    rows={3}
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Descrição do compromisso"
                  />
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente Relacionado *
                  </label>
                  <ClientSearch
                    value={formData.cliente}
                    onChange={(value) => setFormData(prev => ({ ...prev, cliente: value }))}
                    placeholder="Selecione um cliente"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="event-process" className="block text-sm font-medium text-gray-700 mb-1">
                    Processo Relacionado
                  </label>
                  <input
                    type="text"
                    id="event-process"
                    value={formData.processo}
                    onChange={(e) => setFormData(prev => ({ ...prev, processo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Número do processo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="alta"
                        checked={formData.prioridade === 'alta'}
                        onChange={(e) => setFormData(prev => ({ ...prev, prioridade: e.target.value as any }))}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Alta</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="media"
                        checked={formData.prioridade === 'media'}
                        onChange={(e) => setFormData(prev => ({ ...prev, prioridade: e.target.value as any }))}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Média</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="baixa"
                        checked={formData.prioridade === 'baixa'}
                        onChange={(e) => setFormData(prev => ({ ...prev, prioridade: e.target.value as any }))}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Baixa</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Compromisso</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="tipoCompromisso"
                        value="proximos"
                        checked={formData.tipoCompromisso === 'proximos'}
                        onChange={(e) => setFormData(prev => ({ ...prev, tipoCompromisso: e.target.value as any }))}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Próximos Compromissos</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="tipoCompromisso"
                        value="prazos"
                        checked={formData.tipoCompromisso === 'prazos'}
                        onChange={(e) => setFormData(prev => ({ ...prev, tipoCompromisso: e.target.value as any }))}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">Prazos Importantes</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.enviarLembrete}
                      onChange={(e) => setFormData(prev => ({ ...prev, enviarLembrete: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enviar lembretes</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
              >
                {editingEvent ? 'Atualizar Compromisso' : 'Salvar Compromisso'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
