import React, { useState } from 'react';
import { Atleta, TipoVinculo, NivelAcesso } from '../types';
import { X, UserPlus, Check, Shirt, Phone, User, Shield } from 'lucide-react';

interface SelfOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAtleta: (novoAtleta: Atleta) => void;
}

export const SelfOnboardingModal: React.FC<SelfOnboardingModalProps> = ({
  isOpen,
  onClose,
  onAddAtleta,
}) => {
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [telefone, setTelefone] = useState('');
  const [posicaoPrincipal, setPosicaoPrincipal] = useState('Meio-Campo');
  const [posicaoSecundaria, setPosicaoSecundaria] = useState('Volante');
  const [numeroCamisa, setNumeroCamisa] = useState<number | ''>('');
  const [tamanhoCamisa, setTamanhoCamisa] = useState('G');
  const [tamanhoCalcao, setTamanhoCalcao] = useState('G');
  const [numeroCalcado, setNumeroCalcado] = useState<number | ''>(41);
  const [tipoVinculo, setTipoVinculo] = useState<TipoVinculo>('mensalista');

  if (!isOpen) return null;

  const posicoesDisponiveis = [
    'Goleiro',
    'Zagueiro',
    'Lateral Direito',
    'Lateral Esquerdo',
    'Volante',
    'Meio-Campo',
    'Ponta Direita',
    'Ponta Esquerda',
    'Centroavante',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert('Informe ao menos o nome do atleta.');
      return;
    }

    const novo: Atleta = {
      id: `atl-${Date.now()}`,
      nome: nome.trim(),
      apelido: apelido.trim() || undefined,
      telefone: telefone.trim() || undefined,
      posicao_principal: posicaoPrincipal,
      posicao_secundaria: posicaoSecundaria || undefined,
      numero_camisa: numeroCamisa !== '' ? Number(numeroCamisa) : undefined,
      tipo_vinculo: tipoVinculo,
      nivel_acesso: 'atleta',
      tamanho_camisa: tamanhoCamisa,
      tamanho_calcao: tamanhoCalcao,
      numero_calcado: numeroCalcado !== '' ? Number(numeroCalcado) : undefined,
      ativo: true,
      criado_em: new Date().toISOString(),
      chegou_vestiario: true,
      chegou_em: 'T-50 min (No Horário)'
    };

    onAddAtleta(novo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-100">
                Self-Onboarding do Atleta
              </h3>
              <p className="text-xs text-zinc-400">Cadastro rápido para novos membros do elenco</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition active:scale-[0.98]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {/* Nome e Apelido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: João Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Apelido de Vestiário
              </label>
              <input
                type="text"
                placeholder="Ex: Canhão, Russo, Japa"
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Telefone WhatsApp & Camisa Preferida */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                WhatsApp (com DDD)
              </label>
              <input
                type="tel"
                placeholder="(11) 98765-4321"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Nº de Camisa Preferido
              </label>
              <input
                type="number"
                min="1"
                max="99"
                placeholder="Ex: 10"
                value={numeroCamisa}
                onChange={(e) => setNumeroCamisa(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Posições */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Posição Principal *
              </label>
              <select
                value={posicaoPrincipal}
                onChange={(e) => setPosicaoPrincipal(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none"
              >
                {posicoesDisponiveis.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Posição Secundária
              </label>
              <select
                value={posicaoSecundaria}
                onChange={(e) => setPosicaoSecundaria(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none"
              >
                <option value="">Nenhuma</option>
                {posicoesDisponiveis.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tamanhos de Uniforme e Calçado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Camisa
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['P', 'M', 'G', 'GG'].map((tam) => (
                  <button
                    type="button"
                    key={tam}
                    onClick={() => setTamanhoCamisa(tam)}
                    className={`py-2 rounded-xl text-xs font-bold border transition active:scale-[0.98] ${
                      tamanhoCamisa === tam
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {tam}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Calção
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['P', 'M', 'G', 'GG'].map((tam) => (
                  <button
                    type="button"
                    key={tam}
                    onClick={() => setTamanhoCalcao(tam)}
                    className={`py-2 rounded-xl text-xs font-bold border transition active:scale-[0.98] ${
                      tamanhoCalcao === tam
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {tam}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Calçado (Chuteira)
              </label>
              <input
                type="number"
                min={25}
                max={50}
                placeholder="Ex: 41"
                value={numeroCalcado}
                onChange={(e) => setNumeroCalcado(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Vínculo */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Tipo de Vínculo com o Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipoVinculo('mensalista')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition active:scale-[0.98] ${
                  tipoVinculo === 'mensalista'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                }`}
              >
                Mensalista Oficial
              </button>
              <button
                type="button"
                onClick={() => setTipoVinculo('convidado')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition active:scale-[0.98] ${
                  tipoVinculo === 'convidado'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                }`}
              >
                Convidado da Rodada
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-sm transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Concluir Cadastro no Elenco</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
