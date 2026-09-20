import React, { useState, useEffect } from 'react';
import { NivelAcesso, Atleta, Evento, EventoPresenca, EventoColetaDia, EventoScout, PatrimonioItem, StatusConfirmacao } from './types';
import {
  ATLETAS_INICIAIS,
  EVENTO_PRINCIPAL,
  PRESENCAS_INICIAIS,
  COLETAS_INICIAIS,
  SCOUT_INICIAL,
  PATRIMONIO_INICIAL,
} from './data/initialData';
import { api } from './services/api';
import { Header } from './components/Header';
import { VestiarioTimeline } from './components/VestiarioTimeline';
import { MatchCardConfirmacao } from './components/MatchCardConfirmacao';
import { TesoureiroColeta } from './components/TesoureiroColeta';
import { PranchetaTecnica } from './components/PranchetaTecnica';
import { ScoutPosJogo } from './components/ScoutPosJogo';
import { AlmoxarifadoView } from './components/AlmoxarifadoView';
import { SelfOnboardingModal } from './components/SelfOnboardingModal';
import { PwaPrompt } from './components/PwaPrompt';
import { usePwa } from './hooks/usePwa';
import { Calendar, Shield, DollarSign, Trophy, Package, Users } from 'lucide-react';

export default function App() {
  const pwaState = usePwa();
  const [nivelAcesso, setNivelAcesso] = useState<NivelAcesso>('atleta');
  const [isTesoureiroDia, setIsTesoureiroDia] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'jogo' | 'tatica' | 'financeiro' | 'scout' | 'almoxarifado'>('jogo');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<boolean>(false);

  // Estados persistentes em localStorage com fallback inicial
  const [atletas, setAtletas] = useState<Atleta[]>(() => {
    const saved = localStorage.getItem('naprancheta_atletas');
    return saved ? JSON.parse(saved) : ATLETAS_INICIAIS;
  });

  const [evento, setEvento] = useState<Evento>(() => {
    const saved = localStorage.getItem('naprancheta_evento');
    return saved ? JSON.parse(saved) : EVENTO_PRINCIPAL;
  });

  const [presencas, setPresencas] = useState<EventoPresenca[]>(() => {
    const saved = localStorage.getItem('naprancheta_presencas');
    return saved ? JSON.parse(saved) : PRESENCAS_INICIAIS;
  });

  const [coletas, setColetas] = useState<EventoColetaDia[]>(() => {
    const saved = localStorage.getItem('naprancheta_coletas');
    return saved ? JSON.parse(saved) : COLETAS_INICIAIS;
  });

  const [scoutList, setScoutList] = useState<EventoScout[]>(() => {
    const saved = localStorage.getItem('naprancheta_scout');
    return saved ? JSON.parse(saved) : SCOUT_INICIAL;
  });

  const [patrimonio] = useState<PatrimonioItem[]>(PATRIMONIO_INICIAL);
  const [titularesIds, setTitularesIds] = useState<string[]>([]);
  const [conferenciaMala, setConferenciaMala] = useState<any>(null);

  // Hidratação via API REST Laravel 11 com fallback gracioso
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const fullData = await api.fetchFullMatchData();
        if (!isMounted) return;
        setEvento(fullData.evento);
        if (fullData.atletas.length > 0) setAtletas(fullData.atletas);
        if (fullData.presencas.length > 0) setPresencas(fullData.presencas);
        if (fullData.coletas.length > 0) setColetas(fullData.coletas);
        if (fullData.scoutList.length > 0) setScoutList(fullData.scoutList);
        if (fullData.titularesIds && fullData.titularesIds.length > 0) {
          setTitularesIds(fullData.titularesIds);
        }
        if (fullData.conferencia) {
          setConferenciaMala(fullData.conferencia);
        }
        setApiConnected(true);
      } catch (err) {
        console.warn('API Laravel offline ou em contingência:', err);
        setApiConnected(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sincronizar presenças com objetos de atletas atualizados
  const presencasComAtletas = presencas.map((p) => ({
    ...p,
    atleta: atletas.find((a) => a.id === p.atleta_id) || p.atleta,
  }));

  // Salvar no localStorage sempre que houver mutação
  useEffect(() => {
    localStorage.setItem('naprancheta_atletas', JSON.stringify(atletas));
  }, [atletas]);

  useEffect(() => {
    localStorage.setItem('naprancheta_presencas', JSON.stringify(presencas));
  }, [presencas]);

  useEffect(() => {
    localStorage.setItem('naprancheta_coletas', JSON.stringify(coletas));
  }, [coletas]);

  useEffect(() => {
    localStorage.setItem('naprancheta_scout', JSON.stringify(scoutList));
  }, [scoutList]);

  // Ao mudar de perfil, direcionar intuitivamente para a aba correspondente
  const handleSetNivelAcesso = (nivel: NivelAcesso) => {
    setNivelAcesso(nivel);
    if (nivel === 'tecnico') {
      setActiveTab('tatica');
    } else if (nivel === 'financeiro') {
      setActiveTab('financeiro');
    } else if (nivel === 'almoxarifado') {
      setActiveTab('almoxarifado');
    } else {
      setActiveTab('jogo');
    }
  };

  // Atleta logado atual (determinado por apelido ou fallback seguro)
  const currentAtletaId = isTesoureiroDia
    ? (atletas.find((a) => a.apelido === 'Thiaguinho' || a.id === 'atl-5')?.id || atletas[4]?.id || 'atl-5')
    : (atletas.find((a) => a.apelido === 'Lucão' || a.id === 'atl-1')?.id || atletas[0]?.id || 'atl-1');

  // Handlers assíncronos com sincronização na API Laravel 11
  const handleUpdatePresenca = async (atletaId: string, status: StatusConfirmacao) => {
    setPresencas((prev) =>
      prev.map((p) =>
        p.atleta_id === atletaId
          ? { ...p, status, respondido_em: new Date().toISOString() }
          : p
      )
    );

    try {
      if (apiConnected) {
        let backendStatus: 'confirmado' | 'ausente' | 'duvida' = 'duvida';
        if (status === 'confirmado') backendStatus = 'confirmado';
        else if (status === 'recusado') backendStatus = 'ausente';

        const res = await api.updatePresenca(evento.id, atletaId, backendStatus);
        if (res.status_final === 'lista_espera') {
          setPresencas((prev) =>
            prev.map((p) =>
              p.atleta_id === atletaId ? { ...p, status: 'lista_espera' } : p
            )
          );
        }
      }
    } catch (e) {
      console.error('Erro ao atualizar presença na API:', e);
    }
  };

  const handleTogglePago = async (atletaId: string) => {
    setColetas((prev) =>
      prev.map((c) =>
        c.atleta_id === atletaId
          ? {
              ...c,
              pago: !c.pago,
              pago_em: !c.pago ? new Date().toISOString() : undefined,
            }
          : c
      )
    );

    try {
      if (apiConnected) {
        await api.registrarBaixaVaquinha(evento.id, atletaId);
      }
    } catch (e) {
      console.error('Erro ao registrar baixa na API:', e);
    }
  };

  const handleUpdateScout = async (updated: EventoScout) => {
    setScoutList((prev) => {
      const idx = prev.findIndex((s) => s.atleta_id === updated.atleta_id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated];
    });

    try {
      if (apiConnected) {
        await api.salvarScout(evento.id, updated.atleta_id, {
          gols: updated.gols,
          assistencias: updated.assistencias,
          cartoes_amarelos: updated.cartao_amarelo,
          cartoes_vermelhos: updated.cartao_vermelho,
          gols_sofridos_goleiro: updated.gols_sofridos,
          minutos_jogados: updated.minutos_jogados,
          foi_mvp: updated.foi_mvp,
        });
      }
    } catch (e) {
      console.error('Erro ao salvar scout na API:', e);
    }
  };

  const handleAddAtleta = async (novoAtleta: Atleta) => {
    setAtletas((prev) => [...prev, novoAtleta]);

    // Adiciona presença padrão
    setPresencas((prev) => [
      ...prev,
      {
        id: `pres-${novoAtleta.id}`,
        evento_id: evento.id,
        atleta_id: novoAtleta.id,
        status: 'confirmado',
        respondido_em: new Date().toISOString(),
        atleta: novoAtleta,
      },
    ]);

    // Adiciona coleta padrão
    setColetas((prev) => [
      ...prev,
      {
        id: `col-${novoAtleta.id}`,
        evento_id: evento.id,
        atleta_id: novoAtleta.id,
        valor_pago: evento.valor_taxa_jogo,
        pago: false,
      },
    ]);

    try {
      if (apiConnected) {
        await api.createAtleta({
          nome: novoAtleta.nome,
          apelido: novoAtleta.apelido || novoAtleta.nome.split(' ')[0],
          numero_camisa: novoAtleta.numero_camisa || Math.floor(Math.random() * 80 + 20),
          posicao_principal: novoAtleta.posicao_principal,
          posicao_secundaria: novoAtleta.posicao_secundaria,
          tipo_vinculo: novoAtleta.tipo_vinculo,
        });
      }
    } catch (e) {
      console.error('Erro ao cadastrar atleta na API:', e);
    }
  };

  const handleSalvarEscalacao = async (novosTitularesIds: string[]) => {
    setTitularesIds(novosTitularesIds);
    if (!apiConnected) return;

    const posMap: Record<string, number> = {
      GOL: 1,
      LAD: 2,
      ZAG: 3,
      LAE: 5,
      VOL: 6,
      MC: 7,
      MEI: 8,
      PTD: 9,
      CA: 10,
      PTE: 11,
    };

    const titularesPayload = novosTitularesIds.map((id, idx) => {
      const at = atletas.find((a) => a.id === id);
      const posId = at && posMap[at.posicao_principal] ? posMap[at.posicao_principal] : idx + 1;
      return {
        atleta_id: id,
        posicao_campo_id: posId,
      };
    });

    try {
      await api.salvarEscalacao(evento.id, titularesPayload);
    } catch (e) {
      console.error('Erro ao salvar escalação na API:', e);
      throw e;
    }
  };

  const handleFecharMalas = async (payload: {
    camisas_recolhidas: number;
    todas_camisas_desviradas: boolean;
    bolas_recolhidas: number;
    kit_cones_recolhido: boolean;
    mala_trancada_no_carro: boolean;
  }) => {
    if (!apiConnected) {
      return { resenha_liberada: true, message: 'Modo offline: conferência concluída' };
    }
    const res = await api.fecharMalas(evento.id, payload);
    if (res?.conferencia) {
      setConferenciaMala(res.conferencia);
    }
    return res;
  };

  const handleEncerrarVaquinha = async () => {
    if (!apiConnected) {
      return {
        message: 'Modo offline: taxa quitada',
        saldo_excedente_centavos: 2500,
        saldo_geral_equipe_centavos: 15000,
      };
    }
    return api.encerrarVaquinha(evento.id);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* PWA Manager (Toast de Atualizacao, Banner de Instalacao e Indicador Offline) */}
      <PwaPrompt pwaState={pwaState} />

      {/* Header com Papéis */}
      <Header
        nivelAcesso={nivelAcesso}
        setNivelAcesso={handleSetNivelAcesso}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        isTesoureiroDia={isTesoureiroDia}
        setIsTesoureiroDia={setIsTesoureiroDia}
        apiConnected={apiConnected}
        canInstallPwa={pwaState.isInstallable && !pwaState.isInstalled}
        onInstallPwa={pwaState.promptInstall}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-24">
        {/* Protocolo Oficial de Vestiário (T-50, T-35, T-25) - Sempre Visível como Coração do Clube */}
        <VestiarioTimeline evento={evento} />

        {/* Abas Superiores Mobile & Desktop */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-zinc-800/80">
          <button
            onClick={() => setActiveTab('jogo')}
            className={`min-h-[42px] px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
              activeTab === 'jogo'
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-zinc-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ficha & Presença</span>
          </button>

          <button
            onClick={() => setActiveTab('tatica')}
            className={`min-h-[42px] px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
              activeTab === 'tatica'
                ? 'bg-zinc-800 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-zinc-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Prancheta Tática (T-35)</span>
          </button>

          <button
            onClick={() => setActiveTab('financeiro')}
            className={`min-h-[42px] px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
              activeTab === 'financeiro'
                ? 'bg-zinc-800 text-amber-400 border border-amber-500/30 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-zinc-800/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>Tesoureiro do Dia</span>
          </button>

          <button
            onClick={() => setActiveTab('scout')}
            className={`min-h-[42px] px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
              activeTab === 'scout'
                ? 'bg-zinc-800 text-purple-400 border border-purple-500/30 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-zinc-800/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
            <span>Scout Pós-Jogo</span>
          </button>

          <button
            onClick={() => setActiveTab('almoxarifado')}
            className={`min-h-[42px] px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
              activeTab === 'almoxarifado'
                ? 'bg-zinc-800 text-pink-400 border border-pink-500/30 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-zinc-800/60'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-pink-400" />
            <span>Almoxarifado & Malas</span>
          </button>
        </div>

        {/* Renderização Condicional da Aba Ativa */}
        {activeTab === 'jogo' && (
          <MatchCardConfirmacao
            evento={evento}
            presencas={presencasComAtletas}
            onUpdatePresenca={handleUpdatePresenca}
            currentAtletaId={currentAtletaId}
          />
        )}

        {activeTab === 'tatica' && (
          <PranchetaTecnica
            evento={evento}
            atletas={atletas}
            presencas={presencasComAtletas}
            titularesIds={titularesIds}
            onSaveEscalacao={handleSalvarEscalacao}
            apiConnected={apiConnected}
          />
        )}

        {activeTab === 'financeiro' && (
          <TesoureiroColeta
            evento={evento}
            coletas={coletas}
            presencas={presencasComAtletas}
            onTogglePago={handleTogglePago}
            onEncerrarVaquinha={handleEncerrarVaquinha}
          />
        )}

        {activeTab === 'scout' && (
          <ScoutPosJogo
            evento={evento}
            atletas={atletas}
            presencas={presencasComAtletas}
            scoutList={scoutList}
            onUpdateScout={handleUpdateScout}
          />
        )}

        {activeTab === 'almoxarifado' && (
          <AlmoxarifadoView
            itens={patrimonio}
            evento={evento}
            conferenciaInicial={conferenciaMala}
            onFecharMalas={handleFecharMalas}
          />
        )}
      </main>

      {/* Barra de Navegação Inferior Fixa Mobile (PWA Feel) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800/80 px-2 py-1.5 flex justify-around items-center">
        <button
          onClick={() => setActiveTab('jogo')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'jogo' ? 'text-emerald-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span>Jogo</span>
        </button>

        <button
          onClick={() => setActiveTab('tatica')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'tatica' ? 'text-blue-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <Shield className="w-5 h-5 mb-0.5" />
          <span>Prancheta</span>
        </button>

        <button
          onClick={() => setActiveTab('financeiro')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'financeiro' ? 'text-amber-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <DollarSign className="w-5 h-5 mb-0.5" />
          <span>Vaquinha</span>
        </button>

        <button
          onClick={() => setActiveTab('scout')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'scout' ? 'text-purple-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <Trophy className="w-5 h-5 mb-0.5" />
          <span>Scout</span>
        </button>

        <button
          onClick={() => setActiveTab('almoxarifado')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition ${
            activeTab === 'almoxarifado' ? 'text-pink-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span>Malas</span>
        </button>
      </nav>

      {/* Modal de Self-Onboarding do Atleta */}
      <SelfOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onAddAtleta={handleAddAtleta}
      />
    </div>
  );
}
