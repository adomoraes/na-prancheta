# Investigação Técnica: CRUD de Adversários e Seleção no Formulário da Partida

> Feature: `007-crud-adversarios`  
> Data: `2026-09-21`  
> Contexto: Gestão esportiva, agendamento de partidas e cadastro de clubes rivais no Na Prancheta

---

## 1. Diagnóstico do Estado Inicial

Anteriormente, o sistema mantinha apenas o campo textual livre `partidas.adversario` (VARCHAR(120)), preenchido manualmente a cada agendamento de jogo.
Isso causava:
- Inconsistências de grafia em relatórios de confrontos (ex: "União Alvinegra", "Uniao Alvinegra FC", "U. Alvinegra");
- Falta de registro de dados cruciais do rival, como responsável, telefone para contato antes do jogo e cor do uniforme principal (risco de choque de uniformes);
- Impossibilidade de consultar estatísticas históricas unificadas contra um mesmo clube adversário.

## 2. Decisões de Arquitetura

1. **Persistência Relacional com Snapshot Imutável:**
   - Foi criada a tabela `adversarios` vinculada a `times` (`time_id`), garantindo isolamento multi-tenant.
   - A tabela `partidas` recebeu a coluna `adversario_id` como chave estrangeira anulável (`nullOnDelete`), mantendo a coluna `adversario` (string snapshot) intacta.
   - Dessa forma, se um adversário for renomeado ou desativado futuramente, o registro histórico de partidas passadas continua exibindo a denominação exata do dia do jogo.

2. **Segurança e Isolamento:**
   - Endpoints `/api/admin/adversarios/*` protegidos por autenticação Sanctum e autorização restrita à role `root`.
   - Endpoint `/api/adversarios` público/autenticado para leitura de adversários ativos do time.
   - Constraint de unicidade composta: `(time_id, nome)` garante que não haja clubes duplicados no mesmo elenco.

3. **Experiência do Usuário (UX):**
   - Na aba "Partidas & Agenda" do painel do gestor, ao selecionar um adversário pré-cadastrado no `<select>`, o campo de texto `adversario` é preenchido automaticamente, associando simultaneamente o `adversario_id`.
   - Na aba dedicada "Adversários & Rivais", cards modernos exibem distintivo/escudo, responsável, telefone com link direto, cor do uniforme e histórico de partidas vinculadas.

## 3. Arquivos Envolvidos

- `backend/database/migrations/2026_09_21_300000_create_adversarios_table_and_add_adversario_id_to_partidas.php`
- `backend/app/Models/Adversario.php`
- `backend/app/Models/Partida.php`
- `backend/app/Http/Controllers/Api/AdminController.php`
- `backend/app/Http/Controllers/Api/AdversarioController.php`
- `backend/routes/api.php`
- `backend/database/seeders/LegacyInitialDataSeeder.php`
- `backend/tests/Feature/AdversarioCrudTest.php`
- `src/types.ts`
- `src/services/api.ts`
- `src/components/admin/AdminDashboard.tsx`
