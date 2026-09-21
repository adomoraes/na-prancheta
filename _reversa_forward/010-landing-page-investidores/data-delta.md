# Delta no Modelo de Dados: Feature 010 - Landing Page Investidores

> Data: `2026-09-21`  
> Referência no legado: `_reversa_sdd/erd-complete.md`  
> Confidência: 🟢 CONFIRMADO  

---

## 1. Visão Geral das Alterações

A feature introduz uma nova entidade de captação comercial (`investor_leads`) desacoplada do núcleo operacional do vestiário. As tabelas operacionais existentes (`eventos`, `atletas`, `escalacoes`, `scouts`, `taxas_jogo`, `itens_patrimonio`, `users`) permanecem **100% intocadas**.

---

## 2. Nova Tabela: `investor_leads`

### Schema DDL (PostgreSQL)

```sql
CREATE TABLE investor_leads (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(50) NOT NULL,
    tipo_investidor VARCHAR(50) NOT NULL, -- 'anjo', 'fundo_vc', 'arena_liga', 'outro'
    ticket_estimado VARCHAR(100) NULL,    -- 'ate_50k', '50k_200k', '200k_1m', 'acima_1m', 'parceria_comercial'
    mensagem TEXT NULL,
    origem VARCHAR(100) DEFAULT 'landing_page' NOT NULL,
    ip_address VARCHAR(45) NULL,
    status VARCHAR(30) DEFAULT 'novo' NOT NULL, -- 'novo', 'em_contato', 'reuniao_agendada', 'descartado'
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

CREATE INDEX idx_investor_leads_email ON investor_leads(email);
CREATE INDEX idx_investor_leads_status ON investor_leads(status);
CREATE INDEX idx_investor_leads_created_at ON investor_leads(created_at);
```

---

## 3. Modelo Eloquent: `InvestorLead.php`

- **Caminho:** `backend/app/Models/InvestorLead.php`
- **Atributos preenchíveis (`$fillable`):**
  - `nome`, `email`, `telefone`, `tipo_investidor`, `ticket_estimado`, `mensagem`, `origem`, `ip_address`, `status`.
- **Casts:**
  - `created_at` => `datetime`
  - `updated_at` => `datetime`

---

## 4. Migrações Laravel

- **Arquivo:** `backend/database/migrations/2026_09_21_120000_create_investor_leads_table.php`
- **Rollback:** `Schema::dropIfExists('investor_leads');`
- **Impacto em dados legados:** **Nenhum**. Migração aditiva e idempotente.
