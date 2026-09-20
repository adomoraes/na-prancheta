import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NivelAcesso } from '../types';

interface AcessoRestritoProps {
  moduloNome: string;
  papelNecessario: string;
  onGoBack: () => void;
}

const ROLE_LABELS: Record<NivelAcesso, string> = {
  atleta: 'Atleta / Elenco',
  tecnico: 'Comissão Técnica',
  financeiro: 'Tesoureiro do Dia',
  almoxarifado: 'Almoxarifado & Patrimônio',
  geral: 'Diretoria / Gestão Geral',
};

export const AcessoRestrito: React.FC<AcessoRestritoProps> = ({
  moduloNome,
  papelNecessario,
  onGoBack,
}) => {
  const { user, activeRole, openLoginModal } = useAuth();

  return (
    <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-center max-w-lg mx-auto my-8 shadow-xl backdrop-blur-sm">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="w-8 h-8 text-amber-400" />
      </div>

      <h2 className="text-xl font-extrabold text-zinc-100 font-['Cabinet_Grotesk',sans-serif] tracking-tight mb-2">
        Acesso Restrito: {moduloNome}
      </h2>

      <p className="text-sm text-zinc-400 leading-relaxed mb-6">
        Este módulo possui governança estrita de vestiário e requer permissão de{' '}
        <strong className="text-amber-300 font-semibold">{papelNecessario}</strong>.
      </p>

      <div className="bg-zinc-950/80 rounded-xl p-3.5 mb-6 text-xs text-zinc-300 border border-zinc-800 text-left flex items-center justify-between">
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">
            Seu Usuário Atual
          </span>
          <span className="font-semibold text-zinc-100">
            {user ? user.name : 'Visitante não autenticado'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">
            Papel Ativo
          </span>
          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
            {ROLE_LABELS[activeRole] || activeRole}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onGoBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Ficha do Jogo</span>
        </button>

        <button
          onClick={openLoginModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition active:scale-[0.98]"
        >
          <LogIn className="w-4 h-4" />
          <span>Trocar de Conta / Login</span>
        </button>
      </div>
    </div>
  );
};
