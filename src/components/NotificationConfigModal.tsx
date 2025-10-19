
import { useState, useEffect } from 'react';
import { X, Mail, MessageSquare, Clock, Users, Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationConfigModal = ({ isOpen, onClose }: NotificationConfigModalProps) => {
  const { config, updateConfig } = useNotifications();
  const [formData, setFormData] = useState(config);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  if (!isOpen) return null;

  const handleSave = () => {
    updateConfig(formData);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const addEmail = () => {
    const email = prompt('Digite o email do advogado:');
    if (email && email.includes('@')) {
      setFormData(prev => ({
        ...prev,
        emailsAdvogados: [...prev.emailsAdvogados, email]
      }));
    }
  };

  const removeEmail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      emailsAdvogados: prev.emailsAdvogados.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Configurar Lembretes
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Configurações de Email */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Notificações por Email
              </h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Ativar</span>
              </label>
            </div>

            {formData.email && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emails dos Advogados
                  </label>
                  <div className="space-y-2">
                    {formData.emailsAdvogados.map((email, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-sm">{email}</span>
                        <button
                          onClick={() => removeEmail(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addEmail}
                      className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-blue-400 hover:text-blue-600 text-sm"
                    >
                      + Adicionar Email
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template do Email
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.templatesEmail.assunto}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        templatesEmail: { ...prev.templatesEmail, assunto: e.target.value }
                      }))}
                      placeholder="Assunto do email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={formData.templatesEmail.corpo}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        templatesEmail: { ...prev.templatesEmail, corpo: e.target.value }
                      }))}
                      rows={4}
                      placeholder="Corpo do email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configurações de WhatsApp */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Notificações por WhatsApp
              </h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.checked }))}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Ativar</span>
              </label>
            </div>

            {formData.whatsapp && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grupo do WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.grupoWhatsApp || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, grupoWhatsApp: e.target.value }))}
                    placeholder="Nome ou ID do grupo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template para Grupo
                  </label>
                  <textarea
                    value={formData.templatesWhatsApp.grupo}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      templatesWhatsApp: { ...prev.templatesWhatsApp, grupo: e.target.value }
                    }))}
                    rows={4}
                    placeholder="Mensagem para o grupo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template para Cliente
                  </label>
                  <textarea
                    value={formData.templatesWhatsApp.cliente}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      templatesWhatsApp: { ...prev.templatesWhatsApp, cliente: e.target.value }
                    }))}
                    rows={4}
                    placeholder="Mensagem para o cliente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Configurações de Antecedência */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Antecedência dos Lembretes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: '1dia', label: '1 dia antes' },
                { value: '2dias', label: '2 dias antes' },
                { value: '1semana', label: '1 semana antes' },
                { value: 'personalizado', label: 'Personalizado' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="antecedencia"
                    value={option.value}
                    checked={formData.antecedencia === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, antecedencia: e.target.value as any }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>

            {formData.antecedencia === 'personalizado' && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dias de antecedência
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.antecedenciaPersonalizada || 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, antecedenciaPersonalizada: parseInt(e.target.value) }))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Variáveis Disponíveis */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Variáveis Disponíveis nos Templates
            </h3>
            <div className="text-xs text-gray-600 grid grid-cols-2 md:grid-cols-3 gap-2">
              <span className="bg-white px-2 py-1 rounded">{'{titulo}'}</span>
              <span className="bg-white px-2 py-1 rounded">{'{data}'}</span>
              <span className="bg-white px-2 py-1 rounded">{'{hora}'}</span>
              <span className="bg-white px-2 py-1 rounded">{'{local}'}</span>
              <span className="bg-white px-2 py-1 rounded">{'{cliente}'}</span>
              <span className="bg-white px-2 py-1 rounded">{'{processo}'}</span>
            </div>
          </div>
        </div>

        {/* Footer com botões */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};
