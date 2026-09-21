<?php

namespace Tests\Feature;

use App\Models\Adversario;
use App\Models\Partida;
use App\Models\Time;
use App\Models\User;
use Database\Seeders\LegacyInitialDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdversarioCrudTest extends TestCase
{
    use RefreshDatabase;

    protected User $rootUser;
    protected User $tecnicoUser;
    protected ?Time $time;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(LegacyInitialDataSeeder::class);

        $this->time = Time::first();

        // Usuário ROOT
        $this->rootUser = User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Super Root',
            'email' => 'root@naprancheta.com',
            'role' => 'root',
            'password' => Hash::make('secret123'),
        ]);

        // Usuário Técnico (não root)
        $this->tecnicoUser = User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Técnico Treinador',
            'email' => 'tecnico@naprancheta.com',
            'role' => 'tecnico',
            'password' => Hash::make('secret123'),
        ]);
    }

    public function test_rotas_adversarios_admin_rejeitam_visitante_anonimo_com_401(): void
    {
        $this->getJson('/api/admin/adversarios')->assertStatus(401);
        $this->postJson('/api/admin/adversarios', ['nome' => 'Rival F.C.'])->assertStatus(401);
    }

    public function test_rotas_adversarios_admin_rejeitam_usuario_nao_root_com_403(): void
    {
        Sanctum::actingAs($this->tecnicoUser);

        $this->getJson('/api/admin/adversarios')->assertStatus(403);
        $this->postJson('/api/admin/adversarios', [
            'nome' => 'Rival Proibido',
        ])->assertStatus(403);
    }

    public function test_root_pode_listar_criar_atualizar_e_alternar_status_de_adversarios(): void
    {
        Sanctum::actingAs($this->rootUser);

        // 1. Listagem inicial
        $listResponse = $this->getJson('/api/admin/adversarios');
        $listResponse->assertStatus(200);

        // 2. Criar novo adversário
        $createResponse = $this->postJson('/api/admin/adversarios', [
            'nome' => 'Real Matismo F.C.',
            'responsavel_nome' => 'Marcos Capitão',
            'responsavel_telefone' => '11999998888',
            'cor_uniforme_principal' => 'Azul e Branco',
            'observacoes' => 'Time tradicional da várzea da zona oeste.',
        ]);

        $createResponse->assertStatus(201)
            ->assertJsonPath('adversario.nome', 'Real Matismo F.C.')
            ->assertJsonPath('adversario.responsavel_nome', 'Marcos Capitão')
            ->assertJsonPath('adversario.ativo', true);

        $adversarioId = $createResponse->json('adversario.id');
        $this->assertNotEmpty($adversarioId);

        // 3. Atualizar adversário
        $updateResponse = $this->putJson("/api/admin/adversarios/{$adversarioId}", [
            'nome' => 'Real Matismo Futebol Clube',
            'cor_uniforme_principal' => 'Azul Marinho',
        ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('adversario.nome', 'Real Matismo Futebol Clube')
            ->assertJsonPath('adversario.cor_uniforme_principal', 'Azul Marinho');

        // 4. Alternar status (inativar)
        $toggleResponse = $this->patchJson("/api/admin/adversarios/{$adversarioId}/status");
        $toggleResponse->assertStatus(200)
            ->assertJsonPath('adversario.ativo', false);

        // 5. Alternar status novamente (reativar)
        $toggleBackResponse = $this->patchJson("/api/admin/adversarios/{$adversarioId}/status");
        $toggleBackResponse->assertStatus(200)
            ->assertJsonPath('adversario.ativo', true);
    }

    public function test_validacao_rejeita_adversario_com_nome_duplicado_no_mesmo_time(): void
    {
        Sanctum::actingAs($this->rootUser);

        Adversario::create([
            'id' => (string) Str::uuid(),
            'time_id' => $this->time?->id,
            'nome' => 'Unidos da Vila',
            'ativo' => true,
        ]);

        $response = $this->postJson('/api/admin/adversarios', [
            'nome' => 'Unidos da Vila',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nome']);
    }

    public function test_usuario_autenticado_pode_listar_adversarios_ativos_em_rota_geral(): void
    {
        Sanctum::actingAs($this->tecnicoUser);

        Adversario::create([
            'id' => (string) Str::uuid(),
            'time_id' => $this->time?->id,
            'nome' => 'Rival Ativo',
            'ativo' => true,
        ]);

        Adversario::create([
            'id' => (string) Str::uuid(),
            'time_id' => $this->time?->id,
            'nome' => 'Rival Desativado',
            'ativo' => false,
        ]);

        $response = $this->getJson('/api/adversarios');
        $response->assertStatus(200);

        $data = $response->json();
        $this->assertIsArray($data);

        $nomes = collect($data)->pluck('nome')->all();
        $this->assertContains('Rival Ativo', $nomes);
        $this->assertNotContains('Rival Desativado', $nomes);
    }

    public function test_root_pode_criar_partida_vinculada_a_um_adversario_id(): void
    {
        Sanctum::actingAs($this->rootUser);

        $adv = Adversario::create([
            'id' => (string) Str::uuid(),
            'time_id' => $this->time?->id,
            'nome' => 'Sport Club Boêmios',
            'cor_uniforme_principal' => 'Verde e Branco',
            'ativo' => true,
        ]);

        $response = $this->postJson('/api/admin/partidas', [
            'adversario_id' => $adv->id,
            'adversario' => $adv->nome,
            'data_partida' => '2026-10-20',
            'horario_inicio' => '21:00',
            'local_nome' => 'Arena Central',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('partida.adversario_id', $adv->id)
            ->assertJsonPath('partida.adversario', 'Sport Club Boêmios');

        $partidaId = $response->json('partida.id');
        $partida = Partida::find($partidaId);
        $this->assertNotNull($partida);
        $this->assertEquals($adv->id, $partida->adversario_id);
        $this->assertEquals($adv->nome, $partida->adversarioRel->nome);
    }
}
