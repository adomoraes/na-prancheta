import React, { useState } from 'react';
import { 
  Clock, 
  Users, 
  Shield, 
  DollarSign, 
  Lock, 
  Trophy, 
  Check, 
  AlertCircle, 
  Copy, 
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Beer
} from 'lucide-react';

interface FeatureTab {
  id: string;
  name: string;
  badge: string;
  icon: React.ElementType;
  color: string;
  tagline: string;
  description: string;
  businessRule: string;
  moatHighlight: string;
}

export const LandingFeatureShowcase: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const [activeTabId, setActiveTabId] = useState('vestiario');
  const [copiedPix, setCopiedPix] = useState(false);
  const [demoLocked, setDemoLocked] = useState(true);

  const tabs: FeatureTab[] = [
    {
      id: 'vestiario',
      name: '1. Protocolo do Vestiário (T-35)',
      badge: 'Regra Disciplinar',
      icon: Clock,
      color: 'from-emerald-500 to-teal-400',
      tagline: 'Linha do tempo regressiva inegociável para dia de jogo',
      description: 'Estrutura o cronograma em 4 marcos críticos: T-70 (Abertura do Vestiário), T-50 (Distribuição de Uniformes), T-35 (Preleção & Corte de Titulares) e T-25 (Aquecimento de Campo).',
      businessRule: 'RN-02: Qualquer atleta que chegue após o limite T-35 tem sua titularidade bloqueada no sistema e inicia obrigatoriamente no banco.',
      moatHighlight: 'Despolitiza o vestiário: a culpa pelo banco de reservas não é do treinador, é do cronômetro oficial do clube.',
    },
    {
      id: 'presenca',
      name: '2. Presença em 1 Toque & Espera',
      badge: 'Ergonomia Mobile',
      icon: Users,
      color: 'from-blue-500 to-cyan-400',
      tagline: 'Confirmação ultrarrápida com teto estrito de 14',
      description: 'Acaba com o estresse de contar cabeças. Atletas respondem em 1 toque ("Vou", "Não Vou", "Dúvida"). O sistema trava nos 14 primeiros confirmados e aloca automaticamente os excedentes na Lista de Espera.',
      businessRule: 'RN-01: Apenas os confirmados entram na escalação e na divisão de custos. O 15º confirmado vira primeiro reserva da fila.',
      moatHighlight: 'Reduz o tempo de fechamento de lista de 3 dias para menos de 40 minutos na quinta-feira à noite.',
    },
    {
      id: 'tatica',
      name: '3. Prancheta Tática 4-3-3',
      badge: 'Comissão Técnica',
      icon: Shield,
      color: 'from-indigo-500 to-purple-400',
      tagline: 'Visualização interativa de campo com travas de segurança',
      description: 'Prancheta visual do campo sintético onde o treinador posiciona os 11 titulares no esquema tático. O sistema impede a escalação de atletas atrasados na preleção ou acima do teto regulamentar.',
      businessRule: 'RN-03: Teto estrito de 11 titulares. Para escalar um reserva, é obrigatório desmarcar previamente um titular em campo.',
      moatHighlight: 'Comunicação tática clara no telão ou celular dos jogadores, reduzindo ansiedade e dúvidas antes de entrar no gramado.',
    },
    {
      id: 'tesoureiro',
      name: '4. Tesoureiro & Vaquinha PIX',
      badge: 'FinTech Integrada',
      icon: DollarSign,
      color: 'from-amber-500 to-yellow-400',
      tagline: 'Rateio da arbitragem com zero calotes no final do mês',
      description: 'A meta de R$ 300,00 da arbitragem é dividida automaticamente entre os confirmados. Cópia da chave PIX em 1 toque, relatório formatado para colar no grupo do WhatsApp e baixa instantânea.',
      businessRule: 'RN-06 e RN-07: Todo saldo arrecadado além dos R$ 300,00 da arbitragem é transferido automaticamente para o Caixa Geral da agremiação.',
      moatHighlight: '98,4% de taxa de conversão do PIX da rodada. O tesoureiro nunca mais precisou cobrir prejuízo do próprio salário.',
    },
    {
      id: 'almoxarifado',
      name: '5. A Lendária "Trava da Resenha"',
      badge: 'Cultura de Vestiário',
      icon: Lock,
      color: 'from-rose-500 to-pink-400',
      tagline: 'Nenhuma cerveja abre até a conferência do patrimônio',
      description: 'O maior choque cultural do futebol amador: o consumo de bebidas e a confraternização social permanecem bloqueados no app até o almoxarife validar a tríplice conferência de materiais.',
      businessRule: 'RN-08 e RN-09: 22 camisas oficiais desviradas para lavagem, 6 bolas recolhidas no gramado e mala 1 trancada no veículo oficial de transporte.',
      moatHighlight: 'Zero fardamentos perdidos na temporada. Os próprios jogadores ajudam a desvirar as camisas para liberar o cooler de cerveja.',
    },
    {
      id: 'scout',
      name: '6. Scout Pós-Jogo & Eleição de MVP',
      badge: 'Gamificação & Dados',
      icon: Trophy,
      color: 'from-purple-500 to-emerald-400',
      tagline: 'Estatísticas individuais, artilharia e consagração do Craque',
      description: 'Registro ágil pós-jogo em menos de 2 minutos: gols, assistências, cartões e minutagem por atleta. Votação e eleição auditada de um único Craque da Partida (MVP) para alimentar o ranking do clube.',
      businessRule: 'RN-11: Unicidade estrita do MVP no banco de dados. Apenas um atleta por confronto pode ostentar o título de Craque do Jogo.',
      moatHighlight: 'Alimenta o ego saudável do elenco e vira moeda social de compartilhamento orgânico nos stories do Instagram.',
    },
  ];

  const currentTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleCopyPix = () => {
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <section id="pilares" className="py-24 bg-zinc-950 relative border-t border-zinc-900 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 font-mono">
            <span>Diferenciais Tecnológicos & Culturais</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Cabinet_Grotesk']">
            Os 5 Pilares que Criam a Nossa Fortaleza Competitiva
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-['Plus_Jakarta_Sans']">
            Não somos um software frio: codificamos os rituais sagrados da várzea e do futebol amador em regras de software inegociáveis.
          </p>
        </div>

        {/* Tab Selector & Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Tab Selector List */}
          <div className="lg:col-span-5 space-y-2.5">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = tab.id === activeTabId;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 border flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/40 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-lg border transition-colors ${
                      isActive 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}>
                      <TabIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                          {tab.name}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                        {tab.tagline}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 ml-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Mockup & Detailed Explanation */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
              
              {/* Pillar Header */}
              <div className="border-b border-zinc-800/80 pb-6 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider">
                    {currentTab.badge}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    Arquitetura Rastreável: _reversa_sdd/domain.md
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Cabinet_Grotesk'] mb-2">
                  {currentTab.name}
                </h3>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-['Plus_Jakarta_Sans']">
                  {currentTab.description}
                </p>
              </div>

              {/* Dynamic Interactive Mockup Box based on Active Tab */}
              <div className="mb-6 rounded-xl bg-zinc-950/80 border border-zinc-800 p-5 shadow-inner">
                
                {/* 1. VESTIARIO MOCKUP */}
                {activeTabId === 'vestiario' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono border-b border-zinc-800/80 pb-3">
                      <span>RÉGUA REGRESSIVA DE DIA DE JOGO</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        T-32 MIN PARA O APITO
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <span className="block font-bold text-white text-sm">T-70</span>
                        <span className="text-[10px]">Abertura</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <span className="block font-bold text-white text-sm">T-50</span>
                        <span className="text-[10px]">Uniformes</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300">
                        <span className="block font-bold text-amber-400 text-sm">T-35</span>
                        <span className="text-[10px] font-bold">Corte Preleção</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <span className="block font-bold text-white text-sm">T-25</span>
                        <span className="text-[10px]">Aquecimento</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span><strong>Alerta Disciplinar Ativo:</strong> Atleta Rodrigo (Camisa 10) chegou às T-28 min e foi transferido compulsória e automaticamente para os reservas.</span>
                    </div>
                  </div>
                )}

                {/* 2. PRESENCA MOCKUP */}
                {activeTabId === 'presenca' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono border-b border-zinc-800/80 pb-3">
                      <span>CONTROLE DE QUÓRUM REGULAMENTAR</span>
                      <span className="text-blue-400 font-bold">14 / 14 CONFIRMADOS (TETO ATINGIDO)</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" /> Vou (14)
                      </button>
                      <button className="flex-1 py-2.5 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 font-medium text-xs">
                        Não Vou (4)
                      </button>
                      <button className="flex-1 py-2.5 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 font-medium text-xs">
                        Dúvida (1)
                      </button>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span><strong>Lista de Espera:</strong> 3 atletas aguardando desistência</span>
                      </div>
                      <span className="font-mono text-zinc-400 text-[11px]">1º da fila: Paulinho Meia</span>
                    </div>
                  </div>
                )}

                {/* 3. TATICA MOCKUP */}
                {activeTabId === 'tatica' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono border-b border-zinc-800/80 pb-3">
                      <span>ESQUEMA 4-3-3 POSICIONAL</span>
                      <span className="text-purple-400 font-bold">11 TITULARES ESCALADOS</span>
                    </div>

                    <div className="relative h-32 rounded-lg bg-gradient-to-b from-emerald-950/40 to-zinc-950 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                        <div className="w-20 h-20 rounded-full border border-emerald-400" />
                        <div className="w-full h-0.5 bg-emerald-400 absolute" />
                      </div>
                      <div className="flex items-center gap-6 z-10 text-[11px] font-mono font-bold text-zinc-200">
                        <span className="px-2 py-1 bg-zinc-900/90 rounded border border-zinc-700">1-Goleiro</span>
                        <span className="px-2 py-1 bg-zinc-900/90 rounded border border-zinc-700">4-Defesa</span>
                        <span className="px-2 py-1 bg-zinc-900/90 rounded border border-zinc-700">3-Meio</span>
                        <span className="px-2 py-1 bg-zinc-900/90 rounded border border-zinc-700">3-Ataque</span>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-400 flex items-center justify-between font-mono">
                      <span>Bloqueio Antiatraso:</span>
                      <span className="text-emerald-400 font-bold">100% dos titulares pontuais</span>
                    </div>
                  </div>
                )}

                {/* 4. TESOUREIRO MOCKUP */}
                {activeTabId === 'tesoureiro' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono border-b border-zinc-800/80 pb-3">
                      <span>RATEIO DA ARBITRAGEM (R$ 300,00)</span>
                      <span className="text-emerald-400 font-bold">R$ 350,00 ARRECADADOS</span>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-zinc-400">CHAVE PIX DO TIME:</span>
                        <span className="text-xs font-mono font-bold text-white">financeiro@canabisfc.com.br</span>
                      </div>
                      <button 
                        onClick={handleCopyPix}
                        className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar PIX'}</span>
                      </button>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                      <span>Arbitragem Quitada (R$ 300,00)</span>
                      <span className="font-bold">+ R$ 50,00 creditados no Caixa do Clube</span>
                    </div>
                  </div>
                )}

                {/* 5. ALMOXARIFADO MOCKUP */}
                {activeTabId === 'almoxarifado' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono border-b border-zinc-800/80 pb-3">
                      <span>TRÍPLICE CONFERÊNCIA PÓS-JOGO</span>
                      <span className={`font-bold ${demoLocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {demoLocked ? 'RESENHA BLOQUEADA' : 'RESENHA LIBERADA'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800">
                        <span className="text-zinc-300">1. 22 camisas desviradas do lado correto:</span>
                        <span className="text-emerald-400 font-bold font-mono">22 / 22 CONFERIDAS</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800">
                        <span className="text-zinc-300">2. 6 bolas oficiais no bolsão:</span>
                        <span className="text-emerald-400 font-bold font-mono">6 / 6 RECOLHIDAS</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800">
                        <span className="text-zinc-300">3. Mala 1 trancada no porta-malas:</span>
                        <button
                          onClick={() => setDemoLocked(!demoLocked)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                            demoLocked 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {demoLocked ? 'Clique p/ Trancar' : 'Trancada no Carro'}
                        </button>
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      demoLocked
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        {demoLocked ? <Lock className="w-4 h-4 text-rose-400" /> : <Beer className="w-4 h-4 text-emerald-400" />}
                        <span>{demoLocked ? 'Cerveja e resenha bloqueadas pela governança.' : 'Mala trancada com sucesso. Cerveja liberada!'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. SCOUT MOCKUP */}
                {activeTabId === 'scout' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono border-b border-zinc-800/80 pb-3">
                      <span>SCOUT RÁPIDO & ELEIÇÃO DE MVP</span>
                      <span className="text-amber-400 font-bold">CRAQUE DA RODADA ELEITO</span>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
                          10
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Danilo Artilheiro</div>
                          <div className="text-[11px] text-zinc-400">2 Gols • 1 Assistência • 80 Minutos</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-amber-500 text-zinc-950 font-black text-xs flex items-center gap-1 shadow-md">
                        <Trophy className="w-3.5 h-3.5" /> Craque MVP
                      </span>
                    </div>

                    <div className="text-xs text-zinc-400 flex items-center justify-between font-mono">
                      <span>Garantia de Unicidade:</span>
                      <span className="text-emerald-400 font-bold">Apenas 1 MVP por partida (ACID)</span>
                    </div>
                  </div>
                )}

              </div>

              {/* Business Rule & Moat Highlights */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-300">
                  <span className="font-mono text-emerald-400 font-bold block mb-1">
                    REGRA DE NEGÓCIO EMBUTIDA:
                  </span>
                  <p>{currentTab.businessRule}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                  <span className="font-mono text-emerald-400 font-bold block mb-1">
                    O DIFERENCIAL COMPETITIVO (MOAT):
                  </span>
                  <p>{currentTab.moatHighlight}</p>
                </div>
              </div>

              {/* Bottom Call to Action inside Panel */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Quer ver como funciona na prática?
                </span>
                <button
                  onClick={onEnterApp}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer hover:underline"
                >
                  <span>Abrir tela real no App Operacional</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
