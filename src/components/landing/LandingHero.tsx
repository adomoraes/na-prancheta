import React from 'react';
import { 
  Play, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Lock, 
  CheckCircle2, 
  Trophy, 
  DollarSign, 
  Users, 
  FileText
} from 'lucide-react';

interface LandingHeroProps {
  onEnterApp: () => void;
  onOpenPitchModal: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterApp, onOpenPitchModal }) => {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background Gradients & Pitch Line Patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/10 blur-[130px] rounded-full" />
        
        {/* Subtle Pitch Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 shadow-inner backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-zinc-300">
              A Primeira Plataforma de Governança do Futebol Amador
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs font-bold text-emerald-400">Tese de Investimento 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-['Cabinet_Grotesk'] leading-[1.08]">
            A revolução digital dos bastidores do{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              futebol amador.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-zinc-300/90 font-normal leading-relaxed max-w-3xl mx-auto font-['Plus_Jakarta_Sans']">
            Do corte disciplinar por atraso na preleção (<span className="text-emerald-400 font-semibold">T-35</span>) à vaquinha da arbitragem via PIX e à cerveja trancada no porta-malas: transformamos o caos dos grupos de WhatsApp em uma máquina de engajamento, disciplina e monetização.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 text-base font-extrabold text-zinc-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Explorar Demonstração Interativa</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenPitchModal}
              className="w-full sm:w-auto px-7 py-4 text-base font-bold text-zinc-200 hover:text-white bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-zinc-500 rounded-xl shadow-lg backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Solicitar Pitch Deck Executivo</span>
            </button>
          </div>

          {/* Reassurance Label */}
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-400 pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Sandbox aberta sem cadastro
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Dados e regras reais de dia de jogo
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Deck e Unit Economics sob demanda
            </span>
          </div>

        </div>

        {/* Hero Interactive Showcase / Floating Snapshot Cards */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="relative rounded-2xl bg-gradient-to-b from-zinc-800/60 to-zinc-900/80 p-2 sm:p-3 border border-zinc-700/60 shadow-2xl shadow-black/80 backdrop-blur-xl">
            
            {/* Window Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 mb-3 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-medium text-zinc-400">naprancheta.com.br — Painel Operacional do Vestiário</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Dia de Jogo: AO VIVO</span>
              </div>
            </div>

            {/* Interactive Grid of Product Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2 sm:p-4">
              
              {/* Card 1: Protocolo T-35 */}
              <div className="bg-zinc-950/80 rounded-xl p-4 border border-zinc-800/90 shadow-md relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-zinc-300 font-mono">REGRA T-35</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Corte Ativo
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Preleção & Disciplina</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  Atleta que chega após o limite T-35 perde a titularidade automaticamente. Sem discussão com o treinador.
                </p>
                <div className="bg-zinc-900/90 rounded-lg p-2.5 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center justify-between">
                  <span>Atrasados no Vestiário:</span>
                  <span className="text-rose-400 font-bold">1 corte compulsório</span>
                </div>
              </div>

              {/* Card 2: Vaquinha PIX de Arbitragem */}
              <div className="bg-zinc-950/80 rounded-xl p-4 border border-zinc-800/90 shadow-md relative overflow-hidden group hover:border-amber-500/40 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-zinc-300 font-mono">TESOUREIRO PIX</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    100% Pago
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Taxa de Arbitragem</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  Meta de R$ 300,00 rateada apenas entre confirmados. Cobrança de 1 toque com cópia pronta para o WhatsApp.
                </p>
                <div className="bg-zinc-900/90 rounded-lg p-2.5 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center justify-between">
                  <span>Arrecadado:</span>
                  <span className="text-emerald-400 font-bold">R$ 350,00 (+ R$ 50 pro Caixa)</span>
                </div>
              </div>

              {/* Card 3: Trava da Resenha */}
              <div className="bg-zinc-950/80 rounded-xl p-4 border border-zinc-800/90 shadow-md relative overflow-hidden group hover:border-rose-500/40 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-colors" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-zinc-300 font-mono">ALMOXARIFADO</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Trava da Resenha
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Custódia & Fechamento</h4>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  A cerveja e o terceiro tempo só são liberados após conferir 22 camisas desviradas, 6 bolas e trancar a mala no carro.
                </p>
                <div className="bg-zinc-900/90 rounded-lg p-2.5 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center justify-between">
                  <span>Mala de Uniformes:</span>
                  <span className="text-amber-400 font-bold">Aguardando conferência</span>
                </div>
              </div>

            </div>

            {/* Bottom Bar inside Mockup */}
            <div className="px-4 py-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="font-medium">Craque do Jogo (MVP):</span>
                <span className="font-bold text-white">Eleição auditada em tempo real pela torcida e comissão</span>
              </div>
              <button
                onClick={onEnterApp}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Experimentar no App Operacional</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Big Numbers / Market Traction Band */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-white font-['Cabinet_Grotesk'] tracking-tight">
              100k+
            </div>
            <div className="text-xs sm:text-sm font-medium text-zinc-400 mt-1">
              Times Amadores Ativos no Brasil
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-['Cabinet_Grotesk'] tracking-tight">
              R$ 15,2 Bi
            </div>
            <div className="text-xs sm:text-sm font-medium text-zinc-400 mt-1">
              Movimentados/ano no ecossistema
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-amber-400 font-['Cabinet_Grotesk'] tracking-tight">
              98,4%
            </div>
            <div className="text-xs sm:text-sm font-medium text-zinc-400 mt-1">
              Taxa de Arrecadação de Vaquinha
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-teal-400 font-['Cabinet_Grotesk'] tracking-tight">
              Zero
            </div>
            <div className="text-xs sm:text-sm font-medium text-zinc-400 mt-1">
              Camisas Perdidas com a Trava
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
