
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  mes: string;
  receitas?: number;
  despesas?: number;
}

interface ReceitasDespesasChartProps {
  filter: 'todos' | 'receitas' | 'despesas';
  view: 'mensal' | 'anual';
  transactions: any[];
}

export const ReceitasDespesasChart: React.FC<ReceitasDespesasChartProps> = ({ filter, view, transactions }) => {
  const generateChartData = (): ChartData[] => {
    if (view === 'anual') {
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return meses.map(mes => {
        const receitas = filter !== 'despesas' ? Math.floor(Math.random() * 30000) + 60000 : undefined;
        const despesas = filter !== 'receitas' ? Math.floor(Math.random() * 10000) + 40000 : undefined;
        return { mes, receitas, despesas };
      });
    } else {
      // Mensal - últimos 30 dias
      const dias = [];
      for (let i = 29; i >= 0; i--) {
        const data = new Date();
        data.setDate(data.getDate() - i);
        const dia = data.getDate().toString();
        const receitas = filter !== 'despesas' ? Math.floor(Math.random() * 5000) + 2000 : undefined;
        const despesas = filter !== 'receitas' ? Math.floor(Math.random() * 3000) + 1000 : undefined;
        dias.push({ mes: dia, receitas, despesas });
      }
      return dias;
    }
  };

  const data = generateChartData();

  return (
    <ResponsiveContainer width="100%" height={264}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, name === 'receitas' ? 'Receitas' : 'Despesas']}
        />
        {filter !== 'despesas' && (
          <Bar dataKey="receitas" fill="rgba(87, 181, 231, 1)" name="receitas" />
        )}
        {filter !== 'receitas' && (
          <Bar dataKey="despesas" fill="rgba(252, 141, 98, 1)" name="despesas" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};
