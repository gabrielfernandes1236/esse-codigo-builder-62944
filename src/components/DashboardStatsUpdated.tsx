
import { FileText, Calendar, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardData";

export const DashboardStatsUpdated = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      title: "Processos Ativos",
      value: stats?.processos_ativos || 0,
      icon: FileText,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "+12%",
      changeType: "increase" as const,
      description: "Desde o último mês"
    },
    {
      title: "Audiências Pendentes",
      value: stats?.audiencias_pendentes || 0,
      icon: Calendar,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      change: "-5%",
      changeType: "decrease" as const,
      description: "Próximos 30 dias"
    },
    {
      title: "Clientes Ativos",
      value: stats?.clientes_ativos || 0,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      change: "+8%",
      changeType: "increase" as const,
      description: "Desde o último mês"
    },
    {
      title: "Receita Mensal",
      value: `R$ ${((stats?.receita_mensal || 0) / 1000).toFixed(0)}k`,
      icon: DollarSign,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      change: "+15%",
      changeType: "increase" as const,
      description: "Comparado ao mês anterior"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsConfig.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <div className={`w-10 h-10 rounded-full ${stat.iconBg} flex items-center justify-center ${stat.iconColor}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
            <span className={`ml-2 text-sm font-medium flex items-center ${
              stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
            }`}>
              {stat.changeType === 'increase' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {stat.change}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
        </div>
      ))}
    </div>
  );
};
