
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal = ({ isOpen, onClose }: UserProfileModalProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    nome: 'Dr. Ricardo Oliveira',
    email: 'ricardo.oliveira@escritorioadvocacia.com.br',
    telefone: '(11) 99999-8888',
    cargo: 'Advogado',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  });

  const [previewImage, setPreviewImage] = useState(formData.foto);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (numericValue.length <= 11) {
      if (numericValue.length <= 2) {
        formattedValue = numericValue;
      } else if (numericValue.length <= 7) {
        formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
      } else {
        formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
      }
    }
    
    handleInputChange('telefone', formattedValue);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        handleInputChange('foto', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    handleInputChange('foto', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome completo é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
    
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      nome: 'Dr. Ricardo Oliveira',
      email: 'ricardo.oliveira@escritorioadvocacia.com.br',
      telefone: '(11) 99999-8888',
      cargo: 'Advogado',
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    });
    setPreviewImage(formData.foto);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                <i className="ri-user-settings-line text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-900">Perfil do Usuário</h2>
                <p className="text-sm text-gray-600">Atualize suas informações pessoais e profissionais</p>
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

        <div className="p-6">
          <div className="space-y-6">
            {/* Foto de Perfil */}
            <div className="flex items-center space-x-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-3">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <i className="ri-user-line text-3xl"></i>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload
                  </button>
                  {previewImage && (
                    <button
                      onClick={handleRemoveImage}
                      className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Remover
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome completo *
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-mail profissional
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seu.email@escritorio.com.br"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                  Telefone profissional
                </Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cargo" className="text-sm font-medium text-gray-700">
                  Cargo/Função no escritório
                </Label>
                <Select value={formData.cargo} onValueChange={(value) => handleInputChange('cargo', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione seu cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advogado">Advogado</SelectItem>
                    <SelectItem value="Estagiário">Estagiário</SelectItem>
                    <SelectItem value="Assistente">Assistente</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Última atualização feita em 20/06/2025 por Dr. Ricardo Oliveira
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-4 py-2"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
