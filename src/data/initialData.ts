import { Atleta, Evento, EventoPresenca, EventoColetaDia, EventoScout, PatrimonioItem } from '../types';

export const PATRIMONIO_INICIAL: PatrimonioItem[] = [
  {
    id: 'pat-1',
    nome: 'Mala 1 — Fardamento Principal (Branco com Faixa Diagonal)',
    categoria: 'fardamento',
    quantidade_total: 22,
    quantidade_disponivel: 22,
    estado_conservacao: 'bom',
    observacoes: 'Kit completo com 20 camisas de linha + 2 camisas de goleiro (Cinza).',
  },
  {
    id: 'pat-2',
    nome: 'Mala 2 — Fardamento Reserva (Azul Marinho)',
    categoria: 'fardamento',
    quantidade_total: 22,
    quantidade_disponivel: 22,
    estado_conservacao: 'novo',
    observacoes: 'Camisas e calções novos, goleiro Amarelo Fluorescente.',
  },
  {
    id: 'pat-3',
    nome: 'Bolsão de Bolas Oficiais (6 bolas Penalty Campo)',
    categoria: 'treino',
    quantidade_total: 6,
    quantidade_disponivel: 6,
    estado_conservacao: 'bom',
    observacoes: 'Calibradas em 11 psi.',
  },
  {
    id: 'pat-4',
    nome: 'Kit Aquecimento (Cones, Pratos e Escadinha de Agilidade)',
    categoria: 'treino',
    quantidade_total: 1,
    quantidade_disponivel: 1,
    estado_conservacao: 'bom',
    observacoes: 'Para sequência fisiológica T-25.',
  }
];

