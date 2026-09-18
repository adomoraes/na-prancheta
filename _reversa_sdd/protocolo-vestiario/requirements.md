# Requisitos da Feature: Protocolo de Vestiário

> Nível de Documentação: **Detalhado**  
> Unit: `protocolo-vestiario`  
> Status: 🟢 CONFIRMADO

---

## 1. Visão Geral

A feature de **Protocolo de Vestiário** gerencia o cronograma temporal estrito pré-jogo do elenco, estabelecendo marcos obrigatórios de pontualidade ($T-70$, $T-50$, $T-35$, $T-25$), aplicando a Regra Fundamental do Atraso com corte de titularidade para atletas impontuais e estruturando o protocolo neuromuscular de aquecimento de campo em 4 etapas.

---

## 2. Responsabilidades

- Rastrear e exibir a contagem regressiva em minutos em tempo real até o início do jogo ($T-0$).
- Identificar e sinalizar visualmente as fases de preparação ($T-70$: Comissão & Malas, $T-50$: Chegada Obrigatória, $T-35$: Preleção & Escalação, $T-25$: Aquecimento Fisiológico).
- Aplicar e comunicar a penalidade disciplinar obrigatória de banco de reservas para atletas que não estiverem trocados no vestiário até $T-35$.
- Apresentar o guia passo a passo da sequência fisiológica de 25 minutos de prevenção de lesões musculares.

---

## 3. Regras de Negócio

- **RN-PV-01 (Marco T-70 min)** 🟢 CONFIRMADO: Comissão técnica e responsáveis pelas malas oficiais devem acessar o vestiário 70 minutos antes da partida para descarregar os uniformes e calibrar materiais (`src/components/VestiarioTimeline.tsx:85-104`).
- **RN-PV-02 (Marco T-50 min - Presença Mandatória)** 🟢 CONFIRMADO: Todos os atletas convocados devem estar presentes no vestiário com antecedência mínima de 50 minutos para retirada do fardamento, caneleiras e calçados (`src/components/VestiarioTimeline.tsx:107-125`).
- **RN-PV-03 (Marco T-35 min - Regra Fundamental do Atraso)** 🟢 CONFIRMADO: Às $T-35$ min iniciam-se a preleção técnica e o anúncio da escalação. Qualquer atleta que não esteja com uniforme e calçado trocados neste horário perde a condição de titularidade e iniciará a partida compulsoriamente no banco de reservas (`src/components/VestiarioTimeline.tsx:70-81`).
- **RN-PV-04 (Marco T-25 min - Aquecimento em 4 Etapas)** 🟢 CONFIRMADO: Saída a campo para execução da sequência fisiológica obrigatória: (1) Ativação neuromuscular (5-8 min), (2) Mobilidade articular (5 min), (3) Dinâmica e rondo com 2 toques (8 min) e (4) Finalizações e cruzamentos táticos (8 min) (`src/components/VestiarioTimeline.tsx:180-199`).

---

## 4. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|---|---|---|---|
| **RF-PV-01** | Exibir cronômetro regressivo dinâmico $T-X$ | Must | Atualizar os minutos restantes até o jogo com indicativo visual e textual da fase ativa. |
| **RF-PV-02** | Exibir banner destacado da Regra do Atraso | Must | Conter aviso em destaque vermelho com texto explícito do corte de titularidade após $T-35$. |
| **RF-PV-03** | Permitir expansão detalhada dos marcos da timeline | Should | Permitir clique nos cards de $T-70$, $T-50$, $T-35$ e $T-25$ para ver orientações específicas. |
| **RF-PV-04** | Exibir card guia da sequência fisiológica de campo | Must | Apresentar as 4 etapas de aquecimento com minutagem sugerida e foco em prevenção de estiramentos. |

---

## 5. Requisitos Não Funcionais

| Tipo | Requisito Inferido | Evidência no Código | Confiança |
|---|---|---|---|
| **Performance** | Atualização intervalada fluida sem consumo excessivo de CPU | `src/components/VestiarioTimeline.tsx:15-21` (`setInterval` a cada 15s) | 🟢 |
| **Ergonomia** | Visualização contrastante em alto contraste e dark mode | `src/components/VestiarioTimeline.tsx:38` (`bg-zinc-900`, `text-zinc-100`) | 🟢 |
| **Acessibilidade** | Badges semânticos com animação pulsante nos marcos críticos | `src/components/VestiarioTimeline.tsx:28-31` (`animate-pulse`) | 🟢 |

---

## 6. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: Atleta pontual chega antes de T-35
  Dado que o evento tem horário de jogo marcado para as 16:00
  E o relógio do vestiário marca 15:15 (T-45 min)
  Quando o atleta Lucas Silva ingressa no vestiário com chuteiras e caneleiras prontas
  Então seu status deve ser registrado como "No Horário"
  E o atleta deve permanecer elegível para figurar entre os 11 titulares na Prancheta Técnica

Cenário: Atleta chega após T-35 e sofre corte compulsório
  Dado que o evento tem preleção agendada para T-35 min
  E o relógio do vestiário já ultrapassou o marco T-35 (ex: T-20 min)
  Quando o atleta Leonardo Prado ingressa no vestiário
  Então seu status deve ser gravado com a etiqueta "Atrasado"
  E qualquer tentativa de escalá-lo como titular na Prancheta Técnica deve disparar bloqueio compulsório
```

---

## 7. Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|---|---|---|
| Cronômetro e marcos de vestiário ($T-70$, $T-50$, $T-35$, $T-25$) | **Must** | Linha do tempo central que governa todo o ritual da agremiação. |
| Aplicação da Regra Fundamental do Atraso | **Must** | Regra disciplinar inegociável do vestiário sem exceção. |
| Sequência fisiológica de 4 etapas de aquecimento | **Should** | Importante para saúde física e prevenção de lesões do elenco. |
| Simulação de contagem acelerada | **Could** | Útil para demonstração e PoC, secundária em produção. |

---

## 8. Rastreabilidade de Código

| Arquivo do Legado | Linhas | Símbolo / Responsabilidade | Confiança |
|---|---|---|---|
| [`src/components/VestiarioTimeline.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/VestiarioTimeline.tsx) | 1-204 | Componente `VestiarioTimeline`, estados de contagem e badges | 🟢 CONFIRMADO |
| [`src/types.ts`](file:///home/adomoraes/projects/na-prancheta/src/types.ts) | 42-44 | Definições de horários $T-50$, $T-35$ e $T-25$ em `Evento` | 🟢 CONFIRMADO |
