export type NivelAcesso = 'atleta' | 'tecnico' | 'financeiro' | 'geral' | 'almoxarifado' | 'root';
export type TipoVinculo = 'mensalista' | 'convidado' | 'inativo';
export type TipoEvento = 'amistoso' | 'campeonato' | 'treino' | 'evento_social';
export type StatusConfirmacao = 'confirmado' | 'recusado' | 'duvida' | 'lista_espera';
export type EstadoItem = 'novo' | 'bom' | 'desgastado' | 'avariado';
export type StatusCustodia = 'em_uso' | 'devolvido' | 'com_pendencia';

export interface Atleta {
  id: string;
  nome: string;
  apelido?: string;
  telefone?: string;
  foto_url?: string;
  posicao_principal: string;
  posicao_secundaria?: string;
  numero_camisa?: number;
  tipo_vinculo: TipoVinculo;
  nivel_acesso: NivelAcesso;
  tamanho_camisa: string;
  tamanho_calcao: string;
  numero_calcado?: number | null;
  ativo: boolean;
  criado_em: string;
  chegou_vestiario?: boolean;
  chegou_em?: string; // para regra do atraso (T-35)
}

export interface PatrimonioItem {
  id: string;
  nome: string;
  categoria: 'fardamento' | 'treino' | 'apoio';
  quantidade_total: number;
  quantidade_disponivel: number;
  estado_conservacao: EstadoItem;
  observacoes?: string;
}

export interface Evento {
  id: string;
  titulo: string;
  tipo_evento: TipoEvento;
  data_hora: string; // ISO string
  horario_vestiario_t50: string; // ISO string
  horario_prelecao_t35?: string;
  horario_aquecimento_t25?: string;
  local_nome: string;
  local_link_gps?: string;
  adversario?: string;
  fardamento_definido_id?: string;
  fardamento_nome?: string;
  tesoureiro_dia_id?: string;
  tesoureiro_nome?: string;
  valor_taxa_jogo: number; // ex: R$ 25.00 vaquinha arbitragem
  observacoes?: string;
  status_partida?: 'agendado' | 'em_vestiario' | 'em_aquecimento' | 'em_jogo' | 'finalizado';
}

export interface EventoPresenca {
  id: string;
  evento_id: string;
  atleta_id: string;
  status: StatusConfirmacao;
  respondido_em: string;
  atleta?: Atleta;
}

export interface EventoConvocacao {
  id: string;
  evento_id: string;
  atleta_id: string;
  eh_titular: boolean;
  posicao_escalada?: string;
  criado_em: string;
}

export interface EventoScout {
  id: string;
  evento_id: string;
  atleta_id: string;
  minutos_jogados: number;
  gols: number;
  assistencias: number;
  cartao_amarelo: number;
  cartao_vermelho: number;
  foi_mvp: boolean;
  gols_sofridos: number;
}

export interface EventoColetaDia {
  id: string;
  evento_id: string;
  atleta_id: string;
  valor_pago: number;
  pago: boolean;
  pago_em?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: NivelAcesso;
  avatar_url?: string;
  atleta?: {
    id: string;
    nome: string;
    apelido?: string;
    numero_camisa?: number;
    posicao_principal?: string;
  } | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// DTOs para o Painel Administrativo ROOT
export interface AdminUserDTO {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: NivelAcesso;
  avatar_url?: string | null;
  created_at?: string;
  atleta?: {
    id: string;
    nome: string;
    apelido?: string;
  } | null;
}

export interface AdminAtletaDTO {
  id: string;
  nome: string;
  apelido?: string | null;
  numero_camisa?: number | null;
  numero_calcado?: number | null;
  posicao_principal: string;
  posicao_secundaria?: string | null;
  tipo_vinculo?: string;
  ativo: boolean;
  user_id?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export interface AdminPartidaDTO {
  id: string;
  local_id?: string | null;
  adversario_id?: string | null;
  adversario: string;
  data_partida: string;
  horario_inicio: string;
  local_nome: string;
  local_endereco?: string | null;
  local_maps_url?: string | null;
  cor_uniforme?: string;
  limite_confirmados?: number;
  valor_cota_centavos?: number;
  meta_arrecadacao_centavos?: number;
  chave_pix_cobranca?: string | null;
  status: 'agendada' | 'em_andamento' | 'encerrada' | 'cancelada';
}

export interface Local {
  id: string;
  nome: string;
  endereco: string;
  maps_url?: string | null;
  tipo_piso: string;
  observacoes?: string | null;
  ativo: boolean;
  partidas_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type AdminLocalDTO = Local;

export interface Adversario {
  id: string;
  nome: string;
  responsavel_nome?: string | null;
  responsavel_telefone?: string | null;
  cor_uniforme_principal?: string | null;
  escudo_url?: string | null;
  observacoes?: string | null;
  ativo: boolean;
  partidas_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type AdminAdversarioDTO = Adversario;

export interface AdminCaixaMovimentacaoDTO {
  id: string;
  tipo: 'entrada' | 'saida';
  valor_centavos: number;
  descricao: string;
  data_movimentacao?: string;
  responsavel?: string;
}

export interface AdminCaixaResponseDTO {
  saldo_centavos: number;
  saldo_formatado: string;
  total_entradas_centavos: number;
  total_saidas_centavos: number;
  movimentacoes: AdminCaixaMovimentacaoDTO[];
}

export interface AdminPatrimonioDTO {
  id: string;
  nome: string;
  categoria: string;
  tipo_uniforme?: 'camisa' | 'meiao' | 'calcao' | string | null;
  quantidade_total: number;
  tamanho?: string | null;
  cor?: string | null;
  numero?: string | null;
  estado_conservacao: 'novo' | 'bom' | 'regular' | 'desgastado';
  observacoes?: string | null;
  ativo?: boolean;
}

export interface AdminScoutDTO {
  id: string;
  partida_id: string;
  atleta_id: string;
  gols: number;
  assistencias: number;
  cartoes_amarelos: number;
  cartoes_vermelhos: number;
  gols_sofridos_goleiro: number;
  minutos_jogados: number;
  foi_mvp: boolean;
  created_at?: string;
  updated_at?: string;
  atleta?: {
    id: string;
    nome: string;
    apelido?: string;
    numero_camisa?: number;
    posicao_principal?: string;
  };
  partida?: {
    id: string;
    adversario?: string;
    data_partida: string;
    local_nome?: string;
  };
}

export interface AdminScoutLeaderboardDTO {
  atleta_id: string;
  atleta_nome: string;
  atleta_apelido: string;
  numero_camisa?: number;
  posicao: string;
  jogos: number;
  gols: number;
  assistencias: number;
  participacoes_gols: number;
  cartoes_amarelos: number;
  cartoes_vermelhos: number;
  mvps: number;
  minutos: number;
  gols_sofridos: number;
}

// Tipos para Leads de Investidores & Parcerias Comerciais (Landing Page)
export type TipoInvestidor = 'anjo' | 'fundo_vc' | 'arena_liga' | 'outro';
export type TicketEstimado = 'ate_50k' | '50k_200k' | '200k_1m' | 'acima_1m' | 'parceria_comercial';

export interface InvestorLeadDTO {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  tipo_investidor: TipoInvestidor;
  ticket_estimado?: TicketEstimado | string;
  mensagem?: string;
  origem?: string;
  status?: string;
  created_at?: string;
}

export interface InvestorLeadResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    nome: string;
    tipo_investidor: TipoInvestidor;
    created_at: string;
  };
}
