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
        Schema::create('investor_leads', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 255);
            $table->string('email', 255);
            $table->string('telefone', 50);
            $table->string('tipo_investidor', 50); // 'anjo', 'fundo_vc', 'arena_liga', 'outro'
            $table->string('ticket_estimado', 100)->nullable(); // 'ate_50k', '50k_200k', '200k_1m', 'acima_1m', 'parceria_comercial'
            $table->text('mensagem')->nullable();
            $table->string('origem', 100)->default('landing_page');
            $table->string('ip_address', 45)->nullable();
            $table->string('status', 30)->default('novo'); // 'novo', 'em_contato', 'reuniao_agendada', 'descartado'
            $table->timestamps();

            $table->index('email');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investor_leads');
    }
};
