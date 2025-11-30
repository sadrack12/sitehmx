<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exame extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'nome',
        'descricao',
        'tipo',
        'valor',
        'prazo_resultado',
        'preparo',
        'requer_jejum',
        'ativo',
    ];

    protected $casts = [
        'valor' => 'decimal:2',
        'requer_jejum' => 'boolean',
        'ativo' => 'boolean',
    ];
}

