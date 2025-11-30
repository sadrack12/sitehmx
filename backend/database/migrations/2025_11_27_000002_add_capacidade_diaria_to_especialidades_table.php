<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('especialidades', function (Blueprint $table) {
            $table->integer('capacidade_diaria')->default(10)->after('ativa')->comment('Número máximo de consultas por médico por dia para esta especialidade');
        });
    }

    public function down(): void
    {
        Schema::table('especialidades', function (Blueprint $table) {
            $table->dropColumn('capacidade_diaria');
        });
    }
};

