<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConfirmacaoPresenca;
use App\Models\Partida;
use App\Models\PartidaTitular;
use App\Models\PosicaoCampo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EscalacaoController extends Controller
{
    public function getEscalacao(string $partidaId): JsonResponse
    {
        $partida = Partida::findOrFail($partidaId);
        $posicoes = PosicaoCampo::all();
        $titulares = PartidaTitular::with(['atleta', 'posicaoCampo'])
            ->where('partida_id', $partida->id)
            ->get();

        $titularesIds = $titulares->pluck('atleta_id')->toArray();

        $reservas = ConfirmacaoPresenca::with('atleta')
            ->where('partida_id', $partida->id)
            ->where('status', 'confirmado')
            ->whereNotIn('atleta_id', $titularesIds)
            ->get();

        return response()->json([
            'partida_id' => $partida->id,
            'posicoes' => $posicoes,
            'titulares' => $titulares,
            'reservas' => $reservas,
            'total_titulares' => $titulares->count(),
        ]);
    }

    public function salvarEscalacao(Request $request, string $partidaId): JsonResponse
    {
        $partida = Partida::findOrFail($partidaId);

        $request->validate([
            'titulares' => 'required|array',
            'titulares.*.atleta_id' => 'required|uuid|exists:atletas,id',
            'titulares.*.posicao_campo_id' => 'required|integer|exists:posicoes_campo,id',
        ]);

        $titularesInput = $request->input('titulares');

        // Regra: Teto de no máximo 11 titulares
        if (count($titularesInput) > 11) {
            return response()->json([
                'message' => 'Teto regulamentar excedido: uma equipe pode escalar no máximo 11 titulares em campo.',
            ], 422);
        }

        // Validação de elegibilidade de cada atleta
        foreach ($titularesInput as $item) {
            $presenca = ConfirmacaoPresenca::with('atleta')
                ->where('partida_id', $partida->id)
                ->where('atleta_id', $item['atleta_id'])
                ->first();

            if (!$presenca || $presenca->status !== 'confirmado') {
                $nome = $presenca ? $presenca->atleta->nome : 'desconhecido';
                return response()->json([
                    'message' => "O atleta {$nome} não possui presença confirmada na partida e não pode ser titular.",
                ], 422);
            }

            if ($presenca->atrasado_prelecao_t35) {
                return response()->json([
                    'message' => "O atleta {$presenca->atleta->nome} chegou após T-35 e sofreu corte disciplinar para o banco de reservas.",
                ], 422);
            }
        }

        return DB::transaction(function () use ($partida, $titularesInput) {
            // Remove escalação prévia
            PartidaTitular::where('partida_id', $partida->id)->delete();

            $now = now();
            $novosTitulares = [];

            foreach ($titularesInput as $item) {
                $novosTitulares[] = [
                    'id' => (string) Str::uuid(),
                    'partida_id' => $partida->id,
                    'atleta_id' => $item['atleta_id'],
                    'posicao_campo_id' => $item['posicao_campo_id'],
                    'escalado_em' => $now,
                ];
            }

            PartidaTitular::insert($novosTitulares);

            $titulares = PartidaTitular::with(['atleta', 'posicaoCampo'])
                ->where('partida_id', $partida->id)
                ->get();

            return response()->json([
                'message' => 'Escalação salva com sucesso.',
                'titulares' => $titulares,
                'total_titulares' => $titulares->count(),
            ]);
        });
    }
}
