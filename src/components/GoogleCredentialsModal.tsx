
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface GoogleCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (credentials: { clientId: string; clientSecret: string }) => void;
}

export const GoogleCredentialsModal: React.FC<GoogleCredentialsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (!clientId.trim() || !clientSecret.trim()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    onSave({ clientId, clientSecret });
    setClientId('');
    setClientSecret('');
    onClose();
    
    toast({
      title: "Credenciais salvas",
      description: "As credenciais do Google foram configuradas com sucesso.",
    });
  };

  const handleClose = () => {
    setClientId('');
    setClientSecret('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar Credenciais do Google</DialogTitle>
          <DialogDescription>
            Configure as credenciais OAuth2 do Google para habilitar a integração com Gmail.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Como obter as credenciais:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Acesse o Google Cloud Console</li>
                  <li>Crie um novo projeto ou selecione um existente</li>
                  <li>Ative a API do Gmail</li>
                  <li>Crie credenciais OAuth 2.0</li>
                  <li>Configure as URLs de redirecionamento</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="client-id" className="text-sm font-medium">
                Client ID *
              </Label>
              <Input
                id="client-id"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="xxxxx.apps.googleusercontent.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="client-secret" className="text-sm font-medium">
                Client Secret *
              </Label>
              <Input
                id="client-secret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Insira o Client Secret"
                className="mt-1"
              />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">URLs de Redirecionamento</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white border rounded px-3 py-2">
                <code className="text-sm text-gray-600">
                  {window.location.origin}/auth/gmail/callback
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/auth/gmail/callback`)}
                >
                  Copiar
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Adicione esta URL nas configurações OAuth do Google Cloud Console
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => window.open('https://console.cloud.google.com', '_blank')}
              className="text-sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Google Cloud Console
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Salvar Credenciais
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
