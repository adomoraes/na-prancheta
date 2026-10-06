<?php

namespace Tests\Feature;

use App\Models\Time;
use App\Models\User;
use Database\Seeders\PlanosSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WhitelabelOnboardingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PlanosSeeder::class);
    }

    public function test_onboarding_com_dados_validos_cria_clube_em_trial_e_autentica_gestor(): void
    {
        $payload = [
            'nome_clube' => 'Guarani da Várzea F.C.',
            'sigla' => 'GVA',
            'modalidade' => 'futebol_campo',
            'nome_gestor' => 'Carlos Silva',
            'email' => 'carlos@guaranivarzea.com',
            'password' => 'SenhaSegura123!',
            'password_confirmation' => 'SenhaSegura123!',
        ];

        $response = $this->postJson('/api/onboarding', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'token',
                'user' => ['id', 'name', 'email', 'role', 'time_id'],
                'tenant' => ['id', 'nome', 'sigla', 'slug', 'cor_primaria', 'cor_secundaria', 'status', 'trial_ends_at'],
            ]);

        $this->assertDatabaseHas('times', [
            'nome' => 'Guarani da Várzea F.C.',
            'sigla' => 'GVA',
            'status' => 'trial',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'carlos@guaranivarzea.com',
            'role' => 'gestor',
        ]);
    }

    public function test_onboarding_falha_com_email_duplicado(): void
    {
        User::factory()->create([
            'email' => 'existente@clube.com',
        ]);

        $payload = [
            'nome_clube' => 'Outro Clube',
            'sigla' => 'OTC',
            'nome_gestor' => 'Gestor Dois',
            'email' => 'existente@clube.com',
            'password' => 'SenhaSegura123!',
            'password_confirmation' => 'SenhaSegura123!',
        ];

        $response = $this->postJson('/api/onboarding', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_onboarding_valida_campos_obrigatorios(): void
    {
        $response = $this->postJson('/api/onboarding', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nome_clube', 'nome_gestor', 'email', 'password']);
    }

    public function test_root_pode_personificar_agremiação(): void
    {
        $root = User::factory()->create(['role' => 'root']);
        $time = Time::create([
            'nome' => 'Flamengo da Várzea',
            'slug' => 'flamengo-da-varzea',
            'status' => 'ativo',
        ]);

        $response = $this->actingAs($root, 'sanctum')->postJson('/api/auth/impersonate', [
            'time_id' => $time->id,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'impersonating' => true,
                'tenant' => [
                    'id' => $time->id,
                    'nome' => 'Flamengo da Várzea',
                ],
            ]);

        $this->assertDatabaseHas('impersonation_logs', [
            'root_user_id' => $root->id,
            'time_id' => $time->id,
            'action' => 'start',
        ]);
    }

    public function test_usuario_comum_rejeitado_ao_tentar_personificar(): void
    {
        $atleta = User::factory()->create(['role' => 'atleta']);
        $time = Time::create([
            'nome' => 'Clube Teste',
            'status' => 'ativo',
        ]);

        $response = $this->actingAs($atleta, 'sanctum')->postJson('/api/auth/impersonate', [
            'time_id' => $time->id,
        ]);

        $response->assertStatus(403);
    }

    public function test_gestor_pode_consultar_e_atualizar_branding_do_seu_clube(): void
    {
        $time = Time::create([
            'nome' => 'União F.C.',
            'slug' => 'uniao-fc',
            'cor_primaria' => '#10b981',
            'cor_secundaria' => '#0f172a',
            'status' => 'trial',
        ]);

        $gestor = User::factory()->create([
            'role' => 'gestor',
            'time_id' => $time->id,
        ]);

        // Consulta de branding
        $resGet = $this->actingAs($gestor, 'sanctum')->getJson('/api/tenant/branding');
        $resGet->assertStatus(200)
            ->assertJson([
                'id' => $time->id,
                'nome' => 'União F.C.',
                'cor_primaria' => '#10b981',
            ]);

        // Atualização de branding
        $resPut = $this->actingAs($gestor, 'sanctum')->putJson('/api/tenant/branding', [
            'cor_primaria' => '#ef4444',
            'cor_secundaria' => '#1e293b',
            'sigla' => 'UFC',
        ]);

        $resPut->assertStatus(200)
            ->assertJson([
                'tenant' => [
                    'cor_primaria' => '#ef4444',
                    'cor_secundaria' => '#1e293b',
                    'sigla' => 'UFC',
                ],
            ]);

        $this->assertDatabaseHas('times', [
            'id' => $time->id,
            'cor_primaria' => '#ef4444',
            'sigla' => 'UFC',
        ]);
    }
}
