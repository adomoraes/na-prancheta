<?php

namespace Tests\Feature;

use App\Models\Atleta;
use App\Models\ItemAlmoxarifado;
use App\Models\Partida;
use App\Models\User;
use Database\Seeders\LegacyInitialDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminCrudTest extends TestCase
{
    use RefreshDatabase;

    protected User $rootUser;
    protected User $geralUser;
    protected User $tecnicoUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(LegacyInitialDataSeeder::class);

        // Usuário ROOT
        $this->rootUser = User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Super Root',
            'email' => 'root@naprancheta.com',
            'role' => 'root',
            'password' => Hash::make('secret123'),
        ]);

        // Usuário Geral (Diretoria)
        $this->geralUser = User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Diretor Geral',
            'email' => 'geral@naprancheta.com',
            'role' => 'geral',
            'password' => Hash::make('secret123'),
        ]);

        // Usuário Técnico
        $this->tecnicoUser = User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Técnico Treinador',
            'email' => 'tecnico@naprancheta.com',
            'role' => 'tecnico',
            'password' => Hash::make('secret123'),
        ]);
    }

    public function test_rotas_admin_rejeitam_visitante_anonimo_com_401(): void
    {
        $this->getJson('/api/admin/users')->assertStatus(401);
        $this->getJson('/api/admin/atletas')->assertStatus(401);
        $this->getJson('/api/admin/partidas')->assertStatus(401);
        $this->getJson('/api/admin/caixa')->assertStatus(401);
        $this->getJson('/api/admin/patrimonio')->assertStatus(401);
    }

    public function test_rotas_admin_rejeitam_usuario_nao_root_com_403(): void
    {
        // Técnico tentando acessar
        Sanctum::actingAs($this->tecnicoUser);
        $this->getJson('/api/admin/users')->assertStatus(403);
        $this->postJson('/api/admin/users', ['name' => 'Hack'])->assertStatus(403);

        // Geral (Diretoria) tentando acessar rotas restritas de backoffice exclusivo do ROOT
        Sanctum::actingAs($this->geralUser);
        $this->getJson('/api/admin/users')->assertStatus(403);
        $this->getJson('/api/admin/atletas')->assertStatus(403);
    }

    public function test_usuario_root_tem_acesso_pleno_a_todas_as_rotas_admin(): void
    {
        Sanctum::actingAs($this->rootUser);

        $this->getJson('/api/admin/users')->assertStatus(200);
        $this->getJson('/api/admin/atletas')->assertStatus(200);
        $this->getJson('/api/admin/partidas')->assertStatus(200);
        $this->getJson('/api/admin/caixa')->assertStatus(200);
        $this->getJson('/api/admin/patrimonio')->assertStatus(200);
    }

    public function test_crud_completo_de_usuarios_pelo_root(): void
    {
        Sanctum::actingAs($this->rootUser);

        // 1. Criar novo usuário
        $createResponse = $this->postJson('/api/admin/users', [
            'name' => 'Novo Gerente',
            'email' => 'gerente@naprancheta.com',
            'password' => 'senhaSegura123',
            'role' => 'geral',
        ]);
        $createResponse->assertStatus(201);
        $userId = $createResponse->json('user.id');

        // 2. Atualizar usuário
        $updateResponse = $this->putJson("/api/admin/users/{$userId}", [
            'name' => 'Gerente Atualizado',
            'role' => 'financeiro',
        ]);
        $updateResponse->assertStatus(200);
        $this->assertEquals('Gerente Atualizado', $updateResponse->json('user.name'));

        // 3. Redefinir senha
        $passResponse = $this->patchJson("/api/admin/users/{$userId}/password", [
            'password' => 'novaSenhaForte456',
        ]);
        $passResponse->assertStatus(200);

        // 4. Deletar usuário
        $delResponse = $this->deleteJson("/api/admin/users/{$userId}");
        $delResponse->assertStatus(200);
        $this->assertNull(User::find($userId));
    }

    public function test_crud_de_atletas_com_soft_delete_pelo_root(): void
    {
        Sanctum::actingAs($this->rootUser);

        // 1. Criar atleta
        $createResponse = $this->postJson('/api/admin/atletas', [
            'nome' => 'Atleta Teste Root',
            'apelido' => 'Testinho',
            'numero_camisa' => 77,
            'posicao_principal' => 'ATA',
            'tipo_vinculo' => 'mensalista',
        ]);
        $createResponse->assertStatus(201);
        $atletaId = $createResponse->json('atleta.id');

        // 2. Atualizar atleta
        $updateResponse = $this->putJson("/api/admin/atletas/{$atletaId}", [
            'apelido' => 'Testinho Craque',
            'numero_camisa' => 88,
        ]);
        $updateResponse->assertStatus(200);
        $this->assertEquals('Testinho Craque', $updateResponse->json('atleta.apelido'));

        // 3. Desativar atleta (Soft delete)
        $toggleOff = $this->patchJson("/api/admin/atletas/{$atletaId}/status", [
            'ativo' => false,
        ]);
        $toggleOff->assertStatus(200);
        $atleta = Atleta::find($atletaId);
        $this->assertFalse($atleta->ativo);

        // 4. Reativar atleta
        $toggleOn = $this->patchJson("/api/admin/atletas/{$atletaId}/status", [
            'ativo' => true,
        ]);
        $toggleOn->assertStatus(200);
        $this->assertTrue(Atleta::find($atletaId)->ativo);
    }

    public function test_crud_de_partidas_pelo_root(): void
    {
        Sanctum::actingAs($this->rootUser);

        // 1. Criar partida
        $response = $this->postJson('/api/admin/partidas', [
            'adversario' => 'Adversário Root FC',
            'data_partida' => '2026-11-20',
            'horario_inicio' => '20:00',
            'local_nome' => 'Arena Central',
        ]);
        $response->assertStatus(201);
        $partidaId = $response->json('partida.id');

        // 2. Atualizar partida
        $updateResp = $this->putJson("/api/admin/partidas/{$partidaId}", [
            'local_nome' => 'Arena Central Prime',
            'limite_confirmados' => 18,
        ]);
        $updateResp->assertStatus(200);

        // 3. Alterar status da partida
        $statusResp = $this->patchJson("/api/admin/partidas/{$partidaId}/status", [
            'status' => 'em_andamento',
        ]);
        $statusResp->assertStatus(200);
        $this->assertEquals('em_andamento', Partida::find($partidaId)->status);
    }

    public function test_crud_de_caixa_pelo_root(): void
    {
        Sanctum::actingAs($this->rootUser);

        // 1. Lançar entrada
        $entradaResp = $this->postJson('/api/admin/caixa', [
            'tipo' => 'entrada',
            'valor_centavos' => 50000,
            'descricao' => 'Patrocínio Master Semestral',
        ]);
        $entradaResp->assertStatus(201);

        // 2. Lançar saída
        $saidaResp = $this->postJson('/api/admin/caixa', [
            'tipo' => 'saida',
            'valor_centavos' => 12000,
            'descricao' => 'Compra de novas redes e fitas',
        ]);
        $saidaResp->assertStatus(201);

        // 3. Listar caixa consolidado
        $listResp = $this->getJson('/api/admin/caixa');
        $listResp->assertStatus(200);
        $this->assertArrayHasKey('saldo_centavos', $listResp->json());
        $this->assertArrayHasKey('movimentacoes', $listResp->json());
    }

    public function test_crud_de_patrimonio_pelo_root(): void
    {
        Sanctum::actingAs($this->rootUser);

        // 1. Criar item de patrimônio
        $createResp = $this->postJson('/api/admin/patrimonio', [
            'nome' => 'Cones de Treino Profissional',
            'categoria' => 'cone',
            'quantidade_total' => 20,
            'estado_conservacao' => 'novo',
        ]);
        $createResp->assertStatus(201);
        $itemId = $createResp->json('item.id');

        // 2. Atualizar item
        $updateResp = $this->putJson("/api/admin/patrimonio/{$itemId}", [
            'quantidade_total' => 25,
            'estado_conservacao' => 'bom',
        ]);
        $updateResp->assertStatus(200);
        $this->assertEquals(25, $updateResp->json('item.quantidade_total'));

        // 3. Deletar item
        $delResp = $this->deleteJson("/api/admin/patrimonio/{$itemId}");
        $delResp->assertStatus(200);
        $this->assertNull(ItemAlmoxarifado::find($itemId));
    }
}
