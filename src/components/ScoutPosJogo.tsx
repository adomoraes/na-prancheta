import React, { useState } from 'react';
import { Evento, EventoScout, Atleta, EventoPresenca } from '../types';
import { Trophy, Award, Plus, Minus, Check, Clock, ShieldCheck, Flame, Star, PackageCheck } from 'lucide-react';

interface ScoutPosJogoProps {
  evento: Evento;
  atletas: Atleta[];
  presencas: EventoPresenca[];
  scoutList: EventoScout[];
  onUpdateScout: (scout: EventoScout) => void;
}

export const ScoutPosJogo: React.FC<ScoutPosJogoProps> = ({
  evento,
  atletas,
  presencas,
  scoutList,
  onUpdateScout,
}) => {
  const [selectedAtletaId, setSelectedAtletaId] = useState<string>(atletas[9]?.id || atletas[0]?.id);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Apenas quem estava confirmado participa do scout
  const confirmadosIds = new Set(
    presencas.filter((p) => p.status === 'confirmado').map((p) => p.atleta_id)
  );
  const atletasParticipantes = atletas.filter((a) => confirmadosIds.has(a.id));

  const currentScout: EventoScout =
    scoutList.find((s) => s.atleta_id === selectedAtletaId) || {
      id: `scout-${selectedAtletaId}`,
      evento_id: evento.id,
      atleta_id: selectedAtletaId,
      minutos_jogados: 40,
      gols: 0,
      assistencias: 0,
      cartao_amarelo: 0,
      cartao_vermelho: 0,
      foi_mvp: false,
      gols_sofridos: 0,
    };

  const updateField = (field: keyof EventoScout, delta: number) => {
    const val = (currentScout[field] as number) + delta;
    if (val < 0) return;
    const updated = { ...currentScout, [field]: val };
    onUpdateScout(updated);
  };

  const toggleMvp = () => {
    // Apenas um MVP pode existir
    const updated = { ...currentScout, foi_mvp: !currentScout.foi_mvp };
    onUpdateScout(updated);
  };

  const selectedAtleta = atletas.find((a) => a.id === selectedAtletaId);

  // Métricas agregadas do jogo
  const totalGolsTime = scoutList.reduce((acc, s) => acc + s.gols, 0);
  const totalAssistenciasTime = scoutList.reduce((acc, s) => acc + s.assistencias, 0);
  const mvpAtleta = atletas.find(
    (a) => a.id === scoutList.find((s) => s.foi_mvp)?.atleta_id
  );

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-sm mb-6 text-zinc-100">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-wider">
              Scout Pós-Jogo Simplificado
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Lançamento expresso em menos de 2 minutos: gols, passes, cartões e Craque do Jogo (MVP)
          </p>
        </div>

        {/* Resumo do Placar */}
        <div className="flex items-center gap-3 bg-zinc-950/80 px-3.5 py-2 rounded-xl border border-zinc-800/80">
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Gols do Time</div>
            <div className="text-lg font-black text-emerald-400 font-mono">{totalGolsTime}</div>
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Assistências</div>
            <div className="text-lg font-black text-blue-400 font-mono">{totalAssistenciasTime}</div>
          </div>
          {mvpAtleta && (
            <>
              <div className="h-6 w-px bg-zinc-800" />
              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> MVP
                </div>
                <div className="text-xs font-bold text-zinc-100 truncate max-w-[80px]">
                  {mvpAtleta.apelido || mvpAtleta.nome}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Seletor Rápido de Atleta (Scroll Horizontal Mobile) */}
      <div className="my-4">
        <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
          1. Selecione o Atleta para Lançamento:
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {atletasParticipantes.map((atleta) => {
            const hasStats = scoutList.some(
              (s) => s.atleta_id === atleta.id && (s.gols > 0 || s.assistencias > 0 || s.foi_mvp)
            );
            const isSelected = atleta.id === selectedAtletaId;

            return (
              <button
                key={atleta.id}
                onClick={() => setSelectedAtletaId(atleta.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl border text-left transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-400 shadow-sm ring-2 ring-purple-400/20'
                    : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-950 text-zinc-100 font-bold text-xs flex items-center justify-center shrink-0 border border-zinc-800">
                  {atleta.numero_camisa || '•'}
                </div>
                <div>
                  <div className="text-xs font-bold truncate max-w-[100px]">
                    {atleta.apelido || atleta.nome}
                  </div>
                  <div className="text-[10px] opacity-80">{atleta.posicao_principal}</div>
                </div>
                {hasStats && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Possui scout lançado" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Painel de Contadores Rápidos do Atleta Selecionado */}
      {selectedAtleta && (
        <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/80 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                #{selectedAtleta.numero_camisa}
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <span>{selectedAtleta.nome}</span>
                  {selectedAtleta.apelido && (
                    <span className="text-xs text-purple-300">({selectedAtleta.apelido})</span>
                  )}
                </div>
                <div className="text-xs text-zinc-400">{selectedAtleta.posicao_principal}</div>
              </div>
            </div>

            {/* Toggle MVP */}
            <button
              onClick={toggleMvp}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-[0.98] ${
                currentScout.foi_mvp
                  ? 'bg-amber-500 text-zinc-950 shadow-sm font-black ring-2 ring-amber-300/50'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <Star className={`w-4 h-4 ${currentScout.foi_mvp ? 'fill-zinc-950' : ''}`} />
              <span>{currentScout.foi_mvp ? 'Eleito MVP do Jogo!' : 'Eleger Craque (MVP)'}</span>
            </button>
          </div>

          {/* Grid de Contadores Rápidos de Toque */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Gols */}
            <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-center">
              <div className="text-xs font-bold uppercase text-emerald-400 mb-1">Gols</div>
              <div className="text-2xl font-black text-zinc-100 font-mono my-1">
                {currentScout.gols}
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => updateField('gols', -1)}
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center justify-center transition active:scale-[0.98] border border-zinc-700/60"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateField('gols', 1)}
                  className="w-9 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition active:scale-[0.98] shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Assistências */}
            <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-center">
              <div className="text-xs font-bold uppercase text-blue-400 mb-1">Assistências</div>
              <div className="text-2xl font-black text-zinc-100 font-mono my-1">
                {currentScout.assistencias}
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => updateField('assistencias', -1)}
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center justify-center transition active:scale-[0.98] border border-zinc-700/60"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateField('assistencias', 1)}
                  className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center transition active:scale-[0.98] shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Minutos Jogados (Equilíbrio de minutagem em amistosos 30-40 min) */}
            <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-center">
              <div className="text-xs font-bold uppercase text-zinc-300 mb-1">Minutagem</div>
              <div className="text-2xl font-black text-zinc-100 font-mono my-1">
                {currentScout.minutos_jogados}&apos;
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => updateField('minutos_jogados', -5)}
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center justify-center transition active:scale-[0.98] text-xs border border-zinc-700/60"
                >
                  -5
                </button>
                <button
                  onClick={() => updateField('minutos_jogados', 5)}
                  className="w-9 h-9 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-bold flex items-center justify-center transition active:scale-[0.98] text-xs shadow-sm"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Cartões Amarelos */}
            <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-center">
              <div className="text-xs font-bold uppercase text-amber-400 mb-1">C. Amarelo</div>
              <div className="text-2xl font-black text-amber-400 font-mono my-1">
                {currentScout.cartao_amarelo}
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => updateField('cartao_amarelo', -1)}
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center justify-center transition active:scale-[0.98] border border-zinc-700/60"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateField('cartao_amarelo', 1)}
                  className="w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold flex items-center justify-center transition active:scale-[0.98] shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Protocolo de Pós-Jogo e Regras de Vestiário */}
      <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200">
        <div className="flex items-start gap-2.5">
          <PackageCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wide text-zinc-100 block">
              Protocolo Pós-Jogo Obrigatório:
            </span>
            Roda de 3 min sem discussões ríspidas • Uniformes entregues do lado correto na mala •
            Resenha liberada somente após fechamento das malas pelo almoxarifado.
          </div>
        </div>
        <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20 shrink-0 self-start sm:self-auto">
          Protocolo Ativo
        </span>
      </div>
    </div>
  );
};
