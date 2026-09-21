import React from 'react';
import { 
  Building2, 
  CreditCard, 
  Beer, 
  Users2, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const LandingBusinessModel: React.FC<{ onOpenPitchModal: () => void }> = ({ onOpenPitchModal }) => {
  const revenueStreams = [
    {
      id: 'saas-times',
      title: '1. SaaS por Equipe (B2Team)',
      badge: 'Receita Recorrente Previsível',
      icon: Users2,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      description: 'Assinaturas mensais e anuais contratadas pelos capitães e diretorias dos times para governança do clube.',
      pricing: 'R$ 49,90 a R$ 89,90 / mês por equipe',
      features: [
        'Histórico vitalício de scouts e artilharia',
        'Controle financeiro e Caixa Geral da temporada',
        'Multi-quadros (1º e 2º quadros, veteranos e master)',
        'Geração automática de relatórios em PDF e cards para redes',
      ],
    },
    {
      id: 'b2b-arenas',
      title: '2. B2B para Arenas & Complexos',
      badge: 'Contratos Anuais de Alto Ticket',
      icon: Building2,
      color: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
      description: 'Plataforma para gestores de campos sintéticos e centros esportivos aumentarem a taxa de ocupação e reduzirem no-shows.',
      pricing: 'R$ 350 a R$ 850 / mês por arena',
      features: [
        'Calendário de locações e reserva de quadras',
        'Credenciamento oficial de árbitros da rodada',
        'Fidelização de times fixos com pontuação no app',
        'Dashboard de faturamento da cantina e resenha',
      ],
    },
    {
      id: 'fintech',
      title: '3. FinTech & Take-Rate no PIX',
      badge: 'Microtransações de Alto Volume',
      icon: CreditCard,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      description: 'Monetização sobre o fluxo transacional semanal de rateio de taxa de arbitragem, churrasco e mensalidades.',
      pricing: 'Take-rate de 1,5% a 2,5% sobre vaquinhas',
      features: [
        'Mais de R$ 1.200 movimentados por mês por time ativo',
        'Split de pagamento automático para o árbitro da partida',
        'Crédito rotativo para reserva antecipada de quadras',
        'Conta digital do clube com cartão para compras do time',
      ],
    },
    {
      id: 'marcas',
      title: '4. Marcas & Naming Rights da Resenha',
      badge: 'Monetização de Mídia Segmentada',
      icon: Beer,
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
      description: 'Ativações de marcas de cerveja, artigos esportivos e apostas esportivas no momento exato do consumo.',
      pricing: 'Patrocínios e campanhas de CPM/CPA',
      features: [
        'Naming rights oficial: "Trava da Resenha [Marca de Cerveja]"',
        'Selo do Craque da Partida (MVP) com cupom promocional',
        'Parcerias com fabricantes de uniformes e bolas oficiais',
        'Audiência 100% masculina/feminina altamente engajada',
      ],
    },
  ];

  return (
    <section id="monetizacao" className="py-24 bg-zinc-950 relative border-t border-zinc-900 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 font-mono">
            <span>Unit Economics & Monetização</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Cabinet_Grotesk']">
            4 Motores de Receita Sinérgicos e Escaláveis
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-['Plus_Jakarta_Sans']">
            Uma combinação única de SaaS B2B/B2C, infraestrutura de pagamentos e monetização de mídia no momento de maior paixão do usuário.
          </p>
        </div>

        {/* Grid of 4 Revenue Streams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {revenueStreams.map((stream) => {
            const Icon = stream.icon;
            return (
              <div 
                key={stream.id}
                className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all hover:shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl border ${stream.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold uppercase">
                      {stream.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-['Cabinet_Grotesk']">
                      {stream.title}
                    </h3>
                    <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                      {stream.pricing}
                    </div>
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {stream.description}
                  </p>

                  <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                    {stream.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">Alta Margem de Contribuição</span>
                  <span className="text-emerald-400 font-bold">LTV/CAC &gt; 5x</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout Pitch Deck */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-amber-950/30 border border-emerald-500/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white font-['Cabinet_Grotesk']">
              Quer ver a modelagem financeira completa e unit economics detalhados?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400">
              Disponibilizamos o One-Pager Financeiro, projeção de cohort e CAC/LTV para fundos e investidores qualificados.
            </p>
          </div>

          <button
            onClick={onOpenPitchModal}
            className="px-6 py-3 text-xs sm:text-sm font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 shrink-0 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Solicitar Deck Financeiro</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
