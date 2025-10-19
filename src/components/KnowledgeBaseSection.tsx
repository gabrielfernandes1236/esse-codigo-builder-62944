
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Article {
  id: string;
  title: string;
  preview: string;
  category: string;
  lastUpdated: string;
  views: number;
}

const KnowledgeBaseSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const articles: Article[] = [
    {
      id: "1",
      title: "Como resolver problemas de sincronização com o WhatsApp",
      preview: "Passo a passo para diagnosticar e corrigir problemas comuns de sincronização entre o CRM e WhatsApp Business API. Inclui verificação de webhooks e configurações de API.",
      category: "Integrações",
      lastUpdated: "18/06/2025",
      views: 342
    },
    {
      id: "2",
      title: "Guia para importação de dados de outros sistemas",
      preview: "Aprenda a migrar dados de planilhas Excel, outros CRMs e sistemas jurídicos para o CRM Jurídico. Formatos suportados e melhores práticas para importação em massa.",
      category: "Processos",
      lastUpdated: "15/06/2025",
      views: 128
    },
    {
      id: "3",
      title: "Configuração avançada de notificações automáticas",
      preview: "Configure alertas personalizados para prazos processuais, audiências e compromissos. Includes configuração de regras condicionais e templates de mensagem.",
      category: "Notificações",
      lastUpdated: "12/06/2025",
      views: 95
    },
    {
      id: "4",
      title: "Otimização de relatórios financeiros para escritórios grandes",
      preview: "Técnicas para acelerar a geração de relatórios em escritórios com muitos processos e clientes. Inclui filtros avançados e configurações de performance.",
      category: "Relatórios",
      lastUpdated: "10/06/2025",
      views: 201
    },
    {
      id: "5",
      title: "Sincronização de agenda com calendários externos",
      preview: "Configure a sincronização bidirecional com Google Calendar, Outlook e outros sistemas de agenda. Evite conflitos de horários e mantenha tudo organizado.",
      category: "Agenda",
      lastUpdated: "08/06/2025",
      views: 156
    }
  ];

  const categories = ["Todos", "Integrações", "Processos", "Notificações", "Relatórios", "Agenda"];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      console.log(`Buscando por: "${searchTerm}"`);
    }
  };

  const handleArticleClick = (article: Article) => {
    alert(`Abrindo artigo: ${article.title}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <i className="ri-book-2-line text-amber-600 mr-2"></i>
          Base de Conhecimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Campo de busca */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400"></i>
              </div>
              <Input
                type="text"
                placeholder="Buscar artigos na base de conhecimento..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <Button onClick={handleSearch} className="bg-amber-600 hover:bg-amber-700">
              <i className="ri-search-line mr-2"></i>
              Buscar
            </Button>
          </div>
        </div>

        {/* Filtros por categoria */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`text-sm ${selectedCategory === category ? 'bg-amber-600 hover:bg-amber-700' : 'border-amber-200 text-amber-700 hover:bg-amber-50'}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Sugestões populares */}
        {searchTerm === "" && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="text-sm font-medium text-amber-800 mb-2">Buscas populares:</h4>
            <div className="flex flex-wrap gap-2">
              {["WhatsApp", "importação", "relatórios", "agenda", "notificações"].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchTerm(term)}
                  className="px-3 py-1 bg-white border border-amber-300 rounded-full text-xs text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lista de artigos */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="ri-article-line text-4xl mb-2"></i>
              <p>Nenhum artigo encontrado para sua busca.</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div 
                key={article.id} 
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleArticleClick(article)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{article.views} visualizações</span>
                      </div>
                      <h3 className="font-medium text-gray-800 mb-2 hover:text-amber-700 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {article.preview}
                      </p>
                    </div>
                    <div className="ml-4 text-amber-600">
                      <i className="ri-arrow-right-s-line text-xl"></i>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Atualizado em {article.lastUpdated}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botão para ver todos os artigos */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50">
            <i className="ri-article-line mr-2"></i>
            Ver todos os artigos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseSection;
