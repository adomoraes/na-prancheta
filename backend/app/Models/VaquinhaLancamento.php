<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VaquinhaLancamento extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'vaquinha_lancamentos';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'partida_id',
        'atleta_id',
        'valor_devido_centavos',
        'status',
        'pago_em',
        'tesoureiro_id',
        'metodo_pagamento',
        'comprovante_ref',
    ];

    protected $casts = [
        'valor_devido_centavos' => 'integer',
        'pago_em' => 'datetime',
    ];

    public function partida(): BelongsTo
    {
        return $this->belongsTo(Partida::class, 'partida_id');
    }

    public function atleta(): BelongsTo
    {
        return $this->belongsTo(Atleta::class, 'atleta_id');
    }

    public function tesoureiro(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tesoureiro_id');
    }
}
