---
schemaVersion: 1
generatedAt: 2026-09-18T15:57:00-03:00
reversa:
  version: "1.3.3"
kind: target_screens
producedBy: screen-translator
mode: modernized
sourcePlatform: web-spa
targetPlatform: web-spa
adapter: adapters/web-spa__web-spa
screenCount: 8
hash: "sha256:4da2a9198bfbc3a53c0fca3e5a631fd17c5202cd2f19854d37204fafc944679d"
---

# Target Screens — Na Prancheta

> Especificação executável de cada tela do sistema novo em **React 19 + TypeScript + Vite + Tailwind CSS v4**, conectada à API REST do **Laravel 11**.
> Modo aplicado: **modernizado** (enriquecido com 4 estados assíncronos: `idle`, `loading`, `error`, `success`, mutações com feedback otimista e suporte a Sanctum).

---

## Resumo
- **Modo aplicado**: `modernizado`
- **Telas geradas**: 8 (7 telas legadas modernizadas + 1 tela nova de autenticação Sanctum)
- **Adapter**: `adapters/web-spa__web-spa`
- **Design System**: Dark Mode Zinc 950 com acentos semânticos (Esmeralda, Azul, Âmbar, Roxo, Rosa), tipografias `Plus Jakarta Sans` e `Cabinet Grotesk`.
- **Deviations registradas**: 4 em `screen_deviation_log.md` (toasts modernos, skeleton loaders, máscara de telefone e campos estendidos de súmula).

---

## SCR-0001: VestiarioTimeline (Linha do Tempo e Protocolo do Vestiário)
- **Origem**: `src/components/VestiarioTimeline.tsx:1`
- **Modo aplicado**: `modernizado`
- **Rota / Contexto**: `/vestiario` | BC-02 (Partidas & Vestiário)
- **Estados obrigatórios**: `[idle, loading, error, success]`
- **Endpoint consumido**: `GET /api/partidas/{id}/protocolo-vestiario`
- **Tela crítica?**: Sim (rege a disciplina e o aquecimento neuromuscular pré-jogo)

```yaml
spec.kind: component-tree
spec.states: [idle, loading, error, success]
spec.root:
  component: VestiarioContainer
  tokens: [bg-zinc-950, text-zinc-100, font-sans]
  children:
    - component: TimelineHeader
      tokens: [border-b, border-zinc-800, pb-4]
      children:
        - component: CountdownTimer
          tokens: [font-display, text-3xl, font-bold, text-emerald-400]
          content: "T-{{countdownMinutes}} min para o início"
          interpolation:
            countdownMinutes: "Calculado dinamicamente: now() vs partida.horario_inicio"
        - component: PrelecaoBadge
          condition: "countdownMinutes <= 35"
          tokens: [bg-rose-500/20, text-rose-300, border-rose-500/30]
          content: "PORTAS FECHADAS — PRELEÇÃO EM ANDAMENTO (T-35)"
    - component: MarcoList
      children:
        - component: MarcoItem
          loop: marcos
          tokens: [p-4, rounded-xl, border, border-zinc-800/80]
          properties:
            titulo: "{{marco.titulo}}"
            horario: "{{marco.horario_alvo}}"
            status: "{{marco.concluido ? 'concluido' : 'pendente'}}"
            faseAtual: "{{marco.minutos_offset === marcoAtual}}"
    - component: SequenciaFisiologicaCard
      tokens: [bg-zinc-900/60, rounded-2xl, p-5, border-zinc-800]
      children:
        - component: SectionTitle
          content: "Sequência Fisiológica (25 min no Campo)"
        - component: AquecimentoGrid
          items:
            - fase: 1
              nome: "Ativação Miofascial"
              duracao: "5 min"
            - fase: 2
              nome: "Mobilidade Dinâmica"
              duracao: "7 min"
            - fase: 3
              nome: "Deslocamentos e Aceleração"
              duracao: "6 min"
            - fase: 4
              nome: "Ações Técnicas com Bola"
              duracao: "7 min"
```

---

