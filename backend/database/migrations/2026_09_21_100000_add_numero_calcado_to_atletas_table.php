<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('atletas', function (Blueprint $table) {
            $table->smallInteger('numero_calcado')->nullable()->after('tipo_vinculo');
        });
    }

    public function down(): void
    {
        Schema::table('atletas', function (Blueprint $table) {
            $table->dropColumn('numero_calcado');
        });
    }
};
