import { useState, useMemo, useEffect, useCallback } from 'react';
import { useProcessesData } from './useProcessesData';

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
  dataRegistro?: string; // Para controlar a ordenação
}

const baseClients = [
  {
    id: '1',
    name: 'Marcos Ribeiro',
    email: 'marcos.ribeiro@email.com',
    type: 'PF' as const,
    phone: '(11) 98765-4321',
    location: 'São Paulo - SP',
    registrationDate: '15/03/2025',
    status: 'Ativo' as const,
    initials: 'MR',
    color: 'blue',
    cpf_cnpj: '123.456.789-00',
    address: 'Rua das Flores, 123 - Centro - São Paulo - SP - 01234-567',
    dataRegistro: '2025-03-15T10:00:00.000Z'
  },
  {
    id: '2',
    name: 'Tech Innovations Ltda.',
    email: 'contato@techinnovations.com.br',
    type: 'PJ' as const,
    phone: '(11) 3456-7890',
    location: 'São Paulo - SP',
    registrationDate: '10/01/2025',
    status: 'Ativo' as const,
    initials: 'TI',
    color: 'purple',
    cpf_cnpj: '12.345.678/0001-90',
    address: 'Av. Paulista, 1000 - Bela Vista - São Paulo - SP - 01310-100',
    dataRegistro: '2025-01-10T10:00:00.000Z'
  },
  {
    id: '3',
    name: 'Carolina Santos',
    email: 'carolina.santos@email.com',
    type: 'PF' as const,
    phone: '(21) 99876-5432',
    location: 'Rio de Janeiro - RJ',
    registrationDate: '05/04/2025',
    status: 'Ativo' as const,
    initials: 'CS',
    color: 'green',
    cpf_cnpj: '987.654.321-00',
    address: 'Rua do Mar, 456 - Copacabana - Rio de Janeiro - RJ - 22070-010',
    dataRegistro: '2025-04-05T10:00:00.000Z'
  },
  {
    id: '4',
    name: 'Grupo Construtor S.A.',
    email: 'juridico@grupoconstrutor.com.br',
    type: 'PJ' as const,
    phone: '(31) 3333-4444',
    location: 'Belo Horizonte - MG',
    registrationDate: '20/12/2024',
    status: 'Ativo' as const,
    initials: 'GC',
    color: 'yellow',
    cpf_cnpj: '98.765.432/0001-10',
    address: 'Rua da Construção, 789 - Centro - Belo Horizonte - MG - 30112-000',
    dataRegistro: '2024-12-20T10:00:00.000Z'
  },
  {
    id: '5',
    name: 'Rafael Fernandes',
    email: 'rafael.fernandes@email.com',
    type: 'PF' as const,
    phone: '(41) 99123-4567',
    location: 'Curitiba - PR',
    registrationDate: '12/05/2025',
    status: 'Ativo' as const,
    initials: 'RF',
    color: 'red',
    cpf_cnpj: '555.666.777-88',
    address: 'Rua das Araucárias, 321 - Batel - Curitiba - PR - 80420-090',
    dataRegistro: '2025-05-12T10:00:00.000Z'
  },
  {
    id: '6',
    name: 'Farmácia Saúde Ltda.',
    email: 'contato@farmaciasaude.com.br',
    type: 'PJ' as const,
    phone: '(85) 3222-1111',
    location: 'Fortaleza - CE',
    registrationDate: '18/02/2025',
    status: 'Ativo' as const,
    initials: 'FS',
    color: 'indigo',
    cpf_cnpj: '11.222.333/0001-44',
    address: 'Av. Beira Mar, 2000 - Meireles - Fortaleza - CE - 60165-121',
    dataRegistro: '2025-02-18T10:00:00.000Z'
  },
  {
    id: '7',
    name: 'Juliana Almeida',
    email: 'juliana.almeida@email.com',
    type: 'PF' as const,
    phone: '(71) 99888-7777',
    location: 'Salvador - BA',
    registrationDate: '30/05/2025',
    status: 'Inativo' as const,
    initials: 'JA',
    color: 'pink',
    cpf_cnpj: '111.222.333-44',
    address: 'Rua do Pelourinho, 100 - Centro Histórico - Salvador - BA - 40026-280',
    dataRegistro: '2025-05-30T10:00:00.000Z'
  }
];

const CLIENTS_STORAGE_KEY = 'juridico_clientes';
const OLD_CLIENTS_STORAGE_KEY = 'juridico_clientes_antigos';

