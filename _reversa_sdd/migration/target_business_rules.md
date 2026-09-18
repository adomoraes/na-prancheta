---
schemaVersion: 1
generatedAt: 2026-09-18T15:30:00-03:00
reversa:
  version: "1.3.3"
kind: target_business_rules
producedBy: curator
hash: "sha256:b32c8b01480db14659fb7868f56ab392f836285a10fe0715d014f6d4320d4a51"
---

# Target Business Rules — Na Prancheta

> Catálogo de regras de negócio do legado com decisão de migração: MIGRAR, DESCARTAR ou DECISÃO HUMANA.
> Cada item rastreia para a origem em `_reversa_sdd/` e respeita a decisão transformacional em `paradigm_decision.md`.

## Resumo
- **Total de regras analisadas**: 28
- **MIGRAR**: 22
- **DESCARTAR**: 3 (detalhe em `discard_log.md`, 3 vinculadas a paradigma)
- **DECISÃO HUMANA**: 3 (autenticação de acesso, concorrência/tempo real e gestão de saldo da vaquinha)

---

## Regras MIGRAR

### BR-MIGRAR-001 (Protocolo Regressivo T-X do Vestiário)
- **Origem**: `_reversa_sdd/protocolo-vestiario/requirements.md` § RF-PV-01 / `domain.md:14`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: O sistema governa os marcos temporais regressivos em relação ao apito inicial ($T-0$): $T-70$ (Abertura do vestiário), $T-50$ (Fardamento e uniforme), $T-35$ (Preleção técnica e trava) e $T-25$ (Início do aquecimento em campo).
- **Justificativa de migração**: Essência do fluxo operacional pré-jogo.
- **Compatibilidade com paradigma alvo**: No Laravel, as etapas são calculadas a partir de `partidas.horario_inicio` via Carbon/DateTime, gerando timestamps canônicos sem depender de decrementos simulados de interface.

### BR-MIGRAR-002 (Corte Disciplinar Inegociável por Atraso - T-35)
- **Origem**: `_reversa_sdd/protocolo-vestiario/requirements.md` § RN-PV-02 / `domain.md:34`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Atleta que não estiver presente e pronto no vestiário até $T-35$ min antes da partida perde automaticamente a vaga nos 11 titulares e é direcionado para o banco de reservas.
- **Justificativa de migração**: Regra disciplinar central da cultura do time amador.
- **Compatibilidade com paradigma alvo**: Implementado via Domain Service e Form Request no Laravel (`EscalacaoTitularRequest`), que rejeita com HTTP 422 qualquer atleta marcado com `chegou_apos_t35 = true`.

### BR-MIGRAR-003 (Sequência Fisiológica em 4 Fases)
- **Origem**: `_reversa_sdd/protocolo-vestiario/requirements.md` § RF-PV-03 / `domain.md:17`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: O aquecimento pré-jogo no gramado segue protocolo neuromuscular rígido de 25 minutos dividido em: Fase 1 (Ativação Miofascial), Fase 2 (Mobilidade Dinâmica), Fase 3 (Deslocamentos e Aceleração) e Fase 4 (Ações Técnicas com Bola).
- **Justificativa de migração**: Prevenção de lesões musculares do elenco.
- **Compatibilidade com paradigma alvo**: Catálogo de etapas provido via seeder e endpoint `GET /api/partidas/{id}/protocolo-vestiario`.

### BR-MIGRAR-004 (Ficha Cadastral da Partida)
- **Origem**: `_reversa_sdd/confirmacao-presenca/requirements.md` § RF-CP-01
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Cada partida contém data/hora, local, endereço físico com coordenadas para deep link do Google Maps, adversário e cor do uniforme principal.
- **Justificativa de migração**: Contexto primário de convocação e mobilização do elenco.
- **Compatibilidade com paradigma alvo**: Tabela `partidas` no PostgreSQL com campos estruturados e geolocalização.

