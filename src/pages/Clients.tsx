
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ClientsTable } from '@/components/ClientsTable';
import { ClientsPageHeader } from '@/components/ClientsPageHeader';
import { ClientsFiltersSection } from '@/components/ClientsFiltersSection';
import { NovoClienteModal } from '@/components/NovoClienteModal';
import { OldClientsModal } from '@/components/OldClientsModal';
import { ClientProcessesModal } from '@/components/ClientProcessesModal';
import { useClientsData } from '@/hooks/useClientsData';
import { useDashboardRefresh } from '@/hooks/useDashboardRefresh';

interface Client {
  id: string;
  name: string;
  email: string;
  type: 'PF' | 'PJ';
  phone: string;
  location: string;
  processCount: number;
  registrationDate: string;
  status: 'Ativo' | 'Inativo';
  initials: string;
  color: string;
  cpf_cnpj: string;
  address?: string;
  documents?: string[];
  hidden?: boolean;
  uploadedFiles?: { [key: string]: string[] };
}

export const Clients = () => {
  const { refreshDashboard } = useDashboardRefresh();
  const {
    clients,
    oldClients,
    handleSaveClient,
    handleDeleteClient,
    handleHideClient,
    handleReactivateClient
  } = useClientsData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [showOldClientsModal, setShowOldClientsModal] = useState(false);
  const [showProcessesModal, setShowProcessesModal] = useState(false);
  const [selectedClientForProcesses, setSelectedClientForProcesses] = useState<{ id: string; name: string } | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleNewClient = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleSaveClientWrapper = (clientData: any) => {
    handleSaveClient(clientData, editingClient);
    setShowModal(false);
    setEditingClient(null);
    // Atualizar dashboard após salvar
    setTimeout(() => {
      refreshDashboard();
    }, 100);
  };

  const handleDeleteClientWrapper = (clientId: string) => {
    handleDeleteClient(clientId);
    // Atualizar dashboard após deletar
    setTimeout(() => {
      refreshDashboard();
    }, 100);
  };

  const handleHideClientWrapper = (clientId: string) => {
    handleHideClient(clientId);
    // Atualizar dashboard após ocultar/exibir
    setTimeout(() => {
      refreshDashboard();
    }, 100);
  };

  const handleReactivateClientWrapper = (clientId: string) => {
    handleReactivateClient(clientId);
    // Atualizar dashboard após reativar
    setTimeout(() => {
      refreshDashboard();
    }, 100);
  };

  const handleViewProcesses = (clientId: string, clientName: string) => {
    setSelectedClientForProcesses({ id: clientId, name: clientName });
    setShowProcessesModal(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 custom-scrollbar">
          <div className="container mx-auto">
            <ClientsPageHeader />
            
            <ClientsFiltersSection 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onNewClientClick={handleNewClient}
              onViewOldClientsClick={() => setShowOldClientsModal(true)}
            />
            
            {/* Clients Table */}
            <ClientsTable 
              searchTerm={searchTerm}
              selectedType={selectedType}
              selectedStatus={selectedStatus}
              clients={clients}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClientWrapper}
              onHideClient={handleHideClientWrapper}
              onViewProcesses={handleViewProcesses}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <NovoClienteModal 
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClientWrapper}
        client={editingClient}
        isEditing={!!editingClient}
      />

      <OldClientsModal
        isOpen={showOldClientsModal}
        onClose={() => setShowOldClientsModal(false)}
        oldClients={oldClients}
        onReactivateClient={handleReactivateClientWrapper}
      />

      <ClientProcessesModal
        isOpen={showProcessesModal}
        onClose={() => {
          setShowProcessesModal(false);
          setSelectedClientForProcesses(null);
        }}
        clientId={selectedClientForProcesses?.id || ''}
        clientName={selectedClientForProcesses?.name || ''}
      />
    </div>
  );
};
