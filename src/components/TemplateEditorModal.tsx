
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useClientsData } from '@/hooks/useClientsData';
import { RichTextEditor } from '@/components/RichTextEditor';
import { professionalTemplates } from '@/utils/documentTemplates';
import { processPlaceholders, getTemplateType } from '@/utils/documentProcessor';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (documentData: any) => void;
  template: {
    id: string;
    title: string;
    type: string;
    description?: string;
    icon?: string;
  } | null;
}

export const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  template
}) => {
  const { clients } = useClientsData();
  const [selectedClientId, setSelectedClientId] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasUserEditedContent, setHasUserEditedContent] = useState(false);
  const lastAutoFilledClientRef = useRef<string>('');

  // Initialize template content when modal opens
  useEffect(() => {
    console.log('🔧 Modal opened, initializing template:', template?.title);
    
    if (template && isOpen) {
      const baseContent = professionalTemplates[template.id as keyof typeof professionalTemplates] || '';
      console.log('📝 Setting initial template content');
      
      setContent(baseContent);
      setDocumentTitle(template.title);
      setSelectedClientId('');
      setHasUserEditedContent(false);
      lastAutoFilledClientRef.current = '';
    }
  }, [template, isOpen]);

  // Process placeholders when client is selected - ONLY if user hasn't edited content manually
  useEffect(() => {
    console.log('🎯 Client selection changed:', selectedClientId);
    console.log('👤 User has edited content:', hasUserEditedContent);
    console.log('🔄 Last auto-filled client:', lastAutoFilledClientRef.current);
    
    if (selectedClientId && template && !hasUserEditedContent && lastAutoFilledClientRef.current !== selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      if (client) {
        console.log('🔄 Auto-filling template for client:', client.name);
        
        // Get base template content
        const baseContent = professionalTemplates[template.id as keyof typeof professionalTemplates] || '';
        
        // Process placeholders with client data
        const processedContent = processPlaceholders(baseContent, client);
        
        console.log('✅ Template auto-filled successfully');
        setContent(processedContent);
        lastAutoFilledClientRef.current = selectedClientId;
      }
    } else if (!selectedClientId && template && !hasUserEditedContent) {
      // If no client selected and user hasn't edited, show base template
      console.log('🔄 No client selected, showing base template');
      const baseContent = professionalTemplates[template.id as keyof typeof professionalTemplates] || '';
      setContent(baseContent);
      lastAutoFilledClientRef.current = '';
    }
  }, [selectedClientId, clients, template, hasUserEditedContent]);

  const handleContentChange = (newContent: string) => {
    console.log('✏️ User manually editing content - blocking auto-fill');
    setContent(newContent);
    setHasUserEditedContent(true);
  };

  const handleClientChange = (clientId: string) => {
    console.log('👤 Client selection changed to:', clientId);
    setSelectedClientId(clientId);
    
    // If user selects a different client, allow auto-fill again
    if (clientId !== lastAutoFilledClientRef.current) {
      console.log('🔓 New client selected - allowing auto-fill');
      setHasUserEditedContent(false);
    }
  };

  const handleRefillContent = () => {
    if (selectedClientId && template) {
      const client = clients.find(c => c.id === selectedClientId);
      if (client) {
        console.log('🔄 Manual refill requested for client:', client.name);
        
        const baseContent = professionalTemplates[template.id as keyof typeof professionalTemplates] || '';
        const processedContent = processPlaceholders(baseContent, client);
        
        setContent(processedContent);
        setHasUserEditedContent(false);
        lastAutoFilledClientRef.current = selectedClientId;
        
        console.log('✅ Manual refill completed');
      }
    }
  };

  const handleSave = () => {
    if (!documentTitle || !selectedClientId || !content) {
      console.log('❌ Save blocked - missing required fields');
      return;
    }

    const client = clients.find(c => c.id === selectedClientId);
    const templateType = getTemplateType(template?.id || '');
    
    console.log('💾 Saving document:', {
      title: documentTitle,
      clientName: client?.name,
      contentLength: content.length,
      templateType
    });
    
    onSave({
      title: documentTitle,
      type: templateType,
      clientId: selectedClientId,
      clientName: client?.name || '',
      content: content,
      status: 'Em andamento',
      createdAt: new Date().toISOString(),
      fileName: `${documentTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: content.length * 8
    });

    handleClose();
  };

  const handleClose = () => {
    console.log('🚪 Closing modal - resetting all states');
    setSelectedClientId('');
    setDocumentTitle('');
    setContent('');
    setHasUserEditedContent(false);
    lastAutoFilledClientRef.current = '';
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Editar Template: {template?.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Título do Documento
              </Label>
              <Input
                id="title"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Ex: Procuração para João Silva"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="client" className="text-sm font-medium">
                Cliente
              </Label>
              <Select value={selectedClientId} onValueChange={handleClientChange}>
                <SelectTrigger className="mt-1">
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
          </div>

          {selectedClientId && hasUserEditedContent && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleRefillContent}
                className="text-sm"
              >
                🔄 Preencher Novamente com Dados do Cliente
              </Button>
            </div>
          )}

          <div>
            <Label htmlFor="content" className="text-sm font-medium mb-2 block">
              Conteúdo do Documento
            </Label>
            <RichTextEditor
              key={`${template?.id}-${selectedClientId}-${lastAutoFilledClientRef.current}`}
              value={content}
              onChange={handleContentChange}
              placeholder="O conteúdo do template aparecerá aqui..."
              className="border rounded-lg"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              <h4 className="font-semibold mb-2">ℹ️ Informações Importantes:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Os campos entre {`{{ }}`} são preenchidos automaticamente com dados do cliente</li>
                <li>• Campos em [colchetes] devem ser editados manualmente conforme o caso</li>
                <li>• Use o editor acima para formatar o texto (negrito, itálico, listas, etc.)</li>
                <li>• A formatação será mantida no documento final</li>
                <li>• Selecione um cliente para preencher automaticamente os dados</li>
                <li>• Após editar manualmente, use o botão "Preencher Novamente" se necessário</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 px-6"
              disabled={!documentTitle || !selectedClientId}
            >
              Salvar Documento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
