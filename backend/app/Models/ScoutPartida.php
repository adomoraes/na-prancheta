<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScoutPartida extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'scouts_partida';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'partida_id',
        'atleta_id',
        'gols',
        'assistencias',
        'cartoes_amarelos',
        'cartoes_vermelhos',
        'gols_sofridos_goleiro',
        'minutos_jogados',
        'foi_mvp',
    ];

    protected $casts = [
        'gols' => 'integer',
        'assistencias' => 'integer',
        'cartoes_amarelos' => 'integer',
        'cartoes_vermelhos' => 'integer',
        'gols_sofridos_goleiro' => 'integer',
        'minutos_jogados' => 'integer',
        'foi_mvp' => 'boolean',
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
