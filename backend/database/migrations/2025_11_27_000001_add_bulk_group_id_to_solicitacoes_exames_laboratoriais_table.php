<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solicitacoes_exames_laboratoriais', function (Blueprint $table) {
            $table->string('bulk_group_id')->nullable()->after('id');
            $table->index('bulk_group_id');
        });
    }

    public function down(): void
    {
        Schema::table('solicitacoes_exames_laboratoriais', function (Blueprint $table) {
            $table->dropIndex(['bulk_group_id']);
            $table->dropColumn('bulk_group_id');
        });
    }
};

