<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InvestorLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvestorLeadController extends Controller
{
    /**
     * Registra uma nova proposta/lead de investidor ou parceiro comercial.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telefone' => 'required|string|max:50',
            'tipo_investidor' => 'required|string|in:anjo,fundo_vc,arena_liga,outro',
            'ticket_estimado' => 'nullable|string|max:100',
            'mensagem' => 'nullable|string|max:2000',
        ]);

        $lead = InvestorLead::create([
            'nome' => $validated['nome'],
            'email' => $validated['email'],
            'telefone' => $validated['telefone'],
            'tipo_investidor' => $validated['tipo_investidor'],
            'ticket_estimado' => $validated['ticket_estimado'] ?? null,
            'mensagem' => $validated['mensagem'] ?? null,
            'origem' => 'landing_page',
            'ip_address' => $request->ip(),
            'status' => 'novo',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead registrado com sucesso. Nossa equipe entrará em contato em breve.',
            'data' => [
                'id' => $lead->id,
                'nome' => $lead->nome,
                'tipo_investidor' => $lead->tipo_investidor,
                'created_at' => $lead->created_at,
            ],
        ], 201);
    }

    /**
     * Lista leads de investidores (acesso administrativo).
     */
    public function index(Request $request): JsonResponse
    {
        $query = InvestorLead::query()->orderBy('created_at', 'desc');

        if ($request->filled('tipo_investidor')) {
            $query->where('tipo_investidor', $request->query('tipo_investidor'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $leads = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $leads,
        ]);
    }
}
