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
import { Header } from './components/Header';
import { VestiarioTimeline } from './components/VestiarioTimeline';
import { MatchCardConfirmacao } from './components/MatchCardConfirmacao';
import { TesoureiroColeta } from './components/TesoureiroColeta';
import { PranchetaTecnica } from './components/PranchetaTecnica';
import { ScoutPosJogo } from './components/ScoutPosJogo';
import { AlmoxarifadoView } from './components/AlmoxarifadoView';
import { SelfOnboardingModal } from './components/SelfOnboardingModal';
import { Calendar, Shield, DollarSign, Trophy, Package, Users } from 'lucide-react';

export default function App() {
  const [nivelAcesso, setNivelAcesso] = useState<NivelAcesso>('atleta');
  const [isTesoureiroDia, setIsTesoureiroDia] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'jogo' | 'tatica' | 'financeiro' | 'scout' | 'almoxarifado'>('jogo');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

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

  // Atleta logado atual (simulado como Lucão ou Thiaguinho se tesoureiro)
  const currentAtletaId = isTesoureiroDia ? 'atl-5' : 'atl-1';

  // Handlers
  const handleUpdatePresenca = (atletaId: string, status: StatusConfirmacao) => {
    setPresencas((prev) =>
      prev.map((p) =>
        p.atleta_id === atletaId
          ? { ...p, status, respondido_em: new Date().toISOString() }
          : p
      )
    );
  };

  const handleTogglePago = (atletaId: string) => {
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
  };

  const handleUpdateScout = (updated: EventoScout) => {
    setScoutList((prev) => {
      const idx = prev.findIndex((s) => s.atleta_id === updated.atleta_id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const handleAddAtleta = (novoAtleta: Atleta) => {
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
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Header com Papéis */}
      <Header
        nivelAcesso={nivelAcesso}
        setNivelAcesso={handleSetNivelAcesso}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        isTesoureiroDia={isTesoureiroDia}
        setIsTesoureiroDia={setIsTesoureiroDia}
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
          />
        )}

        {activeTab === 'financeiro' && (
          <TesoureiroColeta
            evento={evento}
            coletas={coletas}
            presencas={presencasComAtletas}
            onTogglePago={handleTogglePago}
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
          <AlmoxarifadoView itens={patrimonio} evento={evento} />
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
