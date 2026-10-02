# Regression Watch: Feature 011 - Refatoração 100% Mobile-First

> Feature: `011-refatoracao-mobile-first`  
> Data de geração: `2026-10-02`  

---

## 1. Itens em Vigília

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|---|---|---|---|---|
| **W001** | `src/components/navigation/MobileNavigation.tsx` | Em viewports `< 768px`, a Bottom Navigation Bar fixa de 5 abas deve ser exibida na base da tela com respeito às Safe Areas (`pb-safe`). | presença | Ausência da barra de navegação inferior em smartphones ou sobreposição com a barra de gestos do SO. |
| **W002** | `src/components/ui/BottomSheet.tsx` | O toque na aba "Mais" deve abrir uma gaveta inferior deslizável (*Bottom Sheet*) com atalhos para Almoxarifado, Scouts, Admin e Vitrine. | presença | Menu "Mais" abrindo modal centralizado tradicional desktop ou falha na abertura da gaveta inferior. |
| **W003** | `src/components/PranchetaTecnica.tsx` | O campo tático vertical 4-3-3 deve se ajustar proporcionalmente sem provocar scroll horizontal em telas a partir de 360px. | presença | Barra de rolagem horizontal ou corte dos jogadores nas laterais em telas de 360px a 430px. |
| **W004** | `src/App.tsx:handleViewportChange` | Abertura do teclado virtual móvel deve aplicar `.keyboard-open` e ocultar a Bottom Navigation Bar para liberar a tela. | presença | Barra de navegação inferior flutuando por cima do teclado virtual durante a digitação. |
| **W005** | `src/components/MatchCardConfirmacao.tsx` | Os botões de confirmação de presença ("Vou", "Não Vou", "Dúvida") devem manter touch target de no mínimo $48 \times 48\text{px}$ (RN-04). | presença | Dimensões de toque reduzidas para menos de 48px ou espaçamento insuficiente provocando toques acidentais. |

---

## 2. Histórico de Re-extrações

<!-- Preenchido pelo Reversa em futuras execuções de re-extração. -->

---

## 3. Itens Arquivados

<!-- Regras que foram superadas por features posteriores. -->
