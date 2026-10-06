<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assinatura;
use App\Models\FaturaCobranca;
use App\Models\Plano;
use App\Models\Time;
use App\Models\WebhookEvent;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WebhookController extends Controller
{
    /**
     * Processa notificações assíncronas do provedor de pagamentos com controle de idempotência
     */
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->all();
        $eventId = $payload['event_id'] ?? $request->header('X-Event-ID') ?? null;

        if (!$eventId) {
            // Se o provedor não enviar event_id direto, gera hash baseado no conteúdo
            $eventId = 'EVT-' . md5(json_encode($payload));
        }

        // 1. Verificação de Idempotência
        if (WebhookEvent::where('event_id', $eventId)->exists()) {
            return response()->json([
                'status' => 'already_processed',
                'event_id' => $eventId,
                'message' => 'Evento já processado anteriormente.',
            ], 200);
        }

        return DB::transaction(function () use ($payload, $eventId, $request) {
            $eventType = $payload['event'] ?? $payload['type'] ?? 'PAYMENT_RECEIVED';

            // Registra o evento recebido
            WebhookEvent::create([
                'event_id' => $eventId,
                'provedor' => $payload['provedor'] ?? 'gateway_nacional',
                'tipo_evento' => $eventType,
                'processado' => true,
                'payload' => $payload,
            ]);

            // Trata evento de confirmação de pagamento
            $paymentData = $payload['payment'] ?? $payload['data'] ?? $payload;
            $faturaId = $paymentData['externalReference'] ?? $payload['fatura_id'] ?? null;

            if ($faturaId) {
                $fatura = FaturaCobranca::find($faturaId);

                if ($fatura) {
                    $fatura->update([
                        'status' => 'paga',
                        'data_pagamento' => Carbon::now(),
                        'transacao_provedor_id' => $paymentData['id'] ?? $payload['transacao_id'] ?? null,
                    ]);

                    $time = Time::find($fatura->time_id);
                    if ($time) {
                        $planoId = $fatura->webhook_payload['plano_id'] ?? $time->plano_id;
                        $ciclo = $fatura->webhook_payload['ciclo'] ?? 'mensal';
                        $diasVigencia = $ciclo === 'anual' ? 365 : 30;

                        // Se o plano ainda não estava definido no time, busca pelo ID
                        if ($planoId && !$time->plano_id) {
                            $time->plano_id = $planoId;
                        }

                        // Cria ou atualiza a assinatura ativa
                        $assinatura = Assinatura::updateOrCreate(
                            [
                                'time_id' => $time->id,
                                'status' => 'ativa',
                            ],
                            [
                                'id' => Str::uuid(),
                                'plano_id' => $planoId ?? Plano::where('slug', 'campeao')->first()?->id ?? 1,
                                'ciclo' => $ciclo,
                                'status' => 'ativa',
                                'valor_centavos' => $fatura->valor_centavos,
                                'forma_pagamento_preferida' => $fatura->metodo_pagamento,
                                'data_inicio' => Carbon::now(),
                                'data_proxima_cobranca' => Carbon::now()->addDays($diasVigencia),
                            ]
                        );

                        // Vincula a fatura à assinatura
                        $fatura->update(['assinatura_id' => $assinatura->id]);

                        // Ativa o clube
                        $time->update([
                            'status' => 'ativo',
                            'plano_id' => $assinatura->plano_id,
                        ]);
                    }
                }
            }

            return response()->json([
                'status' => 'processed',
                'event_id' => $eventId,
                'message' => 'Pagamento processado e assinatura ativada.',
            ], 200);
        });
    }
}
