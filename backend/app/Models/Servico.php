<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servico extends Model
{
    use HasFactory;

    protected $table = 'servicos';

    protected $fillable = [
        'title',
        'description',
        'tipo',
        'icon',
        'image',
        'href',
        'published',
        'order',
    ];

    protected $casts = [
        'published' => 'boolean',
        'order' => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    public function scopeTipo($query, $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}

