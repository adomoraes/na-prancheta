---
schemaVersion: 1
generatedAt: 2026-09-18T15:50:00-03:00
reversa:
  version: "1.3.3"
kind: target_data_model
producedBy: designer
hash: "sha256:a834fb2a494e3810c9ef7d771720556c8321491cb0d0ea518e399cbb51bfc41a"
---

# Target Data Model — Na Prancheta

> Modelo de dados relacional físico em **PostgreSQL 16** para o Na Prancheta.
> Especifica DDL de tabelas, tipos de dados, chaves primárias, chaves estrangeiras com ações referenciais, constraints `UNIQUE` e `CHECK`, e índices de alta performance.

---

## Visão geral
- **Banco de Dados Principal**: PostgreSQL 16 (OLTP)
- **Convenção de Nomes**: Snake_case em português para tabelas e colunas, alinhado ao glossário ubíquo de domínio.
- **Tipos de Identificadores**: Chaves primárias UUIDv4 (`UUID DEFAULT gen_random_uuid()`) para entidades de negócio (atletas, partidas, lançamentos), garantindo unicidade global e geração segura no client/backend sem risco de colisão.
- **Integridade**: Constraints estritas de banco (`UNIQUE`, `CHECK`, Foreign Keys com `ON DELETE RESTRICT` para entidades financeiras e `CASCADE` para dependentes diretos).

---

## Entidades de Dados e Mapeamento

| Entidade | Tabela | Aggregate Dono | PK | Bounded Context |
|---|---|---|---|---|
| **Usuário do Sistema** | `users` | AGG-Atleta | UUID | BC-01: Elenco |
| **Time / Agremiação** | `times` | AGG-Atleta | UUID | BC-01: Elenco |
| **Atleta do Elenco** | `atletas` | AGG-Atleta | UUID | BC-01: Elenco |
| **Partida / Confronto** | `partidas` | AGG-Partida | UUID | BC-02: Partidas |
| **Confirmação de Presença** | `confirmacoes_presenca` | AGG-Partida | UUID | BC-02: Partidas |
| **Posição Tática no Campo**| `posicoes_campo` | AGG-Partida | INT | BC-03: Tática |
| **Titular da Partida** | `partida_titulares` | AGG-Partida | UUID | BC-03: Tática |
| **Lançamento da Vaquinha** | `vaquinha_lancamentos` | AGG-Vaquinha | UUID | BC-04: Financeiro |
| **Movimentação do Caixa** | `caixa_movimentacoes` | AGG-Vaquinha | UUID | BC-04: Financeiro |
| **Scout Estatístico** | `scouts_partida` | AGG-Scout | UUID | BC-05: Scout |
| **Item de Patrimônio** | `itens_almoxarifado` | AGG-Almoxarifado | UUID | BC-06: Patrimônio |
| **Conferência de Malas** | `conferencias_malas` | AGG-Almoxarifado | UUID | BC-06: Patrimônio |

---

## Schema DDL em PostgreSQL 16

