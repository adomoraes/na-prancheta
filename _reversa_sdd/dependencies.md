# Dependências do Sistema — Na Prancheta

> Gerado pelo **Reversa Scout** em 18/09/2026  
> Origem: `package.json`

---

## 1. Visão Geral

- **Gerenciador de Pacotes**: `npm`
- **Ambiente de Execução**: Node.js + Navegador Web (SPA)
- **Framework de Renderização**: React 19 (`react@^19.0.1`, `react-dom@^19.0.1`)
- **Compilador & Bundler**: Vite 6 (`vite@^6.2.3`), TypeScript 5.8 (`typescript@~5.8.2`)

---

## 2. Dependências de Produção (`dependencies`)

| Pacote | Versão Declarada | Finalidade / Papel no Sistema | Risco / Observação |
|---|---|---|---|
| `react` | `^19.0.1` | Biblioteca base de componentes e ciclo de vida de UI. | Versão 19 recente; novos hooks e renderizador assíncrono. |
| `react-dom` | `^19.0.1` | Renderizador web do React no nó `#root`. | Alinhado com `react@19.0.1`. |
| `vite` | `^6.2.3` | Servidor de desenvolvimento e empacotador de produção. | Declarado em `dependencies` e `devDependencies`. |
| `@tailwindcss/vite` | `^4.1.14` | Integração oficial de compilação do Tailwind CSS v4 para Vite. | Tailwind v4 dispensa `tailwind.config.js` via `@import "tailwindcss";`. |
| `@vitejs/plugin-react` | `^5.0.4` | Suporte a JSX/TSX e Fast Refresh no Vite. | Essencial para o pipeline React. |
| `lucide-react` | `^0.546.0` | Biblioteca de ícones SVG moderna utilizada em todos os componentes. | Ícones limpos e responsivos para cards esportivos e timelines. |
| `motion` | `^12.23.24` | Biblioteca moderna de animações e microinterações fluidas (Framer Motion). | Melhora a transição de status do vestiário e cards. |
| `@google/genai` | `^2.4.0` | SDK oficial da Google para integração com a API Gemini. | Utilizado para recursos generativos / inteligência artificial. |
| `express` | `^4.21.2` | Servidor HTTP Node.js para eventuais rotas de API ou entrega estática em container. | Presente nas dependências, pronto para arquiteturas com backend integrado. |
| `dotenv` | `^17.2.3` | Carregamento de variáveis de ambiente a partir do arquivo `.env`. | Suporte a credenciais em runtime local e servidores. |

---

## 3. Dependências de Desenvolvimento (`devDependencies`)

| Pacote | Versão Declarada | Finalidade |
|---|---|---|
| `typescript` | `~5.8.2` | Compilador TypeScript e verificação de tipos estáticos (`tsc --noEmit`). |
| `@types/node` | `^22.14.0` | Tipagens para APIs nativas do Node.js (`path`, `process`, etc.). |
| `@types/express` | `^4.17.21` | Tipagens estáticas do Express para TypeScript. |
| `tailwindcss` | `^4.1.14` | Engine de utilitários CSS do Tailwind CSS v4. |
| `autoprefixer` | `^10.4.21` | Adição de vendor prefixes em regras CSS para compatibilidade de navegadores. |
| `esbuild` | `^0.25.0` | Empacotador e transformador JS/TS ultrarrápido utilizado pelo Vite. |
| `tsx` | `^4.21.0` | Executor TypeScript para scripts Node.js em desenvolvimento. |

---

## 4. Scripts Definidos em `package.json`

| Comando | Script Executado | Descrição |
|---|---|---|
| `npm run dev` | `vite --port=3000 --host=0.0.0.0` | Inicia o servidor local de desenvolvimento na porta 3000 escutando todas as interfaces. |
| `npm run build` | `vite build` | Compila os arquivos TypeScript e bundles otimizados para produção na pasta `dist/`. |
| `npm run preview` | `vite preview` | Executa servidor local para inspecionar o bundle de produção gerado em `dist/`. |
| `npm run clean` | `rm -rf dist server.js` | Remove artefatos de compilações anteriores. |
| `npm run lint` | `tsc --noEmit` | Valida a integridade dos tipos em todo o código sem emitir arquivos `.js`. |

---

## 5. Análise de Dependências Críticas e Segurança

1. **Persistência Externa / Banco de Dados**:
   - Nenhuma biblioteca de conexão a banco de dados relacional (PostgreSQL, MySQL, SQLite) ou ORM (Prisma, TypeORM, Drizzle) está instalada no momento. Toda a persistência é baseada em `localStorage` e dados em memória.
2. **Framework de Testes**:
   - Nenhuma ferramenta de teste unitário ou de integração está instalada (Jest, Vitest, Testing Library). Recomenda-se adicionar `vitest` e `@testing-library/react` em fases posteriores.
3. **Versão do Tailwind**:
   - Projeto utiliza a versão 4.x do Tailwind CSS (`@tailwindcss/vite`), dispensando arquivos legados de configuração como `tailwind.config.js`.
