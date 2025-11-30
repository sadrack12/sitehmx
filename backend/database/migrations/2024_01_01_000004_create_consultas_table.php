<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained()->onDelete('cascade');
            $table->foreignId('medico_id')->constrained()->onDelete('cascade');
            $table->date('data_consulta');
            $table->time('hora_consulta');
            $table->string('tipo_consulta');
            $table->enum('status', ['agendada', 'confirmada', 'realizada', 'cancelada'])->default('agendada');
            $table->text('observacoes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultas');
    }
};

