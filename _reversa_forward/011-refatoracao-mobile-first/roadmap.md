# Roadmap: Refatoração do Frontend 100% Mobile-First

> Identificador: `011-refatoracao-mobile-first`  
> Data: `2026-10-02`  
> Requirements: `_reversa_forward/011-refatoracao-mobile-first/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A refatoração implementa uma arquitetura **100% Mobile-First** na SPA React 19 do Na Prancheta, substituindo padrões desktop por padrões nativos de smartphones. A base da navegação móvel passa a ser uma **Bottom Navigation Bar** fixa com 5 abas (`Vestiário`, `Presença`, `Tática`, `Caixa` e `Mais`), com suporte a `env(safe-area-inset-bottom)` e detecção de teclado virtual para auto-ocultação. O campo da Prancheta Tática 4-3-3 é adaptado verticalmente com proporções fluidas para telas a partir de 360px sem scroll horizontal. Modais pesados são convertidos em **Bottom Sheets** deslizáveis com *drag handle*, e o Header é compactado (< 60px) com alvos de toque aumentados para no mínimo 48x48px (RN-04).

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Ergonomia de 1 Toque (RN-04) | Amplia para todas as ações operacionais posicionadas na Thumb Zone (área de alcance do polegar) e touch targets de 48px. | respeita |
| Identidade Visual Dark Mode | Preserva a paleta Zinc 950 com acentos semânticos e tipografia Cabinet Grotesk / Plus Jakarta Sans. | respeita |
| PWA Standalone | Integração perfeita com barras de gestos e entalhes do sistema via CSS `env(safe-area-inset-*)`. | respeita |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| **D-01** | Criar componente `MobileNavigation.tsx` (Bottom Navigation Bar fixa) para viewports < 768px. | Padrão nativo consolidado no iOS/Android para acesso imediato com o polegar. | Manter tabs no topo (Header) ou menu hambúrguer oculto (atrito de múltiplos toques). | 🟢 |
| **D-02** | Bottom Bar com 5 itens fixos (`Vestiário`, `Presença`, `Tática`, `Caixa` e `Mais`) abrindo Bottom Sheet para demais módulos (Almoxarifado, Scouts, Admin). | Decisão confirmada na clarificação de 2026-10-02. Equilibra simplicidade sem poluir a barra com 8 ícones espremidos. | Barra dinâmica ou barra horizontal rolável (causa scroll acidental). | 🟢 |
| **D-03** | Auto-ocultação da Bottom Bar quando o teclado virtual abre (`keyboard-open` listener / `visualViewport`). | Decisão confirmada na clarificação de 2026-10-02. Evita sobreposição feia e quebra de layout durante digitação. | Deixar a barra flutuar em cima do teclado (tampa botões de submissão). | 🟢 |
| **D-04** | Prancheta Tática 4-3-3 com campo vertical fluido e coordenadas percentuais fixas em SVG/CSS. | Decisão confirmada na clarificação de 2026-10-02. Garante proporção idêntica de 360px a 430px sem transbordar tela. | Forçar rotação de tela (rejeitado por exigir duas mãos na beira do campo). | 🟢 |
| **D-05** | Componente genérico `BottomSheet.tsx` baseado em CSS transitions e backdrop touch. | Substitui os modais centralizados desktop que quebram em telas compridas ou estreitas. | Usar bibliotecas pesadas de terceiros (aumentaria o bundle PWA). | 🟢 |
| **D-06** | Header compacto móvel (< 60px) com menu de perfil e indicador de partida. | Libera mais de 50px de altura vertical útil para a área de conteúdo tático. | Manter o cabeçalho completo desktop com múltiplos seletores e botões expostos. | 🟢 |

---

## 4. Premissas

Nenhuma premissa pendente de dúvidas: todas as 3 lacunas iniciais foram esclarecidas na sessão do `/reversa-clarify` em 2026-10-02.

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `App.tsx` | `_reversa_sdd/architecture.md#2.1` | regra-alterada | Integração do estado do teclado virtual, renderização condicional de `MobileNavigation` e padding inferior responsivo. |
| `Header.tsx` | `_reversa_sdd/architecture.md#2.1` | regra-alterada | Redução da altura para mobile (< 60px), logo compacto e transferência de atalhos secundários para gaveta. |
| `MobileNavigation.tsx` | `src/components/navigation/` | componente-novo | Barra de navegação inferior fixa com 5 abas, badges de status e suporte a safe area. |
| `BottomSheet.tsx` | `src/components/ui/` | componente-novo | Gaveta inferior deslizável touch-friendly para ações rápidas, formulários e menu "Mais". |
| `PranchetaTecnica.tsx` | `_reversa_sdd/architecture.md#2.1` | regra-alterada | Campo tático adaptativo proporcional sem scroll horizontal para telas a partir de 360px. |
| `TesoureiroColeta.tsx` | `_reversa_sdd/architecture.md#2.1` | regra-alterada | Lista de cobrança mobile em cards densos com touch target de 48px para baixa rápida de PIX. |
| `MatchCardConfirmacao.tsx` | `_reversa_sdd/architecture.md#2.1` | regra-alterada | Botões "Vou", "Não Vou" e "Dúvida" com alvos expandidos e feedback tátil imediato. |
| `index.css` | `src/index.css` | regra-alterada | Utilitários de Safe Area (`pb-safe`, `pt-safe`), overflow-x defensivo e regras de touch sizing. |

---

## 6. Delta no modelo de dados

- Resumo das mudanças: **Nenhuma mudança de banco de dados ou migração necessária**. A refatoração é estritamente no frontend React 19 / CSS / UX Mobile.
- Detalhe completo em: `_reversa_forward/011-refatoracao-mobile-first/data-delta.md`

---

## 7. Delta de contratos externos

- Resumo: Nenhum contrato de API REST, fila ou webhook alterado. Todos os endpoints existentes em `src/services/api.ts` permanecem consumidos de forma transparente.

---

## 8. Plano de migração

Não há necessidade de migração de dados nem quebra de compatibilidade:
1. Os componentes desktop continuam funcionando sem regressão em viewports `>= 768px` através das classes responsivas `md:` do Tailwind.
2. Em telas `< 768px`, as novas regras mobile entram em vigor automaticamente.

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Conflito de Safe Area em aparelhos sem barra de gestos | baixo | baixa | Uso do fallback padrão CSS: `max(env(safe-area-inset-bottom), 12px)`. |
| Comportamento inconsistente do teclado virtual entre Safari iOS e Chrome Android | médio | média | Uso da API moderna `window.visualViewport` combinada com evento `resize` e classe CSS `.keyboard-open`. |
| Perda de visibilidade dos titulares do 4-3-3 em telas 360px | alto | baixa | Coordenadas percentuais CSS e cálculo dinâmico de `aspect-ratio` mantendo escala íntegra. |

---

## 10. Critério de pronto

- [ ] Todas as 11 ações do `actions.md` marcadas `[X]`
- [ ] Bottom Navigation Bar fixa operando perfeitamente em telas móveis
- [ ] Prancheta Tática 4-3-3 sem scroll horizontal em 360px e 390px
- [ ] Bottom Sheets substituindo modais móveis com fechamento por swipe/toque
- [ ] Header mobile compacto (< 60px) com menu colapsável
- [ ] Touch targets $\ge 48\text{px}$ em todos os controles operacionais
- [ ] Suíte completa de testes (`php artisan test`) e build frontend (`npm run build`) verdes sem erros

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-02 | Versão inicial gerada por `/reversa-plan` | reversa |