## SCR-0002: MatchCardConfirmacao (Ficha da Partida e Presença)
- **Origem**: `src/components/MatchCardConfirmacao.tsx:1`
- **Modo aplicado**: `modernizado`
- **Rota / Contexto**: `/` ou `/partida` | BC-02 (Partidas & Convocação)
- **Estados obrigatórios**: `[idle, loading, error, success]`
- **Endpoints consumidos**: 
  - `GET /api/partidas/{id}`
  - `POST /api/partidas/{id}/presencas` (Payload: `{ status: 'confirmado' | 'ausente' | 'duvida' }`)
- **Tela crítica?**: Sim (ponto de entrada de todos os atletas)

```yaml
spec.kind: component-tree
spec.states: [idle, loading, error, success]
spec.root:
  component: MatchCardContainer
  tokens: [bg-zinc-900, rounded-3xl, p-6, border-zinc-800]
  children:
    - component: MatchHeader
      children:
        - component: TeamVersusTitle
          tokens: [font-display, text-2xl, font-bold]
          content: "{{partida.time_casa}} vs {{partida.adversario}}"
        - component: MatchMetadata
          content: "{{partida.data_formatada}} às {{partida.horario_inicio}} • {{partida.local_nome}}"
        - component: MapsButton
          tokens: [bg-zinc-800, text-xs, text-zinc-300, hover:bg-zinc-700]
          action: "Abrir deep link do Google Maps"
          url: "{{partida.local_maps_url}}"
    - component: AttendanceStatusCounter
      tokens: [bg-zinc-950, rounded-2xl, p-4, my-5]
      children:
        - component: ConfirmadosBadge
          tokens: [text-emerald-400, font-bold]
          content: "{{confirmadosCount}} / {{partida.limite_confirmados}} Confirmados"
        - component: FilaEsperaBadge
          condition: "filaEsperaCount > 0"
          tokens: [text-amber-400, text-xs]
          content: "+{{filaEsperaCount}} na Lista de Espera"
    - component: FastActionButtonsGrid
      tokens: [grid, grid-cols-3, gap-3]
      children:
        - component: TouchButton
          tokens: [min-h-[52px], bg-emerald-600, hover:bg-emerald-500, active:scale-95]
          label: "VOU"
          mutation: "POST /api/partidas/{id}/presencas { status: 'confirmado' }"
          optimisticUI: true
        - component: TouchButton
          tokens: [min-h-[52px], bg-rose-600, hover:bg-rose-500, active:scale-95]
          label: "NÃO VOU"
          mutation: "POST /api/partidas/{id}/presencas { status: 'ausente' }"
          optimisticUI: true
        - component: TouchButton
          tokens: [min-h-[52px], bg-amber-600, hover:bg-amber-500, active:scale-95]
          label: "DÚVIDA"
          mutation: "POST /api/partidas/{id}/presencas { status: 'duvida' }"
          optimisticUI: true
    - component: RosterSection
      tokens: [mt-6]
      children:
        - component: TabsSegregacao
          tabs: ["Confirmados ({{confirmadosCount}})", "Lista de Espera ({{filaEsperaCount}})", "Ausentes ({{ausentesCount}})"]
        - component: AtletaPresencaItem
          loop: atletasFiltrados
          tokens: [flex, items-center, justify-between, py-2.5, border-b, border-zinc-800/60]
          content: "#{{atleta.numero_camisa}} {{atleta.apelido}} ({{atleta.posicao_principal}})"
          badges:
            - tipoVinculo: "{{atleta.tipo_vinculo}}"
            - atrasado: "{{atleta.atrasado_prelecao_t35}}"
```

---

## SCR-0003: PranchetaTecnica (Prancheta Tática 4-3-3 e Escalação)
- **Origem**: `src/components/PranchetaTecnica.tsx:1`
- **Modo aplicado**: `modernizado`
- **Rota / Contexto**: `/tatica` | BC-03 (Tática & Escalação)
- **Estados obrigatórios**: `[idle, loading, error, success]`
- **Endpoints consumidos**: 
  - `GET /api/partidas/{id}/titulares`
  - `POST /api/partidas/{id}/titulares` (Payload: `{ titular_ids: string[] }`)
- **Tela crítica?**: Sim (define o time que entra em campo)

