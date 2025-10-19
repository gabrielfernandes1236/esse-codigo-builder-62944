
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ProcessosTable } from '@/components/ProcessosTable';
import { ProcessosFilters } from '@/components/ProcessosFilters';
import { NovoProcessoModal } from '@/components/NovoProcessoModal';
import { EditProcessModal } from '@/components/EditProcessModal';
import { ChevronRight } from 'lucide-react';

export const Processos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Status');
  const [selectedType, setSelectedType] = useState('Tipo de Ação');
  const [selectedClient, setSelectedClient] = useState('Cliente');
  const [showNewProcessModal, setShowNewProcessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProcessId, setEditingProcessId] = useState<string | null>(null);

  const handleEditProcess = (processId: string) => {
    console.log('Editando processo:', processId);
    setEditingProcessId(processId);
    setShowEditModal(true);
  };

  const handleCloseNewProcessModal = () => {
    console.log('Fechando modal de novo processo');
    setShowNewProcessModal(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 custom-scrollbar">
          <div className="container mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-blue-600">Dashboard</a>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-gray-700 font-medium">Processos</span>
            </div>
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Processos</h2>
              <ProcessosFilters 
                onSearchChange={setSearchTerm}
                onStatusChange={setSelectedStatus}
                onTypeChange={setSelectedType}
                onClientChange={setSelectedClient}
                onNewProcessClick={() => setShowNewProcessModal(true)}
                searchTerm={searchTerm}
                selectedStatus={selectedStatus}
                selectedType={selectedType}
                selectedClient={selectedClient}
              />
            </div>
            
            {/* Processos Table */}
            <ProcessosTable 
              searchTerm={searchTerm}
              selectedStatus={selectedStatus}
              selectedType={selectedType}
              selectedClient={selectedClient}
              onEditProcess={handleEditProcess}
            />
          </div>
        </main>
      </div>

      {/* New Process Modal */}
      <NovoProcessoModal 
        isOpen={showNewProcessModal}
        onClose={handleCloseNewProcessModal}
      />

      {/* Edit Process Modal */}
      <EditProcessModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProcessId(null);
        }}
        processId={editingProcessId}
        onSave={() => {}} // Não precisa mais - a lógica está no modal
      />
    </div>
  );
};
