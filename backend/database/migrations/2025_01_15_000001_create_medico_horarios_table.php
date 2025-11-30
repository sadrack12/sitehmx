<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medico_horarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medico_id')->constrained()->onDelete('cascade');
            $table->date('data');
            $table->time('hora_inicio')->nullable();
            $table->time('hora_fim')->nullable();
            $table->boolean('disponivel')->default(true);
            $table->text('observacoes')->nullable();
            $table->timestamps();
            
            $table->unique(['medico_id', 'data']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medico_horarios');
    }
};

