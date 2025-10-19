
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Transaction {
  tipo: 'receita' | 'despesa';
  metodo_pagamento: string;
  valor: number;
}

interface DistribuicaoPagamentoChartProps {
  transactions: Transaction[];
}

export const DistribuicaoPagamentoChart: React.FC<DistribuicaoPagamentoChartProps> = ({ transactions }) => {
  const generateData = () => {
    const receitas = transactions.filter(t => t.tipo === 'receita');
    const distribution = receitas.reduce((acc, t) => {
      acc[t.metodo_pagamento] = (acc[t.metodo_pagamento] || 0) + t.valor;
      return acc;
    }, {} as Record<string, number>);
    
    const total = Object.values(distribution).reduce((sum: number, val: number) => sum + val, 0);
    
    if (total === 0) {
      return [
        { name: 'Pix', value: 35, color: 'rgba(87, 181, 231, 1)' },
        { name: 'Boleto', value: 25, color: 'rgba(141, 211, 199, 1)' },
        { name: 'Cartão de Crédito', value: 20, color: 'rgba(251, 191, 114, 1)' },
        { name: 'Transferência Bancária', value: 20, color: 'rgba(252, 141, 98, 1)' }
      ];
    }
    
    const colors = {
      'Pix': 'rgba(87, 181, 231, 1)',
      'Boleto': 'rgba(141, 211, 199, 1)',
      'Cartão de Crédito': 'rgba(251, 191, 114, 1)',
      'Transferência Bancária': 'rgba(252, 141, 98, 1)'
    };
    
    return Object.entries(distribution).map(([method, value]) => ({
      name: method,
      value: Math.round((value / total) * 100),
      color: colors[method as keyof typeof colors] || 'rgba(156, 163, 175, 1)'
    }));
  };

  const data = generateData();

  return (
    <ResponsiveContainer width="100%" height={264}>
      <PieChart>
        <Pie
          data={data}
          cx="40%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend 
          layout="vertical" 
          align="right" 
          verticalAlign="middle"
          wrapperStyle={{ paddingLeft: '20px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
