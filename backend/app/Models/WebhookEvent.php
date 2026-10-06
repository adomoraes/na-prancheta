<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookEvent extends Model
{
    use HasFactory;

    protected $table = 'webhook_events';

    protected $fillable = [
        'event_id',
        'provedor',
        'tipo_evento',
        'processado',
        'payload',
    ];

    protected $casts = [
        'processado' => 'boolean',
        'payload' => 'array',
    ];
}
