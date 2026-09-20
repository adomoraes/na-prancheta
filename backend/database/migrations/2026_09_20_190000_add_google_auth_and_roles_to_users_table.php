<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->change();
            $table->string('password')->nullable()->change();
            $table->string('google_id')->nullable()->unique()->after('email');
            $table->text('avatar_url')->nullable()->after('google_id');
        });

        // Harmoniza roles legadas para a taxonomia canônica do domínio
        DB::table('users')->where('role', 'admin')->update(['role' => 'geral']);
        DB::table('users')->where('role', 'tesoureiro')->update(['role' => 'financeiro']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'avatar_url']);
            $table->string('phone', 20)->nullable(false)->change();
            $table->string('password')->nullable(false)->change();
        });
    }
};
