
import { MessageStats } from '@/hooks/useWhatsAppConfiguration';

interface WhatsAppStatsProps {
  stats: MessageStats;
}

export const WhatsAppStats = ({ stats }: WhatsAppStatsProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas de Performance</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Enviadas */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl mb-1">📤</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalSent}</div>
          <div className="text-sm text-gray-600">Total enviadas</div>
        </div>

        {/* Entregues */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          <div className="text-sm text-gray-600">Entregues</div>
        </div>

        {/* Falhas */}
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl mb-1">❌</div>
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-600">Falhas</div>
        </div>

        {/* Taxa de Resposta */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.responseRate}%</div>
          <div className="text-sm text-gray-600 mb-2">Taxa de resposta</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.responseRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
