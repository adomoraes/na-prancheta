# Requisitos da Feature: Scout Pós-Jogo Simplificado

> Nível de Documentação: **Detalhado**  
> Unit: `scout-pos-jogo`  
> Status: 🟢 CONFIRMADO

---

## 1. Visão Geral

A feature **Scout Pós-Jogo Simplificado** oferece uma interface mobile ágil de lançamento expresso (meta de operação em menos de 2 minutos) para registro dos acontecimentos individuais da partida amadora: gols anotados, assistências distribuídas, minutagem jogada, cartões amarelos e a eleição do Craque do Jogo (MVP). O módulo consolida automaticamente os números ofensivos da equipe no cabeçalho e reforça as diretrizes disciplinares do vestiário pós-apito (roda de conversa de 3 minutos e entrega organizada do fardamento).

---

## 2. Responsabilidades

- Restringir a lista de lançamento aos atletas que efetivamente confirmaram presença na partida.
- Fornecer seletor horizontal deslizante (touch scroll) para escolha rápida de atletas com badge numérico e indicador visual de scouts já preenchidos.
- Exibir placar consolidado do time no topo: total de gols acumulados, total de assistências e badge com nome do MVP eleito.
- Disponibilizar botões incrementais rápidos (+ / -) com target tátil mobile para ajuste de gols, assistências, minutos jogados (em saltos de $\pm 5$ min) e cartões amarelos.
- Permitir a atribuição e alternância do prêmio de Craque do Jogo (MVP).
- Renderizar o banner informativo do protocolo obrigatório pós-jogo.

---

## 3. Regras de Negócio

- **RN-SPJ-01 (Elegibilidade de Scout aos Confirmados)** 🟢 CONFIRMADO: Apenas atletas com status de presença `'confirmado'` são exibidos no seletor de scout pós-jogo (`src/components/ScoutPosJogo.tsx:24-27`).
- **RN-SPJ-02 (Piso Não Negativo em Contadores Estatísticos)** 🟢 CONFIRMADO: Nenhuma métrica numérica de scout (gols, assistências, minutagem, cartões) pode assumir valor inferior a zero. O decremento abaixo de zero deve ser ignorado (`src/components/ScoutPosJogo.tsx:44-45`).
- **RN-SPJ-03 (Granularidade de Minutagem em Saltos de 5 Minutos)** 🟢 CONFIRMADO: Para acelerar a digitação na beira do campo, a minutagem disputada pelo atleta é ajustada em blocos de $\pm 5$ minutos, iniciando no padrão de 40 minutos (`src/components/ScoutPosJogo.tsx:34, 237-248`).
- **RN-SPJ-04 (Craque do Jogo - MVP)** 🟢 CONFIRMADO: O status `foi_mvp` pode ser atribuído ao atleta selecionado por meio de alternância (toggle), destacando seu nome no placar do jogo e ativando estilo dourado/âmbar (`src/components/ScoutPosJogo.tsx:50-54, 94-106, 170-180`).
- **RN-SPJ-05 (Consolidação Agregada Ofensiva)** 🟢 CONFIRMADO: O total de gols e assistências do time é recalculado dinamicamente pela soma dos scouts de todos os atletas participantes (`src/components/ScoutPosJogo.tsx:59-60`).

---

## 4. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|---|---|---|---|
| **RF-SPJ-01** | Cabeçalho de estatísticas coletivas | Must | Exibir o total de gols e assistências da equipe e o nome do MVP eleito em destaque. |
| **RF-SPJ-02** | Seletor horizontal de atletas com indicador | Must | Barra de scroll horizontal com fotos/camisas dos atletas; atletas com scout já lançado exibem ponto indicador âmbar. |
| **RF-SPJ-03** | Contadores incrementais (+ / -) | Must | Ajustar gols, assistências e cartões em passos de 1 unidade, e minutagem em passos de 5 minutos, com proteção contra valores negativos. |
| **RF-SPJ-04** | Eleição de MVP da rodada | Must | Botão para alternar status de Craque do Jogo com feedback visual dourado com ícone de estrela preenchida. |
| **RF-SPJ-05** | Banner de protocolo pós-jogo | Should | Exibir aviso permanente sobre roda de 3 min, uniformes desvirados e trava da resenha. |

