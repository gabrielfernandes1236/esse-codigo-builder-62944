
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizationModal = ({ isOpen, onClose }: CustomizationModalProps) => {
  const { toast } = useToast();
  
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('blue');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  const colorOptions = [
    { id: 'blue', name: 'Azul', color: 'bg-blue-600', class: 'border-blue-600' },
    { id: 'purple', name: 'Roxo', color: 'bg-purple-600', class: 'border-purple-600' },
    { id: 'green', name: 'Verde', color: 'bg-green-600', class: 'border-green-600' },
    { id: 'amber', name: 'Âmbar', color: 'bg-amber-600', class: 'border-amber-600' }
  ];

  const handleSave = () => {
    // Simular aplicação das configurações
    document.documentElement.className = `${theme === 'dark' ? 'dark' : ''} ${highContrast ? 'high-contrast' : ''}`;
    
    toast({
      title: "Configurações aplicadas",
      description: "As personalizações da interface foram salvas com sucesso.",
    });
    
    onClose();
  };

  const previewClasses = `
    ${highContrast ? 'bg-black text-white' : theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
    ${fontSize === 'large' ? 'text-lg' : 'text-sm'}
  `;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mr-4">
                <i className="ri-palette-line text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-900">Personalização da Interface</h2>
                <p className="text-sm text-gray-600">Ajuste o tema, cores e layout conforme sua preferência</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Theme Selection */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-moon-line text-blue-600 mr-2"></i>
              Tema
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme-toggle" className="text-sm font-medium text-gray-700">
                  Modo Escuro
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Ative o tema escuro para reduzir o cansaço visual
                </p>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>

          {/* Primary Color */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-paint-brush-line text-purple-600 mr-2"></i>
              Cor Primária
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {colorOptions.map((color) => (
                <div
                  key={color.id}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    primaryColor === color.id ? color.class : 'border-gray-200'
                  }`}
                  onClick={() => setPrimaryColor(color.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full ${color.color}`}></div>
                    <span className="text-sm font-medium text-gray-700">{color.name}</span>
                  </div>
                  {primaryColor === color.id && (
                    <div className="absolute top-2 right-2">
                      <i className="ri-check-line text-green-600"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-font-size text-green-600 mr-2"></i>
              Tamanho da Fonte
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="font-normal"
                  name="fontSize"
                  value="normal"
                  checked={fontSize === 'normal'}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="text-blue-600"
                />
                <Label htmlFor="font-normal" className="text-sm font-medium text-gray-700">
                  Padrão
                </Label>
              </div>
              
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="font-large"
                  name="fontSize"
                  value="large"
                  checked={fontSize === 'large'}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="text-blue-600"
                />
                <Label htmlFor="font-large" className="text-sm font-medium text-gray-700">
                  Ampliada
                </Label>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-accessibility-line text-indigo-600 mr-2"></i>
              Acessibilidade
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={(checked) => setHighContrast(checked as boolean)}
                />
                <Label htmlFor="high-contrast" className="text-sm font-medium text-gray-700">
                  Ativar modo de alto contraste
                </Label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <i className="ri-information-line mr-1"></i>
                  O modo de alto contraste usa preto e branco para melhor legibilidade.
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-eye-line text-gray-600 mr-2"></i>
              Prévia
            </h3>
            
            <div className={`p-4 rounded-lg border transition-all ${previewClasses}`}>
              <h4 className="font-medium mb-2">CRM Jurídico</h4>
              <p className="mb-3">Este é um exemplo de como a interface ficará com suas configurações.</p>
              <div className={`inline-block px-3 py-1 rounded-button text-white ${
                primaryColor === 'blue' ? 'bg-blue-600' :
                primaryColor === 'purple' ? 'bg-purple-600' :
                primaryColor === 'green' ? 'bg-green-600' :
                'bg-amber-600'
              }`}>
                Botão de Exemplo
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
