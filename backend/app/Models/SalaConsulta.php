<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalaConsulta extends Model
{
    use HasFactory;

    protected $table = 'salas_consultas';

    protected $fillable = [
        'numero',
        'nome',
        'descricao',
        'tipo',
        'disponivel',
        'equipamentos',
    ];

    protected $casts = [
        'disponivel' => 'boolean',
    ];

    public function especialidades()
    {
        return $this->belongsToMany(Especialidade::class, 'especialidade_sala', 'sala_id', 'especialidade_id');
    }
}

