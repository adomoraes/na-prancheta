import React, { useState } from 'react';
import { ShieldAlert, LogOut, RefreshCw } from 'lucide-react';
import { whitelabelService } from '../../services/whitelabelService';

interface ImpersonationBannerProps {
  clubName: string;
  onExit: () => void;
}

export const ImpersonationBanner: React.FC<ImpersonationBannerProps> = ({
  clubName,
  onExit,
}) => {
  const [loading, setLoading] = useState(false);

  const handleStop = async () => {
    setLoading(true);
    try {
      await whitelabelService.stopImpersonate();
      onExit();
    } catch (err) {
      console.error('Erro ao encerrar personificação:', err);
      // Mesmo com erro de rede, encerra localmente
      onExit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold shadow-md z-40 relative flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2 min-w-0">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
        <span className="truncate">
          <strong>Modo de Suporte ROOT Ativo:</strong> Você está visualizando e operando como a agremiação <span className="underline decoration-white/40">{clubName}</span>.
        </span>
      </div>

      <button
        type="button"
        onClick={handleStop}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/40 hover:bg-black/60 text-white text-[11px] font-extrabold rounded-lg border border-white/20 transition active:scale-95 shrink-0 cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <RefreshCw className="w-3 h-3 animate-spin" />
        ) : (
          <LogOut className="w-3 h-3" />
        )}
        Encerrar Suporte
      </button>
    </div>
  );
};