export const ATLETAS_INICIAIS: Atleta[] = [
  {
    id: 'atl-1',
    nome: 'Lucas Silva',
    apelido: 'Lucão',
    telefone: '(11) 98765-4321',
    posicao_principal: 'Goleiro',
    posicao_secundaria: 'Zagueiro',
    numero_camisa: 1,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'GG',
    tamanho_calcao: 'GG',
    ativo: true,
    criado_em: '2026-01-10T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-55 min (No Horário)'
  },
  {
    id: 'atl-2',
    nome: 'Rodrigo Medeiros',
    apelido: 'Digão',
    telefone: '(11) 97654-3210',
    posicao_principal: 'Zagueiro',
    posicao_secundaria: 'Volante',
    numero_camisa: 3,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'tecnico', // Faz parte da comissão técnica
    tamanho_camisa: 'G',
    tamanho_calcao: 'G',
    ativo: true,
    criado_em: '2026-01-10T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-65 min (Comissão)'
  },
  {
    id: 'atl-3',
    nome: 'Felipe Santos',
    apelido: 'Felipinho',
    telefone: '(11) 96543-2109',
    posicao_principal: 'Lateral Direito',
    posicao_secundaria: 'Meia Direita',
    numero_camisa: 2,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'M',
    tamanho_calcao: 'M',
    ativo: true,
    criado_em: '2026-01-12T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-52 min (No Horário)'
  },
  {
    id: 'atl-4',
    nome: 'Gabriel Costa',
    apelido: 'Biel',
    telefone: '(11) 95432-1098',
    posicao_principal: 'Zagueiro',
    posicao_secundaria: 'Lateral Esquerdo',
    numero_camisa: 4,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'G',
    tamanho_calcao: 'G',
    ativo: true,
    criado_em: '2026-01-12T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-51 min (No Horário)'
  },
  {
    id: 'atl-5',
    nome: 'Thiago Oliveira',
    apelido: 'Thiaguinho',
    telefone: '(11) 94321-0987',
    posicao_principal: 'Lateral Esquerdo',
    posicao_secundaria: 'Meia Esquerda',
    numero_camisa: 6,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'financeiro', // Tesoureiro do dia nesta rodada
    tamanho_camisa: 'M',
    tamanho_calcao: 'M',
    ativo: true,
    criado_em: '2026-01-12T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-60 min (No Horário)'
  },
  {
    id: 'atl-6',
    nome: 'Danilo Ramos',
    apelido: 'Danilão',
    telefone: '(11) 93210-9876',
    posicao_principal: 'Volante',
    posicao_secundaria: 'Zagueiro',
    numero_camisa: 5,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'G',
    tamanho_calcao: 'G',
    ativo: true,
    criado_em: '2026-01-14T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-54 min (No Horário)'
  },
  {
    id: 'atl-7',
    nome: 'Bruno Carvalho',
    apelido: 'Bruninho',
    telefone: '(11) 92109-8765',
    posicao_principal: 'Meio-Campo',
    posicao_secundaria: 'Volante',
    numero_camisa: 8,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'M',
    tamanho_calcao: 'M',
    ativo: true,
    criado_em: '2026-01-14T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-48 min (No Horário)'
  },
  {
    id: 'atl-8',
    nome: 'André Ribeiro',
    apelido: 'Deco',
    telefone: '(11) 91098-7654',
    posicao_principal: 'Meio-Campo',
    posicao_secundaria: 'Ponta Esquerda',
    numero_camisa: 10,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'G',
    tamanho_calcao: 'G',
    ativo: true,
    criado_em: '2026-01-15T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-50 min (No Horário)'
  },
  {
    id: 'atl-9',
    nome: 'Rafael Souza',
    apelido: 'Rafinha',
    telefone: '(11) 90987-6543',
    posicao_principal: 'Ponta Direita',
    posicao_secundaria: 'Centroavante',
    numero_camisa: 7,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'M',
    tamanho_calcao: 'M',
    ativo: true,
    criado_em: '2026-01-15T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-49 min (No Horário)'
  },
  {
    id: 'atl-10',
    nome: 'Matheus Lima',
    apelido: 'Theus',
    telefone: '(11) 99876-5432',
    posicao_principal: 'Centroavante',
    posicao_secundaria: 'Ponta Direita',
    numero_camisa: 9,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'G',
    tamanho_calcao: 'G',
    ativo: true,
    criado_em: '2026-01-16T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-53 min (No Horário)'
  },
  {
    id: 'atl-11',
    nome: 'Gustavo Martins',
    apelido: 'Guga',
    telefone: '(11) 98765-1122',
    posicao_principal: 'Ponta Esquerda',
    posicao_secundaria: 'Meio-Campo',
    numero_camisa: 11,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'M',
    tamanho_calcao: 'M',
    ativo: true,
    criado_em: '2026-01-16T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-50 min (No Horário)'
  },
  {
    id: 'atl-12',
    nome: 'Leonardo Prado',
    apelido: 'Léo',
    telefone: '(11) 97654-2233',
    posicao_principal: 'Atacante',
    posicao_secundaria: 'Ponta Direita',
    numero_camisa: 19,
    tipo_vinculo: 'convidado',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'G',
    tamanho_calcao: 'G',
    ativo: true,
    criado_em: '2026-02-01T10:00:00Z',
    chegou_vestiario: false, // Chegou atrasado após T-35!
    chegou_em: 'T-20 min (Atrasado - Banco Obrigatório)'
  },
  {
    id: 'atl-13',
    nome: 'Vinícius Rocha',
    apelido: 'Vini',
    telefone: '(11) 96543-3344',
    posicao_principal: 'Volante',
    posicao_secundaria: 'Lateral Direito',
    numero_camisa: 14,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'G',
    tamanho_calcao: 'G',
    ativo: true,
    criado_em: '2026-02-02T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-45 min (No Horário)'
  },
  {
    id: 'atl-14',
    nome: 'Carlos Eduardo',
    apelido: 'Kadu',
    telefone: '(11) 95432-4455',
    posicao_principal: 'Zagueiro',
    posicao_secundaria: 'Lateral Direito',
    numero_camisa: 13,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'almoxarifado', // Responsável pelas malas
    tamanho_camisa: 'GG',
    tamanho_calcao: 'G',
    ativo: true,
    criado_em: '2026-02-03T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-70 min (Malas Oficiais)'
  },
  {
    id: 'atl-15',
    nome: 'Marcelo Pires',
    apelido: 'Marcelinho',
    telefone: '(11) 94321-5566',
    posicao_principal: 'Goleiro',
    posicao_secundaria: '',
    numero_camisa: 12,
    tipo_vinculo: 'mensalista',
    nivel_acesso: 'atleta',
    tamanho_camisa: 'G',
    tamanho_calcao: 'G',
    ativo: true,
    criado_em: '2026-02-04T10:00:00Z',
    chegou_vestiario: true,
    chegou_em: 'T-47 min (No Horário)'
  }
];

