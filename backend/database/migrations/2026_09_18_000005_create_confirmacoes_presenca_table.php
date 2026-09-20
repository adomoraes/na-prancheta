<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('confirmacoes_presenca', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('partida_id')->constrained('partidas')->onDelete('cascade');
            $table->foreignUuid('atleta_id')->constrained('atletas')->onDelete('restrict');
            $table->string('status', 20)->default('duvida');
            $table->integer('ordem_fila_espera')->nullable();
            $table->timestamp('chegou_vestiario_em')->nullable();
            $table->boolean('atrasado_prelecao_t35')->default(false);
            $table->timestamp('respondido_em')->useCurrent();
            $table->timestamps();

            $table->unique(['partida_id', 'atleta_id'], 'uk_presenca_partida_atleta');
            $table->index(['partida_id', 'status'], 'idx_confirmacoes_partida');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('confirmacoes_presenca');
    }
};
