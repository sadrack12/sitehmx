<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PdfConfiguracao extends Model
{
    use HasFactory;

    protected $table = 'pdf_configuracoes';

    protected $fillable = [
        'nome_instituicao',
        'a_republica',
        'o_ministerio',
        'o_governo',
        'endereco',
        'telefone',
        'email',
        'logo_path',
        'texto_cabecalho',
        'rodape_texto',
        'mostrar_logo',
        'mostrar_endereco',
        'mostrar_contato',
    ];

    protected $casts = [
        'mostrar_logo' => 'boolean',
        'mostrar_endereco' => 'boolean',
        'mostrar_contato' => 'boolean',
    ];
}

