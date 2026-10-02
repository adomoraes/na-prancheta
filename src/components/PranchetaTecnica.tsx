import React, { useState, useEffect } from 'react';
import { Evento, Atleta, EventoPresenca } from '../types';
import { Shield, AlertTriangle, Users, Share2, Sparkles, Check, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react';

interface PranchetaTecnicaProps {
  evento: Evento;
  atletas: Atleta[];
  presencas: EventoPresenca[];
  titularesIds?: string[];
  onSaveEscalacao?: (titularesIds: string[]) => Promise<void>;
  apiConnected?: boolean;
}

export const PranchetaTecnica: React.FC<PranchetaTecnicaProps> = ({
  evento,
  atletas,
  presencas,
  titularesIds: initialTitularesIds,
  onSaveEscalacao,
  apiConnected = true,
}) => {
  // Confirmados
  const confirmadosIds = new Set(
    presencas.filter((p) => p.status === 'confirmado').map((p) => p.atleta_id)
  );
  const atletasConfirmados = atletas.filter((a) => confirmadosIds.has(a.id));

  // Titulares padrão (primeiros 11 que não estão atrasados ou vindos da API)
  const [titularesIds, setTitularesIds] = useState<string[]>(() => {
    if (initialTitularesIds && initialTitularesIds.length > 0) return initialTitularesIds;
    return atletasConfirmados
      .filter((a) => !a.chegou_em?.includes('Atrasado'))
      .slice(0, 11)
      .map((a) => a.id);
  });

  useEffect(() => {
    if (initialTitularesIds && initialTitularesIds.length > 0) {
      setTitularesIds(initialTitularesIds);
    }
  }, [initialTitularesIds]);

  const [notifiedPrelecao, setNotifiedPrelecao] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleTitular = async (atleta: Atleta) => {
    // Verificar regra do atraso!
    if (atleta.chegou_em?.includes('Atrasado')) {
      alert(
        `Regra do Vestiário (T-35): ${atleta.apelido || atleta.nome} chegou após o horário obrigatório de troca. Por protocolo oficial do clube, o atleta deve iniciar a partida compulsoriamente no banco de reservas.`
      );
      return;
    }

    let nextIds: string[];
    if (titularesIds.includes(atleta.id)) {
      nextIds = titularesIds.filter((id) => id !== atleta.id);
    } else {
      if (titularesIds.length >= 11) {
        alert('Limite de 11 titulares atingido. Remova um titular antes de adicionar outro.');
        return;
      }
      nextIds = [...titularesIds, atleta.id];
    }
    setTitularesIds(nextIds);
    if (onSaveEscalacao) {
      onSaveEscalacao(nextIds).catch((err) => console.warn('Sync escalação background:', err));
    }
  };

  const titulares = atletasConfirmados.filter((a) => titularesIds.includes(a.id));
  const reservas = atletasConfirmados.filter((a) => !titularesIds.includes(a.id));

  const handleDivulgar = async () => {
    try {
      setIsSaving(true);
      if (onSaveEscalacao) {
        await onSaveEscalacao(titularesIds);
      }
      setNotifiedPrelecao(true);
      setTimeout(() => setNotifiedPrelecao(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Erro ao sincronizar escalação na API');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-sm mb-6 text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Shield className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-wider">
              Prancheta Tática — Comissão Técnica
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Escalação oficial revelada na preleção de T-35 min no vestiário
          </p>
        </div>

        <button
          onClick={handleDivulgar}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sincronizando com API...</span>
            </>
          ) : notifiedPrelecao ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Escalação Liberada no Vestiário!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Liberar Escalação (T-35)</span>
            </>
          )}
        </button>
      </div>

      {/* Regra do Atraso Aviso Tático */}
      <div className="my-4 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-zinc-200">Formação Tática 4-3-3</span>
          <span className="text-zinc-400">({titulares.length}/11 Titulares definidos)</span>
        </div>
        <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          Trava de Atraso Ativa (T-35)
        </span>
      </div>

      {/* Visualização de Campo Sintético / Gramado Adaptativo Vertical */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-2 sm:p-5 border border-zinc-800 shadow-inner overflow-hidden mb-5 select-none">
        {/* Linhas do Campo */}
        <div className="absolute inset-2 border border-white/15 rounded-xl pointer-events-none" />
        <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-white/15 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-24 h-20 sm:h-24 border border-white/15 rounded-full pointer-events-none" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-36 sm:w-44 h-14 sm:h-16 border-b border-x border-white/15 rounded-b pointer-events-none" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 sm:w-44 h-14 sm:h-16 border-t border-x border-white/15 rounded-t pointer-events-none" />

        {/* Posicionamento dos Atletas no Campo - Proporcional e Fluido */}
        <div className="relative z-10 flex flex-col justify-between min-h-[440px] sm:min-h-[480px] py-3">
          {/* Ataque (Pontas e Centroavante) */}
          <div className="flex justify-around items-center px-1 sm:px-4">
            {titulares.slice(8, 11).map((atleta) => (
              <div
                key={atleta.id}
                onClick={() => toggleTitular(atleta)}
                className="group cursor-pointer flex flex-col items-center transition transform active:scale-95 touch-target p-1"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-900 border-2 border-emerald-500/80 text-zinc-100 font-black text-xs flex items-center justify-center shadow-md group-hover:border-white">
                  {atleta.numero_camisa}
                </div>
                <span className="text-[10px] font-bold text-zinc-200 bg-zinc-900/90 border border-zinc-800 px-1.5 py-0.5 rounded mt-1 shadow truncate max-w-[65px] sm:max-w-[85px] text-center">
                  {atleta.apelido || atleta.nome}
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold">{atleta.posicao_principal}</span>
              </div>
            ))}
          </div>

          {/* Meio-Campo (3 meias) */}
          <div className="flex justify-around items-center px-2 sm:px-6">
            {titulares.slice(5, 8).map((atleta) => (
              <div
                key={atleta.id}
                onClick={() => toggleTitular(atleta)}
                className="group cursor-pointer flex flex-col items-center transition transform active:scale-95 touch-target p-1"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-900 border-2 border-blue-500/80 text-zinc-100 font-black text-xs flex items-center justify-center shadow-md group-hover:border-white">
                  {atleta.numero_camisa}
                </div>
                <span className="text-[10px] font-bold text-zinc-200 bg-zinc-900/90 border border-zinc-800 px-1.5 py-0.5 rounded mt-1 shadow truncate max-w-[65px] sm:max-w-[85px] text-center">
                  {atleta.apelido || atleta.nome}
                </span>
                <span className="text-[9px] text-blue-400 font-semibold">{atleta.posicao_principal}</span>
              </div>
            ))}
          </div>

          {/* Defesa (4 defensores) */}
          <div className="flex justify-between items-center px-1 sm:px-3">
            {titulares.slice(1, 5).map((atleta) => (
              <div
                key={atleta.id}
                onClick={() => toggleTitular(atleta)}
                className="group cursor-pointer flex flex-col items-center transition transform active:scale-95 touch-target p-0.5"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900 border-2 border-amber-500/80 text-zinc-100 font-black text-xs flex items-center justify-center shadow-md group-hover:border-white">
                  {atleta.numero_camisa}
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-zinc-200 bg-zinc-900/90 border border-zinc-800 px-1 py-0.5 rounded mt-1 shadow truncate max-w-[55px] sm:max-w-[75px] text-center">
                  {atleta.apelido || atleta.nome}
                </span>
                <span className="text-[8px] sm:text-[9px] text-amber-400 font-semibold">{atleta.posicao_principal}</span>
              </div>
            ))}
          </div>

          {/* Goleiro */}
          <div className="flex justify-center items-center">
            {titulares.slice(0, 1).map((atleta) => (
              <div
                key={atleta.id}
                onClick={() => toggleTitular(atleta)}
                className="group cursor-pointer flex flex-col items-center transition transform active:scale-95 touch-target p-1"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-900 border-2 border-purple-500/80 text-zinc-100 font-black text-xs flex items-center justify-center shadow-md group-hover:border-white">
                  {atleta.numero_camisa}
                </div>
                <span className="text-[10px] font-bold text-zinc-200 bg-zinc-900/90 border border-zinc-800 px-1.5 py-0.5 rounded mt-1 shadow truncate max-w-[75px] sm:max-w-[90px] text-center">
                  {atleta.apelido || atleta.nome}
                </span>
                <span className="text-[9px] text-purple-400 font-semibold">Goleiro Titular</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banco de Reservas & Regra de Atraso */}
      <div className="bg-zinc-950/80 p-3 sm:p-4 rounded-xl border border-zinc-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-zinc-400" />
            <span>Banco de Reservas ({reservas.length} atletas)</span>
          </div>
          <span className="text-[11px] text-zinc-400 hidden sm:inline">Toque para promover a titular</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {reservas.map((atleta) => {
            const isLate = atleta.chegou_em?.includes('Atrasado');

            return (
              <div
                key={atleta.id}
                onClick={() => toggleTitular(atleta)}
                className={`min-h-[48px] p-2.5 rounded-xl border cursor-pointer transition active:scale-[0.98] flex items-center justify-between ${
                  isLate
                    ? 'bg-rose-950/20 border-rose-900/40 text-rose-300 hover:bg-rose-950/30'
                    : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {atleta.numero_camisa || '-'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate leading-tight">
                      {atleta.apelido || atleta.nome}
                    </p>
                    <p className="text-[10px] text-zinc-400">{atleta.posicao_principal}</p>
                  </div>
                </div>
                {isLate && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                    Atrasado
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