```yaml
spec.kind: component-tree
spec.states: [idle, loading, error, success]
spec.root:
  component: PranchetaContainer
  tokens: [bg-zinc-950, flex, flex-col, gap-6]
  children:
    - component: HeaderTatico
      children:
        - component: FormacaoBadge
          tokens: [bg-blue-500/20, text-blue-300, border-blue-500/40]
          content: "ESQUEMA 4-3-3 • TITULARES ({{titularesCount}}/11)"
        - component: AlertaDisciplinaT35
          tokens: [text-xs, text-zinc-400]
          content: "Regra Fundamental: Atleta que chega após T-35 perde vaga no 11 titular."
    - component: CampoTaticoVisual
      tokens: [relative, aspect-[3/4], bg-emerald-950/70, border-2, border-emerald-500/40, rounded-3xl, overflow-hidden]
      children:
        - component: LinhasDoGramadoOverlay
          tokens: [absolute, inset-0, pointer-events-none, opacity-40]
        - component: PosicaoNoCampo
          loop: posicoes433
          tokens: [absolute, transform, -translate-x-1/2, -translate-y-1/2]
          coordinates: "x: {{pos.coord_x_percent}}%, y: {{pos.coord_y_percent}}%"
          children:
            - component: BotaoJogadorTitular
              tokens: [w-14, h-14, rounded-full, border-2, flex, flex-col, items-center, justify-center]
              content: "#{{jogador.numero_camisa}} {{jogador.apelido}}"
              emptyState: "Posição Vazia (Toque para escalar)"
    - component: BancoReservasDrawer
      tokens: [bg-zinc-900, rounded-2xl, p-4, border-zinc-800]
      children:
        - component: SectionTitle
          content: "Disponíveis para o Jogo (Confirmados)"
        - component: AtletaCardReserva
          loop: atletasConfirmadosNaoTitulares
          tokens: [p-3, rounded-xl, bg-zinc-800/80, flex, items-center, justify-between]
          actions:
            - name: "Promover a Titular"
              condition: "titularesCount < 11 && !atleta.atrasado_prelecao_t35"
            - name: "Bloqueado por Atraso"
              condition: "atleta.atrasado_prelecao_t35"
              tokens: [text-rose-400, text-xs]
```

---

## SCR-0004: TesoureiroColeta (Painel da Vaquinha e Quitação PIX)
- **Origem**: `src/components/TesoureiroColeta.tsx:1`
- **Modo aplicado**: `modernizado`
- **Rota / Contexto**: `/financeiro` | BC-04 (Finanças & Vaquinha)
- **Estados obrigatórios**: `[idle, loading, error, success]`
- **Endpoints consumidos**: 
  - `GET /api/partidas/{id}/vaquinha`
  - `PATCH /api/partidas/{id}/vaquinha/{atletaId}/quitar` (Payload: `{ status: 'pago' }`)
- **Tela crítica?**: Sim (garante pagamento do trio de arbitragem e saúde financeira)

```yaml
spec.kind: component-tree
spec.states: [idle, loading, error, success]
spec.root:
  component: TesoureiroContainer
  children:
    - component: MetricCardsGrid
      tokens: [grid, grid-cols-2, md:grid-cols-4, gap-3]
      cards:
        - label: "Total Arrecadado"
          value: "R$ {{totalArrecadadoFormatado}}"
          tokens: [text-emerald-400]
        - label: "Meta Arbitragem"
          value: "R$ 300,00"
          tokens: [text-zinc-200]
        - label: "Saldo do Jogo"
          value: "R$ {{saldoExcedenteFormatado}}"
          tokens: [text-amber-400]
        - label: "Pendentes de PIX"
          value: "{{pendentesCount}} atletas"
          tokens: [text-rose-400]
    - component: ChavePixCard
      tokens: [bg-zinc-900, p-4, rounded-2xl, flex, items-center, justify-between, border-zinc-800]
      children:
        - component: PixInfo
          content: "Chave PIX do Dia: {{partida.chave_pix_cobranca}}"
        - component: CopyButton
          tokens: [bg-amber-600, hover:bg-amber-500, text-zinc-950, font-bold, px-4, py-2, rounded-xl]
          action: "Copiar chave para o clipboard"
    - component: CobrancaList
      loop: lancamentosVaquinha
      children:
        - component: CobrancaItem
          tokens: [flex, items-center, justify-between, p-3.5, border-b, border-zinc-800/80]
          content: "#{{atleta.numero_camisa}} {{atleta.apelido}} — R$ 25,00"
          actions:
            - component: ToggleQuitacaoButton
              tokens: "{{item.status === 'pago' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}}"
              content: "{{item.status === 'pago' ? 'PAGO' : 'PENDENTE'}}"
              mutation: "PATCH /api/partidas/{id}/vaquinha/{atletaId}/quitar"
    - component: WhatsAppExportButton
      tokens: [w-full, min-h-[52px], bg-emerald-600, hover:bg-emerald-500, font-bold, rounded-xl, mt-5]
      content: "COPIAR RELATÓRIO PARA WHATSAPP"
      action: "Gera texto formatado com quitações e chave PIX"
```

