# Impacto no Sistema Legado: CRUD de Adversários

> Feature: `007-crud-adversarios`  
> Data: `2026-09-21`  
> Avaliação: Risco Baixo / 100% Retrocompatível

---

## 1. Superfície de Risco e Compatibilidade

### 1.1 Tabela `partidas`
- **Adição de coluna:** `adversario_id` (UUID, nullable, foreign key para `adversarios.id` com `nullOnDelete`).
- **Coluna existente mantida:** `partidas.adversario` (VARCHAR(120), NOT NULL) permanece intacta e continua sendo populada em todas as requisições de criação e atualização.
- **Retrocompatibilidade com chamadas antigas:** Scripts e endpoints legados que enviarem apenas `adversario` continuam funcionando normalmente, com `adversario_id` permanecendo `NULL`.

### 1.2 Model `Partida.php`
- O relacionamento foi batizado como `adversarioRel(): BelongsTo` para evitar conflito com o atributo string nativo `$partida->adversario`.
- O `$fillable` agora contempla `adversario_id` e `local_nome`.

### 1.3 Seeder e Dados Históricos
- O `LegacyInitialDataSeeder.php` agora cria dois adversários canônicos padrão:
  - `União Alvinegra F.C.`
  - `Vila Real F.C.`
- A partida existente do seeder foi vinculada via `adversario_id` ao registro canônico do `União Alvinegra F.C.`.

## 2. Garantias Verificadas

- Nenhuma rota pública ou de atleta quebrou.
- Testes de paridade funcional (vestiário, vaquinha pix, almoxarifado, scout) continuam 100% verdes.
- 51 testes passando (233 asserções).
