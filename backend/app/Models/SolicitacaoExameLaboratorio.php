<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitacaoExameLaboratorio extends Model
{
    use HasFactory;

    protected $table = 'solicitacoes_exames_laboratoriais';

    protected $fillable = [
        'bulk_group_id',
        'consulta_id',
        'paciente_id',
        'exame_id',
        'medico_solicitante_id',
        'data_solicitacao',
        'data_prevista_realizacao',
        'data_realizacao',
        'data_resultado',
        'status',
        'observacoes',
        'resultado',
        'arquivo_resultado',
        'urgente',
    ];

    protected $casts = [
        'data_solicitacao' => 'date',
        'data_prevista_realizacao' => 'date',
        'data_realizacao' => 'date',
        'data_resultado' => 'date',
        'urgente' => 'boolean',
    ];

    public function consulta()
    {
        return $this->belongsTo(Consulta::class);
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    public function exame()
    {
        return $this->belongsTo(Exame::class);
    }

    public function medicoSolicitante()
    {
        return $this->belongsTo(Medico::class, 'medico_solicitante_id');
    }

    protected $hidden = [];
    
    protected $appends = [];
}

