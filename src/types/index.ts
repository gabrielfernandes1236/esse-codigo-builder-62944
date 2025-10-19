
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf_cnpj: string;
  status: 'ativo' | 'inativo';
  data_cadastro: string;
}

export interface Processo {
  id: string;
  numero: string;
  titulo: string;
  cliente_id: string;
  cliente?: Cliente;
  area: 'Trabalhista' | 'Cível' | 'Família' | 'Empresarial' | 'Criminal' | 'Tributário' | 'Previdenciário';
  status: 'em_andamento' | 'suspenso' | 'arquivado' | 'concluido';
  valor_causa: number;
  data_abertura: string;
  data_conclusao?: string;
  observacoes?: string;
}

export interface Agenda {
  id: string;
  titulo: string;
  tipo: 'audiencia' | 'reuniao' | 'prazo' | 'outros';
  processo_id?: string;
  cliente_id?: string;
  data_inicio: string;
  data_fim: string;
  local?: string;
  status: 'agendado' | 'concluido' | 'cancelado';
  observacoes?: string;
  // Novo campo para conclusão manual
  concluido?: boolean;
  dataConclusao?: string;
}

export interface Financeiro {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'vencido';
  cliente_id?: string;
  processo_id?: string;
  categoria: string;
}

export interface DashboardStats {
  processos_ativos: number;
  audiencias_pendentes: number;
  clientes_ativos: number;
  receita_mensal: number;
}

export interface ProcessosByStatus {
  em_andamento: number;
  suspenso: number;
  arquivado: number;
  concluido: number;
}

export interface ProcessosByArea {
  area: string;
  total: number;
  percentual: number;
}
