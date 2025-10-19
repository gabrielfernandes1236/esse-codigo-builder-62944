import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { useDashboardRefresh } from '@/hooks/useDashboardRefresh';

interface Client {
  id?: string;
  name: string;
  email: string;
  type: 'PF' | 'PJ';
  phone: string;
  location: string;
  cpf_cnpj: string;
  status: 'Ativo' | 'Inativo';
  address?: string;
  documents?: string[];
  uploadedFiles?: { [key: string]: string[] };
}

interface NovoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  client?: Client | null;
  isEditing?: boolean;
}

export const NovoClienteModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  client, 
  isEditing = false 
}: NovoClienteModalProps) => {
  const { refreshDashboard } = useDashboardRefresh();
  const [formData, setFormData] = useState<Client>({
    name: '',
    email: '',
    type: 'PF',
    phone: '',
    location: '',
    cpf_cnpj: '',
    status: 'Ativo',
    address: '',
    documents: [],
    uploadedFiles: {}
  });

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string[] }>({});
  
  // Refs para inputs de arquivo
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Update form data whenever the client prop changes or modal opens
  useEffect(() => {
    if (isOpen && client && isEditing) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        type: client.type || 'PF',
        phone: client.phone || '',
        location: client.location || '',
        cpf_cnpj: client.cpf_cnpj || '',
        status: client.status || 'Ativo',
        address: client.address || '',
        documents: client.documents || [],
        uploadedFiles: client.uploadedFiles || {}
      });
      setSelectedDocuments(client.documents || []);
      setUploadedFiles(client.uploadedFiles || {});
    } else if (isOpen && !isEditing) {
      // Reset form for new client
      setFormData({
        name: '',
        email: '',
        type: 'PF',
        phone: '',
        location: '',
        cpf_cnpj: '',
        status: 'Ativo',
        address: '',
        documents: [],
        uploadedFiles: {}
      });
      setSelectedDocuments([]);
      setUploadedFiles({});
    }
  }, [isOpen, client, isEditing]);

  const documentTypes = [
    'Certidão de Nascimento',
    'Certidão de Casamento',
    'Procuração',
    'Contrato de Serviço',
    'Comprovante de Residência',
    'Comprovante de Renda',
    'RG/CNH',
    'Comprovante Bancário',
    'Documentos Societários',
    'Outros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientData = {
      ...formData,
      documents: selectedDocuments,
      uploadedFiles: uploadedFiles,
      id: client?.id
    };
    
    onSave(clientData);
    
    // Atualizar dashboard após salvar
    setTimeout(() => {
      refreshDashboard();
    }, 100);
  };

  const handleDocumentToggle = (doc: string) => {
    setSelectedDocuments(prev => 
      prev.includes(doc) 
        ? prev.filter(d => d !== doc)
        : [...prev, doc]
    );
  };

  const handleFileUpload = (docType: string) => {
    // Criar um input de arquivo dinamicamente
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    input.multiple = true;
    
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const fileNames = Array.from(files).map(file => file.name);
        setUploadedFiles(prev => ({
          ...prev,
          [docType]: [...(prev[docType] || []), ...fileNames]
        }));
        
        // Marcar automaticamente o documento como selecionado quando um arquivo é enviado
        if (!selectedDocuments.includes(docType)) {
          setSelectedDocuments(prev => [...prev, docType]);
        }
        
        console.log(`Arquivos enviados para ${docType}:`, fileNames);
      }
    };
    
    // Simular clique no input
    input.click();
  };

  const removeUploadedFile = (docType: string, fileName: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [docType]: (prev[docType] || []).filter(f => f !== fileName)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'PF' | 'PJ' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PF">Pessoa Física (PF)</option>
                <option value="PJ">Pessoa Jurídica (PJ)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'PF' ? 'CPF' : 'CNPJ'} *
              </label>
              <input
                type="text"
                required
                value={formData.cpf_cnpj}
                onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={formData.type === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="cliente@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Ativo' | 'Inativo' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade/Estado
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="São Paulo - SP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço Completo
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rua, número, bairro, CEP"
            />
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documentos
              </label>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {documentTypes.map((doc) => (
                  <div key={doc} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(doc)}
                          onChange={() => handleDocumentToggle(doc)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleFileUpload(doc)}
                        className="flex items-center text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </button>
                    </div>
                    
                    {uploadedFiles[doc] && uploadedFiles[doc].length > 0 && (
                      <div className="mt-2 space-y-1">
                        {uploadedFiles[doc].map((fileName, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-xs">
                            <div className="flex items-center">
                              <FileText className="w-3 h-3 mr-1 text-gray-500" />
                              <span className="text-gray-700">{fileName}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeUploadedFile(doc, fileName)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
