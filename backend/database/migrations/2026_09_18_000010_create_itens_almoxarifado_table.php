<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itens_almoxarifado', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('time_id')->constrained('times')->onDelete('restrict');
            $table->string('nome', 100);
            $table->string('categoria', 50);
            $table->integer('quantidade_total');
            $table->string('estado_conservacao', 30)->default('bom');
            $table->boolean('ativo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itens_almoxarifado');
    }
};
