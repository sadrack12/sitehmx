<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitacoes_exames_laboratoriais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consulta_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('paciente_id')->constrained()->onDelete('cascade');
            $table->foreignId('exame_id')->constrained()->onDelete('cascade');
            $table->foreignId('medico_solicitante_id')->constrained('medicos')->onDelete('cascade');
            $table->date('data_solicitacao');
            $table->date('data_prevista_realizacao')->nullable();
            $table->date('data_realizacao')->nullable();
            $table->date('data_resultado')->nullable();
            $table->enum('status', ['solicitado', 'agendado', 'em_andamento', 'concluido', 'cancelado'])->default('solicitado');
            $table->text('observacoes')->nullable();
            $table->text('resultado')->nullable();
            $table->string('arquivo_resultado')->nullable();
            $table->boolean('urgente')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitacoes_exames_laboratoriais');
    }
};

