<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('caixa_movimentacoes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('time_id')->constrained('times')->onDelete('restrict');
            $table->foreignUuid('partida_id')->nullable()->constrained('partidas')->onDelete('set null');
            $table->string('tipo', 30);
            $table->integer('valor_centavos');
            $table->text('descricao');
            $table->foreignUuid('responsavel_id')->constrained('users')->onDelete('restrict');
            $table->timestamp('data_movimentacao')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('caixa_movimentacoes');
    }
};
