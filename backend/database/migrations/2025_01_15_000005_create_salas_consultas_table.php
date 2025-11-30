<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salas_consultas', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->string('nome')->nullable();
            $table->text('descricao')->nullable();
            $table->enum('tipo', ['consulta', 'exame', 'cirurgia', 'outro'])->default('consulta');
            $table->boolean('disponivel')->default(true);
            $table->text('equipamentos')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salas_consultas');
    }
};

