
import { Scale, Users, FileText, Calendar, DollarSign, File, Settings, HelpCircle, Home, Mail, MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/", active: location.pathname === "/" },
    { icon: Users, label: "Clientes", path: "/clientes", active: location.pathname === "/clientes" },
    { icon: FileText, label: "Processos", path: "/processos", active: location.pathname === "/processos" },
    { icon: Calendar, label: "Agenda", path: "/agenda", active: location.pathname === "/agenda" },
    { icon: DollarSign, label: "Financeiro", path: "/financeiro", active: location.pathname === "/financeiro" },
    { icon: File, label: "Documentos", path: "/documentos", active: location.pathname === "/documentos" },
    { icon: Mail, label: "Conectar Gmail", path: "/conectar-gmail", active: location.pathname === "/conectar-gmail" },
    { icon: MessageCircle, label: "WhatsApp Avisos", path: "/whatsapp-avisos", active: location.pathname === "/whatsapp-avisos" },
    { icon: FileText, label: "Tarefas Diárias", path: "/tarefas-diarias", active: location.pathname === "/tarefas-diarias" },
  ];

  const configItems = [
    { icon: Settings, label: "Configurações", path: "/configuracoes", active: location.pathname === "/configuracoes" },
    { icon: HelpCircle, label: "Ajuda", path: "/ajuda", active: location.pathname === "/ajuda" },
  ];

  return (
    <aside className="w-56 bg-white shadow-lg hidden md:flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-2xl text-blue-600 font-bold">CRM Jurídico</h1>
      </div>
      
      {/* Menu Principal - com rolagem */}
      <div className="flex-1 overflow-y-auto">
        <nav className="mt-6">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">Principal</div>
          
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-700 ${
                item.active ? "bg-gray-100 border-l-4 border-blue-600" : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-2" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
      
      {/* Configurações - fixo no rodapé */}
      <div className="border-t border-gray-200 flex-shrink-0">
        <nav>
          <div className="px-4 mt-4 mb-2 text-xs font-semibold text-gray-400 uppercase">Configurações</div>
          
          {configItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-700 ${
                item.active ? "bg-gray-100 border-l-4 border-blue-600 text-blue-600" : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-2" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};
