# Delta de Modelo de Dados: CRUD de Locais e Campos da Partida

> Identificador: `006-crud-locais-campos`  
> Data: `2026-09-21`  
> Tabelas afetadas: `locais` (nova) e `partidas` (alterada)  

---

## 1. Nova Tabela: `locais`

```sql
CREATE TABLE locais (
    id UUID PRIMARY KEY,
    time_id UUID NOT NULL REFERENCES times(id) ON DELETE RESTRICT,
    nome VARCHAR(150) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    maps_url TEXT NULL,
    tipo_piso VARCHAR(50) DEFAULT 'Grama Sintética',
    observacoes TEXT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT uk_locais_time_nome UNIQUE (time_id, nome)
);

CREATE INDEX idx_locais_time_ativo ON locais (time_id, ativo);
```

---

## 2. Alteração na Tabela `partidas`

```diff
  Schema::table('partidas', function (Blueprint $table) {
+     $table->foreignUuid('local_id')->nullable()->after('time_id')->constrained('locais')->nullOnDelete();
  });
```

---

## 3. Especificação da Migration Laravel

### Nome do Arquivo Proposto
`backend/database/migrations/2026_09_21_200000_create_locais_table_and_add_local_id_to_partidas.php`

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
        Schema::create('locais', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('time_id')->constrained('times')->onDelete('restrict');
            $table->string('nome', 150);
            $table->string('endereco', 255);
            $table->text('maps_url')->nullable();
            $table->string('tipo_piso', 50)->default('Grama Sintética');
            $table->text('observacoes')->nullable();
            $table->boolean('ativo')->default(true);
            $table->timestamps();

            $table->unique(['time_id', 'nome'], 'uk_locais_time_nome');
            $table->index(['time_id', 'ativo'], 'idx_locais_time_ativo');
        });

        Schema::table('partidas', function (Blueprint $table) {
            $table->foreignUuid('local_id')->nullable()->after('time_id')->constrained('locais')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('partidas', function (Blueprint $table) {
            $table->dropForeign(['local_id']);
            $table->dropColumn('local_id');
        });

        Schema::dropIfExists('locais');
    }
};
```
