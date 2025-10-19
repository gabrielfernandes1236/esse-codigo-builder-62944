import { useState, useEffect } from 'react';
import { Tarefa } from '@/components/TarefaCard';

export const useTarefas = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    {
      id: '1',
      nome: 'Revisar contrato de prestação de serviços',
      descricao: 'Revisar e ajustar cláusulas do contrato de prestação de serviços para o cliente Pedro Mendes.',
      urgencia: 'urgente',
      status: 'pendente',
      dataCriacao: '20/06/2025'
    },
    {
      id: '2',
      nome: 'Preparar documentação para audiência',
      descricao: 'Organizar e preparar documentos necessários para a audiência do processo 789/2025 da cliente Carolina Mendonça.',
      urgencia: 'moderada',
      status: 'pendente',
      dataCriacao: '19/06/2025'
    },
    {
      id: '3',
      nome: 'Agendar reunião com Logística Carvalho SA',
      descricao: 'Entrar em contato com o representante da Logística Carvalho SA para agendar reunião de alinhamento contratual.',
      urgencia: 'normal',
      status: 'pendente',
      dataCriacao: '18/06/2025'
    },
    {
      id: '4',
      nome: 'Enviar proposta tributária para Prefeitura Municipal',
      descricao: 'Finalizar e enviar proposta tributária elaborada para a Prefeitura Municipal conforme solicitado.',
      urgencia: 'normal',
      status: 'pendente',
      dataCriacao: '17/06/2025'
    },
    {
      id: '5',
      nome: 'Atualizar cadastro do Grupo Empresarial XYZ',
      descricao: 'Atualizar informações cadastrais e documentos do Grupo Empresarial XYZ no sistema.',
      urgencia: 'normal',
      status: 'pendente',
      dataCriacao: '16/06/2025'
    },
    {
      id: '6',
      nome: 'Elaborar acordo confidencial para Maritime Trade',
      descricao: 'Elaborar minuta de acordo de confidencialidade para a empresa Maritime Trade conforme solicitado.',
      urgencia: 'normal',
      status: 'concluida',
      dataCriacao: '15/06/2025',
      dataConclusao: '20/06/2025'
    },
    {
      id: '7',
      nome: 'Analisar pedido de recurso da cliente Carolina Mendonça',
      descricao: 'Analisar fundamentos e viabilidade do pedido de recurso apresentado pela cliente Carolina Mendonça no processo 789/2025.',
      urgencia: 'urgente',
      status: 'concluida',
      dataCriacao: '14/06/2025',
      dataConclusao: '19/06/2025'
    },
    {
      id: '8',
      nome: 'Emitir parecer jurídico para caso empresarial',
      descricao: 'Elaborar parecer jurídico sobre viabilidade de fusão empresarial para o Grupo Empresarial XYZ.',
      urgencia: 'moderada',
      status: 'concluida',
      dataCriacao: '13/06/2025',
      dataConclusao: '18/06/2025'
    }
  ]);

  const adicionarTarefa = (novaTarefa: { nome: string; descricao: string; urgencia: string }) => {
    const tarefa: Tarefa = {
      id: Date.now().toString(),
      nome: novaTarefa.nome,
      descricao: novaTarefa.descricao,
      urgencia: novaTarefa.urgencia as 'normal' | 'moderada' | 'urgente',
      status: 'pendente',
      dataCriacao: new Date().toLocaleDateString('pt-BR')
    };
    setTarefas(prev => [tarefa, ...prev]);
  };

  const editarTarefa = (id: string, tarefaAtualizada: { nome: string; descricao: string; urgencia: string }) => {
    setTarefas(prev => prev.map(tarefa => 
      tarefa.id === id 
        ? { 
            ...tarefa, 
            nome: tarefaAtualizada.nome,
            descricao: tarefaAtualizada.descricao,
            urgencia: tarefaAtualizada.urgencia as 'normal' | 'moderada' | 'urgente'
          }
        : tarefa
    ));
  };

  const concluirTarefa = (id: string) => {
    setTarefas(prev => prev.map(tarefa => 
      tarefa.id === id 
        ? { ...tarefa, status: 'concluida' as const, dataConclusao: new Date().toLocaleDateString('pt-BR') }
        : tarefa
    ));
  };

  const reabrirTarefa = (id: string) => {
    setTarefas(prev => prev.map(tarefa => 
      tarefa.id === id 
        ? { ...tarefa, status: 'pendente' as const, dataConclusao: undefined }
        : tarefa
    ));
  };

  const tarefasPendentes = tarefas.filter(t => t.status === 'pendente');
  const tarefasConcluidas = tarefas.filter(t => t.status === 'concluida');

  return {
    tarefas,
    tarefasPendentes,
    tarefasConcluidas,
    adicionarTarefa,
    editarTarefa,
    concluirTarefa,
    reabrirTarefa
  };
};
