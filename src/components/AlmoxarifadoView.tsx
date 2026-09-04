import React, { useState } from 'react';
import { PatrimonioItem, Evento } from '../types';
import { Package, CheckCircle2, AlertTriangle, ShieldCheck, Shirt, Check, RefreshCw } from 'lucide-react';

interface AlmoxarifadoViewProps {
  itens: PatrimonioItem[];
  evento: Evento;
}

export const AlmoxarifadoView: React.FC<AlmoxarifadoViewProps> = ({ itens, evento }) => {
  const [malaConferida, setMalaConferida] = useState(false);
  const [uniformesLadoCorreto, setUniformesLadoCorreto] = useState(false);
  const [bolasRecolhidas, setBolasRecolhidas] = useState(false);

  const tudoConferido = malaConferida && uniformesLadoCorreto && bolasRecolhidas;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-sm mb-6 text-zinc-100">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-wider">
              Almoxarifado & Custódia de Malas
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Inventário de patrimônio, malas de uniformes e checklist de fechamento pós-jogo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
            Custódia: Carlos Eduardo (Kadu)
          </span>
        </div>
      </div>

      {/* Regra de Ouro do Vestiário */}
      <div className="my-4 bg-purple-500/10 border border-purple-500/25 rounded-xl p-3.5 text-xs text-purple-200">
        <div className="font-bold text-zinc-100 uppercase tracking-wide mb-1 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Regra de Fechamento de Malas:</span>
        </div>
        A resenha social e o consumo de bebidas só estão liberados para o elenco após o
        fechamento, conferência e contagem das 22 camisas da mala oficial, dobradas do lado correto
        para lavagem.
      </div>

      {/* Checklist Pós-Jogo do Almoxarifado */}
      <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/80 mb-5">
        <div className="text-xs font-bold text-zinc-100 uppercase tracking-wider mb-3">
          Checklist de Devolução Pós-Jogo
        </div>

        <div className="space-y-2.5">
          <label className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition">
            <input
              type="checkbox"
              checked={uniformesLadoCorreto}
              onChange={(e) => setUniformesLadoCorreto(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-950 border-zinc-700"
            />
            <span className="text-xs text-zinc-200">
              Todas as camisas depositadas <strong>do lado correto</strong> na mala de lavagem (não do avesso)
            </span>
          </label>

          <label className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition">
            <input
              type="checkbox"
              checked={bolasRecolhidas}
              onChange={(e) => setBolasRecolhidas(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-950 border-zinc-700"
            />
            <span className="text-xs text-zinc-200">
              Bolsão de 6 bolas oficiais recolhido e conferido no gramado
            </span>
          </label>

          <label className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition">
            <input
              type="checkbox"
              checked={malaConferida}
              onChange={(e) => setMalaConferida(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-950 border-zinc-700"
            />
            <span className="text-xs text-zinc-200">
              Mala 1 fechada pelo responsável e guardada no veículo oficial de transporte
            </span>
          </label>
        </div>

        <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-xs">
            Status da Resenha:{' '}
            {tudoConferido ? (
              <span className="font-bold text-emerald-400">LIBERADA ✅</span>
            ) : (
              <span className="font-bold text-amber-400">BLOQUEADA (Aguardando malas) ⏳</span>
            )}
          </div>
        </div>
      </div>

      {/* Catálogo de Patrimônio Ativo */}
      <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
        Inventário de Patrimônio Ativo
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {itens.map((item) => (
          <div key={item.id} className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-zinc-100 truncate">{item.nome}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-emerald-500/20">
                {item.quantidade_disponivel}/{item.quantidade_total} disp.
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">{item.observacoes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
