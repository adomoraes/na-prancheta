# Roadmap: Suporte a Progressive Web App (PWA)

> Identificador: `001-implementar-pwa`
> Data: `2026-09-20`
> Requirements: `_reversa_forward/001-implementar-pwa/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

A capacitação PWA será realizada integrando o plugin oficial `vite-plugin-pwa` (Workbox) ao pipeline do Vite 6. A configuração utilizará `registerType: 'prompt'`, viabilizando controle fino do ciclo de vida do Service Worker. Um componente reutilizável de UI (`PwaManager` / `PwaPrompt`) gerenciará os estados de instalação (`beforeinstallprompt`) em modo híbrido (banner contextual no rodapé e botão permanente no cabeçalho), a notificação interativa de atualização de versão (toast com botão "Atualizar") e a escuta de conectividade de rede (`navigator.onLine`, eventos `online`/`offline`) exibindo um indicador discreto quando offline. O shell estático e as fontes tipográficas externas (Google Fonts) serão armazenados em cache com estratégia *Cache-First* e *Stale-While-Revalidate*, garantindo carregamento instantâneo no vestiário e beira de campo sem rede.

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Ergonomia Mobile de 1 Toque (`_reversa_sdd/domain.md#21`) | Respeita a usabilidade em smartphones no dia do jogo, adicionando ações de instalação e atualização com áreas mínimas de toque adequadas. | respeita |
| Arquitetura Local-First (`_reversa_sdd/architecture.md#22`) | Fortalece a resiliência local da aplicação, permitindo acesso total às telas mesmo em ambientes sem conectividade celular. | respeita |
| Identidade Visual e Dark Mode (`_reversa_sdd/architecture.md#23`) | Mantém a paleta Zinc 950 com acentos semânticos e tipografia Plus Jakarta Sans nas notificações de PWA e manifesto. | respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Adoção do `vite-plugin-pwa` com Workbox | Padrão da indústria para Vite, gera manifestos válidos, lida com hashing de assets e facilita pre-caching de assets em build sem scripts manuais frágeis. | Service Worker manual via `sw.js` nativo (alta propensão a falhas de cache bust e manutenção excessiva). | 🟢 |
| D-02 | Estratégia de atualização `registerType: 'prompt'` | Decisão alinhada no `/reversa-clarify` (Opção B); impede recargas inesperadas na tela durante preleção ou anotação de scout, dando o controle ao usuário via toast. | Atualização silenciosa `autoUpdate` (pode gerar inconsistências de runtime entre abas) e recarga forçada. | 🟢 |
| D-03 | UX Híbrida de Instalação (Banner + Botão Superior) | Decisão alinhada no `/reversa-clarify` (Opção C); oferece alta visibilidade inicial sem ser intrusivo e permite que o usuário instale a qualquer momento se fechar o banner. | Apenas banner intrusivo bloqueante ou apenas botão oculto em menus. | 🟢 |
| D-04 | Caching de Fontes Externas (Google Fonts) via Workbox Runtime Caching | As fontes `Plus Jakarta Sans` e `Cabinet Grotesk` são vitais para a estética premium do sistema; o caching via Workbox garante que não haja fallback para fontes genéricas sem internet. | Injeção inline de fontes base64 (onera o bundle inicial) ou dependência de rede sem cache. | 🟢 |
| D-05 | Indicador de Conectividade Contextual na Barra de Status | Notifica discretamente o usuário quando a internet cair, evitando frustração ao tentar sincronizar ou acessar recursos externos. | Modal bloqueante de erro de conexão (bloqueia o uso do app desnecessariamente). | 🟢 |

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| O navegador do cliente oferece suporte padrão a Service Workers e Cache Storage API (browsers modernos Chrome, Safari iOS 11.3+, Edge, Firefox). | `requirements.md#6-requisitos-não-funcionais` | Baixo. Navegadores antigos rodarão a aplicação em modo web SPA tradicional sem degradação das funcionalidades básicas. |
| Os assets essenciais de imagem (ícones 192x192, 512x512) podem ser gerados em formato SVG/PNG e servidos no diretório público. | `requirements.md#5-rf-01` | Mínimo. Ícones vetoriais garantem nitidez e baixo peso de download. |

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `vite.config.ts` | `vite.config.ts` | componente-alterado | Inclusão do plugin `VitePWA` com manifesto, ícones e regras de Workbox. |
| `index.html` | `index.html` | componente-alterado | Inclusão de meta tags PWA (`theme-color`, `apple-mobile-web-app-capable`, links de ícone). |
| `PwaManager` / `PwaPrompt` | `src/components/PwaPrompt.tsx` | componente-novo | Componente que gerencia os eventos de instalação, toast de atualização e indicador offline. |
| `App.tsx` | `src/App.tsx` | componente-alterado | Integração do `PwaPrompt` e do botão discreto de instalação na navegação superior. |
| `package.json` | `package.json` | componente-alterado | Adição da dependência `vite-plugin-pwa` e `workbox-window`. |
| Ícones PWA | `public/pwa-*.png`, `public/icon.svg` | componente-novo | Ícones do aplicativo para instalação na tela inicial e splash screen. |

