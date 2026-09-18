---
schemaVersion: 1
generatedAt: 2026-09-18T15:57:00-03:00
reversa:
  version: "1.3.3"
kind: screen_deviation_log
producedBy: screen-translator
mode: append-only
hash: "sha256:f917009de91fe1ea421b45ddcc43974f5b1178c6517e49e342a5c5761c415a35"
---

# Screen Deviation Log — Na Prancheta

> Registro formal de divergências intencionais de modernização entre o legado e as especificações geradas em `target_screens.md`.
> Em modo modernizado, essas divergências representam evoluções arquiteturais e de UX validadas.

## Convenções
- **ID**: `DEV-NNN` (sequencial).
- **Tipo**: `modernizacao` (decorrente da escolha do modo modernizado) ou `correcao` (resolução de débito do legado).
- **Aprovação**: `pendente` | `aprovado`.

## Resumo
- **Total de Deviations**: 5
- **Pendentes de Aprovação Humana**: 0
- **Aprovadas**: 5 (Decisão humana de Ado)
- **Rejeitadas**: 0

---

## Entradas de Deviations

### DEV-001 (Estados Assíncronos e Skeleton Loaders em Todas as Telas)
| Campo | Valor |
|---|---|
| **Tela afetada** | Todas as telas (SCR-0001 a SCR-0007) |
| **Tipo** | `modernizacao` |
| **Descrição** | As telas do legado liam de forma síncrona do `localStorage` sem qualquer estado de loading. A nova especificação define 4 estados (`idle`, `loading`, `error`, `success`) com esqueleto de carregamento e retry automático no TanStack Query. |
| **Motivo** | Adaptação mandatória para chamadas de rede assíncronas à API REST do Laravel 11. |
| **Origem no legado** | `src/App.tsx` (leitura síncrona de storage) |
| **Implicação para parity tests** | Comparação semântica e funcional dos dados; validação de que o loader desaparece após resposta da API. |
| **Aprovação** | `pendente` |
| **Propaga para parity_specs.md** | Sim |

---

### DEV-002 (Substituição de `window.alert()` por Toasts Visuais Não-Bloqueantes)
| Campo | Valor |
|---|---|
| **Tela afetada** | `PranchetaTecnica` (SCR-0003) |
| **Tipo** | `modernizacao` |
| **Descrição** | No legado, alertas de atraso T-35 e teto de 11 titulares eram disparados via `window.alert()` nativo do navegador, travando a thread JavaScript. Na spec modernizada, utilizam-se Toasts visuais estilizados em Dark Mode. |
| **Motivo** | Melhoria ergonômica crítica para uso mobile em smartphones de atletas e comissão técnica. |
| **Origem no legado** | `src/components/PranchetaTecnica.tsx:42,52` / `_reversa_sdd/gaps.md:43` (GAP-L-03) |
| **Implicação para parity tests** | Testar aparecimento do elemento Toast no DOM em vez de espiar `window.alert`. |
| **Aprovação** | `pendente` |
| **Propaga para parity_specs.md** | Sim |

---

### DEV-003 (Máscara Telefônica e Validação em Tempo Real de Camisa Única)
| Campo | Valor |
|---|---|
| **Tela afetada** | `SelfOnboardingModal` (SCR-0007) |
| **Tipo** | `modernizacao` |
| **Descrição** | Adição de máscara formatada de telefone `(99) 99999-9999` e verificação assíncrona de disponibilidade do número da camisa preferencial (RN-OE-05) antes do submit. |
| **Motivo** | Prevenção de duplicidade e padronização para login no Laravel Sanctum e envio de mensagens WhatsApp. |
| **Origem no legado** | `src/components/SelfOnboardingModal.tsx:131-137` / `_reversa_sdd/gaps.md:42` (GAP-L-02) |
| **Implicação para parity tests** | Validação de input com máscara e validação de erro HTTP 422 para camisa já cadastrada. |
| **Aprovação** | `pendente` |
| **Propaga para parity_specs.md** | Sim |

---

### DEV-004 (Controles Estendidos de Súmula no Scout)
| Campo | Valor |
|---|---|
| **Tela afetada** | `ScoutPosJogo` (SCR-0005) |
| **Tipo** | `correcao` |
| **Descrição** | Inclusão de seletores explícitos de cartão vermelho e gols sofridos para goleiro, campos que constavam nos types do legado mas não possuíam botões de controle na interface visual. |
| **Motivo** | Resolução do débito técnico identificado em `_reversa_sdd/gaps.md:41` (GAP-L-01). |
| **Origem no legado** | `src/types.ts:83,85` vs `src/components/ScoutPosJogo.tsx` |
| **Implicação para parity tests** | Novos controles interativos mapeados para o payload do endpoint `/api/partidas/{id}/scouts/{atletaId}`. |
| **Aprovação** | `pendente` |
| **Propaga para parity_specs.md** | Sim |

---

### DEV-005 (Criação de Tela Dedicada de Autenticação Sanctum)
| Campo | Valor |
|---|---|
| **Tela afetada** | `AuthLoginView` (SCR-0008) |
| **Tipo** | `modernizacao` |
| **Descrição** | Criação de interface de login por telefone/senha e recepção de Magic Link com token Sanctum, inexistente no legado (que operava de forma aberta sem autenticação). |
| **Motivo** | Atendimento à Decisão Humana 1 aprovada pelo usuário ([BR-HUMANA-001](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md)). |
| **Origem no legado** | Não existia no legado (aplicação aberta mono-usuário). |
| **Implicação para parity tests** | Nova rota e novo contrato de autenticação que intercepta rotas protegidas. |
| **Aprovação** | `pendente` |
| **Propaga para parity_specs.md** | Sim |
