<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosicaoCampo extends Model
{
    use HasFactory;

    protected $table = 'posicoes_campo';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'nome',
        'sigla',
        'coord_x_percent',
        'coord_y_percent',
    ];

    public function titulares(): HasMany
    {
        return $this->hasMany(PartidaTitular::class, 'posicao_campo_id');
    }
}
