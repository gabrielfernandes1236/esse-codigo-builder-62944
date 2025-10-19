
import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, Users, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWhatsAppIntegration } from '@/hooks/useWhatsAppIntegration';
import { useNotifications } from '@/hooks/useNotifications';

export const WhatsAppIntegrationStatus = () => {
  const { notifications, getNotificationStats, getUpcomingNotifications } = useWhatsAppIntegration();
  const { config } = useNotifications();
  const [stats, setStats] = useState({ total: 0, sent: 0, pending: 0, failed: 0 });

  useEffect(() => {
    setStats(getNotificationStats());
  }, [notifications]);

  const upcomingNotifications = getUpcomingNotifications(3);

  if (!config.whatsapp) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center">
            <MessageSquare className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">
              WhatsApp não está configurado. Configure em "Configurar Lembretes" para ativar as notificações.
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status de Integração */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-800 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Status da Integração WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-700">{stats.total}</div>
              <div className="text-green-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-700">{stats.sent}</div>
              <div className="text-blue-600">Enviadas</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-700">{stats.pending}</div>
              <div className="text-yellow-600">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-700">{stats.failed}</div>
              <div className="text-red-600">Falhas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximas Notificações */}
      {upcomingNotifications.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-800 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Próximas Notificações Programadas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {upcomingNotifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{notification.clientData.name}</span>
                    <span className="text-gray-500">-</span>
                    <span>{notification.eventDetails.titulo}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {notification.scheduledFor && 
                        new Date(notification.scheduledFor).toLocaleDateString('pt-BR')
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuração Atual */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-sm space-y-2">
            <div className="font-medium text-blue-800 mb-2">Configuração Ativa:</div>
            
            <div className="flex items-center text-blue-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>WhatsApp ativado</span>
            </div>
            
            {config.grupoWhatsApp && (
              <div className="flex items-center text-blue-700">
                <Users className="w-4 h-4 mr-2" />
                <span>Grupo configurado: {config.grupoWhatsApp}</span>
              </div>
            )}
            
            <div className="flex items-center text-blue-700">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                Antecedência: {
                  config.antecedencia === 'personalizado' 
                    ? `${config.antecedenciaPersonalizada} dias`
                    : config.antecedencia.replace('dia', ' dia').replace('dias', ' dias').replace('semana', ' semana')
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
