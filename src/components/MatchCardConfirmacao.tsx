import React, { useState } from 'react';
import { Evento, EventoPresenca, Atleta, StatusConfirmacao } from '../types';
import { MapPin, Shirt, Calendar, DollarSign, UserCheck, Check, X, HelpCircle, Shield, AlertCircle } from 'lucide-react';

interface MatchCardConfirmacaoProps {
  evento: Evento;
  presencas: EventoPresenca[];
  onUpdatePresenca: (atletaId: string, status: StatusConfirmacao) => void;
  currentAtletaId: string;
}

export const MatchCardConfirmacao: React.FC<MatchCardConfirmacaoProps> = ({
  evento,
  presencas,
  onUpdatePresenca,
  currentAtletaId,
}) => {
  const [filter, setFilter] = useState<'todos' | 'confirmado' | 'duvida'>('todos');

  const minhaPresenca = presencas.find((p) => p.atleta_id === currentAtletaId);
  const statusAtual = minhaPresenca?.status || 'duvida';

  const confirmadosCount = presencas.filter((p) => p.status === 'confirmado').length;
  const duvidasCount = presencas.filter((p) => p.status === 'duvida').length;
  const recusadosCount = presencas.filter((p) => p.status === 'recusado').length;

  const dataFormatada = new Date(evento.data_hora).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  const horaFormatada = new Date(evento.data_hora).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const filteredPresencas = presencas.filter((p) => {
    if (filter === 'confirmado') return p.status === 'confirmado';
    if (filter === 'duvida') return p.status === 'duvida';
    return true;
  });

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm mb-6 text-zinc-100">
      {/* Banner Principal do Jogo */}
      <div className="bg-gradient-to-r from-emerald-950/30 via-zinc-900 to-zinc-900 p-4 sm:p-6 border-b border-zinc-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {evento.tipo_evento.toUpperCase()}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="capitalize">{dataFormatada}</span> às{' '}
            <span className="text-zinc-100 font-bold">{horaFormatada}</span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-zinc-100 font-['Cabinet_Grotesk',sans-serif] tracking-tight">
          {evento.titulo}
        </h2>

        <div className="flex items-center gap-2 mt-1 text-emerald-400 font-semibold text-sm">
          <span>vs</span>
          <span className="text-zinc-100 font-bold">{evento.adversario || 'A definir'}</span>
        </div>

        {/* Local e GPS */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
          <div className="flex items-start gap-2 text-xs text-zinc-300">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-100">{evento.local_nome}</div>
              <div className="text-[11px] text-zinc-400">Chegada ao vestiário: T-50 min</div>
            </div>
          </div>

          {evento.local_link_gps && (
            <a
              href={evento.local_link_gps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-xs font-semibold text-emerald-400 border border-zinc-700/80 transition active:scale-[0.98]"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Abrir no Google Maps</span>
            </a>
          )}
        </div>

        {/* Informações de Vestiário & Uniforme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center gap-2.5 bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80">
            <Shirt className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Kit de Uniforme</div>
              <div className="font-semibold text-zinc-100 truncate">
                {evento.fardamento_nome || 'Branco Oficial'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80">
            <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs">
              <div className="text-[10px] uppercase font-bold text-zinc-400">
                Tesoureiro & Vaquinha
              </div>
              <div className="font-semibold text-zinc-100">
                R$ {evento.valor_taxa_jogo.toFixed(2)} • {evento.tesoureiro_nome?.split(' ')[0]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Confirmação de Presença de 1 TOQUE (Mobile-First) */}
      <div className="p-4 sm:p-5 bg-zinc-950/70 border-b border-zinc-800/80">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Sua Presença no Jogo
            </div>
            <div className="text-sm font-semibold text-zinc-100">
              Toque rápido para confirmar sua escalação:
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              statusAtual === 'confirmado'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : statusAtual === 'recusado'
                ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
            }`}
          >
            {statusAtual === 'confirmado'
              ? 'CONFIRMADO'
              : statusAtual === 'recusado'
              ? 'NÃO VOU'
              : 'DÚVIDA'}
          </span>
        </div>

        {/* 3 Botões Grandes Mobile (Altura mínima 52px para dedo) */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => onUpdatePresenca(currentAtletaId, 'confirmado')}
            className={`min-h-[52px] rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-[0.98] ${
              statusAtual === 'confirmado'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40 shadow-sm'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>Vou</span>
          </button>

          <button
            onClick={() => onUpdatePresenca(currentAtletaId, 'recusado')}
            className={`min-h-[52px] rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-[0.98] ${
              statusAtual === 'recusado'
                ? 'bg-red-600 text-white ring-2 ring-red-400/40 shadow-sm'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            <X className="w-5 h-5 stroke-[2.5]" />
            <span>Não Vou</span>
          </button>

          <button
            onClick={() => onUpdatePresenca(currentAtletaId, 'duvida')}
            className={`min-h-[52px] rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-[0.98] ${
              statusAtual === 'duvida'
                ? 'bg-amber-600 text-white ring-2 ring-amber-400/40 shadow-sm'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            <HelpCircle className="w-5 h-5 stroke-[2.5]" />
            <span>Dúvida</span>
          </button>
        </div>
      </div>

      {/* Lista de Atletas do Elenco & Confirmações */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Quadro de Presenças do Elenco
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
              {confirmadosCount} Confirmados
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
              {duvidasCount} Dúvidas
            </span>
            <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-300 border border-red-500/20 font-semibold">
              {recusadosCount} Não Vão
            </span>
          </div>
        </div>

        {/* Atletas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredPresencas.map((presenca) => {
            const atleta = presenca.atleta;
            if (!atleta) return null;

            const isLate = atleta.chegou_em?.includes('Atrasado');

            return (
              <div
                key={presenca.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                  presenca.status === 'confirmado'
                    ? 'bg-zinc-900/80 border-zinc-800/80'
                    : presenca.status === 'recusado'
                    ? 'bg-red-500/5 border-red-500/20 opacity-60'
                    : 'bg-amber-500/5 border-amber-500/20'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-200 font-bold flex items-center justify-center text-xs shrink-0 border border-zinc-700/50">
                    {atleta.numero_camisa || '•'}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                      <span className="truncate">{atleta.apelido || atleta.nome}</span>
                      {atleta.tipo_vinculo === 'convidado' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 shrink-0">
                          Convidado
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {atleta.posicao_principal}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {presenca.status === 'confirmado' ? (
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <Check className="w-2.5 h-2.5" /> Confirmado
                      </span>
                      {isLate && (
                        <div className="text-[9px] text-red-400 font-bold mt-0.5">
                          Atrasou (Banco)
                        </div>
                      )}
                    </div>
                  ) : presenca.status === 'recusado' ? (
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                      Não Vai
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      Dúvida
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
