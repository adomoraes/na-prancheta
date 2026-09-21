<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestorLead extends Model
{
    use HasFactory;

    protected $table = 'investor_leads';

    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'tipo_investidor',
        'ticket_estimado',
        'mensagem',
        'origem',
        'ip_address',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
