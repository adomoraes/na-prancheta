<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partida;
use App\Models\ScoutPartida;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ScoutController extends Controller
{
    public function getScouts(string $partidaId): JsonResponse
    {
        $partida = Partida::findOrFail($partidaId);
        $scouts = ScoutPartida::with('atleta')
            ->where('partida_id', $partida->id)
            ->get();

        return response()->json([
            'partida_id' => $partida->id,
            'scouts' => $scouts,
            'mvp' => $scouts->firstWhere('foi_mvp', true),
        ]);
    }

    public function salvarScout(Request $request, string $partidaId, string $atletaId): JsonResponse
    {
        $partida = Partida::findOrFail($partidaId);

        $request->validate([
            'gols' => 'nullable|integer|min:0',
            'assistencias' => 'nullable|integer|min:0',
            'cartoes_amarelos' => 'nullable|integer|min:0',
            'cartoes_vermelhos' => 'nullable|integer|min:0',
            'gols_sofridos_goleiro' => 'nullable|integer|min:0',
            'minutos_jogados' => 'nullable|integer|min:0',
            'foi_mvp' => 'nullable|boolean',
        ], [
            'min' => 'Valores estatísticos de súmula não podem ser negativos.',
        ]);

        $foiMvp = (bool) $request->input('foi_mvp', false);

        return DB::transaction(function () use ($partida, $atletaId, $request, $foiMvp) {
            // Exclusividade estrita de MVP: revoga de todos os outros se for eleito
            if ($foiMvp) {
                ScoutPartida::where('partida_id', $partida->id)
                    ->where('atleta_id', '!=', $atletaId)
                    ->update(['foi_mvp' => false]);
            }

            $scout = ScoutPartida::where('partida_id', $partida->id)
                ->where('atleta_id', $atletaId)
                ->first();

            if (!$scout) {
                $scout = new ScoutPartida();
                $scout->id = (string) Str::uuid();
                $scout->partida_id = $partida->id;
                $scout->atleta_id = $atletaId;
            }

            if ($request->has('gols')) $scout->gols = (int) $request->gols;
            if ($request->has('assistencias')) $scout->assistencias = (int) $request->assistencias;
            if ($request->has('cartoes_amarelos')) $scout->cartoes_amarelos = (int) $request->cartoes_amarelos;
            if ($request->has('cartoes_vermelhos')) $scout->cartoes_vermelhos = (int) $request->cartoes_vermelhos;
            if ($request->has('gols_sofridos_goleiro')) $scout->gols_sofridos_goleiro = (int) $request->gols_sofridos_goleiro;
            if ($request->has('minutos_jogados')) $scout->minutos_jogados = (int) $request->minutos_jogados;
            if ($request->has('foi_mvp')) $scout->foi_mvp = $foiMvp;

            $scout->save();

            return response()->json([
                'message' => 'Scout atualizado com sucesso.',
                'scout' => $scout->load('atleta'),
            ], 200);
        });
    }
}
