<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaixaMovimentacao;
use App\Models\Partida;
use App\Models\VaquinhaLancamento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VaquinhaController extends Controller
{
    public function getVaquinha(string $partidaId): JsonResponse
    {
        $partida = Partida::findOrFail($partidaId);
        $lancamentos = VaquinhaLancamento::with(['atleta', 'tesoureiro'])
            ->where('partida_id', $partida->id)
            ->get();

        $totalArrecadadoCentavos = $lancamentos->where('status', 'pago')->sum('valor_devido_centavos');
        $totalEsperadoCentavos = $lancamentos->sum('valor_devido_centavos');
        $saldoExcedenteCentavos = max(0, $totalArrecadadoCentavos - $partida->meta_arrecadacao_centavos);

        return response()->json([
            'partida_id' => $partida->id,
            'meta_arrecadacao_centavos' => $partida->meta_arrecadacao_centavos,
            'valor_cota_centavos' => $partida->valor_cota_centavos,
            'chave_pix' => $partida->chave_pix_cobranca,
            'total_arrecadado_centavos' => $totalArrecadadoCentavos,
            'total_esperado_centavos' => $totalEsperadoCentavos,
            'saldo_excedente_centavos' => $saldoExcedenteCentavos,
            'lancamentos' => $lancamentos,
        ]);
    }

    public function registrarBaixa(Request $request, string $partidaId, string $atletaId): JsonResponse
    {
        $partida = Partida::findOrFail($partidaId);

        $lancamento = VaquinhaLancamento::where('partida_id', $partida->id)
            ->where('atleta_id', $atletaId)
            ->firstOrFail();

        // Idempotência
        if ($lancamento->status === 'pago') {
            return response()->json([
                'message' => 'Lançamento já quitado anteriormente.',
                'lancamento' => $lancamento,
            ], 200);
        }

        $tesoureiroId = $request->user() ? $request->user()->id : $request->input('tesoureiro_id');

        $lancamento->status = 'pago';
        $lancamento->pago_em = now();
        if ($tesoureiroId) {
            $lancamento->tesoureiro_id = $tesoureiroId;
        }
        $lancamento->save();

        return response()->json([
            'message' => 'Baixa de pagamento registrada com sucesso.',
            'lancamento' => $lancamento->load(['atleta', 'tesoureiro']),
        ], 200);
    }

    public function encerrarVaquinha(Request $request, string $partidaId): JsonResponse
    {
        $partida = Partida::findOrFail($partidaId);

        return DB::transaction(function () use ($partida, $request) {
            $lancamentos = VaquinhaLancamento::where('partida_id', $partida->id)->get();
            $totalArrecadado = $lancamentos->where('status', 'pago')->sum('valor_devido_centavos');
            $metaArbitragem = $partida->meta_arrecadacao_centavos;

            $excedente = max(0, $totalArrecadado - $metaArbitragem);
            $movimentacao = null;

            if ($excedente > 0) {
                $responsavelId = $request->user() ? $request->user()->id : $request->input('responsavel_id');
                if (!$responsavelId) {
                    $responsavelId = DB::table('users')->where('role', 'admin')->orWhere('role', 'tesoureiro')->value('id');
                }

                $movimentacao = CaixaMovimentacao::create([
                    'id' => (string) Str::uuid(),
                    'time_id' => $partida->time_id,
                    'partida_id' => $partida->id,
                    'tipo' => 'credito_excedente_partida',
                    'valor_centavos' => $excedente,
                    'descricao' => "Excedente de vaquinha da partida contra {$partida->adversario}",
                    'responsavel_id' => $responsavelId,
                    'data_movimentacao' => now(),
                ]);
            }

            // Saldo atual acumulado do time
            $saldoGeralCentavos = CaixaMovimentacao::where('time_id', $partida->time_id)->sum('valor_centavos');

            return response()->json([
                'message' => 'Vaquinha encerrada. Taxa da arbitragem quitada.',
                'total_arrecadado_centavos' => $totalArrecadado,
                'meta_paga_centavos' => $metaArbitragem,
                'saldo_excedente_centavos' => $excedente,
                'movimentacao_caixa' => $movimentacao,
                'saldo_geral_equipe_centavos' => $saldoGeralCentavos,
            ], 200);
        });
    }
}
