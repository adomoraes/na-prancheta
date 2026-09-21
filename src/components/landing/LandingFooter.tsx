import React from 'react';
import { 
  ClipboardList, 
  ShieldCheck, 
  Terminal, 
  ArrowUp,
  Heart
} from 'lucide-react';

interface LandingFooterProps {
  onEnterApp: () => void;
  onOpenPitchModal: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onEnterApp, onOpenPitchModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/90 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5">
                <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-lg font-black text-white font-['Cabinet_Grotesk']">
                Na Prancheta
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SportsTech
              </span>
            </div>

            <p className="text-zinc-400 leading-relaxed max-w-sm">
              A plataforma definitiva de governança, disciplina e monetização para os bastidores do futebol amador. Da preleção T-35 à vaquinha PIX e à trava da resenha.
            </p>

            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
              <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                React 19
              </span>
              <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                Tailwind CSS v4
              </span>
              <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                Laravel 11
              </span>
              <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                PostgreSQL 16
              </span>
              <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                PWA Mobile-First
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white font-['Cabinet_Grotesk'] uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#produto" className="hover:text-white transition-colors">O Produto & Solução</a></li>
              <li><a href="#pilares" className="hover:text-white transition-colors">Os 5 Pilares Culturais</a></li>
              <li><a href="#mercado" className="hover:text-white transition-colors">Tese & Tamanho de Mercado</a></li>
              <li><a href="#monetizacao" className="hover:text-white transition-colors">Modelo de Negócios (4 Motores)</a></li>
              <li><a href="#calculadora" className="hover:text-white transition-colors">Calculadora de ROI do Clube</a></li>
              <li><a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos de Capitães</a></li>
            </ul>
          </div>

          {/* Col 3: Actions for Investors */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white font-['Cabinet_Grotesk'] uppercase tracking-wider">
              Para Investidores & Parceiros
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              Rodada Seed aberta para fundos e anjos estratégicos de tecnologia, esportes e fintechs.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={onOpenPitchModal}
                className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Solicitar Pitch Deck & One-Pager</span>
              </button>

              <button
                onClick={onEnterApp}
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <span>Entrar no App Operacional (Sandbox)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <span>© 2026 Na Prancheta. Todos os direitos reservados.</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Rastreabilidade Reversa SDD
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
