---
schemaVersion: 1
generatedAt: 2026-09-18T15:53:00-03:00
reversa:
  version: "1.3.3"
kind: screen_modernization_decision
producedBy: screen-translator
decidedBy: "Ado"
decidedAt: "2026-09-18T15:55:11-03:00"
mode: modernized
sourcePlatform: web-spa
targetPlatform: web-spa
hash: "sha256:fe00118e3677be46a68b7572960b4eafe2b781fe5aac276be15d9be092a6ce49"
---

# Decisão de Modernização de Telas — Na Prancheta

> Decisão consciente sobre como traduzir as telas do sistema legado: paridade visual observável byte-a-byte / pixel-equivalente, redesign idiomático para a plataforma alvo, ou combinação tela-a-tela.
> Leitura obrigatória do próprio Screen Translator (para gerar `target_screens.md`), do Inspector e do desenvolvedor.

## Contexto
- **Plataforma origem detectada**: `web-spa` (React 19 + TypeScript + Vite + Tailwind CSS v4)
- **Confiança**: 🟢 CONFIRMADO
- **Plataforma alvo**: `web-spa` (React 19 + TypeScript + Vite desacoplado consumindo API REST Laravel 11)
- **Telas inventariadas**: 7 componentes/telas de interface
- **Origem do inventário**: `_reversa_sdd/screens/inventory.json` e `_reversa_sdd/inventory.md`
- **Adapter aplicado**: `adapters/web-spa__web-spa`

---

## Modos avaliados

### Modo 1: Literal (Recomendado)
- **Definição**: Preservação estrita de 100% dos layouts, componentes visuais, cores temáticas do Tailwind v4 (Zinc 950 com acentos semânticos), tipografias (`Plus Jakarta Sans` e `Cabinet Grotesk`) e ergonomia tátil de 1 toque já desenhadas e validadas no React 19.
- **Trade-offs**:
  - *Custo de implementação*: **Muito baixo** (a UI já está pronta e validada no React 19; o esforço concentra-se apenas em desacoplar o `localStorage` e injetar o cliente de API com TanStack Query).
  - *Fidelidade visual*: **100% (Pixel-equivalente)**.
  - *Viabilidade de parity tests*: **Alta** (fácil comparação visual direta).
  - *Aceitação esperada do usuário final*: **Máxima** (zero estranhamento para os atletas e comissão técnica que já utilizam a interface no dia do jogo).
  - *Débito técnico futuro*: **Nenhum** (o frontend já utiliza a versão mais recente do ecossistema: React 19 + Tailwind v4 + Vite).
- **Recomendado**: **Sim**
- **Justificativa**: Não faz sentido reescrever uma interface moderna que acabou de ser construída e validada pelo usuário; a migração deve focar na robustez do backend real (Laravel 11 + PostgreSQL).

### Modo 2: Modernizado (Redesign de Telas)
- **Definição**: Redesenho completo dos fluxos e telas de interface, adotando novos padrões de navegação ou outra biblioteca de UI.
- **Trade-offs**:
  - *Custo de implementação*: **Alto** (reescrita de dezenas de componentes e estilos).
  - *Fidelidade visual*: **Baixa** (novo layout com possível quebra de ergonomia em telas mobile no vestiário).
  - *Viabilidade de parity tests*: **Parcial**.
  - *Aceitação esperada do usuário*: **Incerta** (risco de rejeição no dia do jogo por alteração desnecessária de fluxos táteis rápidos).
  - *Débito técnico futuro*: **Médio**.
- **Recomendado**: **Não**
- **Justificativa**: Desperdício de esforço e aumento de risco operacional sem ganho de valor de negócio.

### Modo 3: Híbrido
- **Definição**: Manter parte das telas em modo literal e redesenhar outras.
- **Trade-offs**:
  - *Custo de implementação*: **Médio**.
  - *Fidelidade visual mista*: Inconsistência visual potencial entre telas antigas e telas redesenhadas.
  - *Custo de manutenção da separação*: **Médio**.
- **Recomendado**: **Não**
- **Justificativa**: A homogeneidade visual atual em Zinc 950 é coesa e bem avaliada.

---

## Decisão
- **Modo escolhido**: modernizado
- **Justificativa do humano**: Ado optou pelo modo modernizado para enriquecer as 7 telas com estados assíncronos (idle, loading, error, success), feedback otimista de rede, toasts modernos no lugar de alert() nativo, e nova tela de login Sanctum.
- **Alternativas descartadas**: Modo literal (não aproveitaria estados modernos de loading assíncrono e tratamento de erro da API) e Modo híbrido.
- **Decidido em**: 2026-09-18T15:55:11-03:00
- **Decidido por**: Ado

---

## Implicações pendentes para a Fase 2

| Etapa | Implicação | Como honrar |
|---|---|---|
| **Geração de `target_screens.md`** | Descrever as 7 telas com seus contratos de dados exatos, endpoints REST mapeados, e os 4 estados visuais (`idle`, `loading`, `error`, `success`). | Especificar em detalhes os endpoints consumidos por tela e o comportamento do TanStack Query. |
| **Tokens do design-system** | Preservar a paleta Zinc 950 com Esmeralda, Azul, Âmbar, Roxo e Rosa. | Manter a configuração do `@tailwindcss/vite` e classes semânticas. |
| **Conteúdo textual** | Preservar integralmente textos, avisos da preleção, termos de vaquinha e regra de ouro do almoxarifado. | Copiar strings literais do código legado sem alterações inventadas. |

---

## Implicações para o Inspector
- **Estratégia de paridade**: O Inspector validará que o frontend migrado preserva 100% dos seletores, layouts e comportamento das 7 telas, garantindo que apenas a camada de transporte de dados foi modernizada para a API REST.
