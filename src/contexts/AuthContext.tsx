import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, NivelAcesso, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeRole: NivelAcesso;
  setActiveRole: (role: NivelAcesso) => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginWithCredentials: (login: string, password?: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginAsDevProfile: (role: NivelAcesso) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: NivelAcesso | NivelAcesso[]) => boolean;
  canAccessTab: (tab: 'jogo' | 'tatica' | 'financeiro' | 'scout' | 'almoxarifado') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'naprancheta_user';
const TOKEN_STORAGE_KEY = 'na_prancheta_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<NivelAcesso>(() => {
    return user?.role || 'atleta';
  });

  // Atualiza activeRole quando o usuário mudar
  useEffect(() => {
    if (user?.role) {
      setActiveRole(user.role);
    }
  }, [user]);

  // Hidratação e verificação da sessão na montagem
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (isMounted && res.user) {
          setUser(res.user);
          setActiveRole(res.user.role);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
        }
      } catch (err) {
        console.warn('Falha ao validar sessão atual na API:', err);
        // Mantém dados em cache local se disponível (modo offline / contingência)
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.token);
    setActiveRole(data.user.role);
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    setIsLoginModalOpen(false);
  };

  const loginWithCredentials = async (login: string, password?: string) => {
    setIsLoading(true);
    try {
      const data = await api.login(login, password);
      handleAuthSuccess(data);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true);
    try {
      const data = await api.loginGoogle(credential);
      handleAuthSuccess(data);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDevProfile = async (role: NivelAcesso) => {
    setIsLoading(true);
    try {
      const data = await api.devLogin(role);
      handleAuthSuccess(data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } finally {
      setUser(null);
      setToken(null);
      setActiveRole('atleta');
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setIsLoading(false);
    }
  };

  // Listener de expiração de sessão (capturado via erro HTTP 401 do interceptador)
  const [sessionToast, setSessionToast] = useState<string | null>(null);

  useEffect(() => {
    const handleSessionExpired = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      const msg = customEvent.detail?.message || 'Sessão expirada. Faça login novamente.';
      setUser(null);
      setToken(null);
      setActiveRole('atleta');
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setSessionToast(msg);
      setIsLoginModalOpen(true);

      setTimeout(() => {
        setSessionToast(null);
      }, 6000);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);

  const hasRole = (roles: NivelAcesso | NivelAcesso[]): boolean => {
    if (!user) return false;
    if (activeRole === 'geral') return true;

    if (Array.isArray(roles)) {
      return roles.includes(activeRole);
    }
    return activeRole === roles;
  };

  const canAccessTab = (tab: 'jogo' | 'tatica' | 'financeiro' | 'scout' | 'almoxarifado'): boolean => {
    // Ficha de Jogo (cronômetro T-50, GPS e adversário) é pública para visitantes
    if (tab === 'jogo') {
      return true;
    }

    // Todas as demais abas operacionais exigem autenticação obrigatória
    if (!user) {
      return false;
    }

    // Administrador geral tem acesso universal a todas as abas
    if (activeRole === 'geral') {
      return true;
    }

    // Atletas e comissão técnica autenticados podem ver scouts
    if (tab === 'scout') {
      return true;
    }

    if (tab === 'tatica') {
      return activeRole === 'tecnico';
    }

    if (tab === 'financeiro') {
      return activeRole === 'financeiro';
    }

    if (tab === 'almoxarifado') {
      return activeRole === 'almoxarifado';
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        activeRole,
        setActiveRole,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        loginWithCredentials,
        loginWithGoogle,
        loginAsDevProfile,
        logout,
        hasRole,
        canAccessTab,
      }}
    >
      {sessionToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-red-950/90 border border-red-500/30 rounded-xl shadow-2xl backdrop-blur-md text-red-200 text-sm">
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">{sessionToast}</span>
          <button
            onClick={() => setSessionToast(null)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-red-400"
          >
            ✕
          </button>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
