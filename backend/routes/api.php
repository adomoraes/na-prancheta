<?php

use App\Http\Controllers\Api\AlmoxarifadoController;
use App\Http\Controllers\Api\AtletaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EscalacaoController;
use App\Http\Controllers\Api\PartidaController;
use App\Http\Controllers\Api\PresencaController;
use App\Http\Controllers\Api\ScoutController;
use App\Http\Controllers\Api\VaquinhaController;
use Illuminate\Support\Facades\Route;

// 1. AUTENTICAÇÃO (Laravel Sanctum)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
});

// 2. ELENCO & ATLETAS
Route::get('/atletas', [AtletaController::class, 'index']);
Route::post('/atletas', [AtletaController::class, 'store']);

// 3. PARTIDAS & VESTIÁRIO
Route::prefix('partidas/{id}')->group(function () {
    Route::get('/', [PartidaController::class, 'show']);
    Route::get('/protocolo-vestiario', [PartidaController::class, 'protocoloVestiario']);

    // 4. CONFIRMAÇÃO DE PRESENÇA & PONTUALIDADE
    Route::post('/presencas', [PresencaController::class, 'updatePresenca']);
    Route::post('/presencas/{atletaId}/chegada', [PresencaController::class, 'registrarChegada']);

    // 5. PRANCHETA TÁTICA & ESCALAÇÃO
    Route::get('/escalacao', [EscalacaoController::class, 'getEscalacao']);
    Route::post('/escalacao', [EscalacaoController::class, 'salvarEscalacao']);

    // 6. VAQUINHA, PIX & CAIXA GERAL
    Route::get('/vaquinha', [VaquinhaController::class, 'getVaquinha']);
    Route::post('/vaquinha/{atletaId}/baixa', [VaquinhaController::class, 'registrarBaixa']);
    Route::post('/vaquinha/encerrar', [VaquinhaController::class, 'encerrarVaquinha']);

    // 7. ALMOXARIFADO & TRAVA DA RESENHA
    Route::get('/almoxarifado', [AlmoxarifadoController::class, 'getStatus']);
    Route::post('/almoxarifado/fechar-malas', [AlmoxarifadoController::class, 'fecharMalas']);

    // 8. SCOUTS & ELEIÇÃO DE MVP
    Route::get('/scouts', [ScoutController::class, 'getScouts']);
    Route::post('/scouts/{atletaId}', [ScoutController::class, 'salvarScout']);
});
