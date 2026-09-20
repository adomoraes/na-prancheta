<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('atletas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('time_id')->constrained('times')->onDelete('restrict');
            $table->foreignUuid('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('nome', 100);
            $table->string('apelido', 50);
            $table->integer('numero_camisa');
            $table->string('posicao_principal', 10);
            $table->string('posicao_secundaria', 10)->nullable();
            $table->string('tipo_vinculo', 20)->default('mensalista');
            $table->boolean('ativo')->default(true);
            $table->timestamps();

            $table->unique(['time_id', 'numero_camisa'], 'uk_atletas_time_camisa');
            $table->index(['time_id', 'ativo'], 'idx_atletas_time_ativo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('atletas');
    }
};