### BR-MIGRAR-005 (Resposta Rápida de Presença em 1 Toque)
- **Origem**: `_reversa_sdd/confirmacao-presenca/requirements.md` § RN-CP-02 / `domain.md:36`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Opções táteis imediatas para resposta do atleta: "Vou" (`confirmado`), "Não Vou" (`ausente`) e "Dúvida" (`duvida`).
- **Justificativa de migração**: Usabilidade prioritária mobile para atletas em trânsito.
- **Compatibilidade com paradigma alvo**: Endpoint `POST /api/partidas/{id}/presencas` com validação de enum (`status: confirmado | ausente | duvida | lista_espera`).

### BR-MIGRAR-006 (Segregação de Mensalistas e Convidados)
- **Origem**: `_reversa_sdd/confirmacao-presenca/requirements.md` § RN-CP-03 / `domain.md:25-26`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Atletas mensalistas têm prioridade de vaga na rodada em relação a convidados externos.
- **Justificativa de migração**: Sustentabilidade financeira e respeito aos membros contribuintes da agremiação.
- **Compatibilidade com paradigma alvo**: Coluna `tipo_vinculo: 'mensalista' | 'convidado'` na tabela `atletas`.

### BR-MIGRAR-007 (Teto de Vagas com Transbordamento para Lista de Espera)
- **Origem**: `_reversa_sdd/confirmacao-presenca/requirements.md` § RN-CP-05 / `questions.md`
- **Confiança original**: 🟢 CONFIRMADO (Validado com Usuário)
- **Descrição**: Quando o número de atletas confirmados atinge a capacidade máxima da partida, as confirmações subsequentes recebem automaticamente o status `lista_espera`.
- **Justificativa de migração**: Evita superlotação do banco e desorganização da rotação tática.
- **Compatibilidade com paradigma alvo**: Lógica transacional atômica no Laravel (`DB::transaction` com lock seletivo) garantindo contagem consistente sem race conditions.

### BR-MIGRAR-008 (Formação Tática Padrão 4-3-3)
- **Origem**: `_reversa_sdd/prancheta-tatica/requirements.md` § RN-PT-01
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Disposição posicional no campo contendo 1 Goleiro, 2 Zagueiros, 2 Laterais, 3 Meio-Campistas e 3 Atacantes.
- **Justificativa de migração**: Padrão de jogo tático consolidado da equipe.
- **Compatibilidade com paradigma alvo**: Coordenadas e posições vinculadas ao modelo `EscalacaoPosicao` no PostgreSQL.

### BR-MIGRAR-009 (Teto Rígido de 11 Titulares)
- **Origem**: `_reversa_sdd/prancheta-tatica/requirements.md` § RN-PT-02 / `domain.md:35`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: A prancheta impede a seleção de mais de 11 titulares simultâneos no campo.
- **Justificativa de migração**: Regra oficial das regras do jogo de futebol.
- **Compatibilidade com paradigma alvo**: Validação no Form Request `UpdateEscalacaoRequest` e regra de negócio no service garantindo `count(titulares) <= 11`.

### BR-MIGRAR-010 (Elegibilidade Estrita de Confirmados na Titularidade)
- **Origem**: `_reversa_sdd/prancheta-tatica/requirements.md` § RN-PT-03 / `domain.md:33`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Apenas atletas cujo status na partida seja `confirmado` podem ser selecionados para compor os 11 titulares.
- **Justificativa de migração**: Impede que faltosos ou atletas em dúvida apareçam no quadro tático de preleção.
- **Compatibilidade com paradigma alvo**: Verificação relacional no Eloquent: `$atleta->presencaNaPartida($partidaId)->status === 'confirmado'`.

