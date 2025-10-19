
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const CLIENTS_STORAGE_KEY = 'juridico_clientes';

export const useDashboardRefresh = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CLIENTS_STORAGE_KEY) {
        console.log('Dados de clientes alterados, atualizando dashboard...');
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        queryClient.invalidateQueries({ queryKey: ['clientes-ativos'] });
      }
    };

    // Listener para mudanças no localStorage
    window.addEventListener('storage', handleStorageChange);

    // Listener customizado para mudanças na mesma aba
    const handleCustomStorageChange = () => {
      console.log('Dados de clientes alterados na mesma aba, atualizando dashboard...');
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['clientes-ativos'] });
    };

    window.addEventListener('clientsUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('clientsUpdated', handleCustomStorageChange);
    };
  }, [queryClient]);

  const refreshDashboard = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    queryClient.invalidateQueries({ queryKey: ['clientes-ativos'] });
    // Disparar evento customizado para outras partes da aplicação
    window.dispatchEvent(new CustomEvent('clientsUpdated'));
  };

  return { refreshDashboard };
};
