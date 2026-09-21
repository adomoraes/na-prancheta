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
  Swords,
  Phone,
  Shirt,
  Award,
  Star,
  Trophy,
  Target,
  Activity,
  Minus,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  AdminUserDTO,
  AdminAtletaDTO,
  AdminPartidaDTO,
  AdminCaixaResponseDTO,
  AdminPatrimonioDTO,
  AdminLocalDTO,
  AdminAdversarioDTO,
  AdminScoutDTO,
  AdminScoutLeaderboardDTO,
  NivelAcesso,
} from '../../types';

interface AdminDashboardProps {
  onBackToMatch: () => void;
}

type AdminTab = 'users' | 'atletas' | 'partidas' | 'locais' | 'adversarios' | 'caixa' | 'patrimonio' | 'scouts';

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
  const [adversarios, setAdversarios] = useState<AdminAdversarioDTO[]>([]);

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
    adversario_id: '',
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

  const [patrimonioCategoriaFilter, setPatrimonioCategoriaFilter] = useState<string>('todos');
  const [modalPatrimonioOpen, setModalPatrimonioOpen] = useState(false);
  const [editingPatrimonio, setEditingPatrimonio] = useState<AdminPatrimonioDTO | null>(null);
  const [patrimonioForm, setPatrimonioForm] = useState({
    nome: '',
    categoria: 'uniforme',
    tipo_uniforme: 'camisa' as 'camisa' | 'meiao' | 'calcao',
    quantidade_total: 1,
    tamanho: 'GG',
    cor: 'Azul',
    numero: '10',
    estado_conservacao: 'novo' as 'novo' | 'bom' | 'regular' | 'desgastado',
    observacoes: 'Adidas',
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

  const [modalAdversarioOpen, setModalAdversarioOpen] = useState(false);
  const [editingAdversario, setEditingAdversario] = useState<AdminAdversarioDTO | null>(null);
  const [adversarioForm, setAdversarioForm] = useState({
    nome: '',
    responsavel_nome: '',
    responsavel_telefone: '',
    cor_uniforme_principal: '',
    escudo_url: '',
    observacoes: '',
  });

  // Estados dos Scouts
  const [scouts, setScouts] = useState<AdminScoutDTO[]>([]);
  const [scoutsLeaderboard, setScoutsLeaderboard] = useState<AdminScoutLeaderboardDTO[]>([]);
  const [selectedScoutPartidaId, setSelectedScoutPartidaId] = useState<string>('');
  const [scoutViewMode, setScoutViewMode] = useState<'partida' | 'leaderboard'>('partida');
  const [modalScoutOpen, setModalScoutOpen] = useState(false);
  const [editingScout, setEditingScout] = useState<AdminScoutDTO | null>(null);
  const [scoutForm, setScoutForm] = useState({
    partida_id: '',
    atleta_id: '',
    gols: 0,
    assistencias: 0,
    cartoes_amarelos: 0,
    cartoes_vermelhos: 0,
    gols_sofridos_goleiro: 0,
    minutos_jogados: 90,
    foi_mvp: false,
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
        const [partidasData, locaisData, adversariosData] = await Promise.all([
          api.admin.getPartidas(),
          api.admin.getLocais(),
          api.admin.getAdversarios(),
        ]);
        setPartidas(partidasData);
        setLocais(locaisData);
        setAdversarios(adversariosData);
      } else if (tab === 'caixa') {
        const data = await api.admin.getCaixa();
        setCaixaData(data);
      } else if (tab === 'patrimonio') {
        const data = await api.admin.getPatrimonio();
        setPatrimonio(data);
      } else if (tab === 'locais') {
        const data = await api.admin.getLocais();
        setLocais(data);
      } else if (tab === 'adversarios') {
        const data = await api.admin.getAdversarios();
        setAdversarios(data);
      } else if (tab === 'scouts') {
        const [scoutsData, leaderboardData, partidasData, atletasData] = await Promise.all([
          api.admin.getScouts(),
          api.admin.getScoutsLeaderboard(),
          api.admin.getPartidas(),
          api.admin.getAtletas(),
        ]);
        setScouts(scoutsData);
        setScoutsLeaderboard(leaderboardData);
        setPartidas(partidasData);
        setAtletas(atletasData);
        if (!selectedScoutPartidaId && partidasData.length > 0) {
          setSelectedScoutPartidaId(partidasData[0].id);
        }
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
        adversario_id: partidaForm.adversario_id || undefined,
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
      const isUniforme = ['uniforme', 'uniformes', 'fardamento'].includes(patrimonioForm.categoria.toLowerCase());
      
      const payload = {
        nome: patrimonioForm.nome.trim() || (isUniforme
          ? `${patrimonioForm.tipo_uniforme === 'meiao' ? 'Meião' : patrimonioForm.tipo_uniforme === 'calcao' ? 'Calção' : 'Camisa'}${patrimonioForm.numero ? ' #' + patrimonioForm.numero : ''} ${patrimonioForm.cor || ''}`.trim()
          : 'Novo Item'),
        categoria: patrimonioForm.categoria,
        tipo_uniforme: isUniforme ? patrimonioForm.tipo_uniforme : undefined,
        quantidade_total: Number(patrimonioForm.quantidade_total),
        tamanho: isUniforme ? (patrimonioForm.tamanho || undefined) : undefined,
        cor: isUniforme ? (patrimonioForm.cor || undefined) : undefined,
        numero: isUniforme ? (patrimonioForm.numero || undefined) : undefined,
        estado_conservacao: patrimonioForm.estado_conservacao,
        observacoes: patrimonioForm.observacoes || undefined,
      };

      if (editingPatrimonio) {
        await api.admin.updatePatrimonio(editingPatrimonio.id, payload);
        showToast('Item atualizado com sucesso.');
      } else {
        await api.admin.createPatrimonio(payload);
        showToast('Item adicionado ao patrimônio com sucesso.');
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

  // ==========================
  // HANDLERS: ADVERSÁRIOS & RIVAIS
  // ==========================
  const handleSaveAdversario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAdversario) {
        await api.admin.updateAdversario(editingAdversario.id, {
          nome: adversarioForm.nome,
          responsavel_nome: adversarioForm.responsavel_nome || undefined,
          responsavel_telefone: adversarioForm.responsavel_telefone || undefined,
          cor_uniforme_principal: adversarioForm.cor_uniforme_principal || undefined,
          escudo_url: adversarioForm.escudo_url || undefined,
          observacoes: adversarioForm.observacoes || undefined,
        });
        showToast('Adversário atualizado com sucesso.');
      } else {
        await api.admin.createAdversario({
          nome: adversarioForm.nome,
          responsavel_nome: adversarioForm.responsavel_nome || undefined,
          responsavel_telefone: adversarioForm.responsavel_telefone || undefined,
          cor_uniforme_principal: adversarioForm.cor_uniforme_principal || undefined,
          escudo_url: adversarioForm.escudo_url || undefined,
          observacoes: adversarioForm.observacoes || undefined,
        });
        showToast('Adversário cadastrado com sucesso.');
      }
      setModalAdversarioOpen(false);
      loadData('adversarios');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleAdversarioStatus = async (adversario: AdminAdversarioDTO) => {
    const acao = adversario.ativo ? 'desativar' : 'reativar';
    if (!window.confirm(`Deseja ${acao} o adversário "${adversario.nome}"? O histórico de confrontos será preservado.`)) return;
    try {
      await api.admin.toggleAdversarioStatus(adversario.id);
      showToast(`Adversário ${!adversario.ativo ? 'reativado' : 'desativado'} com sucesso.`);
      loadData('adversarios');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // ==========================
  // HANDLERS: SCOUTS & STATS
  // ==========================
  const handleSaveScout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoutForm.partida_id || !scoutForm.atleta_id) {
      showToast('Selecione a partida e o atleta.', 'error');
      return;
    }
    try {
      if (editingScout) {
        await api.admin.updateScout(editingScout.id, {
          gols: Number(scoutForm.gols),
          assistencias: Number(scoutForm.assistencias),
          cartoes_amarelos: Number(scoutForm.cartoes_amarelos),
          cartoes_vermelhos: Number(scoutForm.cartoes_vermelhos),
          gols_sofridos_goleiro: Number(scoutForm.gols_sofridos_goleiro),
          minutos_jogados: Number(scoutForm.minutos_jogados),
          foi_mvp: Boolean(scoutForm.foi_mvp),
        });
        showToast('Scout atualizado com sucesso.');
      } else {
        await api.admin.createScout({
          partida_id: scoutForm.partida_id,
          atleta_id: scoutForm.atleta_id,
          gols: Number(scoutForm.gols),
          assistencias: Number(scoutForm.assistencias),
          cartoes_amarelos: Number(scoutForm.cartoes_amarelos),
          cartoes_vermelhos: Number(scoutForm.cartoes_vermelhos),
          gols_sofridos_goleiro: Number(scoutForm.gols_sofridos_goleiro),
          minutos_jogados: Number(scoutForm.minutos_jogados),
          foi_mvp: Boolean(scoutForm.foi_mvp),
        });
        showToast('Scout registrado com sucesso.');
      }
      setModalScoutOpen(false);
      loadData('scouts');
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar scout.', 'error');
    }
  };

  const handleQuickScoutDelta = async (
    scout: AdminScoutDTO,
    field: 'gols' | 'assistencias' | 'cartoes_amarelos' | 'cartoes_vermelhos',
    delta: number
  ) => {
    const novoValor = Math.max(0, (scout[field] || 0) + delta);
    try {
      await api.admin.updateScout(scout.id, {
        [field]: novoValor,
      });
      // Atualização otimista local
      setScouts((prev) =>
        prev.map((s) => (s.id === scout.id ? { ...s, [field]: novoValor } : s))
      );
      api.admin.getScoutsLeaderboard().then(setScoutsLeaderboard).catch(() => {});
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar scout.', 'error');
      loadData('scouts');
    }
  };

  const handleToggleScoutMvp = async (scout: AdminScoutDTO) => {
    const novoMvp = !scout.foi_mvp;
    try {
      await api.admin.updateScout(scout.id, {
        foi_mvp: novoMvp,
      });
      showToast(novoMvp ? 'Craque da partida eleito!' : 'Eleição de MVP removida.');
      loadData('scouts');
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar MVP.', 'error');
    }
  };

  const handleDeleteScout = async (scout: AdminScoutDTO) => {
    const atletaNome = scout.atleta?.nome || 'Atleta';
    if (!window.confirm(`Tem certeza que deseja remover o scout de "${atletaNome}" nesta partida?`)) return;
    try {
      await api.admin.deleteScout(scout.id);
      showToast('Scout removido com sucesso.');
      loadData('scouts');
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir scout.', 'error');
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
            { id: 'adversarios', label: 'Adversários', icon: Swords, count: adversarios.length },
            { id: 'caixa', label: 'Caixa Geral', icon: DollarSign },
            { id: 'patrimonio', label: 'Patrimônio', icon: Package, count: patrimonio.length },
            { id: 'scouts', label: 'Scouts & Stats', icon: Award, count: scouts.length },
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
        {/* ABA: ADVERSÁRIOS & RIVAIS */}
        {/* ========================================================= */}
        {activeTab === 'adversarios' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2.5 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por nome do adversário, responsável ou uniforme..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingAdversario(null);
                  setAdversarioForm({
                    nome: '',
                    responsavel_nome: '',
                    responsavel_telefone: '',
                    cor_uniforme_principal: '',
                    escudo_url: '',
                    observacoes: '',
                  });
                  setModalAdversarioOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Adversário</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {adversarios
                .filter(
                  (adv) =>
                    adv.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (adv.responsavel_nome && adv.responsavel_nome.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (adv.cor_uniforme_principal && adv.cor_uniforme_principal.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((adv) => (
                  <div
                    key={adv.id}
                    className={`bg-zinc-900 border rounded-2xl p-4 flex flex-col justify-between shadow-sm transition ${
                      adv.ativo ? 'border-zinc-800 hover:border-zinc-700' : 'border-red-900/30 opacity-70 bg-zinc-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {adv.cor_uniforme_principal ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Uniforme: {adv.cor_uniforme_principal}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                            Uniforme não inf.
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            adv.ativo
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {adv.ativo ? 'ATIVO' : 'DESATIVADO'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {adv.escudo_url ? (
                          <img
                            src={adv.escudo_url}
                            alt={`Escudo ${adv.nome}`}
                            className="w-10 h-10 rounded-full object-cover border border-zinc-700 bg-zinc-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0">
                            <Swords className="w-5 h-5 text-emerald-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-sm text-zinc-100 leading-tight">
                            {adv.nome}
                          </h3>
                          {adv.responsavel_nome && (
                            <p className="text-xs text-zinc-400 mt-0.5">
                              Resp: <span className="text-zinc-300 font-medium">{adv.responsavel_nome}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {adv.responsavel_telefone && (
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-2.5 pl-1">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{adv.responsavel_telefone}</span>
                        </div>
                      )}

                      {adv.observacoes && (
                        <p className="text-[11px] text-zinc-500 mt-2.5 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/80 italic">
                          "{adv.observacoes}"
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">
                        {adv.partidas_count !== undefined
                          ? `${adv.partidas_count} partida(s) vinculada(s)`
                          : 'Pronto para agendamento'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingAdversario(adv);
                            setAdversarioForm({
                              nome: adv.nome,
                              responsavel_nome: adv.responsavel_nome || '',
                              responsavel_telefone: adv.responsavel_telefone || '',
                              cor_uniforme_principal: adv.cor_uniforme_principal || '',
                              escudo_url: adv.escudo_url || '',
                              observacoes: adv.observacoes || '',
                            });
                            setModalAdversarioOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition"
                          title="Editar Adversário"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleAdversarioStatus(adv)}
                          className={`p-1.5 rounded-lg transition ${
                            adv.ativo
                              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400'
                              : 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/60'
                          }`}
                          title={adv.ativo ? 'Desativar Adversário' : 'Reativar Adversário'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {adversarios.length === 0 && (
              <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-zinc-800 text-zinc-500">
                <Swords className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                <p className="text-xs font-semibold">Nenhum adversário cadastrado ainda.</p>
                <p className="text-[11px] mt-1 text-zinc-600">
                  Clique em "Novo Adversário" para cadastrar equipes rivais e parceiras de confronto.
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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-zinc-300 mr-2">Filtrar por:</span>
                {[
                  { id: 'todos', label: 'Todos', count: patrimonio.length },
                  {
                    id: 'uniforme',
                    label: '👕 Uniformes',
                    count: patrimonio.filter((p) =>
                      ['uniforme', 'uniformes', 'fardamento'].includes(p.categoria.toLowerCase())
                    ).length,
                  },
                  {
                    id: 'bola',
                    label: '⚽ Bolas',
                    count: patrimonio.filter((p) => p.categoria.toLowerCase().includes('bola')).length,
                  },
                  {
                    id: 'colete',
                    label: '🎽 Coletes',
                    count: patrimonio.filter((p) => p.categoria.toLowerCase().includes('colete')).length,
                  },
                  {
                    id: 'outros',
                    label: '📦 Apoio / Outros',
                    count: patrimonio.filter(
                      (p) =>
                        !['uniforme', 'uniformes', 'fardamento'].includes(p.categoria.toLowerCase()) &&
                        !p.categoria.toLowerCase().includes('bola') &&
                        !p.categoria.toLowerCase().includes('colete')
                    ).length,
                  },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPatrimonioCategoriaFilter(f.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition border ${
                      patrimonioCategoriaFilter === f.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
                    }`}
                  >
                    {f.label} <span className="opacity-70 text-[10px]">({f.count})</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setEditingPatrimonio(null);
                  setPatrimonioForm({
                    nome: '',
                    categoria: 'uniforme',
                    tipo_uniforme: 'camisa',
                    quantidade_total: 1,
                    tamanho: 'GG',
                    cor: 'Azul',
                    numero: '10',
                    estado_conservacao: 'novo',
                    observacoes: 'Adidas',
                  });
                  setModalPatrimonioOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Bem / Uniforme</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {patrimonio
                .filter((item) => {
                  if (patrimonioCategoriaFilter === 'todos') return true;
                  const cat = item.categoria.toLowerCase();
                  if (patrimonioCategoriaFilter === 'uniforme') {
                    return ['uniforme', 'uniformes', 'fardamento'].includes(cat);
                  }
                  if (patrimonioCategoriaFilter === 'bola') {
                    return cat.includes('bola');
                  }
                  if (patrimonioCategoriaFilter === 'colete') {
                    return cat.includes('colete');
                  }
                  if (patrimonioCategoriaFilter === 'outros') {
                    return (
                      !['uniforme', 'uniformes', 'fardamento'].includes(cat) &&
                      !cat.includes('bola') &&
                      !cat.includes('colete')
                    );
                  }
                  return true;
                })
                .map((item) => {
                  const isUniforme = ['uniforme', 'uniformes', 'fardamento'].includes(
                    item.categoria.toLowerCase()
                  );
                  return (
                    <div
                      key={item.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-zinc-700 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md">
                              {item.categoria}
                            </span>
                            {isUniforme && item.tipo_uniforme && (
                              <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Shirt className="w-3 h-3 text-blue-400 shrink-0" />
                                {item.tipo_uniforme === 'calcao' ? 'CALÇÃO' : item.tipo_uniforme === 'meiao' ? 'MEIÃO' : 'CAMISA'}
                              </span>
                            )}
                          </div>
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

                        <h3 className="font-bold text-sm text-zinc-100 flex items-center justify-between">
                          <span>{item.nome}</span>
                          {isUniforme && item.numero && (
                            <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              #{item.numero}
                            </span>
                          )}
                        </h3>

                        {/* Detalhes específicos de Uniforme */}
                        {isUniforme && (
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            {item.tamanho && (
                              <span className="text-[10px] font-semibold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700">
                                Tam: {item.tamanho}
                              </span>
                            )}
                            {item.cor && (
                              <span className="text-[10px] font-semibold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700">
                                Cor: {item.cor}
                              </span>
                            )}
                            {item.observacoes && (
                              <span className="text-[10px] font-medium bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-800 italic">
                                {item.observacoes}
                              </span>
                            )}
                          </div>
                        )}

                        {!isUniforme && item.observacoes && (
                          <p className="text-[11px] text-zinc-500 mt-2 italic bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/80">
                            "{item.observacoes}"
                          </p>
                        )}

                        <p className="text-2xl font-black text-emerald-400 mt-3">
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
                              tipo_uniforme: (item.tipo_uniforme as any) || 'camisa',
                              quantidade_total: item.quantidade_total,
                              tamanho: item.tamanho || 'GG',
                              cor: item.cor || 'Azul',
                              numero: item.numero || '10',
                              estado_conservacao: item.estado_conservacao,
                              observacoes: item.observacoes || '',
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
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA 8: SCOUTS & ESTATÍSTICAS */}
        {/* ========================================================= */}
        {activeTab === 'scouts' && (
          <div className="mt-6 space-y-4">
            {/* Barra de Controle de Scout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setScoutViewMode('partida')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    scoutViewMode === 'partida'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Súmula por Partida</span>
                </button>
                <button
                  onClick={() => setScoutViewMode('leaderboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    scoutViewMode === 'leaderboard'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Leaderboard Geral ({scoutsLeaderboard.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar atletas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <button
                  onClick={() => {
                    setEditingScout(null);
                    setScoutForm({
                      partida_id: selectedScoutPartidaId || (partidas[0]?.id || ''),
                      atleta_id: atletas[0]?.id || '',
                      gols: 0,
                      assistencias: 0,
                      cartoes_amarelos: 0,
                      cartoes_vermelhos: 0,
                      gols_sofridos_goleiro: 0,
                      minutos_jogados: 90,
                      foi_mvp: false,
                    });
                    setModalScoutOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Lançar Scout</span>
                </button>
              </div>
            </div>

            {/* MODO 1: SÚMULA POR PARTIDA */}
            {scoutViewMode === 'partida' && (
              <div className="space-y-4">
                {/* Seletor de Partida */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Selecione a Partida para Lançar ou Auditar Súmula
                    </label>
                    <select
                      value={selectedScoutPartidaId}
                      onChange={(e) => setSelectedScoutPartidaId(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      {partidas.map((p) => (
                        <option key={p.id} value={p.id}>
                          vs {p.adversario} — {p.data_partida} ({p.status?.toUpperCase() || 'AGENDADA'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Estatísticas Rápidas da Partida */}
                  {(() => {
                    const scoutsDaPartida = scouts.filter((s) => s.partida_id === selectedScoutPartidaId);
                    const totalGols = scoutsDaPartida.reduce((acc, s) => acc + (s.gols || 0), 0);
                    const totalAssists = scoutsDaPartida.reduce((acc, s) => acc + (s.assistencias || 0), 0);
                    const totalAmarelos = scoutsDaPartida.reduce((acc, s) => acc + (s.cartoes_amarelos || 0), 0);
                    const totalVermelhos = scoutsDaPartida.reduce((acc, s) => acc + (s.cartoes_vermelhos || 0), 0);
                    const mvpScout = scoutsDaPartida.find((s) => s.foi_mvp);

                    return (
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                          <p className="text-[10px] text-zinc-500 font-semibold">GOLS</p>
                          <p className="text-sm font-black text-emerald-400">{totalGols}</p>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                          <p className="text-[10px] text-zinc-500 font-semibold">ASSISTS</p>
                          <p className="text-sm font-black text-blue-400">{totalAssists}</p>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                          <p className="text-[10px] text-zinc-500 font-semibold">CARTÕES</p>
                          <p className="text-sm font-black text-amber-400">
                            {totalAmarelos} <span className="text-red-400">/ {totalVermelhos}</span>
                          </p>
                        </div>
                        <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                          <Star className={`w-4 h-4 ${mvpScout ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`} />
                          <div>
                            <p className="text-[9px] text-amber-300/70 font-bold uppercase tracking-wider">CRAQUE DO JOGO</p>
                            <p className="text-xs font-black text-amber-300">
                              {mvpScout?.atleta?.nome || 'Nenhum eleito'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Grid de Atletas da Partida */}
                {(() => {
                  const scoutsDaPartida = scouts
                    .filter((s) => s.partida_id === selectedScoutPartidaId)
                    .filter((s) => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      const nome = s.atleta?.nome?.toLowerCase() || '';
                      const apelido = s.atleta?.apelido?.toLowerCase() || '';
                      return nome.includes(q) || apelido.includes(q);
                    });

                  if (scoutsDaPartida.length === 0) {
                    return (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                        <Award className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-zinc-300">Nenhum scout lançado para esta partida</h4>
                        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                          Comece lançando os números individuais dos atletas que jogaram este confronto.
                        </p>
                        <button
                          onClick={() => {
                            setEditingScout(null);
                            setScoutForm({
                              partida_id: selectedScoutPartidaId || (partidas[0]?.id || ''),
                              atleta_id: atletas[0]?.id || '',
                              gols: 0,
                              assistencias: 0,
                              cartoes_amarelos: 0,
                              cartoes_vermelhos: 0,
                              gols_sofridos_goleiro: 0,
                              minutos_jogados: 90,
                              foi_mvp: false,
                            });
                            setModalScoutOpen(true);
                          }}
                          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Adicionar Atleta à Súmula</span>
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {scoutsDaPartida.map((s) => (
                        <div
                          key={s.id}
                          className={`bg-zinc-900 border rounded-2xl p-4 transition shadow-sm flex flex-col justify-between ${
                            s.foi_mvp
                              ? 'border-amber-500/50 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20 ring-1 ring-amber-500/30'
                              : 'border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <div>
                            {/* Topo do Card */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center justify-center font-black text-xs">
                                  {s.atleta?.numero_camisa || '-'}
                                </span>
                                <div>
                                  <h4 className="font-bold text-xs sm:text-sm text-zinc-100 flex items-center gap-1.5">
                                    <span>{s.atleta?.nome || 'Atleta'}</span>
                                    {s.atleta?.apelido && (
                                      <span className="text-[11px] text-zinc-400 font-normal">({s.atleta.apelido})</span>
                                    )}
                                  </h4>
                                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">
                                    {s.atleta?.posicao_principal || 'Linha'} • {s.minutos_jogados || 0} min
                                  </p>
                                </div>
                              </div>

                              {/* Botão de Craque / MVP com exclusividade */}
                              <button
                                onClick={() => handleToggleScoutMvp(s)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border transition ${
                                  s.foi_mvp
                                    ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-sm shadow-amber-500/20 scale-105'
                                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 border-zinc-700'
                                }`}
                                title={s.foi_mvp ? 'Remover Craque' : 'Eleger Craque da Partida (Exclusivo)'}
                              >
                                <Star className={`w-3.5 h-3.5 ${s.foi_mvp ? 'fill-zinc-950 text-zinc-950' : 'text-zinc-500'}`} />
                                <span>{s.foi_mvp ? 'CRAQUE' : 'MVP'}</span>
                              </button>
                            </div>

                            {/* Controles de Estatísticas com Steppers */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800/70 mb-3">
                              {/* Gols */}
                              <div className="text-center">
                                <span className="text-[10px] text-zinc-400 font-bold block mb-1">⚽ Gols</span>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleQuickScoutDelta(s, 'gols', -1)}
                                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-black transition"
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-black text-emerald-400 w-5 text-center">
                                    {s.gols || 0}
                                  </span>
                                  <button
                                    onClick={() => handleQuickScoutDelta(s, 'gols', 1)}
                                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-black transition"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Assistências */}
                              <div className="text-center">
                                <span className="text-[10px] text-zinc-400 font-bold block mb-1">🎯 Assists</span>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleQuickScoutDelta(s, 'assistencias', -1)}
                                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-black transition"
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-black text-blue-400 w-5 text-center">
                                    {s.assistencias || 0}
                                  </span>
                                  <button
                                    onClick={() => handleQuickScoutDelta(s, 'assistencias', 1)}
                                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-black transition"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Cartão Amarelo */}
                              <div className="text-center">
                                <span className="text-[10px] text-zinc-400 font-bold block mb-1">🟨 Amarelo</span>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleQuickScoutDelta(s, 'cartoes_amarelos', -1)}
                                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-black transition"
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-black text-amber-400 w-5 text-center">
                                    {s.cartoes_amarelos || 0}
                                  </span>
                                  <button
                                    onClick={() => handleQuickScoutDelta(s, 'cartoes_amarelos', 1)}
                                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-black transition"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Cartão Vermelho */}
                              <div className="text-center">
                                <span className="text-[10px] text-zinc-400 font-bold block mb-1">🟥 Vermelho</span>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleQuickScoutDelta(s, 'cartoes_vermelhos', -1)}
                                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-black transition"
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-black text-red-400 w-5 text-center">
                                    {s.cartoes_vermelhos || 0}
                                  </span>
                                  <button
                                    onClick={() => handleQuickScoutDelta(s, 'cartoes_vermelhos', 1)}
                                    className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-black transition"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Ações do Card */}
                          <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                            <span className="text-[10px] text-zinc-500">
                              {s.gols_sofridos_goleiro ? `Gols sofridos: ${s.gols_sofridos_goleiro}` : ''}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingScout(s);
                                  setScoutForm({
                                    partida_id: s.partida_id,
                                    atleta_id: s.atleta_id,
                                    gols: s.gols || 0,
                                    assistencias: s.assistencias || 0,
                                    cartoes_amarelos: s.cartoes_amarelos || 0,
                                    cartoes_vermelhos: s.cartoes_vermelhos || 0,
                                    gols_sofridos_goleiro: s.gols_sofridos_goleiro || 0,
                                    minutos_jogados: s.minutos_jogados || 90,
                                    foi_mvp: Boolean(s.foi_mvp),
                                  });
                                  setModalScoutOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-emerald-400 transition"
                                title="Editar Scout Completo"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteScout(s)}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-red-400 transition"
                                title="Excluir Scout"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* MODO 2: LEADERBOARD GERAL */}
            {scoutViewMode === 'leaderboard' && (
              <div className="space-y-4">
                {/* 4 Cards de Destaque no Topo */}
                {(() => {
                  const artilheiro = [...scoutsLeaderboard].sort((a, b) => b.gols - a.gols)[0];
                  const garcom = [...scoutsLeaderboard].sort((a, b) => b.assistencias - a.assistencias)[0];
                  const reiMvp = [...scoutsLeaderboard].sort((a, b) => b.mvps - a.mvps)[0];
                  const minutagem = [...scoutsLeaderboard].sort((a, b) => b.minutos - a.minutos)[0];

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">⚽ Artilheiro</p>
                          <h4 className="font-bold text-sm text-zinc-100 mt-1">{artilheiro?.atleta_nome || 'Nenhum'}</h4>
                          <p className="text-[11px] text-zinc-500">{artilheiro?.posicao} • {artilheiro?.jogos || 0} jogos</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-emerald-400">{artilheiro?.gols || 0}</span>
                          <span className="text-[10px] text-zinc-500 block">gols</span>
                        </div>
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">🎯 Líder em Assists</p>
                          <h4 className="font-bold text-sm text-zinc-100 mt-1">{garcom?.atleta_nome || 'Nenhum'}</h4>
                          <p className="text-[11px] text-zinc-500">{garcom?.posicao} • {garcom?.jogos || 0} jogos</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-blue-400">{garcom?.assistencias || 0}</span>
                          <span className="text-[10px] text-zinc-500 block">passes</span>
                        </div>
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">⭐ Rei do MVP</p>
                          <h4 className="font-bold text-sm text-zinc-100 mt-1">{reiMvp?.atleta_nome || 'Nenhum'}</h4>
                          <p className="text-[11px] text-zinc-500">{reiMvp?.posicao} • {reiMvp?.jogos || 0} jogos</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-amber-400">{reiMvp?.mvps || 0}</span>
                          <span className="text-[10px] text-zinc-500 block">eleições</span>
                        </div>
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">⏱️ Mais Minutos</p>
                          <h4 className="font-bold text-sm text-zinc-100 mt-1">{minutagem?.atleta_nome || 'Nenhum'}</h4>
                          <p className="text-[11px] text-zinc-500">{minutagem?.posicao} • {minutagem?.jogos || 0} jogos</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-purple-400">{minutagem?.minutos || 0}</span>
                          <span className="text-[10px] text-zinc-500 block">minutos</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Tabela Completa do Leaderboard */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-zinc-300">
                      <thead className="bg-zinc-950/80 text-zinc-400 font-semibold border-b border-zinc-800">
                        <tr>
                          <th className="py-3 px-3.5 text-center w-12">#</th>
                          <th className="py-3 px-3.5">Atleta</th>
                          <th className="py-3 px-3.5 text-center">Posição</th>
                          <th className="py-3 px-3.5 text-center">Jogos</th>
                          <th className="py-3 px-3.5 text-center">⚽ Gols</th>
                          <th className="py-3 px-3.5 text-center">🎯 Assists</th>
                          <th className="py-3 px-3.5 text-center">Participações</th>
                          <th className="py-3 px-3.5 text-center">🟨 / 🟥</th>
                          <th className="py-3 px-3.5 text-center">⭐ MVPs</th>
                          <th className="py-3 px-3.5 text-center">Minutos</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {scoutsLeaderboard
                          .filter((item) => {
                            if (!searchQuery) return true;
                            const q = searchQuery.toLowerCase();
                            return (
                              item.atleta_nome.toLowerCase().includes(q) ||
                              item.atleta_apelido.toLowerCase().includes(q) ||
                              item.posicao.toLowerCase().includes(q)
                            );
                          })
                          .map((item, idx) => (
                            <tr key={item.atleta_id} className="hover:bg-zinc-800/40 transition">
                              <td className="py-3 px-3.5 text-center font-bold text-zinc-500">
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                              </td>
                              <td className="py-3 px-3.5">
                                <div className="font-bold text-zinc-100 flex items-center gap-1.5">
                                  <span>{item.atleta_nome}</span>
                                  {item.atleta_apelido && (
                                    <span className="text-zinc-500 font-normal">({item.atleta_apelido})</span>
                                  )}
                                  {item.numero_camisa && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-black">
                                      #{item.numero_camisa}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3.5 text-center">
                                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-semibold text-[10px]">
                                  {item.posicao}
                                </span>
                              </td>
                              <td className="py-3 px-3.5 text-center font-bold text-zinc-300">{item.jogos}</td>
                              <td className="py-3 px-3.5 text-center font-black text-emerald-400">{item.gols}</td>
                              <td className="py-3 px-3.5 text-center font-black text-blue-400">{item.assistencias}</td>
                              <td className="py-3 px-3.5 text-center font-black text-zinc-100">
                                {item.participacoes_gols}
                              </td>
                              <td className="py-3 px-3.5 text-center font-semibold text-zinc-400">
                                <span className="text-amber-400">{item.cartoes_amarelos}</span> /{' '}
                                <span className="text-red-400">{item.cartoes_vermelhos}</span>
                              </td>
                              <td className="py-3 px-3.5 text-center">
                                {item.mvps > 0 ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black">
                                    <Star className="w-3 h-3 fill-amber-300" />
                                    {item.mvps}
                                  </span>
                                ) : (
                                  <span className="text-zinc-600">-</span>
                                )}
                              </td>
                              <td className="py-3 px-3.5 text-center text-zinc-400">{item.minutos}'</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-zinc-400">
                    Selecionar Adversário Cadastrado
                  </label>
                  {adversarios.length > 0 && (
                    <span className="text-[10px] text-emerald-400 font-medium">Preenchimento automático</span>
                  )}
                </div>
                {adversarios.length > 0 && (
                  <select
                    value={partidaForm.adversario_id || ''}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const selected = adversarios.find((a) => a.id === selId);
                      if (selected) {
                        setPartidaForm({
                          ...partidaForm,
                          adversario_id: selected.id,
                          adversario: selected.nome,
                        });
                      } else {
                        setPartidaForm({
                          ...partidaForm,
                          adversario_id: '',
                        });
                      }
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 mb-2"
                  >
                    <option value="">Selecione um adversário pré-cadastrado...</option>
                    {adversarios
                      .filter((a) => a.ativo)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nome} {a.cor_uniforme_principal ? `(${a.cor_uniforme_principal})` : ''}
                        </option>
                      ))}
                  </select>
                )}
                <input
                  type="text"
                  required
                  placeholder="Ex: União Alvinegra F.C."
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

      {/* Modal Patrimônio & Fardamento Refatorado com Steps e Condicional Reativa */}
      {modalPatrimonioOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                <Shirt className="w-4 h-4 text-emerald-400" />
                <span>
                  {editingPatrimonio
                    ? 'Editar Item de Patrimônio'
                    : 'Adicionar Bem / Fardamento ao Almoxarifado'}
                </span>
              </h3>
              <button
                onClick={() => setModalPatrimonioOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePatrimonio} className="space-y-4">
              {/* STEP 1: CATEGORIA DO ITEM */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  1. Selecione a Categoria do Material
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'uniforme', label: '👕 Uniformes', sub: 'Camisas, calções, meiões' },
                    { id: 'bola', label: '⚽ Bolas', sub: 'Oficiais e treino' },
                    { id: 'colete', label: '🎽 Coletes', sub: 'Treino e pré-jogo' },
                    { id: 'treino_cones', label: '🎯 Treino', sub: 'Cones, pratos, estacas' },
                    { id: 'apoio', label: '📦 Apoio / Farmácia', sub: 'Gelo, faixas, malas' },
                    { id: 'outro', label: 'Outros', sub: 'Bens diversos' },
                  ].map((cat) => {
                    const isSelected =
                      patrimonioForm.categoria.toLowerCase() === cat.id ||
                      (['uniforme', 'uniformes', 'fardamento'].includes(patrimonioForm.categoria.toLowerCase()) &&
                        cat.id === 'uniforme');
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => {
                          setPatrimonioForm({
                            ...patrimonioForm,
                            categoria: cat.id,
                          });
                        }}
                        className={`p-2 rounded-xl text-left border transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-sm'
                            : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <span className="text-xs font-bold">{cat.label}</span>
                        <span className="text-[9px] opacity-70 mt-0.5 leading-tight">{cat.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: CONDICIONAL PARA CATEGORIA UNIFORMES */}
              {['uniforme', 'uniformes', 'fardamento'].includes(
                patrimonioForm.categoria.toLowerCase()
              ) && (
                <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-4 space-y-3.5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                    <div className="flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-blue-300">
                        2. Especificações do Fardamento Esportivo
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Obrigatório
                    </span>
                  </div>

                  {/* Campo Tipo de Peça */}
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1.5">
                      Tipo de Peça <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'camisa', label: '👕 Camisa de Jogo' },
                        { id: 'calcao', label: '🩳 Calção' },
                        { id: 'meiao', label: '🧦 Meião' },
                      ].map((tipo) => (
                        <button
                          type="button"
                          key={tipo.id}
                          onClick={() => {
                            setPatrimonioForm({
                              ...patrimonioForm,
                              tipo_uniforme: tipo.id as 'camisa' | 'meiao' | 'calcao',
                            });
                          }}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition text-center ${
                            patrimonioForm.tipo_uniforme === tipo.id
                              ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                              : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {tipo.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grid de 4 Campos: Qtd, Tamanho, Cor, Número */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-400 mb-1">
                        Qtd de Peças <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={patrimonioForm.quantidade_total}
                        onChange={(e) =>
                          setPatrimonioForm({
                            ...patrimonioForm,
                            quantidade_total: Math.max(1, Number(e.target.value)),
                          })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-400 mb-1">
                        Tamanho
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: GG"
                        value={patrimonioForm.tamanho}
                        onChange={(e) =>
                          setPatrimonioForm({ ...patrimonioForm, tamanho: e.target.value })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-400 mb-1">
                        Cor Principal
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Azul"
                        value={patrimonioForm.cor}
                        onChange={(e) =>
                          setPatrimonioForm({ ...patrimonioForm, cor: e.target.value })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-400 mb-1">
                        Número
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 10"
                        value={patrimonioForm.numero}
                        onChange={(e) =>
                          setPatrimonioForm({ ...patrimonioForm, numero: e.target.value })
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Chips Rápidos de Tamanho */}
                  <div>
                    <span className="text-[10px] text-zinc-400 font-medium mr-2">Tamanhos rápidos:</span>
                    <div className="inline-flex gap-1 flex-wrap mt-1">
                      {['P', 'M', 'G', 'GG', 'XG', 'Único'].map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setPatrimonioForm({ ...patrimonioForm, tamanho: t })}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                            patrimonioForm.tamanho === t
                              ? 'bg-blue-500/30 text-blue-300 border-blue-500/50'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Observação / Marca (ex: Adidas) */}
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 mb-1">
                      Observação / Fornecedor / Lote
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 1, GG, Azul, 10, Adidas (fornecedor, tecido, etc.)"
                      value={patrimonioForm.observacoes}
                      onChange={(e) =>
                        setPatrimonioForm({ ...patrimonioForm, observacoes: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Botão de Sugestão Automática de Nome */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const tipoNome =
                          patrimonioForm.tipo_uniforme === 'calcao'
                            ? 'Calção'
                            : patrimonioForm.tipo_uniforme === 'meiao'
                            ? 'Meião'
                            : 'Camisa';
                        const numStr = patrimonioForm.numero ? ` #${patrimonioForm.numero}` : '';
                        const corStr = patrimonioForm.cor ? ` ${patrimonioForm.cor}` : '';
                        const tamStr = patrimonioForm.tamanho ? ` (${patrimonioForm.tamanho})` : '';
                        const obsStr = patrimonioForm.observacoes ? ` - ${patrimonioForm.observacoes}` : '';
                        const autoNome = `${tipoNome}${numStr}${corStr}${tamStr}${obsStr}`.trim();
                        setPatrimonioForm({ ...patrimonioForm, nome: autoNome });
                      }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 underline font-medium inline-flex items-center gap-1"
                    >
                      <span>⚡ Preencher nome do item automaticamente com estes dados</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: NOME E QUANTIDADE (SE NÃO FOR UNIFORME) */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Nome de Identificação do Bem <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    ['uniforme', 'uniformes', 'fardamento'].includes(
                      patrimonioForm.categoria.toLowerCase()
                    )
                      ? 'Ex: Camisa #10 Azul (GG) - Adidas'
                      : 'Ex: Bolsão com 6 Bolas Penalty Campo...'
                  }
                  value={patrimonioForm.nome}
                  onChange={(e) => setPatrimonioForm({ ...patrimonioForm, nome: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {!['uniforme', 'uniformes', 'fardamento'].includes(
                patrimonioForm.categoria.toLowerCase()
              ) && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Quantidade Total <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={patrimonioForm.quantidade_total}
                      onChange={(e) =>
                        setPatrimonioForm({
                          ...patrimonioForm,
                          quantidade_total: Number(e.target.value),
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Observações / Detalhes
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Calibradas a 11 lbs"
                      value={patrimonioForm.observacoes}
                      onChange={(e) =>
                        setPatrimonioForm({ ...patrimonioForm, observacoes: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: ESTADO DE CONSERVAÇÃO */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Estado de Conservação
                </label>
                <select
                  value={patrimonioForm.estado_conservacao}
                  onChange={(e) =>
                    setPatrimonioForm({
                      ...patrimonioForm,
                      estado_conservacao: e.target.value as
                        | 'novo'
                        | 'bom'
                        | 'regular'
                        | 'desgastado',
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

              {/* AÇÕES */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalPatrimonioOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                >
                  {editingPatrimonio ? 'Salvar Alterações' : 'Cadastrar Item no Patrimônio'}
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

      {/* Modal Novo / Editar Adversário */}
      {modalAdversarioOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-sm text-zinc-100 mb-4">
              {editingAdversario ? 'Editar Adversário' : 'Novo Adversário / Rival'}
            </h3>
            <form onSubmit={handleSaveAdversario} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Nome do Time / Clube Adversário
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: União Alvinegra F.C."
                  value={adversarioForm.nome}
                  onChange={(e) => setAdversarioForm({ ...adversarioForm, nome: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Responsável / Contato</label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos (Capitão)"
                    value={adversarioForm.responsavel_nome}
                    onChange={(e) => setAdversarioForm({ ...adversarioForm, responsavel_nome: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="Ex: (11) 98765-4321"
                    value={adversarioForm.responsavel_telefone}
                    onChange={(e) => setAdversarioForm({ ...adversarioForm, responsavel_telefone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Cor do Uniforme Principal</label>
                  <input
                    type="text"
                    placeholder="Ex: Preto e Branco"
                    value={adversarioForm.cor_uniforme_principal}
                    onChange={(e) => setAdversarioForm({ ...adversarioForm, cor_uniforme_principal: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">URL do Escudo / Logo</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={adversarioForm.escudo_url}
                    onChange={(e) => setAdversarioForm({ ...adversarioForm, escudo_url: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Observações / Histórico de Confronto
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Time de contra-ataque rápido, bom relacionamento esportivo."
                  value={adversarioForm.observacoes}
                  onChange={(e) => setAdversarioForm({ ...adversarioForm, observacoes: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAdversarioOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  {editingAdversario ? 'Salvar Alterações' : 'Cadastrar Adversário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Scout */}
      {modalScoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">
                    {editingScout ? 'Editar Scout Individual' : 'Lançar Scout de Partida'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">Súmula estatística oficial de atleta</p>
                </div>
              </div>
              <button
                onClick={() => setModalScoutOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveScout} className="space-y-4">
              {/* Partida & Atleta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Partida</label>
                  <select
                    required
                    disabled={Boolean(editingScout)}
                    value={scoutForm.partida_id}
                    onChange={(e) => setScoutForm({ ...scoutForm, partida_id: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  >
                    <option value="">Selecione uma partida...</option>
                    {partidas.map((p) => (
                      <option key={p.id} value={p.id}>
                        vs {p.adversario} — {p.data_partida}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Atleta</label>
                  <select
                    required
                    disabled={Boolean(editingScout)}
                    value={scoutForm.atleta_id}
                    onChange={(e) => setScoutForm({ ...scoutForm, atleta_id: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  >
                    <option value="">Selecione um atleta...</option>
                    {atletas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.numero_camisa ? `#${a.numero_camisa} ` : ''}{a.nome} {a.apelido ? `(${a.apelido})` : ''} - {a.posicao_principal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Estatísticas Principais (Grid 2x3) */}
              <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80 space-y-3">
                <span className="text-[11px] font-bold text-zinc-300 block uppercase tracking-wider">
                  Métricas da Partida
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">⚽ Gols Marcados</label>
                    <input
                      type="number"
                      min={0}
                      value={scoutForm.gols}
                      onChange={(e) => setScoutForm({ ...scoutForm, gols: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">🎯 Assistências</label>
                    <input
                      type="number"
                      min={0}
                      value={scoutForm.assistencias}
                      onChange={(e) => setScoutForm({ ...scoutForm, assistencias: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-blue-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">⏱️ Minutos Jogados</label>
                    <input
                      type="number"
                      min={0}
                      value={scoutForm.minutos_jogados}
                      onChange={(e) => setScoutForm({ ...scoutForm, minutos_jogados: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">🟨 Cartões Amarelos</label>
                    <input
                      type="number"
                      min={0}
                      value={scoutForm.cartoes_amarelos}
                      onChange={(e) => setScoutForm({ ...scoutForm, cartoes_amarelos: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">🟥 Cartões Vermelhos</label>
                    <input
                      type="number"
                      min={0}
                      value={scoutForm.cartoes_vermelhos}
                      onChange={(e) => setScoutForm({ ...scoutForm, cartoes_vermelhos: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-red-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">🧤 Gols Sofridos (Goleiro)</label>
                    <input
                      type="number"
                      min={0}
                      value={scoutForm.gols_sofridos_goleiro}
                      onChange={(e) => setScoutForm({ ...scoutForm, gols_sofridos_goleiro: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Destaque MVP com Exclusividade */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="scoutFoiMvp"
                  checked={scoutForm.foi_mvp}
                  onChange={(e) => setScoutForm({ ...scoutForm, foi_mvp: e.target.checked })}
                  className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
                <label htmlFor="scoutFoiMvp" className="cursor-pointer">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                    <Star className={`w-3.5 h-3.5 ${scoutForm.foi_mvp ? 'fill-amber-300' : ''}`} />
                    <span>Eleger como Craque da Partida (MVP)</span>
                  </div>
                  <p className="text-[10px] text-amber-300/70 mt-0.5">
                    Regra estrita: Ao marcar este atleta como MVP, qualquer outro atleta eleito nesta mesma partida terá o título transferido automaticamente.
                  </p>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalScoutOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  {editingScout ? 'Salvar Alterações' : 'Registrar Scout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
