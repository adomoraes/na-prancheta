<?php

namespace Tests\Feature;

use App\Models\FaturaCobranca;
use App\Models\Plano;
use App\Models\Time;
use App\Models\User;
use Database\Seeders\PlanosSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WhitelabelBillingWebhookTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PlanosSeeder::class);
    }

    public function test_catalogo_de_planos_retorna_todos_os_planos_ativos(): void
    {
        $response = $this->getJson('/api/planos');

        $response->assertStatus(200)
            ->assertJsonCount(3)
            ->assertJsonFragment(['slug' => 'amador'])
            ->assertJsonFragment(['slug' => 'campeao'])
            ->assertJsonFragment(['slug' => 'liga']);
    }

    public function test_gestor_pode_gerar_checkout_pix(): void
    {
        $time = Time::create([
            'nome' => 'Santos da Várzea',
            'slug' => 'santos-da-varzea',
            'status' => 'trial',
        ]);

        $gestor = User::factory()->create([
            'role' => 'gestor',
            'time_id' => $time->id,
        ]);

        $response = $this->actingAs($gestor, 'sanctum')->postJson('/api/assinaturas/checkout', [
            'plano_slug' => 'campeao',
            'ciclo' => 'mensal',
            'metodo_pagamento' => 'pix',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'fatura_id',
                'valor_centavos',
                'metodo_pagamento',
                'status',
                'pix_copia_cola',
                'pix_qrcode_url',
            ]);

        $this->assertDatabaseHas('faturas_cobranca', [
            'time_id' => $time->id,
            'valor_centavos' => 9990,
            'status' => 'pendente',
            'metodo_pagamento' => 'pix',
        ]);
    }

    public function test_webhook_de_pagamento_ativa_assinatura_e_atualiza_clube(): void
    {
        $time = Time::create([
            'nome' => 'Palmeiras da Várzea',
            'slug' => 'palmeiras-da-varzea',
            'status' => 'trial',
        ]);

        $plano = Plano::where('slug', 'campeao')->first();

        $fatura = FaturaCobranca::create([
            'time_id' => $time->id,
            'valor_centavos' => 9990,
            'status' => 'pendente',
            'metodo_pagamento' => 'pix',
            'data_vencimento' => now()->addHour(),
        ]);

        $payload = [
            'event_id' => 'EVT-PAGTO-001',
            'event' => 'PAYMENT_RECEIVED',
            'payment' => [
                'externalReference' => $fatura->id,
                'value' => 99.90,
                'billingType' => 'PIX',
                'status' => 'RECEIVED',
            ],
        ];

        $response = $this->postJson('/api/webhooks/pagamentos', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'processed',
                'event_id' => 'EVT-PAGTO-001',
            ]);

        // Fatura deve estar marcada como paga
        $this->assertDatabaseHas('faturas_cobranca', [
            'id' => $fatura->id,
            'status' => 'paga',
        ]);

        // Clube deve estar ativo com assinatura correspondente
        $this->assertDatabaseHas('times', [
            'id' => $time->id,
            'status' => 'ativo',
        ]);

        $this->assertDatabaseHas('assinaturas', [
            'time_id' => $time->id,
            'status' => 'ativa',
        ]);

        // Webhook event deve estar registrado para auditoria
        $this->assertDatabaseHas('webhook_events', [
            'event_id' => 'EVT-PAGTO-001',
            'processado' => true,
        ]);
    }

    public function test_webhook_duplicado_retorna_already_processed_sem_reprocessar(): void
    {
        $time = Time::create([
            'nome' => 'Corinthians da Várzea',
            'slug' => 'corinthians-da-varzea',
            'status' => 'trial',
        ]);

        $fatura = FaturaCobranca::create([
            'time_id' => $time->id,
            'valor_centavos' => 4990,
            'status' => 'pendente',
            'metodo_pagamento' => 'pix',
            'data_vencimento' => now()->addHour(),
        ]);

        $payload = [
            'event_id' => 'EVT-DUPLICADO-777',
            'event' => 'PAYMENT_RECEIVED',
            'payment' => [
                'externalReference' => $fatura->id,
                'value' => 49.90,
                'billingType' => 'PIX',
                'status' => 'RECEIVED',
            ],
        ];

        // Primeiro envio
        $res1 = $this->postJson('/api/webhooks/pagamentos', $payload);
        $res1->assertStatus(200)->assertJson(['status' => 'processed']);

        // Segundo envio (idêntico)
        $res2 = $this->postJson('/api/webhooks/pagamentos', $payload);
        $res2->assertStatus(200)->assertJson(['status' => 'already_processed']);

        // Deve existir apenas um registro de webhook_event
        $this->assertEquals(1, \App\Models\WebhookEvent::where('event_id', 'EVT-DUPLICADO-777')->count());
    }
}
