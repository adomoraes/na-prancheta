<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AdversarioController;
use App\Http\Controllers\Api\AlmoxarifadoController;
use App\Http\Controllers\Api\AtletaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EscalacaoController;
use App\Http\Controllers\Api\LocalController;
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

// 2.1 LOCAIS & CAMPOS (Leitura pública)
Route::get('/locais', [LocalController::class, 'index']);

// 2.2 ADVERSÁRIOS & RIVAIS (Leitura pública)
Route::get('/adversarios', [AdversarioController::class, 'index']);

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

// 4. PAINEL ADMINISTRATIVO BACKOFFICE (Exclusivo ROOT)
Route::prefix('admin')->middleware(['auth:sanctum', 'role:root'])->group(function () {
    // 4.1 Usuários & Roles
    Route::get('/users', [AdminController::class, 'indexUsers']);
    Route::post('/users', [AdminController::class, 'storeUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::patch('/users/{id}/password', [AdminController::class, 'resetUserPassword']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

    // 4.2 Atletas & Elenco
    Route::get('/atletas', [AdminController::class, 'indexAtletas']);
    Route::post('/atletas', [AdminController::class, 'storeAtleta']);
    Route::put('/atletas/{id}', [AdminController::class, 'updateAtleta']);
    Route::patch('/atletas/{id}/status', [AdminController::class, 'toggleAtletaStatus']);

    // 4.3 Partidas & Vestiário
    Route::get('/partidas', [AdminController::class, 'indexPartidas']);
    Route::post('/partidas', [AdminController::class, 'storePartida']);
    Route::put('/partidas/{id}', [AdminController::class, 'updatePartida']);
    Route::patch('/partidas/{id}/status', [AdminController::class, 'updatePartidaStatus']);

    // 4.4 Caixa Geral & Financeiro
    Route::get('/caixa', [AdminController::class, 'indexCaixa']);
    Route::post('/caixa', [AdminController::class, 'storeCaixa']);

    // 4.5 Patrimônio Esportivo & Almoxarifado
    Route::get('/patrimonio', [AdminController::class, 'indexPatrimonio']);
    Route::post('/patrimonio', [AdminController::class, 'storePatrimonio']);
    Route::put('/patrimonio/{id}', [AdminController::class, 'updatePatrimonio']);
    Route::delete('/patrimonio/{id}', [AdminController::class, 'deletePatrimonio']);

    // 4.6 Locais & Campos da Partida
    Route::get('/locais', [AdminController::class, 'indexLocais']);
    Route::post('/locais', [AdminController::class, 'storeLocal']);
    Route::put('/locais/{id}', [AdminController::class, 'updateLocal']);
    Route::patch('/locais/{id}/status', [AdminController::class, 'toggleLocalStatus']);

    // 4.7 Adversários & Rivais
    Route::get('/adversarios', [AdminController::class, 'indexAdversarios']);
    Route::post('/adversarios', [AdminController::class, 'storeAdversario']);
    Route::put('/adversarios/{id}', [AdminController::class, 'updateAdversario']);
    Route::patch('/adversarios/{id}/status', [AdminController::class, 'toggleAdversarioStatus']);

    // 4.8 Scouts & Estatísticas
    Route::get('/scouts', [AdminController::class, 'indexScouts']);
    Route::get('/scouts/leaderboard', [AdminController::class, 'leaderboardScouts']);
    Route::post('/scouts', [AdminController::class, 'storeScout']);
    Route::put('/scouts/{id}', [AdminController::class, 'updateScout']);
    Route::delete('/scouts/{id}', [AdminController::class, 'deleteScout']);
});
