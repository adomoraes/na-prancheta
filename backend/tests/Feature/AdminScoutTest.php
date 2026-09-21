<?php

namespace Tests\Feature;

use App\Models\Atleta;
use App\Models\Partida;
use App\Models\ScoutPartida;
use App\Models\Time;
use App\Models\User;
use Database\Seeders\LegacyInitialDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminScoutTest extends TestCase
{
    use RefreshDatabase;

    protected User $rootUser;
    protected User $tecnicoUser;
    protected Partida $partida;
    protected Atleta $atleta1;
    protected Atleta $atleta2;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(LegacyInitialDataSeeder::class);

        $this->partida = Partida::firstOrFail();
        $atletas = Atleta::take(2)->get();
        $this->atleta1 = $atletas[0];
        $this->atleta2 = $atletas[1];

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

    public function test_rotas_scouts_admin_rejeitam_visitante_anonimo_com_401(): void
    {
        $this->getJson('/api/admin/scouts')->assertStatus(401);
        $this->getJson('/api/admin/scouts/leaderboard')->assertStatus(401);
        $this->postJson('/api/admin/scouts', [])->assertStatus(401);
        $this->putJson('/api/admin/scouts/dummy-id', [])->assertStatus(401);
        $this->deleteJson('/api/admin/scouts/dummy-id')->assertStatus(401);
    }

    public function test_rotas_scouts_admin_rejeitam_usuario_nao_root_com_403(): void
    {
        Sanctum::actingAs($this->tecnicoUser);

        $this->getJson('/api/admin/scouts')->assertStatus(403);
        $this->getJson('/api/admin/scouts/leaderboard')->assertStatus(403);
        $this->postJson('/api/admin/scouts', [])->assertStatus(403);
        $this->putJson('/api/admin/scouts/dummy-id', [])->assertStatus(403);
        $this->deleteJson('/api/admin/scouts/dummy-id')->assertStatus(403);
    }

    public function test_root_pode_listar_scouts_e_filtrar_por_partida_e_atleta(): void
    {
        Sanctum::actingAs($this->rootUser);

        $response = $this->getJson('/api/admin/scouts');
        $response->assertStatus(200);
        $this->assertIsArray($response->json());

        // Filtrar por partida_id
        $respPartida = $this->getJson('/api/admin/scouts?partida_id=' . $this->partida->id);
        $respPartida->assertStatus(200);
        foreach ($respPartida->json() as $item) {
            $this->assertEquals($this->partida->id, $item['partida_id']);
        }

        // Filtrar por atleta_id
        $respAtleta = $this->getJson('/api/admin/scouts?atleta_id=' . $this->atleta1->id);
        $respAtleta->assertStatus(200);
        foreach ($respAtleta->json() as $item) {
            $this->assertEquals($this->atleta1->id, $item['atleta_id']);
        }
    }

    public function test_root_pode_obter_leaderboard_consolidado_de_scouts(): void
    {
        Sanctum::actingAs($this->rootUser);

        $response = $this->getJson('/api/admin/scouts/leaderboard');
        $response->assertStatus(200);

        $leaderboard = $response->json();
        $this->assertIsArray($leaderboard);
        $this->assertNotEmpty($leaderboard);

        // Verifica propriedades obrigatórias do leaderboard
        $primeiro = $leaderboard[0];
        $this->assertArrayHasKey('atleta_id', $primeiro);
        $this->assertArrayHasKey('atleta_nome', $primeiro);
        $this->assertArrayHasKey('jogos', $primeiro);
        $this->assertArrayHasKey('gols', $primeiro);
        $this->assertArrayHasKey('assistencias', $primeiro);
        $this->assertArrayHasKey('participacoes_gols', $primeiro);
        $this->assertArrayHasKey('mvps', $primeiro);
    }

    public function test_root_pode_criar_ou_atualizar_scout_com_sucesso(): void
    {
        Sanctum::actingAs($this->rootUser);

        $payload = [
            'partida_id' => $this->partida->id,
            'atleta_id' => $this->atleta1->id,
            'gols' => 3,
            'assistencias' => 2,
            'cartoes_amarelos' => 1,
            'cartoes_vermelhos' => 0,
            'gols_sofridos_goleiro' => 0,
            'minutos_jogados' => 75,
            'foi_mvp' => true,
        ];

        $response = $this->postJson('/api/admin/scouts', $payload);
        $response->assertStatus(201);
        $response->assertJsonPath('scout.gols', 3);
        $response->assertJsonPath('scout.assistencias', 2);
        $response->assertJsonPath('scout.foi_mvp', true);

        $this->assertDatabaseHas('scouts_partida', [
            'partida_id' => $this->partida->id,
            'atleta_id' => $this->atleta1->id,
            'gols' => 3,
            'assistencias' => 2,
            'foi_mvp' => true,
        ]);
    }

    public function test_criacao_ou_edicao_com_mvp_garante_exclusividade_estrita_na_mesma_partida(): void
    {
        Sanctum::actingAs($this->rootUser);

        // Atleta 1 eleito MVP
        $this->postJson('/api/admin/scouts', [
            'partida_id' => $this->partida->id,
            'atleta_id' => $this->atleta1->id,
            'gols' => 2,
            'foi_mvp' => true,
        ])->assertStatus(201);

        $this->assertTrue(
            ScoutPartida::where('partida_id', $this->partida->id)
                ->where('atleta_id', $this->atleta1->id)
                ->value('foi_mvp')
        );

        // Atleta 2 eleito MVP na mesma partida
        $this->postJson('/api/admin/scouts', [
            'partida_id' => $this->partida->id,
            'atleta_id' => $this->atleta2->id,
            'gols' => 1,
            'foi_mvp' => true,
        ])->assertStatus(201);

        // O Atleta 1 agora NÃO deve ser MVP, e Atleta 2 DEVE ser MVP
        $this->assertFalse(
            ScoutPartida::where('partida_id', $this->partida->id)
                ->where('atleta_id', $this->atleta1->id)
                ->value('foi_mvp')
        );
        $this->assertTrue(
            ScoutPartida::where('partida_id', $this->partida->id)
                ->where('atleta_id', $this->atleta2->id)
                ->value('foi_mvp')
        );

        // Apenas 1 MVP no total para esta partida
        $this->assertEquals(
            1,
            ScoutPartida::where('partida_id', $this->partida->id)
                ->where('foi_mvp', true)
                ->count()
        );
    }

    public function test_validacao_rejeita_valores_estatisticos_negativos(): void
    {
        Sanctum::actingAs($this->rootUser);

        $payloadInvalido = [
            'partida_id' => $this->partida->id,
            'atleta_id' => $this->atleta1->id,
            'gols' => -2,
        ];

        $response = $this->postJson('/api/admin/scouts', $payloadInvalido);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['gols']);
    }

    public function test_root_pode_atualizar_e_excluir_scout(): void
    {
        Sanctum::actingAs($this->rootUser);

        // Cria o scout
        $createResp = $this->postJson('/api/admin/scouts', [
            'partida_id' => $this->partida->id,
            'atleta_id' => $this->atleta1->id,
            'gols' => 1,
            'assistencias' => 0,
        ]);
        $scoutId = $createResp->json('scout.id');

        // Atualiza o scout via PUT
        $updateResp = $this->putJson("/api/admin/scouts/{$scoutId}", [
            'gols' => 4,
            'assistencias' => 3,
        ]);
        $updateResp->assertStatus(200);
        $updateResp->assertJsonPath('scout.gols', 4);
        $updateResp->assertJsonPath('scout.assistencias', 3);

        // Exclui o scout via DELETE
        $deleteResp = $this->deleteJson("/api/admin/scouts/{$scoutId}");
        $deleteResp->assertStatus(200);

        $this->assertDatabaseMissing('scouts_partida', [
            'id' => $scoutId,
        ]);
    }
}
