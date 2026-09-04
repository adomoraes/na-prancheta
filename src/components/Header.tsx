import React from 'react';
import { NivelAcesso } from '../types';
import { Shield, Clock, Users, DollarSign, Package, UserPlus } from 'lucide-react';

interface HeaderProps {
  nivelAcesso: NivelAcesso;
  setNivelAcesso: (nivel: NivelAcesso) => void;
  onOpenOnboarding: () => void;
  isTesoureiroDia: boolean;
  setIsTesoureiroDia: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  nivelAcesso,
  setNivelAcesso,
  onOpenOnboarding,
  isTesoureiroDia,
  setIsTesoureiroDia,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 text-zinc-100 px-4 py-3 shadow-sm">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand & Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shadow-sm">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-zinc-100 font-['Cabinet_Grotesk',sans-serif]">
                  Na Prancheta
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  PoC v1.0
                </span>
              </div>
              <p className="text-xs text-zinc-400">Gestão Esportiva & Vestiário Amador</p>
            </div>
          </div>

          <button
            onClick={onOpenOnboarding}
            className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-xs font-semibold text-white shadow-sm transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Cadastrar</span>
          </button>
        </div>

        {/* Role switcher & Onboarding button */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="text-[11px] text-zinc-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
            <span>Visão:</span>
          </div>

          <button
            onClick={() => setNivelAcesso('atleta')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              nivelAcesso === 'atleta' && !isTesoureiroDia
                ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800/80 hover:bg-zinc-800/60 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Elenco</span>
          </button>

          <button
            onClick={() => {
              setNivelAcesso('tecnico');
              setIsTesoureiroDia(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              nivelAcesso === 'tecnico'
                ? 'bg-zinc-800 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800/80 hover:bg-zinc-800/60 hover:text-zinc-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Comissão Técnica</span>
          </button>

          <button
            onClick={() => {
              setNivelAcesso('financeiro');
              setIsTesoureiroDia(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              isTesoureiroDia
                ? 'bg-zinc-800 text-amber-400 border border-amber-500/30 shadow-sm'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800/80 hover:bg-zinc-800/60 hover:text-zinc-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Tesoureiro do Dia</span>
          </button>

          <button
            onClick={() => {
              setNivelAcesso('almoxarifado');
              setIsTesoureiroDia(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              nivelAcesso === 'almoxarifado'
                ? 'bg-zinc-800 text-purple-400 border border-purple-500/30 shadow-sm'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800/80 hover:bg-zinc-800/60 hover:text-zinc-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Almoxarifado</span>
          </button>

          <button
            onClick={onOpenOnboarding}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-xs font-semibold text-white shadow-sm ml-2 whitespace-nowrap transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Novo Atleta</span>
          </button>
        </div>
      </div>
    </header>
  );
};
