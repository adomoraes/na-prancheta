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

        // Se houver usuário autenticado, valida rigorosamente a permissão por role
        if ($user) {
            if (!empty($roles) && !$user->hasRole($roles)) {
                return response()->json([
                    'message' => 'Acesso restrito. Esta operação requer perfil de: ' . implode(', ', $roles) . '.',
                    'required_roles' => $roles,
                    'user_role' => $user->role,
                ], 403);
            }
        }

        return $next($request);
    }
}
