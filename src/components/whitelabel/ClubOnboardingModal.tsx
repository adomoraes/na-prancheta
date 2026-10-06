import React, { useState } from 'react';
import {
  X,
  Shield,
  Sparkles,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Zap,
} from 'lucide-react';
import { OnboardingClubPayload, OnboardingResponse } from '../../types';
import { whitelabelService, applyBrandingToCssVars } from '../../services/whitelabelService';

interface ClubOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (response: OnboardingResponse) => void;
}

export const ClubOnboardingModal: React.FC<ClubOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [nomeClube, setNomeClube] = useState('');
  const [sigla, setSigla] = useState('');
  const [modalidade, setModalidade] = useState('Futebol de Campo');

  const [nomeGestor, setNomeGestor] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  if (!isOpen) return null;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!nomeClube.trim()) {
      setErrorMsg('Por favor, informe o nome da sua agremiação.');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!nomeGestor.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Preencha os campos obrigatórios (Nome, E-mail e Senha).');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha deve possuir no mínimo 6 caracteres.');
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorMsg('A confirmação de senha não confere com a senha digitada.');
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);

    const payload: OnboardingClubPayload = {
      nome_clube: nomeClube.trim(),
      sigla: sigla.trim() ? sigla.trim().toUpperCase() : undefined,
      modalidade,
      nome_gestor: nomeGestor.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      password,
      password_confirmation: passwordConfirmation,
    };

    try {
      const response = await whitelabelService.onboarding(payload);

      // Salva sessão no localStorage
      localStorage.setItem('na_prancheta_token', response.token);
      localStorage.setItem('naprancheta_user', JSON.stringify(response.user));

      // Aplica as cores padrão
      applyBrandingToCssVars(response.tenant);

      if (onSuccess) {
        onSuccess(response);
      } else {
        // Recarrega suavemente para hidratar o novo clube
        window.location.reload();
      }
    } catch (err: any) {
      console.error('Falha no onboarding:', err);
      setErrorMsg(err.message || 'Erro ao registrar agremiação. Verifique os dados e tente novamente.');
      setStep(2); // Volta ao formulário do gestor em caso de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-emerald-950/60 via-zinc-900 to-zinc-950 border-b border-zinc-800/80">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Crie a Sua Prancheta
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Onboarding da Agremiação
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400">
            Cadastre seu clube em menos de 1 minuto e ganhe 14 dias grátis de acesso total.
          </p>

          {/* Progress Indicator */}
          <div className="mt-5 flex items-center gap-2">
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step >= 1 ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step >= 2 ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step >= 3 ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            />
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 sm:mx-8 mt-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
            <span className="shrink-0 text-red-400 font-bold">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Dados do Clube */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Nome da Agremiação *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Real Matismo FC, EC Vila Nova"
                value={nomeClube}
                onChange={(e) => setNomeClube(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm placeholder-zinc-500 transition outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Sigla do Clube
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Ex: RMT, VIL"
                  value={sigla}
                  onChange={(e) => setSigla(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm placeholder-zinc-500 uppercase transition outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Modalidade Principal
                </label>
                <select
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm transition outline-none"
                >
                  <option value="Futebol de Campo">Futebol de Campo (11x11)</option>
                  <option value="Futebol Society">Futebol Society (Fut 7)</option>
                  <option value="Futsal">Futsal (5x5)</option>
                  <option value="Futebol de Areia">Futebol de Areia / Beach Soccer</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                Próximo: Dados do Gestor
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Dados do Gestor */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Nome do Gestor / Presidente *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={nomeGestor}
                  onChange={(e) => setNomeGestor(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm placeholder-zinc-500 transition outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  E-mail Oficial *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="gestor@clube.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm placeholder-zinc-500 transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  WhatsApp / Celular
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm placeholder-zinc-500 transition outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Senha de Acesso *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 dígitos"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm placeholder-zinc-500 transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    required
                    placeholder="Repita a senha"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm placeholder-zinc-500 transition outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-zinc-400 hover:text-white text-sm font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                Revisar e Ativar Trial
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Benefício & Trial de 14 dias */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Plano Campeão Liberado Grátis
                  </h4>
                  <p className="text-xs text-emerald-400 font-medium">
                    14 dias de degustação completa • Sem cartão de crédito
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-4 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Escalações, Prancheta Tática e Cronômetro T-50</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Até 3 elencos e 100 atletas no vestiário</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Personalização visual com cores e escudo do seu clube</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Gestão financeira, caixinha do jogo e almoxarifado</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 space-y-1">
              <p className="font-semibold text-zinc-200">Resumo do cadastro:</p>
              <p>• Clube: <span className="text-white font-medium">{nomeClube} ({sigla || 'Sem sigla'})</span></p>
              <p>• Gestor: <span className="text-white font-medium">{nomeGestor}</span> ({email})</p>
              <p>• Modalidade: <span className="text-white font-medium">{modalidade}</span></p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-zinc-400 hover:text-white text-sm font-semibold transition disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm rounded-xl transition shadow-xl shadow-emerald-500/25 active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Criando Agremiação...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black" />
                    Ativar Meu Clube Agora
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
