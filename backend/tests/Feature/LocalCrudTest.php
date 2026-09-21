<?php

namespace Tests\Feature;

use App\Models\Local;
use App\Models\Partida;
use App\Models\Time;
use App\Models\User;
use Database\Seeders\LegacyInitialDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LocalCrudTest extends TestCase
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

    public function test_rotas_locais_admin_rejeitam_visitante_anonimo_com_401(): void
    {
        $this->getJson('/api/admin/locais')->assertStatus(401);
        $this->postJson('/api/admin/locais', ['nome' => 'Arena Teste'])->assertStatus(401);
    }

    public function test_rotas_locais_admin_rejeitam_usuario_nao_root_com_403(): void
    {
        Sanctum::actingAs($this->tecnicoUser);

        $this->getJson('/api/admin/locais')->assertStatus(403);
        $this->postJson('/api/admin/locais', [
            'nome' => 'Arena Invasor',
        ])->assertStatus(403);
    }

    public function test_root_pode_listar_criar_atualizar_e_alternar_status_de_locais(): void
    {
        Sanctum::actingAs($this->rootUser);

        // 1. Listagem inicial (deve vir array)
        $listResponse = $this->getJson('/api/admin/locais');
        $listResponse->assertStatus(200);

        // 2. Criar novo local
        $createResponse = $this->postJson('/api/admin/locais', [
            'nome' => 'Arena Playball Pompeia',
            'endereco' => 'Rua Nicholas Boer, 120 - Pompeia, SP',
            'maps_url' => 'https://maps.google.com/?q=playball+pompeia',
            'tipo_piso' => 'Grama Sintética',
            'observacoes' => 'Campo com churrasqueira e estacionamento.',
        ]);

        $createResponse->assertStatus(201)
            ->assertJsonPath('local.nome', 'Arena Playball Pompeia')
            ->assertJsonPath('local.tipo_piso', 'Grama Sintética')
            ->assertJsonPath('local.ativo', true);

        $localId = $createResponse->json('local.id');
        $this->assertNotEmpty($localId);

        // 3. Atualizar local
        $updateResponse = $this->putJson("/api/admin/locais/{$localId}", [
            'nome' => 'Arena Playball Pompeia - Campo Society 1',
            'endereco' => 'Rua Nicholas Boer, 120 - Pompeia, SP',
            'tipo_piso' => 'Society',
        ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('local.nome', 'Arena Playball Pompeia - Campo Society 1')
            ->assertJsonPath('local.tipo_piso', 'Society');

        // 4. Alternar status (inativar)
        $toggleResponse = $this->patchJson("/api/admin/locais/{$localId}/status");
        $toggleResponse->assertStatus(200)
            ->assertJsonPath('local.ativo', false);

        // 5. Alternar status novamente (reativar)
        $toggleBackResponse = $this->patchJson("/api/admin/locais/{$localId}/status");
        $toggleBackResponse->assertStatus(200)
            ->assertJsonPath('local.ativo', true);
    }

    public function test_validacao_rejeita_local_com_nome_duplicado_no_mesmo_time(): void
    {
        Sanctum::actingAs($this->rootUser);

        Local::create([
            'id' => (string) Str::uuid(),
            'time_id' => $this->time?->id,
            'nome' => 'Campo da Represa',
            'ativo' => true,
        ]);

        $response = $this->postJson('/api/admin/locais', [
            'nome' => 'Campo da Represa',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nome']);
    }

    public function test_usuario_autenticado_pode_listar_locais_ativos_em_rota_geral(): void
    {
        Sanctum::actingAs($this->tecnicoUser);

        Local::create([
            'id' => (string) Str::uuid(),
            'time_id' => $this->time?->id,
            'nome' => 'Campo Ativo',
            'ativo' => true,
        ]);

        Local::create([
            'id' => (string) Str::uuid(),
            'time_id' => $this->time?->id,
            'nome' => 'Campo Inativo',
            'ativo' => false,
        ]);

        $response = $this->getJson('/api/locais');
        $response->assertStatus(200);

        $data = $response->json();
        $this->assertIsArray($data);

        $nomes = collect($data)->pluck('nome')->all();
        $this->assertContains('Campo Ativo', $nomes);
        $this->assertNotContains('Campo Inativo', $nomes);
    }

    public function test_root_pode_criar_partida_vinculada_a_um_local_id(): void
    {
        Sanctum::actingAs($this->rootUser);

        $local = Local::create([
            'id' => (string) Str::uuid(),
            'time_id' => $this->time?->id,
            'nome' => 'Ninho do Corvo',
            'endereco' => 'Av. Morumbi, 500',
            'maps_url' => 'https://maps.google.com/?q=ninho',
            'ativo' => true,
        ]);

        $response = $this->postJson('/api/admin/partidas', [
            'adversario' => 'Unidos da Vila',
            'data_partida' => '2026-10-15',
            'horario_inicio' => '20:30',
            'local_id' => $local->id,
            'local_nome' => $local->nome,
            'local_endereco' => $local->endereco,
            'local_maps_url' => $local->maps_url,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('partida.local_id', $local->id)
            ->assertJsonPath('partida.local_nome', 'Ninho do Corvo');

        $partidaId = $response->json('partida.id');
        $partida = Partida::find($partidaId);
        $this->assertNotNull($partida);
        $this->assertEquals($local->id, $partida->local_id);
        $this->assertEquals($local->nome, $partida->local->nome);
    }
}
