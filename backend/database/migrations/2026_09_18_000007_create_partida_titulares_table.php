<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partida_titulares', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('partida_id')->constrained('partidas')->onDelete('cascade');
            $table->foreignUuid('atleta_id')->constrained('atletas')->onDelete('restrict');
            $table->integer('posicao_campo_id');
            $table->foreign('posicao_campo_id')->references('id')->on('posicoes_campo')->onDelete('restrict');
            $table->timestamp('escalado_em')->useCurrent();

            $table->unique(['partida_id', 'atleta_id'], 'uk_titular_partida_atleta');
            $table->unique(['partida_id', 'posicao_campo_id'], 'uk_titular_partida_posicao');
            $table->index('partida_id', 'idx_titulares_partida');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partida_titulares');
    }
};
