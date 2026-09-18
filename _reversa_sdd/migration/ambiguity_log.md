---
schemaVersion: 1
generatedAt: 2026-09-18T17:16:00-03:00
reversa:
  version: "1.3.3"
kind: ambiguity_log
producedBy: orchestrator
hash: "sha256:41ffe7ee505bd074449eb73921b683432324888a179c01692e5f85d639ad4d5f"
---

# Ambiguity Log — Na Prancheta

> Consolidação de todos os itens ⚠️ AMBÍGUOS, decisões arquiteturais e pendências detectadas pelos agentes ao longo do pipeline de migração.
> Status final pós-Inspector: **Zero itens pendentes**, pipeline 100% resolvido para codificação.

---

## Resumo
- **Total de itens**: 8
- **PENDENTES**: 0 (nenhum bloqueador ativo)
- **RESOLVIDOS COM DECISÃO HUMANA**: 6
- **REFERIDOS À CODIFICAÇÃO**: 2

---

## 1. Itens Pendentes
> Não há itens pendentes. Todas as decisões requeridas foram tomadas pelo usuário.

*(Nenhum item pendente).*

---

## 2. Itens Resolvidos com Decisão Humana

### AMB-001 (Controle de Acesso e Autenticação no Backend)
- **Descrição**: Barreira de autenticação do backend Laravel: Link de Partida + PIN vs Autenticação completa por telefone/senha/WhatsApp (Laravel Sanctum) com perfis (`admin`, `tesoureiro`, `atleta`).
- **Detectado por**: `curator`
- **Origem**: [target_business_rules.md § BR-HUMANA-001](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)
- **Status**: RESOLVIDO COM DECISÃO HUMANA
- **Decisão tomada**: Opção B (Autenticação Completa com Laravel Sanctum)
- **Decisor**: Ado em 2026-09-18T15:36:32-03:00
- **Justificativa**: Garante segurança de ponta a ponta, controle estrito por roles e auditoria de ações por token em cada requisição REST.

### AMB-002 (Estratégia de Sincronização em Tempo Real)
- **Descrição**: Polling curto inteligente (TanStack Query 5–10s) vs WebSockets nativos com Laravel Reverb para sincronização de presenças e vaquinha.
- **Detectado por**: `curator`
- **Origem**: [target_business_rules.md § BR-HUMANA-002](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)
- **Status**: RESOLVIDO COM DECISÃO HUMANA
- **Decisão tomada**: Opção A (Polling Curto Inteligente via TanStack Query)
- **Decisor**: Ado em 2026-09-18T15:36:32-03:00
- **Justificativa**: Simplicidade operacional máxima na Fase 1 sem exigir processos daemon permanentes de WebSocket, mantendo o Laravel preparado para Reverb no futuro.

### AMB-003 (Gestão de Saldo Excedente da Vaquinha)
- **Descrição**: Tratamento contábil do saldo que excede a meta de arbitragem: destinar a Caixa Geral Acumulado vs fechamento isolado por partida.
- **Detectado por**: `curator`
- **Origem**: [target_business_rules.md § BR-HUMANA-003](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)
- **Status**: RESOLVIDO COM DECISÃO HUMANA
- **Decisão tomada**: Opção A (Caixa Geral Acumulado da Equipe)
- **Decisor**: Ado em 2026-09-18T15:36:32-03:00
- **Justificativa**: O saldo positivo da rodada alimenta a conta corrente do time para reinvestimento imediato em bolas calibradas, coletes e gelo no almoxarifado.

### AMB-004 (Topologia Arquitetural do Sistema Novo)
- **Descrição**: Organização estrutural de código no backend e frontend: Preservar estrutura do legado vs Modernizar para Modular Monolith por Bounded Contexts.
- **Detectado por**: `designer` (Fase 1)
- **Origem**: [topology_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/topology_decision.md)
- **Status**: RESOLVIDO COM DECISÃO HUMANA
- **Decisão tomada**: Opção 2 (Topologia Moderna por Bounded Contexts no Laravel e `src/features/` no React)
- **Decisor**: Ado em 2026-09-18T15:46:29-03:00
- **Justificativa**: Elimina o débito do acoplamento no monólito e provê fronteiras arquiteturais nítidas para as 3 ondas de cutover.

### AMB-005 (Modo de Tradução de Interfaces e Telas)
- **Descrição**: Estratégia de tradução visual das telas: Literal (1:1 com legado) vs Modernizado (com 4 estados assíncronos e skeletons) vs Híbrido.
- **Detectado por**: `screen_translator` (Fase 1)
- **Origem**: [screen_modernization_decision.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/screen_modernization_decision.md)
- **Status**: RESOLVIDO COM DECISÃO HUMANA
- **Decisão tomada**: Opção 2 (Modo Modernizado)
- **Decisor**: Ado em 2026-09-18T15:55:11-03:00
- **Justificativa**: Adapta a UX para comunicação de rede com o Laravel, provendo skeleton loaders, feedback otimista e tratamento resiliente de falhas.

### AMB-006 (Aprovação de Divergências de Interface — Deviations)
- **Descrição**: Validação formal das 5 deviations catalogadas em [screen_deviation_log.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/screen_deviation_log.md) (DEV-001 a DEV-005).
- **Detectado por**: `screen_translator` (Fase 2)
- **Origem**: [screen_deviation_log.md](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/screen_deviation_log.md)
- **Status**: RESOLVIDO COM DECISÃO HUMANA
- **Decisão tomada**: Aprovação integral das 5 deviations
- **Decisor**: Ado em 2026-09-18T17:13:10-03:00
- **Justificativa**: As 5 deviations aprimoram a robustez mobile, eliminam bloqueios de thread do navegador (`window.alert`) e implementam a autenticação Sanctum.

---

## 3. Itens Referidos à Codificação

### COD-001 (Configuração do Gateway de Envio de Mensagens WhatsApp)
- **Descrição**: O envio de convocações de jogo, relatórios de rateio e Magic Links depende da integração com uma API de mensageria WhatsApp (ex: Evolution API, Z-API ou Twilio).
- **Ação para o Codificador**: Parametrizar as variáveis no arquivo `.env` do Laravel (`WHATSAPP_API_URL`, `WHATSAPP_API_TOKEN`) e criar o service provider `WhatsAppNotificationChannel`.

### COD-002 (Parametrização de Chave da Google Maps Platform)
- **Descrição**: A ficha cadastral da partida utiliza geolocalização e deep links de navegação para campos de futebol amador.
- **Ação para o Codificador**: Configurar `GOOGLE_MAPS_DEMO_KEY` ou chave de produção no `.env` do frontend para renderização do mapa interativo.

---

## 4. Notas Finais
A consolidação de ambiguidades foi concluída com êxito. Nenhuma decisão humana restante impede o início da codificação.
