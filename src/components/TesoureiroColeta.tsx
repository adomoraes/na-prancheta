import React, { useState } from 'react';
import { Evento, EventoColetaDia, EventoPresenca, Atleta } from '../types';
import { DollarSign, CheckCircle, Clock, Copy, Check, Users, Sparkles, AlertCircle, Landmark, Loader2 } from 'lucide-react';

interface TesoureiroColetaProps {
  evento: Evento;
  coletas: EventoColetaDia[];
  presencas: EventoPresenca[];
  onTogglePago: (atletaId: string) => void;
  onEncerrarVaquinha?: () => Promise<any>;
}

export const TesoureiroColeta: React.FC<TesoureiroColetaProps> = ({
  evento,
  coletas,
  presencas,
  onTogglePago,
  onEncerrarVaquinha,
}) => {
  const [filter, setFilter] = useState<'todos' | 'pendentes' | 'pagos'>('todos');
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedResumo, setCopiedResumo] = useState(false);
  const [isEncerrando, setIsEncerrando] = useState(false);
  const [encerradoInfo, setEncerradoInfo] = useState<{
    saldoExcedente: number;
    saldoGeral: number;
  } | null>(null);

  const handleEncerrar = async () => {
    if (!onEncerrarVaquinha) return;
    if (
      !window.confirm(
        'Deseja encerrar a vaquinha desta partida? A taxa de arbitragem será liquidada e qualquer excedente será transferido automaticamente para o Caixa Geral da equipe.'
      )
    ) {
      return;
    }
    try {
      setIsEncerrando(true);
      const res = await onEncerrarVaquinha();
      setEncerradoInfo({
        saldoExcedente: (res?.saldo_excedente_centavos || 0) / 100,
        saldoGeral: (res?.saldo_geral_equipe_centavos || 0) / 100,
      });
    } catch (err: any) {
      alert(err.message || 'Erro ao encerrar vaquinha na API');
    } finally {
      setIsEncerrando(false);
    }
  };

  // Apenas atletas confirmados no jogo participam do rateio/vaquinha
  const confirmadosIds = new Set(
    presencas.filter((p) => p.status === 'confirmado').map((p) => p.atleta_id)
  );

  const coletasConfirmados = coletas.filter((c) => confirmadosIds.has(c.atleta_id));

  const totalEsperado = coletasConfirmados.length * evento.valor_taxa_jogo;
  const totalArrecadado = coletasConfirmados
    .filter((c) => c.pago)
    .reduce((sum, c) => sum + c.valor_pago, 0);
  const totalPendente = totalEsperado - totalArrecadado;

  const pagosCount = coletasConfirmados.filter((c) => c.pago).length;
  const pendentesCount = coletasConfirmados.filter((c) => !c.pago).length;

  const custoArbitragem = 300.0; // custo fixo do trio de arbitragem
  const percentualArrecadado = totalEsperado > 0 ? (totalArrecadado / totalEsperado) * 100 : 0;

  const chavePixTesoureiro = '11943210987'; // Pix de exemplo

  const handleCopyPix = () => {
    navigator.clipboard.writeText(chavePixTesoureiro);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleCopyResumoWhatsApp = () => {
    let text = `⚽ *NA PRANCHETA — VAQUINHA DO JOGO*\n`;
    text += `Partida: ${evento.titulo}\n`;
    text += `Taxa por Atleta: R$ ${evento.valor_taxa_jogo.toFixed(2)}\n`;
    text += `Arrecadado: R$ ${totalArrecadado.toFixed(2)} / R$ ${totalEsperado.toFixed(2)}\n`;
    text += `PIX Tesoureiro (${evento.tesoureiro_nome}): ${chavePixTesoureiro}\n\n`;
    text += `*Pendentes (${pendentesCount}):*\n`;
    coletasConfirmados
      .filter((c) => !c.pago)
      .forEach((c) => {
        const at = presencas.find((p) => p.atleta_id === c.atleta_id)?.atleta;
        text += `❌ ${at?.apelido || at?.nome || 'Atleta'}\n`;
      });
    text += `\n*Pagos (${pagosCount}):*\n`;
    coletasConfirmados
      .filter((c) => c.pago)
      .forEach((c) => {
        const at = presencas.find((p) => p.atleta_id === c.atleta_id)?.atleta;
        text += `✅ ${at?.apelido || at?.nome || 'Atleta'}\n`;
      });

    navigator.clipboard.writeText(text);
    setCopiedResumo(true);
    setTimeout(() => setCopiedResumo(false), 2000);
  };

  const filteredColetas = coletasConfirmados.filter((c) => {
    if (filter === 'pagos') return c.pago;
    if (filter === 'pendentes') return !c.pago;
    return true;
  });

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-sm mb-6 text-zinc-100">
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-wider">
              Painel do Tesoureiro do Dia
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Arrecadação da taxa de arbitragem e rateio dos confirmados no jogo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyPix}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-xs font-semibold text-amber-300 border border-zinc-700/80 transition active:scale-[0.98]"
          >
            {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPix ? 'PIX Copiado!' : 'Copiar Chave PIX'}</span>
          </button>

          <button
            onClick={handleCopyResumoWhatsApp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98]"
          >
            {copiedResumo ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{copiedResumo ? 'Copiado p/ Zap!' : 'Resumo WhatsApp'}</span>
          </button>

          {onEncerrarVaquinha && (
            <button
              onClick={handleEncerrar}
              disabled={isEncerrando || !!encerradoInfo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-50"
            >
              {isEncerrando ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Fechando...</span>
                </>
              ) : encerradoInfo ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Vaquinha Liquidada</span>
                </>
              ) : (
                <>
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Encerrar & Creditar Caixa</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Banner de Encerramento com Sucesso */}
      {encerradoInfo && (
        <div className="my-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Vaquinha encerrada na API:</strong> Taxa de arbitragem quitada. Excedente de{' '}
              <strong>R$ {encerradoInfo.saldoExcedente.toFixed(2)}</strong> creditado no Caixa Geral. Saldo acumulado do clube: <strong>R$ {encerradoInfo.saldoGeral.toFixed(2)}</strong>.
            </span>
          </div>
        </div>
      )}

      {/* Cards de Métricas Financeiras */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Total Arrecadado
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            R$ {totalArrecadado.toFixed(2)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            {pagosCount} de {coletasConfirmados.length} confirmados
          </div>
        </div>

        <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Pendente de Pagamento
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            R$ {totalPendente.toFixed(2)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            {pendentesCount} atletas ainda não pagaram
          </div>
        </div>

        <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Meta Arbitragem (R$ 300,00)
          </div>
          <div className="text-xl font-black text-zinc-100 font-mono">
            {percentualArrecadado.toFixed(0)}% Coberto
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percentualArrecadado, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filtros e Lista com Toque Rápido */}
      <div className="flex items-center justify-between mt-5 mb-3">
        <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Checklist de Cobrança da Rodada
        </div>

        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800/80">
          <button
            onClick={() => setFilter('todos')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              filter === 'todos' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todos ({coletasConfirmados.length})
          </button>
          <button
            onClick={() => setFilter('pendentes')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              filter === 'pendentes' ? 'bg-amber-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pendentes ({pendentesCount})
          </button>
          <button
            onClick={() => setFilter('pagos')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              filter === 'pagos' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pagos ({pagosCount})
          </button>
        </div>
      </div>

      {/* Grid de Atletas com Botão Grande de Toggle Pago/Pendente */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filteredColetas.map((coleta) => {
          const atleta = presencas.find((p) => p.atleta_id === coleta.atleta_id)?.atleta;
          if (!atleta) return null;

          return (
            <div
              key={coleta.id}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                coleta.pago
                  ? 'bg-zinc-900/80 border-zinc-800/80'
                  : 'bg-amber-500/5 border-amber-500/25'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                    coleta.pago
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {atleta.numero_camisa || '•'}
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                    <span>{atleta.apelido || atleta.nome}</span>
                    {atleta.tipo_vinculo === 'convidado' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        Convidado
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {atleta.posicao_principal} • Taxa: R$ {coleta.valor_pago.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Botão de Toque Rápido Mobile (Mínimo 44px) */}
              <button
                onClick={() => onTogglePago(coleta.atleta_id)}
                className={`min-h-[44px] px-4 rounded-xl flex items-center gap-2 text-xs font-bold transition-all active:scale-[0.98] ${
                  coleta.pago
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-sm font-extrabold'
                }`}
              >
                {coleta.pago ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Pago</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Cobrar</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
