
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Document {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  fileType: string;
  size: string;
}

const DocumentationSection = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const documents: Document[] = [
    {
      id: "1",
      title: "Manual do Usuário Completo",
      description: "Guia completo de utilização do CRM Jurídico com instruções detalhadas de todas as funcionalidades.",
      lastUpdated: "10/06/2025",
      fileType: "PDF",
      size: "2.5 MB"
    },
    {
      id: "2",
      title: "Guia de Administração",
      description: "Manual para administradores do sistema com configurações avançadas e gerenciamento de usuários.",
      lastUpdated: "05/06/2025",
      fileType: "PDF",
      size: "1.8 MB"
    },
    {
      id: "3",
      title: "Guia de Integrações",
      description: "Documentação técnica para configurar integrações com WhatsApp, Gmail e outros sistemas externos.",
      lastUpdated: "01/06/2025",
      fileType: "DOCX",
      size: "1.2 MB"
    },
    {
      id: "4",
      title: "Manual de Relatórios",
      description: "Como criar, personalizar e exportar relatórios financeiros e operacionais do sistema.",
      lastUpdated: "28/05/2025",
      fileType: "PDF",
      size: "1.5 MB"
    }
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (document: Document) => {
    alert(`Iniciando download do documento: ${document.title}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <i className="ri-book-open-line text-purple-600 mr-2"></i>
          Documentação do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Campo de busca */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400"></i>
            </div>
            <Input
              type="text"
              placeholder="Buscar documentos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de documentos */}
        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="ri-file-search-line text-4xl mb-2"></i>
              <p>Nenhum documento encontrado para sua busca.</p>
            </div>
          ) : (
            filteredDocuments.map((document) => (
              <div key={document.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                      <i className="ri-file-text-line text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">{document.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{document.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Atualizado em {document.lastUpdated}</span>
                        <span>•</span>
                        <span>{document.fileType}</span>
                        <span>•</span>
                        <span>{document.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(document)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-200"
                  >
                    <i className="ri-download-line"></i>
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botão para ver toda documentação */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
            <i className="ri-folder-open-line mr-2"></i>
            Ver toda documentação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentationSection;
