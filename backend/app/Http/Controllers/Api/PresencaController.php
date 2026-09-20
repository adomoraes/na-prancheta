<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConfirmacaoPresenca;
use App\Models\Partida;
use App\Models\VaquinhaLancamento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PresencaController extends Controller
{
    public function updatePresenca(Request $request, string $partidaId): JsonResponse
    {
        $request->validate([
            'atleta_id' => 'required|uuid|exists:atletas,id',
            'status' => 'required|string|in:confirmado,ausente,duvida,lista_espera',
            'chegou_apos_t35' => 'nullable|boolean',
            'chegou_vestiario_em' => 'nullable|date',
        ]);

        $partida = Partida::findOrFail($partidaId);
        $atletaId = $request->atleta_id;
        $requestedStatus = $request->status;

        return DB::transaction(function () use ($partida, $atletaId, $requestedStatus, $request) {
            $presenca = ConfirmacaoPresenca::where('partida_id', $partida->id)
                ->where('atleta_id', $atletaId)
                ->first();

            // Idempotência
            if ($presenca && $presenca->status === $requestedStatus && !$request->has('chegou_apos_t35')) {
                return response()->json([
                    'message' => 'Status de presença já registrado.',
                    'presenca' => $presenca,
                    'status_final' => $presenca->status,
                ], 200);
            }

            $finalStatus = $requestedStatus;
            $ordemEspera = null;

            if ($requestedStatus === 'confirmado') {
                $confirmadosCount = ConfirmacaoPresenca::where('partida_id', $partida->id)
                    ->where('status', 'confirmado')
                    ->where('atleta_id', '!=', $atletaId)
                    ->count();

                if ($confirmadosCount >= $partida->limite_confirmados) {
                    $finalStatus = 'lista_espera';
                    $maiorFila = ConfirmacaoPresenca::where('partida_id', $partida->id)
                        ->where('status', 'lista_espera')
                        ->max('ordem_fila_espera') ?? 0;
                    $ordemEspera = $maiorFila + 1;
                }
            }

            if (!$presenca) {
                $presenca = new ConfirmacaoPresenca();
                $presenca->id = (string) Str::uuid();
                $presenca->partida_id = $partida->id;
                $presenca->atleta_id = $atletaId;
                $presenca->respondido_em = now();
            }

            $presenca->status = $finalStatus;
            $presenca->ordem_fila_espera = $ordemEspera;

            if ($request->has('chegou_apos_t35')) {
                $presenca->atrasado_prelecao_t35 = (bool) $request->chegou_apos_t35;
            }

            if ($request->has('chegou_vestiario_em')) {
                $presenca->chegou_vestiario_em = $request->chegou_vestiario_em;
            }

            $presenca->save();

            // Geração de cobrança na vaquinha se confirmado
            if ($finalStatus === 'confirmado') {
                VaquinhaLancamento::firstOrCreate(
                    ['partida_id' => $partida->id, 'atleta_id' => $atletaId],
                    [
                        'id' => (string) Str::uuid(),
                        'valor_devido_centavos' => $partida->valor_cota_centavos,
                        'status' => 'pendente',
                        'metodo_pagamento' => 'pix',
                    ]
                );
            }

            return response()->json([
                'message' => 'Presença atualizada com sucesso.',
                'presenca' => $presenca->load('atleta'),
                'status_final' => $finalStatus,
            ], 200);
        });
    }

    public function registrarChegada(Request $request, string $partidaId, string $atletaId): JsonResponse
    {
        $request->validate([
            'chegou_apos_t35' => 'required|boolean',
        ]);

        $presenca = ConfirmacaoPresenca::where('partida_id', $partidaId)
            ->where('atleta_id', $atletaId)
            ->firstOrFail();

        $presenca->atrasado_prelecao_t35 = $request->chegou_apos_t35;
        $presenca->chegou_vestiario_em = now();
        $presenca->save();

        return response()->json([
            'message' => 'Chegada ao vestiário registrada.',
            'presenca' => $presenca,
        ]);
    }
}
