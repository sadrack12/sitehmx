<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('especialidade_sala', function (Blueprint $table) {
            $table->id();
            $table->foreignId('especialidade_id')->constrained('especialidades')->onDelete('cascade');
            $table->foreignId('sala_id')->constrained('salas_consultas')->onDelete('cascade');
            $table->timestamps();
            
            // Evitar duplicatas
            $table->unique(['especialidade_id', 'sala_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('especialidade_sala');
    }
};
