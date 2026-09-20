/**
 * Cliente de API REST do Na Prancheta
 * Conecta o frontend React 19 desacoplado ao backend Laravel 11
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'na_prancheta_token';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...((options.headers as Record<string, string>) || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || `Erro ${response.status}: falha na comunicação com a API`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // 1. AUTENTICAÇÃO SANCTUM
  async login(phone: string, password: string = 'na-prancheta-2026') {
    const data = await request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    return data;
  },

  async getMe() {
    return request<{ user: any }>('/auth/me');
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // 2. ELENCO & ATLETAS
  async getAtletas(timeId?: string) {
    const query = timeId ? `?time_id=${timeId}` : '';
    return request<any[]>(`/atletas${query}`);
  },

  async createAtleta(payload: {
    nome: string;
    apelido: string;
    numero_camisa: number;
    posicao_principal: string;
    posicao_secundaria?: string;
    tipo_vinculo?: string;
  }) {
    return request<any>('/atletas', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // 3. PARTIDAS & VESTIÁRIO
  async getPartida(partidaId: string = '33333333-3333-3333-3333-333333333333') {
    return request<{ partida: any; metricas: any }>(`/partidas/${partidaId}`);
  },

  async getProtocoloVestiario(partidaId: string = '33333333-3333-3333-3333-333333333333', mockTime?: string) {
    const query = mockTime ? `?mock_time=${encodeURIComponent(mockTime)}` : '';
    return request<any>(`/partidas/${partidaId}/protocolo-vestiario${query}`);
  },

  // 4. CONFIRMAÇÃO DE PRESENÇA
  async updatePresenca(
    partidaId: string = '33333333-3333-3333-3333-333333333333',
    atletaId: string,
    status: 'confirmado' | 'ausente' | 'duvida',
    chegouAposT35?: boolean
  ) {
    return request<{ message: string; presenca: any; status_final: string }>(
      `/partidas/${partidaId}/presencas`,
      {
        method: 'POST',
        body: JSON.stringify({ atleta_id: atletaId, status, chegou_apos_t35: chegouAposT35 }),
      }
    );
  },

  // 5. ESCALAÇÃO TÁTICA
  async getEscalacao(partidaId: string = '33333333-3333-3333-3333-333333333333') {
    return request<any>(`/partidas/${partidaId}/escalacao`);
  },

  async salvarEscalacao(
    partidaId: string = '33333333-3333-3333-3333-333333333333',
    titulares: { atleta_id: string; posicao_campo_id: number }[]
  ) {
    return request<any>(`/partidas/${partidaId}/escalacao`, {
      method: 'POST',
      body: JSON.stringify({ titulares }),
    });
  },

  // 6. VAQUINHA & PIX
  async getVaquinha(partidaId: string = '33333333-3333-3333-3333-333333333333') {
    return request<any>(`/partidas/${partidaId}/vaquinha`);
  },

  async registrarBaixaVaquinha(
    partidaId: string = '33333333-3333-3333-3333-333333333333',
    atletaId: string
  ) {
    return request<any>(`/partidas/${partidaId}/vaquinha/${atletaId}/baixa`, {
      method: 'POST',
    });
  },

  async encerrarVaquinha(partidaId: string = '33333333-3333-3333-3333-333333333333') {
    return request<any>(`/partidas/${partidaId}/vaquinha/encerrar`, {
      method: 'POST',
    });
  },

  // 7. ALMOXARIFADO & RESENHA
  async getAlmoxarifado(partidaId: string = '33333333-3333-3333-3333-333333333333') {
    return request<any>(`/partidas/${partidaId}/almoxarifado`);
  },

  async fecharMalas(
    partidaId: string = '33333333-3333-3333-3333-333333333333',
    payload: {
      camisas_recolhidas: number;
      todas_camisas_desviradas: boolean;
      bolas_recolhidas: number;
      kit_cones_recolhido: boolean;
      mala_trancada_no_carro: boolean;
    }
  ) {
    return request<any>(`/partidas/${partidaId}/almoxarifado/fechar-malas`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // 8. SCOUT & MVP
  async getScouts(partidaId: string = '33333333-3333-3333-3333-333333333333') {
    return request<any>(`/partidas/${partidaId}/scouts`);
  },

  async salvarScout(
    partidaId: string = '33333333-3333-3333-3333-333333333333',
    atletaId: string,
    scout: {
      gols?: number;
      assistencias?: number;
      cartoes_amarelos?: number;
      cartoes_vermelhos?: number;
      gols_sofridos_goleiro?: number;
      minutos_jogados?: number;
      foi_mvp?: boolean;
    }
  ) {
    return request<any>(`/partidas/${partidaId}/scouts/${atletaId}`, {
      method: 'POST',
      body: JSON.stringify(scout),
    });
  },

  // 9. SINCRONIZAÇÃO COMPLETA & ADAPTADORES DE TIPOS
  async fetchFullMatchData(partidaId: string = '33333333-3333-3333-3333-333333333333') {
    const data = await this.getPartida(partidaId);
    const p = data.partida;

    // Adaptar Atletas
    const confirmacoesRaw = p.confirmacoes || p.presencas || [];
    const atletas = confirmacoesRaw.map((pres: any) => {
      const a = pres.atleta;
      return {
        id: a.id,
        nome: a.nome,
        apelido: a.apelido || a.nome.split(' ')[0],
        telefone: a.user?.phone || '11999999999',
        posicao_principal: a.posicao_principal,
        posicao_secundaria: a.posicao_secundaria || undefined,
        numero_camisa: a.numero_camisa,
        tipo_vinculo: a.tipo_vinculo as 'mensalista' | 'convidado' | 'inativo',
        nivel_acesso: 'atleta' as const,
        tamanho_camisa: 'G',
        tamanho_calcao: 'G',
        ativo: a.ativo,
        criado_em: a.created_at || new Date().toISOString(),
        chegou_vestiario: !!pres.chegou_vestiario,
        chegou_em: pres.chegou_em || undefined,
      };
    });

    // Adaptar Presenças
    const presencas = confirmacoesRaw.map((pres: any) => {
      let statusFront: 'confirmado' | 'recusado' | 'duvida' | 'lista_espera' = 'duvida';
      if (pres.status === 'confirmado') statusFront = 'confirmado';
      else if (pres.status === 'ausente') statusFront = 'recusado';
      else if (pres.status === 'lista_espera') statusFront = 'lista_espera';
      else statusFront = 'duvida';

      return {
        id: pres.id,
        evento_id: pres.partida_id,
        atleta_id: pres.atleta_id,
        status: statusFront,
        respondido_em: pres.respondido_em || new Date().toISOString(),
      };
    });

    // Adaptar Coletas (Vaquinha)
    const vaquinhasRaw = p.vaquinhas || p.vaquinha_lancamentos || [];
    const coletas = vaquinhasRaw.map((v: any) => ({
      id: v.id,
      evento_id: v.partida_id,
      atleta_id: v.atleta_id,
      valor_pago: (v.valor_devido_centavos || 2500) / 100,
      pago: v.status === 'pago',
      pago_em: v.pago_em || undefined,
    }));

    // Adaptar Scouts
    const scoutList = (p.scouts || []).map((s: any) => ({
      id: s.id,
      evento_id: s.partida_id,
      atleta_id: s.atleta_id,
      minutos_jogados: s.minutos_jogados || 0,
      gols: s.gols || 0,
      assistencias: s.assistencias || 0,
      cartao_amarelo: s.cartoes_amarelos || 0,
      cartao_vermelho: s.cartoes_vermelhos || 0,
      foi_mvp: !!s.foi_mvp,
      gols_sofridos: s.gols_sofridos_goleiro || 0,
    }));

    // Adaptar Evento / Partida
    const evento = {
      id: p.id,
      titulo: `vs ${p.adversario || 'Adversário'}`,
      tipo_evento: (p.tipo_partida || 'amistoso') as 'amistoso' | 'campeonato' | 'treino' | 'evento_social',
      data_hora: p.data_hora,
      horario_vestiario_t50: p.horario_vestiario_t50,
      horario_prelecao_t35: p.horario_prelecao_t35,
      horario_aquecimento_t25: p.horario_aquecimento_t25,
      local_nome: p.local_nome,
      local_link_gps: p.local_link_gps,
      adversario: p.adversario,
      valor_taxa_jogo: (p.taxa_arbitragem_centavos || 2500) / 100,
      status_partida: p.status as 'agendado' | 'em_vestiario' | 'em_aquecimento' | 'em_jogo' | 'finalizado',
    };

    // Adaptar Titulares
    const titularesRaw = p.titulares || [];
    const titularesIds = titularesRaw.map((t: any) => t.atleta_id);

    return {
      evento,
      atletas,
      presencas,
      coletas,
      scoutList,
      titularesIds,
      metricas: data.metricas,
      conferencia: p.conferencia_mala,
    };
  },
};

