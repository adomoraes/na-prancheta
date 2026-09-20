<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Time extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'times';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'nome',
        'escudo_url',
    ];

    public function atletas(): HasMany
    {
        return $this->hasMany(Atleta::class, 'time_id');
    }

    public function partidas(): HasMany
    {
        return $this->hasMany(Partida::class, 'time_id');
    }
}
