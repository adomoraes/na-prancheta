<?php

namespace App\Http\Middleware;

use App\Models\Time;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantContext
{
    /**
     * Injeta o contexto da agremiação e bloqueia mutações operacionais em clubes suspensos
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user('sanctum') ?? $request->user();

        if (!$user) {
            return $next($request);
        }

        // Se o usuário for ROOT sem time_id, tem acesso pleno de backoffice
        if ($user->isRoot() && !$user->time_id) {
            return $next($request);
        }

        $timeId = $user->time_id;
        if (!$timeId) {
            return $next($request);
        }

        $time = Time::find($timeId);
        if (!$time) {
            return $next($request);
        }

        // Anexa a instância do tenant à requisição para uso nos controllers
        $request->attributes->set('tenant', $time);

        // Bloqueia mutações operacionais caso o clube esteja suspenso/trial expirado
        // Exceto rotas de cobrança, faturamento, auth e logout
        if ($time->isSuspenso()) {
            $isMutation = in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true);
            $isBillingOrAuth = $request->is('api/assinaturas/*') || 
                               $request->is('api/auth/*') || 
                               $request->is('api/webhooks/*') || 
                               $request->is('api/planos*');

            if ($isMutation && !$isBillingOrAuth && !$user->isRoot()) {
                return response()->json([
                    'message' => 'Acesso de edição suspenso. O período de avaliação da agremiação expirou ou a assinatura está pendente de liquidação.',
                    'status' => $time->status,
                    'requires_payment' => true,
                ], 402);
            }
        }

        return $next($request);
    }
}
