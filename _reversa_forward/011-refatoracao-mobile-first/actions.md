# Actions: Refatoração do Frontend 100% Mobile-First

> Identificador: `011-refatoracao-mobile-first`  
> Data: `2026-10-02`  
> Roadmap: `_reversa_forward/011-refatoracao-mobile-first/roadmap.md`  

---

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 11 |
| Paralelizáveis (`[//]`) | 5 |
| Maior cadeia de dependência | 4 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Configurar utilitários CSS para Safe Areas, viewport defensivo contra overflow horizontal e suporte à classe `.keyboard-open` | - | `[//]` | `src/index.css` | 🟢 | `[X]` |
| T002 | Definir tipos TypeScript para navegação móvel (abas, itens da gaveta inferior e estados de viewport) | - | `[//]` | `src/types.ts` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Verificar baseline de integridade do frontend (`npm run build`) e da suíte de testes do backend (`php artisan test`) | - | `[//]` | `backend/tests/` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Implementar componente genérico de gaveta inferior deslizável `BottomSheet.tsx` com *drag handle*, backdrop touch e fechamento acessível | T001, T002 | `[//]` | `src/components/ui/BottomSheet.tsx` | 🟢 | `[X]` |
| T005 | Implementar a Bottom Navigation Bar fixa `MobileNavigation.tsx` com as 5 abas (`Vestiário`, `Presença`, `Tática`, `Caixa`, `Mais`), safe-area e auto-ocultação | T001, T002 | `[//]` | `src/components/navigation/MobileNavigation.tsx` | 🟢 | `[X]` |
| T006 | Refatorar `Header.tsx` para versão compacta móvel (< 60px), com seletor simplificado de jogo e delegação de atalhos secundários | T001 | - | `src/components/Header.tsx` | 🟢 | `[X]` |
| T007 | Refatorar `PranchetaTecnica.tsx` com campo tático 4-3-3 adaptativo vertical fluido para larguras de 360px a 430px sem scroll horizontal | T001 | - | `src/components/PranchetaTecnica.tsx` | 🟢 | `[X]` |
| T008 | Refatorar `MatchCardConfirmacao.tsx` expandindo touch targets dos botões ("Vou", "Não Vou", "Dúvida") para $\ge 48\times 48\text{px}$ (RN-04) | T001 | - | `src/components/MatchCardConfirmacao.tsx` | 🟢 | `[X]` |
| T009 | Refatorar `TesoureiroColeta.tsx` adaptando lista de atletas em cards táteis densos com botão de baixa de PIX e cópia com alvo $\ge 48\text{px}$ | T001 | - | `src/components/TesoureiroColeta.tsx` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T010 | Integrar no `App.tsx` a alternância móvel/desktop, listener de `visualViewport` para auto-ocultação no teclado, renderização da Bottom Bar e gaveta "Mais" | T004, T005, T006, T007, T008, T009 | - | `src/App.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T011 | Validar build de produção do frontend (`npm run build`), ausência de quebras de layout nas resoluções móveis e execução dos testes sem regressões | T010 | - | `src/App.tsx` | 🟢 | `[X]` |

---

## Notas de execução

<!--
Reservado para /reversa-coding registrar avisos ou observações que surgirem durante a execução.
-->

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-02 | Versão inicial gerada por `/reversa-to-do` | reversa |
