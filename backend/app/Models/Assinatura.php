<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assinatura extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'assinaturas';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'time_id',
        'plano_id',
        'ciclo',
        'status',
        'valor_centavos',
        'forma_pagamento_preferida',
        'data_inicio',
        'data_proxima_cobranca',
        'data_cancelamento',
        'provedor_assinatura_id',
    ];

    protected $casts = [
        'valor_centavos' => 'integer',
        'data_inicio' => 'datetime',
        'data_proxima_cobranca' => 'datetime',
        'data_cancelamento' => 'datetime',
    ];

    public function time(): BelongsTo
    {
        return $this->belongsTo(Time::class, 'time_id');
    }

    public function plano(): BelongsTo
    {
        return $this->belongsTo(Plano::class, 'plano_id');
    }

    public function faturas(): HasMany
    {
        return $this->hasMany(FaturaCobranca::class, 'assinatura_id');
    }

    public function isAtiva(): bool
    {
        return $this->status === 'ativa';
    }
}
