# Matriz de Rastreabilidade Cruzada: Código Legado ↔ Especificações (SDD)

> Nível de Documentação: **Detalhado**  
> Contexto: `na-prancheta`  
> Status: 🟢 CONFIRMADO

---

## 1. Visão Geral

Esta matriz consolida o mapeamento bidirecional e exaustivo entre a base de código do sistema **Na Prancheta** (React 19 + TypeScript + Vite) e todos os artefatos de especificação orientada por especificações (SDD) gerados no diretório `_reversa_sdd/`. A cobertura assegura que qualquer evolução futura ou migração possua rastreabilidade direta do arquivo de código até seus requisitos, contratos de design, tarefas e critérios de aceitação.

---

## 2. Matriz de Código ↔ Módulo ↔ Especificação

| Arquivo do Legado | Linhas | Símbolo / Responsabilidade | Módulo SDD | Documentos SDD Vinculados | Status |
|---|---|---|---|---|:---:|
| [`src/components/VestiarioTimeline.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/VestiarioTimeline.tsx) | 1-102 | Componente `VestiarioTimeline`, cronômetro regressivo e regra T-35 | `protocolo-vestiario` | [`requirements.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/protocolo-vestiario/requirements.md)<br>[`design.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/protocolo-vestiario/design.md)<br>[`tasks.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/protocolo-vestiario/tasks.md) | 🟢 |
| [`src/components/MatchCardConfirmacao.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/MatchCardConfirmacao.tsx) | 1-276 | Componente `MatchCardConfirmacao`, botões táteis e lista de elenco | `confirmacao-presenca` | [`requirements.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/confirmacao-presenca/requirements.md)<br>[`design.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/confirmacao-presenca/design.md)<br>[`tasks.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/confirmacao-presenca/tasks.md) | 🟢 |
| [`src/components/PranchetaTecnica.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/PranchetaTecnica.tsx) | 1-254 | Componente `PranchetaTecnica`, gramado 4-3-3 e trava do atraso | `prancheta-tatica` | [`requirements.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/prancheta-tatica/requirements.md)<br>[`design.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/prancheta-tatica/design.md)<br>[`tasks.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/prancheta-tatica/tasks.md) | 🟢 |
| [`src/components/TesoureiroColeta.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/TesoureiroColeta.tsx) | 1-262 | Componente `TesoureiroColeta`, rateio, PIX e resumo Zap | `tesoureiro-vaquinha` | [`requirements.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/tesoureiro-vaquinha/requirements.md)<br>[`design.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/tesoureiro-vaquinha/design.md)<br>[`tasks.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/tesoureiro-vaquinha/tasks.md) | 🟢 |
| [`src/components/ScoutPosJogo.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/ScoutPosJogo.tsx) | 1-295 | Componente `ScoutPosJogo`, contadores (+ / -) e eleição de MVP | `scout-pos-jogo` | [`requirements.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/scout-pos-jogo/requirements.md)<br>[`design.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/scout-pos-jogo/design.md)<br>[`tasks.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/scout-pos-jogo/tasks.md) | 🟢 |
| [`src/components/AlmoxarifadoView.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/AlmoxarifadoView.tsx) | 1-129 | Componente `AlmoxarifadoView`, checklist tríplice e trava da resenha | `almoxarifado-patrimonio` | [`requirements.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/almoxarifado-patrimonio/requirements.md)<br>[`design.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/almoxarifado-patrimonio/design.md)<br>[`tasks.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/almoxarifado-patrimonio/tasks.md) | 🟢 |
| [`src/components/SelfOnboardingModal.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/SelfOnboardingModal.tsx) | 1-287 | Componente `SelfOnboardingModal`, validação e cascata | `onboarding-elenco` | [`requirements.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/onboarding-elenco/requirements.md)<br>[`design.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/onboarding-elenco/design.md)<br>[`tasks.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/onboarding-elenco/tasks.md) | 🟢 |
| [`src/components/Header.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/Header.tsx) | 1-125 | Componente `Header`, alternador de visão de perfil (Role Switcher) e disparo de onboarding | `core / layout` | [`permissions.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/permissions.md)<br>[`architecture.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/architecture.md) | 🟢 |
| [`src/App.tsx`](file:///home/adomoraes/projects/na-prancheta/src/App.tsx) | 1-344 | Componente raiz, orquestração de estado central e persistência em `localStorage` | `core / orquestracao` | [`architecture.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/architecture.md)<br>[`state-machines.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/state-machines.md)<br>[`jornada-dia-de-jogo.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/user-stories/jornada-dia-de-jogo.md) | 🟢 |
| [`src/types.ts`](file:///home/adomoraes/projects/na-prancheta/src/types.ts) | 1-99 | Schemas e contratos de domínio em TypeScript | `core / schema` | [`data-dictionary.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/data-dictionary.md)<br>[`erd-complete.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/erd-complete.md) | 🟢 |
| [`src/data/initialData.ts`](file:///home/adomoraes/projects/na-prancheta/src/data/initialData.ts) | 1-205 | Mock e dados semente de elenco, evento e patrimônio | `core / seeds` | [`inventory.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/inventory.md)<br>[`data-dictionary.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/data-dictionary.md) | 🟢 |

---

## 3. Matriz de Regras de Negócio ↔ Implementação

| Regra de Negócio | Descrição Sintética | Origem no Código | Spec SDD | Status |
|---|---|---|---|:---:|
| **RN-PV-01 / RN-PT-03** | Trava de Atraso T-35 (Banco Compulsório) | `PranchetaTecnica.tsx:40-46`<br>`VestiarioTimeline.tsx:70-81` | `protocolo-vestiario/requirements.md`<br>`prancheta-tatica/requirements.md` | 🟢 CONFIRMADO |
| **RN-CP-01** | Confirmação de Presença em 1 Toque | `MatchCardConfirmacao.tsx:146-183` | `confirmacao-presenca/requirements.md` | 🟢 CONFIRMADO |
| **RN-PT-02** | Limite Estrito de 11 Titulares em Campo | `PranchetaTecnica.tsx:51-54` | `prancheta-tatica/requirements.md` | 🟢 CONFIRMADO |
| **RN-TV-01** | Rateio da Vaquinha Exclusivo para Confirmados | `TesoureiroColeta.tsx:22-27` | `tesoureiro-vaquinha/requirements.md` | 🟢 CONFIRMADO |
| **RN-TV-03** | Meta Fixa de Arbitragem (R$ 300,00) | `TesoureiroColeta.tsx:38-39` | `tesoureiro-vaquinha/requirements.md` | 🟢 CONFIRMADO |
| **RN-TV-05** | Formatação de Resumo para WhatsApp com Emojis | `TesoureiroColeta.tsx:49-73` | `tesoureiro-vaquinha/requirements.md` | 🟢 CONFIRMADO |
| **RN-SPJ-02** | Piso Não Negativo em Contadores de Scout | `ScoutPosJogo.tsx:44-45` | `scout-pos-jogo/requirements.md` | 🟢 CONFIRMADO |
| **RN-SPJ-04** | Eleição de Craque do Jogo (MVP) | `ScoutPosJogo.tsx:50-54, 94-106` | `scout-pos-jogo/requirements.md` | 🟢 CONFIRMADO |
| **RN-AP-01** | Trava da Resenha Social (Condição Tríplice) | `AlmoxarifadoView.tsx:15, 99-105` | `almoxarifado-patrimonio/requirements.md` | 🟢 CONFIRMADO |
| **RN-AP-03** | Protocolo das 22 Camisas Desviradas | `AlmoxarifadoView.tsx:48-50, 68-69` | `almoxarifado-patrimonio/requirements.md` | 🟢 CONFIRMADO |
| **RN-OE-01** | Validação Mandatória de Nome no Cadastro | `SelfOnboardingModal.tsx:42-45` | `onboarding-elenco/requirements.md` | 🟢 CONFIRMADO |
| **RN-OE-04** | Efeito Cascata de Presença e Cobrança no Onboarding | `App.tsx:94-110` | `onboarding-elenco/requirements.md` | 🟢 CONFIRMADO |

---

## 4. Resumo de Cobertura da Documentação

- **Módulos Especificados**: 7 de 7 (100% de cobertura funcional).
- **Arquivos de Spec por Unidade**: 3 por módulo (`requirements.md`, `design.md`, `tasks.md`) totalizando 21 especificações de unidade.
- **Artefatos Globais de Jornada e Rastreabilidade**: 2 (`jornada-dia-de-jogo.md` e `code-spec-matrix.md`).
- **Total de Arquivos Gerados na Fase 4**: 23 de 23 arquivos (100% concluído).
- **Índice de Confiança Global**: 🟢 CONFIRMADO (código-fonte 100% inspecionado e auditado).
