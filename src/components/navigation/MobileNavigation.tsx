import React from 'react';
import { 
  Shirt, 
  Users, 
  ClipboardList, 
  DollarSign, 
  MoreHorizontal 
} from 'lucide-react';
import { MobileTab } from '../../types';

interface MobileNavigationProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  confirmadosCount?: number;
  totalConvocados?: number;
  caixaPendente?: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  onTabChange,
  confirmadosCount,
  totalConvocados,
  caixaPendente,
}) => {
  const tabs = [
    {
      id: 'vestiario' as MobileTab,
      label: 'Vestiário',
      icon: Shirt,
    },
    {
      id: 'presenca' as MobileTab,
      label: 'Presença',
      icon: Users,
      badge: confirmadosCount !== undefined ? `${confirmadosCount}` : undefined,
    },
    {
      id: 'tatica' as MobileTab,
      label: 'Tática',
      icon: ClipboardList,
    },
    {
      id: 'caixa' as MobileTab,
      label: 'Caixa',
      icon: DollarSign,
      dotBadge: caixaPendente,
    },
    {
      id: 'mais' as MobileTab,
      label: 'Mais',
      icon: MoreHorizontal,
    },
  ];

  return (
    <nav
      aria-label="Navegação Principal Mobile"
      className="mobile-bottom-nav fixed bottom-0 inset-x-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 pb-safe md:hidden select-none"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-stretch">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`touch-target flex flex-col items-center justify-center relative py-1 px-0.5 transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 font-medium'
              }`}
            >
              {/* Indicador de barra ativa no topo do item */}
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              )}

              {/* Ícone com badges */}
              <div className="relative flex items-center justify-center w-7 h-7">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />

                {/* Badge numérico de contagem */}
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 min-w-4 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}

                {/* Badge ponto indicador */}
                {tab.dotBadge && (
                  <span className="absolute top-0 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-zinc-950" />
                )}
              </div>

              {/* Legenda curta */}
              <span className={`text-[11px] tracking-tight mt-0.5 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
