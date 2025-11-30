<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consulta extends Model
{
    use HasFactory;

    protected $fillable = [
        'paciente_id',
        'medico_id',
        'sala_id',
        'data_consulta',
        'hora_consulta',
        'tipo_consulta',
        'status',
        'agendada_online',
        'consulta_online',
        'link_videoconferencia',
        'sala_videoconferencia',
        'inicio_consulta_online',
        'fim_consulta_online',
        'observacoes',
        'queixa_principal',
        'historia_doenca_atual',
        'historia_patologica_pregressa',
        'historia_familiar',
        'historia_social',
        'exame_fisico',
        'pressao_arterial',
        'frequencia_cardiaca',
        'frequencia_respiratoria',
        'temperatura',
        'peso',
        'altura',
        'diagnostico',
        'conduta',
        'prescricao',
        'exames_complementares',
    ];

    protected $casts = [
        'data_consulta' => 'date',
        'agendada_online' => 'boolean',
        'consulta_online' => 'boolean',
        'inicio_consulta_online' => 'datetime',
        'fim_consulta_online' => 'datetime',
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    public function medico()
    {
        return $this->belongsTo(Medico::class);
    }

    public function sala()
    {
        return $this->belongsTo(SalaConsulta::class, 'sala_id');
    }

    public function solicitacoesExames()
    {
        return $this->hasMany(SolicitacaoExameLaboratorio::class, 'consulta_id');
    }
}

