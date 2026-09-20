import React, { useState, useRef, useEffect } from 'react';
import { NivelAcesso } from '../types';
import { useAuth } from '../contexts/AuthContext';
import {
  Shield,
  Clock,
  Users,
  DollarSign,
  Package,
  UserPlus,
  Download,
  LogIn,
  LogOut,
  ChevronDown,
  Sparkles,
  KeyRound,
} from 'lucide-react';

interface HeaderProps {
  onOpenOnboarding: () => void;
  apiConnected?: boolean;
  canInstallPwa?: boolean;
  onInstallPwa?: () => void;
}

const ROLE_CONFIG: Record<
  NivelAcesso,
  { label: string; badgeClass: string; icon: any }
> = {
  atleta: {
    label: 'Atleta',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: Users,
  },
  tecnico: {
    label: 'Comissão Técnica',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    icon: Clock,
  },
  financeiro: {
    label: 'Tesoureiro do Dia',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: DollarSign,
  },
  almoxarifado: {
    label: 'Almoxarifado',
    badgeClass: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    icon: Package,
  },
  geral: {
    label: 'Diretoria / Geral',
    badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/30 font-extrabold',
    icon: Shield,
  },
};

export const Header: React.FC<HeaderProps> = ({
  onOpenOnboarding,
  apiConnected = true,
  canInstallPwa = false,
  onInstallPwa,
}) => {
  const { user, isAuthenticated, activeRole, setActiveRole, logout, openLoginModal } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const roleMeta = ROLE_CONFIG[activeRole] || ROLE_CONFIG.atleta;
  const RoleIcon = roleMeta.icon;

  // Fecha o menu de perfil ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 text-zinc-100 px-4 py-3 shadow-sm">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand & Status */}
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
                  Target v2.0
                </span>
                <span
                  className={`text-[9px] font-semibold tracking-wide px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                    apiConnected
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                  }`}
                  title={
                    apiConnected
                      ? 'Conectado à API Laravel 11 com PostgreSQL 16'
                      : 'Modo de contingência LocalStorage'
                  }
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      apiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  ></span>
                  {apiConnected ? 'Laravel 11 + PG16' : 'Offline'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">Gestão Esportiva & Vestiário Amador</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={onOpenOnboarding}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Cadastrar</span>
            </button>
          </div>
        </div>

        {/* Auth Profile Widget & Quick Actions */}
        <div className="flex items-center gap-2 justify-end">
          {canInstallPwa && onInstallPwa && (
            <button
              onClick={onInstallPwa}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition active:scale-95 whitespace-nowrap"
              title="Instalar Na Prancheta no seu dispositivo"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalar</span>
            </button>
          )}

          <button
            onClick={onOpenOnboarding}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold transition"
          >
            <UserPlus className="w-3.5 h-3.5 text-zinc-400" />
            <span>Novo Atleta</span>
          </button>

          {/* Autenticado vs Não Autenticado */}
          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition active:scale-[0.98]"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-zinc-700"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-zinc-200 leading-tight flex items-center gap-1.5">
                    <span>{user.atleta?.apelido || user.name.split(' ')[0]}</span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-full border ${roleMeta.badgeClass}`}
                  >
                    <RoleIcon className="w-2.5 h-2.5" />
                    <span>{roleMeta.label}</span>
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-zinc-800/80 mb-1">
                    <p className="text-xs font-bold text-zinc-100">{user.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {user.email || user.phone || 'Sem e-mail cadastrado'}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                        Responsabilidade:
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleMeta.badgeClass}`}
                      >
                        {roleMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* Comutador de visão para usuários Gerais / Administradores */}
                  {user.role === 'geral' && (
                    <div className="p-2 border-b border-zinc-800/80 mb-1 bg-zinc-950/40 rounded-lg">
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>Simular Visão Operacional</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        {(['atleta', 'tecnico', 'financeiro', 'almoxarifado', 'geral'] as NivelAcesso[]).map(
                          (r) => (
                            <button
                              key={r}
                              onClick={() => {
                                setActiveRole(r);
                                setIsUserMenuOpen(false);
                              }}
                              className={`px-2 py-1 rounded text-left transition ${
                                activeRole === r
                                  ? 'bg-zinc-800 text-emerald-400 font-bold'
                                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                              }`}
                            >
                              {ROLE_CONFIG[r].label}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openLoginModal();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-lg transition"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Trocar de Perfil / Conta</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition mt-0.5"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Encerrar Sessão (Sair)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-xs font-bold text-white shadow-md shadow-emerald-950/40 transition whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
