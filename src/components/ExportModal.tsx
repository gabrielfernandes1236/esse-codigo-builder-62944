
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, FileSpreadsheet, Table } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal = ({ isOpen, onClose }: ExportModalProps) => {
  const [exportType, setExportType] = useState<'excel' | 'csv'>('excel');
  const [selectedData, setSelectedData] = useState({
    kpis: true,
    graficos: true,
    prazos: true,
    compromissos: true,
    processos: true
  });

  const handleExport = async () => {
    console.log('Exportando dados:', { exportType, selectedData });
    
    const data = {
      timestamp: new Date().toISOString(),
      type: exportType,
      data: selectedData
    };
    
    if (exportType === 'excel') {
      // Simula criação do arquivo Excel com múltiplas abas
      const workbookContent = createExcelContent(selectedData);
      const blob = new Blob([workbookContent], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-relatorio-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('Arquivo Excel exportado com sucesso');
    } else {
      // Exportação CSV
      const csvContent = createCSVContent(selectedData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
    
    onClose();
  };

  const createExcelContent = (selectedData: any) => {
    // Simula conteúdo Excel com abas separadas
    let content = 'Dashboard CRM Jurídico - Relatório\n\n';
    
    if (selectedData.kpis) {
      content += 'ABA: KPIs\n';
      content += 'Processos Ativos,Audiências Pendentes,Clientes Ativos,Receita Mensal\n';
      content += '2,2,2,R$ 20.000\n\n';
    }
    
    if (selectedData.graficos) {
      content += 'ABA: Gráficos\n';
      content += 'Status,Quantidade\n';
      content += 'Em Andamento,2\n';
      content += 'Suspenso,0\n';
      content += 'Arquivado,0\n';
      content += 'Concluído,0\n\n';
    }
    
    if (selectedData.compromissos) {
      content += 'ABA: Próximos Compromissos\n';
      content += 'Título,Tipo,Data,Local\n';
      content += 'Audiência de Conciliação,Audiência,20/06/2024 09:30,Fórum Central\n\n';
    }
    
    if (selectedData.prazos) {
      content += 'ABA: Prazos Importantes\n';
      content += 'Descrição,Data Limite,Status\n';
      content += 'Contestação - Processo 123,25/06/2024,Pendente\n\n';
    }
    
    if (selectedData.processos) {
      content += 'ABA: Últimos Processos\n';
      content += 'Número,Cliente,Área,Status,Atualização\n';
      content += '0123456-78.2023.8.26.0100,Ana Beatriz Mendes,Trabalhista,Em andamento,18/06/2025\n';
    }
    
    return content;
  };

  const createCSVContent = (selectedData: any) => {
    let csvContent = `Relatório Dashboard,${new Date().toLocaleDateString()}\n\n`;
    
    if (selectedData.kpis) {
      csvContent += 'KPIs\n';
      csvContent += 'Indicador,Valor\n';
      csvContent += 'Processos Ativos,2\n';
      csvContent += 'Audiências Pendentes,2\n';
      csvContent += 'Clientes Ativos,2\n';
      csvContent += 'Receita Mensal,R$ 20.000\n\n';
    }
    
    return csvContent;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Formato de Exportação
            </label>
            <div className="flex gap-2">
              <Button
                variant={exportType === 'excel' ? 'default' : 'outline'}
                onClick={() => setExportType('excel')}
                className="flex-1"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button
                variant={exportType === 'csv' ? 'default' : 'outline'}
                onClick={() => setExportType('csv')}
                className="flex-1"
              >
                <Table className="w-4 h-4 mr-2" />
                CSV
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Dados a Exportar
            </label>
            <div className="space-y-2">
              {Object.entries({
                kpis: 'KPIs e Indicadores',
                graficos: 'Gráficos e Estatísticas',
                prazos: 'Prazos Importantes',
                compromissos: 'Próximos Compromissos',
                processos: 'Últimos Processos'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedData[key as keyof typeof selectedData]}
                    onChange={(e) => setSelectedData(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 mr-3"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleExport} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
