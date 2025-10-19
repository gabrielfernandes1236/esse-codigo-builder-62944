
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  lastUpdated: string;
}

const FAQSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [feedback, setFeedback] = useState<{ [key: string]: 'helpful' | 'not-helpful' | null }>({});
  const [showComment, setShowComment] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  const faqData: FAQItem[] = [
    {
      id: "1",
      question: "Como cadastrar um novo cliente no sistema?",
      answer: "Para cadastrar um novo cliente, acesse o menu 'Clientes' na sidebar, clique no botão 'Novo Cliente' no canto superior direito, preencha todos os campos obrigatórios (nome, CPF/CNPJ, email e telefone) e clique em 'Salvar'. O cliente será automaticamente adicionado ao sistema.",
      category: "Processos",
      lastUpdated: "20/06/2025"
    },
    {
      id: "2",
      question: "Como configurar notificações automáticas do WhatsApp?",
      answer: "Vá em Configurações > Integrações > WhatsApp Avisos. Conecte sua conta do WhatsApp Business API, configure os templates de mensagem desejados e defina os triggers automáticos (novos processos, prazos próximos, etc.). Teste a configuração antes de ativar.",
      category: "Integrações",
      lastUpdated: "18/06/2025"
    },
    {
      id: "3",
      question: "Como gerar relatórios financeiros personalizados?",
      answer: "No módulo Financeiro, clique em 'Relatórios', selecione o tipo de relatório desejado, defina o período, escolha os filtros (clientes, categorias, status) e clique em 'Gerar Relatório'. Você pode exportar em PDF ou Excel.",
      category: "Financeiro",
      lastUpdated: "15/06/2025"
    },
    {
      id: "4",
      question: "Como fazer backup dos dados do sistema?",
      answer: "Em Configurações > Configurações de Backup, você pode configurar backups automáticos diários, semanais ou mensais. Os dados são salvos na nuvem de forma criptografada. Também é possível fazer backup manual clicando em 'Fazer Backup Agora'.",
      category: "Configurações",
      lastUpdated: "12/06/2025"
    },
    {
      id: "5",
      question: "Como integrar o sistema com Gmail?",
      answer: "Acesse Conectar Gmail no menu lateral, clique em 'Conectar Conta Gmail', autorize o acesso quando solicitado e configure as pastas que deseja sincronizar. Os emails relacionados aos processos serão automaticamente organizados.",
      category: "Integrações",
      lastUpdated: "10/06/2025"
    },
    {
      id: "6",
      question: "Como alterar as configurações de segurança da conta?",
      answer: "Vá em Configurações > Segurança. Você pode ativar a autenticação em dois fatores, gerenciar dispositivos conectados, alterar sua senha e configurar alertas de segurança. Recomendamos sempre manter a 2FA ativada.",
      category: "Configurações",
      lastUpdated: "08/06/2025"
    }
  ];

  const categories = ["Todos", "Integrações", "Financeiro", "Processos", "Configurações"];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFeedback = (faqId: string, type: 'helpful' | 'not-helpful') => {
    setFeedback(prev => ({ ...prev, [faqId]: type }));
    
    if (type === 'not-helpful') {
      setShowComment(prev => ({ ...prev, [faqId]: true }));
    } else {
      setShowComment(prev => ({ ...prev, [faqId]: false }));
    }
  };

  const handleCommentSubmit = (faqId: string) => {
    console.log(`Feedback negativo para FAQ ${faqId}:`, comments[faqId]);
    setShowComment(prev => ({ ...prev, [faqId]: false }));
    // Aqui seria enviado o feedback para o backend
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <i className="ri-question-answer-line text-blue-600 mr-2"></i>
          Perguntas Frequentes
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
              placeholder="Busque por perguntas ou termos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de FAQs */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="ri-search-2-line text-4xl mb-2"></i>
              <p>Nenhuma pergunta encontrada para sua busca.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border border-gray-200 rounded-lg mb-4">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-start text-left">
                      <span className="text-sm font-medium text-gray-800">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      
                      {/* Informações da resposta */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 mr-3">
                            {faq.category}
                          </span>
                          <span>Última atualização: {faq.lastUpdated}</span>
                        </div>
                        
                        {/* Botões de feedback */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 mr-2">Esta resposta foi útil?</span>
                          <Button
                            size="sm"
                            variant={feedback[faq.id] === 'helpful' ? "default" : "outline"}
                            onClick={() => handleFeedback(faq.id, 'helpful')}
                            className="h-8 px-3"
                          >
                            <i className="ri-thumb-up-line mr-1"></i>
                            Útil
                          </Button>
                          <Button
                            size="sm"
                            variant={feedback[faq.id] === 'not-helpful' ? "destructive" : "outline"}
                            onClick={() => handleFeedback(faq.id, 'not-helpful')}
                            className="h-8 px-3"
                          >
                            <i className="ri-thumb-down-line mr-1"></i>
                            Não ajudou
                          </Button>
                        </div>
                      </div>
                      
                      {/* Campo de comentário */}
                      {showComment[faq.id] && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Como podemos melhorar esta resposta?
                          </label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Deixe seu comentário..."
                              value={comments[faq.id] || ''}
                              onChange={(e) => setComments(prev => ({ ...prev, [faq.id]: e.target.value }))}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleCommentSubmit(faq.id)}
                              disabled={!comments[faq.id]?.trim()}
                            >
                              Enviar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FAQSection;
