import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useClientes } from '@/hooks/useDashboardData';
import { useProcessesData } from '@/hooks/useProcessesData';
import { FileText, Plus } from 'lucide-react';

interface NovoProcessoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProcessoForm {
  numero: string;
  titulo: string;
  cliente_id: string;
  area: string;
  valor_causa: string;
  observacoes: string;
}

export const NovoProcessoModal = ({ isOpen, onClose }: NovoProcessoModalProps) => {
  const { data: clientes, refetch: refetchClientes } = useClientes();
  const { addProcess } = useProcessesData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProcessoForm>({
    defaultValues: {
      numero: '',
      titulo: '',
      cliente_id: '',
      area: '',
      valor_causa: '',
      observacoes: ''
    }
  });

  // Escutar mudanças nos clientes para atualizar a lista
  useEffect(() => {
    const handleClientsUpdate = () => {
      console.log('Clientes atualizados, recarregando lista...');
      refetchClientes();
    };

    window.addEventListener('storage', handleClientsUpdate);
    window.addEventListener('clientsUpdated', handleClientsUpdate);

    return () => {
      window.removeEventListener('storage', handleClientsUpdate);
      window.removeEventListener('clientsUpdated', handleClientsUpdate);
    };
  }, [refetchClientes]);

  // Recarregar clientes quando o modal for aberto
  useEffect(() => {
    if (isOpen) {
      refetchClientes();
    }
  }, [isOpen, refetchClientes]);

  const areas = [
    'Trabalhista',
    'Cível',
    'Família',
    'Empresarial',
    'Criminal',
    'Tributário',
    'Previdenciário'
  ];

  const onSubmit = async (data: ProcessoForm) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Criando novo processo:', data);
      
      // Buscar nome do cliente
      const clienteSelecionado = clientes?.find(c => c.id === data.cliente_id);
      const clienteNome = clienteSelecionado?.nome || 'Cliente não encontrado';
      
      const novoProcesso = {
        numero: data.numero,
        titulo: data.titulo,
        cliente_id: data.cliente_id,
        cliente_nome: clienteNome,
        area: data.area,
        valor_causa: parseFloat(data.valor_causa) || 0,
        observacoes: data.observacoes
      };
      
      // Adicionar processo - a reatividade é automática
      const processoSalvo = addProcess(novoProcesso);
      
      console.log('Processo criado com sucesso:', processoSalvo);
      
      // Reset do form
      form.reset();
      setIsSubmitting(false);
      
      // Fechar modal
      onClose();
      
      console.log('✅ Processo criado - tabela deve atualizar automaticamente');
      
    } catch (error) {
      console.error('Erro ao criar processo:', error);
      setIsSubmitting(false);
    }
  };

  // Reset isSubmitting quando modal fechar
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Novo Processo
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numero"
                rules={{ required: 'Número do processo é obrigatório' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Processo</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="0000000-00.0000.0.00.0000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cliente_id"
                rules={{ required: 'Cliente é obrigatório' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione um cliente</option>
                        {clientes?.map(cliente => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.nome}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="titulo"
              rules={{ required: 'Título é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Processo</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Ex: Ação Trabalhista - Horas Extras"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="area"
                rules={{ required: 'Área é obrigatória' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Jurídica</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione uma área</option>
                        {areas.map(area => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_causa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da Causa (R$)</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Observações adicionais sobre o processo..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  'Criando...'
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Processo
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
