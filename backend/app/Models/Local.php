<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Local extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'locais';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'time_id',
        'nome',
        'endereco',
        'maps_url',
        'tipo_piso',
        'observacoes',
        'ativo',
    ];

    protected $casts = [
        'ativo' => 'boolean',
    ];

    public function time(): BelongsTo
    {
        return $this->belongsTo(Time::class, 'time_id');
    }

    public function partidas(): HasMany
    {
        return $this->hasMany(Partida::class, 'local_id');
    }
}
