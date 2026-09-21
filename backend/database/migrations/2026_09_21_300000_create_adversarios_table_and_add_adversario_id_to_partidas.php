<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('adversarios', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('time_id')->constrained('times')->onDelete('restrict');
            $table->string('nome', 150);
            $table->string('responsavel_nome', 100)->nullable();
            $table->string('responsavel_telefone', 20)->nullable();
            $table->string('cor_uniforme_principal', 50)->nullable();
            $table->string('escudo_url', 255)->nullable();
            $table->text('observacoes')->nullable();
            $table->boolean('ativo')->default(true);
            $table->timestamps();

            $table->unique(['time_id', 'nome'], 'uk_adversarios_time_nome');
            $table->index(['time_id', 'ativo'], 'idx_adversarios_time_ativo');
        });

        Schema::table('partidas', function (Blueprint $table) {
            $table->foreignUuid('adversario_id')->nullable()->after('local_id')->constrained('adversarios')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('partidas', function (Blueprint $table) {
            $table->dropForeign(['adversario_id']);
            $table->dropColumn('adversario_id');
        });

        Schema::dropIfExists('adversarios');
    }
};
