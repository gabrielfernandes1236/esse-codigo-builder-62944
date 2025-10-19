
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import { Clients } from "@/pages/Clients";
import { Processos } from "@/pages/Processos";
import { Agenda } from "@/pages/Agenda";
import { Financeiro } from "@/pages/Financeiro";
import { Documentos } from "@/pages/Documentos";
import { TarefasDiarias } from "@/pages/TarefasDiarias";
import { ConectarGmail } from "@/pages/ConectarGmail";
import { GmailCallback } from "@/pages/GmailCallback";
import { WhatsAppAvisos } from "@/pages/WhatsAppAvisos";
import Configuracoes from "@/pages/Configuracoes";
import Ajuda from "@/pages/Ajuda";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/processos" element={<Processos />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/tarefas-diarias" element={<TarefasDiarias />} />
        <Route path="/conectar-gmail" element={<ConectarGmail />} />
        <Route path="/auth/gmail/callback" element={<GmailCallback />} />
        <Route path="/whatsapp-avisos" element={<WhatsAppAvisos />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/ajuda" element={<Ajuda />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
