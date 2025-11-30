<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorpoDiretivo extends Model
{
    use HasFactory;

    protected $table = 'corpo_diretivo';

    protected $fillable = [
        'name',
        'cargo',
        'bio',
        'image',
        'published',
        'order',
        'parent_id',
        'nivel',
    ];

    protected $casts = [
        'published' => 'boolean',
        'order' => 'integer',
        'parent_id' => 'integer',
        'nivel' => 'integer',
    ];

    // Relacionamento com parent (superior hierárquico)
    public function parent()
    {
        return $this->belongsTo(CorpoDiretivo::class, 'parent_id');
    }

    // Relacionamento com filhos (subordinados)
    public function children()
    {
        return $this->hasMany(CorpoDiretivo::class, 'parent_id')->ordered();
    }

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}

