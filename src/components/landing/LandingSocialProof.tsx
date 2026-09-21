import React from 'react';
import { 
  Quote, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Trophy, 
  HeartHandshake
} from 'lucide-react';

export const LandingSocialProof: React.FC = () => {
  const testimonials = [
    {
      author: 'Marcos "Marcão" Oliveira',
      role: 'Presidente & Zagueiro',
      club: 'Os Canabis F.C. • São Paulo/SP',
      initials: 'MO',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      text: 'Antes do Na Prancheta, todo jogo sumia meião, faltava camisa e o tesoureiro cobria R$ 60 do bolso pro juiz não chiar. A Trava da Resenha virou lei sagrada: hoje os próprios atletas conferem e desviram o fardamento pra liberar o cooler!',
      highlight: 'Zero camisas perdidas em 2 anos de uso.',
    },
    {
      author: 'Professor Roberto "Beto"',
      role: 'Técnico & Preparador Físico',
      club: 'Real Vila Amadora • Belo Horizonte/MG',
      initials: 'RB',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      text: 'A régua do T-35 tirou a culpa das minhas costas. Nego chegava atrasado faltando 5 minutos pro jogo querendo ser titular na marra. No app, passou das T-35 min o sistema corta sozinho. A disciplina do time mudou da água pro vinho.',
      highlight: '100% de pontualidade na preleção aos sábados.',
    },
    {
      author: 'Thiago Resende',
      role: 'Diretor Financeiro & Atleta',
      club: 'Atlético do Bairro • Curitiba/PR',
      initials: 'TR',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      text: 'Gerencio 2 quadros aos domingos. O rateio do PIX com cópia pronta do boletim pro WhatsApp economiza pelo menos 3 horas de bate-boca todo domingo. Nosso Caixa Geral fechou o ano no azul pela primeira vez na história.',
      highlight: 'R$ 4.200 acumulados no caixa geral da temporada.',
    },
  ];

  return (
    <section id="depoimentos" className="py-24 bg-zinc-950 relative border-t border-zinc-900 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 font-mono">
            <span>Validação de Vestiário & Prova Social</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Cabinet_Grotesk']">
            Aprovado por Quem Vive a Realidade da Várzea
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-['Plus_Jakarta_Sans']">
            Capitães, técnicos e tesoureiros que trocaram o estresse do WhatsApp pela governança profissional do Na Prancheta.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 sm:p-7 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-xl relative"
            >
              <div className="space-y-4">
                
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-zinc-600" />
                </div>

                {/* Testimonial Quote */}
                <p className="text-sm text-zinc-300 leading-relaxed italic">
                  "{t.text}"
                </p>

                {/* Highlight Tag */}
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.highlight}</span>
                </div>

              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.author}</div>
                  <div className="text-[11px] text-zinc-400">{t.role}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">{t.club}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges Band */}
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 flex flex-wrap items-center justify-around gap-6 text-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-bold text-white">Governança Cultural</div>
              <div className="text-xs text-zinc-400">Regras alinhadas à tradição brasileira</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-bold text-white">Alta Retenção Semanal</div>
              <div className="text-xs text-zinc-400">Engajamento recorrente toda rodada</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-teal-400 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-bold text-white">Comunidade Apaixonada</div>
              <div className="text-xs text-zinc-400">Fidelidade extrema ao clube e ao app</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