---

## SCR-0005: ScoutPosJogo (Scout Estatístico e MVP)
- **Origem**: `src/components/ScoutPosJogo.tsx:1`
- **Modo aplicado**: `modernizado`
- **Rota / Contexto**: `/scout` | BC-05 (Desempenho & Scout)
- **Estados obrigatórios**: `[idle, loading, error, success]`
- **Endpoints consumidos**: 
  - `GET /api/partidas/{id}/scouts`
  - `PUT /api/partidas/{id}/scouts/{atletaId}`
  - `POST /api/partidas/{id}/scouts/{atletaId}/mvp` (Transação de exclusividade estrita)

```yaml
spec.kind: component-tree
spec.states: [idle, loading, error, success]
spec.root:
  component: ScoutContainer
  children:
    - component: MvpBannerCard
      tokens: [bg-gradient-to-r, from-purple-900/60, to-zinc-900, p-5, rounded-3xl, border-purple-500/30]
      content: "CRAQUE DO JOGO (MVP): {{mvpAtleta ? mvpAtleta.apelido : 'Não eleito'}}"
    - component: ScoutGrid
      loop: atletasDaPartida
      children:
        - component: ScoutPlayerRow
          tokens: [bg-zinc-900, p-4, rounded-2xl, border-zinc-800, mb-3]
          children:
            - component: PlayerIdent
              content: "#{{atleta.numero_camisa}} {{atleta.apelido}}"
            - component: CountersRow
              children:
                - component: CounterControl
                  label: "Gols"
                  value: "{{scout.gols}}"
                  min: 0
                - component: CounterControl
                  label: "Assistências"
                  value: "{{scout.assistencias}}"
                  min: 0
                - component: CounterControl
                  label: "Cartões Amarelos"
                  value: "{{scout.cartoes_amarelos}}"
                  min: 0
                  max: 2
                - component: CounterControl
                  label: "Cartões Vermelhos"
                  value: "{{scout.cartoes_vermelhos}}"
                  min: 0
                  max: 1
            - component: MvpToggleButton
              tokens: "{{scout.foi_mvp ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'}}"
              content: "★ MVP"
              mutation: "POST /api/partidas/{id}/scouts/{atletaId}/mvp"
```

---

## SCR-0006: AlmoxarifadoView (Custódia e Trava da Resenha)
- **Origem**: `src/components/AlmoxarifadoView.tsx:1`
- **Modo aplicado**: `modernizado`
- **Rota / Contexto**: `/almoxarifado` | BC-06 (Patrimônio & Custódia)
- **Estados obrigatórios**: `[idle, loading, error, success]`
- **Endpoints consumidos**: 
  - `GET /api/partidas/{id}/almoxarifado`
  - `POST /api/partidas/{id}/almoxarifado/fechar-malas`

```yaml
spec.kind: component-tree
spec.states: [idle, loading, error, success]
spec.root:
  component: AlmoxarifadoContainer
  children:
    - component: TravaResenhaBanner
      tokens: "{{conferencia.resenha_liberada ? 'bg-emerald-950 border-emerald-500' : 'bg-rose-950/80 border-rose-500'}}"
      content: "{{conferencia.resenha_liberada ? 'RESENHA SOCIAL 100% LIBERADA 🍻' : 'TRAVA DA RESENHA ATIVA: Conclua a conferência para abrir as bebidas 🔒'}}"
    - component: ChecklistTripliceCard
      tokens: [bg-zinc-900, p-5, rounded-2xl, border-zinc-800, mt-4]
      children:
        - component: CheckboxItem
          label: "22 Camisas Recolhidas e DESVIRADAS"
          field: "todas_camisas_desviradas"
        - component: CheckboxItem
          label: "6 Bolas Oficiais Calibradas Recolhidas"
          field: "bolas_recolhidas"
        - component: CheckboxItem
          label: "Mala Trancada no Veículo de Transporte"
          field: "mala_trancada_no_carro"
    - component: FecharMalasButton
      tokens: [w-full, min-h-[52px], bg-rose-600, font-bold, rounded-xl, mt-5]
      disabledCondition: "!checklistCompleto"
      content: "CONFIRMAR CONFERÊNCIA & LIBERAR RESENHA"
      mutation: "POST /api/partidas/{id}/almoxarifado/fechar-malas"
```

