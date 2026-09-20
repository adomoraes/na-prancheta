# Investigação Técnica: Implementação de PWA no Na Prancheta

> Identificador: `001-implementar-pwa`
> Data: `2026-09-20`
> Requirements: `_reversa_forward/001-implementar-pwa/requirements.md`

## 1. Contexto e Objetivo

O Na Prancheta é uma SPA esportiva voltada para o uso dinâmico em dias de partida, onde as condições de conectividade dos atletas e da comissão técnica frequentemente oscilam entre conexões lentas (3G) e zonas de sombra sem sinal (vestiários subterrâneos ou campos abertos afastados).

O objetivo desta investigação é estabelecer a arquitetura técnica ideal para transformar a SPA em um Progressive Web App (PWA) de alto desempenho, assegurando:
1. Instalabilidade autônoma (standalone) no Android, iOS e Desktop.
2. Caching de aplicação (app shell) com disponibilidade offline imediata.
3. Ciclo de vida previsível de atualizações do Service Worker.
4. Experiência de instalação intuitiva para os usuários.

---

## 2. Análise de Alternativas Técnicas

### Alternativa A: Service Worker Manual (`sw.js` nativo)
- **Descrição:** Criação manual de um arquivo `public/sw.js` com eventos `install`, `activate` e `fetch`.
- **Vantagens:** Sem dependências extras no projeto.
- **Desvantagens:**
  - Extremamente frágil no ecossistema Vite com hashes em nomes de bundles (`index-CW_6s91q.js`), exigindo scripts manuais para injetar os nomes dos arquivos compilados.
  - Alto risco de inconsistências de cache e "caching de zumbi" (versão antiga presa no navegador).
  - Ausência de padrões comprovados de retry, quotas de armazenamento e expiração de cache.
- **Veredito:** ❌ Descartada.

### Alternativa B: `vite-plugin-pwa` com Workbox (Recomendada)
- **Descrição:** Plugin oficial do Vite baseado no Workbox do Google (`vite-plugin-pwa`).
- **Vantagens:**
  - Gera automaticamente o precache manifest com todos os assets compilados pelo Rollup/Vite.
  - Oferece o hook virtual `virtual:pwa-register/react` com métodos prontos `useRegisterSW` para lidar com `needRefresh` e `updateServiceWorker()`.
  - Suporte nativo a injeção de Web App Manifest válido.
  - Configuração granular de runtime caching para fontes e recursos externos.
- **Veredito:** ✅ Escolhida.

---

## 3. Estratégias de Cache no Workbox

Para atender aos requisitos de desempenho e offline sem comprometer a atualização dos dados:

1. **App Shell e Assets Estáticos (HTML, JS, CSS, SVG, Imagens locais):**
   - **Estratégia:** Pre-caching automático gerado no build do Vite.
   - **Comportamento:** Carregamento ultra-rápido instantâneo (< 300ms) direto do Cache Storage.

2. **Fontes Web Externas (Google Fonts - `fonts.googleapis.com` e `fonts.gstatic.com`):**
   - **Estratégia:** `CacheFirst` com validade de 1 ano (`maxAgeSeconds: 60 * 60 * 24 * 365`) e limite de 30 entradas.
   - **Justificativa:** Tipografias `Plus Jakarta Sans` e `Cabinet Grotesk` são imutáveis após download e essenciais para a identidade visual do app.

3. **Chamadas de API do Backend (`/api/partidas/*`):**
   - **Estratégia:** `NetworkFirst` com timeout de rede de 3s e cache fallback.
   - **Justificativa:** Se houver internet, traz o dado mais recente do servidor Laravel. Se o sinal cair no campo, atende a leitura a partir da última resposta em cache.

---

## 4. Nuances de Plataforma e UX de Instalação

### Google Chrome & Android
- O navegador dispara o evento nativo `beforeinstallprompt` quando o PWA atende aos critérios (HTTPS, manifesto válido, Service Worker com fetch handler e ícones de 192px/512px).
- Capturamos este evento e armazenamos a referência em estado React, disparando `prompt.prompt()` quando o usuário clica em "Instalar Na Prancheta".

### Safari & iOS
- O Safari no iOS **não** dispara o evento `beforeinstallprompt`.
- A instalação em dispositivos Apple depende do usuário tocar no botão de Compartilhamento do Safari e selecionar "Adicionar à Tela de Início".
- **Mitigação UX:** Quando a aplicação for aberta no Safari iOS e não estiver em modo standalone (`window.navigator.standalone !== true`), o banner exibirá uma instrução clara e concisa com o ícone do Safari orientando o atleta a adicionar o app à tela inicial.

---

## 5. Referências e Padrões
- [Vite PWA Documentation](https://vite-pwa-org.netlify.app/)
- [W3C Web App Manifest Specification](https://www.w3.org/TR/appmanifest/)
- [Google Web.dev: Progressive Web Apps](https://web.dev/explore/progressive-web-apps)
- [MDN: Making PWAs work offline with Service Workers](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)
