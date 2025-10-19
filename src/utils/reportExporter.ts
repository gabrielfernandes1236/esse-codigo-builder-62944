
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

interface KPIs {
  receitas: number;
  despesas: number;
  lucro: number;
  faturasPendentes: number;
}

interface Fatura {
  id: string;
  numero: string;
  cliente: string;
  valor: number;
  vencimento: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
}

export class ReportExporter {
  
  static generateDemonstrativoResultadosPDF(transactions: Transaction[], kpis: KPIs, periodo: string) {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.setTextColor(51, 51, 51);
    doc.text('Demonstrativo de Resultados', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(102, 102, 102);
    doc.text(`Período: ${periodo}`, 20, 30);
    doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 20, 36);
    
    // Resumo KPIs
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text('Resumo Executivo', 20, 50);
    
    const kpiData = [
      ['Indicador', 'Valor'],
      ['Receita Total', `R$ ${kpis.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Despesas Totais', `R$ ${kpis.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Lucro Líquido', `R$ ${kpis.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Faturas Pendentes', kpis.faturasPendentes.toString()]
    ];

    autoTable(doc, {
      startY: 60,
      head: [kpiData[0]],
      body: kpiData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [87, 181, 231], textColor: 255 },
      styles: { fontSize: 10 }
    });

    // Detalhamento por categoria
    const receitas = transactions.filter(t => t.tipo === 'receita');
    const despesas = transactions.filter(t => t.tipo === 'despesa');
    
    const receitasPorCategoria = receitas.reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
      return acc;
    }, {} as Record<string, number>);
    
    const despesasPorCategoria = despesas.reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
      return acc;
    }, {} as Record<string, number>);

    let currentY = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setFontSize(14);
    doc.text('Detalhamento por Categoria', 20, currentY);
    currentY += 10;

    const categoriaData = [
      ['Categoria', 'Receitas', 'Despesas', 'Saldo'],
      ...Object.keys({...receitasPorCategoria, ...despesasPorCategoria}).map(categoria => [
        categoria,
        `R$ ${(receitasPorCategoria[categoria] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        `R$ ${(despesasPorCategoria[categoria] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        `R$ ${((receitasPorCategoria[categoria] || 0) - (despesasPorCategoria[categoria] || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      ])
    ];

    autoTable(doc, {
      startY: currentY,
      head: [categoriaData[0]],
      body: categoriaData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [87, 181, 231], textColor: 255 },
      styles: { fontSize: 10 }
    });

    return doc;
  }

  static generateAnalyseFaturamentoPDF(transactions: Transaction[], periodo: string) {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.setTextColor(51, 51, 51);
    doc.text('Análise de Faturamento', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(102, 102, 102);
    doc.text(`Período: ${periodo}`, 20, 30);
    doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 20, 36);

    const receitas = transactions.filter(t => t.tipo === 'receita');
    
    // Faturamento por cliente
    const faturamentoPorCliente = receitas.reduce((acc, t) => {
      if (t.cliente) {
        acc[t.cliente] = (acc[t.cliente] || 0) + t.valor;
      }
      return acc;
    }, {} as Record<string, number>);

    const faturamentoData = [
      ['Cliente', 'Valor Faturado', 'Participação (%)'],
      ...Object.entries(faturamentoPorCliente)
        .sort(([,a], [,b]) => b - a)
        .map(([cliente, valor]) => [
          cliente,
          `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          `${((valor / receitas.reduce((sum, t) => sum + t.valor, 0)) * 100).toFixed(1)}%`
        ])
    ];

    autoTable(doc, {
      startY: 50,
      head: [faturamentoData[0]],
      body: faturamentoData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [87, 181, 231], textColor: 255 },
      styles: { fontSize: 10 }
    });

    // Faturamento por método de pagamento
    let currentY = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setFontSize(14);
    doc.text('Distribuição por Método de Pagamento', 20, currentY);
    currentY += 10;

    const metodoPagamento = receitas.reduce((acc, t) => {
      acc[t.metodo_pagamento] = (acc[t.metodo_pagamento] || 0) + t.valor;
      return acc;
    }, {} as Record<string, number>);

    const metodoData = [
      ['Método de Pagamento', 'Valor', 'Participação (%)'],
      ...Object.entries(metodoPagamento).map(([metodo, valor]) => [
        metodo,
        `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        `${((valor / receitas.reduce((sum, t) => sum + t.valor, 0)) * 100).toFixed(1)}%`
      ])
    ];

    autoTable(doc, {
      startY: currentY,
      head: [metodoData[0]],
      body: metodoData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [87, 181, 231], textColor: 255 },
      styles: { fontSize: 10 }
    });

    return doc;
  }

  static generateProjecaoFinanceiraPDF(kpis: KPIs, periodo: string) {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.setTextColor(51, 51, 51);
    doc.text('Projeção Financeira', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(102, 102, 102);
    doc.text(`Período de Projeção: Jul-Dez/2025`, 20, 30);
    doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 20, 36);

    // Projeções baseadas nos dados atuais
    const meses = ['Jul/25', 'Ago/25', 'Set/25', 'Out/25', 'Nov/25', 'Dez/25'];
    const crescimentoMensal = 0.05; // 5% de crescimento mensal projetado

    const projecaoData = [
      ['Mês', 'Receita Projetada', 'Despesas Projetadas', 'Lucro Projetado'],
      ...meses.map((mes, index) => {
        const fatorCrescimento = Math.pow(1 + crescimentoMensal, index + 1);
        const receitaProjetada = kpis.receitas * fatorCrescimento;
        const despesaProjetada = kpis.despesas * Math.pow(1.02, index + 1); // 2% de crescimento nas despesas
        const lucroProjetado = receitaProjetada - despesaProjetada;
        
        return [
          mes,
          `R$ ${receitaProjetada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          `R$ ${despesaProjetada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          `R$ ${lucroProjetado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        ];
      })
    ];

    autoTable(doc, {
      startY: 50,
      head: [projecaoData[0]],
      body: projecaoData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [87, 181, 231], textColor: 255 },
      styles: { fontSize: 10 }
    });

    return doc;
  }

  static generateContasReceberPDF(periodo: string) {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.setTextColor(51, 51, 51);
    doc.text('Contas a Receber', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(102, 102, 102);
    doc.text(`Período: ${periodo}`, 20, 30);
    doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 20, 36);

    // Dados das faturas (simulados baseados nos dados da interface)
    const faturas: Fatura[] = [
      {
        id: '2',
        numero: 'F-2025/041',
        cliente: 'Tech Inovações Ltda.',
        valor: 5800,
        vencimento: '30/06/2025',
        status: 'Pendente'
      },
      {
        id: '3',
        numero: 'F-2025/040',
        cliente: 'Carolina Santos',
        valor: 2350,
        vencimento: '15/06/2025',
        status: 'Atrasado'
      }
    ];

    const faturasPendentes = faturas.filter(f => f.status !== 'Pago');

    const faturaData = [
      ['Nº Fatura', 'Cliente', 'Valor', 'Vencimento', 'Status', 'Dias em Atraso'],
      ...faturasPendentes.map(fatura => {
        const vencimento = new Date(fatura.vencimento.split('/').reverse().join('-'));
        const hoje = new Date();
        const diasAtraso = fatura.status === 'Atrasado' ? 
          Math.floor((hoje.getTime() - vencimento.getTime()) / (1000 * 60 * 60 * 24)) : 0;
        
        return [
          fatura.numero,
          fatura.cliente,
          `R$ ${fatura.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          fatura.vencimento,
          fatura.status,
          diasAtraso > 0 ? diasAtraso.toString() : '-'
        ];
      })
    ];

    autoTable(doc, {
      startY: 50,
      head: [faturaData[0]],
      body: faturaData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [87, 181, 231], textColor: 255 },
      styles: { fontSize: 10 },
      columnStyles: {
        4: { cellWidth: 20 },
        5: { cellWidth: 25 }
      }
    });

    // Resumo
    let currentY = (doc as any).lastAutoTable.finalY + 20;
    const totalPendente = faturasPendentes.reduce((sum, f) => sum + f.valor, 0);
    
    doc.setFontSize(14);
    doc.text('Resumo', 20, currentY);
    currentY += 10;

    const resumoData = [
      ['Descrição', 'Valor'],
      ['Total a Receber', `R$ ${totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Faturas Pendentes', faturasPendentes.filter(f => f.status === 'Pendente').length.toString()],
      ['Faturas Atrasadas', faturasPendentes.filter(f => f.status === 'Atrasado').length.toString()]
    ];

    autoTable(doc, {
      startY: currentY,
      head: [resumoData[0]],
      body: resumoData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [87, 181, 231], textColor: 255 },
      styles: { fontSize: 10 }
    });

    return doc;
  }

  static generateExcelReport(reportType: string, transactions: Transaction[], kpis: KPIs, periodo: string) {
    const wb = XLSX.utils.book_new();
    
    if (reportType === 'Demonstrativo de Resultados') {
      // Aba KPIs
      const kpiData = [
        ['Demonstrativo de Resultados - ' + periodo],
        [''],
        ['Indicador', 'Valor'],
        ['Receita Total', kpis.receitas],
        ['Despesas Totais', kpis.despesas],
        ['Lucro Líquido', kpis.lucro],
        ['Faturas Pendentes', kpis.faturasPendentes]
      ];
      const wsKpis = XLSX.utils.aoa_to_sheet(kpiData);
      
      // Formatação
      wsKpis['!cols'] = [{ width: 20 }, { width: 15 }];
      XLSX.utils.book_append_sheet(wb, wsKpis, 'Resumo');

      // Aba Transações
      const transactionData = [
        ['Detalhamento de Transações'],
        [''],
        ['Tipo', 'Descrição', 'Cliente', 'Valor', 'Data', 'Método', 'Categoria'],
        ...transactions.map(t => [
          t.tipo === 'receita' ? 'Receita' : 'Despesa',
          t.descricao,
          t.cliente || '',
          t.valor,
          new Date(t.data).toLocaleDateString('pt-BR'),
          t.metodo_pagamento,
          t.categoria
        ])
      ];
      const wsTransactions = XLSX.utils.aoa_to_sheet(transactionData);
      wsTransactions['!cols'] = [
        { width: 10 }, { width: 30 }, { width: 20 }, 
        { width: 12 }, { width: 12 }, { width: 15 }, { width: 15 }
      ];
      XLSX.utils.book_append_sheet(wb, wsTransactions, 'Transações');
    }
    
    else if (reportType === 'Análise de Faturamento') {
      const receitas = transactions.filter(t => t.tipo === 'receita');
      const faturamentoPorCliente = receitas.reduce((acc, t) => {
        if (t.cliente) {
          acc[t.cliente] = (acc[t.cliente] || 0) + t.valor;
        }
        return acc;
      }, {} as Record<string, number>);

      const faturamentoData = [
        ['Análise de Faturamento - ' + periodo],
        [''],
        ['Cliente', 'Valor Faturado', 'Participação (%)'],
        ...Object.entries(faturamentoPorCliente)
          .sort(([,a], [,b]) => b - a)
          .map(([cliente, valor]) => [
            cliente,
            valor,
            ((valor / receitas.reduce((sum, t) => sum + t.valor, 0)) * 100).toFixed(1) + '%'
          ])
      ];
      
      const ws = XLSX.utils.aoa_to_sheet(faturamentoData);
      ws['!cols'] = [{ width: 25 }, { width: 15 }, { width: 15 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Faturamento');
    }

    return wb;
  }

  static downloadPDF(doc: jsPDF, filename: string) {
    doc.save(filename);
  }

  static downloadExcel(wb: any, filename: string) {
    XLSX.writeFile(wb, filename);
  }
}
