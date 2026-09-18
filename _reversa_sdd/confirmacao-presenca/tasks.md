# Tarefas de Implementação: Confirmação de Presença e Ficha do Jogo

> Nível de Documentação: **Detalhado**  
> Unit: `confirmacao-presenca`  
> Componente Base: [`src/components/MatchCardConfirmacao.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/MatchCardConfirmacao.tsx)

---

## 1. Pré-requisitos

- [ ] Interfaces `Evento`, `EventoPresenca`, `Atleta` e tipo `StatusConfirmacao` definidas em `src/types.ts`.
- [ ] Handler `onUpdatePresenca` conectado ao estado central em `src/App.tsx`.

---

## 2. Tarefas de Implementação

- [ ] **T-CP-01: Renderizar Banner Principal da Partida com Link GPS**
  - **Origem no Legado**: `src/components/MatchCardConfirmacao.tsx:46-114`
  - **Critério de Pronto**: Exibir título do evento, badge de tipo, data/hora formatada em pt-BR, adversário, fardamento escalado, tesoureiro e link externo de navegação no Google Maps.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-CP-02: Implementar os Botões Táteis de Confirmação em 1 Toque**
  - **Origem no Legado**: `src/components/MatchCardConfirmacao.tsx:118-183`
  - **Critério de Pronto**: Três botões com altura mínima de 52px ("Vou", "Não Vou", "Dúvida"), com anel e cor de destaque reativo indicando a opção atualmente selecionada pelo atleta logado.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-CP-03: Implementar Totalizadores de Presença**
  - **Origem no Legado**: `src/components/MatchCardConfirmacao.tsx:23-25,187-205`
  - **Critério de Pronto**: Exibir contadores dinâmicos calculados a partir do array de presenças para confirmados (verde), dúvidas (âmbar) e recusas (vermelho).
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-CP-04: Renderizar Grade do Elenco com Distinção de Convidado e Atraso**
  - **Origem no Legado**: `src/components/MatchCardConfirmacao.tsx:210-272`
  - **Critério de Pronto**: Listar atletas com número da camisa, posição e badges específicos para convidados (`tipo_vinculo === 'convidado'`) e atletas que chegaram com atraso (`Atrasou (Banco)`).
  - **Confiança**: 🟢 CONFIRMADO

---

## 3. Tarefas de Teste Automatizado

- [ ] **TT-CP-01: Teste de Mutação de Presença em 1 Toque**
  - **Cenário**: Ao clicar em "Não Vou", verificar se o callback `onUpdatePresenca` é acionado com o ID do atleta e o novo status `'recusado'`, incrementando o contador de recusas e decrementando o anterior.
- [ ] **TT-CP-02: Teste de Exibição de Tag de Convidado**
  - **Cenário**: Verificar se atletas com `tipo_vinculo: 'convidado'` exibem o badge visual correspondente na listagem de elenco.

---

## 4. Ordem Sugerida

1. **T-CP-01**: Banner de informações da partida.
2. **T-CP-02**: Botões de ação rápida de presença.
3. **T-CP-03**: Totalizadores de status.
4. **T-CP-04**: Grade de atletas e badges especiais.

---

## 5. Lacunas Pendentes (🔴)

- 🔴 **Gestão de Lista de Espera**: Implementar limite máximo de confirmados e fila de espera automática para convocações excedentes.