---

## 5. Requisitos Não Funcionais

| Tipo | Requisito Inferido | Evidência no Código | Confiança |
|---|---|---|---|
| **Ergonomia de Lançamento** | Botões de incremento e decremento táteis com tamanho mínimo de 36x36px (`w-9 h-9`) | `src/components/ScoutPosJogo.tsx:194, 200, 238, 244` | 🟢 |
| **Agilidade de Seleção** | Carrossel horizontal com barra de rolagem oculta (`scrollbar-none`) para fluidez mobile | `src/components/ScoutPosJogo.tsx:115` (`overflow-x-auto`) | 🟢 |
| **Tempo de Execução** | Fluxo simplificado desenhado para operação em menos de 2 minutos | `src/components/ScoutPosJogo.tsx:79` | 🟢 |
| **Tipografia Estatística** | Números dos contadores em fonte monoespaçada com 24px (`text-2xl font-mono`) | `src/components/ScoutPosJogo.tsx:188, 210, 232, 254` | 🟢 |

---

## 6. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: Lançamento de gol e assistência para atleta selecionado
  Dado que o atleta "Theus" (#9, Centroavante) está selecionado no seletor de scout
  E seu scout inicial registra 0 gols e 0 assistências
  Quando o operador clica no botão "+" de Gols
  E o operador clica no botão "+" de Assistências
  Então o card de "Theus" deve exibir 1 Gol e 1 Assistência
  E o placar agregado do time no topo deve incrementar 1 Gol e 1 Assistência
  E o botão do atleta no carrossel superior deve passar a exibir a bolinha âmbar de scout lançado

Cenário: Proteção contra números negativos
  Dado que o atleta selecionado possui 0 Cartões Amarelos
  Quando o operador clica no botão "-" de Cartão Amarelo
  Então o contador deve permanecer em 0 sem alterar o estado

Cenário: Eleição do Craque do Jogo (MVP)
  Dado que o atleta "Deco" está selecionado e ainda não é MVP
  Quando o operador clica em "Eleger Craque (MVP)"
  Então o status foi_mvp deve mudar para true
  E o botão deve mudar para "Eleito MVP do Jogo!" com fundo âmbar e estrela preenchida
  E o cabeçalho superior deve exibir o card de MVP com o nome "Deco"
```

---

## 7. Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|---|---|---|
| Contadores táteis rápidos (+ / -) de gols, passes e cartões | **Must** | Dados nucleares para histórico e premiações do time. |
| Seletor horizontal com marcação de scouts concluídos | **Must** | Ergonomia necessária para não esquecer nenhum participante. |
| Eleição de MVP com visibilidade no topo | **Must** | Engajamento comunitário e valorização do atleta destaque. |
| Consolidação dinâmica de gols e assistências do time | **Must** | Visão agregada imediata do resultado da partida. |
| Banner de protocolo de vestiário e camisas desviradas | **Should** | Reforço cultural de civilidade e preservação de patrimônio. |

---

## 8. Rastreabilidade de Código

| Arquivo do Legado | Linhas | Símbolo / Responsabilidade | Confiança |
|---|---|---|---|
| [`src/components/ScoutPosJogo.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/ScoutPosJogo.tsx) | 1-295 | Componente `ScoutPosJogo`, contadores e eleição de MVP | 🟢 CONFIRMADO |
| [`src/App.tsx`](file:///home/adomoraes/projects/na-prancheta/src/App.tsx) | 129-142 | Handler `handleUpdateScout` e persistência em `localStorage` | 🟢 CONFIRMADO |
| [`src/types.ts`](file:///home/adomoraes/projects/na-prancheta/src/types.ts) | 76-88 | Interface `EventoScout` | 🟢 CONFIRMADO |
