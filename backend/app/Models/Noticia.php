<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Noticia extends Model
{
    use HasFactory;

    protected $table = 'noticias';

    protected $fillable = [
        'title',
        'description',
        'date',
        'image',
        'color',
        'published',
        'order',
    ];

    protected $casts = [
        'date' => 'date',
        'published' => 'boolean',
        'order' => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('date', 'desc');
    }
}

