# Delta no Modelo de Dados: Feature 012 - Whitelabel com Onboarding, Planos e Pagamentos

> Data: `2026-10-06`  
> Referência no legado: `_reversa_sdd/erd-complete.md` e `_reversa_sdd/data-dictionary.md`  
> Confidência: 🟢 CONFIRMADO  

---

## 1. Visão Geral das Alterações

A feature consolida a agremiação (`times`) como o tenant central da aplicação, estendendo seus atributos de identidade de marca e ciclo de vida de assinatura, e introduz quatro novas entidades dedicadas a planos, faturamento e auditoria de personificação.

---

## 2. Alterações em Tabelas Existentes

### 2.1 Tabela `times` (Extensão de Atributos)
Adição de colunas para branding visual, plano contratado e período de avaliação:

```sql
ALTER TABLE times ADD COLUMN slug VARCHAR(100) NULL;
ALTER TABLE times ADD COLUMN sigla VARCHAR(10) NULL;
ALTER TABLE times ADD COLUMN cor_primaria VARCHAR(7) DEFAULT '#10b981' NOT NULL;
ALTER TABLE times ADD COLUMN cor_secundaria VARCHAR(7) DEFAULT '#0f172a' NOT NULL;
ALTER TABLE times ADD COLUMN modalidade VARCHAR(50) DEFAULT 'futebol_campo' NOT NULL;
ALTER TABLE times ADD COLUMN status VARCHAR(30) DEFAULT 'trial' NOT NULL; -- 'trial', 'ativo', 'carencia', 'suspenso', 'cancelado'
ALTER TABLE times ADD COLUMN trial_ends_at TIMESTAMP NULL;
ALTER TABLE times ADD COLUMN plano_id BIGINT NULL;

CREATE UNIQUE INDEX idx_times_slug ON times(slug);
CREATE INDEX idx_times_status ON times(status);
```

### 2.2 Tabela `users` (Vínculo com Agremiação)
Garantia de chave estrangeira explícita com o clube do usuário e perfil administrativo de gestor:

```sql
ALTER TABLE users ADD COLUMN time_id CHAR(36) NULL;
CREATE INDEX idx_users_time_id ON users(time_id);
-- Novo valor aceito no enum/varchar de role: 'gestor' (Administrador da Agremiação)
```

---

## 3. Novas Tabelas

### 3.1 Tabela `planos`
Catálogo de planos de assinatura disponíveis na plataforma:

```sql
CREATE TABLE planos (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,       -- 'amador', 'campeao', 'liga'
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NULL,
    preco_mensal_centavos INT NOT NULL,
    preco_anual_centavos INT NOT NULL,
    max_elencos INT DEFAULT 1 NOT NULL,
    max_atletas INT DEFAULT 25 NOT NULL,
    recursos JSON NULL,
    ativo BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### 3.2 Tabela `assinaturas`
Relacionamento contratual contínuo entre o clube e o plano:

```sql
CREATE TABLE assinaturas (
    id CHAR(36) PRIMARY KEY,                -- UUID
    time_id CHAR(36) NOT NULL,
    plano_id BIGINT NOT NULL,
    ciclo VARCHAR(20) DEFAULT 'mensal' NOT NULL, -- 'mensal', 'anual'
    status VARCHAR(30) DEFAULT 'ativa' NOT NULL, -- 'ativa', 'carencia', 'suspensa', 'cancelada'
    valor_centavos INT NOT NULL,
    forma_pagamento_preferida VARCHAR(30) DEFAULT 'pix' NOT NULL, -- 'pix', 'cartao_credito'
    data_inicio TIMESTAMP NOT NULL,
    data_proxima_cobranca TIMESTAMP NOT NULL,
    data_cancelamento TIMESTAMP NULL,
    provedor_assinatura_id VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_assinaturas_time FOREIGN KEY (time_id) REFERENCES times(id) ON DELETE CASCADE,
    CONSTRAINT fk_assinaturas_plano FOREIGN KEY (plano_id) REFERENCES planos(id)
);

CREATE INDEX idx_assinaturas_time_id ON assinaturas(time_id);
CREATE INDEX idx_assinaturas_status ON assinaturas(status);
```

### 3.3 Tabela `faturas_cobranca`
Faturas individuais emitidas para liquidação de assinaturas:

```sql
CREATE TABLE faturas_cobranca (
    id CHAR(36) PRIMARY KEY,                -- UUID
    assinatura_id CHAR(36) NULL,
    time_id CHAR(36) NOT NULL,
    valor_centavos INT NOT NULL,
    status VARCHAR(30) DEFAULT 'pendente' NOT NULL, -- 'pendente', 'paga', 'cancelada', 'estornada'
    metodo_pagamento VARCHAR(30) NOT NULL,          -- 'pix', 'cartao_credito'
    pix_qrcode TEXT NULL,
    pix_copia_cola TEXT NULL,
    data_vencimento TIMESTAMP NOT NULL,
    data_pagamento TIMESTAMP NULL,
    transacao_provedor_id VARCHAR(255) NULL,
    webhook_payload JSON NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_faturas_time FOREIGN KEY (time_id) REFERENCES times(id) ON DELETE CASCADE,
    CONSTRAINT fk_faturas_assinatura FOREIGN KEY (assinatura_id) REFERENCES assinaturas(id) ON DELETE SET NULL
);

CREATE INDEX idx_faturas_time_id ON faturas_cobranca(time_id);
CREATE INDEX idx_faturas_status ON faturas_cobranca(status);
CREATE INDEX idx_faturas_transacao_provedor ON faturas_cobranca(transacao_provedor_id);
```

### 3.4 Tabela `webhook_events` (Controle de Idempotência)
Armazena identificadores de eventos recebidos do provedor financeiro:

```sql
CREATE TABLE webhook_events (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL UNIQUE,
    provedor VARCHAR(50) NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL,
    processado BOOLEAN DEFAULT TRUE NOT NULL,
    payload JSON NOT NULL,
    created_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX idx_webhook_events_event_id ON webhook_events(event_id);
```

### 3.5 Tabela `impersonation_logs` (Trilha de Auditoria ROOT)
Registro de sessões temporárias de personificação realizadas por superusuários:

```sql
CREATE TABLE impersonation_logs (
    id BIGSERIAL PRIMARY KEY,
    root_user_id BIGINT NOT NULL,
    time_id CHAR(36) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'start', 'stop'
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP NULL,
    CONSTRAINT fk_impersonation_user FOREIGN KEY (root_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_impersonation_time FOREIGN KEY (time_id) REFERENCES times(id) ON DELETE CASCADE
);
```

---

## 4. Modelos Eloquent Laravel

1. `App\Models\Time`: Atualizado com atributos de branding e relacionamento com `assinaturas` e `faturas`.
2. `App\Models\Plano`: Novo modelo para o catálogo de planos de assinatura.
3. `App\Models\Assinatura`: Novo modelo para o controle do ciclo de faturamento recorrente.
4. `App\Models\FaturaCobranca`: Novo modelo para conciliação bancária das faturas.
5. `App\Models\WebhookEvent`: Novo modelo para idempotência transacional.
6. `App\Models\ImpersonationLog`: Novo modelo para logs de suporte e auditoria.

---

## 5. Estratégia de Migração de Dados Legados

- **Idempotência:** A migração adiciona as novas colunas à tabela `times` mantendo o registro existente do clube principal (ex.: "Na Prancheta F.C.") com status `ativo` e plano `Plano Liga` garantido, preservando 100% dos dados históricos sem interrupção operacional.
