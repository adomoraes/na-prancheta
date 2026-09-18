# Tarefas de Implementação: Scout Pós-Jogo Simplificado

> Nível de Documentação: **Detalhado**  
> Unit: `scout-pos-jogo`  
> Componente Base: [`src/components/ScoutPosJogo.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/ScoutPosJogo.tsx)

---

## 1. Pré-requisitos

- [ ] Interfaces `Evento`, `EventoScout`, `EventoPresenca` e `Atleta` definidas em `src/types.ts`.
- [ ] Estado `scout` e handler `handleUpdateScout` implementados e conectados ao `localStorage` em `src/App.tsx`.

---

## 2. Tarefas de Implementação

- [ ] **T-SPJ-01: Renderizar Header Coletivo com Totais Ofensivos e Badge de MVP**
  - **Origem no Legado**: `src/components/ScoutPosJogo.tsx:68-108`
  - **Critério de Pronto**: Exibir cabeçalho com ícone de troféu, título, subtítulo explicativo e placar consolidado do time contendo Gols Totais (verde), Assistências Totais (azul) e card dourado com apelido/nome do MVP caso eleito.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-SPJ-02: Renderizar Carrossel Horizontal de Atletas Participantes**
  - **Origem no Legado**: `src/components/ScoutPosJogo.tsx:110-148`
  - **Critério de Pronto**: Isolar atletas confirmados na partida e renderizar barra de rolagem horizontal com número da camisa, nome abreviado, posição e ponto indicador âmbar para atletas que já possuem estatísticas lançadas.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-SPJ-03: Implementar Card de Atleta Selecionado e Botão de MVP**
  - **Origem no Legado**: `src/components/ScoutPosJogo.tsx:151-181`
  - **Critério de Pronto**: Exibir dados do jogador em foco e botão de alternância do prêmio de Craque do Jogo (`foi_mvp`), com ícone de estrela e estilo dourado vibrante quando ativado.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-SPJ-04: Implementar Contadores Incrementais Táteis com Piso Zero**
  - **Origem no Legado**: `src/components/ScoutPosJogo.tsx:43-48, 183-273`
  - **Critério de Pronto**: Quatro blocos de contadores com botões táteis de 36x36px (`w-9 h-9`):
    - Gols (+1 / -1, piso 0)
    - Assistências (+1 / -1, piso 0)
    - Minutagem (+5 / -5, piso 0)
    - Cartões Amarelos (+1 / -1, piso 0)
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-SPJ-05: Renderizar Banner do Protocolo de Vestiário Pós-Jogo**
  - **Origem no Legado**: `src/components/ScoutPosJogo.tsx:276-292`
  - **Critério de Pronto**: Exibir aviso verde translúcido com checklist comportamental obrigatório: roda de conversa de 3 minutos, devolução das camisas desviradas e trava da resenha.
  - **Confiança**: 🟢 CONFIRMADO

---

## 3. Tarefas de Teste Automatizado

- [ ] **TT-SPJ-01: Teste de Proteção de Piso Zero nos Contadores**
  - **Cenário**: Com contador de gols em 0, clicar em `-` e verificar que o valor não se torna negativo e o callback de salvamento não é disparado.
- [ ] **TT-SPJ-02: Teste de Incremento e Decremento de Minutagem em Saltos de 5**
  - **Cenário**: Com minutagem inicial de 40 minutos, clicar em `+5` e validar transição para 45 minutos; em seguida clicar em `-5` e validar retorno para 40 minutos.
- [ ] **TT-SPJ-03: Teste de Alternância de Eleição de Craque (MVP)**
  - **Cenário**: Acionar o botão de MVP para o atleta ativo e garantir que `foi_mvp` transite para `true`, exibindo seu nome no placar do topo.
- [ ] **TT-SPJ-04: Teste de Recálculo Agregado de Gols do Time**
  - **Cenário**: Adicionar 1 gol para o atleta A e 2 gols para o atleta B; validar que o totalizador do time no cabeçalho exiba 3 gols.

---

## 4. Ordem Sugerida

1. **T-SPJ-02**: Carrossel horizontal de seleção de atletas confirmados.
2. **T-SPJ-04**: Grid de contadores rápidos (+ / -) com validação de não negatividade.
3. **T-SPJ-03**: Identificação do jogador selecionado e alternância de MVP.
4. **T-SPJ-01**: Cabeçalho de totais coletivos e card dinâmico de MVP.
5. **T-SPJ-05**: Banner de protocolo ético pós-jogo.

---

## 5. Lacunas Pendentes (🔴)

- 🔴 **Exclusividade de MVP**: Implementar desativação mútua automática para garantir que apenas um atleta possua `foi_mvp: true` por partida.
- 🔴 **Controle de Cartões Vermelhos e Gols Sofridos**: Disponibilizar campos visuais para os atributos `cartao_vermelho` e `gols_sofridos` já previstos na interface `EventoScout`.
