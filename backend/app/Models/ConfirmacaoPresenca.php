<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConfirmacaoPresenca extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'confirmacoes_presenca';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'partida_id',
        'atleta_id',
        'status',
        'ordem_fila_espera',
        'chegou_vestiario_em',
        'atrasado_prelecao_t35',
        'respondido_em',
    ];

    protected $casts = [
        'atrasado_prelecao_t35' => 'boolean',
        'ordem_fila_espera' => 'integer',
        'chegou_vestiario_em' => 'datetime',
        'respondido_em' => 'datetime',
    ];

    public function partida(): BelongsTo
    {
        return $this->belongsTo(Partida::class, 'partida_id');
    }

    public function atleta(): BelongsTo
    {
        return $this->belongsTo(Atleta::class, 'atleta_id');
    }
}
