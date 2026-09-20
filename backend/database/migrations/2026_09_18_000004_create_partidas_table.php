<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partidas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('time_id')->constrained('times')->onDelete('restrict');
            $table->string('adversario', 100);
            $table->date('data_partida');
            $table->time('horario_inicio');
            $table->time('horario_chegada_t70');
            $table->time('horario_prelecao_t35');
            $table->string('local_nome', 150);
            $table->text('local_endereco');
            $table->text('local_maps_url')->nullable();
            $table->string('cor_uniforme', 50)->default('Branco/Verde');
            $table->integer('limite_confirmados')->default(16);
            $table->integer('meta_arrecadacao_centavos')->default(30000);
            $table->integer('valor_cota_centavos')->default(2500);
            $table->string('chave_pix_cobranca', 150)->nullable();
            $table->string('status', 30)->default('agendada');
            $table->timestamps();

            $table->index(['time_id', 'data_partida'], 'idx_partidas_time_data');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partidas');
    }
};
