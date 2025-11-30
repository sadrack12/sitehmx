<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exames', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('nome');
            $table->text('descricao')->nullable();
            $table->enum('tipo', ['laboratorio', 'imagem', 'clinico', 'outro'])->default('laboratorio');
            $table->decimal('valor', 10, 2)->nullable();
            $table->integer('prazo_resultado')->nullable()->comment('Prazo em dias para resultado');
            $table->text('preparo')->nullable()->comment('Instruções de preparo');
            $table->boolean('requer_jejum')->default(false);
            $table->boolean('ativo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exames');
    }
};