## 6. Delta no modelo de dados

- Resumo das mudanças: Não há alterações de schema de banco de dados ou migrações relacionais no backend. No frontend, adiciona-se apenas a chave de controle de dismiss do banner de instalação no `localStorage` (`na_prancheta_pwa_install_dismissed`).
- Detalhe completo em: `_reversa_forward/001-implementar-pwa/data-delta.md`

## 7. Delta de contratos externos

- Resumo: Não há criação, alteração ou exclusão de endpoints ou contratos externos de API. O backend Laravel continua expondo os mesmos endpoints REST existentes.

## 8. Plano de migração

1. Instalar pacotes de desenvolvimento `vite-plugin-pwa` e `workbox-window`.
2. Criar os ícones do aplicativo PWA no diretório `public/` nos formatos 192x192, 512x512 e SVG maskable.
3. Configurar o plugin `VitePWA` no `vite.config.ts` com manifesto oficial e estratégias de cache do Workbox.
4. Ajustar `index.html` com as meta tags PWA recomendadas para mobile/iOS.
5. Criar o componente `PwaPrompt.tsx` e integrá-lo em `src/App.tsx`.
6. Validar compilação (`npm run build`), registro de Service Worker e simulação offline via Chrome DevTools.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Safari iOS possui suporte parcial para o evento `beforeinstallprompt`. | Médio | Alta | O Safari no iOS não dispara `beforeinstallprompt`; implementar instrução amigável de instalação manual ("Compartilhar -> Adicionar à Tela de Início") quando detectado ambiente iOS. |
| Cache obsoleto de Service Worker impedindo visualização de novidades. | Médio | Baixa | Adoção do `registerType: 'prompt'` com verificação periódica de versão e toast que invoca `updateSW(true)` para forçar ativação imediata. |
| Bloqueio de instalação por ausência de ícones válidos. | Alto | Baixa | Gerar ícones SVG/PNG estritamente compatíveis com a especificação W3C (192x192, 512x512, maskable). |

## 10. Critério de pronto

- [ ] Pacote `vite-plugin-pwa` instalado e configurado no `vite.config.ts`.
- [ ] Manifesto PWA válido servido com nome, tema, cores e ícones funcionais.
- [ ] Service Worker gerado e registrado no navegador com sucesso.
- [ ] Toast de atualização de versão funcional e testável.
- [ ] Banner de instalação e botão de instalação no cabeçalho integrados.
- [ ] Aplicação carrega e navega em modo offline com rede desativada.
- [ ] Build de produção (`npm run build`) concluído com sucesso sem erros de tipagem.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-09-20 | Versão inicial gerada por `/reversa-plan` | reversa |
