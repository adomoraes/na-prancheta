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
            $table->string('endereco', 255)->nullable();
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
