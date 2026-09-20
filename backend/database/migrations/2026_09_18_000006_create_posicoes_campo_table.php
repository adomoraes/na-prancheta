<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posicoes_campo', function (Blueprint $table) {
            $table->integer('id')->primary();
            $table->string('nome', 50);
            $table->string('sigla', 10);
            $table->integer('coord_x_percent');
            $table->integer('coord_y_percent');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posicoes_campo');
    }
};
