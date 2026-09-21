<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('itens_almoxarifado', function (Blueprint $table) {
            $table->string('tipo_uniforme', 30)->nullable()->after('categoria');
            $table->string('tamanho', 20)->nullable()->after('quantidade_total');
            $table->string('cor', 50)->nullable()->after('tamanho');
            $table->string('numero', 10)->nullable()->after('cor');
            $table->text('observacoes')->nullable()->after('estado_conservacao');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('itens_almoxarifado', function (Blueprint $table) {
            $table->dropColumn([
                'tipo_uniforme',
                'tamanho',
                'cor',
                'numero',
                'observacoes',
            ]);
        });
    }
};
