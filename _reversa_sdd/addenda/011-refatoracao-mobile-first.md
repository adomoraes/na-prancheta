# Adendo: Refatoração do Frontend 100% Mobile-First

> Feature: `011-refatoracao-mobile-first`  
> Data: 2026-10-02  
> Cenário: legado  

---

## Vigência

Vigente desde 2026-10-02.

---

## Resumo da entrega

Refatoração integral do frontend React 19 do Na Prancheta com foco **100% Mobile-First**, estabelecendo paradigmas de aplicativos nativos para uso à beira do gramado ou quadra. Implementação de uma **Bottom Navigation Bar fixa** com as 5 abas operacionais essenciais (`Vestiário`, `Presença`, `Tática`, `Caixa` e `Mais`), gaveta inferior deslizável (**`BottomSheet.tsx`**) para ações secundárias e almoxarifado/scouts, campo da **Prancheta Tática 4-3-3** com adaptação vertical fluida para larguras de 360px a 430px sem barra de rolagem horizontal, compactação do cabeçalho móvel (< 60px), alvos de toque rigorosamente ampliados para $\ge 48\times 48\text{px}$ (RN-04) e auto-ocultação da Bottom Bar sob teclado virtual móvel (`.keyboard-open` via `window.visualViewport`). Foram concluídas **11 de 11 ações** atômicas com a suíte de 72 testes de regressão do backend 100% verde (363 asserções) e build de produção Vite concluído sem erros.

---

## Impacto por artefato da extração

| Artefato | Seção | Tipo de impacto | Delta |
|---|---|---|---|
| `_reversa_sdd/architecture.md` | `#2.1 Padrão SPA Reativa` | regra-alterada | Em viewports `< 768px`, a navegação do sistema é governada pela Bottom Navigation Bar fixa e Bottom Sheets, mantendo abas de topo exclusivas para telas `>= 768px`. |
| `_reversa_sdd/architecture.md` | `#2.2 Componentes e Camadas` | componente-novo | Adição dos componentes `MobileNavigation.tsx` (navegação inferior fixa com badges) e `BottomSheet.tsx` (gaveta modal inferior touch-friendly). |
| `_reversa_sdd/architecture.md` | `#2.3 Design System Moderno` | regra-nova | Incorporação de tokens e utilitários CSS para Safe Area Insets (`pt-safe`, `pb-safe`, `pb-safe-nav`), alvos mínimos `.touch-target` (48px) e estado `.keyboard-open`. |
| `_reversa_sdd/domain.md` | `#RN-04 Ergonomia Mobile de 1 Toque` | regra-alterada | A regra RN-04 foi expandida de 1 toque para toda a *Thumb Zone*, exigindo touch targets de no mínimo $48 \times 48\text{px}$ e feedback visual tátil nos controles de presença, tática e caixa. |
| `_reversa_sdd/prancheta-tatica/design.md` | `#Campo Tático` | regra-alterada | Posicionamento tático 4-3-3 adaptado verticalmente com proporções percentuais SVG/CSS fluidas para qualquer resolução de 360px a 430px sem scroll horizontal. |

---

## Regras sob vigilância

Os seguintes itens foram registrados para vigília em futuras re-extrações do sistema:
- **`W001`**: Em viewports `< 768px`, a Bottom Navigation Bar fixa de 5 abas deve ser exibida na base da tela com respeito às Safe Areas (`pb-safe`).
- **`W002`**: O toque na aba "Mais" deve abrir uma gaveta inferior deslizável (*Bottom Sheet*) com atalhos para Almoxarifado, Scouts, Admin e Vitrine.
- **`W003`**: O campo tático vertical 4-3-3 deve se ajustar proporcionalmente sem provocar scroll horizontal em telas a partir de 360px.
- **`W004`**: Abertura do teclado virtual móvel deve aplicar `.keyboard-open` e ocultar a Bottom Navigation Bar para liberar a tela.
- **`W005`**: Os botões de confirmação de presença ("Vou", "Não Vou", "Dúvida") e de baixa de PIX no Caixa devem manter touch target de no mínimo $48 \times 48\text{px}$ (RN-04).

*Consulte a definição completa dos sinais de violação em [`_reversa_forward/011-refatoracao-mobile-first/regression-watch.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/011-refatoracao-mobile-first/regression-watch.md).*

---

## Fontes

- `_reversa_forward/011-refatoracao-mobile-first/requirements.md`
- `_reversa_forward/011-refatoracao-mobile-first/roadmap.md`
- `_reversa_forward/011-refatoracao-mobile-first/actions.md`
- `_reversa_forward/011-refatoracao-mobile-first/legacy-impact.md`
- `_reversa_forward/011-refatoracao-mobile-first/regression-watch.md`
- `_reversa_forward/011-refatoracao-mobile-first/progress.jsonl`
