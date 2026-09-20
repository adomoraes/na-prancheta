<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConferenciaMala;
use App\Models\ItemAlmoxarifado;
use App\Models\Partida;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AlmoxarifadoController extends Controller
{
    public function getStatus(string $partidaId): JsonResponse
    {
        $partida = Partida::findOrFail($partidaId);
        $conferencia = ConferenciaMala::with('custodiante')
            ->where('partida_id', $partida->id)
            ->first();

        $itens = ItemAlmoxarifado::where('time_id', $partida->time_id)
            ->where('ativo', true)
            ->get();

        return response()->json([
            'partida_id' => $partida->id,
            'conferencia' => $conferencia,
            'itens_patrimonio' => $itens,
        ]);
    }

    public function fecharMalas(Request $request, string $partidaId): JsonResponse
    {
        $partida = Partida::findOrFail($partidaId);

        $request->validate([
            'camisas_recolhidas' => 'required|integer|min:0',
            'todas_camisas_desviradas' => 'required|boolean',
            'bolas_recolhidas' => 'required|integer|min:0',
            'kit_cones_recolhido' => 'required|boolean',
            'mala_trancada_no_carro' => 'required|boolean',
        ]);

        $camisas = (int) $request->camisas_recolhidas;
        $bolas = (int) $request->bolas_recolhidas;
        $desviradas = (bool) $request->todas_camisas_desviradas;
        $trancada = (bool) $request->mala_trancada_no_carro;

        if ($camisas < 22) {
            $faltam = 22 - $camisas;
            return response()->json([
                'message' => "Fechamento recusado: faltam {$faltam} camisa(s) a ser(em) recolhida(s). Mínimo exigido: 22.",
                'resenha_liberada' => false,
            ], 422);
        }

        if (!$desviradas) {
            return response()->json([
                'message' => 'Fechamento recusado: existem camisas guardadas do avesso. Todas as 22 camisas devem estar desviradas.',
                'resenha_liberada' => false,
            ], 422);
        }

        if ($bolas < 6) {
            $faltam = 6 - $bolas;
            return response()->json([
                'message' => "Fechamento recusado: faltam {$faltam} bola(s) oficial(is). Mínimo exigido: 6.",
                'resenha_liberada' => false,
            ], 422);
        }

        if (!$trancada) {
            return response()->json([
                'message' => 'Fechamento recusado: a mala de materiais esportivos deve estar trancada no veículo antes de liberar a resenha.',
                'resenha_liberada' => false,
            ], 422);
        }

        $custodianteId = $request->user() ? $request->user()->id : $request->input('custodiante_id');
        if (!$custodianteId) {
            $conferenciaExistente = ConferenciaMala::where('partida_id', $partida->id)->first();
            $custodianteId = $conferenciaExistente ? $conferenciaExistente->custodiante_id : null;
        }

        $conferencia = ConferenciaMala::updateOrCreate(
            ['partida_id' => $partida->id],
            [
                'id' => Str::uuid()->toString(),
                'custodiante_id' => $custodianteId,
                'camisas_recolhidas' => $camisas,
                'todas_camisas_desviradas' => true,
                'bolas_recolhidas' => $bolas,
                'kit_cones_recolhido' => (bool) $request->kit_cones_recolhido,
                'mala_trancada_no_carro' => true,
                'resenha_liberada' => true,
                'liberada_em' => now(),
            ]
        );

        return response()->json([
            'message' => 'Tríplice conferência aprovada com sucesso! Resenha social liberada.',
            'conferencia' => $conferencia->load('custodiante'),
            'resenha_liberada' => true,
        ], 200);
    }
}
