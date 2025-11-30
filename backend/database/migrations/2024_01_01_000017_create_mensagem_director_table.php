<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mensagem_director', function (Blueprint $table) {
            $table->id();
            $table->string('director_name');
            $table->text('message');
            $table->string('image')->nullable();
            $table->boolean('published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mensagem_director');
    }
};

