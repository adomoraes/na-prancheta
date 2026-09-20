<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartidaTitular extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'partida_titulares';
    public $timestamps = false;
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'partida_id',
        'atleta_id',
        'posicao_campo_id',
        'escalado_em',
    ];

    protected $casts = [
        'escalado_em' => 'datetime',
        'posicao_campo_id' => 'integer',
    ];

    public function partida(): BelongsTo
    {
        return $this->belongsTo(Partida::class, 'partida_id');
    }

    public function atleta(): BelongsTo
    {
        return $this->belongsTo(Atleta::class, 'atleta_id');
    }

    public function posicaoCampo(): BelongsTo
    {
        return $this->belongsTo(PosicaoCampo::class, 'posicao_campo_id');
    }
}
