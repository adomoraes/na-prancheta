<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Atleta;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Autenticação clássica por Telefone ou E-mail e Senha
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'login' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|string',
            'password' => 'required|string',
        ]);

        $loginInput = $request->login ?? $request->email ?? $request->phone;

        if (!$loginInput) {
            return response()->json([
                'message' => 'Informe o telefone ou e-mail para autenticação.'
            ], 422);
        }

        $cleanPhone = preg_replace('/\D/', '', $loginInput);

        $user = User::where(function ($query) use ($loginInput, $cleanPhone) {
            $query->where('email', $loginInput)
                  ->orWhere('phone', $loginInput);
            if (!empty($cleanPhone)) {
                $query->orWhere('phone', $cleanPhone);
            }
        })->with('atleta')->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciais inválidas. Verifique seu e-mail/telefone e senha.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->formatUserData($user),
        ]);
    }

    /**
     * Autenticação via Google Identity Services (GIS)
     */
    public function loginGoogle(Request $request): JsonResponse
    {
        $request->validate([
            'credential' => 'required|string',
        ]);

        $credential = $request->credential;
        $googleData = null;

        // Modo Simulação/Demo local para testes rápidos se enviado token especial
        if (str_starts_with($credential, 'demo-google-token:')) {
            $role = explode(':', $credential)[1] ?? 'atleta';
            $googleData = [
                'sub' => 'demo-google-id-' . Str::slug($role),
                'email' => Str::slug($role) . '@naprancheta.com.br',
                'name' => 'Demo ' . ucfirst($role),
                'picture' => "https://api.dicebear.com/7.x/bottts/svg?seed=" . urlencode($role),
                'role' => $role,
            ];
        } else {
            // Validação criptográfica oficial junto à API de TokenInfo do Google
            try {
                $response = Http::timeout(8)->get("https://oauth2.googleapis.com/tokeninfo", [
                    'id_token' => $credential,
                ]);

                if ($response->successful()) {
                    $googleData = $response->json();
                } else {
                    return response()->json([
                        'message' => 'Token do Google inválido ou expirado. Tente novamente.',
                        'error' => $response->json(),
                    ], 401);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Falha ao validar credencial com os servidores do Google: ' . $e->getMessage()
                ], 500);
            }
        }

        $googleId = $googleData['sub'] ?? null;
        $email = $googleData['email'] ?? null;
        $name = $googleData['name'] ?? 'Usuário Google';
        $picture = $googleData['picture'] ?? null;

        if (!$email && !$googleId) {
            return response()->json([
                'message' => 'Não foi possível extrair dados válidos da conta Google.'
            ], 400);
        }

        // Localiza usuário por google_id ou e-mail
        $user = User::where('google_id', $googleId)
            ->orWhere(function ($query) use ($email) {
                if ($email) {
                    $query->where('email', $email);
                }
            })->first();

        if ($user) {
            // Atualiza dados adicionais se ainda não existiam
            $updates = [];
            if (!$user->google_id && $googleId) $updates['google_id'] = $googleId;
            if (!$user->avatar_url && $picture) $updates['avatar_url'] = $picture;
            if (!empty($updates)) {
                $user->update($updates);
            }
        } else {
            // Criação de novo usuário a partir do perfil Google
            $defaultRole = $googleData['role'] ?? 'atleta';

            $user = User::create([
                'id' => (string) Str::uuid(),
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'avatar_url' => $picture,
                'role' => $defaultRole,
                'password' => Hash::make(Str::random(32)),
            ]);

            // Tenta vincular automaticamente a um atleta existente por e-mail ou nome
            if ($email) {
                $atleta = Atleta::whereNull('user_id')
                    ->where(function ($q) use ($name) {
                        $q->where('nome', 'ILIKE', "%{$name}%");
                    })->first();

                if ($atleta) {
                    $atleta->update(['user_id' => $user->id]);
                }
            }
        }

        $user->load('atleta');
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->formatUserData($user),
        ]);
    }

    /**
     * Acesso rápido para desenvolvimento local (comuta instantaneamente entre os 5 perfis)
     */
    public function devLogin(Request $request): JsonResponse
    {
        $role = $request->input('role', 'atleta');

        // Mapeamentos para roles canônicas
        if ($role === 'admin') $role = 'geral';
        if ($role === 'tesoureiro') $role = 'financeiro';

        $user = User::where('role', $role)->with('atleta')->first();

        // Se não encontrar usuário com essa role, seleciona qualquer um ou cria um de teste
        if (!$user) {
            if ($role === 'geral') {
                $user = User::whereIn('role', ['geral', 'admin'])->first();
            } elseif ($role === 'financeiro') {
                $user = User::whereIn('role', ['financeiro', 'tesoureiro'])->first();
            }
        }

        if (!$user) {
            // Cria usuário de teste com essa role
            $user = User::create([
                'id' => (string) Str::uuid(),
                'name' => 'Perfil ' . ucfirst($role),
                'email' => "{$role}@naprancheta.com.br",
                'role' => $role,
                'password' => Hash::make('na-prancheta-2026'),
            ]);
        }

        $user->load('atleta');
        $token = $user->createToken('dev_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->formatUserData($user),
        ]);
    }

    /**
     * Dados do usuário autenticado atual
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('atleta');

        return response()->json([
            'user' => $this->formatUserData($user),
        ]);
    }

    /**
     * Encerramento de sessão (Logout)
     */
    public function logout(Request $request): JsonResponse
    {
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Sessão encerrada com sucesso.'
        ]);
    }

    /**
     * Formata os dados do usuário para o payload JSON do frontend
     */
    private function formatUserData(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'avatar_url' => $user->avatar_url,
            'atleta' => $user->atleta ? [
                'id' => $user->atleta->id,
                'nome' => $user->atleta->nome,
                'apelido' => $user->atleta->apelido,
                'numero_camisa' => $user->atleta->numero_camisa,
                'posicao_principal' => $user->atleta->posicao_principal,
            ] : null,
        ];
    }
}
