<?php

namespace Tests\Feature;

use App\Models\Atleta;
use App\Models\CaixaMovimentacao;
use App\Models\ConfirmacaoPresenca;
use App\Models\Partida;
use App\Models\PartidaTitular;
use App\Models\PosicaoCampo;
use App\Models\ScoutPartida;
use App\Models\Time;
use App\Models\User;
use App\Models\VaquinhaLancamento;
use Database\Seeders\LegacyInitialDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ParityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(LegacyInitialDataSeeder::class);
        $admin = User::whereIn('role', ['admin', 'geral'])->first();
        if ($admin) {
            Sanctum::actingAs($admin);
        }
    }

    /**
     * PT-001: Confirmação de Presença e Transbordamento para Lista de Espera
     */
    public function test_pt001_confirmacao_presenca_dentro_do_teto_e_transbordamento_para_lista_espera(): void
    {
        $partidaId = '33333333-3333-3333-3333-333333333333';
        $partida = Partida::findOrFail($partidaId);
        $partida->limite_confirmados = 2;
        $partida->save();

        // Limpa presenças prévias para testar o limite
        ConfirmacaoPresenca::where('partida_id', $partidaId)->delete();

        $atletas = Atleta::take(3)->get();

        // Atleta 1 confirma -> confirmado
        $resp1 = $this->postJson("/api/partidas/{$partidaId}/presencas", [
            'atleta_id' => $atletas[0]->id,
            'status' => 'confirmado',
        ]);
        $resp1->assertStatus(200)->assertJson(['status_final' => 'confirmado']);

        // Atleta 2 confirma -> confirmado (atinge limite 2)
        $resp2 = $this->postJson("/api/partidas/{$partidaId}/presencas", [
            'atleta_id' => $atletas[1]->id,
            'status' => 'confirmado',
        ]);
        $resp2->assertStatus(200)->assertJson(['status_final' => 'confirmado']);

        // Atleta 3 confirma -> transborda automaticamente para lista_espera
        $resp3 = $this->postJson("/api/partidas/{$partidaId}/presencas", [
            'atleta_id' => $atletas[2]->id,
            'status' => 'confirmado',
        ]);
        $resp3->assertStatus(200)->assertJson(['status_final' => 'lista_espera']);

        // Idempotência: reprocessar atleta 3 com mesmo status mantém lista_espera
        $resp3Repetido = $this->postJson("/api/partidas/{$partidaId}/presencas", [
            'atleta_id' => $atletas[2]->id,
            'status' => 'lista_espera',
        ]);
        $resp3Repetido->assertStatus(200)->assertJson(['status_final' => 'lista_espera']);

        // Bloqueio de cadastro com camisa duplicada no mesmo time (RN-OE-05 / DEV-003)
        $respCamisaDuplicada = $this->postJson('/api/atletas', [
            'nome' => 'Novo Atleta Clone',
            'apelido' => 'Clone',
            'numero_camisa' => 1, // Lucão já usa a camisa 1
            'posicao_principal' => 'GOL',
            'time_id' => '11111111-1111-1111-1111-111111111111',
        ]);
        $respCamisaDuplicada->assertStatus(422);
    }

    /**
     * PT-002: Linha do Tempo Regressiva e Trava Disciplinar T-35
     */
    public function test_pt002_protocolo_vestiario_e_corte_disciplinar_t35(): void
    {
        $partidaId = '33333333-3333-3333-3333-333333333333';

        // Consulta de protocolo regressivo com mock de horário
        $respProtocolo = $this->getJson("/api/partidas/{$partidaId}/protocolo-vestiario");
        $respProtocolo->assertStatus(200)
            ->assertJsonStructure([
                'partida_id',
                'horario_inicio',
                'tempo_restante_minutos',
                'marco_ativo',
                'sequencia_fisiologica',
            ]);

        // Atleta 12 (Léo Prado) no seeder já chegou após T-35
        $presencaAtrasado = ConfirmacaoPresenca::where('partida_id', $partidaId)
            ->where('atrasado_prelecao_t35', true)
            ->first();

        $this->assertNotNull($presencaAtrasado);
        $this->assertTrue($presencaAtrasado->atrasado_prelecao_t35);

        // Tentativa de escalar titular atrasado deve ser barrada com 422
        $respEscalacao = $this->postJson("/api/partidas/{$partidaId}/escalacao", [
            'titulares' => [
                ['atleta_id' => $presencaAtrasado->atleta_id, 'posicao_campo_id' => 10],
            ],
        ]);
        $respEscalacao->assertStatus(422)
            ->assertJsonFragment([
                'message' => "O atleta {$presencaAtrasado->atleta->nome} chegou após T-35 e sofreu corte disciplinar para o banco de reservas."
            ]);
    }

    /**
     * PT-003: Escalação Tática 4-3-3 e Teto Rígido de 11 Titulares
     */
    public function test_pt003_escalacao_tatica_e_teto_de_11_titulares(): void
    {
        $partidaId = '33333333-3333-3333-3333-333333333333';

        // Obter atletas confirmados e pontuais
        $atletasPontuais = ConfirmacaoPresenca::where('partida_id', $partidaId)
            ->where('status', 'confirmado')
            ->where('atrasado_prelecao_t35', false)
            ->take(11)
            ->pluck('atleta_id')
            ->toArray();

        // 1. Escalação válida de 11 titulares
        $titularesPayload = [];
        foreach ($atletasPontuais as $idx => $atletaId) {
            $titularesPayload[] = [
                'atleta_id' => $atletaId,
                'posicao_campo_id' => $idx + 1,
            ];
        }

        $respValida = $this->postJson("/api/partidas/{$partidaId}/escalacao", [
            'titulares' => $titularesPayload,
        ]);
        $respValida->assertStatus(200)->assertJson(['total_titulares' => 11]);

        // 2. Rejeição de tentativa de escalar 12 titulares (teto regulamentar)
        $atletaExtra = Atleta::whereNotIn('id', $atletasPontuais)->first();
        $titularesInvalido = $titularesPayload;
        $titularesInvalido[] = [
            'atleta_id' => $atletaExtra->id,
            'posicao_campo_id' => 1,
        ];

        $respExcedente = $this->postJson("/api/partidas/{$partidaId}/escalacao", [
            'titulares' => $titularesInvalido,
        ]);
        $respExcedente->assertStatus(422);
    }

    /**
     * PT-004: Rateio da Vaquinha, Quitação PIX e Excedente no Caixa Geral
     */
    public function test_pt004_vaquinha_pix_e_destinacao_ao_caixa_geral(): void
    {
        $partidaId = '33333333-3333-3333-3333-333333333333';

        // 1. Quitar todos os lançamentos para gerar excedente
        $lancamentosPendentes = VaquinhaLancamento::where('partida_id', $partidaId)
            ->where('status', 'pendente')
            ->get();

        foreach ($lancamentosPendentes as $lanc) {
            $respBaixa = $this->postJson("/api/partidas/{$partidaId}/vaquinha/{$lanc->atleta_id}/baixa");
            $respBaixa->assertStatus(200);
        }

        // Idempotência de baixa repetida
        $primeiroAtleta = $lancamentosPendentes->first()->atleta_id;
        $respRepetida = $this->postJson("/api/partidas/{$partidaId}/vaquinha/{$primeiroAtleta}/baixa");
        $respRepetida->assertStatus(200)->assertJsonFragment(['message' => 'Lançamento já quitado anteriormente.']);

        // 2. Encerrar vaquinha e verificar destinação do excedente ao Caixa Geral (BR-HUMANA-003)
        // 15 atletas x R$ 25,00 = R$ 375,00 (37500 centavos) vs meta R$ 300,00 (30000 centavos) -> excedente R$ 75,00 (7500 centavos)
        $respEncerramento = $this->postJson("/api/partidas/{$partidaId}/vaquinha/encerrar");
        $respEncerramento->assertStatus(200)
            ->assertJson([
                'total_arrecadado_centavos' => 37500,
                'meta_paga_centavos' => 30000,
                'saldo_excedente_centavos' => 7500,
            ]);

        $this->assertDatabaseHas('caixa_movimentacoes', [
            'partida_id' => $partidaId,
            'tipo' => 'credito_excedente_partida',
            'valor_centavos' => 7500,
        ]);
    }

    /**
     * PT-005: Almoxarifado, Conferência de Fardamento e Trava da Resenha
     */
    public function test_pt005_almoxarifado_conferencia_e_trava_da_resenha(): void
    {
        $partidaId = '33333333-3333-3333-3333-333333333333';

        // 1. Falha se faltar camisas (ex: 20 em vez de 22)
        $respFaltaCamisa = $this->postJson("/api/partidas/{$partidaId}/almoxarifado/fechar-malas", [
            'camisas_recolhidas' => 20,
            'todas_camisas_desviradas' => true,
            'bolas_recolhidas' => 6,
            'kit_cones_recolhido' => true,
            'mala_trancada_no_carro' => true,
        ]);
        $respFaltaCamisa->assertStatus(422)
            ->assertJsonFragment(['resenha_liberada' => false]);

        // 2. Falha se houver camisa do avesso
        $respCamisaAvesso = $this->postJson("/api/partidas/{$partidaId}/almoxarifado/fechar-malas", [
            'camisas_recolhidas' => 22,
            'todas_camisas_desviradas' => false,
            'bolas_recolhidas' => 6,
            'kit_cones_recolhido' => true,
            'mala_trancada_no_carro' => true,
        ]);
        $respCamisaAvesso->assertStatus(422);

        // 3. Sucesso com a tríplice conferência completa
        $respSucesso = $this->postJson("/api/partidas/{$partidaId}/almoxarifado/fechar-malas", [
            'camisas_recolhidas' => 22,
            'todas_camisas_desviradas' => true,
            'bolas_recolhidas' => 6,
            'kit_cones_recolhido' => true,
            'mala_trancada_no_carro' => true,
        ]);
        $respSucesso->assertStatus(200)
            ->assertJson([
                'resenha_liberada' => true,
                'message' => 'Tríplice conferência aprovada com sucesso! Resenha social liberada.',
            ]);
    }

    /**
     * PT-006: Scout Estatístico e Exclusividade Estrita de MVP
     */
    public function test_pt006_scout_estatistico_e_exclusividade_de_mvp(): void
    {
        $partidaId = '33333333-3333-3333-3333-333333333333';
        $atletas = Atleta::take(2)->get();

        // 1. Rejeição de valores estatísticos negativos
        $respNegativo = $this->postJson("/api/partidas/{$partidaId}/scouts/{$atletas[0]->id}", [
            'gols' => -1,
        ]);
        $respNegativo->assertStatus(422);

        // 2. Eleger atleta 0 como MVP
        $respMvp1 = $this->postJson("/api/partidas/{$partidaId}/scouts/{$atletas[0]->id}", [
            'gols' => 2,
            'assistencias' => 1,
            'foi_mvp' => true,
        ]);
        $respMvp1->assertStatus(200);

        $this->assertEquals(1, ScoutPartida::where('partida_id', $partidaId)->where('foi_mvp', true)->count());
        $this->assertTrue(ScoutPartida::where('partida_id', $partidaId)->where('atleta_id', $atletas[0]->id)->value('foi_mvp'));

        // 3. Eleger atleta 1 como novo MVP revoga automaticamente do atleta 0
        $respMvp2 = $this->postJson("/api/partidas/{$partidaId}/scouts/{$atletas[1]->id}", [
            'gols' => 3,
            'foi_mvp' => true,
        ]);
        $respMvp2->assertStatus(200);

        // Continua existindo rigorosamente apenas 1 MVP na partida
        $this->assertEquals(1, ScoutPartida::where('partida_id', $partidaId)->where('foi_mvp', true)->count());
        $this->assertFalse(ScoutPartida::where('partida_id', $partidaId)->where('atleta_id', $atletas[0]->id)->value('foi_mvp'));
        $this->assertTrue(ScoutPartida::where('partida_id', $partidaId)->where('atleta_id', $atletas[1]->id)->value('foi_mvp'));
    }
}
