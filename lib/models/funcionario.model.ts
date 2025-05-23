/**
 * Modelo de dados para funcionário
 * Contém todos os campos utilizados no formulário de cadastro de funcionário
 */

export interface Funcionario {
  // Dados Pessoais
  foto?: string;
  tratamento?: 'sr' | 'sra' | 'dr' | 'dra';
  nome: string;
  email?: string;
  telefone?: string;
  celular?: string;
  operadora?: 'vivo' | 'claro' | 'tim' | 'oi';
  nascimento: Date;

  // Documentos
  cpf: string;
  rg?: string;
  expedicaoRg?: Date;
  orgaoExpedidor?: 'ssp' | 'detran' | 'pf' | 'outro';
  cnh?: string;
  categoriaCnh?: 'a' | 'b' | 'c' | 'd' | 'e' | 'ab' | 'ac' | 'ad' | 'ae';
  dataExpedicaoCnh?: Date;
  dataValidadeCnh?: Date;
  tituloEleitor?: string;
  zona?: string;
  secao?: string;
  pisPasep?: string;
  dataExpedicaoPis?: Date;
  ctps?: string;
  serieCtps?: string;

  // Endereço
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cep: string;
  estado: string;
  estadoNatal?: string;
  
  // Dados Profissionais
  secretaria: string;
  vinculo: 'efetivo' | 'contratado' | 'comissionado' | 'estagiario';
  cargo: string;
  registroProfissional?: string;
  dataAdmissao?: Date;
  matricula?: string;
  readaptado?: 'sim' | 'nao';
  cedido?: 'sim' | 'nao';
  permutado?: 'sim' | 'nao';
  
  // Remuneração
  formaPagamento: 'transferencia' | 'cheque' | 'pix';
  salario?: string;
  banco?: string;
  agencia?: string;
  tipoConta?: 'corrente' | 'poupanca' | 'salario';
  opVar?: string;
  numeroConta?: string;
  digito?: string;
  
  // Informações Sociais
  nacionalidade?: 'brasileira' | 'naturalizado' | 'estrangeiro';
  nomeMae?: string;
  nomePai?: string;
  corRaca?: 'branca' | 'preta' | 'parda' | 'amarela' | 'indigena' | 'nao_declarado';
  deficiencia?: 'nenhuma' | 'fisica' | 'auditiva' | 'visual' | 'mental' | 'multipla';
  sexo?: 'masculino' | 'feminino' | 'outro' | 'nao_informado';
  estadoCivil?: 'solteiro' | 'casado' | 'separado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
  grauInstrucao?: 'analfabeto' | 'fundamental_incompleto' | 'fundamental_completo' | 'medio_incompleto' | 'medio_completo' | 'superior_incompleto' | 'superior_completo' | 'pos_graduacao' | 'mestrado' | 'doutorado';
  
  // Observações
  cedidoInfo?: string;
  observacoes?: string;
  documento?: string;
  ativo?: boolean;
}