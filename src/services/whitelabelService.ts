import { request } from './api';
import {
  OnboardingClubPayload,
  OnboardingResponse,
  TenantBranding,
  PlanoAssinatura,
  FaturaCheckoutResponse,
  MinhaAssinaturaResponse,
} from '../types';

export interface ImpersonateResponse {
  message: string;
  impersonating: boolean;
  token: string;
  tenant: TenantBranding;
}

export function applyBrandingToCssVars(branding?: Partial<TenantBranding> | null) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (branding?.cor_primaria) {
    root.style.setProperty('--color-primary', branding.cor_primaria);
    root.style.setProperty('--brand-primary', branding.cor_primaria);
  }
  if (branding?.cor_secundaria) {
    root.style.setProperty('--color-secondary', branding.cor_secundaria);
    root.style.setProperty('--brand-secondary', branding.cor_secundaria);
  }
}

export const whitelabelService = {
  /**
   * Auto-cadastro / Onboarding de uma nova agremiação com gestor e trial de 14 dias
   */
  async onboarding(payload: OnboardingClubPayload): Promise<OnboardingResponse> {
    return request<OnboardingResponse>('/onboarding', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Obtém a identidade visual e dados do tenant ativo
   */
  async getTenantBranding(): Promise<TenantBranding> {
    return request<TenantBranding>('/tenant/branding', {
      method: 'GET',
    });
  },

  /**
   * Atualiza a identidade visual (escudo e cores) da agremiação do usuário
   */
  async updateTenantBranding(data: {
    sigla?: string;
    escudo_url?: string;
    cor_primaria?: string;
    cor_secundaria?: string;
  }): Promise<{ message: string; tenant: TenantBranding }> {
    return request<{ message: string; tenant: TenantBranding }>('/tenant/branding', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Catálogo público de planos disponíveis
   */
  async getPlanos(): Promise<PlanoAssinatura[]> {
    return request<PlanoAssinatura[]>('/planos', {
      method: 'GET',
    });
  },

  /**
   * Inicia checkout gerando cobrança com PIX instantâneo
   */
  async checkoutAssinatura(payload: {
    plano_slug: string;
    ciclo?: 'mensal' | 'anual';
    metodo_pagamento?: 'pix' | 'cartao_credito';
  }): Promise<FaturaCheckoutResponse> {
    return request<FaturaCheckoutResponse>('/assinaturas/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Consulta a situação atual da assinatura do clube do usuário logado
   */
  async getMinhaAssinatura(): Promise<MinhaAssinaturaResponse> {
    return request<MinhaAssinaturaResponse>('/assinaturas/minha', {
      method: 'GET',
    });
  },

  /**
   * Lista todas as agremiações cadastradas (Gestão ROOT)
   */
  async getTimesAdmin(): Promise<any[]> {
    return request<any[]>('/admin/times', {
      method: 'GET',
    });
  },

  /**
   * Inicia sessão de personificação de agremiação (ROOT)
   */
  async impersonate(timeId: string): Promise<ImpersonateResponse> {
    return request<ImpersonateResponse>('/admin/impersonate', {
      method: 'POST',
      body: JSON.stringify({ time_id: timeId }),
    });
  },

  /**
   * Encerra a personificação e restaura o contexto original do ROOT
   */
  async stopImpersonate(): Promise<{ message: string; impersonating: boolean }> {
    return request<{ message: string; impersonating: boolean }>('/admin/stop-impersonate', {
      method: 'POST',
    });
  },
};
