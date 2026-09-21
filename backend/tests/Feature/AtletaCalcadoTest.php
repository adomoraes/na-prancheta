<?php

namespace Tests\Feature;

use App\Models\Atleta;
use App\Models\User;
use Database\Seeders\LegacyInitialDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AtletaCalcadoTest extends TestCase
{
    use RefreshDatabase;

    protected User $rootUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(LegacyInitialDataSeeder::class);

        $this->rootUser = User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Super Root',
            'email' => 'root@naprancheta.com',
            'role' => 'root',
            'password' => Hash::make('secret123'),
        ]);
    }

    public function test_atleta_pode_ser_criado_com_numero_calcado_valido(): void
    {
        Sanctum::actingAs($this->rootUser);

        $response = $this->postJson('/api/admin/atletas', [
            'nome' => 'Atleta Calçado 41',
            'apelido' => 'Pé de Anjo',
            'numero_camisa' => 31,
            'posicao_principal' => 'MEI',
            'tipo_vinculo' => 'mensalista',
            'numero_calcado' => 41,
        ]);

        $response->assertStatus(201);
        $atletaId = $response->json('atleta.id');
        $this->assertNotNull($atletaId);

        $atleta = Atleta::find($atletaId);
        $this->assertNotNull($atleta);
        $this->assertEquals(41, $atleta->numero_calcado);

        $listResponse = $this->getJson('/api/admin/atletas');
        $listResponse->assertStatus(200);
        $listResponse->assertJsonFragment([
            'id' => $atletaId,
            'numero_calcado' => 41,
        ]);
    }

    public function test_atleta_pode_ser_criado_sem_numero_calcado_como_nulo(): void
    {
        Sanctum::actingAs($this->rootUser);

        $response = $this->postJson('/api/admin/atletas', [
            'nome' => 'Atleta Sem Calçado',
            'apelido' => 'Descalço',
            'numero_camisa' => 32,
            'posicao_principal' => 'ZAG',
            'tipo_vinculo' => 'mensalista',
        ]);

        $response->assertStatus(201);
        $atletaId = $response->json('atleta.id');
        $atleta = Atleta::find($atletaId);
        $this->assertNull($atleta->numero_calcado);
    }

    public function test_validacao_rejeita_numero_calcado_fora_dos_limites(): void
    {
        Sanctum::actingAs($this->rootUser);

        // Menor que 25
        $resMenor = $this->postJson('/api/admin/atletas', [
            'nome' => 'Atleta Menor',
            'apelido' => 'Menor',
            'numero_camisa' => 33,
            'posicao_principal' => 'VOL',
            'numero_calcado' => 24,
        ]);
        $resMenor->assertStatus(422);
        $resMenor->assertJsonValidationErrors('numero_calcado');

        // Maior que 50
        $resMaior = $this->postJson('/api/admin/atletas', [
            'nome' => 'Atleta Maior',
            'apelido' => 'Maior',
            'numero_camisa' => 34,
            'posicao_principal' => 'VOL',
            'numero_calcado' => 51,
        ]);
        $resMaior->assertStatus(422);
        $resMaior->assertJsonValidationErrors('numero_calcado');

        // Não numérico
        $resString = $this->postJson('/api/admin/atletas', [
            'nome' => 'Atleta String',
            'apelido' => 'String',
            'numero_camisa' => 35,
            'posicao_principal' => 'VOL',
            'numero_calcado' => 'quarenta',
        ]);
        $resString->assertStatus(422);
        $resString->assertJsonValidationErrors('numero_calcado');
    }

    public function test_atleta_pode_ter_numero_calcado_atualizado(): void
    {
        Sanctum::actingAs($this->rootUser);

        $createResponse = $this->postJson('/api/admin/atletas', [
            'nome' => 'Atleta Para Atualizar',
            'apelido' => 'Atualizavel',
            'numero_camisa' => 36,
            'posicao_principal' => 'ATA',
            'numero_calcado' => 40,
        ]);
        $createResponse->assertStatus(201);
        $atletaId = $createResponse->json('atleta.id');

        $updateResponse = $this->putJson("/api/admin/atletas/{$atletaId}", [
            'numero_calcado' => 42,
        ]);
        $updateResponse->assertStatus(200);

        $atleta = Atleta::find($atletaId);
        $this->assertEquals(42, $atleta->numero_calcado);
    }

    public function test_atleta_controller_store_aceita_numero_calcado(): void
    {
        Sanctum::actingAs($this->rootUser);

        $response = $this->postJson('/api/atletas', [
            'nome' => 'Atleta Onboarding Público',
            'apelido' => 'Novo',
            'numero_camisa' => 37,
            'posicao_principal' => 'LAT',
            'numero_calcado' => 39,
        ]);

        $response->assertStatus(201);
        $atletaId = $response->json('id');
        $atleta = Atleta::find($atletaId);
        $this->assertNotNull($atleta);
        $this->assertEquals(39, $atleta->numero_calcado);
    }
}
