# Regression Watch: Suporte a Progressive Web App (PWA)

> Identificador: `001-implementar-pwa`
> Data: `2026-09-20`
> Feature: `_reversa_forward/001-implementar-pwa/`

---

## 1. Regras em Monitoramento de Regressão

| ID | Origem | Regra Esperada Após Mudança | Tipo de Verificação | Sinal de Violação |
|---|---|---|---|---|
| W001 | `requirements.md#4` (RN-01PWA) | Arquivo `dist/manifest.webmanifest` deve ser gerado no build com display `standalone` e conjunto de ícones válidos. | presença | Build do frontend concluído sem manifesto gerado ou com erros no validador do PWA. |
| W002 | `requirements.md#4` (RN-02PWA) | Service Worker (`dist/sw.js`) deve registrar precaching de assets locais e runtime caching de Google Fonts. | presença | Ausência de `sw.js` em `dist/` ou falha no carregamento offline em ambiente de teste. |
| W003 | `requirements.md#4` (RN-03PWA) | Componente `PwaPrompt` deve escutar eventos `online`/`offline` e exibir banner quando desconectado. | presença | Usuário sem internet não recebe feedback visual indicando modo offline. |
| W004 | `requirements.md#4` (RN-04PWA) | Atualização do Service Worker deve disparar toast interativo (`needRefresh`) em vez de recarga abrupta automática. | presença | `registerType` alterado para `autoUpdate` forçado no `vite.config.ts`. |

---

## 2. Histórico de Re-extrações

*(Esta seção será populada quando novas extrações do framework Reversa forem executadas sobre o código).*

---

## 3. Regras Arquivadas

*(Nenhuma regra arquivada nesta versão).*
