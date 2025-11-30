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
        Schema::table('consultas', function (Blueprint $table) {
            $table->boolean('consulta_online')->default(false)->after('agendada_online');
            $table->string('link_videoconferencia')->nullable()->after('consulta_online');
            $table->string('sala_videoconferencia')->nullable()->after('link_videoconferencia');
            $table->timestamp('inicio_consulta_online')->nullable()->after('sala_videoconferencia');
            $table->timestamp('fim_consulta_online')->nullable()->after('inicio_consulta_online');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            $table->dropColumn([
                'consulta_online',
                'link_videoconferencia',
                'sala_videoconferencia',
                'inicio_consulta_online',
                'fim_consulta_online',
            ]);
        });
    }
};
