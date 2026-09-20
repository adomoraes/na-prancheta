<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conferencias_malas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('partida_id')->unique()->constrained('partidas')->onDelete('cascade');
            $table->foreignUuid('custodiante_id')->constrained('users')->onDelete('restrict');
            $table->integer('camisas_recolhidas')->default(0);
            $table->boolean('todas_camisas_desviradas')->default(false);
            $table->integer('bolas_recolhidas')->default(0);
            $table->boolean('kit_cones_recolhido')->default(false);
            $table->boolean('mala_trancada_no_carro')->default(false);
            $table->boolean('resenha_liberada')->default(false);
            $table->timestamp('liberada_em')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conferencias_malas');
    }
};
