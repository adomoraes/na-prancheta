<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConferenciaMala extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'conferencias_malas';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'partida_id',
        'custodiante_id',
        'camisas_recolhidas',
        'todas_camisas_desviradas',
        'bolas_recolhidas',
        'kit_cones_recolhido',
        'mala_trancada_no_carro',
        'resenha_liberada',
        'liberada_em',
    ];

    protected $casts = [
        'camisas_recolhidas' => 'integer',
        'todas_camisas_desviradas' => 'boolean',
        'bolas_recolhidas' => 'integer',
        'kit_cones_recolhido' => 'boolean',
        'mala_trancada_no_carro' => 'boolean',
        'resenha_liberada' => 'boolean',
        'liberada_em' => 'datetime',
    ];

    public function partida(): BelongsTo
    {
        return $this->belongsTo(Partida::class, 'partida_id');
    }

    public function custodiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'custodiante_id');
    }
}
