import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Calendar,
  DollarSign,
  Package,
  KeyRound,
  ArrowLeft,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Edit2,
  Trash2,
  Lock,
  Power,
  TrendingUp,
  TrendingDown,
  X,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  AdminUserDTO,
  AdminAtletaDTO,
  AdminPartidaDTO,
  AdminCaixaResponseDTO,
  AdminPatrimonioDTO,
  AdminLocalDTO,
  NivelAcesso,
} from '../../types';

interface AdminDashboardProps {
  onBackToMatch: () => void;
}

type AdminTab = 'users' | 'atletas' | 'partidas' | 'caixa' | 'patrimonio' | 'locais';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToMatch }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Estados dos Dados
  const [users, setUsers] = useState<AdminUserDTO[]>([]);
  const [atletas, setAtletas] = useState<AdminAtletaDTO[]>([]);
  const [partidas, setPartidas] = useState<AdminPartidaDTO[]>([]);
  const [caixaData, setCaixaData] = useState<AdminCaixaResponseDTO | null>(null);
  const [patrimonio, setPatrimonio] = useState<AdminPatrimonioDTO[]>([]);
  const [locais, setLocais] = useState<AdminLocalDTO[]>([]);

  // Filtros
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modais
  const [modalUserOpen, setModalUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserDTO | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '', password: '', role: 'atleta' as NivelAcesso });

  const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const [modalAtletaOpen, setModalAtletaOpen] = useState(false);
  const [editingAtleta, setEditingAtleta] = useState<AdminAtletaDTO | null>(null);
  const [atletaForm, setAtletaForm] = useState({
    nome: '',
    apelido: '',
    numero_camisa: '',
    numero_calcado: '',
    posicao_principal: 'MEI',
    posicao_secundaria: '',
    tipo_vinculo: 'mensalista',
  });

  const [modalPartidaOpen, setModalPartidaOpen] = useState(false);
  const [partidaForm, setPartidaForm] = useState({
    adversario: '',
    data_partida: new Date().toISOString().split('T')[0],
    horario_inicio: '19:30',
    local_id: '',
    local_nome: 'Arena Fut7',
    local_endereco: 'Rua do Campo, 100',
    local_maps_url: '',
    limite_confirmados: 14,
    valor_cota_centavos: 2500,
    meta_arrecadacao_centavos: 35000,
  });

  const [modalCaixaOpen, setModalCaixaOpen] = useState(false);
  const [caixaForm, setCaixaForm] = useState({
    tipo: 'saida' as 'entrada' | 'saida',
    valor: '',
    descricao: '',
  });

  const [modalPatrimonioOpen, setModalPatrimonioOpen] = useState(false);
  const [editingPatrimonio, setEditingPatrimonio] = useState<AdminPatrimonioDTO | null>(null);
  const [patrimonioForm, setPatrimonioForm] = useState({
    nome: '',
    categoria: 'bola',
    quantidade_total: 1,
    estado_conservacao: 'novo' as 'novo' | 'bom' | 'regular' | 'desgastado',
  });

  const [modalLocalOpen, setModalLocalOpen] = useState(false);
  const [editingLocal, setEditingLocal] = useState<AdminLocalDTO | null>(null);
  const [localForm, setLocalForm] = useState({
    nome: '',
    endereco: '',
    maps_url: '',
    tipo_piso: 'Grama Sintética',
    observacoes: '',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Carregamento de dados da aba ativa
  const loadData = async (tab: AdminTab = activeTab) => {
    setLoading(true);
    try {
      if (tab === 'users') {
        const data = await api.admin.getUsers();
        setUsers(data);
      } else if (tab === 'atletas') {
        const data = await api.admin.getAtletas();
        setAtletas(data);
      } else if (tab === 'partidas') {
        const [partidasData, locaisData] = await Promise.all([
          api.admin.getPartidas(),
          api.admin.getLocais(),
        ]);
        setPartidas(partidasData);
        setLocais(locaisData);
      } else if (tab === 'caixa') {
        const data = await api.admin.getCaixa();
        setCaixaData(data);
      } else if (tab === 'patrimonio') {
        const data = await api.admin.getPatrimonio();
        setPatrimonio(data);
      } else if (tab === 'locais') {
        const data = await api.admin.getLocais();
        setLocais(data);
      }
    } catch (err: any) {
      showToast(err.message || 'Falha ao carregar dados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTab);
    setSearchQuery('');
  }, [activeTab]);

  // ==========================
  // HANDLERS: USUÁRIOS
  // ==========================
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.admin.updateUser(editingUser.id, {
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone || undefined,
          role: userForm.role,
        });
        showToast('Usuário atualizado com sucesso.');
      } else {
        await api.admin.createUser({
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone || undefined,
          password: userForm.password,
          role: userForm.role,
        });
        showToast('Usuário cadastrado com sucesso.');
      }
      setModalUserOpen(false);
      loadData('users');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    try {
      await api.admin.resetUserPassword(selectedUserId, newPassword);
      showToast('Senha redefinida com sucesso.');
      setModalPasswordOpen(false);
      setNewPassword('');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteUser = async (user: AdminUserDTO) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) return;
    try {
      await api.admin.deleteUser(user.id);
      showToast('Usuário removido com sucesso.');
      loadData('users');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // ==========================
  // HANDLERS: ATLETAS
  // ==========================
  const handleSaveAtleta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAtleta) {
        await api.admin.updateAtleta(editingAtleta.id, {
          nome: atletaForm.nome,
          apelido: atletaForm.apelido || undefined,
          numero_camisa: atletaForm.numero_camisa ? parseInt(atletaForm.numero_camisa, 10) : undefined,
          numero_calcado: atletaForm.numero_calcado ? parseInt(atletaForm.numero_calcado, 10) : undefined,
          posicao_principal: atletaForm.posicao_principal,
          posicao_secundaria: atletaForm.posicao_secundaria || undefined,
          tipo_vinculo: atletaForm.tipo_vinculo,
        });
        showToast('Atleta atualizado com sucesso.');
      } else {
        await api.admin.createAtleta({
          nome: atletaForm.nome,
          apelido: atletaForm.apelido || undefined,
          numero_camisa: atletaForm.numero_camisa ? parseInt(atletaForm.numero_camisa, 10) : undefined,
          numero_calcado: atletaForm.numero_calcado ? parseInt(atletaForm.numero_calcado, 10) : undefined,
          posicao_principal: atletaForm.posicao_principal,
          posicao_secundaria: atletaForm.posicao_secundaria || undefined,
          tipo_vinculo: atletaForm.tipo_vinculo,
        });
        showToast('Atleta cadastrado no elenco.');
      }
      setModalAtletaOpen(false);
      loadData('atletas');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleAtletaStatus = async (atleta: AdminAtletaDTO) => {
    const acao = atleta.ativo ? 'desativar' : 'reativar';
    if (!window.confirm(`Deseja ${acao} o atleta "${atleta.nome}"? O histórico esportivo será preservado.`)) return;
    try {
      await api.admin.toggleAtletaStatus(atleta.id, !atleta.ativo);
      showToast(`Atleta ${!atleta.ativo ? 'reativado' : 'desativado'} com sucesso.`);
      loadData('atletas');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // ==========================
  // HANDLERS: PARTIDAS
  // ==========================
  const handleSavePartida = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createPartida({
        adversario: partidaForm.adversario,
        data_partida: partidaForm.data_partida,
        horario_inicio: partidaForm.horario_inicio,
        local_id: partidaForm.local_id || undefined,
        local_nome: partidaForm.local_nome,
        local_endereco: partidaForm.local_endereco,
        local_maps_url: partidaForm.local_maps_url || undefined,
        limite_confirmados: Number(partidaForm.limite_confirmados),
        valor_cota_centavos: Number(partidaForm.valor_cota_centavos),
        meta_arrecadacao_centavos: Number(partidaForm.meta_arrecadacao_centavos),
      });
      showToast('Partida agendada com sucesso com horários de vestiário calculados.');
      setModalPartidaOpen(false);
      loadData('partidas');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleChangePartidaStatus = async (partidaId: string, status: string) => {
    try {
      await api.admin.updatePartidaStatus(partidaId, status);
      showToast(`Status da partida atualizado para ${status}.`);
      loadData('partidas');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // ==========================
  // HANDLERS: CAIXA
  // ==========================
  const handleSaveCaixa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const valorCentavos = Math.round(parseFloat(caixaForm.valor.replace(',', '.')) * 100);
      if (isNaN(valorCentavos) || valorCentavos <= 0) {
        showToast('Informe um valor válido em reais.', 'error');
        return;
      }
      await api.admin.createCaixa({
        tipo: caixaForm.tipo,
        valor_centavos: valorCentavos,
        descricao: caixaForm.descricao,
      });
      showToast('Lançamento registrado com sucesso.');
      setModalCaixaOpen(false);
      setCaixaForm({ tipo: 'saida', valor: '', descricao: '' });
      loadData('caixa');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // ==========================
  // HANDLERS: PATRIMÔNIO
  // ==========================
  const handleSavePatrimonio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPatrimonio) {
        await api.admin.updatePatrimonio(editingPatrimonio.id, {
          nome: patrimonioForm.nome,
          categoria: patrimonioForm.categoria,
          quantidade_total: Number(patrimonioForm.quantidade_total),
          estado_conservacao: patrimonioForm.estado_conservacao,
        });
        showToast('Item atualizado com sucesso.');
      } else {
        await api.admin.createPatrimonio({
          nome: patrimonioForm.nome,
          categoria: patrimonioForm.categoria,
          quantidade_total: Number(patrimonioForm.quantidade_total),
          estado_conservacao: patrimonioForm.estado_conservacao,
        });
        showToast('Item adicionado ao patrimônio.');
      }
      setModalPatrimonioOpen(false);
      loadData('patrimonio');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeletePatrimonio = async (item: AdminPatrimonioDTO) => {
    if (!window.confirm(`Remover item "${item.nome}" do patrimônio?`)) return;
    try {
      await api.admin.deletePatrimonio(item.id);
      showToast('Item removido com sucesso.');
      loadData('patrimonio');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // ==========================
  // HANDLERS: LOCAIS & CAMPOS
  // ==========================
  const handleSaveLocal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLocal) {
        await api.admin.updateLocal(editingLocal.id, {
          nome: localForm.nome,
          endereco: localForm.endereco || undefined,
          maps_url: localForm.maps_url || undefined,
          tipo_piso: localForm.tipo_piso,
          observacoes: localForm.observacoes || undefined,
        });
        showToast('Local atualizado com sucesso.');
      } else {
        await api.admin.createLocal({
          nome: localForm.nome,
          endereco: localForm.endereco || undefined,
          maps_url: localForm.maps_url || undefined,
          tipo_piso: localForm.tipo_piso,
          observacoes: localForm.observacoes || undefined,
        });
        showToast('Local e campo cadastrados com sucesso.');
      }
      setModalLocalOpen(false);
      loadData('locais');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleLocalStatus = async (local: AdminLocalDTO) => {
    const acao = local.ativo ? 'desativar' : 'reativar';
    if (!window.confirm(`Deseja ${acao} o local "${local.nome}"? O histórico de partidas será preservado.`)) return;
    try {
      await api.admin.toggleLocalStatus(local.id);
      showToast(`Local ${!local.ativo ? 'reativado' : 'desativado'} com sucesso.`);
      loadData('locais');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-16">
      {/* Top Bar Administrativa */}
      <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMatch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Voltar ao Jogo</span>
            </button>
            <div className="h-4 w-px bg-zinc-700 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm sm:text-base text-zinc-100 tracking-tight flex items-center gap-2">
                  Painel ROOT
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Master Backoffice
                  </span>
                </h1>
                <p className="text-[11px] text-zinc-400">Gestão global de cadastros, acessos e finanças</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-zinc-700 transition"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : 'text-zinc-400'}`} />
              <span>Sincronizar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Alerta / Feedback */}
      {feedback && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                : 'bg-red-950/40 text-red-300 border-red-500/40'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 mt-6">
        {/* Barra de Abas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-800 text-xs font-semibold scrollbar-none">
          {[
            { id: 'users', label: 'Usuários & Perfis', icon: KeyRound, count: users.length },
            { id: 'atletas', label: 'Elenco & Atletas', icon: Users, count: atletas.length },
            { id: 'partidas', label: 'Partidas & Agenda', icon: Calendar, count: partidas.length },
            { id: 'locais', label: 'Locais & Campos', icon: MapPin, count: locais.length },
            { id: 'caixa', label: 'Caixa Geral', icon: DollarSign },
            { id: 'patrimonio', label: 'Patrimônio', icon: Package, count: patrimonio.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm font-bold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* ABA 1: USUÁRIOS & PERFIS */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail ou perfil..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setUserForm({ name: '', email: '', phone: '', password: '', role: 'atleta' });
                  setModalUserOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Usuário</span>
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950/80 text-zinc-400 font-semibold border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Usuário</th>
                      <th className="py-3 px-4">Contato</th>
                      <th className="py-3 px-4">Papel (Role)</th>
                      <th className="py-3 px-4">Atleta Vinculado</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {users
                      .filter(
                        (u) =>
                          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          u.role.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-zinc-800/30 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-zinc-100">{u.name}</div>
                            <div className="text-[11px] text-zinc-500">ID: {u.id.substring(0, 8)}...</div>
                          </td>
                          <td className="py-3 px-4 text-zinc-400">
                            <div>{u.email || '—'}</div>
                            <div className="text-[11px] text-zinc-500">{u.phone || '—'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                u.role === 'root'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : u.role === 'geral'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : u.role === 'tecnico'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  : u.role === 'financeiro'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : u.role === 'almoxarifado'
                                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              }`}
                            >
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-zinc-400">
                            {u.atleta ? (
                              <span className="text-emerald-400 font-medium">
                                {u.atleta.nome} {u.atleta.apelido ? `(${u.atleta.apelido})` : ''}
                              </span>
                            ) : (
                              <span className="text-zinc-600">Nenhum</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedUserId(u.id);
                                  setNewPassword('');
                                  setModalPasswordOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-amber-400 transition"
                                title="Redefinir Senha"
                              >
                                <Lock className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingUser(u);
                                  setUserForm({
                                    name: u.name,
                                    email: u.email || '',
                                    phone: u.phone || '',
                                    password: '',
                                    role: u.role,
                                  });
                                  setModalUserOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {u.role !== 'root' && (
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 2: ELENCO & ATLETAS */}
        {/* ========================================================= */}
        {activeTab === 'atletas' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar atleta por nome, apelido, número ou posição..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <button
                onClick={() => {
                  setEditingAtleta(null);
                  setAtletaForm({
                    nome: '',
                    apelido: '',
                    numero_camisa: '',
                    numero_calcado: '',
                    posicao_principal: 'MEI',
                    posicao_secundaria: '',
                    tipo_vinculo: 'mensalista',
                  });
                  setModalAtletaOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Atleta</span>
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950/80 text-zinc-400 font-semibold border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Camisa</th>
                      <th className="py-3 px-4">Atleta</th>
                      <th className="py-3 px-4">Posição</th>
                      <th className="py-3 px-4">Calçado</th>
                      <th className="py-3 px-4">Vínculo</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {atletas
                      .filter(
                        (a) =>
                          a.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.apelido && a.apelido.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          a.posicao_principal.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((a) => (
                        <tr
                          key={a.id}
                          className={`hover:bg-zinc-800/30 transition ${!a.ativo ? 'opacity-60 bg-zinc-950/40' : ''}`}
                        >
                          <td className="py-3 px-4">
                            <span className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-extrabold text-xs text-emerald-400">
                              {a.numero_camisa !== null && a.numero_camisa !== undefined ? a.numero_camisa : '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-zinc-100">{a.nome}</div>
                            {a.apelido && <div className="text-[11px] text-zinc-400 font-medium">"{a.apelido}"</div>}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-zinc-200 font-semibold">{a.posicao_principal}</span>
                            {a.posicao_secundaria && (
                              <span className="text-[10px] text-zinc-500 ml-1">({a.posicao_secundaria})</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/60 font-semibold text-xs text-zinc-300">
                              {a.numero_calcado ? a.numero_calcado : '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4 capitalize text-zinc-400">{a.tipo_vinculo || 'mensalista'}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                a.ativo
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                              }`}
                            >
                              {a.ativo ? 'ATIVO' : 'INATIVO'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingAtleta(a);
                                  setAtletaForm({
                                    nome: a.nome,
                                    apelido: a.apelido || '',
                                    numero_camisa: a.numero_camisa?.toString() || '',
                                    numero_calcado: a.numero_calcado?.toString() || '',
                                    posicao_principal: a.posicao_principal,
                                    posicao_secundaria: a.posicao_secundaria || '',
                                    tipo_vinculo: a.tipo_vinculo || 'mensalista',
                                  });
                                  setModalAtletaOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition"
                                title="Editar Atleta"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleToggleAtletaStatus(a)}
                                className={`p-1.5 rounded-lg transition ${
                                  a.ativo
                                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400'
                                    : 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/60'
                                }`}
                                title={a.ativo ? 'Desativar Atleta (Soft Delete)' : 'Reativar Atleta'}
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 3: PARTIDAS & VESTIÁRIO */}
        {/* ========================================================= */}
        {activeTab === 'partidas' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
              <h2 className="text-xs font-bold text-zinc-300">Agenda Geral de Partidas Cadastradas</h2>
              <button
                onClick={() => setModalPartidaOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Partida</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {partidas.map((p) => (
                <div
                  key={p.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {p.data_partida} às {p.horario_inicio}
                      </span>
                      <select
                        value={p.status}
                        onChange={(e) => handleChangePartidaStatus(p.id, e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 text-[11px] font-bold rounded-lg px-2 py-1 text-zinc-300 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="agendada">Agendada</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="encerrada">Encerrada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </div>

                    <h3 className="font-extrabold text-base text-zinc-100">vs {p.adversario}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{p.local_nome}</p>
                    {p.local_endereco && <p className="text-[11px] text-zinc-500 truncate">{p.local_endereco}</p>}

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/80">
                      <div>
                        <span className="text-zinc-500 block">Teto</span>
                        <span className="font-bold text-zinc-300">{p.limite_confirmados || 14} atletas</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Cota PIX</span>
                        <span className="font-bold text-zinc-300">
                          R$ {((p.valor_cota_centavos || 2500) / 100).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Meta Campo</span>
                        <span className="font-bold text-zinc-300">
                          R$ {((p.meta_arrecadacao_centavos || 35000) / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA: LOCAIS & CAMPOS */}
        {/* ========================================================= */}
        {activeTab === 'locais' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2.5 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar local por nome, bairro ou endereço..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingLocal(null);
                  setLocalForm({
                    nome: '',
                    endereco: '',
                    maps_url: '',
                    tipo_piso: 'Grama Sintética',
                    observacoes: '',
                  });
                  setModalLocalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Local / Campo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {locais
                .filter(
                  (l) =>
                    l.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (l.endereco && l.endereco.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((loc) => (
                  <div
                    key={loc.id}
                    className={`bg-zinc-900 border rounded-2xl p-4 flex flex-col justify-between shadow-sm transition ${
                      loc.ativo ? 'border-zinc-800 hover:border-zinc-700' : 'border-red-900/30 opacity-70 bg-zinc-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {loc.tipo_piso || 'Grama Sintética'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            loc.ativo
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {loc.ativo ? 'ATIVO' : 'DESATIVADO'}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{loc.nome}</span>
                      </h3>

                      {loc.endereco && (
                        <p className="text-xs text-zinc-400 mt-1 pl-5.5 leading-relaxed">
                          {loc.endereco}
                        </p>
                      )}

                      {loc.maps_url && (
                        <a
                          href={loc.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 mt-2 pl-5.5 transition font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Abrir no Google Maps / Waze</span>
                        </a>
                      )}

                      {loc.observacoes && (
                        <p className="text-[11px] text-zinc-500 mt-2 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/80 italic">
                          "{loc.observacoes}"
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">
                        {loc.partidas_count !== undefined
                          ? `${loc.partidas_count} partida(s) vinculada(s)`
                          : 'Pronto para agendamento'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingLocal(loc);
                            setLocalForm({
                              nome: loc.nome,
                              endereco: loc.endereco || '',
                              maps_url: loc.maps_url || '',
                              tipo_piso: loc.tipo_piso || 'Grama Sintética',
                              observacoes: loc.observacoes || '',
                            });
                            setModalLocalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition"
                          title="Editar Local"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleLocalStatus(loc)}
                          className={`p-1.5 rounded-lg transition ${
                            loc.ativo
                              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400'
                              : 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/60'
                          }`}
                          title={loc.ativo ? 'Desativar Local' : 'Reativar Local'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {locais.length === 0 && (
              <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-zinc-800 text-zinc-500">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                <p className="text-xs font-semibold">Nenhum local ou campo cadastrado ainda.</p>
                <p className="text-[11px] mt-1 text-zinc-600">
                  Clique em "Novo Local / Campo" para cadastrar a arena ou sede do time.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 4: CAIXA GERAL */}
        {/* ========================================================= */}
        {activeTab === 'caixa' && (
          <div className="mt-6 space-y-4">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <span className="text-[11px] font-semibold text-zinc-400">Saldo Atual Consolidado</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  R$ {caixaData?.saldo_formatado || '0,00'}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-400">Total de Entradas</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-zinc-100 mt-1">
                  R$ {(((caixaData?.total_entradas_centavos || 0) / 100)).toFixed(2)}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-400">Total de Saídas</span>
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-xl font-bold text-zinc-100 mt-1">
                  R$ {(((caixaData?.total_saidas_centavos || 0) / 100)).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Extrato & Ação */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
              <h3 className="text-xs font-bold text-zinc-300">Extrato de Movimentações do Clube</h3>
              <button
                onClick={() => setModalCaixaOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Lançamento</span>
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950/80 text-zinc-400 font-semibold border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Descrição</th>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Responsável</th>
                      <th className="py-3 px-4 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {(caixaData?.movimentacoes || []).map((mov) => (
                      <tr key={mov.id} className="hover:bg-zinc-800/30 transition">
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              mov.tipo === 'entrada'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            {mov.tipo.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-zinc-200">{mov.descricao}</td>
                        <td className="py-3 px-4 text-zinc-500">
                          {mov.data_movimentacao ? new Date(mov.data_movimentacao).toLocaleDateString('pt-BR') : '—'}
                        </td>
                        <td className="py-3 px-4 text-zinc-400">{mov.responsavel || 'Sistema'}</td>
                        <td
                          className={`py-3 px-4 text-right font-bold ${
                            mov.tipo === 'entrada' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {mov.tipo === 'entrada' ? '+' : '-'} R$ {(mov.valor_centavos / 100).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 5: PATRIMÔNIO & ALMOXARIFADO */}
        {/* ========================================================= */}
        {activeTab === 'patrimonio' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
              <h2 className="text-xs font-bold text-zinc-300">Inventário de Bens do Clube</h2>
              <button
                onClick={() => {
                  setEditingPatrimonio(null);
                  setPatrimonioForm({
                    nome: '',
                    categoria: 'bola',
                    quantidade_total: 1,
                    estado_conservacao: 'novo',
                  });
                  setModalPatrimonioOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Bem</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {patrimonio.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md">
                        {item.categoria}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.estado_conservacao === 'novo'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : item.estado_conservacao === 'bom'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {item.estado_conservacao.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-zinc-100">{item.nome}</h3>
                    <p className="text-2xl font-black text-emerald-400 mt-2">
                      {item.quantidade_total}{' '}
                      <span className="text-xs font-normal text-zinc-500">unidades no clube</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingPatrimonio(item);
                        setPatrimonioForm({
                          nome: item.nome,
                          categoria: item.categoria,
                          quantidade_total: item.quantidade_total,
                          estado_conservacao: item.estado_conservacao,
                        });
                        setModalPatrimonioOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePatrimonio(item)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAIS */}
      {/* ========================================================= */}

      {/* Modal Usuário */}
      {modalUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-zinc-100">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário do Sistema'}
              </h3>
              <button
                onClick={() => setModalUserOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Telefone (opcional)</label>
                <input
                  type="text"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Senha Provisória</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Papel / Nível de Acesso</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as NivelAcesso })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="atleta">Atleta</option>
                  <option value="tecnico">Comissão Técnica</option>
                  <option value="financeiro">Tesoureiro / Financeiro</option>
                  <option value="almoxarifado">Almoxarifado</option>
                  <option value="geral">Diretoria / Geral</option>
                  <option value="root">ROOT / Superusuário Master</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalUserOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Redefinição de Senha */}
      {modalPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-sm text-zinc-100 mb-3">Redefinir Senha do Usuário</h3>
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Nova Senha Forte</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalPasswordOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition"
                >
                  Confirmar Nova Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Atleta */}
      {modalAtletaOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-sm text-zinc-100 mb-4">
              {editingAtleta ? 'Editar Atleta' : 'Cadastrar Atleta no Elenco'}
            </h3>

            <form onSubmit={handleSaveAtleta} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={atletaForm.nome}
                  onChange={(e) => setAtletaForm({ ...atletaForm, nome: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Apelido de Jogo</label>
                  <input
                    type="text"
                    value={atletaForm.apelido}
                    onChange={(e) => setAtletaForm({ ...atletaForm, apelido: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Nº Camisa</label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={atletaForm.numero_camisa}
                    onChange={(e) => setAtletaForm({ ...atletaForm, numero_camisa: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Nº Calçado</label>
                  <input
                    type="number"
                    min={25}
                    max={50}
                    placeholder="Ex: 41"
                    value={atletaForm.numero_calcado}
                    onChange={(e) => setAtletaForm({ ...atletaForm, numero_calcado: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Posição Principal</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: GOL, ZAG, MEI, ATA"
                    value={atletaForm.posicao_principal}
                    onChange={(e) => setAtletaForm({ ...atletaForm, posicao_principal: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Posição Secundária</label>
                  <input
                    type="text"
                    value={atletaForm.posicao_secundaria}
                    onChange={(e) => setAtletaForm({ ...atletaForm, posicao_secundaria: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Vínculo com o Clube</label>
                <select
                  value={atletaForm.tipo_vinculo}
                  onChange={(e) => setAtletaForm({ ...atletaForm, tipo_vinculo: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="mensalista">Mensalista</option>
                  <option value="avulso">Avulso / Convidado</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAtletaOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  Salvar Atleta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Partida */}
      {modalPartidaOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-sm text-zinc-100 mb-4">Agendar Nova Partida</h3>
            <form onSubmit={handleSavePartida} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Nome do Adversário</label>
                <input
                  type="text"
                  required
                  value={partidaForm.adversario}
                  onChange={(e) => setPartidaForm({ ...partidaForm, adversario: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Data da Partida</label>
                  <input
                    type="date"
                    required
                    value={partidaForm.data_partida}
                    onChange={(e) => setPartidaForm({ ...partidaForm, data_partida: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Início do Jogo</label>
                  <input
                    type="time"
                    required
                    value={partidaForm.horario_inicio}
                    onChange={(e) => setPartidaForm({ ...partidaForm, horario_inicio: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-zinc-400">
                    Selecionar Campo / Local Cadastrado
                  </label>
                  {locais.length > 0 && (
                    <span className="text-[10px] text-emerald-400 font-medium">Preenchimento automático</span>
                  )}
                </div>
                <select
                  value={partidaForm.local_id}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const selected = locais.find((l) => l.id === selId);
                    if (selected) {
                      setPartidaForm({
                        ...partidaForm,
                        local_id: selected.id,
                        local_nome: selected.nome,
                        local_endereco: selected.endereco || '',
                        local_maps_url: selected.maps_url || '',
                      });
                    } else {
                      setPartidaForm({
                        ...partidaForm,
                        local_id: '',
                      });
                    }
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 mb-2"
                >
                  <option value="">Selecione um local pré-cadastrado...</option>
                  {locais
                    .filter((l) => l.ativo)
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nome} ({l.tipo_piso || 'Grama Sintética'})
                      </option>
                    ))}
                </select>

                <div className="space-y-2 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-800/80">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-0.5">Nome da Arena / Campo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Arena Soccer Ville - Campo 1"
                      value={partidaForm.local_nome}
                      onChange={(e) => setPartidaForm({ ...partidaForm, local_nome: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-500 mb-0.5">Endereço Completo</label>
                      <input
                        type="text"
                        placeholder="Ex: Av. do Futebol, 1000"
                        value={partidaForm.local_endereco}
                        onChange={(e) => setPartidaForm({ ...partidaForm, local_endereco: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-500 mb-0.5">Link Google Maps / Waze</label>
                      <input
                        type="url"
                        placeholder="https://maps.google.com/..."
                        value={partidaForm.local_maps_url}
                        onChange={(e) => setPartidaForm({ ...partidaForm, local_maps_url: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Teto de Atletas</label>
                  <input
                    type="number"
                    min={7}
                    max={30}
                    value={partidaForm.limite_confirmados}
                    onChange={(e) => setPartidaForm({ ...partidaForm, limite_confirmados: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Cota por Atleta (centavos)</label>
                  <input
                    type="number"
                    min={0}
                    value={partidaForm.valor_cota_centavos}
                    onChange={(e) => setPartidaForm({ ...partidaForm, valor_cota_centavos: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalPartidaOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  Criar Partida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Lançamento Caixa */}
      {modalCaixaOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-sm text-zinc-100 mb-4">Lançamento no Caixa Geral</h3>
            <form onSubmit={handleSaveCaixa} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Tipo de Movimentação</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCaixaForm({ ...caixaForm, tipo: 'entrada' })}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      caixaForm.tipo === 'entrada'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    + Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaixaForm({ ...caixaForm, tipo: 'saida' })}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      caixaForm.tipo === 'saida'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    - Saída
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Valor (R$)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 120,50"
                  value={caixaForm.valor}
                  onChange={(e) => setCaixaForm({ ...caixaForm, valor: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Compra de redes, pagamento árbitro, patrocínio..."
                  value={caixaForm.descricao}
                  onChange={(e) => setCaixaForm({ ...caixaForm, descricao: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalCaixaOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Patrimônio */}
      {modalPatrimonioOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-sm text-zinc-100 mb-4">
              {editingPatrimonio ? 'Editar Item de Patrimônio' : 'Adicionar Bem ao Almoxarifado'}
            </h3>
            <form onSubmit={handleSavePatrimonio} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Nome do Bem</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jogo de Coletes Laranjas, Bolas Penalty S11..."
                  value={patrimonioForm.nome}
                  onChange={(e) => setPatrimonioForm({ ...patrimonioForm, nome: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Categoria</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: bola, fardamento, cone, apoio"
                    value={patrimonioForm.categoria}
                    onChange={(e) => setPatrimonioForm({ ...patrimonioForm, categoria: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Quantidade Total</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={patrimonioForm.quantidade_total}
                    onChange={(e) => setPatrimonioForm({ ...patrimonioForm, quantidade_total: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Estado de Conservação</label>
                <select
                  value={patrimonioForm.estado_conservacao}
                  onChange={(e) =>
                    setPatrimonioForm({
                      ...patrimonioForm,
                      estado_conservacao: e.target.value as 'novo' | 'bom' | 'regular' | 'desgastado',
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="novo">Novo (Sem uso)</option>
                  <option value="bom">Bom (Em uso excelente)</option>
                  <option value="regular">Regular (Desgaste natural)</option>
                  <option value="desgastado">Desgastado / Avariado</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalPatrimonioOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  Salvar Bem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Local / Campo */}
      {modalLocalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{editingLocal ? 'Editar Local / Campo' : 'Novo Local ou Arena de Jogo'}</span>
              </h3>
              <button
                onClick={() => setModalLocalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLocal} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Nome do Local / Campo <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Arena Playball Pompeia - Campo Society 1"
                  value={localForm.nome}
                  onChange={(e) => setLocalForm({ ...localForm, nome: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Rua Nicholas Boer, 120 - Pompeia, São Paulo/SP"
                  value={localForm.endereco}
                  onChange={(e) => setLocalForm({ ...localForm, endereco: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Tipo de Piso</label>
                  <select
                    value={localForm.tipo_piso}
                    onChange={(e) => setLocalForm({ ...localForm, tipo_piso: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Grama Sintética">Grama Sintética</option>
                    <option value="Society">Society</option>
                    <option value="Campo Natural">Campo Natural (Grama)</option>
                    <option value="Quadra / Salão">Quadra / Futsal</option>
                    <option value="Areia / Beach">Areia / Beach</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Link Maps / Waze</label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={localForm.maps_url}
                    onChange={(e) => setLocalForm({ ...localForm, maps_url: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Observações / Dicas de Acesso
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Estacionamento no local, vestiário 3 reservado para Os Canabis."
                  value={localForm.observacoes}
                  onChange={(e) => setLocalForm({ ...localForm, observacoes: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalLocalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  {editingLocal ? 'Salvar Alterações' : 'Cadastrar Local'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
