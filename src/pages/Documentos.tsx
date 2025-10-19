
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Download,
  Plus,
  Filter,
  Eye,
  MoreHorizontal,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NovoDocumentoModal } from "@/components/NovoDocumentoModal";
import { DocumentPreviewModal } from "@/components/DocumentPreviewModal";
import { TemplateEditorModal } from "@/components/TemplateEditorModal";
import { useDocumentsData } from "@/hooks/useDocumentsData";
import { useClientsData } from "@/hooks/useClientsData";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Documentos = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: 'Todos',
    type: 'Todos',
    clientId: 'Todos',
    dateRange: 'Todos'
  });

  const { 
    documents, 
    addDocument, 
    updateDocumentStatus,
    getFilteredDocuments
  } = useDocumentsData();
  const { clients } = useClientsData();

  const getTabFilteredDocuments = () => {
    let baseFilters = {
      searchTerm,
      ...filters
    };

    // Apply tab-specific type filter
    if (activeTab !== 'todos') {
      const typeMap = {
        'contratos': 'Contrato',
        'processuais': 'Processual', 
        'pareceres': 'Parecer',
        'outros': 'Outros'
      };
      baseFilters.type = typeMap[activeTab as keyof typeof typeMap] || 'Todos';
    }

    return getFilteredDocuments(baseFilters);
  };

  const filteredDocuments = getTabFilteredDocuments();
  
  // Pagination logic
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  // Templates jurídicos para os cards
  const documentTemplates = [
    {
      id: 'procuracao',
      title: 'Procuração',
      description: 'Modelo de procuração para representação legal',
      icon: '⚖️',
      type: 'Processual'
    },
    {
      id: 'contrato-prestacao',
      title: 'Contrato de Prestação',
      description: 'Template para contratos de serviços jurídicos',
      icon: '📄',
      type: 'Contrato'
    },
    {
      id: 'peticao-inicial',
      title: 'Petição Inicial',
      description: 'Modelo para petições iniciais processuais',
      icon: '📝',
      type: 'Processual'
    },
    {
      id: 'parecer-juridico',
      title: 'Parecer Jurídico',
      description: 'Template para pareceres e análises legais',
      icon: '👤',
      type: 'Parecer'
    }
  ];

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setShowPreviewModal(true);
  };

  const handleDownloadDocument = (document: any) => {
    console.log('Downloading:', document.fileName);
  };

  const handleUseTemplate = (template: any) => {
    console.log('Using template:', template.title, 'Type:', template.type);
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    setCurrentPage(1);
    console.log('Applying filters:', filters);
  };

  const handleClearFilters = () => {
    setFilters({ status: 'Todos', type: 'Todos', clientId: 'Todos', dateRange: 'Todos' });
    setCurrentPage(1);
  };

  const handleDeleteDocument = (documentId: string) => {
    updateDocumentStatus(documentId, 'Removido');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'Contrato': return '📄';
      case 'Processual': return '⚖️';
      case 'Parecer': return '👤';
      case 'Proposta': return '📊';
      default: return '📋';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
          {/* Search Bar */}
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="bg-gray-100 text-sm rounded-md pl-10 pr-4 py-2 w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="relative p-2">
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</div>
                <Bell className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center">
              <img 
                src="https://readdy.ai/api/search-image?query=professional%20profile%20picture%20of%20a%20lawyer%2C%20male%2C%20formal%20suit%2C%20minimalist%20background&width=100&height=100&seq=1&orientation=squarish" 
                alt="Dr. Ricardo Oliveira" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="ml-2 flex items-center">
                <span className="text-sm font-medium">Dr. Ricardo Oliveira</span>
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Page Header */}
          <div className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-medium">Documentos</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setShowNewDocumentModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Novo Documento</span>
              </Button>
            </div>
          </div>

          {/* Document Template Cards */}
          <div className="grid grid-cols-4 gap-4 p-6">
            {documentTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded shadow p-4 relative overflow-hidden">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-3">
                  <div className="w-4 h-4">{template.icon}</div>
                </div>
                <h3 className="text-sm font-medium mb-1">{template.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{template.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {template.type}
                  </span>
                  <button 
                    onClick={() => handleUseTemplate(template)}
                    className="text-xs text-blue-600"
                  >
                    Usar Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Document List */}
          <div className="px-6 pb-6">
            <div className="bg-white rounded shadow">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="h-auto p-0 bg-transparent border-b border-gray-200 rounded-none w-full justify-start">
                  <TabsTrigger 
                    value="todos" 
                    className="px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none bg-transparent"
                  >
                    Todos os documentos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contratos"
                    className="px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none bg-transparent"
                  >
                    Contratos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="processuais"
                    className="px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none bg-transparent"
                  >
                    Processuais
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pareceres"
                    className="px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none bg-transparent"
                  >
                    Pareceres
                  </TabsTrigger>
                  <TabsTrigger 
                    value="outros"
                    className="px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none bg-transparent"
                  >
                    Outros
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  {/* Search and Filter */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div className="relative w-64">
                      <input 
                        type="text" 
                        placeholder="Buscar documentos..." 
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Search className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded"
                      >
                        <Filter className="w-4 h-4 mr-1" />
                        <span>Filtros</span>
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 bg-gray-50">
                          <th className="px-4 py-3 font-medium w-8">
                            <input type="checkbox" className="rounded" />
                          </th>
                          <th className="px-4 py-3 font-medium">NOME</th>
                          <th className="px-4 py-3 font-medium">TIPO</th>
                          <th className="px-4 py-3 font-medium">CLIENTE RELACIONADO</th>
                          <th className="px-4 py-3 font-medium text-right">AÇÕES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedDocuments.map((doc) => (
                          <tr key={doc.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <input type="checkbox" className="rounded" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="w-6 h-6 flex items-center justify-center text-blue-600 mr-2">
                                  {getDocumentIcon(doc.type)}
                                </div>
                                <span className="text-sm">{doc.title}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">{doc.type}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs mr-2">
                                  {doc.clientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <span className="text-sm">{doc.clientName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={() => handleViewDocument(doc)}
                                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDownloadDocument(doc)}
                                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                    >
                                      Excluir documento
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(endIndex, filteredDocuments.length)}</span> de <span className="font-medium">{filteredDocuments.length}</span> resultados
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ←
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button 
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded border ${
                            currentPage === page 
                              ? 'border-blue-600 bg-blue-600 text-white' 
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      {/* Filter Sidebar */}
      {isFilterOpen && (
        <div className="w-64 bg-white border-l border-gray-200 h-full overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium">Filtros</h3>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {activeTab === 'todos' && (
              <div>
                <h4 className="text-xs font-medium uppercase text-gray-500 mb-2">Tipo de Documento</h4>
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Contrato">Contrato</SelectItem>
                    <SelectItem value="Processual">Processual</SelectItem>
                    <SelectItem value="Parecer">Parecer</SelectItem>
                    <SelectItem value="Proposta">Proposta</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <h4 className="text-xs font-medium uppercase text-gray-500 mb-2">Cliente</h4>
              <Select value={filters.clientId} onValueChange={(value) => setFilters(prev => ({ ...prev, clientId: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 border-t border-gray-200 flex space-x-2">
              <Button 
                onClick={handleApplyFilters}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Aplicar
              </Button>
              <Button 
                onClick={handleClearFilters}
                variant="outline" 
                className="flex-1"
              >
                Limpar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <NovoDocumentoModal 
        isOpen={showNewDocumentModal}
        onClose={() => setShowNewDocumentModal(false)}
        onSave={addDocument}
      />

      <DocumentPreviewModal 
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        document={selectedDocument}
      />

      <TemplateEditorModal 
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSave={addDocument}
        template={selectedTemplate}
      />
    </div>
  );
};
