<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

    protected $table = 'eventos';

    protected $fillable = [
        'title',
        'date',
        'featured',
        'image',
        'color',
        'description',
        'published',
        'order',
    ];

    protected $casts = [
        'date' => 'date',
        'featured' => 'boolean',
        'published' => 'boolean',
        'order' => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('date', 'desc');
    }
}

