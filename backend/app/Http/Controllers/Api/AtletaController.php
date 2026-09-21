<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Atleta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AtletaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $timeId = $request->query('time_id', '11111111-1111-1111-1111-111111111111');

        $atletas = Atleta::where('time_id', $timeId)
            ->where('ativo', true)
            ->orderBy('numero_camisa')
            ->get();

        return response()->json($atletas);
    }

    public function store(Request $request): JsonResponse
    {
        $timeId = $request->input('time_id', '11111111-1111-1111-1111-111111111111');

        $validated = $request->validate([
            'nome' => 'required|string|max:100',
            'apelido' => 'required|string|max:50',
            'numero_camisa' => [
                'required',
                'integer',
                'between:1,99',
                Rule::unique('atletas')->where(function ($query) use ($timeId) {
                    return $query->where('time_id', $timeId);
                }),
            ],
            'posicao_principal' => 'required|string|max:10',
            'posicao_secundaria' => 'nullable|string|max:10',
            'tipo_vinculo' => 'nullable|string|in:mensalista,convidado',
            'numero_calcado' => 'nullable|integer|min:25|max:50',
            'time_id' => 'nullable|uuid|exists:times,id',
        ], [
            'numero_camisa.unique' => 'O número de camisa informado já está em uso por outro atleta ativo deste time.',
        ]);

        $validated['time_id'] = $timeId;
        $validated['tipo_vinculo'] = $validated['tipo_vinculo'] ?? 'mensalista';
        $validated['ativo'] = true;

        $atleta = Atleta::create($validated);

        return response()->json($atleta, 201);
    }
}