---

## SCR-0007: SelfOnboardingModal (Cadastro Rápido de Atleta)
- **Origem**: `src/components/SelfOnboardingModal.tsx:1`
- **Modo aplicado**: `modernizado`
- **Rota / Contexto**: Modal / BC-01 (Elenco)
- **Estados obrigatórios**: `[idle, loading, error, success]`
- **Endpoints consumidos**: `POST /api/atletas` (com validação de camisa única)

```yaml
spec.kind: component-tree
spec.states: [idle, loading, error, success]
spec.root:
  component: ModalDialog
  tokens: [fixed, inset-0, bg-black/80, flex, items-center, justify-center, p-4]
  children:
    - component: OnboardingCard
      tokens: [bg-zinc-900, p-6, rounded-3xl, max-w-md, w-full, border-zinc-800]
      children:
        - component: ModalTitle
          content: "Entrar no Elenco do Na Prancheta"
        - component: InputField
          name: "nome"
          label: "Nome Completo"
          required: true
        - component: InputField
          name: "apelido"
          label: "Apelido de Jogo"
          required: true
        - component: InputField
          name: "numero_camisa"
          label: "Número de Camisa Preferencial (1 a 99)"
          required: true
          validationRule: "Único no time ativo (RN-OE-05)"
        - component: MaskedPhoneInput
          name: "phone"
          label: "WhatsApp / Celular"
          mask: "(99) 99999-9999"
          required: true
        - component: SelectField
          name: "posicao_principal"
          options: ["GOL", "LAD", "ZAG", "LAE", "VOL", "MC", "MEI", "PTE", "PTD", "CA"]
        - component: SubmitButton
          tokens: [w-full, min-h-[52px], bg-emerald-600, font-bold, rounded-xl, mt-4]
          label: "CADASTRAR ATLETA"
```

---

## SCR-0008: AuthLoginView (Tela de Autenticação Sanctum - Nova)
- **Origem**: Nova (decorrente da Decisão Humana 1: Autenticação Sanctum)
- **Modo aplicado**: `modernizado`
- **Rota / Contexto**: `/login` | BC-01 (Elenco & Identidade)
- **Estados obrigatórios**: `[idle, loading, error, success]`
- **Endpoints consumidos**: 
  - `POST /api/auth/login` (Credenciais: `{ phone, password }`)
  - `POST /api/auth/magic-link` (Login por 1 clique via WhatsApp)

```yaml
spec.kind: component-tree
spec.states: [idle, loading, error, success]
spec.root:
  component: AuthContainer
  tokens: [min-h-screen, bg-zinc-950, flex, flex-col, items-center, justify-center, p-4]
  children:
    - component: AppBrandHeader
      tokens: [font-display, text-3xl, font-extrabold, text-emerald-400, mb-6]
      content: "NA PRANCHETA ⚽"
    - component: LoginCard
      tokens: [bg-zinc-900, p-6, rounded-3xl, max-w-sm, w-full, border-zinc-800]
      children:
        - component: CardTitle
          content: "Acesso do Elenco & Comissão"
        - component: MaskedPhoneInput
          name: "phone"
          label: "Telefone / WhatsApp"
          mask: "(99) 99999-9999"
        - component: PasswordInput
          name: "password"
          label: "Senha"
        - component: SubmitButton
          tokens: [w-full, min-h-[52px], bg-emerald-600, font-bold, rounded-xl, mt-4]
          label: "ENTRAR NO VESTIÁRIO"
        - component: MagicLinkDisclaimer
          tokens: [text-xs, text-zinc-400, text-center, mt-4]
          content: "Ou clique no Link de Convocação recebido no grupo do time para entrar direto sem senha."
```
