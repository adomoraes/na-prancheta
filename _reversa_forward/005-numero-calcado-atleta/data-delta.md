# Delta de Modelo de Dados: Número do Calçado na Ficha do Atleta

> Identificador: `005-numero-calcado-atleta`  
> Data: `2026-09-21`  
> Tabela afetada: `atletas`  

---

## 1. Diff Conceitual sobre a Tabela `atletas`

```diff
  Schema::table('atletas', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->foreignUuid('time_id')->constrained('times');
      $table->foreignUuid('user_id')->nullable()->constrained('users');
      $table->string('nome', 100);
      $table->string('apelido', 50);
      $table->integer('numero_camisa');
      $table->string('posicao_principal', 10);
      $table->string('posicao_secundaria', 10)->nullable();
      $table->string('tipo_vinculo', 20)->default('mensalista');
+     $table->smallInteger('numero_calcado')->nullable()->after('tipo_vinculo');
      $table->boolean('ativo')->default(true);
      $table->timestamps();
  });
```

---

## 2. Detalhes da Nova Coluna

| Nome da Coluna | Tipo SQL | Nullable? | Default | Validação de Domínio | Descrição |
|---|---|---|---|---|---|
| `numero_calcado` | `SMALLINT` | Sim (`nullable`) | `NULL` | Inteiro entre 25 e 50 | Numeração do calçado esportivo do atleta (tamanho da chuteira/tênis). |

---

## 3. Especificação da Migration Laravel

### Nome do Arquivo Proposto
`backend/database/migrations/2026_09_21_100000_add_numero_calcado_to_atletas_table.php`

### Código da Migration
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('atletas', function (Blueprint $table) {
            $table->smallInteger('numero_calcado')->nullable()->after('tipo_vinculo');
        });
    }

    public function down(): void
    {
        Schema::table('atletas', function (Blueprint $table) {
            $table->dropColumn('numero_calcado');
        });
    }
};
```

---

## 4. Impacto em Índices e Chaves Estrangeiras

- Não há criação de novos índices. O campo `numero_calcado` não participa de chaves únicas nem de junções relacionais.
- A unicidade existente em `uk_atletas_time_camisa` (`time_id`, `numero_camisa`) permanece inalterada.
- Índices de performance de elenco (`idx_atletas_time_ativo`) permanecem inalterados.
