<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Adversario;
use App\Models\Time;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdversarioController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $time = Time::first();
        $timeId = $request->query('time_id', $time?->id);

        $query = Adversario::where('ativo', true);

        if ($timeId) {
            $query->where('time_id', $timeId);
        }

        $adversarios = $query->orderBy('nome')->get();

        return response()->json($adversarios);
    }
}
