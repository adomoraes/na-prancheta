import React, { useState, useEffect } from 'react';
import { X, Shield, Palette, Image as ImageIcon, Check, Sparkles, RefreshCw } from 'lucide-react';
import { TenantBranding } from '../../types';
import { whitelabelService, applyBrandingToCssVars } from '../../services/whitelabelService';

interface TenantBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: TenantBranding | null;
  onTenantUpdated: (updatedTenant: TenantBranding) => void;
}

const PRESET_PALETTES = [
  { name: 'Alviverde', primary: '#16a34a', secondary: '#ffffff' },
  { name: 'Rubro-Negro', primary: '#dc2626', secondary: '#09090b' },
  { name: 'Alvinegro', primary: '#18181b', secondary: '#ffffff' },
  { name: 'Celeste / Marinho', primary: '#0284c7', secondary: '#0f172a' },
  { name: 'Tricolor Paulista', primary: '#dc2626', secondary: '#ffffff' },
  { name: 'Grená & Dourado', primary: '#881337', secondary: '#eab308' },
  { name: 'Canarinho', primary: '#eab308', secondary: '#16a34a' },
  { name: 'Azul Real', primary: '#2563eb', secondary: '#f8fafc' },
];

export const TenantBrandingModal: React.FC<TenantBrandingModalProps> = ({
  isOpen,
  onClose,
  tenant,
  onTenantUpdated,
}) => {
  const [sigla, setSigla] = useState(tenant?.sigla || '');
  const [escudoUrl, setEscudoUrl] = useState(tenant?.escudo_url || '');
  const [corPrimaria, setCorPrimaria] = useState(tenant?.cor_primaria || '#16a34a');
  const [corSecundaria, setCorSecundaria] = useState(tenant?.cor_secundaria || '#ffffff');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (tenant) {
      setSigla(tenant.sigla || '');
      setEscudoUrl(tenant.escudo_url || '');
      setCorPrimaria(tenant.cor_primaria || '#16a34a');
      setCorSecundaria(tenant.cor_secundaria || '#ffffff');
    }
  }, [tenant]);

  if (!isOpen) return null;

  const handleApplyPalette = (primary: string, secondary: string) => {
    setCorPrimaria(primary);
    setCorSecundaria(secondary);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await whitelabelService.updateTenantBranding({
        sigla: sigla.trim() ? sigla.trim().toUpperCase() : undefined,
        escudo_url: escudoUrl.trim() || undefined,
        cor_primaria: corPrimaria,
        cor_secundaria: corSecundaria,
      });

      // Aplica imediatamente as novas cores nas variáveis CSS do tema
      applyBrandingToCssVars({
        cor_primaria: corPrimaria,
        cor_secundaria: corSecundaria,
      });

      const updated = {
        ...(tenant || ({} as TenantBranding)),
        ...response.tenant,
      };

      onTenantUpdated(updated);
      setSuccessMsg('Identidade visual salva e aplicada com sucesso!');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Falha ao salvar branding:', err);
      setErrorMsg(err.message || 'Erro ao salvar identidade visual.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative p-6 bg-zinc-900/90 border-b border-zinc-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/80 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Identidade Visual do Clube
              </h2>
              <p className="text-xs text-zinc-400">
                Personalize o escudo e as cores oficiais exibidas para todo o elenco.
              </p>
            </div>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-4 bg-zinc-900/40 border-b border-zinc-800/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 block">
            Prévia em Tempo Real
          </span>
          <div
            className="p-3.5 rounded-2xl border border-zinc-700/60 flex items-center justify-between gap-3 shadow-inner"
            style={{ backgroundColor: '#09090b' }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden border shadow-sm shrink-0"
                style={{
                  backgroundColor: corPrimaria,
                  borderColor: corSecundaria,
                }}
              >
                {escudoUrl ? (
                  <img
                    src={escudoUrl}
                    alt="Escudo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Shield className="w-5 h-5" style={{ color: corSecundaria }} />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-white truncate">
                  {tenant?.nome || 'Meu Clube'}
                </h4>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: corPrimaria, backgroundColor: `${corPrimaria}20` }}>
                  {sigla || 'CLB'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition"
              style={{
                backgroundColor: corPrimaria,
                color: corSecundaria === '#ffffff' ? '#ffffff' : '#000000',
              }}
            >
              Exemplo Botão
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            {successMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Sigla Oficial
              </label>
              <input
                type="text"
                maxLength={6}
                value={sigla}
                onChange={(e) => setSigla(e.target.value.toUpperCase())}
                placeholder="Ex: RMT"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                URL do Escudo Oficial
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="url"
                  value={escudoUrl}
                  onChange={(e) => setEscudoUrl(e.target.value)}
                  placeholder="https://exemplo.com/escudo.png"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Color Selectors */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Cor Primária
              </label>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1.5">
                <input
                  type="color"
                  value={corPrimaria}
                  onChange={(e) => setCorPrimaria(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={corPrimaria}
                  onChange={(e) => setCorPrimaria(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono uppercase text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Cor Secundária
              </label>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1.5">
                <input
                  type="color"
                  value={corSecundaria}
                  onChange={(e) => setCorSecundaria(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={corSecundaria}
                  onChange={(e) => setCorSecundaria(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono uppercase text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Preset Palettes */}
          <div className="pt-2">
            <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Paletas Clássicas Sugeridas
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_PALETTES.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPalette(p.primary, p.secondary)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 transition text-left group"
                >
                  <div className="flex -space-x-1 shrink-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/50"
                      style={{ backgroundColor: p.primary }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/50"
                      style={{ backgroundColor: p.secondary }}
                    />
                  </div>
                  <span className="text-[11px] text-zinc-300 group-hover:text-white font-medium truncate">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-zinc-400 hover:text-white text-xs font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Salvar e Aplicar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
