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

  const hasRole = (roles: NivelAcesso | NivelAcesso[]): boolean => {
    if (!user) return false;
    if (activeRole === 'geral') return true;

    if (Array.isArray(roles)) {
      return roles.includes(activeRole);
    }
    return activeRole === roles;
  };

  const canAccessTab = (tab: 'jogo' | 'tatica' | 'financeiro' | 'scout' | 'almoxarifado'): boolean => {
    // Ficha de Jogo e Scout são acessíveis a todos os atletas e membros
    if (tab === 'jogo' || tab === 'scout') {
      return true;
    }

    // Usuário administrador geral tem acesso universal
    if (activeRole === 'geral') {
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
