
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { UserProfileModal } from '@/components/UserProfileModal';
import { AccountSettingsModal } from '@/components/AccountSettingsModal';
import { NotificationPreferencesModal } from '@/components/NotificationPreferencesModal';
import { SecuritySettingsModal } from '@/components/SecuritySettingsModal';
import { IntegrationsModal } from '@/components/IntegrationsModal';
import { CustomizationModal } from '@/components/CustomizationModal';
import { BackupModal } from '@/components/BackupModal';
import { useToast } from '@/hooks/use-toast';

const Configuracoes = () => {
  const { toast } = useToast();
  const [userProfileModalOpen, setUserProfileModalOpen] = useState(false);
  const [accountSettingsModalOpen, setAccountSettingsModalOpen] = useState(false);
  const [notificationPreferencesModalOpen, setNotificationPreferencesModalOpen] = useState(false);
  const [securitySettingsModalOpen, setSecuritySettingsModalOpen] = useState(false);
  const [integrationsModalOpen, setIntegrationsModalOpen] = useState(false);
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);

  const handleRestoreDefaults = () => {
    // Resetar personalizações para valores padrão
    document.documentElement.className = '';
    
    // Limpar dados salvos no localStorage (se existirem)
    localStorage.removeItem('userProfile');
    localStorage.removeItem('accountSettings');
    localStorage.removeItem('notificationPreferences');
    localStorage.removeItem('securitySettings');
    localStorage.removeItem('integrations');
    localStorage.removeItem('customization');
    localStorage.removeItem('backup');
    
    toast({
      title: "Configurações restauradas",
      description: "Todas as configurações foram restauradas para os valores padrão.",
    });
  };

  const handleSaveChanges = () => {
    // Simular salvamento das alterações
    const configData = {
      savedAt: new Date().toISOString(),
      profiles: localStorage.getItem('userProfile'),
      accounts: localStorage.getItem('accountSettings'),
      notifications: localStorage.getItem('notificationPreferences'),
      security: localStorage.getItem('securitySettings'),
      integrations: localStorage.getItem('integrations'),
      customization: localStorage.getItem('customization'),
      backup: localStorage.getItem('backup')
    };
    
    localStorage.setItem('lastSavedConfig', JSON.stringify(configData));
    
    toast({
      title: "Alterações salvas",
      description: "Todas as alterações foram salvas com sucesso.",
    });
  };

  const configCards = [
    {
      icon: 'ri-user-settings-line',
      title: 'Perfil do Usuário',
      description: 'Atualize suas informações pessoais, foto de perfil e dados de contato.',
      lastUpdate: '20/06/2025',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      onClick: () => setUserProfileModalOpen(true)
    },
    {
      icon: 'ri-shield-keyhole-line',
      title: 'Configurações da Conta',
      description: 'Gerencie seu e-mail, senha e preferências de idioma do sistema.',
      lastUpdate: '15/06/2025',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      onClick: () => setAccountSettingsModalOpen(true)
    },
    {
      icon: 'ri-notification-4-line',
      title: 'Preferências de Notificação',
      description: 'Configure como e quando deseja receber notificações por e-mail e WhatsApp.',
      lastUpdate: '18/06/2025',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
      onClick: () => setNotificationPreferencesModalOpen(true)
    },
    {
      icon: 'ri-lock-password-line',
      title: 'Segurança',
      description: 'Configure autenticação em dois fatores e gerencie dispositivos conectados.',
      lastUpdate: '10/06/2025',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      onClick: () => setSecuritySettingsModalOpen(true)
    },
    {
      icon: 'ri-plug-line',
      title: 'Integrações',
      description: 'Conecte o CRM com outros sistemas e plataformas que você utiliza.',
      lastUpdate: '05/06/2025',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
      onClick: () => setIntegrationsModalOpen(true)
    },
    {
      icon: 'ri-palette-line',
      title: 'Personalização da Interface',
      description: 'Ajuste o tema, cores e layout do sistema conforme sua preferência.',
      lastUpdate: '01/06/2025',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      onClick: () => setCustomizationModalOpen(true)
    },
    {
      icon: 'ri-database-2-line',
      title: 'Configurações de Backup',
      description: 'Configure a frequência e o local de armazenamento dos backups automáticos.',
      lastUpdate: '12/06/2025',
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-500',
      onClick: () => setBackupModalOpen(true)
    },
    {
      icon: 'ri-whatsapp-line',
      title: 'WhatsApp Avisos',
      description: 'Configure mensagens automáticas e avisos enviados pelo WhatsApp.',
      lastUpdate: '21/06/2025',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      isLink: true,
      path: '/whatsapp-avisos'
    },
  ];

  const handleCardClick = (card: any) => {
    if (card.onClick) {
      card.onClick();
    } else if (card.isLink && card.path) {
      window.location.href = card.path;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-blue-600">Início</a>
              <i className="ri-arrow-right-s-line mx-2"></i>
              <span className="text-gray-700">Configurações</span>
            </div>
            
            {/* Page Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Configurações do Sistema</h1>
                <p className="text-gray-600 mt-1">Gerencie todas as configurações do seu CRM Jurídico em um só lugar</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleRestoreDefaults}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center whitespace-nowrap hover:bg-gray-50"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Restaurar Padrões
                </button>
                <button 
                  onClick={handleSaveChanges}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center whitespace-nowrap hover:bg-blue-700"
                >
                  <i className="ri-save-line mr-2"></i>
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {configCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-50 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer h-full flex flex-col group"
                onClick={() => handleCardClick(card)}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-4 transition-all group-hover:bg-blue-50`}
                >
                  <i className={`${card.icon} text-xl ${card.iconColor} group-hover:text-blue-600`}></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{card.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Última atualização: {card.lastUpdate}</span>
                  <button className="text-blue-600 text-sm font-medium hover:bg-blue-600 hover:text-white hover:px-3 hover:py-1 hover:rounded-lg transition-all whitespace-nowrap">
                    Configurar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modals */}
      <UserProfileModal 
        isOpen={userProfileModalOpen} 
        onClose={() => setUserProfileModalOpen(false)} 
      />
      <AccountSettingsModal 
        isOpen={accountSettingsModalOpen} 
        onClose={() => setAccountSettingsModalOpen(false)} 
      />
      <NotificationPreferencesModal 
        isOpen={notificationPreferencesModalOpen} 
        onClose={() => setNotificationPreferencesModalOpen(false)} 
      />
      <SecuritySettingsModal 
        isOpen={securitySettingsModalOpen} 
        onClose={() => setSecuritySettingsModalOpen(false)} 
      />
      <IntegrationsModal 
        isOpen={integrationsModalOpen} 
        onClose={() => setIntegrationsModalOpen(false)} 
      />
      <CustomizationModal 
        isOpen={customizationModalOpen} 
        onClose={() => setCustomizationModalOpen(false)} 
      />
      <BackupModal 
        isOpen={backupModalOpen} 
        onClose={() => setBackupModalOpen(false)} 
      />
    </div>
  );
};

export default Configuracoes;
