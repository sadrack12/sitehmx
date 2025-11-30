<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medico extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'crm',
        'especialidade',
        'email',
        'telefone',
    ];

    public function consultas()
    {
        return $this->hasMany(Consulta::class);
    }

    public function horarios()
    {
        return $this->hasMany(\App\Models\MedicoHorario::class);
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }
}

