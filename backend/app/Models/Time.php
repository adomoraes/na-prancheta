<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Time extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'times';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'nome',
        'slug',
        'sigla',
        'escudo_url',
        'cor_primaria',
        'cor_secundaria',
        'modalidade',
        'status',
        'trial_ends_at',
        'plano_id',
    ];

    protected $casts = [
        'trial_ends_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function plano(): BelongsTo
    {
        return $this->belongsTo(Plano::class, 'plano_id');
    }

    public function assinaturas(): HasMany
    {
        return $this->hasMany(Assinatura::class, 'time_id');
    }

    public function assinaturaAtiva(): HasOne
    {
        return $this->hasOne(Assinatura::class, 'time_id')->where('status', 'ativa')->latestOfMany();
    }

    public function faturas(): HasMany
    {
        return $this->hasMany(FaturaCobranca::class, 'time_id');
    }

    public function atletas(): HasMany
    {
        return $this->hasMany(Atleta::class, 'time_id');
    }

    public function partidas(): HasMany
    {
        return $this->hasMany(Partida::class, 'time_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'time_id');
    }

    public function isTrial(): bool
    {
        return $this->status === 'trial' && $this->trial_ends_at && $this->trial_ends_at->isFuture();
    }

    public function isSuspenso(): bool
    {
        if ($this->status === 'suspenso' || $this->status === 'cancelado') {
            return true;
        }

        // Se estiver marcado como trial mas o prazo expirou sem assinatura ativa
        if ($this->status === 'trial' && $this->trial_ends_at && $this->trial_ends_at->isPast()) {
            return true;
        }

        return false;
    }

    public function isAtivo(): bool
    {
        return !$this->isSuspenso();
    }

    public function diasRestantesTrial(): int
    {
        if (!$this->trial_ends_at || $this->trial_ends_at->isPast()) {
            return 0;
        }

        return (int) Carbon::now()->diffInDays($this->trial_ends_at, false);
    }
}
