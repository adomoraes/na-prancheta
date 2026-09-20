<?php

namespace Tests\Feature;

use App\Models\Partida;
use App\Models\User;
use Database\Seeders\LegacyInitialDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(LegacyInitialDataSeeder::class);
    }

    public function test_login_com_credenciais_validas_retorna_token_e_usuario(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'login' => '11987654321', // Lucão
            'password' => 'na-prancheta-2026',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'phone', 'role', 'atleta']
            ]);

        $this->assertEquals('atleta', $response->json('user.role'));
    }

    public function test_login_com_credenciais_invalidas_retorna_401(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'login' => '11987654321',
            'password' => 'senha-errada',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Credenciais inválidas. Verifique seu e-mail/telefone e senha.'
            ]);
    }

    public function test_login_google_com_token_demo_cria_e_autentica_usuario(): void
    {
        $response = $this->postJson('/api/auth/google', [
            'credential' => 'demo-google-token:tecnico',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'email', 'role', 'avatar_url']
            ]);

        $this->assertEquals('tecnico', $response->json('user.role'));
        $this->assertDatabaseHas('users', [
            'email' => 'tecnico@naprancheta.com.br',
            'role' => 'tecnico',
        ]);
    }

    public function test_dev_login_autentica_com_role_solicitada(): void
    {
        $response = $this->postJson('/api/auth/dev-login', [
            'role' => 'financeiro',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'role']
            ]);

        $this->assertEquals('financeiro', $response->json('user.role'));
    }

    public function test_rota_me_retorna_usuario_autenticado(): void
    {
        $user = User::where('role', 'atleta')->first();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => 'atleta',
                ]
            ]);
    }

    public function test_atleta_recebe_403_ao_tentar_salvar_escalacao(): void
    {
        $atletaUser = User::where('role', 'atleta')->first();
        Sanctum::actingAs($atletaUser);

        $partidaId = '33333333-3333-3333-3333-333333333333';

        $response = $this->postJson("/api/partidas/{$partidaId}/escalacao", [
            'titulares' => [
                ['posicao_id' => 1, 'atleta_id' => '00000000-0000-0000-0002-000000000001']
            ]
        ]);

        $response->assertStatus(403)
            ->assertJsonStructure(['message', 'required_roles', 'user_role'])
            ->assertJson([
                'user_role' => 'atleta',
            ]);
    }

    public function test_tecnico_consegue_salvar_escalacao(): void
    {
        $tecnicoUser = User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Professor Pardal',
            'phone' => '11999990001',
            'role' => 'tecnico',
            'password' => Hash::make('123456'),
        ]);
        Sanctum::actingAs($tecnicoUser);

        $partidaId = '33333333-3333-3333-3333-333333333333';

        $response = $this->postJson("/api/partidas/{$partidaId}/escalacao", [
            'titulares' => [
                ['posicao_campo_id' => 1, 'atleta_id' => '00000000-0000-0000-0002-000000000001']
            ]
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Escalação salva com sucesso.']);
    }

    public function test_atleta_recebe_403_ao_tentar_fechar_malas(): void
    {
        $atletaUser = User::where('role', 'atleta')->first();
        Sanctum::actingAs($atletaUser);

        $partidaId = '33333333-3333-3333-3333-333333333333';

        $response = $this->postJson("/api/partidas/{$partidaId}/almoxarifado/fechar-malas", [
            'todas_camisas_desviradas' => true,
            'camisas_recolhidas' => 22,
            'bolas_recolhidas' => 6,
            'kit_cones_recolhido' => true,
            'mala_trancada_no_carro' => true,
        ]);

        $response->assertStatus(403);
    }

    public function test_almoxarifado_consegue_fechar_malas(): void
    {
        $almoxUser = User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Seu Zé do Almoxarifado',
            'phone' => '11999990002',
            'role' => 'almoxarifado',
            'password' => Hash::make('123456'),
        ]);
        Sanctum::actingAs($almoxUser);

        $partidaId = '33333333-3333-3333-3333-333333333333';

        $response = $this->postJson("/api/partidas/{$partidaId}/almoxarifado/fechar-malas", [
            'todas_camisas_desviradas' => true,
            'camisas_recolhidas' => 22,
            'bolas_recolhidas' => 6,
            'kit_cones_recolhido' => true,
            'mala_trancada_no_carro' => true,
        ]);

        $response->assertStatus(200)
            ->assertJson(['resenha_liberada' => true]);
    }

    public function test_logout_revoga_token_do_usuario(): void
    {
        $user = User::where('role', 'atleta')->first();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Sessão encerrada com sucesso.']);

        $this->assertCount(0, $user->tokens);
    }
}
