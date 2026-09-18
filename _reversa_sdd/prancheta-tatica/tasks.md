# Tarefas de Implementação: Prancheta Tática e Gestão de Titulares

> Nível de Documentação: **Detalhado**  
> Unit: `prancheta-tatica`  
> Componente Base: [`src/components/PranchetaTecnica.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/PranchetaTecnica.tsx)

---

## 1. Pré-requisitos

- [ ] Interfaces `Evento`, `Atleta`, `EventoPresenca` e tipo `PosicaoCampo` disponíveis em `src/types.ts`.
- [ ] Componente `PranchetaTecnica` integrado à tela principal em `src/App.tsx`, recebendo `evento`, `atletas` e `presencas`.

---

## 2. Tarefas de Implementação

- [ ] **T-PT-01: Renderizar Header da Prancheta e Ação de Liberação da Preleção**
  - **Origem no Legado**: `src/components/PranchetaTecnica.tsx:69-101`
  - **Critério de Pronto**: Exibir título oficial, ícone de escudo, subtítulo contextual de preleção a T-35 min e botão "Liberar Escalação (T-35)" que alterna para "Escalação Liberada no Vestiário!" com ícone de confirmação verde durante 3.000 ms ao ser acionado.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-PT-02: Filtrar Atletas Confirmados e Inicializar Formação 4-3-3**
  - **Origem no Legado**: `src/components/PranchetaTecnica.tsx:16-35, 104-113`
  - **Critério de Pronto**: Isolar atletas com status `'confirmado'`, instanciar array de 11 IDs padrão e exibir barra indicadora com badge "Formação Tática 4-3-3 (X/11 Titulares definidos)" e etiqueta "Trava de Atraso Ativa (T-35)".
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-PT-03: Renderizar Gramado Tático com 4 Setores e Linhas Regulamentares**
  - **Origem no Legado**: `src/components/PranchetaTecnica.tsx:115-202`
  - **Critério de Pronto**: Renderizar container com gradiente de gramado escuro contendo linhas demarcatórias de campo e 4 linhas táticas: Ataque (3 atletas, anel verde), Meio-Campo (3 atletas, anel azul), Defesa (4 atletas, anel âmbar) e Goleiro (1 atleta, anel roxo), com hover scale interativo.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-PT-04: Implementar Algoritmo `toggleTitular` com Trava T-35 e Teto de 11**
  - **Origem no Legado**: `src/components/PranchetaTecnica.tsx:39-57`
  - **Critério de Pronto**: Ao clicar em um jogador:
    1. Se `atleta.chegou_em` contiver `"Atrasado"`, bloquear ação com alerta explicativo da Regra T-35.
    2. Se já for titular, removê-lo de `titularesIds`.
    3. Se for reserva e `titularesIds.length >= 11`, bloquear com alerta de limite atingido.
    4. Caso contrário, adicionar o ID aos titulares.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-PT-05: Renderizar Banco de Reservas com Destaque de Sanção Disciplinar**
  - **Origem no Legado**: `src/components/PranchetaTecnica.tsx:204-250`
  - **Critério de Pronto**: Exibir grid responsivo (1 a 4 colunas) dos atletas reservas aptos; para atletas sancionados pela regra do atraso, aplicar fundo vermelho translúcido (`bg-red-500/10`), borda avermelhada, badge `"Regra T-35"` e legenda explicativa `"Chegou após T-35 (Banco Compulsório)"`.
  - **Confiança**: 🟢 CONFIRMADO

---

## 3. Tarefas de Teste Automatizado

- [ ] **TT-PT-01: Teste de Bloqueio da Regra T-35 no Banco de Reservas**
  - **Cenário**: Ao tentar promover um atleta com `chegou_em: "Atrasado (19:45)"`, interceptar `window.alert` e garantir que o array `titularesIds` permaneça inalterado.
- [ ] **TT-PT-02: Teste de Limite Estrito de 11 Titulares**
  - **Cenário**: Com 11 titulares definidos, clicar em um 12º atleta reserva pontual e verificar se a inclusão é bloqueada com mensagem de alerta de limite.
- [ ] **TT-PT-03: Teste de Remoção de Titular por Clique no Campo**
  - **Cenário**: Clicar em um titular no campo tático e verificar se o mesmo é removido de `titularesIds` e passa a figurar no banco de reservas.
- [ ] **TT-PT-04: Teste de Feedback Temporário da Liberação de Escalação**
  - **Cenário**: Disparar `handleDivulgar()` e verificar se o texto altera para "Escalação Liberada no Vestiário!" e reverte automaticamente após 3 segundos.

---

## 4. Ordem Sugerida

1. **T-PT-02**: Filtro de atletas confirmados e estrutura de dados de titulares.
2. **T-PT-04**: Algoritmo `toggleTitular` com regras de validação (atraso e limite).
3. **T-PT-03**: Gramado tático com linhas visuais e mapeamento dos 11 titulares.
4. **T-PT-05**: Grid de reservas com destaque visual para penalizados pelo T-35.
5. **T-PT-01**: Header, badges de formação e ação de divulgação.

---

## 5. Lacunas Pendentes (🔴)

- 🔴 **Persistência Local da Escalação**: Persistir o array `titularesIds` no `localStorage` sob a chave `naprancheta_titulares` para sobreviver a recarregamentos de página (F5).
- 🔴 **Posicionamento Tático Dinâmico**: Mapear nós do campo dinamicamente conforme `posicao_principal` do atleta em vez de cortes posicionais fixos por índice (`slice`).
