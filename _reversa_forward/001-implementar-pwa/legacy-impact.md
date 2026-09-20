# Impacto no Legado: Suporte a Progressive Web App (PWA)

> Identificador: `001-implementar-pwa`
> Data: `2026-09-20`
> Política de edição: `allowLegacyEdits: true` (liberação irrestrita conforme `.reversa/reversa-config.json`)
> Âncora do Legado: `_reversa_sdd/architecture.md` e `_reversa_sdd/domain.md`

---

## 1. Tabela de Arquivos Afetados

| Arquivo Afetado | Componente no Legado | Tipo de Impacto | Severidade | Justificativa |
|---|---|---|---|---|
| `package.json` | Infraestrutura & Bundling (`dependencies.md`) | componente-alterado | LOW | Adição das bibliotecas `vite-plugin-pwa` e `workbox-window`. |
| `vite.config.ts` | Arquitetura SPA & Bundling (`architecture.md#21`) | componente-alterado | MEDIUM | Injeção do plugin `VitePWA` com manifesto, pre-caching e runtime caching Workbox. |
| `index.html` | Superfície da Aplicação (`inventory.md#superfície`) | componente-alterado | LOW | Adição de meta tags PWA (`theme-color`, `apple-mobile-web-app-*`) e links de ícone. |
| `public/icon.svg` / `pwa-*.png` | Identidade Visual (`architecture.md#23`) | componente-novo | LOW | Criação de ícones oficiais nos tamanhos 192x192, 512x512, maskable e favicon. |
| `src/vite-env.d.ts` | Tipagens TypeScript | componente-alterado | LOW | Adição da referência de tipos `vite-plugin-pwa/client`. |
| `src/hooks/usePwa.ts` | Arquitetura Local-First (`architecture.md#22`) | componente-novo | MEDIUM | Hook para orquestrar instalabilidade, status de rede e ciclo de vida do Service Worker. |
| `src/components/PwaPrompt.tsx` | UI & Ergonomia Mobile (`domain.md#21`) | componente-novo | MEDIUM | Componentes visuais para toast de atualização, banner inferior e badge offline. |
| `src/components/Header.tsx` | Cabeçalho & Acesso aos Módulos | componente-alterado | LOW | Adição do botão discreto "Instalar" no cabeçalho quando instalável. |
| `src/App.tsx` | Estado Central & SPA (`architecture.md#21`) | componente-alterado | MEDIUM | Integração do `PwaPrompt` e repasse dos handlers ao `Header`. |
| `README.md` | Documentação do Projeto | componente-alterado | LOW | Seção descritiva de recursos PWA e comandos de validação. |

---

## 2. Diff Conceitual por Componente

### Arquitetura SPA e Bundling (Vite)
A arquitetura base SPA React 19 foi enriquecida com capacidades progressivas de Service Worker via Workbox. A aplicação continua operando como SPA em desenvolvimento (`npm run dev`), mas agora gera um manifesto W3C válido e scripts de precache em build de produção (`npm run build`), viabilizando acesso instantâneo independente da conexão de rede.

### Persistência e Resiliência Operacional
O princípio local-first de `_reversa_sdd/architecture.md#22` foi reforçado: o Service Worker cuida do cache dos assets de código e fontes Google (`fonts.googleapis.com` e `fonts.gstatic.com`), enquanto o estado das partidas, escalação e tesouraria permanece protegido no `localStorage` e hidratado via API Laravel quando houver rede.

---

## 3. Regras Preservadas (🟢)

Todas as regras de negócio essenciais extraídas em `_reversa_sdd/domain.md` permanecem 100% preservadas e intactas:

- **RN-01 (Confirmação Prévia Obrigatória):** Preservada.
- **RN-02 (Corte Inegociável por Atraso - T-35):** Preservada.
- **RN-03 (Limite Estrito de 11 Titulares):** Preservada.
- **RN-04 (Ergonomia de Resposta Mobile de 1 Toque):** Preservada e estendida para as ações de instalação e atualização.
- **RN-05 (Base de Cobrança Restrita a Confirmados):** Preservada.
- **RN-06 (Meta de Arbitragem Fixa R$ 300,00):** Preservada.
- **RN-07 (Transparência Ativa via WhatsApp):** Preservada.
- **RN-08 (Obrigatoriedade de Desvirar Fardamentos):** Preservada.
- **RN-09 (Trava Booleana da Resenha Social):** Preservada.
- **RN-10 (Integridade dos Contadores Numéricos):** Preservada.
- **RN-11 (Unicidade do MVP da Partida):** Preservada.

---

## 4. Regras Modificadas ou Novas

- **RN-01PWA (Instalação Autônoma na Tela Inicial) [NOVA]:** A aplicação suporta instalação autônoma no Android, iOS e Desktop via Web App Manifest.
- **RN-02PWA (Resiliência Offline no Dia do Jogo) [NOVA]:** Operação contínua de visualização e edição local com feedback contextual quando sem sinal de internet.
- **RN-03PWA (Sinalização de Estado de Rede) [NOVA]:** Alerta visual discreto na barra superior informando modo offline e restabelecimento da conexão.
- **RN-04PWA (Ciclo de Atualização Interativa de Versão) [NOVA]:** Toast interativo permitindo que o usuário aplique a nova versão do Service Worker sem recarga involuntária da tela.
