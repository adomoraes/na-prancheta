---
schemaVersion: 1
generatedAt: 2026-09-18T15:50:00-03:00
reversa:
  version: "1.3.3"
kind: data_migration_plan
producedBy: designer
hash: "sha256:24493ba63f299d1454e27d9e2dfcc744a2cb83a6de5a898904c670804b195fcd"
---

# Data Migration Plan — Na Prancheta

> Plano de migração e ingestão inicial de dados do legado para o backend **Laravel 11 + PostgreSQL 16**.
> Descreve o mapeamento, as transformações de normalização, o Seeder automatizado (`LegacyInitialDataSeeder`), a validação de integridade e o cutover de dados.

---

## Resumo
- **Volume Estimado**:
  - `atletas`: 16 registros iniciais do elenco
  - `partidas`: 1 confronto cadastrado (Amador vs Resenha FC)
  - `confirmacoes_presenca`: 16 registros de presença
  - `vaquinha_lancamentos`: 16 lançamentos financeiros
  - `itens_almoxarifado`: 3 categorias (camisas, bolas, cones)
  - `scouts_partida`: 16 registros estatísticos
- **Estratégia**: Carga inicial idempotente via **Database Seeder do Laravel** (`php artisan db:seed --class=LegacyInitialDataSeeder`), seguido por validação automatizada de paridade.

---

## Mapeamento Legado → Schema Alvo

| Origem (`src/data/initialData.ts`) | Destino no PostgreSQL | Tipo de Transformação |
|---|---|---|
| `initialAtletas` | `atletas` + `users` | Divisão: cria a conta de usuário no Sanctum e o registro do atleta associado com UUID. |
| `initialMatch` | `partidas` | Normalização: separa campos de data e horários, converte moeda de float para centavos inteiros (`R$ 300,00` -> `30000`). |
| `initialConfirmacoes` | `confirmacoes_presenca` | Conversão de IDs para UUIDs válidos e cálculo da flag booleana `atrasado_prelecao_t35`. |
| `titularesIds` em `PranchetaTecnica` | `partida_titulares` | Normalização: vincula o atleta à sua respectiva posição tática na tabela `posicoes_campo`. |
| `initialColetas` | `vaquinha_lancamentos` | Conversão de status booleano para enum (`'pago'` / `'pendente'`) e atribuição de data de quitação. |
| `initialScouts` | `scouts_partida` | Normalização de contadores para números inteiros não-negativos e validação de exclusividade de MVP. |
| `initialAlmoxarifado` | `itens_almoxarifado` + `conferencias_malas` | Normalização e separação entre o inventário de bens permanentes e a conferência específica da rodada. |

---

## Transformações e Regras de Normalização

### T-01: Geração de Contas de Usuário Sanctum para o Elenco
- **Aplica em**: `users` e `atletas.user_id`
- **Regra**: Cada atleta de `initialAtletas` tem uma conta de usuário criada com seu telefone como login (`users.phone`), perfil `'atleta'` (ou `'admin'` para o técnico Ado e `'tesoureiro'` para o responsável pela vaquinha) e uma senha provisória criptografada via `Hash::make('na-prancheta-2026')`.
- **Origem da regra**: Decisão Humana 1 (`BR-HUMANA-001`, opção B - Autenticação Sanctum).

### T-02: Conversão de Valores Monetários para Centavos Inteiros
- **Aplica em**: `partidas.meta_arrecadacao_centavos`, `partidas.valor_cota_centavos` e `vaquinha_lancamentos.valor_devido_centavos`
- **Regra**: Todo valor financeiro representado como número de ponto flutuante no legado (ex: `valor_cota: 25.0`) é multiplicado por 100 e gravado como inteiro (`2500`), eliminando problemas de arredondamento IEEE 754.
- **Origem da regra**: Boas práticas contábeis e integridade relacional.

### T-03: Normalização de Posições Táticas
- **Aplica em**: `atletas.posicao_principal` e `atletas.posicao_secundaria`
- **Regra**: Mapeia siglas do legado para enums estritos do banco:
  - `"Goleiro"` -> `'GOL'`
  - `"Zagueiro"` -> `'ZAG'`
  - `"Lateral"` -> `'LAT'`
  - `"Volante"` / `"Meia"` -> `'VOL'` / `'MEI'`
  - `"Atacante"` -> `'ATA'`
