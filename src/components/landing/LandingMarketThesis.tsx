import React from 'react';
import { 
  TrendingUp, 
  Repeat, 
  Share2, 
  ShieldCheck, 
  Zap, 
  PieChart,
  ArrowUpRight
} from 'lucide-react';

export const LandingMarketThesis: React.FC = () => {
  return (
    <section id="mercado" className="py-24 bg-zinc-950 relative border-t border-zinc-900 overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 font-mono">
            <span>Tese de Investimento & Oportunidade</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Cabinet_Grotesk']">
            Um Mercado Gigantesco, Frequente e Completamente Ignorado
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-['Plus_Jakarta_Sans']">
            Enquanto as grandes tech empresas disputam direitos de transmissão do futebol profissional, o futebol amador movimenta bilhões no subsolo com software quase inexistente.
          </p>
        </div>

        {/* TAM / SAM / SOM Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* TAM */}
          <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  TAM (Mercado Total)
                </span>
                <span className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
                  <PieChart className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white font-['Cabinet_Grotesk'] tracking-tight">
                  R$ 15,2 Bilhões
                </div>
                <span className="text-xs text-emerald-400 font-semibold mt-1 block">
                  Movimentação anual estimada no Brasil
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Locações de campos sintéticos e quadras society, taxas semanais de arbitragem, compra e lavagem de uniformes oficiais, suplementos e o consumo massivo de churrasco e bebidas no pós-jogo.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
              Base: +100 mil equipes e ligas amadoras
            </div>
          </div>

          {/* SAM */}
          <div className="rounded-2xl bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 border border-emerald-500/30 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-emerald-500/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  SAM (Endereçável)
                </span>
                <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-['Cabinet_Grotesk'] tracking-tight">
                  R$ 1,8 Bilhão
                </div>
                <span className="text-xs text-emerald-400 font-semibold mt-1 block">
                  SaaS esportivo & serviços financeiros
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Times organizados com taxa de jogo semanal, ligas metropolitanas de futebol amador e complexos esportivos com demanda ativa por digitalização de cobrança e escala.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-500/20 text-[11px] text-emerald-300 font-mono">
              Foco inicial: Regiões Sul, Sudeste e capitais do Nordeste
            </div>
          </div>

          {/* SOM */}
          <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  SOM (Meta 5 Anos)
                </span>
                <span className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
                  <Zap className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white font-['Cabinet_Grotesk'] tracking-tight">
                  R$ 180 Milhões
                </div>
                <span className="text-xs text-amber-400 font-semibold mt-1 block">
                  12.000 equipes ativas + 500 arenas
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Monetização combinada através de assinaturas recorrentes de clubes (SaaS), licenciamento de infraestrutura para arenas B2B e take-rate em microtransações PIX.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
              Conversão de 12% da base do SAM em 60 meses
            </div>
          </div>

        </div>

        {/* Growth Drivers & Flywheel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
              <Share2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Loop Viral Orgânico (CAC Próximo a Zero)</h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Cada equipe cadastrada joga contra um time diferente toda semana. Ao enviar links de WhatsApp com escalação e boletim, o adversário e a arena conhecem o sistema sem custo de mídia paga.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
              <Repeat className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Recorrência Sagrada de 52 Semanas</h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Pelada de final de semana é compromisso inegociável na vida do brasileiro. O ciclo de engajamento ocorre toda semana (quinta a domingo), gerando altíssima retenção (DAU/MAU).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Moat Cultural & Efeito Lock-In</h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Uma vez que o histórico do elenco, caixa acumulado, scouts de artilharia e regras disciplinares estão na plataforma, a barreira de saída da equipe é praticamente intransponível.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
