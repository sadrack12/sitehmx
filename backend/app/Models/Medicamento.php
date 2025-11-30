<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicamento extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'principio_ativo',
        'apresentacao',
        'descricao',
        'ativo',
    ];

    protected $casts = [
        'ativo' => 'boolean',
    ];
}
