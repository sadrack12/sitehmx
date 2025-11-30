<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parceiro extends Model
{
    use HasFactory;

    protected $table = 'parceiros';

    protected $fillable = [
        'name',
        'logo',
        'url',
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

