# Topologia de Deployment e Infraestrutura — Na Prancheta

> Gerado pelo **Reversa Arquiteto** em 18/09/2026  
> Nível de Documentação: **Detalhado**  
> Escopo: Pipeline de compilação, variáveis de ambiente e execução em container / nuvem

---

## 1. Visão Geral do Pipeline de Build e Execução

O **Na Prancheta** foi configurado para ser compilado via **Vite 6** e servido como artefatos estáticos otimizados ou empacotado em container Node.js / Google Cloud Run (alinhado com as especificações do `metadata.json`).

```mermaid
graph LR
    Dev[Código TypeScript / React] -->|npm run build| ViteBundler[Compilador Vite + Tailwind v4]
    ViteBundler -->|Gera Artefatos| DistDir[Pasta dist/ (HTML, JS, CSS)]
    DistDir -->|Servido por| Server[Servidor Web Express / Static Web Server]
    Server -->|Hospedagem Nuvem| CloudRun[Google Cloud Run / Edge CDN]
    CloudRun -->|Acessado por| Users[Smartphones do Elenco e Comissão]
```

---

## 2. Variáveis de Ambiente e Configurações de Runtime

Conforme documentado em [`.env.example`](file:///home/adomoraes/projects/na-prancheta/.env.example) e [`vite.config.ts`](file:///home/adomoraes/projects/na-prancheta/vite.config.ts):

| Variável de Ambiente | Obrigatoriedade | Propósito | Exemplo / Padrão |
|---|---|---|---|
| `GEMINI_API_KEY` | Opcional | Chave de autorização da Google Gemini API para chamadas do SDK `@google/genai`. Injetada automaticamente pelo Google AI Studio / Cloud Run Secrets. | `"AIzaSy..."` |
| `APP_URL` | Opcional | URL base onde a aplicação está hospedada (usada para self-referential links, deep links e callbacks). | `"https://na-prancheta-xxxx.run.app"` |
| `DISABLE_HMR` | Desenvolvimento | Flag para desativar o Hot Module Replacement e o file watcher durante edições concorrentes de agentes. | `"true"` ou `"false"` |
| `PORT` | Runtime | Porta de escuta do servidor HTTP. Configurada no script `npm run dev` como 3000. | `3000` |

---

## 3. Scripts Operacionais (`package.json`)

- **Desenvolvimento Local**:
  ```bash
  npm run dev # vite --port=3000 --host=0.0.0.0
  ```
- **Compilação de Produção**:
  ```bash
  npm run build # vite build -> pasta dist/
  ```
- **Validação Estática de Tipos (CI / Pré-Commit)**:
  ```bash
  npm run lint # tsc --noEmit
  ```
- **Visualização Local do Bundle de Produção**:
  ```bash
  npm run preview # vite preview
  ```
- **Limpeza de Artefatos Anteriores**:
  ```bash
  npm run clean # rm -rf dist server.js
  ```
