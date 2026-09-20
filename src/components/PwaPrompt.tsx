import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, RefreshCw, X, WifiOff, CheckCircle2, Share } from 'lucide-react';
import { usePwa } from '../hooks/usePwa';

interface PwaPromptProps {
  pwaState: ReturnType<typeof usePwa>;
}

export const PwaPrompt: React.FC<PwaPromptProps> = ({ pwaState }) => {
  const {
    isOnline,
    isInstallable,
    isInstalled,
    isBannerDismissed,
    isIos,
    needRefresh,
    promptInstall,
    dismissBanner,
    reloadApp,
    closeUpdateToast,
  } = pwaState;

  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  // Monitorar transição de offline -> online para feedback breve
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowOnlineToast(true);
      const timer = setTimeout(() => {
        setShowOnlineToast(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return (
    <>
      {/* 1. Barra Indicadora de Status de Rede (Offline / Reconectado) */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            key="offline-bar"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 text-zinc-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-lg backdrop-blur-md"
          >
            <WifiOff className="w-4 h-4 text-zinc-950 animate-pulse" />
            <span>Modo Offline ativado — Ações no vestiário e escalação preservadas localmente</span>
          </motion.div>
        )}

        {isOnline && showOnlineToast && (
          <motion.div
            key="online-bar"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-0 left-0 right-0 z-50 bg-emerald-500/90 text-zinc-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-lg backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-zinc-950" />
            <span>Conexão restabelecida! Sincronização normalizada</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Toast Interativo de Nova Versão (Service Worker Update) */}
      <AnimatePresence>
        {needRefresh && (
          <motion.div
            key="update-toast"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] bg-zinc-900 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-zinc-100 font-['Cabinet_Grotesk'] tracking-wide">
                  Nova versão disponível!
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Uma atualização do Na Prancheta está pronta para ser aplicada.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={reloadApp}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Atualizar Agora
                  </button>
                  <button
                    onClick={closeUpdateToast}
                    className="text-xs font-medium text-zinc-400 hover:text-zinc-200 py-2 px-3 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Mais tarde
                  </button>
                </div>
              </div>
              <button
                onClick={closeUpdateToast}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded-md"
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Banner Contextual Inferior de Instalação (PWA Prompt) */}
      <AnimatePresence>
        {!isInstalled && isInstallable && !isBannerDismissed && (
          <motion.div
            key="install-banner"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-zinc-900/95 border border-zinc-800/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-emerald-500/30 flex items-center justify-center p-2 shrink-0 shadow-inner">
                <img src="/icon.svg" alt="Na Prancheta Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                  Instale o Na Prancheta
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    App
                  </span>
                </h4>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  Acesse direto da tela inicial e use no campo sem internet.
                </p>
              </div>
              <button
                onClick={dismissBanner}
                className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors"
                aria-label="Dispensar sugestão de instalação"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3.5 flex gap-2">
              <button
                onClick={promptInstall}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Instalar no Dispositivo
              </button>
              <button
                onClick={dismissBanner}
                className="text-xs font-medium text-zinc-400 hover:text-zinc-200 py-2.5 px-3 rounded-xl hover:bg-zinc-800/60 transition-colors"
              >
                Agora não
              </button>
            </div>
          </motion.div>
        )}

        {/* Banner alternativo para iOS Safari (não emite beforeinstallprompt) */}
        {!isInstalled && isIos && !isBannerDismissed && (
          <motion.div
            key="ios-install-banner"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-zinc-900/95 border border-zinc-800/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-emerald-500/30 flex items-center justify-center p-1.5 shrink-0">
                <img src="/icon.svg" alt="Na Prancheta Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                  Instalar no iPhone / iPad
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Para instalar: toque no botão de compartilhar <Share className="w-3.5 h-3.5 inline mx-0.5 text-sky-400" /> do Safari e selecione <strong>Adicionar à Tela de Início</strong>.
                </p>
              </div>
              <button
                onClick={dismissBanner}
                className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg"
                aria-label="Dispensar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
