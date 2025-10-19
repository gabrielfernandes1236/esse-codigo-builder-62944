
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Client {
  id: string;
  name: string;
  email: string;
  type: 'PF' | 'PJ';
  phone: string;
  location: string;
  cpf_cnpj: string;
  address?: string;
}

interface LawyerData {
  name: string;
  oab: string;
  address: string;
  uf: string;
}

const defaultLawyerData: LawyerData = {
  name: 'Dr. Ricardo Oliveira',
  oab: '123.456',
  address: 'Rua dos Advogados, 456 - Centro - São Paulo - SP - CEP: 01234-567',
  uf: 'SP'
};

export const processPlaceholders = (content: string, client: Client): string => {
  let processed = content;

  // Data atual
  const today = new Date();
  const formattedDate = format(today, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  // Dados do cliente
  processed = processed.replace(/\{\{Cliente\}\}/g, client.name);
  processed = processed.replace(/\{\{CPF_CNPJ\}\}/g, client.cpf_cnpj);
  processed = processed.replace(/\{\{Endereco\}\}/g, client.address || 'Endereço não informado');
  processed = processed.replace(/\{\{TipoPessoa\}\}/g, client.type === 'PF' ? 'pessoa física' : 'pessoa jurídica');
  processed = processed.replace(/\{\{TipoDocumento\}\}/g, client.type === 'PF' ? 'CPF' : 'CNPJ');
  
  // Nacionalidade e estado civil para pessoas físicas
  if (client.type === 'PF') {
    processed = processed.replace(/\{\{Nacionalidade\}\}/g, 'brasileiro(a)');
    processed = processed.replace(/\{\{EstadoCivil\}\}/g, 'solteiro(a)');
    processed = processed.replace(/\{\{Qualificacao\}\}/g, `brasileiro(a), solteiro(a), portador(a) do CPF nº ${client.cpf_cnpj}`);
  } else {
    processed = processed.replace(/\{\{Nacionalidade\}\}/g, 'sociedade empresária');
    processed = processed.replace(/\{\{EstadoCivil\}\}/g, '');
    processed = processed.replace(/\{\{Qualificacao\}\}/g, `pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${client.cpf_cnpj}`);
  }
  
  // Data
  processed = processed.replace(/\{\{Data\}\}/g, formattedDate);
  
  // Localização
  const locationParts = client.location.split(' - ');
  processed = processed.replace(/\{\{Cidade\}\}/g, locationParts[0] || 'São Paulo');
  processed = processed.replace(/\{\{UF\}\}/g, locationParts[1] || 'SP');
  
  // Dados do advogado
  processed = processed.replace(/\{\{Advogado\}\}/g, defaultLawyerData.name);
  processed = processed.replace(/\{\{OAB\}\}/g, defaultLawyerData.oab);
  processed = processed.replace(/\{\{EnderecoAdvogado\}\}/g, defaultLawyerData.address);
  
  // Placeholders específicos por template com valores padrão
  processed = processed.replace(/\{\{ObjetoContrato\}\}/g, '[Descrever o objeto do contrato]');
  processed = processed.replace(/\{\{ValorHonorarios\}\}/g, '[Valor dos honorários]');
  processed = processed.replace(/\{\{FormaPagamento\}\}/g, '[Forma de pagamento]');
  processed = processed.replace(/\{\{Vara\}\}/g, '[Vara competente]');
  processed = processed.replace(/\{\{TipoAcao\}\}/g, '[Tipo de ação]');
  processed = processed.replace(/\{\{Reu\}\}/g, '[Nome do réu]');
  processed = processed.replace(/\{\{QualificacaoReu\}\}/g, '[Qualificação do réu]');
  processed = processed.replace(/\{\{RelatoFatos\}\}/g, '[Relatar os fatos relevantes do caso]');
  processed = processed.replace(/\{\{FundamentosJuridicos\}\}/g, '[Fundamentação jurídica aplicável]');
  processed = processed.replace(/\{\{Pedido1\}\}/g, '[Primeiro pedido]');
  processed = processed.replace(/\{\{Pedido2\}\}/g, '[Segundo pedido]');
  processed = processed.replace(/\{\{ValorCausa\}\}/g, '[Valor da causa]');
  processed = processed.replace(/\{\{AssuntoParecer\}\}/g, '[Assunto do parecer]');
  processed = processed.replace(/\{\{RelatorioFatos\}\}/g, '[Relatório detalhado dos fatos]');
  processed = processed.replace(/\{\{FundamentacaoJuridica\}\}/g, '[Fundamentação jurídica do parecer]');
  processed = processed.replace(/\{\{Conclusao\}\}/g, '[Conclusão do parecer]');
  
  return processed;
};

export const getTemplateType = (templateId: string): string => {
  const typeMap: Record<string, string> = {
    'procuracao': 'Processual',
    'contrato-prestacao': 'Contrato',
    'peticao-inicial': 'Processual',
    'parecer-juridico': 'Parecer'
  };
  
  return typeMap[templateId] || 'Outros';
};
