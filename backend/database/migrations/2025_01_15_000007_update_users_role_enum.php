<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Alterar o enum da coluna role para incluir 'medico'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'gestor', 'atendente', 'medico') DEFAULT 'atendente'");
    }

    public function down(): void
    {
        // Reverter para o enum anterior (sem 'medico')
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'gestor', 'atendente') DEFAULT 'atendente'");
    }
};

