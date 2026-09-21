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

// 2. ELENCO & ATLETAS (Leitura pública, cadastro autenticado)
Route::get('/atletas', [AtletaController::class, 'index']);
Route::post('/atletas', [AtletaController::class, 'store'])->middleware('auth:sanctum');

// 3. PARTIDAS & VESTIÁRIO
Route::prefix('partidas/{id}')->group(function () {
    // 3.1 Consultas públicas (permitidas para visitantes compartilharem links do WhatsApp)
    Route::get('/', [PartidaController::class, 'show']);
    Route::get('/protocolo-vestiario', [PartidaController::class, 'protocoloVestiario']);
    Route::get('/escalacao', [EscalacaoController::class, 'getEscalacao']);
    Route::get('/vaquinha', [VaquinhaController::class, 'getVaquinha']);
    Route::get('/almoxarifado', [AlmoxarifadoController::class, 'getStatus']);
    Route::get('/scouts', [ScoutController::class, 'getScouts']);

    // 3.2 Mutações protegidas (exigem autenticação Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        // CONFIRMAÇÃO DE PRESENÇA & PONTUALIDADE
        Route::post('/presencas', [PresencaController::class, 'updatePresenca']);
        Route::post('/presencas/{atletaId}/chegada', [PresencaController::class, 'registrarChegada']);

        // PRANCHETA TÁTICA & ESCALAÇÃO (Exclusivo Técnico & Geral)
        Route::post('/escalacao', [EscalacaoController::class, 'salvarEscalacao'])->middleware('role:tecnico,geral');

        // VAQUINHA, PIX & CAIXA GERAL (Exclusivo Tesoureiro/Financeiro & Geral)
        Route::post('/vaquinha/{atletaId}/baixa', [VaquinhaController::class, 'registrarBaixa'])->middleware('role:financeiro,geral');
        Route::post('/vaquinha/encerrar', [VaquinhaController::class, 'encerrarVaquinha'])->middleware('role:financeiro,geral');

        // ALMOXARIFADO & TRAVA DA RESENHA (Exclusivo Almoxarifado & Geral)
        Route::post('/almoxarifado/fechar-malas', [AlmoxarifadoController::class, 'fecharMalas'])->middleware('role:almoxarifado,geral');

        // SCOUTS & ELEIÇÃO DE MVP (Exclusivo Técnico & Geral)
        Route::post('/scouts/{atletaId}', [ScoutController::class, 'salvarScout'])->middleware('role:tecnico,geral');
    });
});
