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

// 1. AUTENTICAÇÃO (Laravel Sanctum & Google GIS)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/google', [AuthController::class, 'loginGoogle']);
    Route::post('/dev-login', [AuthController::class, 'devLogin']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
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

    // 5. PRANCHETA TÁTICA & ESCALAÇÃO (Exclusivo Técnico & Geral)
    Route::get('/escalacao', [EscalacaoController::class, 'getEscalacao']);
    Route::post('/escalacao', [EscalacaoController::class, 'salvarEscalacao'])->middleware('role:tecnico,geral');

    // 6. VAQUINHA, PIX & CAIXA GERAL (Exclusivo Tesoureiro/Financeiro & Geral)
    Route::get('/vaquinha', [VaquinhaController::class, 'getVaquinha']);
    Route::post('/vaquinha/{atletaId}/baixa', [VaquinhaController::class, 'registrarBaixa'])->middleware('role:financeiro,geral');
    Route::post('/vaquinha/encerrar', [VaquinhaController::class, 'encerrarVaquinha'])->middleware('role:financeiro,geral');

    // 7. ALMOXARIFADO & TRAVA DA RESENHA (Exclusivo Almoxarifado & Geral)
    Route::get('/almoxarifado', [AlmoxarifadoController::class, 'getStatus']);
    Route::post('/almoxarifado/fechar-malas', [AlmoxarifadoController::class, 'fecharMalas'])->middleware('role:almoxarifado,geral');

    // 8. SCOUTS & ELEIÇÃO DE MVP (Exclusivo Técnico & Geral)
    Route::get('/scouts', [ScoutController::class, 'getScouts']);
    Route::post('/scouts/{atletaId}', [ScoutController::class, 'salvarScout'])->middleware('role:tecnico,geral');
});
