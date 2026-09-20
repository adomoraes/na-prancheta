# Adendo: Suporte a Progressive Web App (PWA)

> Identificador: `001-implementar-pwa`
> Data: `2026-09-20`
> Cenário: `legado`
> Origem: `_reversa_forward/001-implementar-pwa/`

---

## 1. Vigência

Vigente desde 2026-09-20.

---

## 2. Resumo da entrega

Capacitação da aplicação Na Prancheta como um Progressive Web App (PWA) de alto desempenho, assegurando instalação autônoma na tela inicial (Android, iOS Safari e Desktop), resiliência de operação em vestiários e campos com conectividade intermitente ou offline através de Service Worker com Workbox, indicador contextual de status de rede, e ciclo de atualização controlada via toast interativo.

Todas as **10 ações atômicas** planejadas em `_reversa_forward/001-implementar-pwa/actions.md` foram concluídas com sucesso.

---

## 3. Impacto por artefato da extração

| Artefato | Seção | Tipo de impacto | Delta |
|---|---|---|---|
| `_reversa_sdd/architecture.md` | `#1-visão-geral-da-arquitetura` | `componente-alterado` | A SPA agora gera Web App Manifest e registra Service Worker com Workbox, operando em modo autônomo (standalone). |
| `_reversa_sdd/architecture.md` | `#22-estratégia-de-persistência-local-first` | `componente-alterado` | Camada de cache enriquecida: assets estáticos, fontes tipográficas externas e leitura de partidas são servidos via Cache Storage offline. |
| `_reversa_sdd/dependencies.md` | `#2-dependências-de-produção` | `componente-novo` | Adicionadas as dependências `vite-plugin-pwa` e `workbox-window` ao pipeline do Vite. |
| `_reversa_sdd/domain.md` | `#21-regras-de-presença-e-escalação` | `regra-nova` | Inclusão das regras RN-01PWA (Instalação Autônoma), RN-02PWA (Resiliência Offline), RN-03PWA (Sinalização de Rede) e RN-04PWA (Toast Interativo de Atualização). |
| `_reversa_sdd/inventory.md` | `#superfície` | `componente-novo` | Novos componentes de UI e hooks: `src/components/PwaPrompt.tsx` e `src/hooks/usePwa.ts`, além de novos ícones oficiais em `public/`. |

---

## 4. Regras sob vigilância

Os seguintes itens de monitoramento de regressão foram definidos para verificação em futuras re-extrações do sistema:

- [`W001`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/001-implementar-pwa/regression-watch.md): Validação de presença do manifesto W3C com modo `standalone`.
- [`W002`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/001-implementar-pwa/regression-watch.md): Presença do Service Worker com caching de assets e Google Fonts.
- [`W003`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/001-implementar-pwa/regression-watch.md): Presença do indicador visual de modo offline.
- [`W004`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/001-implementar-pwa/regression-watch.md): Manutenção da estratégia de atualização controlada `registerType: 'prompt'`.

Detalhes completos em: [`_reversa_forward/001-implementar-pwa/regression-watch.md`](file:///home/adomoraes/projects/na-prancheta/_reversa_forward/001-implementar-pwa/regression-watch.md).

---

## 5. Fontes

- `_reversa_forward/001-implementar-pwa/requirements.md`
- `_reversa_forward/001-implementar-pwa/roadmap.md`
- `_reversa_forward/001-implementar-pwa/actions.md`
- `_reversa_forward/001-implementar-pwa/progress.jsonl`
- `_reversa_forward/001-implementar-pwa/legacy-impact.md`
- `_reversa_forward/001-implementar-pwa/regression-watch.md`
