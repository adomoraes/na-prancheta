<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FaturaCobranca extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'faturas_cobranca';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'assinatura_id',
        'time_id',
        'valor_centavos',
        'status',
        'metodo_pagamento',
        'pix_qrcode',
        'pix_copia_cola',
        'data_vencimento',
        'data_pagamento',
        'transacao_provedor_id',
        'webhook_payload',
    ];

    protected $casts = [
        'valor_centavos' => 'integer',
        'data_vencimento' => 'datetime',
        'data_pagamento' => 'datetime',
        'webhook_payload' => 'array',
    ];

    public function time(): BelongsTo
    {
        return $this->belongsTo(Time::class, 'time_id');
    }

    public function assinatura(): BelongsTo
    {
        return $this->belongsTo(Assinatura::class, 'assinatura_id');
    }

    public function isPaga(): bool
    {
        return $this->status === 'paga';
    }
}
