import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  MessageCircle, 
  Loader2, 
  Briefcase, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { TipoInvestidor, TicketEstimado, InvestorLeadDTO } from '../../types';

interface LandingLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LandingLeadModal: React.FC<LandingLeadModalProps> = ({ isOpen, onClose }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipoInvestidor, setTipoInvestidor] = useState<TipoInvestidor>('fundo_vc');
  const [ticketEstimado, setTicketEstimado] = useState<TicketEstimado>('200k_1m');
  const [mensagem, setMensagem] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: InvestorLeadDTO = {
        nome,
        email,
        telefone,
        tipo_investidor: tipoInvestidor,
        ticket_estimado: ticketEstimado,
        mensagem: mensagem || undefined,
        origem: 'landing_page',
      };

      // 1. Grava no backend Laravel (PostgreSQL)
      await api.leads.submitInvestorLead(payload);

      // 2. Prepara mensagem para abertura imediata no WhatsApp dos fundadores
      const tipoLabelMap: Record<TipoInvestidor, string> = {
        anjo: 'Investidor Anjo',
        fundo_vc: 'Fundo VC / Venture Capital',
        arena_liga: 'Gestor de Arena / Liga',
        outro: 'Parceiro Comercial / Estratégico',
      };

      const waText = encodeURIComponent(
        `Olá, time do Na Prancheta! 👋\n\n` +
        `Meu nome é *${nome}* (${tipoLabelMap[tipoInvestidor] || tipoInvestidor}).\n` +
        `Analisei a apresentação do produto e gostaria de receber o Pitch Deck executivo e agendar uma reunião.\n\n` +
        `📧 E-mail: ${email}\n` +
        `📞 Telefone: ${telefone}\n` +
        (mensagem ? `💬 Mensagem: "${mensagem}"\n` : '')
      );

      // 3. Abre conversa no WhatsApp dos fundadores
      const waUrl = `https://wa.me/5511999999999?text=${waText}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Falha ao registrar contato. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setError(null);
    setNome('');
    setEmail('');
    setTelefone('');
    setMensagem('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Cabinet_Grotesk'] leading-tight">
                Pitch Deck & Relações com Investidores
              </h3>
              <span className="text-xs text-zinc-400">
                Converse diretamente com os fundadores do Na Prancheta
              </span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white font-['Cabinet_Grotesk']">
                  Contato Enviado com Sucesso!
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
                  Seus dados foram registrados com segurança em nossa base e uma conversa direta no WhatsApp foi iniciada com os fundadores.
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={handleReset}
                  className="w-full py-3 text-sm font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md transition-colors"
                >
                  Concluir
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Nome */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Mendonça"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Email & Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    E-mail Corporativo/Pessoal *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@fundo.vc"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98888-7777"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Perfil & Ticket */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tipo de Perfil *
                  </label>
                  <select
                    value={tipoInvestidor}
                    onChange={(e) => setTipoInvestidor(e.target.value as TipoInvestidor)}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="fundo_vc">Fundo VC / Venture Capital</option>
                    <option value="anjo">Investidor Anjo</option>
                    <option value="arena_liga">Gestor de Arena / Liga</option>
                    <option value="outro">Parceiro Comercial / Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Ticket / Interesse Estimado
                  </label>
                  <select
                    value={ticketEstimado}
                    onChange={(e) => setTicketEstimado(e.target.value as TicketEstimado)}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ate_50k">Até R$ 50k</option>
                    <option value="50k_200k">R$ 50k a R$ 200k</option>
                    <option value="200k_1m">R$ 200k a R$ 1 Milhão</option>
                    <option value="acima_1m">Acima de R$ 1 Milhão</option>
                    <option value="parceria_comercial">Parceria Comercial / Piloto</option>
                  </select>
                </div>
              </div>

              {/* Mensagem Opcional */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Mensagem Adicional (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Gostaria de ver o cap table, detalhes do modelo de monetização..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Notice */}
              <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ao clicar, seus dados serão registrados e uma conversa oficial será aberta no WhatsApp dos fundadores.</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-sm font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processando solicitação...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Solicitação & Abrir WhatsApp</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
