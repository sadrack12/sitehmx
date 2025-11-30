<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'nif',
        'email',
        'telefone',
        'data_nascimento',
        'endereco',
        'cidade',
        'estado',
    ];

    protected $casts = [
        'data_nascimento' => 'date',
    ];

    public function consultas()
    {
        return $this->hasMany(Consulta::class);
    }
}

