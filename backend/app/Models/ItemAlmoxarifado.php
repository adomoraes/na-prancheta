<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemAlmoxarifado extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'itens_almoxarifado';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'time_id',
        'nome',
        'categoria',
        'tipo_uniforme',
        'quantidade_total',
        'tamanho',
        'cor',
        'numero',
        'estado_conservacao',
        'observacoes',
        'ativo',
    ];

    protected $casts = [
        'quantidade_total' => 'integer',
        'ativo' => 'boolean',
    ];

    public function time(): BelongsTo
    {
        return $this->belongsTo(Time::class, 'time_id');
    }
}
