import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Zap,
  Shield,
  QrCode,
  Copy,
  Clock,
  AlertTriangle,
  Sparkles,
  Trophy,
  Crown,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { PlanoAssinatura, FaturaCheckoutResponse, MinhaAssinaturaResponse } from '../../types';
import { whitelabelService } from '../../services/whitelabelService';

interface PlansCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionUpdated?: () => void;
}

export const PlansCheckoutModal: React.FC<PlansCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSubscriptionUpdated,
}) => {
  const [planos, setPlanos] = useState<PlanoAssinatura[]>([]);
  const [minhaAssinatura, setMinhaAssinatura] = useState<MinhaAssinaturaResponse | null>(null);
  const [ciclo, setCiclo] = useState<'mensal' | 'anual'>('mensal');
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<FaturaCheckoutResponse | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [planosData, assinaturaData] = await Promise.all([
        whitelabelService.getPlanos().catch(() => []),
        whitelabelService.getMinhaAssinatura().catch(() => null),
      ]);
      setPlanos(planosData);
      setMinhaAssinatura(assinaturaData);
    } catch (err: any) {
      console.warn('Erro ao carregar dados de planos:', err);
      setErrorMsg('Não foi possível carregar os planos da API.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleStartCheckout = async (planoSlug: string) => {
    setCheckoutLoading(true);
    setErrorMsg(null);
    try {
      const res = await whitelabelService.checkoutAssinatura({
        plano_slug: planoSlug,
        ciclo,
        metodo_pagamento: 'pix',
      });
      setCheckoutResult(res);
    } catch (err: any) {
      console.error('Falha no checkout:', err);
      setErrorMsg(err.message || 'Erro ao gerar cobrança PIX.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCopyPix = () => {
    if (!checkoutResult?.pix_copia_cola) return;
    navigator.clipboard.writeText(checkoutResult.pix_copia_cola);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleConfirmPaymentRefresh = async () => {
    await loadData();
    if (onSubscriptionUpdated) {
      onSubscriptionUpdated();
    }
    setCheckoutResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border-b border-zinc-800/80">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/80 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Planos & Assinatura
                </span>
                {minhaAssinatura?.status === 'trial' && (
                  <span className="text-[11px] font-bold text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Trial: {minhaAssinatura.dias_restantes_trial} dias restantes
                  </span>
                )}
                {minhaAssinatura?.is_suspenso && (
                  <span className="text-[11px] font-bold text-rose-300 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Assinatura Suspensa
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Evolua a Gestão do seu Clube
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Escolha o plano ideal para a sua agremiação. Liberação instantânea via PIX.
              </p>
            </div>

            {/* Ciclo Mensal / Anual Toggle */}
            <div className="flex items-center bg-zinc-900 p-1 rounded-2xl border border-zinc-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setCiclo('mensal')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  ciclo === 'mensal'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setCiclo('anual')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  ciclo === 'anual'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Anual
                <span className="text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 px-1 rounded">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mx-6 sm:mx-8 mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Modal Content / Checkout View */}
        {checkoutResult ? (
          /* PIX Checkout Details */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-emerald-500/40 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-44 h-44 rounded-2xl bg-white p-3 flex flex-col items-center justify-center shadow-xl shrink-0">
                <QrCode className="w-36 h-36 text-zinc-950" />
                <span className="text-[9px] font-bold text-zinc-600 mt-1 uppercase">PIX Banco Central</span>
              </div>

              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  Aguardando Pagamento Instantâneo
                </div>

                <h3 className="text-xl font-black text-white">
                  Valor: {checkoutResult.valor_formatado}
                </h3>
                <p className="text-xs text-zinc-400">
                  Abra o app do seu banco, selecione a opção <strong>PIX Copia e Cola</strong> ou aponte a câmera para o QR Code acima.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <div className="w-full sm:max-w-md px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 text-xs font-mono truncate select-all">
                    {checkoutResult.pix_copia_cola}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0 ${
                      copiedPix
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                    }`}
                  >
                    {copiedPix ? (
                      <>
                        <Check className="w-4 h-4" />
                        Código Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar Código PIX
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setCheckoutResult(null)}
                className="px-4 py-2 text-zinc-400 hover:text-white text-xs font-semibold transition"
              >
                Voltar aos Planos
              </button>

              <button
                type="button"
                onClick={handleConfirmPaymentRefresh}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Já Paguei / Atualizar Assinatura
              </button>
            </div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Plano Amador */}
              <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 mb-3">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Amador</h3>
                  <p className="text-xs text-zinc-400 mt-1">Para times de amigos e peladas de final de semana.</p>
                  
                  <div className="mt-4 mb-4">
                    <span className="text-2xl font-black text-white">R$ 0</span>
                    <span className="text-xs text-zinc-400"> /mês</span>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-300 border-t border-zinc-800/80 pt-4">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      1 Elenco único
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      Até 25 atletas
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      Ficha de Jogo & Cronômetro T-50
                    </li>
                  </ul>
                </div>

                <div className="pt-5 mt-4 border-t border-zinc-800/80">
                  <span className="block text-center text-xs text-zinc-500 font-bold py-2">
                    Plano Gratuito
                  </span>
                </div>
              </div>

              {/* Plano Campeão (Destaque) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-zinc-900 to-zinc-900 border-2 border-emerald-500 relative shadow-xl shadow-emerald-500/10 flex flex-col justify-between">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-black font-black text-[10px] uppercase tracking-wider shadow-md">
                  Mais Popular
                </div>

                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Campeão</h3>
                  <p className="text-xs text-zinc-400 mt-1">Para clubes amadores estruturados e competitivos.</p>
                  
                  <div className="mt-4 mb-4">
                    <span className="text-3xl font-black text-white">
                      {ciclo === 'anual' ? 'R$ 79' : 'R$ 99'}
                    </span>
                    <span className="text-xs text-zinc-400"> /mês</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-zinc-200 border-t border-zinc-800/80 pt-4">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      Até 3 elencos simultâneos
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      Até 100 atletas no vestiário
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      Identidade visual personalizada (Whitelabel)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      Gestão financeira e caixinha do jogo
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      Scouts completos e prancheta tática
                    </li>
                  </ul>
                </div>

                <div className="pt-5 mt-4 border-t border-zinc-800/80">
                  <button
                    type="button"
                    disabled={checkoutLoading}
                    onClick={() => handleStartCheckout('campeao')}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-black" />
                        Assinar Campeão via PIX
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Plano Liga */}
              <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                    <Crown className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Liga</h3>
                  <p className="text-xs text-zinc-400 mt-1">Para ligas, federações e centros esportivos com múltiplas categorias.</p>
                  
                  <div className="mt-4 mb-4">
                    <span className="text-2xl font-black text-white">
                      {ciclo === 'anual' ? 'R$ 159' : 'R$ 199'}
                    </span>
                    <span className="text-xs text-zinc-400"> /mês</span>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-300 border-t border-zinc-800/80 pt-4">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      Elencos e categorias ilimitadas
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      Até 500 atletas ativos
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      Multi-administradores e relatórios executivos
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      Suporte prioritário via WhatsApp
                    </li>
                  </ul>
                </div>

                <div className="pt-5 mt-4 border-t border-zinc-800/80">
                  <button
                    type="button"
                    disabled={checkoutLoading}
                    onClick={() => handleStartCheckout('liga')}
                    className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition border border-zinc-700 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Assinar Plano Liga
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
