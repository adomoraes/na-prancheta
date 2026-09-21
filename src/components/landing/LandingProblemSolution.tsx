import React from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  MessageSquareOff, 
  CheckCheck, 
  AlertTriangle, 
  Clock, 
  Flame, 
  Coins, 
  Lock, 
  Beer,
  Sparkles
} from 'lucide-react';

export const LandingProblemSolution: React.FC = () => {
  const comparisons = [
    {
      topic: 'Convocação & Presença',
      problemIcon: MessageSquareOff,
      problemTitle: 'O Caos das Mensagens no WhatsApp',
      problemDesc: 'Mais de 300 áudios na sexta-feira. "Vou ver se a patroa deixa", 3 confirmam e somem, 18 aparecem no campo sem avisar e o racha vira briga.',
      solutionIcon: CheckCheck,
      solutionTitle: 'Presença em 1 Toque com Teto Estrito',
      solutionDesc: 'Respostas instantâneas (Vou, Não Vou, Dúvida). Teto rigoroso de 14 confirmados na rodada e transbordamento automático para a Lista de Espera a partir do 15º.',
    },
    {
      topic: 'Pontualidade & Preleção',
      problemIcon: AlertTriangle,
      problemTitle: 'O Camisa 10 que Chega Atrasado',
      problemDesc: 'Jogador chega 5 minutos antes do apito inicial, exige a titularidade e o técnico fica desmoralizado diante do elenco que chegou no horário.',
      solutionIcon: Clock,
      solutionTitle: 'Protocolo T-35 com Corte Disciplinar',
      solutionDesc: 'A preleção inicia às T-35 min. Quem chegar depois tem a titularidade bloqueada no sistema e vai compulsória e publicamente para o banco. A culpa sai do técnico e vira regra do clube.',
    },
    {
      topic: 'Vaquinha da Arbitragem',
      problemIcon: Coins,
      problemTitle: 'O Calote do Juiz Pago pelo Tesoureiro',
      problemDesc: 'Cobrança manual com caderneta amassada. Sempre faltam R$ 60,00 para pagar o trio de arbitragem e o tesoureiro acaba tirando do próprio bolso.',
      solutionIcon: Sparkles,
      solutionTitle: 'Rateio Automático & Boletim PIX',
      solutionDesc: 'Meta de R$ 300,00 rateada somente entre os confirmados. Cópia de PIX em 1 toque, prestação de contas formatada para o grupo e saldo excedente creditado no Caixa Geral da equipe.',
    },
    {
      topic: 'Patrimônio & Terceiro Tempo',
      problemIcon: Flame,
      problemTitle: 'Camisas do Avesso & Malas Perdidas',
      problemDesc: 'A cerveja abre no gramado, o time se dispersa, a mala volta com 19 camisas jogadas de qualquer jeito e bola oficial sumida na cerca.',
      solutionIcon: Lock,
      solutionTitle: 'A Lendária "Trava da Resenha"',
      solutionDesc: 'A confraternização social e o consumo de bebidas ficam travados no app até o almoxarife validar: 22 camisas desviradas, 6 bolas recolhidas e mala trancada no veículo oficial.',
    },
  ];

  return (
    <section id="produto" className="py-24 bg-zinc-950 relative border-t border-zinc-900 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400">
            <span>Problema Real vs. Solução Escalável</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Cabinet_Grotesk']">
            Por que o futebol amador nunca funcionou em planilhas ou apps de torneio?
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-['Plus_Jakarta_Sans']">
            Softwares tradicionais cuidam apenas da tabela do campeonato. O <strong className="text-emerald-400 font-semibold">Na Prancheta</strong> resolve a fricção humana e financeira do dia a dia do vestiário.
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="space-y-6">
          {comparisons.map((item, index) => {
            const ProblemIcon = item.problemIcon;
            const SolutionIcon = item.solutionIcon;

            return (
              <div 
                key={item.topic}
                className="rounded-2xl bg-zinc-900/40 border border-zinc-800/90 overflow-hidden shadow-xl hover:border-zinc-700 transition-colors"
              >
                {/* Topic Bar */}
                <div className="px-6 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between text-xs font-mono font-bold text-zinc-400">
                  <span className="text-zinc-200">#0{index + 1} — {item.topic.toUpperCase()}</span>
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Governança Cultural
                  </span>
                </div>

                {/* Columns: Problem vs Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800/80">
                  
                  {/* Left: The Chaos */}
                  <div className="p-6 sm:p-7 bg-zinc-950/40 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <ProblemIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                            Como é hoje (O Caos)
                          </span>
                          <h4 className="text-base font-bold text-zinc-200">{item.problemTitle}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed pl-1">
                        {item.problemDesc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center gap-2 text-xs text-rose-400/90 font-medium">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Gera atrito interno, calote financeiro e estresse semanal</span>
                    </div>
                  </div>

                  {/* Right: The Na Prancheta Solution */}
                  <div className="p-6 sm:p-7 bg-gradient-to-br from-emerald-950/20 via-zinc-950/40 to-teal-950/20 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="space-y-3 relative">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                          <SolutionIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                            Com o Na Prancheta
                          </span>
                          <h4 className="text-base font-bold text-white">{item.solutionTitle}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed pl-1">
                        {item.solutionDesc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center gap-2 text-xs text-emerald-400 font-semibold relative">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Automação, transparência inegociável e harmonia do elenco</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
