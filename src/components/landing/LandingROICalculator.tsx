import React, { useState } from 'react';
import { 
  Calculator, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Beer,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const LandingROICalculator: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const [jogosMes, setJogosMes] = useState(4);
  const [taxaArbitragem, setTaxaArbitragem] = useState(300);
  const [atletasElenco, setAtletasElenco] = useState(16);

  // Cálculos dinâmicos
  // Sem Na Prancheta: ~10% a 15% de calote/atraso em cada taxa de arbitragem que o tesoureiro cobre
  const caloteMensalEvitado = (taxaArbitragem * 0.15) * jogosMes;
  const caloteAnualEvitado = caloteMensalEvitado * 12;

  // Horas gastas por jogo com cobrança no WhatsApp, montagem manual de lista e discussão de atraso: ~2.5h por jogo
  const horasMensaisPoupadas = jogosMes * 2.5;
  const horasAnuaisPoupadas = horasMensaisPoupadas * 12;

  // Valor de jogos de camisa salvos da perda (média de 1 a 2 fardamentos de reposição/ano = R$ 1.600)
  const fardamentoSalvo = 1600;

  return (
    <section id="calculadora" className="py-24 bg-zinc-950 relative border-t border-zinc-900 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-400 font-mono">
            <span>Simulador de Impacto Financeiro</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Cabinet_Grotesk']">
            Quanto o Na Prancheta Economiza para o seu Time?
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-['Plus_Jakarta_Sans']">
            Ajuste os controles abaixo de acordo com a rotina do seu elenco e veja a economia direta em dinheiro, tempo e dor de cabeça.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders Input Area */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Slider 1: Jogos por Mês */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-zinc-300">Jogos realizados por mês:</span>
                  <span className="text-emerald-400 font-mono text-base font-bold">{jogosMes} partidas</span>
                </div>
                <input 
                  type="range"
                  min="2"
                  max="8"
                  value={jogosMes}
                  onChange={(e) => setJogosMes(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>2 jogos (quinzenal)</span>
                  <span>4 jogos (semanal)</span>
                  <span>8 jogos (2 quadros)</span>
                </div>
              </div>

              {/* Slider 2: Taxa de Arbitragem */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-zinc-300">Taxa média de arbitragem por jogo:</span>
                  <span className="text-amber-400 font-mono text-base font-bold">R$ {taxaArbitragem},00</span>
                </div>
                <input 
                  type="range"
                  min="150"
                  max="500"
                  step="25"
                  value={taxaArbitragem}
                  onChange={(e) => setTaxaArbitragem(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>R$ 150 (juiz único)</span>
                  <span>R$ 300 (trio amador)</span>
                  <span>R$ 500 (federado)</span>
                </div>
              </div>

              {/* Slider 3: Tamanho do Elenco */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-zinc-300">Atletas confirmados por partida:</span>
                  <span className="text-blue-400 font-mono text-base font-bold">{atletasElenco} atletas</span>
                </div>
                <input 
                  type="range"
                  min="12"
                  max="22"
                  value={atletasElenco}
                  onChange={(e) => setAtletasElenco(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>12 atletas (society)</span>
                  <span>14 atletas (teto regulamentar)</span>
                  <span>22 atletas (campo completo)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400 leading-relaxed font-mono">
                💡 <strong className="text-zinc-200">Dado de Campo:</strong> Em média, um capitão amador perde 2 a 3 horas semanais cobrando PIX e gerindo lista de presença no WhatsApp.
              </div>

            </div>

            {/* Results Display Card */}
            <div className="lg:col-span-6 rounded-xl bg-gradient-to-br from-emerald-950/30 via-zinc-950 to-zinc-950 p-6 sm:p-7 border border-emerald-500/20 shadow-xl space-y-5">
              
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Economia & Retorno Anual
                </span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>

              {/* Metric 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block">Prejuízos em Calote Evitados:</span>
                  <span className="text-xs text-zinc-500 font-mono">Cobrança e baixa PIX sem rombo no caixa</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400 font-['Cabinet_Grotesk']">
                    R$ {caloteAnualEvitado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 block">/ ano</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-center justify-between border-t border-zinc-900 pt-3">
                <div>
                  <span className="text-xs text-zinc-400 block">Tempo Poupado da Diretoria:</span>
                  <span className="text-xs text-zinc-500 font-mono">Horas de WhatsApp e discussões devolvidas</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white font-['Cabinet_Grotesk']">
                    {horasAnuaisPoupadas} horas
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 block">/ ano</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-center justify-between border-t border-zinc-900 pt-3">
                <div>
                  <span className="text-xs text-zinc-400 block">Preservação de Patrimônio:</span>
                  <span className="text-xs text-zinc-500 font-mono">Camisas e bolas salvas com a Trava</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400 font-['Cabinet_Grotesk']">
                    R$ {fardamentoSalvo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 block">/ ano</span>
                </div>
              </div>

              {/* Summary Total */}
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-white">Retorno Total Estimado:</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                  R$ {(caloteAnualEvitado + fardamentoSalvo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={onEnterApp}
                className="w-full py-3 text-xs sm:text-sm font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-md shadow-emerald-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ver Demonstração Prática no App</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
