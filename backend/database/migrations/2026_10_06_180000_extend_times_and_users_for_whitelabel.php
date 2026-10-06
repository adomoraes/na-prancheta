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
        Schema::table('times', function (Blueprint $table) {
            $table->string('slug', 100)->nullable()->unique()->after('nome');
            $table->string('sigla', 10)->nullable()->after('slug');
            $table->string('cor_primaria', 7)->default('#10b981')->after('escudo_url');
            $table->string('cor_secundaria', 7)->default('#0f172a')->after('cor_primaria');
            $table->string('modalidade', 50)->default('futebol_campo')->after('cor_secundaria');
            $table->string('status', 30)->default('trial')->after('modalidade');
            $table->timestamp('trial_ends_at')->nullable()->after('status');
            $table->unsignedBigInteger('plano_id')->nullable()->after('trial_ends_at');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->uuid('time_id')->nullable()->after('id');
            $table->index('time_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['time_id']);
            $table->dropColumn('time_id');
        });

        Schema::table('times', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'sigla',
                'cor_primaria',
                'cor_secundaria',
                'modalidade',
                'status',
                'trial_ends_at',
                'plano_id',
            ]);
        });
    }
};
