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
        Schema::table('corpo_diretivo', function (Blueprint $table) {
            $table->unsignedBigInteger('parent_id')->nullable()->after('id');
            $table->integer('nivel')->default(1)->after('parent_id');
            $table->foreign('parent_id')->references('id')->on('corpo_diretivo')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('corpo_diretivo', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'nivel']);
        });
    }
};
