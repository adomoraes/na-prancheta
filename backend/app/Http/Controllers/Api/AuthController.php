<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        $cleanPhone = preg_replace('/\D/', '', $request->phone);

        $user = User::where('phone', $cleanPhone)
            ->orWhere('phone', $request->phone)
            ->with('atleta')
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciais inválidas. Verifique seu telefone e senha.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'role' => $user->role,
                'atleta' => $user->atleta,
            ]
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('atleta');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'role' => $user->role,
                'atleta' => $user->atleta,
            ]
        ]);
    }
}
