# Impacto no Legado: Feature 011 - Refatoração 100% Mobile-First

> Data: `2026-10-02`  
> Feature ID: `011-refatoracao-mobile-first`  
> Política de edição: `allowLegacyEdits: true` com `allowedPaths: []` (liberação irrestrita pelo usuário)  

---

## 1. Arquivos Afetados

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|---|---|---|---|---|
| `src/index.css` | Design System / CSS | regra-nova | LOW | Adição de variáveis CSS e classes de Safe Area (`pt-safe`, `pb-safe`, `pb-safe-nav`), touch target (`.touch-target`) e classe de estado `.keyboard-open`. |
| `src/types.ts` | Shared Contracts | regra-nova | LOW | Adição dos tipos `MobileTab`, `MobileNavItem` e `BottomSheetAction` para arquitetura de navegação móvel. |
| `src/components/ui/BottomSheet.tsx` | UI Primitives | componente-novo | LOW | Implementação de componente reutilizável de gaveta inferior deslizável touch-friendly com drag handle e backdrop. |
| `src/components/navigation/MobileNavigation.tsx` | Navigation Module | componente-novo | LOW | Implementação da Bottom Navigation Bar fixa com 5 abas ergonômicas, badges e suporte a safe area. |
| `src/components/Header.tsx` | App Header | regra-alterada | LOW | Compactação do cabeçalho no mobile para altura de linha única (< 60px), transferindo ações secundárias para a Bottom Sheet. |
| `src/components/PranchetaTecnica.tsx` | Prancheta Tática | regra-alterada | LOW | Adaptação vertical fluida do campo 4-3-3 com touch targets de 48px para titulares e reservas, sem scroll horizontal. |
| `src/components/MatchCardConfirmacao.tsx` | Presença | regra-alterada | LOW | Expansão dos alvos de toque dos botões de presença ("Vou", "Não Vou", "Dúvida") para $\ge 48\times 48\text{px}$ com feedback tátil ativo. |
| `src/components/TesoureiroColeta.tsx` | Caixa & Vaquinha | regra-alterada | LOW | Aumento do touch target de alternância de pagamento para 48px e reorganização dos filtros táteis de cobrança. |
| `src/App.tsx` | SPA Root | regra-alterada | LOW | Integração de `MobileNavigation`, `BottomSheet` para o menu "Mais", listener de `visualViewport` para auto-ocultação no teclado e padding inferior defensivo. |

---

## 2. Diff Conceitual por Componente

### 2.1 Navegação Principal Mobile (< 768px)
Substituição das abas horizontais tradicionais de topo pelo componente `MobileNavigation.tsx`, fixado no rodapé com respeito às Safe Areas (`env(safe-area-inset-bottom)`). A barra expõe os 5 fluxos mais críticos do dia de jogo (`Vestiário`, `Presença`, `Tática`, `Caixa` e `Mais`), posicionados exatamente na *Thumb Zone* (zona de alcance natural do polegar).

### 2.2 Gaveta Inferior (Bottom Sheet) para Módulos Secundários
A quinta aba ("Mais") abre um `BottomSheet.tsx` com *drag handle* e animação suave, centralizando o acesso a Almoxarifado, Scouts, Painel Admin ROOT, Cadastro de Atleta e Vitrine Comercial, sem poluir a interface primária.

### 2.3 Resiliência sob Teclado Virtual Móvel
Implementação de listener em `window.visualViewport` no `src/App.tsx`. Ao abrir o teclado virtual em formulários móveis, a classe `.keyboard-open` recolhe suavemente a Bottom Navigation Bar (`translate-y-full opacity-0 pointer-events-none`), evitando quebras de layout ou sobreposição indesejada de campos de digitação.

### 2.4 Campo Tático 4-3-3 Vertical Fluido
A Prancheta Tática passa a ser 100% responsiva sem rolagem horizontal para qualquer viewport móvel a partir de 360px de largura, mantendo os 11 titulares e o banco de reservas plenamente visíveis e acionáveis.

---

## 3. Regras de Domínio Preservadas (🟢)

As 11 regras fundamentais de domínio extraídas em `_reversa_sdd/domain.md` permanecem 100% íntegras:
- **RN-01 (Confirmação Prévia Obrigatória):** Preservada.
- **RN-02 (Corte Inegociável por Atraso - T-35):** Preservada no campo e no banco de reservas.
- **RN-03 (Limite Estrito de 11 Titulares):** Preservada.
- **RN-04 (Ergonomia Mobile de 1 Toque):** **Fortalecida e expandida** com alvos de toque $\ge 48\times 48\text{px}$ em todos os controles.
- **RN-05 (Base de Cobrança Restrita a Confirmados):** Preservada.
- **RN-06 (Meta de Arbitragem Fixa de R$ 300,00):** Preservada.
- **RN-07 (Transparência Ativa via WhatsApp):** Preservada.
- **RN-08 (Obrigatoriedade de Desvirar Fardamentos):** Preservada.
- **RN-09 (Trava Booleana da Resenha Social):** Preservada.
- **RN-10 (Integridade de Contadores Numéricos):** Preservada.
- **RN-11 (Unicidade do MVP da Partida):** Preservada.

---

## 4. Regras de Domínio Modificadas / Novas

- **RN-01 da Feature (Navegação Mobile Inferior Fixa):** Em viewports `< 768px`, a navegação do sistema é controlada prioritariamente pela Bottom Navigation Bar fixa de 5 abas, ficando as abas de topo restritas a telas `>= 768px`.
- **RN-02 da Feature (Auto-ocultação sob Teclado Virtual):** A barra de navegação inferior se oculta automaticamente quando o teclado virtual móvel é disparado por inputs ou áreas de texto.
- **RN-03 da Feature (Touch Target Mínimo de 48px):** Todos os botões e seletores interativos operacionais no mobile possuem área mínima de clique/toque de $48 \times 48\text{px}$.
