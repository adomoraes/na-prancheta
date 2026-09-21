<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Partida extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'partidas';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'time_id',
        'local_id',
        'adversario_id',
        'adversario',
        'data_partida',
        'horario_inicio',
        'horario_chegada_t70',
        'horario_prelecao_t35',
        'local_nome',
        'local_endereco',
        'local_maps_url',
        'cor_uniforme',
        'limite_confirmados',
        'meta_arrecadacao_centavos',
        'valor_cota_centavos',
        'chave_pix_cobranca',
        'status',
    ];

    protected $casts = [
        'data_partida' => 'date',
        'limite_confirmados' => 'integer',
        'meta_arrecadacao_centavos' => 'integer',
        'valor_cota_centavos' => 'integer',
    ];

    protected $appends = [
        'data_hora',
        'horario_vestiario_t50',
        'horario_prelecao_t35',
        'horario_aquecimento_t25',
        'taxa_arbitragem_centavos',
    ];

    public function getDataHoraAttribute(): string
    {
        return $this->inicio_date_time->toIso8601String();
    }

    public function getHorarioVestiarioT50Attribute(): string
    {
        return $this->inicio_date_time->copy()->subMinutes(50)->toIso8601String();
    }

    public function getHorarioPrelecaoT35Attribute(): string
    {
        return $this->inicio_date_time->copy()->subMinutes(35)->toIso8601String();
    }

    public function getHorarioAquecimentoT25Attribute(): string
    {
        return $this->inicio_date_time->copy()->subMinutes(25)->toIso8601String();
    }

    public function getTaxaArbitragemCentavosAttribute(): int
    {
        return $this->valor_cota_centavos ?? 2500;
    }

    public function time(): BelongsTo
    {
        return $this->belongsTo(Time::class, 'time_id');
    }

    public function local(): BelongsTo
    {
        return $this->belongsTo(Local::class, 'local_id');
    }

    public function adversarioRel(): BelongsTo
    {
        return $this->belongsTo(Adversario::class, 'adversario_id');
    }

    public function confirmacoes(): HasMany
    {
        return $this->hasMany(ConfirmacaoPresenca::class, 'partida_id');
    }

    public function titulares(): HasMany
    {
        return $this->hasMany(PartidaTitular::class, 'partida_id');
    }

    public function vaquinhas(): HasMany
    {
        return $this->hasMany(VaquinhaLancamento::class, 'partida_id');
    }

    public function scouts(): HasMany
    {
        return $this->hasMany(ScoutPartida::class, 'partida_id');
    }

    public function conferenciaMala(): HasOne
    {
        return $this->hasOne(ConferenciaMala::class, 'partida_id');
    }

    /**
     * Retorna o DateTime canônico de início da partida
     */
    public function getInicioDateTimeAttribute(): Carbon
    {
        return Carbon::parse($this->data_partida->format('Y-m-d') . ' ' . $this->horario_inicio);
    }
}
