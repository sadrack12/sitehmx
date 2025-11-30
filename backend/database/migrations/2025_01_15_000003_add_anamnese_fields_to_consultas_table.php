<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            // Anamnese
            $table->text('queixa_principal')->nullable()->after('observacoes');
            $table->text('historia_doenca_atual')->nullable()->after('queixa_principal');
            $table->text('historia_patologica_pregressa')->nullable()->after('historia_doenca_atual');
            $table->text('historia_familiar')->nullable()->after('historia_patologica_pregressa');
            $table->text('historia_social')->nullable()->after('historia_familiar');
            
            // Exame Físico
            $table->text('exame_fisico')->nullable()->after('historia_social');
            $table->string('pressao_arterial')->nullable()->after('exame_fisico');
            $table->string('frequencia_cardiaca')->nullable()->after('pressao_arterial');
            $table->string('frequencia_respiratoria')->nullable()->after('frequencia_cardiaca');
            $table->string('temperatura')->nullable()->after('frequencia_respiratoria');
            $table->string('peso')->nullable()->after('temperatura');
            $table->string('altura')->nullable()->after('peso');
            
            // Diagnóstico e Conduta
            $table->text('diagnostico')->nullable()->after('altura');
            $table->text('conduta')->nullable()->after('diagnostico');
            $table->text('prescricao')->nullable()->after('conduta');
            $table->text('exames_complementares')->nullable()->after('prescricao');
        });
    }

    public function down(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            $table->dropColumn([
                'queixa_principal',
                'historia_doenca_atual',
                'historia_patologica_pregressa',
                'historia_familiar',
                'historia_social',
                'exame_fisico',
                'pressao_arterial',
                'frequencia_cardiaca',
                'frequencia_respiratoria',
                'temperatura',
                'peso',
                'altura',
                'diagnostico',
                'conduta',
                'prescricao',
                'exames_complementares',
            ]);
        });
    }
};

