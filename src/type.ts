export interface TextType {
  id?: string;
  area: string;
  text: string;
  updatedAt?: Date;
  created_at?: Date;
  position: string;
  titulo: string | null;
}

export interface QuestionType {
  id?: string;
  question: string;
  response: string;
}

export interface ValueType {
  id?: string;
  titulo: string;
  valor: number;
}

export interface ImageType {
  id?: string;
  tag: string;
  area: string;
  position: number;
  imageUrl: string;
  responsiveMode: string;
}
export interface DateEventType {
  id?: string;
  tipo: string;
  titulo: string;
  dataInicio: Date;
  dataFim: Date;
  orcamentoId?: string;
  orcamento?: BugdetType
}

export interface BugdetType {
  id?: string;
  nome: string;
  tipo: string;
  email: string;
  dataFim: Date;
  texto: string;
  total: number;
  telefone: string;
  feedback: string;
  dataInicio: Date;
  limpeza: boolean;
  contato: boolean;
  valorBase: number;
  convidados: number;
  seguranca: boolean;
  trafegoCanal: string;
  conheceEspaco: boolean;
  recepcionista: boolean;
  qtdHorasExtras: number;
  valorHoraExtra: number;
  aprovadoAr756: boolean;
  aprovadoCliente: boolean;
}
