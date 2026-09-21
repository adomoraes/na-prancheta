<?php

namespace Tests\Feature;

use App\Models\InvestorLead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvestorLeadTest extends TestCase
{
    use RefreshDatabase;

    private User $rootUser;
    private User $atletaUser;

    protected function setUp(): void
    {
        parent::setUp();

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

    public function test_investor_can_submit_lead_successfully(): void
    {
        $payload = [
            'nome' => 'Eduardo Marinho',
            'email' => 'eduardo@sportsventures.com',
            'telefone' => '+55 11 98765-4321',
            'tipo_investidor' => 'fundo_vc',
            'ticket_estimado' => '200k_1m',
            'mensagem' => 'Adorei a proposta cultural do Na Prancheta. Gostaria de agendar call.',
        ];

        $response = $this->postJson('/api/leads/investor', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Lead registrado com sucesso. Nossa equipe entrará em contato em breve.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'nome',
                    'tipo_investidor',
                    'created_at',
                ],
            ]);

        $this->assertDatabaseHas('investor_leads', [
            'nome' => 'Eduardo Marinho',
            'email' => 'eduardo@sportsventures.com',
            'telefone' => '+55 11 98765-4321',
            'tipo_investidor' => 'fundo_vc',
            'ticket_estimado' => '200k_1m',
            'status' => 'novo',
            'origem' => 'landing_page',
        ]);
    }

    public function test_investor_lead_submission_validates_required_fields(): void
    {
        $response = $this->postJson('/api/leads/investor', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nome', 'email', 'telefone', 'tipo_investidor']);
    }

    public function test_investor_lead_submission_validates_invalid_tipo_investidor(): void
    {
        $response = $this->postJson('/api/leads/investor', [
            'nome' => 'Investidor Teste',
            'email' => 'teste@investidor.com',
            'telefone' => '11999999999',
            'tipo_investidor' => 'tipo_inexistente',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tipo_investidor']);
    }

    public function test_admin_can_list_investor_leads(): void
    {
        InvestorLead::create([
            'nome' => 'Lead Antigo',
            'email' => 'lead1@invest.com',
            'telefone' => '11999991111',
            'tipo_investidor' => 'anjo',
            'ticket_estimado' => 'ate_50k',
        ]);

        InvestorLead::create([
            'nome' => 'Lead Novo',
            'email' => 'lead2@invest.com',
            'telefone' => '11999992222',
            'tipo_investidor' => 'fundo_vc',
            'ticket_estimado' => 'acima_1m',
        ]);

        $token = $this->rootUser->createToken('admin-test')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/leads/investor');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => ['id', 'nome', 'email', 'telefone', 'tipo_investidor', 'ticket_estimado', 'status'],
                    ],
                ],
            ]);
    }

    public function test_unauthenticated_or_non_admin_cannot_list_investor_leads(): void
    {
        $guestResponse = $this->getJson('/api/admin/leads/investor');
        $guestResponse->assertStatus(401);

        $atletaToken = $this->atletaUser->createToken('atleta-test')->plainTextToken;
        $atletaResponse = $this->withHeader('Authorization', 'Bearer ' . $atletaToken)
            ->getJson('/api/admin/leads/investor');
        $atletaResponse->assertStatus(403);
    }
}