### BR-MIGRAR-011 (Persistência Centralizada da Escalação Tática)
- **Origem**: `_reversa_sdd/prancheta-tatica/design.md` § 4.1 / `questions.md`
- **Confiança original**: 🟢 CONFIRMADO (Validado com Usuário)
- **Descrição**: A disposição tática e a seleção dos titulares devem ser persistidas em banco relacional, sobrevivendo a recargas e acessíveis a múltiplos dispositivos.
- **Justificativa de migração**: Eliminação do débito de volatilidade do storage local.
- **Compatibilidade com paradigma alvo**: Tabela `partida_titulares` com chaves estrangeiras `(partida_id, atleta_id, posicao_id)`.

### BR-MIGRAR-012 (Base de Cobrança da Vaquinha Restrita a Confirmados)
- **Origem**: `_reversa_sdd/tesoureiro-vaquinha/requirements.md` § RN-TV-01 / `domain.md:39`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: O rateio financeiro da partida é gerado exclusivamente para os atletas que confirmaram presença. Atletas ausentes não pagam taxa de campo/jogo.
- **Justificativa de migração**: Princípio financeiro justo acordado entre os atletas.
- **Compatibilidade com paradigma alvo**: Geração automática de `vaquinha_lancamentos` no PostgreSQL via Model Observer ou Event Listener disparado na confirmação de presença.

### BR-MIGRAR-013 (Meta Financeira da Rodada e Cota Individual)
- **Origem**: `_reversa_sdd/tesoureiro-vaquinha/requirements.md` § RN-TV-02 / `domain.md:40`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Cada partida possui meta de arrecadação financeira (default R$ 300,00 para arbitragem amadora) e cota individual (default R$ 25,00/atleta).
- **Justificativa de migração**: Transparência no custeio das despesas imediatas do jogo.
- **Compatibilidade com paradigma alvo**: Colunas `meta_arrecadacao` e `valor_cota` configuráveis por partida na tabela `partidas`.

### BR-MIGRAR-014 (Auditoria de Quitação de Taxa no Servidor)
- **Origem**: `_reversa_sdd/tesoureiro-vaquinha/requirements.md` § RN-TV-03
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Cada lançamento de taxa registra status (`pendente` | `pago`), data/hora da quitação e identificação do tesoureiro responsável pela baixa.
- **Justificativa de migração**: Prestação de contas auditável e fim de dúvidas sobre quem pagou o PIX.
- **Compatibilidade com paradigma alvo**: Tabela `vaquinha_lancamentos` com `status`, `pago_em: timestamp` e `tesoureiro_id: foreign key`.

### BR-MIGRAR-015 (Exportação Estruturada para WhatsApp)
- **Origem**: `_reversa_sdd/tesoureiro-vaquinha/requirements.md` § RN-TV-04 / `domain.md:41`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Geração de texto formatado com emojis dividindo confirmados que já quitaram a taxa, pendentes, total arrecadado, meta faltante e chave PIX para cópia e envio no grupo do WhatsApp.
- **Justificativa de migração**: Canal oficial de comunicação e cobrança da agremiação amadora.
- **Compatibilidade com paradigma alvo**: Endpoint `GET /api/partidas/{id}/vaquinha/whatsapp-report` ou geração no frontend consumindo payload canônico.

### BR-MIGRAR-016 (Chave PIX Parametrizada no Banco de Dados)
- **Origem**: `_reversa_sdd/tesoureiro-vaquinha/design.md` § 4.1 / `questions.md`
- **Confiança original**: 🟢 CONFIRMADO (Validado com Usuário)
- **Descrição**: A chave PIX do tesoureiro da rodada é dinâmica e configurável no banco, permitindo rotação da responsabilidade de cobrança entre partidas.
- **Justificativa de migração**: Elimina chave chumbada em código estático.
- **Compatibilidade com paradigma alvo**: Coluna `chave_pix_cobranca` na partida ou tabela `configuracoes_financeiras`.

