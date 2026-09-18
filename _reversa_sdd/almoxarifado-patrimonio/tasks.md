# Tarefas de Implementação: Almoxarifado, Custódia de Malas e Patrimônio

> Nível de Documentação: **Detalhado**  
> Unit: `almoxarifado-patrimonio`  
> Componente Base: [`src/components/AlmoxarifadoView.tsx`](file:///home/adomoraes/projects/na-prancheta/src/components/AlmoxarifadoView.tsx)

---

## 1. Pré-requisitos

- [ ] Definição das interfaces `PatrimonioItem` e `Evento` em `src/types.ts`.
- [ ] Coleção inicial de patrimônio configurada em `src/data/initialData.ts` e conectada em `src/App.tsx`.

---

## 2. Tarefas de Implementação

- [ ] **T-AP-01: Renderizar Header do Almoxarifado e Identificação do Custodiante**
  - **Origem no Legado**: `src/components/AlmoxarifadoView.tsx:18-40`
  - **Critério de Pronto**: Exibir cabeçalho com ícone `Package`, título em caixa alta, subtítulo explicativo e badge destacando o responsável pela custódia das malas na rodada.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-AP-02: Implementar Banner Institucional da Regra de Ouro do Vestiário**
  - **Origem no Legado**: `src/components/AlmoxarifadoView.tsx:42-51`
  - **Critério de Pronto**: Renderizar container púrpuro de alta visibilidade comunicando que a resenha social e o consumo de bebidas dependem da contagem das 22 camisas desviradas.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-AP-03: Implementar Checklist com 3 Checkboxes de Devolução**
  - **Origem no Legado**: `src/components/AlmoxarifadoView.tsx:53-95`
  - **Critério de Pronto**: Três checkboxes com labels táteis e hover styling:
    1. 22 Camisas depositadas do lado correto na mala.
    2. Bolsão de 6 bolas oficiais recolhido e conferido.
    3. Mala 1 fechada e guardada no veículo oficial de transporte.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-AP-04: Implementar Avaliação Reativa Tríplice e Status da Resenha**
  - **Origem no Legado**: `src/components/AlmoxarifadoView.tsx:15, 97-106`
  - **Critério de Pronto**: Avaliar a conjunção lógica dos 3 itens; renderizar "Status da Resenha: BLOQUEADA (Aguardando malas) ⏳" (âmbar) caso haja pendência, e "Status da Resenha: LIBERADA ✅" (verde esmeralda) quando todos estiverem marcados.
  - **Confiança**: 🟢 CONFIRMADO

- [ ] **T-AP-05: Renderizar Catálogo de Patrimônio Ativo com Disponibilidade**
  - **Origem no Legado**: `src/components/AlmoxarifadoView.tsx:109-125`
  - **Critério de Pronto**: Grade responsiva de 1 ou 2 colunas listando os materiais cadastrados com nome, contagem de itens disponíveis vs. total e observações de estado físico.
  - **Confiança**: 🟢 CONFIRMADO

---

## 3. Tarefas de Teste Automatizado

- [ ] **TT-AP-01: Teste de Bloqueio da Resenha com Checklist Incompleto**
  - **Cenário**: Marcar 2 dos 3 checkboxes e garantir que o texto do indicador permaneça como "BLOQUEADA (Aguardando malas) ⏳".
- [ ] **TT-AP-02: Teste de Liberação da Resenha com Checklist Completo**
  - **Cenário**: Marcar os 3 checkboxes consecutivamente e validar a transição imediata do indicador para "LIBERADA ✅".
- [ ] **TT-AP-03: Teste de Reversão de Status ao Desmarcar Item**
  - **Cenário**: Com todos os itens marcados e resenha liberada, desmarcar o checkbox de bolas recolhidas e verificar se o status reverte imediatamente para bloqueado.

---

## 4. Ordem Sugerida

1. **T-AP-02**: Banner explicativo da Regra de Ouro de fechamento de malas.
2. **T-AP-03**: Checklist interativo com os 3 inputs táteis.
3. **T-AP-04**: Algoritmo tríplice e indicador reativo de liberação da resenha.
4. **T-AP-05**: Grade de inventário do patrimônio ativo.
5. **T-AP-01**: Cabeçalho e identificação de custodiante.

---

## 5. Lacunas Pendentes (🔴)

- 🔴 **Persistência de Conferência no LocalStorage**: Armazenar o status dos checkboxes sob a chave `naprancheta_almoxarifado` para manter o estado após recarregamento de tela.
- 🔴 **Custodiante Parametrizável**: Tornar o responsável pela custódia um campo dinâmico associado ao evento ou configurável nas preferências do clube.
