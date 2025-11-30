<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Especialidade extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'descricao',
        'ativa',
        'capacidade_diaria',
    ];

    protected $casts = [
        'ativa' => 'boolean',
    ];

    public function medicos()
    {
        return $this->hasMany(Medico::class, 'especialidade', 'nome');
    }

    public function salas()
    {
        return $this->belongsToMany(SalaConsulta::class, 'especialidade_sala', 'especialidade_id', 'sala_id');
    }
}

