# Actions: Suporte a Progressive Web App (PWA)

> Identificador: `001-implementar-pwa`
> Data: `2026-09-20`
> Roadmap: `_reversa_forward/001-implementar-pwa/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 10 |
| Paralelizáveis (`[//]`) | 3 |
| Maior cadeia de dependência | 6 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Instalar dependências `vite-plugin-pwa` e `workbox-window` no projeto frontend. | - | - | `package.json` | 🟢 | `[X]` |
| T002 | Gerar conjunto de ícones PWA (SVG, PNG 192x192, PNG 512x512, maskable e favicon) na pasta pública. | - | `[//]` | `public/icon.svg`, `public/pwa-*.png` | 🟢 | `[X]` |
| T003 | Adicionar meta tags PWA (`theme-color`, `apple-mobile-web-app-*`, links de ícone e manifesto) no `index.html`. | T002 | - | `index.html` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Criar script de verificação estática do manifesto e conformidade do Service Worker. | T001 | `[//]` | `scripts/verify-pwa.mjs` | 🟢 | `[X]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T005 | Configurar plugin `VitePWA` no `vite.config.ts` com manifesto, pre-caching de assets e runtime caching de Google Fonts. | T001, T002 | - | `vite.config.ts` | 🟢 | `[X]` |
| T006 | Implementar hook `usePwa` gerenciando estado de conectividade (`online`/`offline`), evento `beforeinstallprompt` e sinalização de atualização. | T001, T005 | - | `src/hooks/usePwa.ts` | 🟢 | `[X]` |
| T007 | Criar componente `PwaPrompt` com banner contextual de instalação, botão de ação, toast interativo de nova versão e badge offline. | T006 | - | `src/components/PwaPrompt.tsx` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T008 | Integrar `PwaPrompt` e botão de instalação no cabeçalho/menu principal em `src/App.tsx`. | T007 | - | `src/App.tsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T009 | Executar build de produção (`npm run build`) validando compilação de assets, geração do manifesto e registro do Service Worker. | T003, T005, T008 | - | `dist/sw.js` | 🟢 | `[X]` |
| T010 | Documentar o suporte a PWA, instruções de instalação mobile e operação offline no `README.md`. | T008 | `[//]` | `README.md` | 🟢 | `[X]` |

## Notas de execução

- **T001:** Instalados `vite-plugin-pwa@^1.3.0` e `workbox-window@^7.3.0` como devDependencies no `package.json`.
- **T002:** Ícones vetoriais SVG e PNGs rasterizados de alta qualidade gerados com paleta Zinc 950 e Esmeralda 500, compatíveis com os modos maskable e standard.
- **T004:** Script `node scripts/verify-pwa.mjs` testado com 15 de 15 verificações aprovadas (0 falhas).
- **T005:** `VitePWA` configurado com `registerType: 'prompt'`, pre-caching de assets estáticos e runtime caching de Google Fonts (stylesheets e webfonts).
- **T008:** Integração concluída com botão de instalação discreto no `Header` e componentes de banner/toast via `PwaPrompt`.
- **T009:** Build de produção (`npm run build`) concluído com sucesso, gerando `dist/sw.js` (533.39 KiB pre-cached em 19 entradas).

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-20 | Versão inicial gerada por `/reversa-to-do` | reversa |
| 2026-09-20 | Conclusão das ações T001 a T010 via `/reversa-coding` | reversa |
