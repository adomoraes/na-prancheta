<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Atleta extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'atletas';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'time_id',
        'user_id',
        'nome',
        'apelido',
        'numero_camisa',
        'posicao_principal',
        'posicao_secundaria',
        'tipo_vinculo',
        'ativo',
    ];

    protected $casts = [
        'numero_camisa' => 'integer',
        'ativo' => 'boolean',
    ];

    public function time(): BelongsTo
    {
        return $this->belongsTo(Time::class, 'time_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function confirmacoes(): HasMany
    {
        return $this->hasMany(ConfirmacaoPresenca::class, 'atleta_id');
    }

    public function titulares(): HasMany
    {
        return $this->hasMany(PartidaTitular::class, 'atleta_id');
    }

    public function vaquinhas(): HasMany
    {
        return $this->hasMany(VaquinhaLancamento::class, 'atleta_id');
    }

    public function scouts(): HasMany
    {
        return $this->hasMany(ScoutPartida::class, 'atleta_id');
    }
}
