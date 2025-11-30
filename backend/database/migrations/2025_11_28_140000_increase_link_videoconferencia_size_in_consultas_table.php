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
            // Alterar link_videoconferencia de string (255) para text para suportar URLs longas
            $table->text('link_videoconferencia')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consultas', function (Blueprint $table) {
            // Reverter para string (255)
            $table->string('link_videoconferencia', 255)->nullable()->change();
        });
    }
};

