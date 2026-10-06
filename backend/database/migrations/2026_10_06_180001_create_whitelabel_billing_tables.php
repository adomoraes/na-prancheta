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
        // 1. Tabela de Planos
        Schema::create('planos', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->string('nome', 100);
            $table->text('descricao')->nullable();
            $table->integer('preco_mensal_centavos');
            $table->integer('preco_anual_centavos');
            $table->integer('max_elencos')->default(1);
            $table->integer('max_atletas')->default(25);
            $table->json('recursos')->nullable();
            $table->boolean('ativo')->default(true);
            $table->timestamps();
        });

        // 2. Tabela de Assinaturas
        Schema::create('assinaturas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('time_id');
            $table->unsignedBigInteger('plano_id');
            $table->string('ciclo', 20)->default('mensal'); // 'mensal', 'anual'
            $table->string('status', 30)->default('ativa');  // 'ativa', 'carencia', 'suspensa', 'cancelada'
            $table->integer('valor_centavos');
            $table->string('forma_pagamento_preferida', 30)->default('pix'); // 'pix', 'cartao_credito'
            $table->timestamp('data_inicio');
            $table->timestamp('data_proxima_cobranca');
            $table->timestamp('data_cancelamento')->nullable();
            $table->string('provedor_assinatura_id')->nullable();
            $table->timestamps();

            $table->foreign('time_id')->references('id')->on('times')->onDelete('cascade');
            $table->foreign('plano_id')->references('id')->on('planos');
            $table->index('time_id');
            $table->index('status');
        });

        // 3. Tabela de Faturas de Cobrança
        Schema::create('faturas_cobranca', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('assinatura_id')->nullable();
            $table->uuid('time_id');
            $table->integer('valor_centavos');
            $table->string('status', 30)->default('pendente'); // 'pendente', 'paga', 'cancelada', 'estornada'
            $table->string('metodo_pagamento', 30);            // 'pix', 'cartao_credito'
            $table->text('pix_qrcode')->nullable();
            $table->text('pix_copia_cola')->nullable();
            $table->timestamp('data_vencimento');
            $table->timestamp('data_pagamento')->nullable();
            $table->string('transacao_provedor_id')->nullable()->index();
            $table->json('webhook_payload')->nullable();
            $table->timestamps();

            $table->foreign('time_id')->references('id')->on('times')->onDelete('cascade');
            $table->foreign('assinatura_id')->references('id')->on('assinaturas')->onDelete('set null');
            $table->index('time_id');
            $table->index('status');
        });

        // 4. Tabela de Webhook Events (Idempotência)
        Schema::create('webhook_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_id', 255)->unique();
            $table->string('provedor', 50);
            $table->string('tipo_evento', 100);
            $table->boolean('processado')->default(true);
            $table->json('payload');
            $table->timestamps();
        });

        // 5. Tabela de Auditoria de Personificação ROOT
        Schema::create('impersonation_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('root_user_id');
            $table->uuid('time_id');
            $table->string('action', 50)->default('start'); // 'start', 'stop'
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->foreign('root_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('time_id')->references('id')->on('times')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('impersonation_logs');
        Schema::dropIfExists('webhook_events');
        Schema::dropIfExists('faturas_cobranca');
        Schema::dropIfExists('assinaturas');
        Schema::dropIfExists('planos');
    }
};