```sql
-- Extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABELA DE USUÁRIOS (Laravel Sanctum Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'atleta' CHECK (role IN ('admin', 'comissao', 'tesoureiro', 'atleta')),
    remember_token VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABELA DE TIMES
CREATE TABLE times (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    escudo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DE ATLETAS (Com garantia de número de camisa único por time)
CREATE TABLE atletas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time_id UUID NOT NULL REFERENCES times(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    nome VARCHAR(100) NOT NULL,
    apelido VARCHAR(50) NOT NULL,
    numero_camisa INT NOT NULL CHECK (numero_camisa BETWEEN 1 AND 99),
    posicao_principal VARCHAR(10) NOT NULL CHECK (posicao_principal IN ('GOL', 'LAD', 'ZAG', 'LAE', 'VOL', 'MC', 'MEI', 'PTE', 'PTD', 'CA')),
    posicao_secundaria VARCHAR(10) CHECK (posicao_secundaria IN ('GOL', 'LAD', 'ZAG', 'LAE', 'VOL', 'MC', 'MEI', 'PTE', 'PTD', 'CA')),
    tipo_vinculo VARCHAR(20) NOT NULL DEFAULT 'mensalista' CHECK (tipo_vinculo IN ('mensalista', 'convidado')),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_atletas_time_camisa UNIQUE (time_id, numero_camisa)
);

-- 4. TABELA DE PARTIDAS
CREATE TABLE partidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time_id UUID NOT NULL REFERENCES times(id) ON DELETE RESTRICT,
    adversario VARCHAR(100) NOT NULL,
    data_partida DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_chegada_t70 TIME NOT NULL,
    horario_prelecao_t35 TIME NOT NULL,
    local_nome VARCHAR(150) NOT NULL,
    local_endereco TEXT NOT NULL,
    local_maps_url TEXT,
    cor_uniforme VARCHAR(50) NOT NULL DEFAULT 'Branco/Verde',
    limite_confirmados INT NOT NULL DEFAULT 16,
    meta_arrecadacao_centavos INT NOT NULL DEFAULT 30000, -- R$ 300,00
    valor_cota_centavos INT NOT NULL DEFAULT 2500,        -- R$ 25,00
    chave_pix_cobranca VARCHAR(150),
    status VARCHAR(30) NOT NULL DEFAULT 'agendada' CHECK (status IN ('agendada', 'pre_jogo', 'em_andamento', 'encerrada', 'cancelada')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABELA DE CONFIRMAÇÕES DE PRESENÇA (Com lista de espera)
CREATE TABLE confirmacoes_presenca (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partida_id UUID NOT NULL REFERENCES partidas(id) ON DELETE CASCADE,
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'duvida' CHECK (status IN ('confirmado', 'ausente', 'duvida', 'lista_espera')),
    ordem_fila_espera INT,
    chegou_vestiario_em TIMESTAMPTZ,
    atrasado_prelecao_t35 BOOLEAN NOT NULL DEFAULT FALSE,
    respondido_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_presenca_partida_atleta UNIQUE (partida_id, atleta_id)
);

-- 6. TABELA DE POSIÇÕES NO CAMPO TÁTICO
CREATE TABLE posicoes_campo (
    id INT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    sigla VARCHAR(10) NOT NULL,
    coord_x_percent INT NOT NULL,
    coord_y_percent INT NOT NULL
);

-- 7. TABELA DE TITULARES DA PARTIDA (Máximo 11 por time, 1 por posição)
CREATE TABLE partida_titulares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partida_id UUID NOT NULL REFERENCES partidas(id) ON DELETE CASCADE,
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE RESTRICT,
    posicao_campo_id INT NOT NULL REFERENCES posicoes_campo(id) ON DELETE RESTRICT,
    escalado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_titular_partida_atleta UNIQUE (partida_id, atleta_id),
    CONSTRAINT uk_titular_partida_posicao UNIQUE (partida_id, posicao_campo_id)
);

-- 8. TABELA DE LANÇAMENTOS DA VAQUINHA (Financeiro com auditoria)
CREATE TABLE vaquinha_lancamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partida_id UUID NOT NULL REFERENCES partidas(id) ON DELETE CASCADE,
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE RESTRICT,
    valor_devido_centavos INT NOT NULL DEFAULT 2500,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago')),
    pago_em TIMESTAMPTZ,
    tesoureiro_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metodo_pagamento VARCHAR(30) DEFAULT 'pix' CHECK (metodo_pagamento IN ('pix', 'dinheiro', 'outro')),
    comprovante_ref VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_vaquinha_partida_atleta UNIQUE (partida_id, atleta_id)
);

-- 9. TABELA DE MOVIMENTAÇÃO DE CAIXA GERAL DA EQUIPE
CREATE TABLE caixa_movimentacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time_id UUID NOT NULL REFERENCES times(id) ON DELETE RESTRICT,
    partida_id UUID REFERENCES partidas(id) ON DELETE SET NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('credito_excedente_partida', 'mensalidade', 'debito_material', 'debito_taxa_campo')),
    valor_centavos INT NOT NULL,
    descricao TEXT NOT NULL,
    responsavel_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    data_movimentacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. TABELA DE SCOUT DA PARTIDA (Com exclusividade atômica de MVP)
CREATE TABLE scouts_partida (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partida_id UUID NOT NULL REFERENCES partidas(id) ON DELETE CASCADE,
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE RESTRICT,
    gols INT NOT NULL DEFAULT 0 CHECK (gols >= 0),
    assistencias INT NOT NULL DEFAULT 0 CHECK (assistencias >= 0),
    cartoes_amarelos INT NOT NULL DEFAULT 0 CHECK (cartoes_amarelos BETWEEN 0 AND 2),
    cartoes_vermelhos INT NOT NULL DEFAULT 0 CHECK (cartoes_vermelhos BETWEEN 0 AND 1),
    gols_sofridos_goleiro INT NOT NULL DEFAULT 0 CHECK (gols_sofridos_goleiro >= 0),
    minutos_jogados INT NOT NULL DEFAULT 0 CHECK (minutos_jogados >= 0),
    foi_mvp BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_scout_partida_atleta UNIQUE (partida_id, atleta_id)
);

-- 11. TABELA DE ITENS DO ALMOXARIFADO
CREATE TABLE itens_almoxarifado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time_id UUID NOT NULL REFERENCES times(id) ON DELETE RESTRICT,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('uniforme', 'bola', 'treino_cones', 'farmacia')),
    quantidade_total INT NOT NULL CHECK (quantidade_total > 0),
    estado_conservacao VARCHAR(30) NOT NULL DEFAULT 'bom' CHECK (estado_conservacao IN ('excelente', 'bom', 'desgastado', 'danificado')),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. TABELA DE CONFERÊNCIA DE MALAS & TRAVA DA RESENHA
CREATE TABLE conferencias_malas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partida_id UUID NOT NULL UNIQUE REFERENCES partidas(id) ON DELETE CASCADE,
    custodiante_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    camisas_recolhidas INT NOT NULL DEFAULT 0 CHECK (camisas_recolhidas >= 0),
    todas_camisas_desviradas BOOLEAN NOT NULL DEFAULT FALSE,
    bolas_recolhidas INT NOT NULL DEFAULT 0 CHECK (bolas_recolhidas >= 0),
    kit_cones_recolhido BOOLEAN NOT NULL DEFAULT FALSE,
    mala_trancada_no_carro BOOLEAN NOT NULL DEFAULT FALSE,
    resenha_liberada BOOLEAN NOT NULL DEFAULT FALSE,
    liberada_em TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Índices de Performance

```sql
-- Índices para consultas operacionais frequentes em dia de jogo
CREATE INDEX idx_atletas_time_ativo ON atletas(time_id, ativo);
CREATE INDEX idx_confirmacoes_partida ON confirmacoes_presenca(partida_id, status);
CREATE INDEX idx_titulares_partida ON partida_titulares(partida_id);
CREATE INDEX idx_vaquinha_partida_status ON vaquinha_lancamentos(partida_id, status);
CREATE INDEX idx_scout_partida_mvp ON scouts_partida(partida_id) WHERE foi_mvp = TRUE;
CREATE INDEX idx_partidas_time_data ON partidas(time_id, data_partida DESC);
```

---

## Rastreabilidade: Legado → Schema Alvo

| Tabela Nova | Entidade no Legado (`src/data/initialData.ts`) | Transformações Aplicadas |
|---|---|---|
| `atletas` | `initialAtletas` | Adicionada constraint `UNIQUE(time_id, numero_camisa)`, normalizado enum de posição e adicionada FK `user_id`. |
| `partidas` | `initialMatch` | Extraída de objeto embutido; adicionadas colunas financeiras (`meta_arrecadacao_centavos`, `valor_cota_centavos`) e chave PIX configurável. |
| `confirmacoes_presenca` | `initialConfirmacoes` | Adicionado status `lista_espera`, boolean `atrasado_prelecao_t35` e timestamp `chegou_vestiario_em`. |
| `partida_titulares` | Array `titularesIds` em `PranchetaTecnica.tsx` | Transformado de array plano em memória para tabela relacional auditada vinculada a `posicoes_campo`. |
| `vaquinha_lancamentos` | `initialColetas` | Adicionada auditoria de quem deu baixa (`tesoureiro_id`), método de quitação e histórico `pago_em`. |
| `caixa_movimentacoes` | Não existia (Decisão Humana A) | Nova tabela para persistir o saldo acumulado da vaquinha para uso pelo time. |
| `scouts_partida` | `initialScouts` | Adicionados campos de cartões vermelhos e gols sofridos, com constraint check `gols >= 0`. |
| `conferencias_malas` | Estado em `AlmoxarifadoView.tsx` | Persistência relacional da Tríplice Conferência e da Trava da Resenha. |