export const useClientsData = () => {
  const { getProcessesByClient } = useProcessesData();
  const [clientsState, setClientsState] = useState<Client[]>([]);
  const [oldClients, setOldClients] = useState<Client[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carregar dados do localStorage apenas na inicialização
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
        const storedOldClients = localStorage.getItem(OLD_CLIENTS_STORAGE_KEY);
        
        if (storedClients) {
          const parsedClients = JSON.parse(storedClients);
          setClientsState(parsedClients);
        } else {
          // Se não há dados no localStorage, usar dados base e salvar
          const initialClients = baseClients.map(client => ({
            ...client,
            processCount: 0,
            hidden: false
          }));
          setClientsState(initialClients);
          localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(initialClients));
        }
        
        if (storedOldClients) {
          setOldClients(JSON.parse(storedOldClients));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        const initialClients = baseClients.map(client => ({
          ...client,
          processCount: 0,
          hidden: false
        }));
        setClientsState(initialClients);
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      loadFromStorage();
    }
  }, [isInitialized]);

  // Salvar no localStorage com debounce para evitar salvamentos excessivos
  const saveToStorage = useCallback((clients: Client[], oldClientsData: Client[]) => {
    const saveData = () => {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
      localStorage.setItem(OLD_CLIENTS_STORAGE_KEY, JSON.stringify(oldClientsData));
      // Disparar evento para atualizar dashboard
      window.dispatchEvent(new CustomEvent('clientsUpdated'));
    };

    // Debounce de 100ms para evitar salvamentos excessivos
    const timeoutId = setTimeout(saveData, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Salvar dados quando mudarem, mas apenas após inicialização
  useEffect(() => {
    if (isInitialized && clientsState.length > 0) {
      saveToStorage(clientsState, oldClients);
    }
  }, [clientsState, oldClients, isInitialized, saveToStorage]);

  // Calcular clientes com processCount atualizado e ORDENADOS do mais recente para o mais antigo
  const clients = useMemo(() => {
    const clientsWithProcessCount = clientsState.map(client => ({
      ...client,
      processCount: getProcessesByClient(client.id).length
    }));

    // Ordenar por data de registro (mais recente primeiro)
    return clientsWithProcessCount.sort((a, b) => {
      const dateA = new Date(a.dataRegistro || a.registrationDate).getTime();
      const dateB = new Date(b.dataRegistro || b.registrationDate).getTime();
      return dateB - dateA; // Decrescente (mais recente primeiro)
    });
  }, [clientsState, getProcessesByClient]);

  const generateClientId = useCallback(() => {
    const allClients = [...clientsState, ...oldClients];
    const maxId = allClients.reduce((max, client) => {
      const id = parseInt(client.id, 10);
      return isNaN(id) ? max : Math.max(max, id);
    }, 0);
    return (maxId + 1).toString();
  }, [clientsState, oldClients]);

  const generateInitials = useCallback((name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  }, []);

  const generateColor = useCallback(() => {
    const colors = ['blue', 'purple', 'green', 'yellow', 'red', 'indigo', 'pink'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const handleSaveClient = useCallback((clientData: any, editingClient?: Client | null) => {
    if (editingClient) {
      // Editando cliente existente
      setClientsState(prev => prev.map(client => 
        client.id === editingClient.id 
          ? { ...client, ...clientData }
          : client
      ));
      console.log('Cliente editado:', clientData.name, 'Status:', clientData.status);
    } else {
      // Criando novo cliente
      const newClient: Client = {
        ...clientData,
        id: generateClientId(),
        initials: generateInitials(clientData.name),
        color: generateColor(),
        processCount: 0,
        registrationDate: new Date().toLocaleDateString('pt-BR'),
        dataRegistro: new Date().toISOString(), // Data ISO para ordenação
        hidden: false
      };
      setClientsState(prev => [newClient, ...prev]); // Adicionar no início para aparecer primeiro
      console.log('Novo cliente criado:', newClient.name, 'Status:', newClient.status);
    }
  }, [generateClientId, generateInitials, generateColor]);

  const handleDeleteClient = useCallback((clientId: string) => {
    const clientToMove = clientsState.find(client => client.id === clientId);
    if (clientToMove) {
      setOldClients(prev => [...prev, clientToMove]);
      setClientsState(prev => prev.filter(client => client.id !== clientId));
    }
  }, [clientsState]);

  const handleHideClient = useCallback((clientId: string) => {
    setClientsState(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, hidden: !client.hidden }
        : client
    ));
  }, []);

  const handleReactivateClient = useCallback((clientId: string) => {
    const clientToReactivate = oldClients.find(client => client.id === clientId);
    if (clientToReactivate) {
      const reactivatedClient = {
        ...clientToReactivate,
        status: 'Ativo' as const,
        hidden: false,
        processCount: getProcessesByClient(clientToReactivate.id).length
      };
      setClientsState(prev => [...prev, reactivatedClient]);
      setOldClients(prev => prev.filter(client => client.id !== clientId));
    }
  }, [oldClients, getProcessesByClient]);

  return {
    clients,
    oldClients,
    handleSaveClient,
    handleDeleteClient,
    handleHideClient,
    handleReactivateClient
  };
};
