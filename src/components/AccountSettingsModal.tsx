
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSettingsModal = ({ isOpen, onClose }: AccountSettingsModalProps) => {
  const { toast } = useToast();
  
  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const [idioma, setIdioma] = useState('pt-BR');

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return minLength && hasUppercase && hasNumber;
  };

  const handlePasswordSave = () => {
    if (!passwordData.senhaAtual) {
      toast({
        title: "Erro de validação",
        description: "Digite sua senha atual.",
        variant: "destructive",
      });
      return;
    }

    if (!passwordData.novaSenha) {
      toast({
        title: "Erro de validação",
        description: "Digite uma nova senha.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(passwordData.novaSenha)) {
      toast({
        title: "Erro de validação",
        description: "A nova senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso.",
    });

    setPasswordData({
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    });
  };

  const handleLanguageSave = () => {
    toast({
      title: "Idioma atualizado",
      description: "Suas preferências de idioma foram salvas.",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-4">
                <i className="ri-shield-keyhole-line text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-900">Configurações da Conta</h2>
                <p className="text-sm text-gray-600">Gerencie seu e-mail, senha e preferências do sistema</p>
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
          {/* Alterar Senha */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-lock-password-line text-blue-600 mr-2"></i>
              Alterar Senha
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="senhaAtual" className="text-sm font-medium text-gray-700">
                  Senha atual
                </Label>
                <Input
                  id="senhaAtual"
                  type="password"
                  value={passwordData.senhaAtual}
                  onChange={(e) => handlePasswordChange('senhaAtual', e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="novaSenha" className="text-sm font-medium text-gray-700">
                    Nova senha
                  </Label>
                  <Input
                    id="novaSenha"
                    type="password"
                    value={passwordData.novaSenha}
                    onChange={(e) => handlePasswordChange('novaSenha', e.target.value)}
                    placeholder="Digite a nova senha"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmarSenha" className="text-sm font-medium text-gray-700">
                    Confirmar nova senha
                  </Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    value={passwordData.confirmarSenha}
                    onChange={(e) => handlePasswordChange('confirmarSenha', e.target.value)}
                    placeholder="Confirme a nova senha"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <i className="ri-information-line mr-1"></i>
                  A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número.
                </p>
              </div>

              <div className="text-right">
                <Button
                  onClick={handlePasswordSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
                >
                  Alterar Senha
                </Button>
              </div>
            </div>
          </div>

          {/* Preferências de Idioma */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-global-line text-green-600 mr-2"></i>
              Preferência de Idioma
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="idioma" className="text-sm font-medium text-gray-700">
                  Idioma do sistema
                </Label>
                <Select value={idioma} onValueChange={setIdioma}>
                  <SelectTrigger className="mt-1 max-w-xs">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US" disabled>Inglês (Em breve)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-right">
                <Button
                  onClick={handleLanguageSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
                >
                  Salvar Idioma
                </Button>
              </div>
            </div>
          </div>

          {/* Dados Técnicos */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-computer-line text-gray-600 mr-2"></i>
              Dados Técnicos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">ID do usuário</Label>
                <div className="mt-1 p-3 bg-white border border-gray-200 rounded-lg">
                  <code className="text-sm text-gray-600">USR-2025-001-RICARDO</code>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Último login</Label>
                <div className="mt-1 p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-sm text-gray-600">22/06/2025 às 08:30</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Dispositivo usado</Label>
                <div className="mt-1 p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-sm text-gray-600">Chrome 126.0 no Windows 11</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <i className="ri-information-line mr-1"></i>
                Estas informações são úteis para nosso suporte técnico em caso de problemas.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="text-right">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
