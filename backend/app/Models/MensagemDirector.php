<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MensagemDirector extends Model
{
    use HasFactory;

    protected $table = 'mensagem_director';

    protected $fillable = [
        'director_name',
        'message',
        'image',
        'published',
    ];

    protected $casts = [
        'published' => 'boolean',
    ];

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }
}

