
import { useState } from 'react';
import { X, Clock, MessageSquare, Repeat, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { MessageTemplate, PresetTemplate } from '@/hooks/useWhatsAppConfiguration';

interface WhatsAppConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: MessageTemplate;
  onSave: (templateId: string, updates: Partial<MessageTemplate>) => void;
  presetTemplates: PresetTemplate[];
  onAddCustomTemplate: (type: string, template: PresetTemplate) => void;
}

export const WhatsAppConfigModal = ({ 
  isOpen, 
  onClose, 
  template, 
  onSave, 
  presetTemplates, 
  onAddCustomTemplate 
}: WhatsAppConfigModalProps) => {
  const [formData, setFormData] = useState({
    template: template.template,
    preferredTime: template.preferredTime,
    allowManualSend: template.allowManualSend,
    recurrence: template.recurrence || { enabled: false, type: 'daily' as const, interval: 1 }
  });

  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [customTemplateName, setCustomTemplateName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(template.id, formData);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSelectTemplate = (presetTemplate: PresetTemplate) => {
    setFormData({ ...formData, template: presetTemplate.template });
    setShowTemplateLibrary(false);
  };

  const handleSaveCustomTemplate = () => {
    if (customTemplateName.trim() && formData.template.trim()) {
      onAddCustomTemplate(template.type, {
        id: `custom_${Date.now()}`,
        name: customTemplateName,
        template: formData.template
      });
      setCustomTemplateName('');
      alert('Modelo personalizado salvo com sucesso!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Configurar {template.name}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Template de Mensagem */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Modelo de mensagem
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplateLibrary(!showTemplateLibrary)}
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Selecionar Modelo
                </Button>
              </div>
              
              <Textarea
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                rows={4}
                className="w-full"
                placeholder="Digite o modelo da mensagem..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Use variáveis como: {"{nome}"}, {"{numero_processo}"}, {"{data_evento}"}, {"{hora_evento}"}, {"{local_evento}"}, {"{descricao_atualizacao}"}, {"{link_documento}"}
              </p>

              {/* Salvar Modelo Personalizado */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salvar como modelo personalizado
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTemplateName}
                    onChange={(e) => setCustomTemplateName(e.target.value)}
                    placeholder="Nome do modelo..."
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveCustomTemplate}
                    disabled={!customTemplateName.trim() || !formData.template.trim()}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </div>

            {/* Horário Preferencial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Horário preferencial de envio
              </label>
              <input
                type="time"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Permitir Envio Manual */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Permitir envio manual</h3>
                <p className="text-sm text-gray-500">Permite enviar este tipo de mensagem manualmente quando necessário</p>
              </div>
              <Switch
                checked={formData.allowManualSend}
                onCheckedChange={(checked) => setFormData({ ...formData, allowManualSend: checked })}
              />
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Configuração de Recorrência */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <Repeat className="w-4 h-4 mr-2" />
                  Mensagens Recorrentes
                </h3>
                <Switch
                  checked={formData.recurrence.enabled}
                  onCheckedChange={(checked) => 
                    setFormData({ 
                      ...formData, 
                      recurrence: { ...formData.recurrence, enabled: checked }
                    })
                  }
                />
              </div>

              {formData.recurrence.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de recorrência
                    </label>
                    <select
                      value={formData.recurrence.type}
                      onChange={(e) => 
                        setFormData({ 
                          ...formData, 
                          recurrence: { 
                            ...formData.recurrence, 
                            type: e.target.value as 'daily' | 'weekly' | 'monthly' | 'custom'
                          }
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Diária</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                      <option value="custom">Personalizada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intervalo
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={formData.recurrence.interval}
                        onChange={(e) => 
                          setFormData({ 
                            ...formData, 
                            recurrence: { 
                              ...formData.recurrence, 
                              interval: parseInt(e.target.value) || 1
                            }
                          })
                        }
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        {formData.recurrence.type === 'daily' && 'dia(s)'}
                        {formData.recurrence.type === 'weekly' && 'semana(s)'}
                        {formData.recurrence.type === 'monthly' && 'mês(es)'}
                        {formData.recurrence.type === 'custom' && 'período(s)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview da Mensagem */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview da mensagem:</h3>
              <div className="bg-green-50 p-3 rounded-lg text-sm text-gray-700">
                {formData.template.replace(/\{\{(\w+)\}\}/g, '[Variável: $1]')}
              </div>
            </div>
          </div>
        </div>

        {/* Biblioteca de Modelos */}
        {showTemplateLibrary && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Biblioteca de Modelos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presetTemplates.map((preset) => (
                <div key={preset.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{preset.name}</h4>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleSelectTemplate(preset)}
                    >
                      Usar
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-3">{preset.template}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};
