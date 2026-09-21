<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Atleta;
use App\Models\CaixaMovimentacao;
use App\Models\ItemAlmoxarifado;
use App\Models\Local;
use App\Models\Partida;
use App\Models\Time;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    // ==========================================
    // 1. GESTÃO DE USUÁRIOS & ROLES
    // ==========================================

    public function indexUsers(Request $request): JsonResponse
    {
        $users = User::with('atleta')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'avatar_url' => $user->avatar_url,
                    'created_at' => $user->created_at?->toIso8601String(),
                    'atleta' => $user->atleta ? [
                        'id' => $user->atleta->id,
                        'nome' => $user->atleta->nome,
                        'apelido' => $user->atleta->apelido,
                    ] : null,
                ];
            });

        return response()->json($users);
    }

    public function storeUser(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:30',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:root,geral,tecnico,financeiro,almoxarifado,atleta',
        ]);

        $user = User::create([
            'id' => (string) Str::uuid(),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Usuário criado com sucesso.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
            ]
        ], 201);
    }

    public function updateUser(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => "sometimes|required|email|unique:users,email,{$id}",
            'phone' => 'nullable|string|max:30',
            'role' => 'sometimes|required|string|in:root,geral,tecnico,financeiro,almoxarifado,atleta',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Usuário atualizado com sucesso.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
            ]
        ]);
    }

    public function resetUserPassword(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Revoga tokens existentes para forçar novo login
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Senha redefinida com sucesso. Sessões anteriores foram encerradas.'
        ]);
    }

    public function deleteUser(string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Não permite auto-exclusão do próprio ROOT requisitante
        if (auth()->id() === $user->id) {
            return response()->json([
                'message' => 'Não é permitido excluir o usuário ROOT atualmente conectado.'
            ], 422);
        }

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();
            // Desvincula atleta se houver
            Atleta::where('user_id', $user->id)->update(['user_id' => null]);
            $user->delete();
        });

        return response()->json([
            'message' => 'Usuário removido com sucesso.'
        ]);
    }

    // ==========================================
    // 2. GESTÃO DE ATLETAS & ELENCO
    // ==========================================

    public function indexAtletas(Request $request): JsonResponse
    {
        // Retorna todos os atletas, incluindo inativos
        $atletas = Atleta::with('user')
            ->orderBy('nome')
            ->get();

        return response()->json($atletas);
    }

    public function storeAtleta(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'apelido' => 'nullable|string|max:100',
            'numero_camisa' => 'nullable|integer|min:0|max:99',
            'numero_calcado' => 'nullable|integer|min:25|max:50',
            'posicao_principal' => 'required|string|max:10',
            'posicao_secundaria' => 'nullable|string|max:10',
            'tipo_vinculo' => 'nullable|string|in:mensalista,avulso',
            'user_id' => 'nullable|uuid|exists:users,id',
        ]);

        $time = Time::first();

        $atleta = Atleta::create([
            'id' => (string) Str::uuid(),
            'time_id' => $time?->id,
            'nome' => $validated['nome'],
            'apelido' => $validated['apelido'] ?? $validated['nome'],
            'numero_camisa' => $validated['numero_camisa'] ?? null,
            'numero_calcado' => $validated['numero_calcado'] ?? null,
            'posicao_principal' => $validated['posicao_principal'],
            'posicao_secundaria' => $validated['posicao_secundaria'] ?? null,
            'tipo_vinculo' => $validated['tipo_vinculo'] ?? 'mensalista',
            'user_id' => $validated['user_id'] ?? null,
            'ativo' => true,
        ]);

        return response()->json([
            'message' => 'Atleta cadastrado com sucesso.',
            'atleta' => $atleta
        ], 201);
    }

    public function updateAtleta(Request $request, string $id): JsonResponse
    {
        $atleta = Atleta::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'apelido' => 'nullable|string|max:100',
            'numero_camisa' => 'nullable|integer|min:0|max:99',
            'numero_calcado' => 'nullable|integer|min:25|max:50',
            'posicao_principal' => 'sometimes|required|string|max:10',
            'posicao_secundaria' => 'nullable|string|max:10',
            'tipo_vinculo' => 'nullable|string|in:mensalista,avulso',
            'user_id' => 'nullable|uuid|exists:users,id',
            'ativo' => 'sometimes|boolean',
        ]);

        $atleta->update($validated);

        return response()->json([
            'message' => 'Atleta atualizado com sucesso.',
            'atleta' => $atleta
        ]);
    }

    public function toggleAtletaStatus(Request $request, string $id): JsonResponse
    {
        $atleta = Atleta::findOrFail($id);

        $novoStatus = $request->has('ativo') ? (bool) $request->input('ativo') : !$atleta->ativo;

        $atleta->update(['ativo' => $novoStatus]);

        return response()->json([
            'message' => $novoStatus ? 'Atleta reativado com sucesso.' : 'Atleta desativado com sucesso (soft delete).',
            'atleta' => $atleta
        ]);
    }

    // ==========================================
    // 3. GESTÃO DE PARTIDAS & VESTIÁRIO
    // ==========================================

    public function indexPartidas(Request $request): JsonResponse
    {
        $partidas = Partida::with('local')
            ->orderByDesc('data_partida')
            ->get();

        return response()->json($partidas);
    }

    public function storePartida(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'adversario' => 'required|string|max:255',
            'data_partida' => 'required|date',
            'horario_inicio' => 'required|string',
            'local_id' => 'nullable|uuid|exists:locais,id',
            'local_nome' => 'required|string|max:255',
            'local_endereco' => 'nullable|string|max:255',
            'local_maps_url' => 'nullable|string|url',
            'cor_uniforme' => 'nullable|string|max:50',
            'limite_confirmados' => 'nullable|integer|min:7|max:30',
            'valor_cota_centavos' => 'nullable|integer|min:0',
            'meta_arrecadacao_centavos' => 'nullable|integer|min:0',
            'chave_pix_cobranca' => 'nullable|string|max:100',
        ]);

        $time = Time::first();

        $carbonInicio = Carbon::parse($validated['data_partida'] . ' ' . $validated['horario_inicio']);
        $horarioT70 = $carbonInicio->copy()->subMinutes(70)->format('H:i:s');
        $horarioT35 = $carbonInicio->copy()->subMinutes(35)->format('H:i:s');

        $partida = Partida::create([
            'id' => (string) Str::uuid(),
            'time_id' => $time?->id,
            'adversario' => $validated['adversario'],
            'data_partida' => $validated['data_partida'],
            'horario_inicio' => $validated['horario_inicio'],
            'horario_chegada_t70' => $horarioT70,
            'horario_prelecao_t35' => $horarioT35,
            'local_id' => $validated['local_id'] ?? null,
            'local_nome' => $validated['local_nome'],
            'local_endereco' => $validated['local_endereco'] ?? 'Local a definir',
            'local_maps_url' => $validated['local_maps_url'] ?? null,
            'cor_uniforme' => $validated['cor_uniforme'] ?? 'Preto / Listrado',
            'limite_confirmados' => $validated['limite_confirmados'] ?? 14,
            'valor_cota_centavos' => $validated['valor_cota_centavos'] ?? 2500,
            'meta_arrecadacao_centavos' => $validated['meta_arrecadacao_centavos'] ?? 35000,
            'chave_pix_cobranca' => $validated['chave_pix_cobranca'] ?? 'pix@naprancheta.com',
            'status' => 'agendada',
        ]);

        return response()->json([
            'message' => 'Partida criada com sucesso.',
            'partida' => $partida
        ], 201);
    }

    public function updatePartida(Request $request, string $id): JsonResponse
    {
        $partida = Partida::findOrFail($id);

        $validated = $request->validate([
            'adversario' => 'sometimes|required|string|max:255',
            'data_partida' => 'sometimes|required|date',
            'horario_inicio' => 'sometimes|required|string',
            'local_id' => 'nullable|uuid|exists:locais,id',
            'local_nome' => 'sometimes|required|string|max:255',
            'local_endereco' => 'nullable|string|max:255',
            'local_maps_url' => 'nullable|string|url',
            'cor_uniforme' => 'nullable|string|max:50',
            'limite_confirmados' => 'nullable|integer|min:7|max:30',
            'valor_cota_centavos' => 'nullable|integer|min:0',
            'meta_arrecadacao_centavos' => 'nullable|integer|min:0',
            'chave_pix_cobranca' => 'nullable|string|max:100',
            'status' => 'sometimes|string|in:agendada,em_andamento,encerrada,cancelada',
        ]);

        $partida->update($validated);

        return response()->json([
            'message' => 'Partida atualizada com sucesso.',
            'partida' => $partida
        ]);
    }

    public function updatePartidaStatus(Request $request, string $id): JsonResponse
    {
        $partida = Partida::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:agendada,em_andamento,encerrada,cancelada',
        ]);

        $partida->update(['status' => $validated['status']]);

        return response()->json([
            'message' => "Status da partida alterado para {$validated['status']}.",
            'partida' => $partida
        ]);
    }

    // ==========================================
    // 4. GESTÃO DE CAIXA GERAL & FINANCEIRO
    // ==========================================

    public function indexCaixa(Request $request): JsonResponse
    {
        $movimentacoes = CaixaMovimentacao::with('responsavel')
            ->orderByDesc('data_movimentacao')
            ->get();

        $totalEntradas = $movimentacoes->where('tipo', 'entrada')->sum('valor_centavos');
        $totalSaidas = $movimentacoes->where('tipo', 'saida')->sum('valor_centavos');
        $saldoCentavos = $totalEntradas - $totalSaidas;

        return response()->json([
            'saldo_centavos' => $saldoCentavos,
            'saldo_formatado' => number_format($saldoCentavos / 100, 2, ',', '.'),
            'total_entradas_centavos' => $totalEntradas,
            'total_saidas_centavos' => $totalSaidas,
            'movimentacoes' => $movimentacoes->map(function ($mov) {
                return [
                    'id' => $mov->id,
                    'tipo' => $mov->tipo,
                    'valor_centavos' => $mov->valor_centavos,
                    'descricao' => $mov->descricao,
                    'data_movimentacao' => $mov->data_movimentacao?->toIso8601String(),
                    'responsavel' => $mov->responsavel?->name ?? 'Sistema',
                ];
            })
        ]);
    }

    public function storeCaixa(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tipo' => 'required|string|in:entrada,saida',
            'valor_centavos' => 'required|integer|min:1',
            'descricao' => 'required|string|max:255',
            'partida_id' => 'nullable|uuid|exists:partidas,id',
        ]);

        $time = Time::first();

        $movimentacao = CaixaMovimentacao::create([
            'id' => (string) Str::uuid(),
            'time_id' => $time?->id,
            'partida_id' => $validated['partida_id'] ?? null,
            'tipo' => $validated['tipo'],
            'valor_centavos' => $validated['valor_centavos'],
            'descricao' => $validated['descricao'],
            'responsavel_id' => auth()->id(),
            'data_movimentacao' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Lançamento registrado com sucesso no caixa.',
            'movimentacao' => $movimentacao
        ], 201);
    }

    // ==========================================
    // 5. GESTÃO DE PATRIMÔNIO & ALMOXARIFADO
    // ==========================================

    public function indexPatrimonio(Request $request): JsonResponse
    {
        $itens = ItemAlmoxarifado::orderBy('nome')->get();
        return response()->json($itens);
    }

    public function storePatrimonio(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'categoria' => 'required|string|max:100',
            'quantidade_total' => 'required|integer|min:0',
            'estado_conservacao' => 'required|string|in:novo,bom,regular,desgastado',
        ]);

        $time = Time::first();

        $item = ItemAlmoxarifado::create([
            'id' => (string) Str::uuid(),
            'time_id' => $time?->id,
            'nome' => $validated['nome'],
            'categoria' => $validated['categoria'],
            'quantidade_total' => $validated['quantidade_total'],
            'estado_conservacao' => $validated['estado_conservacao'],
            'ativo' => true,
        ]);

        return response()->json([
            'message' => 'Item de patrimônio adicionado com sucesso.',
            'item' => $item
        ], 201);
    }

    public function updatePatrimonio(Request $request, string $id): JsonResponse
    {
        $item = ItemAlmoxarifado::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'categoria' => 'sometimes|required|string|max:100',
            'quantidade_total' => 'sometimes|required|integer|min:0',
            'estado_conservacao' => 'sometimes|required|string|in:novo,bom,regular,desgastado',
            'ativo' => 'sometimes|boolean',
        ]);

        $item->update($validated);

        return response()->json([
            'message' => 'Item de patrimônio atualizado com sucesso.',
            'item' => $item
        ]);
    }

    public function deletePatrimonio(string $id): JsonResponse
    {
        $item = ItemAlmoxarifado::findOrFail($id);
        $item->delete();

        return response()->json([
            'message' => 'Item de patrimônio removido com sucesso.'
        ]);
    }

    // ==========================================
    // 6. GESTÃO DE LOCAIS & CAMPOS
    // ==========================================

    public function indexLocais(Request $request): JsonResponse
    {
        $locais = Local::withCount('partidas')
            ->orderBy('nome')
            ->get();

        return response()->json($locais);
    }

    public function storeLocal(Request $request): JsonResponse
    {
        $time = Time::first();

        $validated = $request->validate([
            'nome' => [
                'required',
                'string',
                'max:255',
                \Illuminate\Validation\Rule::unique('locais', 'nome')->where('time_id', $time?->id),
            ],
            'endereco' => 'nullable|string|max:255',
            'maps_url' => 'nullable|string|url',
            'tipo_piso' => 'nullable|string|max:50',
            'observacoes' => 'nullable|string',
            'ativo' => 'nullable|boolean',
        ]);

        $local = Local::create([
            'id' => (string) Str::uuid(),
            'time_id' => $time?->id,
            'nome' => $validated['nome'],
            'endereco' => $validated['endereco'] ?? null,
            'maps_url' => $validated['maps_url'] ?? null,
            'tipo_piso' => $validated['tipo_piso'] ?? 'Grama Sintética',
            'observacoes' => $validated['observacoes'] ?? null,
            'ativo' => $validated['ativo'] ?? true,
        ]);

        return response()->json([
            'message' => 'Local cadastrado com sucesso.',
            'local' => $local
        ], 201);
    }

    public function updateLocal(Request $request, string $id): JsonResponse
    {
        $local = Local::findOrFail($id);
        $time = Time::first();

        $validated = $request->validate([
            'nome' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                \Illuminate\Validation\Rule::unique('locais', 'nome')
                    ->where('time_id', $time?->id)
                    ->ignore($local->id),
            ],
            'endereco' => 'nullable|string|max:255',
            'maps_url' => 'nullable|string|url',
            'tipo_piso' => 'nullable|string|max:50',
            'observacoes' => 'nullable|string',
            'ativo' => 'sometimes|boolean',
        ]);

        $local->update($validated);

        return response()->json([
            'message' => 'Local atualizado com sucesso.',
            'local' => $local
        ]);
    }

    public function toggleLocalStatus(string $id): JsonResponse
    {
        $local = Local::findOrFail($id);
        $novoStatus = !$local->ativo;
        $local->update(['ativo' => $novoStatus]);

        return response()->json([
            'message' => $novoStatus ? 'Local reativado com sucesso.' : 'Local desativado com sucesso.',
            'local' => $local
        ]);
    }
}