### BR-MIGRAR-017 (Integridade dos Contadores de Scout)
- **Origem**: `_reversa_sdd/scout-pos-jogo/requirements.md` § RN-SPJ-01 / `domain.md:48`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Gols, assistências, cartões e minutos jogados não podem assumir valores negativos (`val >= 0`).
- **Justificativa de migração**: Consistência estatística dos relatórios da temporada.
- **Compatibilidade com paradigma alvo**: Check constraints no PostgreSQL (`CHECK (gols >= 0)`) e validação `integer|min:0` no Form Request.

### BR-MIGRAR-018 (Exclusividade Estrita do Craque do Jogo / MVP)
- **Origem**: `_reversa_sdd/scout-pos-jogo/requirements.md` § RN-SPJ-04 / `domain.md:49` / `questions.md`
- **Confiança original**: 🟢 CONFIRMADO (Validado com Usuário)
- **Descrição**: Apenas um atleta por partida pode ostentar o título de Craque do Jogo (MVP). A atribuição do MVP a um novo atleta remove a distinção do anterior automaticamente.
- **Justificativa de migração**: Valorização individual sem duplicação de prêmios.
- **Compatibilidade com paradigma alvo**: Transação atômica no Eloquent que reseta `foi_mvp = false` para os demais atletas daquela partida ao eleger um novo.

### BR-MIGRAR-019 (Custódia e Inventário de Materiais Esportivos)
- **Origem**: `_reversa_sdd/almoxarifado-patrimonio/requirements.md` § RN-AP-01 / `domain.md:23`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Registro e controle de saída/retorno do fardamento oficial (22 camisas numeradas), 6 bolas oficiais calibradas e kits de cones/coletes sob custódia de um responsável designado.
- **Justificativa de migração**: Prevenção de perda de patrimônio do clube amador.
- **Compatibilidade com paradigma alvo**: Tabela `itens_almoxarifado` e tabela relacional `partida_conferencias_materiais`.

### BR-MIGRAR-020 (Obrigatoriedade de Fardamentos Desvirados na Mala)
- **Origem**: `_reversa_sdd/almoxarifado-patrimonio/requirements.md` § RN-AP-02 / `domain.md:44`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: Camisas recolhidas após o jogo não podem ser guardadas do avesso na mala para evitar degradação de estampa e custos extras de lavagem.
- **Justificativa de migração**: Norma de convivência e conservação do patrimônio esportivo.
- **Compatibilidade com paradigma alvo**: Checklist item obrigatório persistido com validação booleana no backend.

### BR-MIGRAR-021 (Trava de Segurança da Resenha Social)
- **Origem**: `_reversa_sdd/almoxarifado-patrimonio/requirements.md` § RN-AP-03 / `domain.md:24,45`
- **Confiança original**: 🟢 CONFIRMADO
- **Descrição**: A confraternização social e o consumo de bebidas no pós-jogo permanecem bloqueados no sistema até que o custodiante confirme a tríplice checagem: (1) 22 camisas desviradas, (2) 6 bolas recolhidas e (3) mala trancada no veículo de transporte.
- **Justificativa de migração**: "Regra de Ouro" cultural do vestiário amador.
- **Compatibilidade com paradigma alvo**: Endpoint `POST /api/partidas/{id}/almoxarifado/fechar-malas` que valida a tríplice confirmação e emite timestamp de liberação da resenha.

### BR-MIGRAR-022 (Unicidade Estrita do Número da Camisa no Elenco Ativo)
- **Origem**: `_reversa_sdd/onboarding-elenco/requirements.md` § RN-OE-05 / `questions.md`
- **Confiança original**: 🟢 CONFIRMADO (Validado com Usuário)
- **Descrição**: Dois atletas ativos do mesmo time não podem ter o mesmo número de camisa preferencial. Duplicidades devem ser rejeitadas no cadastro e na edição.
- **Justificativa de migração**: Identificação inequívoca em súmula de arbitragem e na prancheta.
- **Compatibilidade com paradigma alvo**: Constraint relacional `UNIQUE(time_id, numero_camisa)` na tabela `atletas` do PostgreSQL e validação `Rule::unique('atletas')->where('time_id', ...)` no Laravel.

---

