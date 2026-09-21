<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user('sanctum') ?? $request->user();

        // Se a rota exige perfil restrito e não há usuário autenticado, rejeita com 401
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if (!empty($roles) && !$user->hasRole($roles)) {
            return response()->json([
                'message' => 'Acesso restrito. Esta operação requer perfil de: ' . implode(', ', $roles) . '.',
                'required_roles' => $roles,
                'user_role' => $user->role,
            ], 403);
        }

        return $next($request);
    }
}
