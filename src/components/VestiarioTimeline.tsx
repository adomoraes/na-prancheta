import React, { useState, useEffect } from 'react';
import { Evento } from '../types';
import { Clock, AlertTriangle, CheckCircle2, ChevronRight, Activity, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface VestiarioTimelineProps {
  evento: Evento;
}

export const VestiarioTimeline: React.FC<VestiarioTimelineProps> = ({ evento }) => {
  const [selectedProtocolPhase, setSelectedProtocolPhase] = useState<number | null>(null);
  const [countdownMinutes, setCountdownMinutes] = useState(38); // Simulado em T-38 min (perto do marco crítico T-35)
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);

  // Efeito para contagem regressiva viva
  useEffect(() => {
    if (!isLiveSimulating) return;
    const interval = setInterval(() => {
      setCountdownMinutes((prev) => (prev > 0 ? prev - 1 : 0));
    }, 15000); // atualiza a cada 15s para efeito visual
    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Status atual de acordo com o countdown
  let currentMilestone = 'T-50';
  let badgeColor = 'bg-amber-500 text-white';
  if (countdownMinutes <= 25) {
    currentMilestone = 'T-25: Aquecimento em Campo';
    badgeColor = 'bg-emerald-600 text-white animate-pulse';
  } else if (countdownMinutes <= 35) {
    currentMilestone = 'T-35: Preleção & Escalação';
    badgeColor = 'bg-red-600 text-white animate-pulse';
  } else if (countdownMinutes <= 50) {
    currentMilestone = 'T-50: Vestiário Obrigatório';
    badgeColor = 'bg-amber-600 text-white';
  }

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-sm text-zinc-100 mb-6">
      {/* Header do Cronômetro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-zinc-100 uppercase tracking-wider">
              Protocolo Oficial de Vestiário (v2.0)
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cronograma estrito de preparação física, tática e disciplina do elenco
          </p>
        </div>

        {/* Live Countdown Badge */}
        <div className="flex items-center gap-2.5 bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Faltam para o jogo:</div>
            <div className="text-sm font-extrabold text-zinc-100 font-mono">
              T - {countdownMinutes} min
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${badgeColor}`}>
            {currentMilestone}
          </span>
        </div>
      </div>

      {/* Regra do Atraso Banner */}
      <div className="mt-4 bg-red-500/10 border border-red-500/25 rounded-xl p-3.5 flex items-start gap-3 text-red-200">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-red-300 uppercase tracking-wide mr-1.5">
            Regra Fundamental do Atraso:
          </span>
          Atleta que não estiver no vestiário com uniforme e calçado trocados até o marco de{' '}
          <strong className="underline text-zinc-100">T-35 min</strong> (início da preleção) iniciará
          a partida <strong className="text-zinc-100">compulsoriamente no banco de reservas</strong>,
          independentemente de ser titular habitual.
        </div>
      </div>

      {/* Linha do Tempo dos Marcos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
        {/* T-1h10 */}
        <div
          onClick={() => setSelectedProtocolPhase(selectedProtocolPhase === 1 ? null : 1)}
          className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
            countdownMinutes <= 70
              ? 'bg-zinc-800/80 border-zinc-700'
              : 'bg-zinc-950/50 border-zinc-800/80'
          } hover:border-zinc-700`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              T - 1h 10m
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xs font-bold text-zinc-100">Comissão & Malas</div>
          <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
            Chegada da comissão técnica e malas oficiais do time no vestiário.
          </p>
        </div>

        {/* T-50 */}
        <div
          onClick={() => setSelectedProtocolPhase(selectedProtocolPhase === 2 ? null : 2)}
          className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
            countdownMinutes <= 50
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-zinc-950/50 border-zinc-800/80'
          } hover:border-amber-500/50`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25">
              T - 50 min
            </span>
            <span className="text-[10px] text-amber-400 font-bold">OBRIGATÓRIO</span>
          </div>
          <div className="text-xs font-bold text-zinc-100">Chegada de Todos</div>
          <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
            Todos os atletas presentes para troca de roupa, caneleira e calçados.
          </p>
        </div>

        {/* T-35 */}
        <div
          onClick={() => setSelectedProtocolPhase(selectedProtocolPhase === 3 ? null : 3)}
          className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
            countdownMinutes <= 35
              ? 'bg-red-500/10 border-red-500/40 ring-1 ring-red-500/20'
              : 'bg-zinc-950/50 border-zinc-800/80'
          } hover:border-red-500/50`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30">
              T - 35 min
            </span>
            <Flame className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-xs font-bold text-zinc-100">Preleção & Escalação</div>
          <p className="text-[11px] text-red-200 mt-1 leading-snug">
            Revelação dos 11 titulares, orientações de bola parada e grito de guerra.
          </p>
        </div>

        {/* T-25 */}
        <div
          onClick={() => setSelectedProtocolPhase(selectedProtocolPhase === 4 ? null : 4)}
          className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
            countdownMinutes <= 25
              ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20'
              : 'bg-zinc-950/50 border-zinc-800/80'
          } hover:border-emerald-500/50`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
              T - 25 min
            </span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xs font-bold text-zinc-100">Aquecimento Fisiológico</div>
          <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
            Saída a campo com titulares e reservas em 4 etapas contra lesões.
          </p>
        </div>
      </div>

      {/* Sequência Fisiológica Detalhada do Aquecimento (T-25) */}
      <div className="mt-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
              Sequência Fisiológica de Campo (T-25 ao T-0)
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">Prevenção de estiramento</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800">
            <div className="text-emerald-400 font-bold text-[11px] mb-0.5">1. Ativação (5-8 min)</div>
            <div className="text-zinc-300 text-[11px]">Cones, escadinha e posse curta para elevação térmica.</div>
          </div>
          <div className="bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800">
            <div className="text-blue-400 font-bold text-[11px] mb-0.5">2. Mobilidade (5 min)</div>
            <div className="text-zinc-300 text-[11px]">Soltura de quadril, joelhos e tornozelos aquecidos.</div>
          </div>
          <div className="bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800">
            <div className="text-purple-400 font-bold text-[11px] mb-0.5">3. Dinâmica (8 min)</div>
            <div className="text-zinc-300 text-[11px]">Rondo / bobinho em espaço reduzido (limite 2 toques).</div>
          </div>
          <div className="bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800">
            <div className="text-amber-400 font-bold text-[11px] mb-0.5">4. Técnica (8 min)</div>
            <div className="text-zinc-300 text-[11px]">Finalizações e cruzamentos focados nos 11 titulares.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
