# Requisitos da Feature: Confirmação de Presença e Ficha do Jogo

> Nível de Documentação: **Detalhado**  
> Unit: `confirmacao-presenca`  
> Status: 🟢 CONFIRMADO

---

## 1. Visão Geral

A feature de **Confirmação de Presença e Ficha do Jogo** centraliza as informações logísticas da partida (data/hora, local, adversário, link GPS, kit de fardamento e tesoureiro responsável) e fornece uma interface mobile-first de 1 toque para que os atletas declarem sua disponibilidade ("Vou", "Não Vou", "Dúvida"), mantendo contadores reativos do elenco em tempo real.

---

## 2. Responsabilidades

- Apresentar o cabeçalho oficial do confronto com tipo de evento, data, horário, adversário e rota no Google Maps.
- Disponibilizar mecanismo de confirmação de presença expressa com botões táteis de altura mínima de 52px.
- Computar e exibir o totalizador de atletas confirmados, em dúvida e ausentes.
- Renderizar a lista completa de atletas convocados com número da camisa, posição, distinção de convidados e indicação de penalidade de atraso.

---

## 3. Regras de Negócio

- **RN-CP-01 (Mecanismo de Resposta de 1 Toque)** 🟢 CONFIRMADO: O atleta pode alternar instantaneamente sua intenção de comparecimento entre `'confirmado'`, `'recusado'` e `'duvida'`, com carimbo automático de timestamp `respondido_em` (`src/components/MatchCardConfirmacao.tsx:146-183`).
- **RN-CP-02 (Base de Elegibilidade Tática e Financeira)** 🟢 CONFIRMADO: Apenas atletas com status `'confirmado'` são habilitados para escalação na prancheta tática e incluídos na vaquinha do tesoureiro (`src/components/PranchetaTecnica.tsx:17-20`, `src/components/TesoureiroColeta.tsx:23-27`).
- **RN-CP-03 (Sinalização de Vínculo de Convidado)** 🟢 CONFIRMADO: Atletas com `tipo_vinculo === 'convidado'` devem exibir uma tag visual roxa distintiva no quadro de presenças (`src/components/MatchCardConfirmacao.tsx:234-238`).
- **RN-CP-04 (Alerta Visual de Atraso no Quadro)** 🟢 CONFIRMADO: Atletas cujo registro textual indicar atraso no vestiário devem exibir o aviso destacado `"Atrasou (Banco)"` (`src/components/MatchCardConfirmacao.tsx:252-256`).
- **RN-CP-05 (Teto de Presenças e Lista de Espera)** 🟢 CONFIRMADO: A partida possui limite de vagas para confirmados; ao atingir o teto estipulado para o evento, confirmações subsequentes transbordam compulsoriamente para o status `'lista_espera'` (validado com o usuário em `questions.md#pergunta-5`).

---

## 4. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|---|---|---|---|
| **RF-CP-01** | Exibir banner com dados completos do jogo | Must | Mostrar título, tipo, data/hora formatada em pt-BR, adversário, local e link GPS. |
| **RF-CP-02** | Oferecer 3 botões mobile de confirmação rápida | Must | Botões 'Vou' (verde), 'Não Vou' (vermelho) e 'Dúvida' (âmbar) com feedback visual imediato do status atual. |
| **RF-CP-03** | Totalizar presenças dinamicamente | Must | Exibir contadores atualizados de atletas confirmados, dúvidas e recusas. |
| **RF-CP-04** | Filtrar lista de atletas por status | Should | Permitir filtrar a visualização do elenco entre 'todos', 'confirmados' e 'dúvidas'. |

---

## 5. Requisitos Não Funcionais

| Tipo | Requisito Inferido | Evidência no Código | Confiança |
|---|---|---|---|
| **Ergonomia Mobile** | Botões com área de toque mínima de 52px de altura | `src/components/MatchCardConfirmacao.tsx:149,161,174` (`min-h-[52px]`) | 🟢 |
| **Usabilidade** | Microinterações de escala ao toque | `src/components/MatchCardConfirmacao.tsx:149` (`active:scale-[0.98]`) | 🟢 |
| **Performance** | Filtros de lista instantâneos sem recarregar tela | `src/components/MatchCardConfirmacao.tsx:38-42` (`Array.filter`) | 🟢 |

---

## 6. Critérios de Aceitação (Gherkin)

```gherkin
Cenário: Confirmação de presença em 1 toque
  Dado que o atleta está autenticado/selecionado com ID "atl-1"
  E seu status inicial na partida é "duvida"
  Quando o atleta toca no botão "Vou"
  Então seu status deve ser atualizado para "confirmado"
  E o contador de Confirmados deve ser incrementado em 1
  E o botão "Vou" deve receber destaque visual com anel esmeralda

Cenário: Atleta convidado visualiza indicação de vínculo
  Dado que o atleta Leonardo Prado possui vinculo "convidado"
  Quando a lista do elenco é renderizada no Match Card
  Então deve ser exibida uma tag roxa "Convidado" ao lado do seu nome
```

---

## 7. Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|---|---|---|
| Confirmação de presença de 1 toque ('Vou', 'Não Vou', 'Dúvida') | **Must** | Entrada de dados primária do elenco para viabilizar escalação e vaquinha. |
| Banner com dados logísticos da partida e link GPS | **Must** | Comunicação essencial para orientação de deslocamento dos atletas. |
| Totalizadores e badges de status | **Must** | Permite à comissão técnica e ao tesoureiro saber quantos atletas jogarão. |
| Filtros por status ('todos', 'confirmados', 'dúvidas') | **Should** | Facilita a consulta visual rápida em elencos extensos. |

---

## 8. Rastreabilidade de Código

| Arquivo do Legado | Linhas | Símbolo / Responsabilidade | Confiança |
|---|---|---|---|
| [`src/components/MatchCardConfirmacao.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/MatchCardConfirmacao.tsx) | 1-276 | Componente `MatchCardConfirmacao` e handlers de presença | 🟢 CONFIRMADO |
| [`src/types.ts`](file:///home/adomoraes/projects/na-prancheta/src/types.ts) | 57-64 | Interface `EventoPresenca` e enum `StatusConfirmacao` | 🟢 CONFIRMADO |
