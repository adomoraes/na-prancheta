# Delta de Modelo de Dados: Suporte a PWA

> Identificador: `001-implementar-pwa`
> Data: `2026-09-20`
> Requirements: `_reversa_forward/001-implementar-pwa/requirements.md`

## 1. Visão Geral

A implementação de PWA opera predominantemente na camada de aplicação e navegador do cliente. Não há necessidade de alterações estruturais, novas colunas ou migrações no banco de dados relacional PostgreSQL do backend Laravel.

---

## 2. Delta de Persistência no Cliente

### 2.1 Novas Chaves no `window.localStorage`

| Chave | Tipo | Descrição e Comportamento | Validade / Expiração |
|---|---|---|---|
| `na_prancheta_pwa_install_dismissed` | `string` (Timestamp ISO ou ms) | Registra a data/hora em que o usuário fechou o banner inferior de instalação. Evita que o banner ressurja a cada recarga de página (política de cooldown de 7 dias). | 7 dias |

---

## 3. Armazenamento em Cache (`window.caches` - Cache Storage API)

O Service Worker gerenciado pelo Workbox criará e manterá os seguintes namespaces de cache no dispositivo do atleta:

| Cache Name Pattern | Conteúdo Armazenado | Estratégia de Invalidação |
|---|---|---|
| `workbox-precache-v2-<url>` | Hash de arquivos compilados da aplicação (`index.html`, bundles `.js`, folhas `.css`, assets estáticos). | Automática a cada novo build com hash atualizado pelo Rollup/Vite. |
| `google-fonts-stylesheets` | CSS de fontes remotas do Google Fonts (`fonts.googleapis.com`). | `StaleWhileRevalidate` com expiração de 30 dias. |
| `google-fonts-webfonts` | Arquivos de fontes tipográficas WOFF2 (`fonts.gstatic.com`). | `CacheFirst` com expiração de 1 ano. |
| `api-partidas-cache` | Respostas JSON dos endpoints de leitura `/api/partidas/*`. | `NetworkFirst` com fallback em caso de ausência de rede (timeout 3s). |

---

## 4. Impacto em Entidades Existentes

- **Partidas, Elenco, Presença, Coleta, Almoxarifado, Scouts:** Nenhuma entidade tem seu schema modificado.
- A aplicação mantém integral compatibilidade retroativa com os payloads serializados em `localStorage` existentes no legado (`na_prancheta_current_match_v1` etc.).
