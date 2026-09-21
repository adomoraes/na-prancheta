<?php

namespace Tests\Feature;

use App\Models\Atleta;
use App\Models\Partida;
use App\Models\User;
use Database\Seeders\LegacyInitialDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RouteAuthProtectionTest extends TestCase
{
    use RefreshDatabase;

    protected Partida $partida;
    protected Atleta $atleta;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(LegacyInitialDataSeeder::class);
        $this->partida = Partida::firstOrFail();
        $this->atleta = Atleta::firstOrFail();
    }

    public function test_rotas_de_leitura_basica_sao_publicas_para_visitantes(): void
    {
        $id = $this->partida->id;

        // 1. Ficha do jogo e vestiário
        $this->getJson("/api/partidas/{$id}")->assertStatus(200);
        $this->getJson("/api/partidas/{$id}/protocolo-vestiario")->assertStatus(200);

        // 2. Outras consultas de leitura
        $this->getJson("/api/partidas/{$id}/escalacao")->assertStatus(200);
        $this->getJson("/api/partidas/{$id}/vaquinha")->assertStatus(200);
        $this->getJson("/api/partidas/{$id}/almoxarifado")->assertStatus(200);
        $this->getJson("/api/partidas/{$id}/scouts")->assertStatus(200);
        $this->getJson('/api/atletas')->assertStatus(200);
    }

    public function test_requisicoes_anonimas_em_presencas_retornam_401(): void
    {
        $id = $this->partida->id;
        $atletaId = $this->atleta->id;

        $this->postJson("/api/partidas/{$id}/presencas", [
            'atleta_id' => $atletaId,
            'status' => 'confirmado',
        ])->assertStatus(401);

        $this->postJson("/api/partidas/{$id}/presencas/{$atletaId}/chegada", [
            'chegou_as' => '07:45',
        ])->assertStatus(401);
    }

    public function test_requisicoes_anonimas_em_escalacao_retornam_401(): void
    {
        $id = $this->partida->id;

        $this->postJson("/api/partidas/{$id}/escalacao", [
            'esquema' => '4-3-3',
            'titulares' => [],
        ])->assertStatus(401);
    }

    public function test_requisicoes_anonimas_em_vaquinha_retornam_401(): void
    {
        $id = $this->partida->id;
        $atletaId = $this->atleta->id;

        $this->postJson("/api/partidas/{$id}/vaquinha/{$atletaId}/baixa", [
            'comprovante' => 'PIX 123',
        ])->assertStatus(401);

        $this->postJson("/api/partidas/{$id}/vaquinha/encerrar", [
            'chave_pix' => 'time@pix.com',
        ])->assertStatus(401);
    }

    public function test_requisicoes_anonimas_em_almoxarifado_retornam_401(): void
    {
        $id = $this->partida->id;

        $this->postJson("/api/partidas/{$id}/almoxarifado/fechar-malas", [
            'conferido_por' => 'Carlos',
        ])->assertStatus(401);
    }

    public function test_requisicoes_anonimas_em_scouts_retornam_401(): void
    {
        $id = $this->partida->id;
        $atletaId = $this->atleta->id;

        $this->postJson("/api/partidas/{$id}/scouts/{$atletaId}", [
            'gols' => 1,
            'assistencias' => 0,
        ])->assertStatus(401);
    }

    public function test_requisicoes_anonimas_em_atletas_retornam_401(): void
    {
        $this->postJson('/api/atletas', [
            'nome' => 'Novo Atleta',
            'apelido' => 'Novato',
            'phone' => '11999998888',
            'camisa' => 99,
            'pos_p' => 'CA',
            'pos_s' => 'MEI',
            'vinculo' => 'convidado',
        ])->assertStatus(401);
    }

    public function test_requisicoes_autenticadas_com_token_valido_conseguem_mutar_presenca(): void
    {
        $user = User::where('role', 'atleta')->first();
        Sanctum::actingAs($user);

        $id = $this->partida->id;
        $atletaId = $this->atleta->id;

        $response = $this->postJson("/api/partidas/{$id}/presencas", [
            'atleta_id' => $atletaId,
            'status' => 'confirmado',
        ]);

        $response->assertStatus(200);
    }
}
