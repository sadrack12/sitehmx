<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Valor extends Model
{
    use HasFactory;

    protected $table = 'valores';

    protected $fillable = [
        'icon',
        'title',
        'description',
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

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}

