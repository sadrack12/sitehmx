<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pdf_configuracoes', function (Blueprint $table) {
            $table->id();
            $table->string('nome_instituicao')->default('Hospital Geral do Moxico');
            $table->string('a_republica')->nullable();
            $table->string('o_ministerio')->nullable();
            $table->string('o_governo')->nullable();
            $table->text('endereco')->nullable();
            $table->string('telefone')->nullable();
            $table->string('email')->nullable();
            $table->string('logo_path')->nullable();
            $table->text('texto_cabecalho')->nullable();
            $table->text('rodape_texto')->nullable();
            $table->boolean('mostrar_logo')->default(true);
            $table->boolean('mostrar_endereco')->default(true);
            $table->boolean('mostrar_contato')->default(true);
            $table->timestamps();
        });

        // Inserir configuração padrão
        DB::table('pdf_configuracoes')->insert([
            'nome_instituicao' => 'Hospital Geral do Moxico',
            'a_republica' => null,
            'o_ministerio' => null,
            'o_governo' => null,
            'endereco' => 'Luena, Moxico, Angola',
            'telefone' => '+244 XXX XXX XXX',
            'email' => 'info@hospitalmoxico.gov.ao',
            'logo_path' => null,
            'texto_cabecalho' => null,
            'rodape_texto' => null,
            'mostrar_logo' => true,
            'mostrar_endereco' => true,
            'mostrar_contato' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pdf_configuracoes');
    }
};
