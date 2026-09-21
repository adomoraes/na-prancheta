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
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('naprancheta_user');
      if (
        typeof window !== 'undefined' &&
        !endpoint.startsWith('/auth/login') &&
        !endpoint.startsWith('/auth/google') &&
        !endpoint.startsWith('/auth/dev-login')
      ) {
        window.dispatchEvent(
          new CustomEvent('auth:session-expired', {
            detail: { message: data.message || 'Sessão expirada. Faça login novamente.' },
          })
        );
      }
    }
    const errorMsg = data.message || `Erro ${response.status}: falha na comunicação com a API`;
    throw new Error(errorMsg);
  }

  return data as T;
}

import {
  User,
  AuthResponse,
  AdminUserDTO,
  AdminAtletaDTO,
  AdminPartidaDTO,
  AdminCaixaResponseDTO,
  AdminPatrimonioDTO,
  Local,
  AdminLocalDTO,
} from '../types';

export const api = {
  // 1. AUTENTICAÇÃO SANCTUM & GOOGLE GIS
  async login(phoneOrEmail: string, password: string = 'na-prancheta-2026'): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login: phoneOrEmail, password }),
    });
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    return data;
  },

  async loginGoogle(credential: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    return data;
  },

  async devLogin(role: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/auth/dev-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    return request<{ user: User }>('/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignora falha de rede ao deslogar
    } finally {
      localStorage.removeItem(TOKEN_KEY);
    }
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

  // 9. LOCAIS & CAMPOS (Leitura pública / consulta de agendamento)
  async getLocais(timeId?: string): Promise<Local[]> {
    const query = timeId ? `?time_id=${timeId}` : '';
    return request<Local[]>(`/locais${query}`);
  },

  // 10. PAINEL ADMINISTRATIVO ROOT (CRUDs Master)
  admin: {
    // 10.1 Usuários & Roles
    async getUsers(): Promise<AdminUserDTO[]> {
      return request<AdminUserDTO[]>('/admin/users');
    },

    async createUser(payload: {
      name: string;
      email: string;
      phone?: string;
      password: string;
      role: string;
    }) {
      return request<{ message: string; user: AdminUserDTO }>('/admin/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async updateUser(id: string, payload: {
      name?: string;
      email?: string;
      phone?: string;
      role?: string;
    }) {
      return request<{ message: string; user: AdminUserDTO }>(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },

    async resetUserPassword(id: string, password: string) {
      return request<{ message: string }>(`/admin/users/${id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ password }),
      });
    },

    async deleteUser(id: string) {
      return request<{ message: string }>(`/admin/users/${id}`, {
        method: 'DELETE',
      });
    },

    // 10.2 Atletas & Elenco
    async getAtletas(): Promise<AdminAtletaDTO[]> {
      return request<AdminAtletaDTO[]>('/admin/atletas');
    },

    async createAtleta(payload: {
      nome: string;
      apelido?: string;
      numero_camisa?: number;
      numero_calcado?: number;
      posicao_principal: string;
      posicao_secundaria?: string;
      tipo_vinculo?: string;
      user_id?: string;
    }) {
      return request<{ message: string; atleta: AdminAtletaDTO }>('/admin/atletas', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async updateAtleta(id: string, payload: Partial<AdminAtletaDTO>) {
      return request<{ message: string; atleta: AdminAtletaDTO }>(`/admin/atletas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },

    async toggleAtletaStatus(id: string, ativo?: boolean) {
      return request<{ message: string; atleta: AdminAtletaDTO }>(`/admin/atletas/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(ativo !== undefined ? { ativo } : {}),
      });
    },

    // 10.3 Partidas & Vestiário
    async getPartidas(): Promise<AdminPartidaDTO[]> {
      return request<AdminPartidaDTO[]>('/admin/partidas');
    },

    async createPartida(payload: {
      adversario: string;
      data_partida: string;
      horario_inicio: string;
      local_nome: string;
      local_endereco?: string;
      local_maps_url?: string;
      cor_uniforme?: string;
      limite_confirmados?: number;
      valor_cota_centavos?: number;
      meta_arrecadacao_centavos?: number;
      chave_pix_cobranca?: string;
    }) {
      return request<{ message: string; partida: AdminPartidaDTO }>('/admin/partidas', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async updatePartida(id: string, payload: Partial<AdminPartidaDTO>) {
      return request<{ message: string; partida: AdminPartidaDTO }>(`/admin/partidas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },

    async updatePartidaStatus(id: string, status: string) {
      return request<{ message: string; partida: AdminPartidaDTO }>(`/admin/partidas/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },

    // 10.4 Caixa Geral
    async getCaixa(): Promise<AdminCaixaResponseDTO> {
      return request<AdminCaixaResponseDTO>('/admin/caixa');
    },

    async createCaixa(payload: {
      tipo: 'entrada' | 'saida';
      valor_centavos: number;
      descricao: string;
      partida_id?: string;
    }) {
      return request<{ message: string; movimentacao: any }>('/admin/caixa', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    // 10.5 Patrimônio & Almoxarifado
    async getPatrimonio(): Promise<AdminPatrimonioDTO[]> {
      return request<AdminPatrimonioDTO[]>('/admin/patrimonio');
    },

    async createPatrimonio(payload: {
      nome: string;
      categoria: string;
      quantidade_total: number;
      estado_conservacao: string;
    }) {
      return request<{ message: string; item: AdminPatrimonioDTO }>('/admin/patrimonio', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async updatePatrimonio(id: string, payload: Partial<AdminPatrimonioDTO>) {
      return request<{ message: string; item: AdminPatrimonioDTO }>(`/admin/patrimonio/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },

    async deletePatrimonio(id: string) {
      return request<{ message: string }>(`/admin/patrimonio/${id}`, {
        method: 'DELETE',
      });
    },

    // 10.6 Locais & Campos
    async getLocais(): Promise<AdminLocalDTO[]> {
      return request<AdminLocalDTO[]>('/admin/locais');
    },

    async createLocal(payload: {
      nome: string;
      endereco?: string;
      maps_url?: string;
      tipo_piso?: string;
      observacoes?: string;
    }) {
      return request<{ message: string; local: AdminLocalDTO }>('/admin/locais', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async updateLocal(id: string, payload: Partial<AdminLocalDTO>) {
      return request<{ message: string; local: AdminLocalDTO }>(`/admin/locais/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },

    async toggleLocalStatus(id: string) {
      return request<{ message: string; local: AdminLocalDTO }>(`/admin/locais/${id}/status`, {
        method: 'PATCH',
      });
    },
  },
};

