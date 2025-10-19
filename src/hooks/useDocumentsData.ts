
import { useState } from 'react';
import { useClientsData } from './useClientsData';

interface Document {
  id: string;
  title: string;
  type: string;
  fileName: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  modifiedAt: string;
  status: string;
  description?: string;
  isFavorite: boolean;
  isShared: boolean;
  fileSize: number;
}

const sampleDocuments: Document[] = [
  {
    id: '1',
    title: 'Contrato de Prestação de Serviços',
    type: 'Contrato',
    fileName: 'contrato_prestacao_servicos.pdf',
    clientId: '1',
    clientName: 'Marcos Ribeiro',
    createdAt: '2025-06-20T10:00:00Z',
    modifiedAt: '2025-06-20T10:00:00Z',
    status: 'Finalizado',
    isFavorite: false,
    isShared: false,
    fileSize: 1024000
  },
  {
    id: '2',
    title: 'Projeto Social - Proposta Tributária',
    type: 'Proposta',
    fileName: 'proposta_tributaria.pdf',
    clientId: '2',
    clientName: 'Tech Innovations Ltda.',
    createdAt: '2025-06-18T14:30:00Z',
    modifiedAt: '2025-06-19T09:15:00Z',
    status: 'Pendente',
    isFavorite: true,
    isShared: true,
    fileSize: 2048000
  },
  {
    id: '3',
    title: 'Pedido de Recurso - Intimação',
    type: 'Processual',
    fileName: 'pedido_recurso.docx',
    clientId: '3',
    clientName: 'Carolina Santos',
    createdAt: '2025-06-17T16:20:00Z',
    modifiedAt: '2025-06-17T16:20:00Z',
    status: 'Revisão',
    isFavorite: false,
    isShared: false,
    fileSize: 512000
  },
  {
    id: '4',
    title: 'Parecer Jurídico - Caso Empresarial',
    type: 'Parecer',
    fileName: 'parecer_empresarial.pdf',
    clientId: '4',
    clientName: 'Grupo Construtor S.A.',
    createdAt: '2025-06-15T11:45:00Z',
    modifiedAt: '2025-06-16T08:30:00Z',
    status: 'Concluído',
    isFavorite: true,
    isShared: true,
    fileSize: 3072000
  },
  {
    id: '5',
    title: 'Contrato de Locação Comercial',
    type: 'Contrato',
    fileName: 'contrato_locacao.pdf',
    clientId: '5',
    clientName: 'Rafael Fernandes',
    createdAt: '2025-06-14T13:10:00Z',
    modifiedAt: '2025-06-14T13:10:00Z',
    status: 'Finalizado',
    isFavorite: false,
    isShared: false,
    fileSize: 1536000
  },
  {
    id: '6',
    title: 'Petição Inicial - Ação Trabalhista',
    type: 'Processual',
    fileName: 'peticao_inicial.docx',
    clientId: '6',
    clientName: 'Farmácia Saúde Ltda.',
    createdAt: '2025-06-12T09:25:00Z',
    modifiedAt: '2025-06-13T15:40:00Z',
    status: 'Em andamento',
    isFavorite: false,
    isShared: true,
    fileSize: 768000
  }
];

export const useDocumentsData = () => {
  const { clients } = useClientsData();
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);

  const addDocument = (documentData: any) => {
    const client = clients.find(c => c.id === documentData.clientId);
    const newDocument: Document = {
      id: (documents.length + 1).toString(),
      title: documentData.title,
      type: documentData.type,
      fileName: documentData.fileName,
      clientId: documentData.clientId,
      clientName: client?.name || '',
      createdAt: documentData.createdAt,
      modifiedAt: documentData.createdAt,
      status: documentData.status,
      description: documentData.description,
      isFavorite: false,
      isShared: false,
      fileSize: documentData.fileSize
    };
    
    setDocuments(prev => [...prev, newDocument]);
  };

  const toggleFavorite = (documentId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, isFavorite: !doc.isFavorite }
        : doc
    ));
  };

  const toggleShared = (documentId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, isShared: !doc.isShared }
        : doc
    ));
  };

  const updateDocumentStatus = (documentId: string, status: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, status, modifiedAt: new Date().toISOString() }
        : doc
    ));
  };

  const getFilteredDocuments = (filters: {
    section?: string;
    status?: string;
    type?: string;
    clientId?: string;
    dateRange?: string;
    searchTerm?: string;
  }) => {
    let filtered = [...documents];

    // Filter by section
    if (filters.section === 'Recentes') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(doc => new Date(doc.createdAt) >= oneWeekAgo);
    } else if (filters.section === 'Favoritos') {
      filtered = filtered.filter(doc => doc.isFavorite);
    } else if (filters.section === 'Compartilhados') {
      filtered = filtered.filter(doc => doc.isShared);
    }

    // Filter by status
    if (filters.status && filters.status !== 'Todos') {
      filtered = filtered.filter(doc => doc.status === filters.status);
    }

    // Filter by type
    if (filters.type && filters.type !== 'Todos') {
      filtered = filtered.filter(doc => doc.type === filters.type);
    }

    // Filter by client
    if (filters.clientId && filters.clientId !== 'Todos') {
      filtered = filtered.filter(doc => doc.clientId === filters.clientId);
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange !== 'Todos') {
      const now = new Date();
      let dateThreshold = new Date();
      
      switch (filters.dateRange) {
        case 'Última semana':
          dateThreshold.setDate(now.getDate() - 7);
          break;
        case 'Último mês':
          dateThreshold.setMonth(now.getMonth() - 1);
          break;
        case 'Últimos 3 meses':
          dateThreshold.setMonth(now.getMonth() - 3);
          break;
        case 'Este ano':
          dateThreshold = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      filtered = filtered.filter(doc => new Date(doc.createdAt) >= dateThreshold);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        doc.clientName.toLowerCase().includes(term) ||
        doc.type.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getStorageStats = (clientId?: string) => {
    let relevantDocs = documents;
    if (clientId && clientId !== 'Todos') {
      relevantDocs = documents.filter(doc => doc.clientId === clientId);
    }

    const totalSize = relevantDocs.reduce((sum, doc) => sum + doc.fileSize, 0);
    const totalSizeGB = totalSize / (1024 * 1024 * 1024);
    const maxSizeGB = 10;
    const usagePercent = (totalSizeGB / maxSizeGB) * 100;

    const docsByType = relevantDocs.reduce((acc, doc) => {
      const type = doc.fileName.split('.').pop()?.toLowerCase() || 'outros';
      acc[type] = (acc[type] || 0) + doc.fileSize;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSizeGB: Math.round(totalSizeGB * 100) / 100,
      maxSizeGB,
      usagePercent: Math.min(usagePercent, 100),
      docsByType
    };
  };

  return {
    documents,
    addDocument,
    toggleFavorite,
    toggleShared,
    updateDocumentStatus,
    getFilteredDocuments,
    getStorageStats
  };
};
