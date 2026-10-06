<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plano;
use App\Models\Time;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OnboardingController extends Controller
{
    /**
     * Realiza o auto-cadastro de uma nova agremiação e do respectivo gestor
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nome_clube' => 'required|string|max:100',
            'sigla' => 'nullable|string|max:10',
            'modalidade' => 'nullable|string|max:50',
            'nome_gestor' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
        ]);

        return DB::transaction(function () use ($validated) {
            $slugBase = Str::slug($validated['nome_clube']);
            $slug = $slugBase;
            $count = 1;
            while (Time::where('slug', $slug)->exists()) {
                $slug = "{$slugBase}-{$count}";
                $count++;
            }

            // Plano campeão como plano padrão para o período de teste
            $planoCampeao = Plano::where('slug', 'campeao')->first();

            // 1. Cria a agremiação esportiva com período de teste de 14 dias
            $time = Time::create([
                'nome' => $validated['nome_clube'],
                'slug' => $slug,
                'sigla' => $validated['sigla'] ?? strtoupper(substr($slugBase, 0, 3)),
                'cor_primaria' => '#10b981',
                'cor_secundaria' => '#0f172a',
                'modalidade' => $validated['modalidade'] ?? 'futebol_campo',
                'status' => 'trial',
                'trial_ends_at' => Carbon::now()->addDays(14),
                'plano_id' => $planoCampeao ? $planoCampeao->id : null,
            ]);

            // 2. Cria o usuário com papel 'gestor' vinculado à agremiação
            $user = User::create([
                'time_id' => $time->id,
                'name' => $validated['nome_gestor'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? '11999999999',
                'password' => $validated['password'],
                'role' => 'gestor',
            ]);

            // 3. Emite o token Sanctum
            $token = $user->createToken('whitelabel-onboarding')->plainTextToken;

            return response()->json([
                'message' => 'Agremiação cadastrada com sucesso com período de avaliação de 14 dias.',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'time_id' => $user->time_id,
                ],
                'tenant' => [
                    'id' => $time->id,
                    'nome' => $time->nome,
                    'sigla' => $time->sigla,
                    'slug' => $time->slug,
                    'cor_primaria' => $time->cor_primaria,
                    'cor_secundaria' => $time->cor_secundaria,
                    'escudo_url' => $time->escudo_url,
                    'modalidade' => $time->modalidade,
                    'status' => $time->status,
                    'trial_ends_at' => $time->trial_ends_at->toISOString(),
                    'dias_restantes_trial' => $time->diasRestantesTrial(),
                ],
            ], 201);
        });
    }
}
