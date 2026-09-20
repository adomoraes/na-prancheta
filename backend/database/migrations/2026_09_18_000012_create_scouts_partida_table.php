<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scouts_partida', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('partida_id')->constrained('partidas')->onDelete('cascade');
            $table->foreignUuid('atleta_id')->constrained('atletas')->onDelete('restrict');
            $table->integer('gols')->default(0);
            $table->integer('assistencias')->default(0);
            $table->integer('cartoes_amarelos')->default(0);
            $table->integer('cartoes_vermelhos')->default(0);
            $table->integer('gols_sofridos_goleiro')->default(0);
            $table->integer('minutos_jogados')->default(0);
            $table->boolean('foi_mvp')->default(false);
            $table->timestamps();

            $table->unique(['partida_id', 'atleta_id'], 'uk_scout_partida_atleta');
            $table->index(['partida_id', 'foi_mvp'], 'idx_scout_partida_mvp');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scouts_partida');
    }
};
