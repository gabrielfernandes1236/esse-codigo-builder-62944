import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { NovaTransacaoModal } from "@/components/NovaTransacaoModal";
import { TodasTransacoesModal } from "@/components/TodasTransacoesModal";
import { PeriodoPersonalizadoModal } from "@/components/PeriodoPersonalizadoModal";
import { TodasFaturasModal } from "@/components/TodasFaturasModal";
import { ReceitasDespesasChart } from "@/components/ReceitasDespesasChart";
import { DistribuicaoPagamentoChart } from "@/components/DistribuicaoPagamentoChart";
import { ReportExporter } from "@/utils/reportExporter";
import { useEffect, useState } from "react";
import { FluxoCaixaControls } from "@/components/FluxoCaixaControls";
import { TransactionDetailsModal } from "@/components/TransactionDetailsModal";
import { MiniSparkline } from "@/components/MiniSparkline";
import { AlertBadge } from "@/components/AlertBadge";
import { ReportScheduler } from "@/components/ReportScheduler";

interface Transaction {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  cliente?: string;
  valor: number;
  data: string;
  horario: string;
  metodo_pagamento: string;
  categoria: string;
}

type PeriodType = 'mes' | 'trimestre' | 'ano' | 'personalizado';

export const Financeiro = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAllTransactionsModalOpen, setIsAllTransactionsModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isAllInvoicesModalOpen, setIsAllInvoicesModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('mes');
  const [customPeriod, setCustomPeriod] = useState<{start: string, end: string} | null>(null);
  const [chartFilter, setChartFilter] = useState<'todos' | 'receitas' | 'despesas'>('todos');
  const [chartView, setChartView] = useState<'mensal' | 'anual'>('anual');
  const [cashFlowFilter, setCashFlowFilter] = useState<'hoje' | 'semana' | 'mes'>('hoje');
  const [paymentMethods, setPaymentMethods] = useState({
    'Cartão de Crédito': true,
    'Transferência Bancária': true,
    'Pix': true,
    'Boleto Bancário': false
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      tipo: 'receita',
      descricao: 'Pagamento - Processo Trabalhista',
      cliente: 'Marcos Ribeiro',
      valor: 3500,
      data: '2025-06-21',
      horario: '10:25',
      metodo_pagamento: 'Pix',
      categoria: 'Honorário'
    },
    {
      id: '2',
      tipo: 'despesa',
      descricao: 'Aluguel do Escritório',
      valor: 4200,
      data: '2025-06-21',
      horario: '09:15',
      metodo_pagamento: 'Transferência Bancária',
      categoria: 'Fixa'
    },
    {
      id: '3',
      tipo: 'receita',
      descricao: 'Consultoria Jurídica',
      cliente: 'Tech Inovações Ltda.',
      valor: 2800,
      data: '2025-06-20',
      horario: '14:30',
      metodo_pagamento: 'Boleto',
      categoria: 'Consultoria'
    },
    {
      id: '4',
      tipo: 'despesa',
      descricao: 'Salários da Equipe',
      valor: 12450,
      data: '2025-06-20',
      horario: '11:00',
      metodo_pagamento: 'Transferência Bancária',
      categoria: 'Fixa'
    }
  ]);

  const [sortBy, setSortBy] = useState<'data' | 'valor'>('data');
  const [groupBy, setGroupBy] = useState<'none' | 'tipo' | 'categoria'>('none');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [schedulerReportType, setSchedulerReportType] = useState('');

  const handleSaveTransaction = (transactionData: any) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transactionData
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleCustomPeriod = (startDate: string, endDate: string) => {
    setCustomPeriod({ start: startDate, end: endDate });
    setSelectedPeriod('personalizado');
  };

  const filterTransactionsByPeriod = (transactions: Transaction[]) => {
    const now = new Date();
    
    if (selectedPeriod === 'personalizado' && customPeriod) {
      const startDate = new Date(customPeriod.start);
      const endDate = new Date(customPeriod.end);
      return transactions.filter(t => {
        const transactionDate = new Date(t.data);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }
    
    if (selectedPeriod === 'mes') {
      return transactions.filter(t => {
        const transactionDate = new Date(t.data);
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      });
    }
    
    if (selectedPeriod === 'trimestre') {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      return transactions.filter(t => {
        const transactionDate = new Date(t.data);
        const transactionQuarter = Math.floor(transactionDate.getMonth() / 3);
        return transactionQuarter === currentQuarter && 
               transactionDate.getFullYear() === now.getFullYear();
      });
    }
    
    if (selectedPeriod === 'ano') {
      return transactions.filter(t => {
        const transactionDate = new Date(t.data);
        return transactionDate.getFullYear() === now.getFullYear();
      });
    }
    
    return transactions;
  };

  const filteredTransactions = filterTransactionsByPeriod(transactions);

  const calculateKPIs = () => {
    const receitas = filteredTransactions.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0);
    const despesas = filteredTransactions.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0);
    const lucro = receitas - despesas;
    const faturasPendentes = 3; // Simulado
    
    return { receitas, despesas, lucro, faturasPendentes };
  };

  const getDistributionData = () => {
    const receitas = filteredTransactions.filter(t => t.tipo === 'receita');
    const distribution = receitas.reduce((acc, t) => {
      acc[t.metodo_pagamento] = (acc[t.metodo_pagamento] || 0) + t.valor;
      return acc;
    }, {} as Record<string, number>);
    
    return distribution;
  };

  const getFilteredTransactions = () => {
    // Filtrar por período (simplificado - apenas para demonstração)
    return filteredTransactions;
  };

  const getCashFlowTransactions = () => {
    const today = new Date();
    let filtered = filteredTransactions;
    
    if (cashFlowFilter === 'hoje') {
      filtered = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.data);
        return transactionDate.toDateString() === today.toDateString();
      });
    } else if (cashFlowFilter === 'semana') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.data);
        return transactionDate >= weekAgo;
      });
    } else if (cashFlowFilter === 'mes') {
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      filtered = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.data);
        return transactionDate >= monthAgo;
      });
    }
    
    return filtered.slice(0, 4); // Mostrar apenas 4 transações
  };

  const getSortedAndGroupedTransactions = () => {
    let filtered = getCashFlowTransactions();
    
    // Ordenação
    if (sortBy === 'valor') {
      filtered = filtered.sort((a, b) => b.valor - a.valor);
    } else {
      filtered = filtered.sort((a, b) => new Date(b.data + ' ' + b.horario).getTime() - new Date(a.data + ' ' + a.horario).getTime());
    }
    
    // Agrupamento
    if (groupBy === 'none') {
      return filtered;
    }
    
    const grouped = filtered.reduce((acc, transaction) => {
      const key = groupBy === 'tipo' ? transaction.tipo : transaction.categoria;
      if (!acc[key]) acc[key] = [];
      acc[key].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);
    
    return grouped;
  };

  const handleTransactionClick = (transaction: Transaction) => {
    // Adicionar processo relacionado simulado para algumas transações
    const transactionWithProcess = {
      ...transaction,
      processo_relacionado: transaction.cliente === 'Marcos Ribeiro' ? 'PROC-2025-001' : undefined
    };
    setSelectedTransaction(transactionWithProcess);
    setIsTransactionDetailsOpen(true);
  };

  const getSparklineData = (type: 'receitas' | 'despesas' | 'lucro') => {
    // Dados simulados dos últimos 3 períodos
    const data = {
      receitas: [85000, 92000, 98000],
      despesas: [42000, 44000, 42000],
      lucro: [43000, 48000, 56000]
    };
    return data[type];
  };

  const getTrend = (data: number[]) => {
    if (data.length < 2) return 'stable';
    const last = data[data.length - 1];
    const previous = data[data.length - 2];
    if (last > previous) return 'up';
    if (last < previous) return 'down';
    return 'stable';
  };

  const hasOverdueInvoices = () => {
    return 2; // Simulado - 2 faturas em atraso
  };

  const hasExpenseAlert = () => {
    return calculateKPIs().despesas > calculateKPIs().receitas * 0.8; // Alerta se despesas > 80% das receitas
  };

  const openScheduler = (reportType: string) => {
    setSchedulerReportType(reportType);
    setIsSchedulerOpen(true);
  };

  const getPeriodLabel = () => {
    if (selectedPeriod === 'personalizado' && customPeriod) {
      return `${customPeriod.start} a ${customPeriod.end}`;
    }
    const labels = {
      'mes': 'Junho/2025',
      'trimestre': '2º Trimestre/2025',
      'ano': '2025'
    };
    return labels[selectedPeriod];
  };

  const handleExport = () => {
    const kpis = calculateKPIs();
    const periodo = getPeriodLabel();
    const wb = ReportExporter.generateExcelReport('Demonstrativo de Resultados', filteredTransactions, kpis, periodo);
    ReportExporter.downloadExcel(wb, `financeiro_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };

  const downloadReport = (reportType: string, format: 'pdf' | 'excel') => {
    const kpis = calculateKPIs();
    const periodo = getPeriodLabel();
    const fileName = `${reportType.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    
    if (format === 'pdf') {
      let doc;
      
      switch (reportType) {
        case 'Demonstrativo de Resultados':
          doc = ReportExporter.generateDemonstrativoResultadosPDF(filteredTransactions, kpis, periodo);
          break;
        case 'Análise de Faturamento':
          doc = ReportExporter.generateAnalyseFaturamentoPDF(filteredTransactions, periodo);
          break;
        case 'Projeção Financeira':
          doc = ReportExporter.generateProjecaoFinanceiraPDF(kpis, periodo);
          break;
        case 'Contas a Receber':
          doc = ReportExporter.generateContasReceberPDF(periodo);
          break;
        default:
          doc = ReportExporter.generateDemonstrativoResultadosPDF(filteredTransactions, kpis, periodo);
      }
      
      ReportExporter.downloadPDF(doc, fileName);
    } else {
      const wb = ReportExporter.generateExcelReport(reportType, filteredTransactions, kpis, periodo);
      ReportExporter.downloadExcel(wb, fileName);
    }
  };

  const kpis = calculateKPIs();
  const distributionData = getDistributionData();

  useEffect(() => {
    // Inicializar gráficos após o componente ser montado
    const initCharts = () => {
      // Revenue vs Expense Chart
      const revenueExpenseChart = (window as any).echarts?.init(document.getElementById('revenueExpenseChart'));
      if (revenueExpenseChart) {
        const receitas =
          chartFilter === 'despesas' ? [] : [65000, 68000, 72000, 75000, 78000, 82000, 85000, 87000, 90000, 92000, 95000, 98000];
        const despesas =
          chartFilter === 'receitas' ? [] : [42000, 43000, 41000, 43000, 44000, 42000, 45000, 43000, 42000, 41000, 44000, 42000];
        
        const revenueExpenseOption = {
          animation: false,
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: '#e2e8f0',
            textStyle: {
              color: '#1f2937'
            }
          },
          legend: {
            data: chartFilter === 'todos' ? ['Receitas', 'Despesas'] : chartFilter === 'receitas' ? ['Receitas'] : ['Despesas'],
            bottom: 0
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: 'R$ {value}'
            }
          },
          series: [
            ...(chartFilter !== 'despesas' ? [{
              name: 'Receitas',
              type: 'line',
              smooth: true,
              lineStyle: {
                width: 3,
                color: 'rgba(87, 181, 231, 1)'
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(87, 181, 231, 0.2)'
                  }, {
                    offset: 1, color: 'rgba(87, 181, 231, 0.01)'
                  }]
                }
              },
              data: receitas
            }] : []),
            ...(chartFilter !== 'receitas' ? [{
              name: 'Despesas',
              type: 'line',
              smooth: true,
              lineStyle: {
                width: 3,
                color: 'rgba(252, 141, 98, 1)'
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: 'rgba(252, 141, 98, 0.2)'
                  }, {
                    offset: 1, color: 'rgba(252, 141, 98, 0.01)'
                  }]
                }
              },
              data: despesas
            }] : [])
          ]
        };
        revenueExpenseChart.setOption(revenueExpenseOption);
      }

      // Revenue Distribution Chart
      const revenueDistributionChart = (window as any).echarts?.init(document.getElementById('revenueDistributionChart'));
      if (revenueDistributionChart) {
        const total = Object.values(distributionData).reduce((sum, val) => sum + val, 0);
        const chartData = Object.entries(distributionData).map(([method, value]) => ({
          value: total > 0 ? Math.round((value / total) * 100) : 0,
          name: method
        }));

        const revenueDistributionOption = {
          animation: false,
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: '#e2e8f0',
            textStyle: {
              color: '#1f2937'
            }
          },
          legend: {
            orient: 'vertical',
            right: '5%',
            top: 'center',
            data: Object.keys(distributionData)
          },
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['40%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false
              },
              emphasis: {
                label: {
                  show: false
                }
              },
              data: chartData.length > 0 ? chartData : [
                { value: 35, name: 'Pix', itemStyle: { color: 'rgba(87, 181, 231, 1)' } },
                { value: 25, name: 'Boleto', itemStyle: { color: 'rgba(141, 211, 199, 1)' } },
                { value: 20, name: 'Cartão de Crédito', itemStyle: { color: 'rgba(251, 191, 114, 1)' } },
                { value: 20, name: 'Transferência Bancária', itemStyle: { color: 'rgba(252, 141, 98, 1)' } }
              ]
            }
          ]
        };
        revenueDistributionChart.setOption(revenueDistributionOption);
      }

      // Handle window resize
      const handleResize = () => {
        revenueExpenseChart?.resize();
        revenueDistributionChart?.resize();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    };

    // Aguardar o ECharts carregar
    const checkEcharts = () => {
      if ((window as any).echarts) {
        initCharts();
      } else {
        setTimeout(checkEcharts, 100);
      }
    };

    checkEcharts();
  }, [chartFilter, distributionData]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {/* Header personalizado */}
        <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Financeiro</h1>
            <nav className="ml-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Home</a></li>
                <li className="flex items-center">
                  <div className="w-3 h-3 mx-1 flex items-center justify-center">
                    <i className="ri-arrow-right-s-line text-xs"></i>
                  </div>
                  <span className="text-blue-600">Financeiro</span>
                </li>
              </ol>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsTransactionModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center whitespace-nowrap"
            >
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                <i className="ri-add-line"></i>
              </div>
              Nova Transação
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Filtro de período */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-700">Período:</div>
              <div className="flex bg-white rounded-full border border-gray-200 p-1">
                <button 
                  onClick={() => setSelectedPeriod('mes')}
                  className={`px-4 py-1 text-sm rounded-full ${selectedPeriod === 'mes' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Mês atual
                </button>
                <button 
                  onClick={() => setSelectedPeriod('trimestre')}
                  className={`px-4 py-1 text-sm rounded-full ${selectedPeriod === 'trimestre' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Trimestre
                </button>
                <button 
                  onClick={() => setSelectedPeriod('ano')}
                  className={`px-4 py-1 text-sm rounded-full ${selectedPeriod === 'ano' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Ano
                </button>
                <button 
                  onClick={() => setIsPeriodModalOpen(true)}
                  className={`px-4 py-1 text-sm rounded-full ${selectedPeriod === 'personalizado' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Personalizado
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleExport}
                className="flex items-center px-3 py-2 text-sm bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                  <i className="ri-download-line"></i>
                </div>
                Exportar
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center px-3 py-2 text-sm bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                  <i className="ri-printer-line"></i>
                </div>
                Imprimir
              </button>
            </div>
          </div>

          {/* Stats Cards with Sparklines */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Receita Total */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Receita Total</h3>
                <div className="flex items-center space-x-2">
                  {hasOverdueInvoices() > 0 && (
                    <AlertBadge 
                      type="overdue" 
                      count={hasOverdueInvoices()} 
                      message={`${hasOverdueInvoices()} faturas em atraso`} 
                    />
                  )}
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    <i className="ri-arrow-up-circle-line"></i>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">R$ {kpis.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-500 mt-1">Desde o último mês</p>
                </div>
                <div className="flex flex-col items-end">
                  <MiniSparkline 
                    data={getSparklineData('receitas')} 
                    color="#10b981" 
                    trend={getTrend(getSparklineData('receitas'))}
                  />
                  <div className="flex items-center text-green-500 text-sm mt-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-arrow-up-line"></i>
                    </div>
                    <span>12%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Despesas Totais */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Despesas Totais</h3>
                <div className="flex items-center space-x-2">
                  {hasExpenseAlert() && (
                    <AlertBadge 
                      type="expense-alert" 
                      message="Atenção: despesas acima do ideal" 
                    />
                  )}
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <i className="ri-arrow-down-circle-line"></i>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">R$ {kpis.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-500 mt-1">Desde o último mês</p>
                </div>
                <div className="flex flex-col items-end">
                  <MiniSparkline 
                    data={getSparklineData('despesas')} 
                    color="#ef4444" 
                    trend={getTrend(getSparklineData('despesas'))}
                  />
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-arrow-up-line"></i>
                    </div>
                    <span>5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lucro Líquido */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Lucro Líquido</h3>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <i className="ri-line-chart-line"></i>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">R$ {kpis.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-500 mt-1">Desde o último mês</p>
                </div>
                <div className="flex flex-col items-end">
                  <MiniSparkline 
                    data={getSparklineData('lucro')} 
                    color="#3b82f6" 
                    trend={getTrend(getSparklineData('lucro'))}
                  />
                  <div className={`flex items-center text-sm mt-1 ${kpis.lucro >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={`ri-arrow-${kpis.lucro >= 0 ? 'up' : 'down'}-line`}></i>
                    </div>
                    <span>18%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Faturas Pendentes */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Faturas Pendentes</h3>
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                  <i className="ri-time-line"></i>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">{kpis.faturasPendentes}</p>
                  <p className="text-xs text-gray-500 mt-1">R$ 28.650 a receber</p>
                </div>
                <div className="flex items-center text-yellow-500 text-sm">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                  <span>3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Line Chart */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Receitas vs Despesas</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex bg-gray-100 rounded-full p-1">
                    <button 
                      onClick={() => setChartFilter('todos')}
                      className={`px-3 py-1 text-xs rounded-full ${chartFilter === 'todos' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                    >
                      Todos
                    </button>
                    <button 
                      onClick={() => setChartFilter('receitas')}
                      className={`px-3 py-1 text-xs rounded-full ${chartFilter === 'receitas' ? 'bg-green-600 text-white' : 'text-gray-700'}`}
                    >
                      Receitas
                    </button>
                    <button 
                      onClick={() => setChartFilter('despesas')}
                      className={`px-3 py-1 text-xs rounded-full ${chartFilter === 'despesas' ? 'bg-red-600 text-white' : 'text-gray-700'}`}
                    >
                      Despesas
                    </button>
                  </div>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={() => setChartView('mensal')}
                    className={`${chartView === 'mensal' ? 'text-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Mensal
                  </button>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={() => setChartView('anual')}
                    className={`${chartView === 'anual' ? 'text-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Anual
                  </button>
                </div>
              </div>
              <ReceitasDespesasChart 
                filter={chartFilter} 
                view={chartView} 
                transactions={filteredTransactions} 
              />
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Distribuição por Método de Pagamento</h3>
              </div>
              <DistribuicaoPagamentoChart transactions={filteredTransactions} />
            </div>
          </div>

          {/* Fluxo de Caixa e Faturas Recentes */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Fluxo de Caixa with new controls */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <FluxoCaixaControls
                cashFlowFilter={cashFlowFilter}
                setCashFlowFilter={setCashFlowFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                groupBy={groupBy}
                setGroupBy={setGroupBy}
              />
              <div className="space-y-3">
                {(() => {
                  const sortedGrouped = getSortedAndGroupedTransactions();
                  
                  if (groupBy === 'none') {
                    return (sortedGrouped as Transaction[]).map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className={`flex items-center justify-between p-3 border-l-4 ${transaction.tipo === 'receita' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} rounded-r-md cursor-pointer hover:opacity-80`}
                        onClick={() => handleTransactionClick(transaction)}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full ${transaction.tipo === 'receita' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} flex items-center justify-center mr-3`}>
                            <i className={`ri-arrow-${transaction.tipo === 'receita' ? 'up' : 'down'}-circle-line`}></i>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-800">{transaction.descricao}</p>
                              {transaction.cliente === 'Marcos Ribeiro' && (
                                <div className="ml-2 group relative">
                                  <i className="ri-folder-line text-blue-500 text-xs cursor-pointer"></i>
                                  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                    Relacionado ao Processo nº PROC-2025-001
                                  </div>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{transaction.cliente || 'Sem cliente'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${transaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.tipo === 'receita' ? '+' : '-'} R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.data).toLocaleDateString('pt-BR')}, {transaction.horario}
                          </p>
                        </div>
                      </div>
                    ));
                  } else {
                    return Object.entries(sortedGrouped as Record<string, Transaction[]>).map(([group, transactions]) => (
                      <div key={group}>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">{group}</h4>
                        {transactions.map((transaction) => (
                          <div 
                            key={transaction.id} 
                            className={`flex items-center justify-between p-3 border-l-4 ${transaction.tipo === 'receita' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} rounded-r-md cursor-pointer hover:opacity-80 mb-2 ml-4`}
                            onClick={() => handleTransactionClick(transaction)}
                          >
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full ${transaction.tipo === 'receita' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} flex items-center justify-center mr-3`}>
                                <i className={`ri-arrow-${transaction.tipo === 'receita' ? 'up' : 'down'}-circle-line`}></i>
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-800">{transaction.descricao}</p>
                                  {transaction.cliente === 'Marcos Ribeiro' && (
                                    <div className="ml-2 group relative">
                                      <i className="ri-folder-line text-blue-500 text-xs cursor-pointer"></i>
                                      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        Relacionado ao Processo nº PROC-2025-001
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{transaction.cliente || 'Sem cliente'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-medium ${transaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.tipo === 'receita' ? '+' : '-'} R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(transaction.data).toLocaleDateString('pt-BR')}, {transaction.horario}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ));
                  }
                })()}
              </div>
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setIsAllTransactionsModalOpen(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todas as transações
                </button>
              </div>
            </div>

            {/* Faturas Recentes */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Faturas Recentes</h3>
                <button 
                  onClick={() => setIsAllInvoicesModalOpen(true)}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  Ver todas
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Fatura 1 */}
                    <tr>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">F-2025/042</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" alt="Marcos Ribeiro" className="w-full h-full object-cover object-top" />
                          </div>
                          <span className="text-sm text-gray-900">Marcos Ribeiro</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">R$ 3.500,00</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">25/06/2025</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Pago</span>
                      </td>
                    </tr>

                    {/* Fatura 2 */}
                    <tr>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">F-2025/041</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1494790108755-2616b332906d?w=50&h=50&fit=crop&crop=face" alt="Tech Inovações Ltda." className="w-full h-full object-cover object-top" />
                          </div>
                          <span className="text-sm text-gray-900">Tech Inovações Ltda.</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">R$ 5.800,00</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">30/06/2025</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pendente</span>
                      </td>
                    </tr>

                    {/* Fatura 3 */}
                    <tr>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">F-2025/040</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" alt="Carolina Santos" className="w-full h-full object-cover object-top" />
                          </div>
                          <span className="text-sm text-gray-900">Carolina Santos</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">R$ 2.350,00</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">15/06/2025</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Atrasado</span>
                      </td>
                    </tr>

                    {/* Fatura 4 */}
                    <tr>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">F-2025/039</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" alt="Roberto Almeida" className="w-full h-full object-cover object-top" />
                          </div>
                          <span className="text-sm text-gray-900">Roberto Almeida</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">R$ 4.200,00</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">10/06/2025</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Pago</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Relatórios Financeiros with scheduler */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-medium text-gray-700">Relatórios Financeiros</h3>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-1 flex items-center justify-center">
                      <i className="ri-file-excel-line"></i>
                    </div>
                    Excel
                  </div>
                </button>
                <button className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-1 flex items-center justify-center">
                      <i className="ri-file-pdf-line"></i>
                    </div>
                    PDF
                  </div>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {/* Relatório 1 */}
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 mb-3">
                  <i className="ri-bar-chart-line"></i>
                </div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">Demonstrativo de Resultados</h4>
                <p className="text-xs text-gray-500 mb-3">Análise completa de receitas e despesas</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Junho/2025</span>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => downloadReport('Demonstrativo de Resultados', 'excel')}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    >
                      <i className="ri-file-excel-line text-xs"></i>
                    </button>
                    <button 
                      onClick={() => downloadReport('Demonstrativo de Resultados', 'pdf')}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    >
                      <i className="ri-file-pdf-line text-xs"></i>
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => openScheduler('Demonstrativo de Resultados')}
                  className="w-full text-xs bg-blue-50 text-blue-600 py-1 rounded hover:bg-blue-100"
                >
                  <i className="ri-calendar-schedule-line mr-1"></i>
                  Agendar
                </button>
              </div>

              {/* Relatório 2 */}
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-500 mb-3">
                  <i className="ri-pie-chart-line"></i>
                </div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">Análise de Faturamento</h4>
                <p className="text-xs text-gray-500 mb-3">Detalhamento por cliente e serviço</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Junho/2025</span>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => downloadReport('Análise de Faturamento', 'excel')}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    >
                      <i className="ri-file-excel-line text-xs"></i>
                    </button>
                    <button 
                      onClick={() => downloadReport('Análise de Faturamento', 'pdf')}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    >
                      <i className="ri-file-pdf-line text-xs"></i>
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => openScheduler('Análise de Faturamento')}
                  className="w-full text-xs bg-blue-50 text-blue-600 py-1 rounded hover:bg-blue-100"
                >
                  <i className="ri-calendar-schedule-line mr-1"></i>
                  Agendar
                </button>
              </div>

              {/* Relatório 3 */}
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500 mb-3">
                  <i className="ri-line-chart-line"></i>
                </div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">Projeção Financeira</h4>
                <p className="text-xs text-gray-500 mb-3">Estimativa para os próximos 6 meses</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Jul-Dez/2025</span>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => downloadReport('Projeção Financeira', 'excel')}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    >
                      <i className="ri-file-excel-line text-xs"></i>
                    </button>
                    <button 
                      onClick={() => downloadReport('Projeção Financeira', 'pdf')}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    >
                      <i className="ri-file-pdf-line text-xs"></i>
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => openScheduler('Projeção Financeira')}
                  className="w-full text-xs bg-blue-50 text-blue-600 py-1 rounded hover:bg-blue-100"
                >
                  <i className="ri-calendar-schedule-line mr-1"></i>
                  Agendar
                </button>
              </div>

              {/* Relatório 4 */}
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-500 mb-3">
                  <i className="ri-file-list-3-line"></i>
                </div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">Contas a Receber</h4>
                <p className="text-xs text-gray-500 mb-3">Faturas pendentes e previsão de recebimento</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Junho/2025</span>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => downloadReport('Contas a Receber', 'excel')}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    >
                      <i className="ri-file-excel-line text-xs"></i>
                    </button>
                    <button 
                      onClick={() => downloadReport('Contas a Receber', 'pdf')}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    >
                      <i className="ri-file-pdf-line text-xs"></i>
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => openScheduler('Contas a Receber')}
                  className="w-full text-xs bg-blue-50 text-blue-600 py-1 rounded hover:bg-blue-100"
                >
                  <i className="ri-calendar-schedule-line mr-1"></i>
                  Agendar
                </button>
              </div>
            </div>
          </div>

          {/* Configurações de Pagamento */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Configurações de Pagamento</h3>
              <button className="text-xs text-blue-500 hover:text-blue-600 font-medium">Editar</button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {/* Métodos de Pagamento */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">Métodos de Pagamento Aceitos</h4>
                <div className="space-y-3">
                  {Object.entries(paymentMethods).map(([method, isSelected]) => (
                    <div key={method} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center text-blue-500">
                          <i className={method === 'Pix' ? 'ri-wechat-pay-fill' : method === 'Boleto Bancário' ? 'ri-money-dollar-box-fill' : method === 'Cartão de Crédito' ? 'ri-bank-card-fill' : 'ri-bank-fill'}></i>
                        </div>
                        <span className="text-sm text-gray-700">{method}</span>
                      </div>
                      <button 
                        onClick={() => togglePaymentMethod(method)}
                        className={`px-3 py-1 text-xs rounded-md hover:opacity-80 ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {isSelected ? 'Selecionado' : 'Selecionar'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contas Bancárias */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">Contas Bancárias</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 mr-2 flex items-center justify-center text-blue-500">
                        <i className="ri-bank-fill"></i>
                      </div>
                      <div>
                        <span className="text-sm text-gray-700">Banco do Brasil</span>
                        <p className="text-xs text-gray-500">Ag. 1234-5 / CC. 12345-6</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                      <i className="ri-check-line text-xs"></i>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 mr-2 flex items-center justify-center text-purple-500">
                        <i className="ri-bank-fill"></i>
                      </div>
                      <div>
                        <span className="text-sm text-gray-700">Nubank</span>
                        <p className="text-xs text-gray-500">Ag. 0001 / CC. 98765432-1</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <i className="ri-check-line text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notificações */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">Notificações</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 mr-2 flex items-center justify-center text-red-500">
                        <i className="ri-alarm-warning-fill"></i>
                      </div>
                      <span className="text-sm text-gray-700">Alertas de Faturas Vencidas</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                      <i className="ri-notification-3-fill text-xs"></i>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 mr-2 flex items-center justify-center text-yellow-500">
                        <i className="ri-notification-3-fill"></i>
                      </div>
                      <span className="text-sm text-gray-700">Lembretes de Pagamento</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                      <i className="ri-notification-3-fill text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <NovaTransacaoModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
      />

      <TodasTransacoesModal 
        isOpen={isAllTransactionsModalOpen}
        onClose={() => setIsAllTransactionsModalOpen(false)}
        transactions={filteredTransactions}
      />

      <PeriodoPersonalizadoModal 
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        onSave={handleCustomPeriod}
      />

      <TodasFaturasModal 
        isOpen={isAllInvoicesModalOpen}
        onClose={() => setIsAllInvoicesModalOpen(false)}
      />

      <TransactionDetailsModal
        isOpen={isTransactionDetailsOpen}
        onClose={() => setIsTransactionDetailsOpen(false)}
        transaction={selectedTransaction}
      />

      <ReportScheduler
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        reportType={schedulerReportType}
      />

      {/* Script para carregar ECharts */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.5.0/echarts.min.js"></script>
    </div>
  );
};
