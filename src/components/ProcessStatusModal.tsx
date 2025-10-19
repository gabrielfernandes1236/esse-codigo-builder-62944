
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface ProcessStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  processos: any[];
  periodo: string;
}

export const ProcessStatusModal = ({ 
  isOpen, 
  onClose, 
  titulo, 
  processos, 
  periodo 
}: ProcessStatusModalProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return 'default';
      case 'suspenso':
        return 'secondary';
      case 'arquivado':
        return 'outline';
      case 'concluido':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      'em_andamento': 'Em Andamento',
      'suspenso': 'Suspenso',
      'arquivado': 'Arquivado',
      'concluido': 'Concluído'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatPeriodo = (periodo: string) => {
    const periodoMap = {
      'diario': 'hoje',
      'semanal': 'nesta semana',
      'mensal': 'neste mês',
      'anual': 'neste ano'
    };
    return periodoMap[periodo as keyof typeof periodoMap] || periodo;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {titulo} - {formatPeriodo(periodo)}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            {processos.length} processo(s) encontrado(s)
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] w-full">
          {processos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum processo encontrado para este período
            </div>
          ) : (
            <div className="space-y-3">
              {processos.map((processo) => (
                <div
                  key={processo.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {processo.titulo}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Processo: {processo.numero}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(processo.status)}>
                      {getStatusLabel(processo.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Cliente:</span> {processo.cliente_nome}
                    </div>
                    <div>
                      <span className="font-medium">Área:</span> {processo.area}
                    </div>
                    <div>
                      <span className="font-medium">Data Abertura:</span>{" "}
                      {new Date(processo.data_abertura).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <span className="font-medium">Última Atualização:</span>{" "}
                      {new Date(processo.data_atualizacao).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {processo.valor_causa && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Valor da Causa:</span>{" "}
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(processo.valor_causa)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
