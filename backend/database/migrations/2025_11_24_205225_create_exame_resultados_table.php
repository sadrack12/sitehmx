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
        Schema::create('exame_resultados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consulta_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('paciente_id')->constrained()->onDelete('cascade');
            $table->foreignId('exame_id')->constrained()->onDelete('cascade');
            $table->foreignId('medico_solicitante_id')->nullable()->constrained('medicos')->onDelete('set null');
            $table->date('data_solicitacao');
            $table->date('data_realizacao')->nullable();
            $table->date('data_resultado')->nullable();
            $table->text('resultado')->nullable();
            $table->string('arquivo_anexo')->nullable();
            $table->enum('status', ['solicitado', 'realizado', 'resultado_disponivel'])->default('solicitado');
            $table->text('observacoes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exame_resultados');
    }
};
