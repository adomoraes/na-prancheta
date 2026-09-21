<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Local;
use App\Models\Time;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $time = Time::first();
        $timeId = $request->query('time_id', $time?->id);

        $query = Local::where('ativo', true);

        if ($timeId) {
            $query->where('time_id', $timeId);
        }

        $locais = $query->orderBy('nome')->get();

        return response()->json($locais);
    }
}
