import React, { useState, useEffect } from 'react';
import {
  NivelAcesso,
  Atleta,
  Evento,
  EventoPresenca,
  EventoColetaDia,
  EventoScout,
  PatrimonioItem,
  StatusConfirmacao,
} from './types';
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
import { AcessoRestrito } from './components/AcessoRestrito';
import { LoginModal } from './components/auth/LoginModal';
import { PwaPrompt } from './components/PwaPrompt';
import { usePwa } from './hooks/usePwa';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Calendar, Shield, DollarSign, Trophy, Package, Lock } from 'lucide-react';

function AppContent() {
  const pwaState = usePwa();
  const { user, activeRole, canAccessTab, isLoginModalOpen, closeLoginModal } = useAuth();

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

  // Redirecionamento inteligente ao alternar/autenticar com papel
  useEffect(() => {
    if (activeRole === 'tecnico') {
      setActiveTab('tatica');
    } else if (activeRole === 'financeiro') {
      setActiveTab('financeiro');
    } else if (activeRole === 'almoxarifado') {
      setActiveTab('almoxarifado');
    } else if (activeRole === 'atleta') {
      setActiveTab('jogo');
    }
  }, [activeRole]);

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

  // Atleta logado atual (vinculado ao usuário autenticado ou fallback)
  const currentAtletaId =
    user?.atleta?.id ||
    atletas.find((a) => a.nome === user?.name || a.apelido === user?.name)?.id ||
    (activeRole === 'financeiro' ? atletas[4]?.id : atletas[0]?.id) ||
    'atl-1';

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
          foi_mvp: updated.foi_mvp,
          minutos_jogados: updated.minutos_jogados,
          gols_sofridos_goleiro: updated.gols_sofridos,
        });
      }
    } catch (e) {
      console.error('Erro ao atualizar scout na API:', e);
    }
  };

  const handleAddAtleta = async (novo: Atleta) => {
    setAtletas((prev) => [...prev, novo]);

    setPresencas((prev) => [
      ...prev,
      {
        id: `pres-${Date.now()}`,
        evento_id: evento.id,
        atleta_id: novo.id,
        status: 'confirmado',
        respondido_em: new Date().toISOString(),
        eh_titular: false,
        criado_em: new Date().toISOString(),
        atleta: novo,
      },
    ]);

    setColetas((prev) => [
      ...prev,
      {
        id: `col-${Date.now()}`,
        evento_id: evento.id,
        atleta_id: novo.id,
        valor_pago: evento.valor_taxa_jogo,
        pago: false,
      },
    ]);

    setScoutList((prev) => [
      ...prev,
      {
        id: `scout-${Date.now()}`,
        evento_id: evento.id,
        atleta_id: novo.id,
        minutos_jogados: 0,
        gols: 0,
        assistencias: 0,
        cartao_amarelo: 0,
        cartao_vermelho: 0,
        foi_mvp: false,
        gols_sofridos: 0,
      },
    ]);

    try {
      if (apiConnected) {
        const backendAtleta = await api.createAtleta({
          nome: novo.nome,
          apelido: novo.apelido || novo.nome,
          numero_camisa: novo.numero_camisa || 99,
          posicao_principal: novo.posicao_principal,
          posicao_secundaria: novo.posicao_secundaria,
          tipo_vinculo: novo.tipo_vinculo,
        });

        await api.updatePresenca(evento.id, backendAtleta.id, 'confirmado');
      }
    } catch (e) {
      console.error('Erro ao persistir novo atleta na API:', e);
    }
  };

  const handleSalvarEscalacao = async (titulares: { atletaId: string; posicaoId: number }[]) => {
    const novosTitularesIds = titulares.map((t) => t.atletaId);
    setTitularesIds(novosTitularesIds);

    setPresencas((prev) =>
      prev.map((p) => {
        const tit = titulares.find((t) => t.atletaId === p.atleta_id);
        return {
          ...p,
          eh_titular: !!tit,
          posicao_escalada: tit ? `Posição ${tit.posicaoId}` : undefined,
        };
      })
    );

    if (apiConnected) {
      const payloadTitulares = titulares.map((t) => ({
        atleta_id: t.atletaId,
        posicao_campo_id: t.posicaoId,
      }));
      await api.salvarEscalacao(evento.id, payloadTitulares);
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
      setConferenciaMala({
        ...payload,
        custodiante_id: currentAtletaId,
        conferido_em: new Date().toISOString(),
        resenha_liberada: true,
      });
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
      {/* PWA Manager */}
      <PwaPrompt pwaState={pwaState} />

      {/* Header com Perfil Autenticado & RBAC */}
      <Header
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        apiConnected={apiConnected}
        canInstallPwa={pwaState.isInstallable && !pwaState.isInstalled}
        onInstallPwa={pwaState.promptInstall}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-24">
        {/* Protocolo Oficial de Vestiário (T-50, T-35, T-25) */}
        <VestiarioTimeline evento={evento} />

        {/* Abas Superiores Mobile & Desktop com Indicadores de Responsabilidade */}
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
            {!canAccessTab('tatica') && <Lock className="w-3 h-3 text-zinc-500" />}
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
            {!canAccessTab('financeiro') && <Lock className="w-3 h-3 text-zinc-500" />}
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
            {!canAccessTab('almoxarifado') && <Lock className="w-3 h-3 text-zinc-500" />}
          </button>
        </div>

        {/* Renderização Condicional com Proteção RBAC */}
        {activeTab === 'jogo' && (
          <MatchCardConfirmacao
            evento={evento}
            presencas={presencasComAtletas}
            onUpdatePresenca={handleUpdatePresenca}
            currentAtletaId={currentAtletaId}
          />
        )}

        {activeTab === 'tatica' &&
          (canAccessTab('tatica') ? (
            <PranchetaTecnica
              evento={evento}
              atletas={atletas}
              presencas={presencasComAtletas}
              titularesIds={titularesIds}
              onSaveEscalacao={handleSalvarEscalacao}
              apiConnected={apiConnected}
            />
          ) : (
            <AcessoRestrito
              moduloNome="Prancheta Tática 4-3-3"
              papelNecessario="Comissão Técnica ou Diretoria Geral"
              onGoBack={() => setActiveTab('jogo')}
            />
          ))}

        {activeTab === 'financeiro' &&
          (canAccessTab('financeiro') ? (
            <TesoureiroColeta
              evento={evento}
              coletas={coletas}
              presencas={presencasComAtletas}
              onTogglePago={handleTogglePago}
              onEncerrarVaquinha={handleEncerrarVaquinha}
            />
          ) : (
            <AcessoRestrito
              moduloNome="Tesoureiro do Dia & Vaquinha PIX"
              papelNecessario="Tesoureiro do Dia ou Diretoria Geral"
              onGoBack={() => setActiveTab('jogo')}
            />
          ))}

        {activeTab === 'scout' && (
          <ScoutPosJogo
            evento={evento}
            atletas={atletas}
            presencas={presencasComAtletas}
            scoutList={scoutList}
            onUpdateScout={handleUpdateScout}
          />
        )}

        {activeTab === 'almoxarifado' &&
          (canAccessTab('almoxarifado') ? (
            <AlmoxarifadoView
              itens={patrimonio}
              evento={evento}
              conferenciaInicial={conferenciaMala}
              onFecharMalas={handleFecharMalas}
            />
          ) : (
            <AcessoRestrito
              moduloNome="Almoxarifado & Trava da Resenha"
              papelNecessario="Almoxarifado ou Diretoria Geral"
              onGoBack={() => setActiveTab('jogo')}
            />
          ))}
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

      {/* Modal de Autenticação & Login Google */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
