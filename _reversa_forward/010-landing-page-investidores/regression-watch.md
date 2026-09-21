# Regression Watch: Feature 010 - Landing Page Comercial para Investidores

> Feature: `010-landing-page-investidores`  
> Data de geração: 2026-09-21  

---

## 1. Itens em Vigília

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|---|---|---|---|---|
| **W001** | `src/App.tsx:viewMode` | A rota raiz (`/`) deve renderizar a Landing Page comercial por padrão sem exigir autenticação prévia. | presença | App operacional de jogo renderizado diretamente na primeira visita sem o modo landing. |
| **W002** | `src/components/Header.tsx` | O cabeçalho do app operacional deve manter botão visível para retorno à Landing Page Comercial. | presença | Botão "Vitrine Comercial" ausente no Header quando o app está aberto. |
| **W003** | `backend/routes/api.php` | O endpoint `POST /api/leads/investor` deve aceitar submissões públicas e aplicar rate limiting. | presença | Retorno 401 para requisições anônimas de captação de leads de investidores. |
| **W004** | `backend/app/Models/InvestorLead.php` | Registros de leads devem ser salvos com `origem: landing_page` e status inicial `novo`. | presença | Leads criados sem preenchimento correto dos campos de auditoria. |

---

## 2. Histórico de Re-extrações

<!-- Preenchido pelo Reversa em futuras execuções de re-extração. -->

---

## 3. Itens Arquivados

<!-- Regras que foram superadas por features posteriores. -->
