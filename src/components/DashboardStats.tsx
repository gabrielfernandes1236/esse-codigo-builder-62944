
import { FileText, Calendar, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export const DashboardStats = () => {
  const stats = [
    {
      title: "Processos Ativos",
      value: "42",
      icon: FileText,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "+12%",
      changeType: "increase",
      description: "Desde o último mês"
    },
    {
      title: "Audiências Pendentes",
      value: "18",
      icon: Calendar,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      change: "-5%",
      changeType: "decrease",
      description: "Próximos 30 dias"
    },
    {
      title: "Clientes Ativos",
      value: "87",
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      change: "+8%",
      changeType: "increase",
      description: "Desde o último mês"
    },
    {
      title: "Receita Mensal",
      value: "R$ 32.450",
      icon: DollarSign,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      change: "+15%",
      changeType: "increase",
      description: "Comparado ao mês anterior"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
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
