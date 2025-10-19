
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useClientsData } from '@/hooks/useClientsData';
import { Upload, X } from 'lucide-react';

interface NovoDocumentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (documentData: any) => void;
}

export const NovoDocumentoModal: React.FC<NovoDocumentoModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { clients } = useClientsData();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    clientId: '',
    description: '',
    file: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.type || !formData.clientId || !formData.file) {
      return;
    }

    onSave({
      ...formData,
      status: 'Em andamento',
      createdAt: new Date().toISOString(),
      fileName: formData.file?.name || '',
      fileSize: formData.file?.size || 0
    });

    // Reset form
    setFormData({
      title: '',
      type: '',
      clientId: '',
      description: '',
      file: null
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (allowedTypes.includes(file.type)) {
        setFormData(prev => ({ ...prev, file }));
      } else {
        alert('Tipo de arquivo não permitido. Use: PDF, DOC, DOCX, JPG ou PNG');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Documento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título do Documento</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Contrato de Prestação de Serviços"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type">Tipo de Documento</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contrato">Contrato</SelectItem>
                  <SelectItem value="Processual">Processual</SelectItem>
                  <SelectItem value="Parecer">Parecer</SelectItem>
                  <SelectItem value="Proposta">Proposta</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="client">Cliente Relacionado</Label>
            <Select value={formData.clientId} onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="file">Upload de Arquivo</Label>
            <div className="mt-1">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
              />
              <label
                htmlFor="file"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 bg-gray-50"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {formData.file ? formData.file.name : 'Clique para fazer upload'}
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG (máx. 10MB)</p>
                </div>
              </label>
              {formData.file && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                  className="mt-2 text-red-500 text-sm flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remover arquivo
                </button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição opcional do documento..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Documento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
