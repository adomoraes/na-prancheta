<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaixaMovimentacao extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'caixa_movimentacoes';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'time_id',
        'partida_id',
        'tipo',
        'valor_centavos',
        'descricao',
        'responsavel_id',
        'data_movimentacao',
    ];

    protected $casts = [
        'valor_centavos' => 'integer',
        'data_movimentacao' => 'datetime',
    ];

    public function time(): BelongsTo
    {
        return $this->belongsTo(Time::class, 'time_id');
    }

    public function partida(): BelongsTo
    {
        return $this->belongsTo(Partida::class, 'partida_id');
    }

    public function responsavel(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsavel_id');
    }
}
