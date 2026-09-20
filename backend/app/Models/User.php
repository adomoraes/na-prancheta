<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'phone',
        'email',
        'password',
        'role',
        'google_id',
        'avatar_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function atleta(): HasOne
    {
        return $this->hasOne(Atleta::class, 'user_id');
    }

    /**
     * Retorna a role canônica do usuário (ex: 'admin' mapeado para 'geral')
     */
    public function getRoleAttribute(?string $value): string
    {
        if ($value === 'admin') return 'geral';
        if ($value === 'tesoureiro') return 'financeiro';
        return $value ?? 'atleta';
    }

    /**
     * Verifica se o usuário possui alguma das roles especificadas
     */
    public function hasRole(string|array $roles): bool
    {
        $currentRole = $this->role;

        // Perfil 'geral' tem acesso de superusuário administrativo
        if ($currentRole === 'geral') {
            return true;
        }

        if (is_array($roles)) {
            return in_array($currentRole, $roles, true);
        }

        return $currentRole === $roles;
    }

    public function isAtleta(): bool
    {
        return $this->hasRole('atleta');
    }

    public function isTecnico(): bool
    {
        return $this->hasRole('tecnico');
    }

    public function isFinanceiro(): bool
    {
        return $this->hasRole('financeiro');
    }

    public function isAlmoxarifado(): bool
    {
        return $this->hasRole('almoxarifado');
    }

    public function isGeral(): bool
    {
        return $this->role === 'geral';
    }
}
