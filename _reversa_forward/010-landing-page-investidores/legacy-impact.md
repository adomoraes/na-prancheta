# Impacto no Legado: Feature 010 - Landing Page Comercial para Investidores

> Data: 2026-09-21  
> Feature ID: `010-landing-page-investidores`  
> Política de edição: `allowLegacyEdits: true` com `allowedPaths: []` (liberação irrestrita pelo usuário)  

---

## 1. Arquivos Afetados

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|---|---|---|---|---|
| `src/App.tsx` | SPA Root | regra-alterada | LOW | Introdução do estado `viewMode: 'landing' \| 'app'` para servir a Landing Page na raiz `/` com transição fluida para o app. |
| `src/components/Header.tsx` | App Header | regra-alterada | LOW | Inclusão de botão "Vitrine Comercial" para permitir retorno rápido à apresentação de investidores. |
| `src/components/landing/*` | Landing Module | componente-novo | LOW | Criação dos 10 componentes dedicados da vitrine comercial (Navbar, Hero, Showcase, Tese, ROI, Prova Social, Modal e Footer). |
| `src/types.ts` | Shared Contracts | componente-novo | LOW | Adição dos tipos `InvestorLeadDTO`, `TipoInvestidor` e `InvestorLeadResponse`. |
| `src/services/api.ts` | API Client | contrato-novo | LOW | Adição do método `api.leads.submitInvestorLead` e `api.leads.listInvestorLeads`. |
| `backend/database/migrations/*_create_investor_leads_table.php` | Migrations | delta-de-dados | LOW | Criação isolada da tabela `investor_leads`. |
| `backend/app/Models/InvestorLead.php` | Eloquent Models | componente-novo | LOW | Modelo Eloquent para a tabela `investor_leads`. |
| `backend/app/Http/Controllers/Api/InvestorLeadController.php` | Controllers | componente-novo | LOW | Controlador para cadastro público de leads com rate limit e consulta admin. |
| `backend/routes/api.php` | API Routing | contrato-novo | LOW | Registro de `POST /api/leads/investor` e `GET /api/admin/leads/investor`. |
| `backend/tests/Feature/InvestorLeadTest.php` | Test Suite | componente-novo | LOW | Suíte de testes automatizados com 5 testes e 41 asserções. |
| `README.md` | Documentação | componente-novo | LOW | Atualização da documentação principal com a seção 10. |

---

## 2. Diff Conceitual por Componente

### 2.1 Ponto de Entrada da SPA (`src/App.tsx`)
A aplicação agora inicia por padrão no modo de vitrine comercial (`viewMode: 'landing'`), proporcionando impacto imediato para visitantes, investidores e parceiros institucionais. O acesso à aplicação operacional de dia de jogo é feito em 1 toque ("Acessar Plataforma / Demo"), sem recarga de página e preservando todos os estados e sessões ativas no `localStorage`.

### 2.2 Backend & Banco de Dados (`investor_leads`)
O backend recebeu uma entidade nova e totalmente desacoplada das entidades do jogo (`investor_leads`). Nenhuma das 18 migrações anteriores ou tabelas operacionais foi alterada ou impactada.

---

## 3. Regras de Domínio Preservadas (🟢)

As regras de negócio extraídas no `_reversa_sdd/domain.md` permanecem 100% ativas e intactas:
- **RN-01 (Confirmação Prévia Obrigatória):** Preservada.
- **RN-02 (Corte Inegociável por Atraso - T-35):** Preservada e agora destacada visualmente como diferencial na Landing Page.
- **RN-03 (Limite Estrito de 11 Titulares):** Preservada.
- **RN-04 (Ergonomia Mobile de 1 Toque):** Preservada.
- **RN-05 (Base de Cobrança Restrita a Confirmados):** Preservada.
- **RN-06 (Meta de Arbitragem Fixa de R$ 300,00):** Preservada.
- **RN-07 (Transparência Ativa via WhatsApp):** Preservada.
- **RN-08 (Obrigatoriedade de Desvirar Fardamentos):** Preservada.
- **RN-09 (Trava Booleana da Resenha Social):** Preservada e evidenciada como "Cultural Moat" para investidores.
- **RN-10 (Integridade de Contadores Numéricos):** Preservada.
- **RN-11 (Unicidade do MVP da Partida):** Preservada.

---

## 4. Regras de Domínio Modificadas / Novas

- **RN-01 da Feature (Landing Page na Raiz e Navegação Bi-direcional):** A porta de entrada primária da URL raiz (`/`) exibe a vitrine comercial, com alternância imediata para a área de jogo (`/app`).
- **RN-03 da Feature (Lead Capture Híbrido):** Submissão persistida no banco relacional via endpoint seguro combinada com abertura instantânea de conversa estruturada no WhatsApp dos fundadores.
