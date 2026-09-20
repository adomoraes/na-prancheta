<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partida;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartidaController extends Controller
{
    public function show(string $id): JsonResponse
    {
        $partida = Partida::with([
            'time',
            'confirmacoes.atleta',
            'titulares.atleta',
            'titulares.posicaoCampo',
            'vaquinhas.atleta',
            'scouts.atleta',
            'conferenciaMala.custodiante',
        ])->findOrFail($id);

        $confirmadosCount = $partida->confirmacoes->where('status', 'confirmado')->count();
        $esperaCount = $partida->confirmacoes->where('status', 'lista_espera')->count();
        $ausentesCount = $partida->confirmacoes->where('status', 'ausente')->count();
        $duvidasCount = $partida->confirmacoes->where('status', 'duvida')->count();

        $totalArrecadadoCentavos = $partida->vaquinhas->where('status', 'pago')->sum('valor_devido_centavos');

        return response()->json([
            'partida' => $partida,
            'metricas' => [
                'confirmados' => $confirmadosCount,
                'lista_espera' => $esperaCount,
                'ausentes' => $ausentesCount,
                'duvidas' => $duvidasCount,
                'vagas_restantes' => max(0, $partida->limite_confirmados - $confirmadosCount),
                'total_arrecadado_centavos' => $totalArrecadadoCentavos,
                'meta_atingida' => ($totalArrecadadoCentavos >= $partida->meta_arrecadacao_centavos),
            ]
        ]);
    }

    public function protocoloVestiario(Request $request, string $id): JsonResponse
    {
        $partida = Partida::findOrFail($id);

        $referenciaTime = $request->query('mock_time') 
            ? Carbon::parse($request->query('mock_time'))
            : now();

        $inicioDateTime = Carbon::parse($partida->data_partida->format('Y-m-d') . ' ' . $partida->horario_inicio);

        $minutosRestantes = (int) $referenciaTime->diffInMinutes($inicioDateTime, false);

        if ($minutosRestantes > 50) {
            $marcoAtivo = 'Abertura do Vestiário (T-70)';
            $faseDescricao = 'Recepção de atletas e entrega de uniformes oficiais.';
            $prelecaoEmAndamento = false;
        } elseif ($minutosRestantes > 35) {
            $marcoAtivo = 'Fardamento e Uniforme (T-50)';
            $faseDescricao = 'Atletas equipados com chuteiras e uniformes da rodada.';
            $prelecaoEmAndamento = false;
        } elseif ($minutosRestantes > 25) {
            $marcoAtivo = 'Preleção Técnica e Trava Disciplinar (T-35)';
            $faseDescricao = 'Portas fechadas. Definição tática dos 11 titulares. Atrasados vão para o banco.';
            $prelecaoEmAndamento = true;
        } elseif ($minutosRestantes >= 0) {
            $marcoAtivo = 'Aquecimento em Campo (T-25)';
            $faseDescricao = 'Protocolo neuromuscular de 4 fases no gramado.';
            $prelecaoEmAndamento = false;
        } else {
            $marcoAtivo = 'Partida em Andamento';
            $faseDescricao = 'Bola rolando.';
            $prelecaoEmAndamento = false;
        }

        $fasesFisiologicas = [
            ['fase' => 1, 'nome' => 'Ativação Miofascial & Core', 'duracao_min' => 5, 'foco' => 'Glúteos, abdômen e mobilidade de tornozelo'],
            ['fase' => 2, 'nome' => 'Mobilidade Dinâmica & Alongamento Ativo', 'duracao_min' => 7, 'foco' => 'Passadas dinâmicas, adutores e isquiotibiais'],
            ['fase' => 3, 'nome' => 'Deslocamentos, Saltos & Aceleração', 'duracao_min' => 6, 'foco' => 'Mudanças de direção e sprints curtos'],
            ['fase' => 4, 'nome' => 'Ações Técnicas com Bola', 'duracao_min' => 7, 'foco' => 'Rondo, passe rápido e finalização a gol'],
        ];

        return response()->json([
            'partida_id' => $partida->id,
            'horario_inicio' => $inicioDateTime->toIso8601String(),
            'tempo_restante_minutos' => $minutosRestantes,
            'marco_ativo' => $marcoAtivo,
            'fase_descricao' => $faseDescricao,
            'prelecao_em_andamento' => $prelecaoEmAndamento,
            'sequencia_fisiologica' => $fasesFisiologicas,
        ]);
    }
}