## Regras DESCARTAR (resumo)

| ID | Origem | Motivo curto | Vínculo a paradigma? |
|---|---|---|:---:|
| **BR-DESCARTAR-001** | `protocolo-vestiario/design.md` § 4.2 | Cronômetro de vestiário com decremento simulado via `setInterval` de 15s. | **Sim** |
| **BR-DESCARTAR-002** | `architecture.md:32-35` / `App.tsx` | Armazenamento síncrono monolítico de todo o estado em `window.localStorage`. | **Sim** |
| **BR-DESCARTAR-003** | `domain.md:57-58` / `VestiarioTimeline.tsx` | Verificação de atraso por parsing de string fraca (`includes('Atrasado')`). | **Sim** |

> O detalhamento completo, justificativas e substitutos no Laravel 11 constam em [`discard_log.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/discard_log.md).

---

## Regras DECISÃO HUMANA (RESOLVIDAS)

### BR-HUMANA-001 (Nível de Autenticação e Controle de Acesso no Backend)
- **Origem**: `_reversa_sdd/architecture.md:56-58`
- **Tipo de ambiguidade**: ⚠️ AMBÍGUA
- **Descrição**: No legado, qualquer usuário acessa e altera qualquer informação. No backend Laravel multi-usuário, precisamos definir a barreira de acesso para atletas vs comissão/tesoureiro.
- **Opções**:
  - **A)** Link de Partida + PIN Simples
  - **B)** Autenticação Completa (Laravel Sanctum) com perfis (`admin`, `tesoureiro`, `atleta`)
- **Decisão tomada**: **Opção B (Autenticação Completa com Laravel Sanctum)**
- **Decisor**: Ado
- **Decidido em**: 2026-09-18T15:36:32-03:00
- **Status**: RESOLVIDA

### BR-HUMANA-002 (Estratégia de Sincronização em Tempo Real)
- **Origem**: `_reversa_sdd/migration/migration_brief.md:47`
- **Tipo de ambiguidade**: ⚠️ AMBÍGUA
- **Descrição**: Forma de refletir confirmações de presença e pagamentos de PIX em múltiplos celulares simultâneos.
- **Opções**:
  - **A)** Polling Curto Inteligente (TanStack Query a cada 5–10s)
  - **B)** WebSockets Nativos com Laravel Reverb
- **Decisão tomada**: **Opção A (Polling Curto Inteligente via TanStack Query)**
- **Decisor**: Ado
- **Decidido em**: 2026-09-18T15:36:32-03:00
- **Status**: RESOLVIDA

### BR-HUMANA-003 (Gestão de Saldo Excedente da Vaquinha da Partida)
- **Origem**: `_reversa_sdd/gaps.md:45` (GAP-M-03) / `tesoureiro-vaquinha/requirements.md`
- **Tipo de ambiguidade**: 🔴 GAP DE DOMÍNIO
- **Descrição**: Quando o total arrecadado supera a meta da arbitragem (ex: arrecadado R$ 350,00 vs meta R$ 300,00), como o backend deve registrar o saldo excedente de R$ 50,00?
- **Opções**:
  - **A)** Caixa Geral Acumulado da Equipe (alimenta compra/reposição de materiais do almoxarifado)
  - **B)** Fechamento Isolado por Jogo (estanque)
- **Decisão tomada**: **Opção A (Caixa Geral Acumulado da Equipe)**
- **Decisor**: Ado
- **Decidido em**: 2026-09-18T15:36:32-03:00
- **Status**: RESOLVIDA

---

## Notas
- Todas as 22 regras de negócio em MIGRAR possuem compatibilidade garantida com o paradigma Active Record (Eloquent) e arquitetura RESTful do Laravel 11.
- As 3 decisões humanas foram formalmente resolvidas pelo usuário Ado (Autenticação Sanctum, Polling inteligente REST e Caixa acumulado da vaquinha), desbloqueando a transição imediata para o **Strategist**.
