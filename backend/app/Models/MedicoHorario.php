<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicoHorario extends Model
{
    use HasFactory;

    protected $fillable = [
        'medico_id',
        'data',
        'hora_inicio',
        'hora_fim',
        'disponivel',
        'observacoes',
    ];

    protected $casts = [
        'data' => 'date',
        'hora_inicio' => 'string',
        'hora_fim' => 'string',
        'disponivel' => 'boolean',
    ];

    public function medico()
    {
        return $this->belongsTo(Medico::class);
    }
}