// O evento principal do próximo jogo
// Partida daqui a 45 minutos para demonstrar o vestiário dinâmico em tempo real
const now = new Date();
const gameDate = new Date(now.getTime() + 45 * 60 * 1000); // Em 45 minutos
const t50 = new Date(gameDate.getTime() - 50 * 60 * 1000);
const t35 = new Date(gameDate.getTime() - 35 * 60 * 1000);
const t25 = new Date(gameDate.getTime() - 25 * 60 * 1000);

export const EVENTO_PRINCIPAL: Evento = {
  id: 'evt-001',
  titulo: 'Copa Regional dos Campeões — Rodada 4',
  tipo_evento: 'campeonato',
  data_hora: gameDate.toISOString(),
  horario_vestiario_t50: t50.toISOString(),
  horario_prelecao_t35: t35.toISOString(),
  horario_aquecimento_t25: t25.toISOString(),
  local_nome: 'Arena Soccer Ville — Campo 1 Oficial',
  local_link_gps: 'https://maps.google.com/?q=Arena+Soccer+Ville',
  adversario: 'União Alvinegra F.C.',
  fardamento_definido_id: 'pat-1',
  fardamento_nome: 'Kit 1 — Branco com Faixa Diagonal (Goleiro Cinza)',
  tesoureiro_dia_id: 'atl-5',
  tesoureiro_nome: 'Thiago Oliveira (Thiaguinho)',
  valor_taxa_jogo: 25.0, // R$ 25,00 por atleta
  observacoes: 'Jogo decisivo de classificação. Tolerância zero para atraso no vestiário (T-35). Uniformes devem ser entregues do lado certo na mala após o apito.',
  status_partida: 'em_vestiario'
};

export const PRESENCAS_INICIAIS: EventoPresenca[] = ATLETAS_INICIAIS.map((atleta, index) => {
  let status: 'confirmado' | 'recusado' | 'duvida' = 'confirmado';
  if (index === 11) status = 'confirmado'; // Leo vai mas atrasou
  if (index === 13) status = 'confirmado';
  if (index === 14) status = 'confirmado';

  return {
    id: `pres-${atleta.id}`,
    evento_id: EVENTO_PRINCIPAL.id,
    atleta_id: atleta.id,
    status,
    respondido_em: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
    atleta
  };
});

export const COLETAS_INICIAIS: EventoColetaDia[] = ATLETAS_INICIAIS.map((atleta, index) => ({
  id: `col-${atleta.id}`,
  evento_id: EVENTO_PRINCIPAL.id,
  atleta_id: atleta.id,
  valor_pago: 25.0,
  pago: index < 8, // Primeiros 8 já pagaram via Pix
  pago_em: index < 8 ? new Date().toISOString() : undefined
}));

export const SCOUT_INICIAL: EventoScout[] = [
  {
    id: 'scout-1',
    evento_id: EVENTO_PRINCIPAL.id,
    atleta_id: 'atl-10', // Matheus (Theus)
    minutos_jogados: 40,
    gols: 2,
    assistencias: 1,
    cartao_amarelo: 0,
    cartao_vermelho: 0,
    foi_mvp: true,
    gols_sofridos: 0
  },
  {
    id: 'scout-2',
    evento_id: EVENTO_PRINCIPAL.id,
    atleta_id: 'atl-8', // Deco
    minutos_jogados: 45,
    gols: 1,
    assistencias: 2,
    cartao_amarelo: 1,
    cartao_vermelho: 0,
    foi_mvp: false,
    gols_sofridos: 0
  },
  {
    id: 'scout-3',
    evento_id: EVENTO_PRINCIPAL.id,
    atleta_id: 'atl-9', // Rafinha
    minutos_jogados: 40,
    gols: 1,
    assistencias: 0,
    cartao_amarelo: 0,
    cartao_vermelho: 0,
    foi_mvp: false,
    gols_sofridos: 0
  },
  {
    id: 'scout-4',
    evento_id: EVENTO_PRINCIPAL.id,
    atleta_id: 'atl-1', // Lucão Goleiro
    minutos_jogados: 50,
    gols: 0,
    assistencias: 0,
    cartao_amarelo: 0,
    cartao_vermelho: 0,
    foi_mvp: false,
    gols_sofridos: 1
  }
];
