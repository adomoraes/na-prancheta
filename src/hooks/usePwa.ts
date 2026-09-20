import { useState, useEffect, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const STORAGE_KEY_DISMISSED = 'na_prancheta_pwa_install_dismissed';
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

export function usePwa() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);

  // Registro do Service Worker via vite-plugin-pwa (registerType: 'prompt')
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Checar atualizações periodicamente a cada 1 hora
        setInterval(() => {
          r.update().catch(() => {});
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('Erro ao registrar Service Worker do PWA:', error);
    },
  });

  // Verificar se já está rodando em modo standalone (PWA instalado)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(Boolean(isStandalone));
    };

    checkStandalone();
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);

    return () => mediaQuery.removeEventListener('change', checkStandalone);
  }, []);

  // Monitorar status de rede (Online / Offline)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Verificar histórico de dismiss do banner
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const dismissedAt = localStorage.getItem(STORAGE_KEY_DISMISSED);
      if (dismissedAt) {
        const timePassed = Date.now() - parseInt(dismissedAt, 10);
        if (timePassed < DISMISS_COOLDOWN_MS) {
          setIsBannerDismissed(true);
        } else {
          localStorage.removeItem(STORAGE_KEY_DISMISSED);
        }
      }
    } catch {
      // localStorage indisponível/bloqueado
    }
  }, []);

  // Capturar evento beforeinstallprompt do navegador
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Disparar o prompt nativo de instalação
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.warn('Falha no prompt de instalação PWA:', err);
    }
    return false;
  }, [deferredPrompt]);

  // Dispensar o banner temporariamente
  const dismissBanner = useCallback(() => {
    setIsBannerDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY_DISMISSED, Date.now().toString());
    } catch {
      // Ignora erro de quota ou storage privado
    }
  }, []);

  // Atualizar para a nova versão do Service Worker
  const reloadApp = useCallback(() => {
    updateServiceWorker(true);
  }, [updateServiceWorker]);

  // Fechar o toast de atualização sem recarregar agora
  const closeUpdateToast = useCallback(() => {
    setNeedRefresh(false);
  }, [setNeedRefresh]);

  // Detectar se é iOS (Safari) para instrução alternativa de instalação
  const isIos =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as unknown as { MSStream?: unknown }).MSStream;

  return {
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
  };
}
