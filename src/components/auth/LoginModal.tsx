import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Shield,
  Lock,
  Mail,
  Users,
  Clock,
  DollarSign,
  Package,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NivelAcesso } from '../../types';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEV_PROFILES: {
  role: NivelAcesso;
  nome: string;
  apelido: string;
  funcao: string;
  avatar: string;
  color: string;
  border: string;
  icon: any;
}[] = [
  {
    role: 'atleta',
    nome: 'Lucas Silva',
    apelido: 'Lucão',
    funcao: 'Goleiro / Camisa 1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80',
    color: 'text-emerald-400 bg-emerald-500/10',
    border: 'border-emerald-500/30 hover:border-emerald-500/70',
    icon: Users,
  },
  {
    role: 'tecnico',
    nome: 'Comissão Técnica',
    apelido: 'Treinador',
    funcao: 'Prancheta & Tática (T-35)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80',
    color: 'text-blue-400 bg-blue-500/10',
    border: 'border-blue-500/30 hover:border-blue-500/70',
    icon: Clock,
  },
  {
    role: 'financeiro',
    nome: 'Thiago Oliveira',
    apelido: 'Thiaguinho',
    funcao: 'Tesoureiro do Dia (PIX)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&q=80',
    color: 'text-amber-400 bg-amber-500/10',
    border: 'border-amber-500/30 hover:border-amber-500/70',
    icon: DollarSign,
  },
  {
    role: 'almoxarifado',
    nome: 'José Santos',
    apelido: 'Seu Zé',
    funcao: 'Almoxarifado & Malas',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&q=80',
    color: 'text-pink-400 bg-pink-500/10',
    border: 'border-pink-500/30 hover:border-pink-500/70',
    icon: Package,
  },
  {
    role: 'geral',
    nome: 'Rodrigo Medeiros',
    apelido: 'Digão',
    funcao: 'Diretoria / Gestor Geral',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&q=80',
    color: 'text-emerald-300 bg-emerald-500/10',
    border: 'border-emerald-500/30 hover:border-emerald-500/70',
    icon: Shield,
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithCredentials, loginWithGoogle, loginAsDevProfile } = useAuth();
  const [tab, setTab] = useState<'google' | 'credenciais' | 'dev'>('google');
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('na-prancheta-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Inicialização do Google Identity Services (GIS)
  useEffect(() => {
    if (!isOpen) return;

    if (window.google?.accounts?.id && googleClientId && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response.credential) {
              setIsSubmitting(true);
              setErrorMessage(null);
              try {
                await loginWithGoogle(response.credential);
                onClose();
              } catch (err: any) {
                setErrorMessage(err.message || 'Falha ao autenticar com o Google.');
              } finally {
                setIsSubmitting(false);
              }
            }
          },
        });

        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 320,
        });
      } catch (e) {
        console.warn('Erro ao inicializar botão GIS do Google:', e);
      }
    }
  }, [isOpen, googleClientId]);

  if (!isOpen) return null;

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      setErrorMessage('Por favor, informe seu telefone ou e-mail.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await loginWithCredentials(loginInput, password);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Credenciais inválidas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevLogin = async (role: NivelAcesso) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await loginAsDevProfile(role);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao carregar perfil de teste.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoGoogleLogin = async (role: NivelAcesso = 'atleta') => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle(`demo-google-token:${role}`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao simular login Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-zinc-100 font-['Cabinet_Grotesk',sans-serif]">
                Acesso ao Vestiário
              </h3>
              <p className="text-[11px] text-zinc-400">Autenticação e Responsabilidade</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs de Seleção */}
        <div className="grid grid-cols-3 border-b border-zinc-800/80 bg-zinc-950/40 text-xs font-semibold p-1 gap-1">
          <button
            onClick={() => setTab('google')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              tab === 'google'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            onClick={() => setTab('credenciais')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              tab === 'credenciais'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Telefone/Senha</span>
          </button>

          <button
            onClick={() => setTab('dev')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              tab === 'dev'
                ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Perfis Demo</span>
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN GOOGLE */}
          {tab === 'google' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Acesse o sistema com sua conta do Google com um clique. Seu perfil e permissões
                serão associados automaticamente.
              </p>

              {/* Botão Oficial Google (caso Client ID configurado) */}
              <div className="flex justify-center my-2">
                <div ref={googleBtnRef}></div>
              </div>

              {/* Botão de Contingência / Simulação se Client ID não configurado no console */}
              {!googleClientId && (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-left space-y-2.5">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Configuração do Google Client ID</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Para habilitar o pop-up real do Google em produção, defina{' '}
                    <code className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-200">
                      VITE_GOOGLE_CLIENT_ID
                    </code>{' '}
                    no arquivo <code className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-200">.env</code>.
                  </p>
                  <button
                    onClick={() => handleDemoGoogleLogin('atleta')}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] text-xs font-semibold text-zinc-100 transition border border-zinc-700 shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Simular Login Google (Modo Dev)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREDENCIAIS TELEFONE/EMAIL */}
          {tab === 'credenciais' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Telefone ou E-mail
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="11987654321 ou lucao@naprancheta.com.br"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                  />
                  <Mail className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  💡 Senha padrão do elenco de demonstração: <code>na-prancheta-2026</code>
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-xs font-semibold text-white shadow-md shadow-emerald-950/40 transition disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Autenticando...' : 'Entrar no Vestiário'}
              </button>
            </form>
          )}

          {/* TAB 3: PERFIS RÁPIDOS DE DEMO */}
          {tab === 'dev' && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-400 mb-2">
                Selecione um perfil de teste para testar o direcionamento de responsabilidades no
                vestiário:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {DEV_PROFILES.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.role}
                      onClick={() => handleDevLogin(p.role)}
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/70 border ${p.border} transition text-left active:scale-[0.99]`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatar}
                          alt={p.nome}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-100">{p.apelido}</span>
                            <span className="text-[11px] text-zinc-500">({p.nome})</span>
                          </div>
                          <p className="text-[10px] text-zinc-400">{p.funcao}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${p.color} border border-current/20 flex items-center gap-1`}>
                        <Icon className="w-3 h-3" />
                        <span>{p.role}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
