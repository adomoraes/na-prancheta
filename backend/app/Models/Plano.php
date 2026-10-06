<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plano extends Model
{
    use HasFactory;

    protected $table = 'planos';

    protected $fillable = [
        'slug',
        'nome',
        'descricao',
        'preco_mensal_centavos',
        'preco_anual_centavos',
        'max_elencos',
        'max_atletas',
        'recursos',
        'ativo',
    ];

    protected $casts = [
        'preco_mensal_centavos' => 'integer',
        'preco_anual_centavos' => 'integer',
        'max_elencos' => 'integer',
        'max_atletas' => 'integer',
        'recursos' => 'array',
        'ativo' => 'boolean',
    ];

    public function assinaturas(): HasMany
    {
        return $this->hasMany(Assinatura::class, 'plano_id');
    }

    public function times(): HasMany
    {
        return $this->hasMany(Time::class, 'plano_id');
    }
}