- **Tratamento de inválidos**: Se não reconhecido, fallback seguro para `'MEI'`.

### T-04: Transição da Unicidade do MVP da Partida
- **Aplica em**: `scouts_partida.foi_mvp`
- **Regra**: Se houver mais de um atleta com `foi_mvp = true` nos dados de teste, mantém apenas o de maior minutagem ou o primeiro encontrado, resetando os demais para `false` para honrar a regra de exclusividade estrita [BR-MIGRAR-018](file:///home/adomoraes/projects/na-prancheta/_reversa_sdd/migration/target_business_rules.md).

---

## Estrutura do Seeder do Laravel (`LegacyInitialDataSeeder.php`)

```php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class LegacyInitialDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            // 1. Criar o Time Principal
            $timeId = (string) Str::uuid();
            DB::table('times')->insert([
                'id' => $timeId,
                'nome' => 'Na Prancheta F.C.',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. Inserir Posições do Campo Tático 4-3-3
            $posicoes = [
                ['id' => 1, 'nome' => 'Goleiro', 'sigla' => 'GOL', 'coord_x_percent' => 50, 'coord_y_percent' => 90],
                ['id' => 2, 'nome' => 'Lateral Direito', 'sigla' => 'LAD', 'coord_x_percent' => 85, 'coord_y_percent' => 70],
                ['id' => 3, 'nome' => 'Zagueiro Direito', 'sigla' => 'ZAG_DIR', 'coord_x_percent' => 62, 'coord_y_percent' => 75],
                ['id' => 4, 'nome' => 'Zagueiro Esquerdo', 'sigla' => 'ZAG_ESQ', 'coord_x_percent' => 38, 'coord_y_percent' => 75],
                ['id' => 5, 'nome' => 'Lateral Esquerdo', 'sigla' => 'LAE', 'coord_x_percent' => 15, 'coord_y_percent' => 70],
                ['id' => 6, 'nome' => 'Volante', 'sigla' => 'VOL', 'coord_x_percent' => 50, 'coord_y_percent' => 55],
                ['id' => 7, 'nome' => 'Meia Direita', 'sigla' => 'MC_DIR', 'coord_x_percent' => 70, 'coord_y_percent' => 45],
                ['id' => 8, 'nome' => 'Meia Esquerda', 'sigla' => 'MC_ESQ', 'coord_x_percent' => 30, 'coord_y_percent' => 45],
                ['id' => 9, 'nome' => 'Ponta Direita', 'sigla' => 'PTD', 'coord_x_percent' => 80, 'coord_y_percent' => 25],
                ['id' => 10, 'nome' => 'Centroavante', 'sigla' => 'CA', 'coord_x_percent' => 50, 'coord_y_percent' => 20],
                ['id' => 11, 'nome' => 'Ponta Esquerda', 'sigla' => 'PTE', 'coord_x_percent' => 20, 'coord_y_percent' => 25],
            ];
            DB::table('posicoes_campo')->insert($posicoes);

            // 3. Carga do Elenco e Usuários
            // (Lê dados JSON exportados de src/data/initialData.ts)
            // ...
        });
    }
}
```

---

## Validação de Paridade pós-Migração

| Critério de Validação | Método de Verificação | Resultado Esperado |
|---|---|---|
| **Total de Atletas** | `SELECT COUNT(*) FROM atletas;` | Exatamente 16 atletas ativos |
| **Unicidade de Camisas**| `SELECT numero_camisa, COUNT(*) FROM atletas GROUP BY numero_camisa HAVING COUNT(*) > 1;` | 0 duplicidades |
| **Integridade de Presenças**| `SELECT COUNT(*) FROM confirmacoes_presenca WHERE status = 'confirmado';` | 14 confirmados |
| **Meta Financeira** | `SELECT SUM(valor_devido_centavos) FROM vaquinha_lancamentos;` | R$ 350,00 (14 confirmados x R$ 25,00) |
| **Exclusividade do MVP**| `SELECT COUNT(*) FROM scouts_partida WHERE foi_mvp = TRUE;` | Exatamente 1 atleta |
| **Trava da Resenha** | `SELECT resenha_liberada FROM conferencias_malas;` | Estado coerente com checklist tríplice |
