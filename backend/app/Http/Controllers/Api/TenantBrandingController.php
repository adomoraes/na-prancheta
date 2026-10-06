<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Time;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantBrandingController extends Controller
{
    /**
     * Retorna o branding e identidade visual da agremiação do usuário
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();

        if (!$user || !$user->time_id) {
            // Fallback para o time padrão fundador caso não haja time_id
            $time = Time::first();
        } else {
            $time = Time::find($user->time_id);
        }

        if (!$time) {
            return response()->json(['message' => 'Agremiação não encontrada.'], 404);
        }

        return response()->json([
            'id' => $time->id,
            'nome' => $time->nome,
            'sigla' => $time->sigla,
            'slug' => $time->slug,
            'escudo_url' => $time->escudo_url,
            'cor_primaria' => $time->cor_primaria,
            'cor_secundaria' => $time->cor_secundaria,
            'modalidade' => $time->modalidade,
            'status' => $time->status,
            'trial_ends_at' => $time->trial_ends_at ? $time->trial_ends_at->toISOString() : null,
            'dias_restantes_trial' => $time->diasRestantesTrial(),
            'is_suspenso' => $time->isSuspenso(),
        ]);
    }

    /**
     * Atualiza a identidade visual da agremiação
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Apenas 'gestor' ou 'root' podem alterar a identidade do clube
        if (!$user->isRoot() && !$user->hasRole(['gestor', 'geral'])) {
            return response()->json(['message' => 'Acesso negado. Apenas o gestor do clube pode alterar a identidade visual.'], 403);
        }

        $time = Time::find($user->time_id);
        if (!$time) {
            return response()->json(['message' => 'Agremiação não encontrada.'], 404);
        }

        $validated = $request->validate([
            'sigla' => 'nullable|string|max:10',
            'escudo_url' => 'nullable|string|max:1000',
            'cor_primaria' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6})$/'],
            'cor_secundaria' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6})$/'],
        ]);

        $time->update(array_filter($validated, fn($val) => !is_null($val)));

        return response()->json([
            'message' => 'Identidade visual atualizada com sucesso.',
            'tenant' => [
                'id' => $time->id,
                'nome' => $time->nome,
                'sigla' => $time->sigla,
                'escudo_url' => $time->escudo_url,
                'cor_primaria' => $time->cor_primaria,
                'cor_secundaria' => $time->cor_secundaria,
            ],
        ]);
    }
}
