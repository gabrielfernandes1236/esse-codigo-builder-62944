
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import FAQSection from "@/components/FAQSection";
import VideoTutorialsSection from "@/components/VideoTutorialsSection";
import DocumentationSection from "@/components/DocumentationSection";
import SupportChatSection from "@/components/SupportChatSection";
import KnowledgeBaseSection from "@/components/KnowledgeBaseSection";

const Ajuda = () => {
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  const handleChatClick = () => {
    alert('Iniciando chat com o suporte. Um especialista irá atendê-lo em instantes.');
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supportSubject) {
      alert('Por favor, selecione um assunto para sua solicitação.');
      return;
    }
    
    if (!supportMessage || supportMessage.trim().length < 10) {
      alert('Por favor, forneça uma descrição detalhada da sua solicitação (mínimo 10 caracteres).');
      return;
    }
    
    alert('Sua solicitação foi enviada com sucesso! Responderemos em até 24 horas úteis.');
    setSupportSubject("");
    setSupportMessage("");
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.length > 2) {
      alert(`Buscando por: "${searchTerm}" na base de conhecimento`);
    } else {
      alert('Por favor, digite pelo menos 3 caracteres para realizar a busca.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Central de Ajuda</h1>
              <p className="text-gray-600 mt-1">Encontre respostas, tutoriais e suporte para o CRM Jurídico</p>
            </div>
          </div>

          {/* Search Bar for Help */}
          <div className="bg-white rounded-md shadow-sm p-6 mb-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-medium text-gray-800 mb-3 text-center">Como podemos ajudar você hoje?</h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                    <i className="ri-search-line"></i>
                  </div>
                </div>
                <input 
                  type="text" 
                  placeholder="Busque por tópicos, tutoriais ou perguntas frequentes..." 
                  className="pl-12 pr-4 py-3 border border-gray-300 rounded-md bg-white text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const target = e.target as HTMLInputElement;
                      handleSearch(target.value.trim());
                    }
                  }}
                />
                <button 
                  className="absolute right-2 top-2 px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                    if (input) {
                      handleSearch(input.value.trim());
                    }
                  }}
                >
                  Buscar
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
                <span className="text-gray-500">Buscas populares:</span>
                <a href="#" className="text-blue-600 hover:underline">Como cadastrar cliente</a>
                <a href="#" className="text-blue-600 hover:underline">Integração com WhatsApp</a>
                <a href="#" className="text-blue-600 hover:underline">Relatórios financeiros</a>
                <a href="#" className="text-blue-600 hover:underline">Backup de dados</a>
              </div>
            </div>
          </div>

          {/* Main Help Sections */}
          <div className="space-y-8">
            <FAQSection />
            <VideoTutorialsSection />
            <DocumentationSection />
            <SupportChatSection />
            <KnowledgeBaseSection />
          </div>

          {/* Contact Support Form */}
          <div className="mt-8">
            <div className="bg-white rounded-md shadow-sm p-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                  <i className="ri-mail-send-line"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">Contato com Suporte</h3>
                  <p className="text-gray-600 text-sm mt-1">Envie uma solicitação para nossa equipe técnica.</p>
                </div>
              </div>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label htmlFor="support-subject" className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                  <select 
                    id="support-subject" 
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    className="border border-gray-300 rounded-md bg-white text-sm w-full p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="technical">Problema técnico</option>
                    <option value="billing">Faturamento</option>
                    <option value="feature">Sugestão de funcionalidade</option>
                    <option value="other">Outro assunto</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="support-message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                  <textarea 
                    id="support-message" 
                    rows={4} 
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    className="border border-gray-300 rounded-md bg-white text-sm w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
                    placeholder="Descreva sua solicitação..."
                  ></textarea>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Tempo médio de resposta: até 24 horas úteis</p>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Enviar Solicitação
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Atualizações Recentes</h2>
            <div className="bg-white rounded-md shadow-sm p-5">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <i className="ri-information-line"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Nova versão 2.5 do CRM Jurídico disponível</p>
                    <p className="text-sm text-gray-600 mt-1">Inclui melhorias na integração com WhatsApp e novo módulo de relatórios financeiros.</p>
                    <p className="text-xs text-gray-500 mt-1">22 de junho, 2025</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <i className="ri-book-open-line"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Novos tutoriais em vídeo adicionados</p>
                    <p className="text-sm text-gray-600 mt-1">Tutoriais sobre como usar o novo sistema de geração de documentos automáticos.</p>
                    <p className="text-xs text-gray-500 mt-1">18 de junho, 2025</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <i className="ri-calendar-event-line"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Webinar: Novidades do CRM Jurídico</p>
                    <p className="text-sm text-gray-600 mt-1">Participe do nosso webinar gratuito sobre as novas funcionalidades. <a href="#" className="text-blue-600 hover:underline">Inscreva-se aqui</a>.</p>
                    <p className="text-xs text-gray-500 mt-1">30 de junho, 2025 - 15:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Ajuda;
