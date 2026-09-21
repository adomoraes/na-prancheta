<?php

namespace Tests\Feature;

use App\Models\ItemAlmoxarifado;
use App\Models\Time;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatrimonioUniformeTest extends TestCase
{
    use RefreshDatabase;

    private User $rootUser;
    private User $atletaUser;
    private Time $time;

    protected function setUp(): void
    {
        parent::setUp();

        $this->time = Time::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'nome' => 'Os Canabis F.C.',
            'escudo_url' => 'https://example.com/escudo.png',
        ]);

        $this->rootUser = User::create([
            'name' => 'Root Admin',
            'email' => 'root@naprancheta.local',
            'password' => bcrypt('secret123'),
            'role' => 'root',
            'phone' => '11999999999',
        ]);

        $this->atletaUser = User::create([
            'name' => 'Atleta Comum',
            'email' => 'atleta@naprancheta.local',
            'password' => bcrypt('secret123'),
            'role' => 'atleta',
            'phone' => '11988888888',
        ]);
    }

    public function test_item_comum_pode_ser_criado_sem_campos_de_uniforme(): void
    {
        $response = $this->actingAs($this->rootUser, 'sanctum')->postJson('/api/admin/patrimonio', [
            'nome' => 'Bola Penalty S11 Campo',
            'categoria' => 'bola',
            'quantidade_total' => 6,
            'estado_conservacao' => 'bom',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('item.nome', 'Bola Penalty S11 Campo')
            ->assertJsonPath('item.categoria', 'bola')
            ->assertJsonPath('item.tipo_uniforme', null);

        $this->assertDatabaseHas('itens_almoxarifado', [
            'nome' => 'Bola Penalty S11 Campo',
            'categoria' => 'bola',
            'quantidade_total' => 6,
        ]);
    }

    public function test_categoria_uniforme_exige_tipo_uniforme_valido(): void
    {
        // Sem tipo_uniforme
        $response = $this->actingAs($this->rootUser, 'sanctum')->postJson('/api/admin/patrimonio', [
            'nome' => 'Camisa de Jogo',
            'categoria' => 'uniforme',
            'quantidade_total' => 1,
            'estado_conservacao' => 'novo',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tipo_uniforme']);

        // Com tipo_uniforme inválido
        $responseInvalido = $this->actingAs($this->rootUser, 'sanctum')->postJson('/api/admin/patrimonio', [
            'nome' => 'Chuteira de Campo',
            'categoria' => 'uniforme',
            'tipo_uniforme' => 'chuteira',
            'quantidade_total' => 1,
            'estado_conservacao' => 'novo',
        ]);

        $responseInvalido->assertStatus(422)
            ->assertJsonValidationErrors(['tipo_uniforme']);
    }

    public function test_categoria_uniformes_no_plural_tambem_valida_tipo_uniforme(): void
    {
        $response = $this->actingAs($this->rootUser, 'sanctum')->postJson('/api/admin/patrimonio', [
            'nome' => 'Meião de Jogo',
            'categoria' => 'uniformes',
            'quantidade_total' => 20,
            'estado_conservacao' => 'novo',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tipo_uniforme']);
    }

    public function test_cadastro_completo_de_uniforme_com_todos_os_campos(): void
    {
        // Exemplo requisitado pelo usuário: 1, GG, Azul, 10, Adidas
        $response = $this->actingAs($this->rootUser, 'sanctum')->postJson('/api/admin/patrimonio', [
            'nome' => 'Camisa 10 Titular',
            'categoria' => 'uniforme',
            'tipo_uniforme' => 'camisa',
            'quantidade_total' => 1,
            'tamanho' => 'GG',
            'cor' => 'Azul',
            'numero' => '10',
            'estado_conservacao' => 'novo',
            'observacoes' => 'Adidas',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('item.nome', 'Camisa 10 Titular')
            ->assertJsonPath('item.categoria', 'uniforme')
            ->assertJsonPath('item.tipo_uniforme', 'camisa')
            ->assertJsonPath('item.quantidade_total', 1)
            ->assertJsonPath('item.tamanho', 'GG')
            ->assertJsonPath('item.cor', 'Azul')
            ->assertJsonPath('item.numero', '10')
            ->assertJsonPath('item.observacoes', 'Adidas');

        $this->assertDatabaseHas('itens_almoxarifado', [
            'nome' => 'Camisa 10 Titular',
            'tipo_uniforme' => 'camisa',
            'tamanho' => 'GG',
            'cor' => 'Azul',
            'numero' => '10',
            'observacoes' => 'Adidas',
        ]);
    }

    public function test_cadastro_de_meiao_e_calcao_como_tipos_validos(): void
    {
        $calcao = $this->actingAs($this->rootUser, 'sanctum')->postJson('/api/admin/patrimonio', [
            'nome' => 'Calção Titular Branco',
            'categoria' => 'uniforme',
            'tipo_uniforme' => 'calcao',
            'quantidade_total' => 15,
            'tamanho' => 'G',
            'cor' => 'Branco',
            'estado_conservacao' => 'bom',
        ]);
        $calcao->assertStatus(201);

        $meiao = $this->actingAs($this->rootUser, 'sanctum')->postJson('/api/admin/patrimonio', [
            'nome' => 'Meião Azul Celeste',
            'categoria' => 'uniformes',
            'tipo_uniforme' => 'meiao',
            'quantidade_total' => 22,
            'tamanho' => 'Único',
            'cor' => 'Azul',
            'estado_conservacao' => 'novo',
        ]);
        $meiao->assertStatus(201);
    }

    public function test_atualizacao_de_item_de_uniforme_via_put(): void
    {
        $item = ItemAlmoxarifado::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'time_id' => $this->time->id,
            'nome' => 'Camisa 7 Reserva',
            'categoria' => 'uniforme',
            'tipo_uniforme' => 'camisa',
            'quantidade_total' => 1,
            'tamanho' => 'M',
            'cor' => 'Branca',
            'numero' => '7',
            'estado_conservacao' => 'bom',
            'observacoes' => 'Sem patrocinio',
            'ativo' => true,
        ]);

        $response = $this->actingAs($this->rootUser, 'sanctum')->putJson("/api/admin/patrimonio/{$item->id}", [
            'tamanho' => 'G',
            'observacoes' => 'Atualizado com patrocínio master',
            'estado_conservacao' => 'regular',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('item.tamanho', 'G')
            ->assertJsonPath('item.observacoes', 'Atualizado com patrocínio master')
            ->assertJsonPath('item.estado_conservacao', 'regular');

        $this->assertDatabaseHas('itens_almoxarifado', [
            'id' => $item->id,
            'tamanho' => 'G',
            'observacoes' => 'Atualizado com patrocínio master',
        ]);
    }
}
