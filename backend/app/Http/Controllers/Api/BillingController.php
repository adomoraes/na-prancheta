<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assinatura;
use App\Models\FaturaCobranca;
use App\Models\Plano;
use App\Models\Time;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BillingController extends Controller
{
    /**
     * Lista o catálogo de planos públicos disponíveis
     */
    public function indexPlanos(): JsonResponse
    {
        $planos = Plano::where('ativo', true)->orderBy('preco_mensal_centavos', 'asc')->get();

        return response()->json($planos);
    }

    /**
     * Gera uma nova fatura / checkout de assinatura para a agremiação
     */
    public function checkout(Request $request): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $time = Time::find($user->time_id);
        if (!$time) {
            return response()->json(['message' => 'Agremiação não encontrada para o usuário.'], 404);
        }

        $validated = $request->validate([
            'plano_slug' => 'required|string|exists:planos,slug',
            'ciclo' => 'nullable|string|in:mensal,anual',
            'metodo_pagamento' => 'nullable|string|in:pix,cartao_credito',
        ]);

        $plano = Plano::where('slug', $validated['plano_slug'])->firstOrFail();
        $ciclo = $validated['ciclo'] ?? 'mensal';
        $metodo = $validated['metodo_pagamento'] ?? 'pix';

        $valorCentavos = $ciclo === 'anual' ? $plano->preco_anual_centavos : $plano->preco_mensal_centavos;
        $valorReais = number_format($valorCentavos / 100, 2, '.', '');

        $faturaId = (string) Str::uuid();

        // Gera código PIX dinâmico padrão Banco Central (mock gerado em formato payload real)
        $pixPayload = "00020126580014br.gov.bcb.pix0136{$faturaId}520400005303986540{$valorReais}5802BR5925Na Prancheta Sports LTDA6009Sao Paulo62070503***6304ABCD";

        $fatura = FaturaCobranca::create([
            'id' => $faturaId,
            'time_id' => $time->id,
            'valor_centavos' => $valorCentavos,
            'status' => 'pendente',
            'metodo_pagamento' => $metodo,
            'pix_copia_cola' => $pixPayload,
            'pix_qrcode' => "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" . urlencode($pixPayload),
            'data_vencimento' => Carbon::now()->addHours(24),
            'webhook_payload' => [
                'plano_id' => $plano->id,
                'plano_slug' => $plano->slug,
                'ciclo' => $ciclo,
            ],
        ]);

        return response()->json([
            'message' => 'Checkout gerado com sucesso.',
            'fatura_id' => $fatura->id,
            'valor_centavos' => $fatura->valor_centavos,
            'valor_formatado' => "R$ " . number_format($valorCentavos / 100, 2, ',', '.'),
            'metodo_pagamento' => $fatura->metodo_pagamento,
            'status' => $fatura->status,
            'pix_copia_cola' => $fatura->pix_copia_cola,
            'pix_qrcode_url' => $fatura->pix_qrcode,
            'expira_em' => $fatura->data_vencimento->toISOString(),
        ]);
    }

    /**
     * Retorna o status e dados da assinatura do clube do usuário logado
     */
    public function minhaAssinatura(Request $request): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $time = Time::with(['plano', 'assinaturaAtiva.plano'])->find($user->time_id);
        if (!$time) {
            return response()->json(['message' => 'Agremiação não encontrada.'], 404);
        }

        $faturas = FaturaCobranca::where('time_id', $time->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $planoAtivo = $time->assinaturaAtiva?->plano ?? $time->plano;

        return response()->json([
            'time_id' => $time->id,
            'clube_nome' => $time->nome,
            'status' => $time->status,
            'trial_ends_at' => $time->trial_ends_at ? $time->trial_ends_at->toISOString() : null,
            'dias_restantes_trial' => $time->diasRestantesTrial(),
            'is_suspenso' => $time->isSuspenso(),
            'plano' => $planoAtivo ? [
                'slug' => $planoAtivo->slug,
                'nome' => $planoAtivo->nome,
                'preco_mensal_centavos' => $planoAtivo->preco_mensal_centavos,
                'max_elencos' => $planoAtivo->max_elencos,
                'max_atletas' => $planoAtivo->max_atletas,
            ] : null,
            'assinatura' => $time->assinaturaAtiva ? [
                'id' => $time->assinaturaAtiva->id,
                'ciclo' => $time->assinaturaAtiva->ciclo,
                'status' => $time->assinaturaAtiva->status,
                'data_proxima_cobranca' => $time->assinaturaAtiva->data_proxima_cobranca->toISOString(),
            ] : null,
            'faturas_recentes' => $faturas,
        ]);
    }
}
