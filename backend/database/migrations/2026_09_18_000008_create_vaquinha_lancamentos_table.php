<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vaquinha_lancamentos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('partida_id')->constrained('partidas')->onDelete('cascade');
            $table->foreignUuid('atleta_id')->constrained('atletas')->onDelete('restrict');
            $table->integer('valor_devido_centavos')->default(2500);
            $table->string('status', 20)->default('pendente');
            $table->timestamp('pago_em')->nullable();
            $table->foreignUuid('tesoureiro_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('metodo_pagamento', 30)->default('pix');
            $table->string('comprovante_ref', 255)->nullable();
            $table->timestamps();

            $table->unique(['partida_id', 'atleta_id'], 'uk_vaquinha_partida_atleta');
            $table->index(['partida_id', 'status'], 'idx_vaquinha_partida_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vaquinha_lancamentos');
    }
};
